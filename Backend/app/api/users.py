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