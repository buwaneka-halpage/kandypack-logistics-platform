from fastapi import APIRouter, Depends, status, HTTPException
from app.core.database import get_db, engine
import app.core.model as model
from typing import Annotated, List
from sqlalchemy.orm import Session
from app.core import model, schemas
from app.core.auth import get_current_user


router = APIRouter(prefix="/railway_stations")
model.Base.metadata.create_all(bind=engine)
db_dependency = Annotated[Session, Depends(get_db)]



@router.get("/",status_code=status.HTTP_200_OK,response_model=List[schemas.RailwayStation])
def get_all_railway_stations(db: db_dependency,current_user: dict = Depends(get_current_user) ):
    role = current_user.get("role")
    if role not in ["Management", "Assistant"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    stations = db.query(model.RailwayStations).all()
    return stations

@router.get("/railway_stations{station_id}",status_code=status.HTTP_200_OK)
def get_all_railway_station_by_station_id(db: db_dependency, station_id : str, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management", "Assistant"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    station = db.query(model.RailwayStations).filter(model.RailwayStations.station_id == station_id).first()

    if station is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Railway station with ID {station} not found."
        )
    return station