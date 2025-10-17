from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from uuid import UUID, uuid4
from datetime import datetime, timedelta, date , time 
from app.core.database import get_db
from app.core import model, schemas
import pytz
from app.core.auth import get_current_user

router = APIRouter(prefix="/trainSchedules")
db_dependency = Annotated[Session, Depends(get_db)]



# def get_current_user():
#     return {"username": "admin", "role": "Management", "store_id": "store123"}



@router.get("/", response_model=List[schemas.Train_Schedules], status_code=status.HTTP_200_OK)
def get_all_train_Schedules(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["StoreManager", "Management", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Schedules"
        )
    schedules  = db.query(model.TrainSchedules).all()
    schedules_list = []
    for schedule in schedules:
        schedules_list.append({
            "schedule_id": schedule.schedule_id,
            "train_id": schedule.train_id,
            "station_id": schedule.station_id,
            "scheduled_date": schedule.scheduled_date,  # keep as datetime
            "departure_time": schedule.departure_time,  # keep as time
            "arrival_time": schedule.arrival_time,      # keep as time
            "status": schedule.status.value             # enum -> string
        })
    
    return schedules_list


@router.get("/{scheduled_id}", response_model=schemas.Train_Schedules, status_code=status.HTTP_200_OK)
def get_train_schedule_by_scheduled_id(scheduled_id : str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["StoreManager", "Management", "Admin", "Assistant"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Schedules"
        )
    
    schedules = db.query(model.TrainSchedules).filter(model.TrainSchedules.schedule_id == scheduled_id).first()
    schedules.status = schedules.status.value
    if not schedules:
        raise HTTPException(status_code=404, detail=f"scheduled id {scheduled_id} not found")
    
    return schedules

@router.post("/", response_model=schemas.Train_Schedules, status_code=status.HTTP_200_OK)
def create_new_train_schedule( new_train_schedule: schemas.create_new_trainSchedule, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["StoreManager", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Schedules"
        )
    #validate date 
    sl_tz = pytz.timezone("Asia/Colombo")
    now = datetime.now(sl_tz)
    scheduled_date_obj = new_train_schedule.scheduled_date
    if scheduled_date_obj.tzinfo is None:
        scheduled_date_obj = sl_tz.localize(scheduled_date_obj)
    if scheduled_date_obj< now + timedelta(days=7):
        raise HTTPException(
            status_code=400,
            detail="Order date must be at least 7 days from today."
        )
    new_train_schedule = model.TrainSchedules(
        train_id =  new_train_schedule.train_id ,
        station_id = new_train_schedule.station_id,
        scheduled_date = new_train_schedule.scheduled_date,
        departure_time = new_train_schedule.departure_time, 
        arrival_time = new_train_schedule.arrival_time,
        status = new_train_schedule.status
        ) 
    db.add(new_train_schedule)
    db.commit()
    db.refresh(new_train_schedule) 
    
    return new_train_schedule
    


@router.put("/{schedule_id}", response_model=schemas.Train_Schedules, status_code=status.HTTP_200_OK)
def update_train_schedule(schedule_id: str, update_data: schemas.update_trainSchedules, db: db_dependency, current_user: dict = Depends(get_current_user) ):
    role = current_user.get("role")
    if role != "Management":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Management can update train schedules."
        )
    train_schedule = db.query(model.TrainSchedules).filter(model.TrainSchedules.schedule_id == schedule_id).first()
    if not train_schedule:
        raise HTTPException(status_code=404, detail=f"Schedule {schedule_id} not found")
    data_to_update = update_data.model_dump(exclude_unset=True)

    if "scheduled_date" in data_to_update:
        sl_tz = pytz.timezone("Asia/Colombo")
        now = datetime.now(sl_tz)

        scheduled_date_obj = data_to_update["scheduled_date"]
        if scheduled_date_obj.tzinfo is None:
            scheduled_date_obj = sl_tz.localize(scheduled_date_obj)

        if scheduled_date_obj < now + timedelta(days=7):
            raise HTTPException(
                status_code=400,
                detail="Scheduled date must be at least 7 days from today."
            )

    
    for key, value in data_to_update.items():
        setattr(train_schedule, key, value)

    db.commit()
    db.refresh(train_schedule)
    return train_schedule

    
@router.delete("/{schedule_id}", status_code=status.HTTP_200_OK)
def delete_train_schedule(schedule_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):

    role = current_user.get("role")
    if role not in ["StoreManager", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete schedules"
        )

    
    train_schedule = db.query(model.TrainSchedules).filter(
        model.TrainSchedules.schedule_id == schedule_id
    ).first()

    if not train_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Train schedule with ID {schedule_id} not found"
        )

    
    db.delete(train_schedule)
    db.commit()

    return {"message": f"Train schedule with ID {schedule_id} deleted successfully"}
