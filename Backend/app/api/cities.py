from fastapi import APIRouter, Depends, status, HTTPException
from app.core.database import get_db, engine
import app.core.model as model
from typing import Annotated, List
from sqlalchemy.orm import Session
from app.core import model, schemas
from app.core.auth import get_current_user


router = APIRouter(prefix="/cities")
model.Base.metadata.create_all(bind=engine)
db_dependency = Annotated[Session, Depends(get_db)]



@router.get("/", status_code=status.HTTP_200_OK,response_model=List[schemas.City])
def get_all_cities(db: db_dependency,  current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["StoreManager", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    cities = db.query(model.Cities).all()
    return cities

@router.get("/cities/{city_id}", status_code=status.HTTP_200_OK)
def get_city_by_id(db: db_dependency, city_id : str,  current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["StoreManager", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    city = db.query(model.Cities).filter(model.Cities.city_id == city_id).first()
    if city is None:
        raise HTTPException(
            status_code= status.HTTP_204_NO_CONTENT,
            detail= f"city with ID {city_id} not found "
        )
    return city 
    

