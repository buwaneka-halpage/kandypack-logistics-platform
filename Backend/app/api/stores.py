from fastapi import APIRouter, Depends, status, HTTPException
from app.core.database import get_db, engine
import app.core.model as model
from typing import Annotated, List
from sqlalchemy.orm import Session
from app.core import model, schemas
from app.core.auth import get_current_user

router = APIRouter(prefix="/stores")
model.Base.metadata.create_all(bind=engine)
db_dependency = Annotated[Session, Depends(get_db)]

@router.get("/", status_code=status.HTTP_200_OK,response_model=List[schemas.store])
def get_all_stores(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["WarehouseStaff", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Stores"
        )
    stores = db.query(model.Stores).all()
    if stores is None :
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"stores not found."
        )
    return stores

@router.get("/stores{store_id}", status_code=status.HTTP_200_OK)
def get_store_by_id(db: db_dependency, store_id: str,  current_user: dict = Depends(get_current_user) ):
    role = current_user.get("role")
    if role not in ["WarehouseStaff", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Stores"
        )
    
    store = db.query(model.Stores).filter(model.Stores.store_id == store_id).first()
    if store is None :
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"store with ID {store_id} not found."
        )
    return store


@router.post("/", status_code=status.HTTP_200_OK, response_model=schemas.store)
def create_store(store: schemas.StoreCreate, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["WarehouseStaff", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Stores"
        )
    station = db.query(model.RailwayStations).filter(model.RailwayStations.station_id == store.station_id).first()
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station with ID {store.station_id} does not exist."
        )
    new_store = model.Stores(
        name=store.name,
        telephone_number=store.telephone_number,
        address=store.address,
        contact_person=store.contact_person,
        station_id=store.station_id
    )
    db.add(new_store)
    db.commit()
    db.refresh(new_store)
    return new_store


@router.put("/{store_id}", status_code=status.HTTP_200_OK)
def update_store(store_id: str , store_update: schemas.StoreUpdate, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["WarehouseStaff", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Stores"
        )
    store = db.query(model.Stores).filter(model.Stores.store_id == store_id).first()
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Store with ID {store_id} not found."
        )
    update_data = store_update.model_dump(exclude_unset=True)
    if "station_id" in update_data:
        station_id_str = str(update_data["station_id"])
        
        station = db.query(model.RailwayStations).filter(model.RailwayStations.station_id == station_id_str).first()
        if not station:
            raise HTTPException(status_code=404, detail=f"Station {station_id_str} not found")
        update_data["station_id"] = station_id_str
    
    for key, value in update_data.items():
        setattr(store, key, value)

    db.commit()
    db.refresh(store)
    return store

@router.delete("/{store_id}", status_code=status.HTTP_200_OK)
def delete_store(store_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):

    role = current_user.get("role")
    if role not in ["WarehouseStaff", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Stores"
        )
    store = db.query(model.Stores).filter(model.Stores.store_id == store_id).first()
    if not store:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Store with ID {store_id} not found."
        )
    
    db.delete(store)
    db.commit()
    return {"detail": f"Store with ID {store_id} has been deleted successfully."}
