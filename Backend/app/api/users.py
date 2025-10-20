from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from sqlalchemy.orm import Session
from typing import Annotated, List
from app.core.database import get_db, engine
from app.core import model, schemas

from pydantic import BaseModel
from fastapi import Security

from app.core.auth import (
    verify_password,
    create_access_token,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    require_management,
    get_current_user,
)

router = APIRouter(prefix="/users")
model.Base.metadata.create_all(bind=engine)
db_dependency = Annotated[Session, Depends(get_db)]

class TextIn(BaseModel):
    text: str

@router.post("/strtopass")
async def str_to_pass(payload: TextIn):
    """Convert given string to its hashed password form (Management role required)"""
    hashed = get_password_hash(payload.text)
    return {"hash": hashed}


@router.post("/login")
async def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate user and return JWT token"""
    user = db.query(model.Users).filter(model.Users.user_name == form_data.username).first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": user.user_id, "role": user.role}, expires_delta=access_token_expires)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.user_id, 
        "username": user.user_name,
        "role": user.role,
    }


@router.post("/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: schemas.UserCreate, db: db_dependency, current_user: dict = Security(require_management)):
    """Create a new user (Management role required)"""
    # Check if username already exists
    existing_user = db.query(model.Users).filter(model.Users.user_name == user.user_name).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")

    # Hash the password
    hashed_password = get_password_hash(user.password)

    # Create new user
    new_user = model.Users(user_name=user.user_name, password_hash=hashed_password, role=user.role)

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/", response_model=List[schemas.UserResponse])
async def get_all_users(db: db_dependency, current_user: dict = Security(get_current_user)):
    """Get all users (requires authentication)"""
    users = db.query(model.Users).all()
    return users


@router.get("/store-managers/list", response_model=List[schemas.UserResponse])
async def get_store_managers(db: db_dependency, current_user: dict = Security(get_current_user)):
    """Get all users with StoreManager role for warehouse assignment"""
    store_managers = db.query(model.Users).filter(
        model.Users.role == "StoreManager"
    ).all()
    return store_managers


@router.get("/{user_id}", response_model=schemas.UserResponse)
async def get_user(user_id: str, db: db_dependency, current_user: dict = Security(get_current_user)):
    """Get a specific user by ID (requires authentication)"""
    user = db.query(model.Users).filter(model.Users.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.put("/{user_id}", response_model=schemas.UserResponse)
async def update_user(user_id: str, user_update: schemas.UserUpdate, db: db_dependency, current_user: dict = Security(require_management)):
    """Update a user (Management role required)"""
    user = db.query(model.Users).filter(model.Users.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    # Update fields
    if user_update.user_name is not None:
        # Check if new username already exists
        existing = db.query(model.Users).filter(
            model.Users.user_name == user_update.user_name,
            model.Users.user_id != user_id
        ).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists")
        user.user_name = user_update.user_name
    
    if user_update.password is not None:
        user.password_hash = get_password_hash(user_update.password)
    
    if user_update.role is not None:
        user.role = user_update.role
    
    try:
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, db: db_dependency, current_user: dict = Security(require_management)):
    """Delete a user (Management role required)"""
    user = db.query(model.Users).filter(model.Users.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    try:
        db.delete(user)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))