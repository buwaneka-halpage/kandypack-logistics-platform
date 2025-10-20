from fastapi import APIRouter, Depends, status, HTTPException
from app.core.database import get_db, engine
import app.core.model as model
from typing import Annotated, List
from sqlalchemy.orm import Session
from app.core import model, schemas
from app.core.auth import get_current_user, check_role_permission


router = APIRouter(prefix="/trucks")
model.Base.metadata.create_all(bind=engine)
db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/",status_code=status.HTTP_200_OK,response_model=List[schemas.Trucks])
def get_all_trucks(db: db_dependency,  current_user: dict = Depends(get_current_user)):
    """Get all trucks (SystemAdmin, Management, Assistant can view)"""
    role = current_user.get("role")
   
    # Allow SystemAdmin, Management, and Assistant roles
    if not check_role_permission(role, ["Assistant", "Management", "StoreManager", "Driver"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view trucks"
        )
    
    trucks = db.query(model.Trucks).all()
    
    # Return empty list instead of 404 if no trucks found
    return trucks if trucks else []

@router.get("/available",status_code=status.HTTP_200_OK,response_model=List[schemas.Trucks])
def get_available_trucks(db: db_dependency, current_user: dict = Depends(get_current_user)):
    """Get all available (is_active=True) trucks"""
    role = current_user.get("role")
   
    if not check_role_permission(role, ["Assistant", "Management", "StoreManager", "Driver"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have permission to view trucks"
        )
    
    trucks = db.query(model.Trucks).filter(model.Trucks.is_active == True).all()
    
    # Return empty list instead of 404 if no available trucks found
    return trucks if trucks else []
@router.put("/{truck_id}", status_code=status.HTTP_200_OK, response_model=schemas.Trucks)
def update_truck(
    truck_id: str,
    truck_update: schemas.Trucks,
    db: db_dependency,
    current_user: dict = Depends(get_current_user),
    ):
    # Authorization
    if not check_role_permission(current_user.get("role"), ["Assistant", "Management"]):
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Assistant, Management or SystemAdmin role required"
        )

    # Fetch existing truck
    truck = db.query(model.Trucks).filter(model.Trucks.truck_id == truck_id).first()
    if not truck:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Truck Id {truck_id} not found"
        )

    # Apply updates (ignore truck_id if provided)
    update_data = truck_update.dict(exclude_unset=True)
    update_data.pop("truck_id", None)

    updated = False
    for key, value in update_data.items():
        if not hasattr(truck, key):
            continue
        current_value = getattr(truck, key)

        # If incoming value is None or equal to current, keep current value (no-op)
        if value is None or value == current_value:
            continue

        setattr(truck, key, value)
        updated = True

    if updated:
        db.add(truck)
        db.commit()
        db.refresh(truck)

    return truck


@router.delete("/{truck_id}", status_code=status.HTTP_200_OK)
def delete_truck(truck_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    # Check role
    if not check_role_permission(current_user.get("role"), ["Assistant", "Management"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Assistant, Management or SystemAdmin role required"
        )
    
    # Fetch the schedule
    truck = db.query(model.Trucks).filter(model.Trucks.truck_id == truck_id).first()
    if not truck: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck Id {truck_id} not found"
        )
    
    # Delete and commit
    db.delete(truck)
    db.commit()
    
    return {"detail": f"Truck {truck_id} deleted successfully"}