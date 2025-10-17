from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from typing import Annotated, List
from app.core.database import get_db
from app.core import model, schemas
from app.core.auth import get_current_user

router = APIRouter(prefix="/drivers")
db_dependency = Annotated[Session, Depends(get_db)]



@router.get("/", response_model=List[schemas.DriverResponse], status_code=status.HTTP_200_OK)
async def get_all_drivers(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Get all drivers (Management role required)"""
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Drivers"
        )
    drivers = db.query(model.Drivers).all()
    if drivers is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"routes not found."
        )
    return drivers

@router.get("/{driver_id}", response_model=schemas.DriverResponse, status_code=status.HTTP_200_OK)
async def get_driver(
    driver_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Get details of a specific driver"""
    # Allow access if user is Management or is the driver themselves
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Drivers"
        )
    driver = db.query(model.Drivers).filter(model.Drivers.driver_id == driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    
    return driver

@router.post("/", response_model=schemas.DriverResponse, status_code=status.HTTP_201_CREATED)
async def create_driver(
    driver: schemas.DriverCreate,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Create a new driver (Management role required)"""
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    # Check if user exists and has Driver role
    user = db.query(model.Users).filter(model.Users.user_id == driver.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {driver.user_id} not found"
        )
    
    # Check if user is already a driver
    existing_driver = db.query(model.Drivers).filter(model.Drivers.user_id == driver.user_id).first()
    if existing_driver:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"User {driver.user_id} is already registered as a driver"
        )
    
    # Create new driver
    try:
        new_driver = model.Drivers(
            name=driver.name,
            weekly_working_hours=0,  # Initialize with 0 hours
            user_id=driver.user_id
        )
        
        db.add(new_driver)
        db.commit()
        db.refresh(new_driver)
        return new_driver
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{driver_id}", response_model=schemas.DriverResponse, status_code=status.HTTP_200_OK)
async def update_driver(
    driver_id: str,
    driver_update: schemas.DriverUpdate,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Update driver details (Management role required)"""
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    # Check if driver exists
    driver = db.query(model.Drivers).filter(model.Drivers.driver_id == driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    
    try:
        # Update name if provided
        if driver_update.name is not None:
            driver.name = driver_update.name
        
        current_working_hours = driver.weekly_working_hours
        additional_working_hours = driver.weekly_working_hours
        total_working_hours = current_working_hours + additional_working_hours
        # Update weekly working hours if provided
        if driver_update.weekly_working_hours is not None:
            if not (0 <= total_working_hours<= 40):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Total working hours must be between 0 and 40"
                )
            driver.weekly_working_hours = total_working_hours
        else:
             raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Additional Weekly working hours must be greater than 0 "
                )

        
        db.commit()
        db.refresh(driver)
        return driver
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{driver_id}", status_code=status.HTTP_200_OK)
async def delete_driver(
    driver_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Delete a driver (Management role required)"""
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Drivers"
        )
    
    # Check if driver exists
    driver = db.query(model.Drivers).filter(model.Drivers.driver_id == driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driver with ID {driver_id} not found"
        )
    
    # Check if driver has any active schedules
    active_schedules = db.query(model.TruckSchedules).filter(
        model.TruckSchedules.driver_id == driver_id,
        model.TruckSchedules.status.in_([model.ScheduleStatus.PLANNED, model.ScheduleStatus.IN_PROGRESS])
    ).first()
    
    if active_schedules:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete driver with active schedules"
        )
    
    try:
        db.delete(driver)
        db.commit()
        return {"detail": f"Driver {driver_id} deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
