from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List, Union, Literal
from datetime import datetime, timedelta, date
from app.core.database import get_db
from app.core import model, schemas
import pytz
from enum import Enum
from app.core.auth import get_current_user

router = APIRouter(prefix="/allocations")
db_dependency = Annotated[Session, Depends(get_db)]

class AllocationType(str, Enum):
    RAIL = "Rail"
    TRUCK = "Truck"


@router.get("/", status_code=status.HTTP_200_OK)
def get_all_allocations(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Get all allocations (both rail and truck)"""
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )

    # Get both rail and truck allocations
    rail_allocations = db.query(model.RailAllocations).all()
    truck_allocations = db.query(model.TruckAllocations).all()

    # Combine and format the allocations
    allocations = []
    
    for rail in rail_allocations:
        allocations.append({
            "allocation_id": rail.allocation_id,
            "order_id": rail.order_id,
            "schedule_id": rail.schedule_id,
            "shipment_date": rail.shipment_date,
            "status": rail.status.value,
            "allocation_type": "Rail"
        })
    
    for truck in truck_allocations:
        allocations.append({
            "allocation_id": truck.allocation_id,
            "order_id": truck.order_id,
            "schedule_id": truck.schedule_id,
            "shipment_date": truck.shipment_date,
            "status": truck.status.value,
            "allocation_type": "Truck"
        })

    return allocations

@router.get("/{allocation_id}", status_code=status.HTTP_200_OK)
def get_allocation_by_id(
    allocation_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific allocation by ID"""
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )

    # Try to find in rail allocations first
    rail_allocation = db.query(model.RailAllocations).filter(
        model.RailAllocations.allocation_id == allocation_id
    ).first()

    if rail_allocation:
        return {
            "allocation_id": rail_allocation.allocation_id,
            "order_id": rail_allocation.order_id,
            "schedule_id": rail_allocation.schedule_id,
            "shipment_date": rail_allocation.shipment_date,
            "status": rail_allocation.status.value,
            "allocation_type": "Rail"
        }

    # If not found in rail, try truck allocations
    truck_allocation = db.query(model.TruckAllocations).filter(
        model.TruckAllocations.allocation_id == allocation_id
    ).first()

    if truck_allocation:
        return {
            "allocation_id": truck_allocation.allocation_id,
            "order_id": truck_allocation.order_id,
            "schedule_id": truck_allocation.schedule_id,
            "shipment_date": truck_allocation.shipment_date,
            "status": truck_allocation.status.value,
            "allocation_type": "Truck"
        }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Allocation with ID {allocation_id} not found"
    )

@router.post("/", status_code=status.HTTP_201_CREATED)
def create_allocation(
    order_id: str,
    schedule_id: str,
    allocation_type: AllocationType,
    shipment_date: date,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Create a new allocation"""
    role = current_user.get("role")
    if role not in ["Assistant"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )

    # Validate order exists
    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Order with ID {order_id} not found"
        )

    # Check shipment date
    if shipment_date < date.today():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Shipment date cannot be in the past"
        )

    try:
        if allocation_type == AllocationType.RAIL:
            # Validate train schedule exists
            schedule = db.query(model.TrainSchedules).filter(
                model.TrainSchedules.schedule_id == schedule_id
            ).first()
            if not schedule:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Train schedule with ID {schedule_id} not found"
                )

            allocation = model.RailAllocations(
                order_id=order_id,
                schedule_id=schedule_id,
                shipment_date=shipment_date,
                status=model.ScheduleStatus.PLANNED
            )
        else:
            # Validate truck schedule exists
            schedule = db.query(model.TruckSchedules).filter(
                model.TruckSchedules.schedule_id == schedule_id
            ).first()
            if not schedule:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Truck schedule with ID {schedule_id} not found"
                )

            allocation = model.TruckAllocations(
                order_id=order_id,
                schedule_id=schedule_id,
                shipment_date=shipment_date,
                status=model.ScheduleStatus.PLANNED
            )

        db.add(allocation)
        db.commit()
        db.refresh(allocation)

        return {
            "allocation_id": allocation.allocation_id,
            "order_id": allocation.order_id,
            "schedule_id": allocation.schedule_id,
            "shipment_date": allocation.shipment_date,
            "status": allocation.status.value,
            "allocation_type": allocation_type.value
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{allocation_id}", status_code=status.HTTP_200_OK)
def update_allocation(
    allocation_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user),
    shipment_date: date = None,
    status: model.ScheduleStatus = None
):
    """Update an allocation"""
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Allocations"
        )
    # Try to find and update in rail allocations first
    rail_allocation = db.query(model.RailAllocations).filter(
        model.RailAllocations.allocation_id == allocation_id
    ).first()

    if rail_allocation:
        allocation = rail_allocation
        allocation_type = "Rail"
    else:
        # If not found in rail, try truck allocations
        truck_allocation = db.query(model.TruckAllocations).filter(
            model.TruckAllocations.allocation_id == allocation_id
        ).first()
        if truck_allocation:
            allocation = truck_allocation
            allocation_type = "Truck"
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocation with ID {allocation_id} not found"
            )

    try:
        if shipment_date:
            if shipment_date < date.today():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Shipment date cannot be in the past"
                )
            allocation.shipment_date = shipment_date

        if status:
            allocation.status = status

        db.commit()
        db.refresh(allocation)

        return {
            "allocation_id": allocation.allocation_id,
            "order_id": allocation.order_id,
            "schedule_id": allocation.schedule_id,
            "shipment_date": allocation.shipment_date,
            "status": allocation.status.value,
            "allocation_type": allocation_type
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{allocation_id}", status_code=status.HTTP_200_OK)
def delete_allocation(
    allocation_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Delete an allocation"""
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )

    # Try to find and delete in rail allocations first
    rail_allocation = db.query(model.RailAllocations).filter(
        model.RailAllocations.allocation_id == allocation_id
    ).first()

    if rail_allocation:
        allocation = rail_allocation
    else:
        # If not found in rail, try truck allocations
        truck_allocation = db.query(model.TruckAllocations).filter(
            model.TruckAllocations.allocation_id == allocation_id
        ).first()
        if truck_allocation:
            allocation = truck_allocation
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Allocation with ID {allocation_id} not found"
            )

    try:
        db.delete(allocation)
        db.commit()
        return {"detail": f"Allocation {allocation_id} deleted successfully"}

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
