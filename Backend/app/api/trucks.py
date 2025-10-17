from fastapi import APIRouter, Depends, status, HTTPException
from app.core.database import get_db, engine
import app.core.model as model
from typing import Annotated, List
from sqlalchemy.orm import Session
from app.core import model, schemas
from app.core.auth import get_current_user


router = APIRouter(prefix="/turks")
model.Base.metadata.create_all(bind=engine)
db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/",status_code=status.HTTP_200_OK,response_model=List[schemas.Trucks])
def get_all_turks(db: db_dependency,  current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
   
    if role not in [ "Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view Trucks"
        )
    trucks = db.query(model.Trucks).all()
    if not trucks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No trucks found."
        )
    return trucks

@router.get("/available",status_code=status.HTTP_200_OK,response_model=List[schemas.Trucks])
def get_available_trucks(db: db_dependency, current_user: dict = Depends(get_current_user) ):
    role = current_user.get("role")
   
    if role not in  ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view Trucks"
        )
    trucks = db.query(model.Trucks).filter(model.Trucks.is_active == True).all()
    if not trucks:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No Available trucks found."
        )
    return trucks
@router.put("/{truck_id}", status_code=status.HTTP_200_OK, response_model=schemas.Trucks)
def update_truck(
    truck_id: str,
    truck_update: schemas.Trucks,
    db: db_dependency,
    current_user: dict = Depends(get_current_user),
    ):
    # Authorization
    if current_user.get("role") not in ["Assistant", "Management"]:
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Only Management and Assistant can update trucks"
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
    if current_user.get("role") not in  [ "Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Management and assistant can update truck schedules"
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