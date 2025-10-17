from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from uuid import UUID, uuid4
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core import model, schemas
from app.core.auth import get_current_user


router = APIRouter(prefix="/routs")
db_dependency = Annotated[Session, Depends(get_db)]


@router.get("/", response_model=List[schemas.route], status_code=status.HTTP_200_OK)
def get_all_routes(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    routes = db.query(model.Routes).all()
    if routes is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"routes not found."
        )
    return routes

@router.get("/{route_id}", response_model=schemas.route, status_code=status.HTTP_200_OK)
def get_route_by_id(route_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    route = db.query(model.Routes).filter(model.Routes.route_id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail=f"Route {route_id} not found")
    return route

@router.post("/", response_model=schemas.route, status_code=status.HTTP_201_CREATED)
def create_route(route: schemas.route_create, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    # validate start/end stations exist
    start_station = db.query(model.RailwayStations).filter(model.RailwayStations.city_id == route.start_city_id).first()
    end_station = db.query(model.RailwayStations).filter(model.RailwayStations.city_id == route.end_city_id).first()
    if not start_station or not end_station:
        raise HTTPException(status_code=404, detail="Start or end station not found")

    new_route = model.Routes(
        store_id = route.store_id,
        start_city_id=route.start_city_id,
        end_city_id=route.end_city_id,
        distance=route.distance
    )
    db.add(new_route)
    db.commit()
    db.refresh(new_route)
    return new_route

@router.put("/{route_id}", response_model=schemas.route, status_code=status.HTTP_200_OK)
def update_route(route_id: str, route_update: schemas.route_update, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    route = db.query(model.Routes).filter(model.Routes.route_id == route_id).first()
    if not route:
        raise HTTPException(status_code=404, detail=f"Route {route_id} not found")

    update_data = route_update.model_dump(exclude_unset=True)
    update_data["route_id"] = route_id
    for key, value in update_data.items():
        setattr(route, key, value)

    db.commit()
    db.refresh(route)
    return route

@router.delete("/{route_id}", status_code=status.HTTP_200_OK)
def delete_route(route_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Assistant", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    

    route = db.query(model.Routes).filter(model.Routes.route_id == route_id).first()
    print(route)
    
    if not route:
        raise HTTPException(status_code=404, detail=f"Route {route_id} not found")

    db.delete(route)
    db.commit() 
    return {"detail": f"Route {route_id} deleted successfully"} 

