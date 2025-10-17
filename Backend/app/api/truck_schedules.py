from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from uuid import UUID, uuid4
from datetime import datetime, timedelta, date , time 
from app.core.database import get_db
from app.core import model, schemas
import pytz
from sqlalchemy.orm import Session
from app.core.database import get_db

from app.core.auth import get_current_user



router = APIRouter(prefix="/truckSchedules")
db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/", response_model=List[schemas.Truck_Schedule], status_code=status.HTTP_200_OK)
def get_all_truck_schedules(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
   
    if role not in ["Assistant", "Management", "Driver", "WarehouseStaff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view truck schedules"
        )

    truck_schedules = db.query(model.TruckSchedules).all()

    if not truck_schedules:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No truck schedules found"
        )

    return truck_schedules

@router.get("/{schedule_id}", response_model=schemas.Truck_Schedule, status_code=status.HTTP_200_OK)
def get_truck_schedule_by_id( schedule_id: str,db: db_dependency, current_user: dict = Depends(get_current_user)):
    
    role = current_user.get("role")
    if role not in ["Assistant", "Management", "Driver", "WarehouseStaff"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this truck schedule"
        )

    
    truck_schedule = db.query(model.TruckSchedules).filter(model.TruckSchedules.schedule_id == schedule_id).first()
    if not truck_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck schedule with ID {schedule_id} not found"
        )

    return truck_schedule


