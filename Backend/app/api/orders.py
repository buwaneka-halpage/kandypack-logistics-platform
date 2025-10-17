from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from uuid import UUID, uuid4
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core import model, schemas
import pytz
from app.core.auth import get_current_user, get_current_customer

router = APIRouter(prefix="/orders")
db_dependency = Annotated[Session, Depends(get_db)]




@router.get("/", response_model=List[schemas.order], status_code=status.HTTP_200_OK)
def get_all_orders(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    orders = db.query(model.Orders).all()
    if role == "StoreManager":
        orders = db.query(model.Orders).all()
        return orders
    elif role == "Management":
        orders = db.query(model.Orders).all()
        return orders
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access orders"
        )




@router.get("/{order_id}", response_model=schemas.order, status_code=status.HTTP_200_OK)
def get_order(order_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
   
    role = current_user.get("role")
    if role not in ["StoreManager", "Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot Orders Routes"
        )
    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
    return order



@router.post("/", response_model=schemas.order, status_code=status.HTTP_201_CREATED)
def create_order(order: schemas.create_new_order, db: db_dependency, current_user: dict = Depends(get_current_customer)):
    role = current_user.get("role")
    if role not in ["Customer"]:
        raise HTTPException(status_code=403, detail="You do not have permission to create an order")

    #validate date 
    sl_tz = pytz.timezone("Asia/Colombo")
    now = datetime.now(sl_tz)
    order_date_obj = order.order_date
    if order_date_obj.tzinfo is None:
        order_date_obj = sl_tz.localize(order_date_obj)
    if order_date_obj < now + timedelta(days=7):
        raise HTTPException(
            status_code=400,
            detail="Order date must be at least 7 days from today."
        )
    customer = db.query(model.Customers).filter(model.Customers.customer_id == order.customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail=f"Customer {order.customer_id} not found")

    new_order = model.Orders(
        customer_id=order.customer_id,
        order_date=order.order_date,
        deliver_address=order.deliver_address,
        deliver_city_id=order.deliver_city_id,
        full_price=order.full_price
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    return new_order



@router.put("/{order_id}", response_model=schemas.order, status_code=status.HTTP_200_OK)
def update_order(order_id: str, order_update: schemas.update_order, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(status_code=403, detail="You do not have permission to update this order")

    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    update_data = order_update.model_dump(exclude_unset=True)
    if "status" in update_data:
        update_data["status"] = update_data["status"].value
    if "order_date" in update_data:
        #validate date 
        sl_tz = pytz.timezone("Asia/Colombo")
        now = datetime.now(sl_tz)
        order_date_obj = order.order_date
        if order_date_obj.tzinfo is None:
            order_date_obj = sl_tz.localize(order_date_obj)
        # order_date_obj = datetime.fromisoformat(update_data["order_date"])
        if order_date_obj < now + timedelta(days=7):
            raise HTTPException(status_code=400, detail="order_date must be at least 7 days from today")
    update_data["order_id"] = order_id
    for key, value in update_data.items():
        setattr(order, key, value)

    db.commit()
    db.refresh(order)
    return order



@router.delete("/{order_id}", status_code=status.HTTP_200_OK)
def delete_order(order_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "Management":
        raise HTTPException(status_code=403, detail="Only Management can delete orders")

    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    db.delete(order)
    db.commit()
    return {"detail": f"Order {order_id} deleted successfully"}
