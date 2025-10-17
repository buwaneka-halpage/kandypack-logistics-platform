from fastapi import APIRouter, Depends, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.core.database import get_db, engine
import app.core.model as model
from typing import Annotated, List
from sqlalchemy.orm import Session
from app.core import model, schemas
from app.core.auth import (
    verify_password,
    create_access_token,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    require_management,
    get_current_customer,
    get_current_user
)
from datetime import timedelta

router = APIRouter(prefix="/customers")
model.Base.metadata.create_all(bind=engine)
db_dependency = Annotated[Session, Depends(get_db)]


@router.post("/login")
async def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    """Authenticate user and return JWT token"""
    customer = db.query(model.Customers).filter(model.Customers.customer_user_name == form_data.username).first()
    print(customer)
    if not customer or not verify_password(form_data.password, customer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(data={"sub": customer.customer_id, "role": "Customer"}, expires_delta=access_token_expires)

    return {
        "access_token": token,
        "token_type": "bearer",
        "customer_id": customer.customer_id, 
        "customer_user_name": customer.customer_user_name,
        "role": "Customer",
    }



@router.get("/", response_model=List[schemas.CustomerBase], status_code=status.HTTP_200_OK) 
async def get_all_customers(db: db_dependency, current_user: dict = Depends(get_current_user)):
    # check the role 
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Customers"
        )
    customers = db.query(model.Customers).all()
    if not customers:
        raise HTTPException(status_code=404, detail=f"Customers not found")
    return customers

@router.get("/{customer_id}", response_model=schemas.CustomerBase, status_code=status.HTTP_200_OK)
async def get_customer(customer_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access customers"
        )
    customer = db.query(model.Customers).filter(model.Customers.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")
    return customer

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_customer(customer: schemas.CustomerCreate, db: db_dependency, current_user: dict = Depends(get_current_user)):
    new_customer = model.Customers(
        customer_name=customer.customer_name,
        phone_number = customer.phone_number, 
        address = customer.address
    )
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return {"message": "Customer added successfully", "customer": new_customer}

@router.put("/{customer_id}", response_model=schemas.CustomerBase, status_code=status.HTTP_200_OK)
async def update_customer(customer_id: str, customer_update: schemas.customerUpdate, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access customers"
        )
    customer = db.query(model.Customers).filter(model.Customers.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")
    
    update_data = customer_update.model_dump(exclude_unset=True)
    
    update_data["customer_id"] = customer_id
    for key, value in update_data.items():
        setattr(customer, key, value)
    
    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/{customer_id}", status_code=status.HTTP_200_OK)
async def delete_customer(customer_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access customers"
        )
    customer = db.query(model.Customers).filter(model.Customers.customer_id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {customer_id} not found")
    
    db.delete(customer)
    db.commit()
    
    return {"detail": f"Customer {customer_id} deleted successfully"}


