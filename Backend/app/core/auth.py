import os
from datetime import datetime, timedelta
from typing import Union, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core import model  # uses your model.Users
from passlib.exc import UnknownHashError
import hashlib
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Security configuration (loaded from .env file)
SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Password hashing and OAuth2 scheme
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme_user = OAuth2PasswordBearer(tokenUrl="/users/login", scheme_name="users_auth")
oauth2_scheme_customer = OAuth2PasswordBearer(tokenUrl="/customers/login", scheme_name="customer_auth")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password"""
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except UnknownHashError:
        # Fallback for legacy raw SHA256 hex digests stored in DB
        try:
            candidate = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
            return candidate == (hashed_password or "")
        except Exception:
            return False

# def verify_password(plain_password: str, hashed_password: str) -> bool:
#     """
#     Primary: try passlib verify (supports pbkdf2_sha256).
#     Fallback: legacy unsalted SHA256 hex digests (in DB).
#     """
#     try:
#         return pwd_context.verify(plain_password, hashed_password)
#     except UnknownHashError:
#         # Legacy: raw SHA-256 hex digest
#         try:
#             candidate = hashlib.sha256(plain_password.encode("utf-8")).hexdigest()
#             return candidate == (hashed_password or "")
#         except Exception:
#             return False
        
def get_password_hash(password: str) -> str:
    """Generate a hash from a plain password"""
    
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy() 
    if expires_delta:
        expire = datetime.utcnow() + expires_delta  
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) 
    return encoded_jwt

def _get_user_by_id(db: Session, user_id: str):
    return db.query(model.Users).filter(model.Users.user_id == user_id).first() 

def _get_customer_by_id(db: Session, customer_id: str):
    return db.query(model.Customers).filter(model.Customers.customer_id == customer_id).first()
    

async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme_user)) -> Dict:
    """Get the current authenticated user from the JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = _get_user_by_id(db, user_id)
    if user is None:
        raise credentials_exception
    
    # Base user info
    user_data = {
        "user_id": user.user_id,
        "username": user.user_name,
        "role": user.role,
        "name": user.user_name
    }
    
    # For Store Managers, include warehouse assignment
    if user.role == "StoreManager":
        # Find the store where this user is the contact_person (store manager)
        assigned_store = db.query(model.Stores).filter(
            model.Stores.contact_person == user.user_id
        ).first()
        
        if assigned_store:
            user_data["warehouseId"] = assigned_store.store_id
            user_data["warehouseName"] = assigned_store.name
            
            # Optionally get city name for better display
            if assigned_store.station and assigned_store.station.city:
                city_name = assigned_store.station.city.city_name
                user_data["warehouseName"] = f"{city_name} Warehouse"
    
    return user_data

# get customer 
async def get_current_customer(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme_customer)) -> Dict:
    """Get the current authenticated user from the JWT token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, 
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        customer_id: str = payload.get("sub")
        if customer_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = _get_customer_by_id(db, customer_id)
    if user is None:
        raise credentials_exception
    # print(user.role)
    return {"user_id": user.customer_id, "username": user.customer_user_name, "role": "Customer"}

def require_management(current_user: Dict = Depends(get_current_user)) -> Dict:
    """Dependency that ensures the current user has role 'Management' or 'SystemAdmin'"""
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    role = (current_user.get("role") or "").strip()
    if role not in ["Management", "SystemAdmin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Management or SystemAdmin role required")
    return current_user

def is_admin_or_management(role: str) -> bool:
    """Check if role is SystemAdmin or Management (has full privileges)"""
    return role in ["SystemAdmin", "Management"]

def check_role_permission(current_role: str, allowed_roles: list) -> bool:
    """Check if current role has permission. SystemAdmin always has access."""
    if current_role == "SystemAdmin":
        return True
    return current_role in allowed_roles