@router.post("/", response_model=schemas.Truck_Schedule, status_code=status.HTTP_201_CREATED)
def create_truck_schedule(new_truck_schedule: schemas.Truck_Schedule, db: db_dependency, current_user: dict = Depends(get_current_user)):
    # Role check
    if current_user.get("role") != "Assistant":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Assistant can create truck schedules"
        )

    # Basic validations
    if not new_truck_schedule.departure_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Departure time is required"
        )

    sl_tz = pytz.timezone("Asia/Colombo")
    min_date = datetime.now(sl_tz).date() + timedelta(days=7)
    scheduled_date = new_truck_schedule.scheduled_date

    if scheduled_date < min_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Departure time must be at least 7 days from today"
        )

    # Ensure duration is an integer (minutes)
    if isinstance(new_truck_schedule.duration, time):
        duration_minutes = new_truck_schedule.duration.hour * 60 + new_truck_schedule.duration.minute
    else:
        duration_minutes = new_truck_schedule.duration

    # Validate foreign keys exist
    if new_truck_schedule.route_id:
        route = db.query(model.Routes).filter(model.Routes.route_id == new_truck_schedule.route_id).first()
        if not route:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Route with ID {new_truck_schedule.route_id} not found")

    if new_truck_schedule.truck_id:
        truck = db.query(model.Trucks).filter(model.Trucks.truck_id == new_truck_schedule.truck_id).first()
        if not truck:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Truck with ID {new_truck_schedule.truck_id} not found")

    if new_truck_schedule.driver_id:
        driver = db.query(model.Drivers).filter(model.Drivers.driver_id == new_truck_schedule.driver_id).first()
        if not driver:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Driver with ID {new_truck_schedule.driver_id} not found")

    if new_truck_schedule.assistant_id:
        assistant = db.query(model.Assistants).filter(model.Assistants.assistant_id == new_truck_schedule.assistant_id).first()
        if not assistant:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Assistant with ID {new_truck_schedule.assistant_id} not found")

    # # Driver and assistant cannot be the same person
    if new_truck_schedule.driver_id and new_truck_schedule.assistant_id and new_truck_schedule.driver_id == new_truck_schedule.assistant_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Driver and assistant cannot be the same person")

    # Build new schedule time window (timezone-aware)
    new_start = datetime.combine(scheduled_date, new_truck_schedule.departure_time)
    new_end = new_start + timedelta(minutes=duration_minutes)
   

    # Check for overlapping schedules on the same date
    existing_schedules = db.query(model.TruckSchedules).filter(model.TruckSchedules.scheduled_date == scheduled_date).all()
    # get the consecutive routes 
    if new_truck_schedule.assistant_id:
        # collect assistant's schedules on same date (exclude records missing time/duration)
        assistant_schedules = []
        for s in existing_schedules:
            if s.assistant_id != new_truck_schedule.assistant_id:
                continue
            if not s.departure_time or s.duration is None:
                continue
            # existing record duration may be stored as time or minutes
            if isinstance(s.duration, time):
                s_dur = s.duration.hour * 60 + s.duration.minute
            else:
                s_dur = s.duration
            s_start = datetime.combine(s.scheduled_date, s.departure_time)
            s_end = s_start + timedelta(minutes=s_dur)
            assistant_schedules.append((s_start, s_end))

        # include the new schedule
        assistant_schedules.append((new_start, new_end))

        # sort by start time and detect runs of consecutive/overlapping schedules
        assistant_schedules.sort(key=lambda x: x[0])
        run_count = 1
        prev_start, prev_end = assistant_schedules[0]
        for cur_start, cur_end in assistant_schedules[1:]:
            # consider schedules consecutive if they overlap or touch (no gap)
            if cur_start <= prev_end:
                run_count += 1
            else:
                run_count = 1
            # update the current window end for chaining overlaps
            prev_end = max(prev_end, cur_end)
            prev_start = cur_start
            if run_count > 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Assistant {new_truck_schedule.assistant_id} cannot be scheduled for more than two consecutive routes"
                )

    for s in existing_schedules:
        # Skip if missing time or duration in existing record
        if not s.departure_time or s.duration is None:
            continue

        exist_start = datetime.combine(s.scheduled_date, s.departure_time)
        exist_end = exist_start + timedelta(minutes=s.duration)

        # Overlap condition
        if exist_start < new_end and exist_end > new_start:
        
            # Driver conflict
            if new_truck_schedule.driver_id and s.driver_id == new_truck_schedule.driver_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Driver {new_truck_schedule.driver_id} has a conflicting schedule at {s.departure_time}")
            # Assistant conflict
            if new_truck_schedule.assistant_id and s.assistant_id == new_truck_schedule.assistant_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Assistant {new_truck_schedule.assistant_id} has a conflicting schedule at {s.departure_time}")
            # Truck conflict
            if new_truck_schedule.truck_id and s.truck_id == new_truck_schedule.truck_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Truck {new_truck_schedule.truck_id} is already scheduled at {s.departure_time}")
            # Route conflict (optional: prevent same route overlapping)
            if new_truck_schedule.route_id and s.route_id == new_truck_schedule.route_id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Route {new_truck_schedule.route_id} already has a schedule overlapping this time")

    # Create new truck schedule 
    truck_schedule = model.TruckSchedules(
        route_id=new_truck_schedule.route_id,
        truck_id=new_truck_schedule.truck_id,
        driver_id=new_truck_schedule.driver_id,
        assistant_id=new_truck_schedule.assistant_id,
        scheduled_date=new_truck_schedule.scheduled_date,
        departure_time=new_truck_schedule.departure_time,
        duration=duration_minutes,
        status=new_truck_schedule.status
    )

    try:
        db.add(truck_schedule)
        db.commit()
        db.refresh(truck_schedule)
        return truck_schedule
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.put("/{schedule_id}", response_model=schemas.Truck_Schedule, status_code=status.HTTP_200_OK)
def update_truck_schedule(schedule_id: str, update_data: schemas.Truck_Schedule, db: db_dependency, current_user: dict = Depends(get_current_user)):

    if current_user.get("role") not in  [ "Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Management and assistant can update truck schedules"
        )

    # Check if schedule exists
    truck_schedule = db.query(model.TruckSchedules).filter(model.TruckSchedules.schedule_id == schedule_id).first()
    if not truck_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck schedule {schedule_id} not found"
        )
    
    # Validate foreign keys
    if update_data.route_id:
        route = db.query(model.Routes).filter(model.Routes.route_id == update_data.route_id).first()
        if not route:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Route with ID {update_data.route_id} not found"
            )
    
    if update_data.truck_id:
        truck = db.query(model.Trucks).filter(model.Trucks.truck_id == update_data.truck_id).first()
        if not truck:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Truck with ID {update_data.truck_id} not found"
            )
    
    if update_data.driver_id:
        driver = db.query(model.Drivers).filter(model.Drivers.driver_id == update_data.driver_id).first()
        if not driver:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Driver with ID {update_data.driver_id} not found"
            )
    
    if update_data.assistant_id:
        assistant = db.query(model.Assistants).filter(model.Assistants.assistant_id == update_data.assistant_id).first()
        if not assistant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Assistant with ID {update_data.assistant_id} not found"
            )

    update_dict = update_data.model_dump(exclude_unset=True)

    # Convert status enum if necessary
    if "status" in update_dict:
        update_dict["status"] = update_dict["status"].value if hasattr(update_dict["status"], "value") else update_dict["status"]

    # Validate departure date (at least 7 days from now)
    if "scheduled_date" in update_dict:
        sl_tz = pytz.timezone("Asia/Colombo")
        min_date = datetime.now(sl_tz).date() + timedelta(days=7)
        scheduled_date = update_dict["scheduled_date"]
        if scheduled_date < min_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Scheduled date must be at least 7 days from today"
            )


    # Check if there are any existing allocations
    allocations = db.query(model.TruckAllocations).filter(
        model.TruckAllocations.schedule_id == schedule_id
    ).all()
    
    if allocations and truck_schedule.status != update_dict.get('status', truck_schedule.status):
        # Don't allow status changes if there are allocations
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot update schedule status while it has active allocations"
        )

    # Update fields
    for key, value in update_dict.items():
        setattr(truck_schedule, key, value)

    try:
        db.commit()
        db.refresh(truck_schedule)
        return truck_schedule
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )




@router.delete("/{schedule_id}", status_code=status.HTTP_200_OK)
def delete_truck_schedule(schedule_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    # Check role
    if current_user.get("role") not in  [ "Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Management and assistant can update truck schedules"
        )
    
    # Fetch the schedule
    truck_schedule = db.query(model.TruckSchedules).filter(model.TruckSchedules.schedule_id == schedule_id).first()
    if not truck_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Truck schedule {schedule_id} not found"
        )
    
    # Delete and commit
    db.delete(truck_schedule)
    db.commit()
    
    return {"detail": f"Truck schedule {schedule_id} deleted successfully"}
