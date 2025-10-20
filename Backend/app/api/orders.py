from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Annotated, List
from uuid import UUID, uuid4
from datetime import datetime, timedelta
from app.core.database import get_db
from app.core import model, schemas
import pytz
from app.core.auth import get_current_user, get_current_customer, check_role_permission

router = APIRouter(prefix="/orders")
db_dependency = Annotated[Session, Depends(get_db)]




@router.get("/history", status_code=status.HTTP_200_OK)
def get_all_orders_history(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if not check_role_permission(role, ["StoreManager", "Management"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="StoreManager, Management or SystemAdmin role required"
        )

    # join Orders with Customers to get customer name alongside order fields
    rows = (
        db.query(model.Orders, model.Customers)
        .join(model.Customers, model.Orders.customer_id == model.Customers.customer_id)
        .all()
    )

    results = []
    for order, customer in rows:
        customer_name = getattr(customer, "customer_name", None) or getattr(customer, "name", None) or ""
        results.append({
            "order_id": order.order_id,
            "customer_name": customer_name,
            "order_date": order.order_date,
            "deliver_address": order.deliver_address,
            "state": order.status
        })

    return results

@router.get("/my-orders", response_model=List[schemas.order], status_code=status.HTTP_200_OK)
def get_customer_orders(db: db_dependency, current_user: dict = Depends(get_current_customer)):
    """Get orders for the currently logged-in customer"""
    customer_id = current_user.get("user_id")
    
    orders = db.query(model.Orders).filter(
        model.Orders.customer_id == customer_id
    ).all()
    
    # Convert enum status to string value
    for order in orders:
        if isinstance(order.status, model.OrderStatus):
            order.status = order.status.value
    
    return orders


@router.get("/", response_model=List[schemas.order], status_code=status.HTTP_200_OK)
def get_all_Orders(db: db_dependency,  current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if not check_role_permission(role, ["StoreManager", "Management"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="StoreManager, Management or SystemAdmin role required"
        )
    
    orders_= db.query(model.Orders).all()
    if orders_ is None:
        raise HTTPException(status_code=404, detail=f"Order history not found")
    
    # Convert enum status to string value
    for order in orders_:
        if isinstance(order.status, model.OrderStatus):
            order.status = order.status.value
    
    return orders_
    
@router.get("/last-mile-delivery", status_code=status.HTTP_200_OK)
def get_last_mile_delivery(db: db_dependency, current_user: dict = Depends(get_current_user)):
    """Get last mile delivery information based on user role"""
    role = current_user.get("role")
    user_id = current_user.get("user_id")
    
    # Base query joining Orders and Customers
    query = (
        db.query(model.Orders, model.Customers)
        .join(model.Customers, model.Orders.customer_id == model.Customers.customer_id)
    )
    
    # Apply role-based filters
    if role == "Customer":
        # Customers can only see their own orders
        query = query.filter(model.Orders.customer_id == user_id)
    elif role in ["Management", "SystemAdmin"]:
        # Management and SystemAdmin can see all orders
        pass
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to Customers, Management, or SystemAdmin"
        )
    
    # Get only orders that are out for delivery or delivered recently
    query = query.filter(
        model.Orders.status.in_([
            model.OrderStatus.SCHEDULED_ROAD,
            model.OrderStatus.DELIVERED,
            model.OrderStatus.IN_WAREHOUSE,
            model.OrderStatus.SCHEDULED_RAIL,
            model.OrderStatus.FAILED,
            model.OrderStatus.PLACED
        ])
    )
    
    orders = query.all()
    results = []
    for order, customer in orders:
        # Convert enum status to string value
        order_status = order.status.value if isinstance(order.status, model.OrderStatus) else order.status
        
        # Create response with required fields
        delivery_info = {
            "order_id": order.order_id,
            "status": order_status,
            "customer_name": customer.customer_name,
            "deliver_address": order.deliver_address,
            "order_date": order.order_date,
            "customer_phone": customer.phone_number
        }
        results.append(delivery_info)
    
    return results

@router.get("/{order_id}", response_model=schemas.order, status_code=status.HTTP_200_OK)
def get_order(order_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
   
    role = current_user.get("role")
    if not check_role_permission(role, ["StoreManager", "Management"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="StoreManager, Management or SystemAdmin role required"
        )
    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
    
    # Convert enum status to string value
    if isinstance(order.status, model.OrderStatus):
        order.status = order.status.value
    
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
    if not check_role_permission(role, ["Management"]):
        raise HTTPException(status_code=403, detail="Management or SystemAdmin role required")

    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    update_data = order_update.model_dump(exclude_unset=True)
    if "status" in update_data:
        update_data["status"] = update_data["status"].value
    if "order_date" in update_data:
        # Only validate date if it's actually being changed
        new_order_date = update_data["order_date"]
        existing_order_date = order.order_date.date() if hasattr(order.order_date, 'date') else order.order_date
        
        if new_order_date != existing_order_date:
            # Validate that the NEW date is at least 7 days in the future
            sl_tz = pytz.timezone("Asia/Colombo")
            now = datetime.now(sl_tz)
            new_date_obj = datetime.combine(new_order_date, datetime.min.time())
            new_date_obj = sl_tz.localize(new_date_obj)
            
            if new_date_obj < now + timedelta(days=7):
                raise HTTPException(status_code=400, detail="order_date must be at least 7 days from today")
    update_data["order_id"] = order_id
    for key, value in update_data.items():
        setattr(order, key, value)

    db.commit()
    db.refresh(order)
    return order



@router.delete("/{order_id}", status_code=status.HTTP_200_OK)
def delete_order(order_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if not check_role_permission(role, ["Management"]):
        raise HTTPException(status_code=403, detail="Management or SystemAdmin role required")

    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    db.delete(order)
    db.commit()
    return {"detail": f"Order {order_id} deleted successfully"}


@router.patch("/{order_id}/assign-warehouse", response_model=schemas.order, status_code=status.HTTP_200_OK)
def assign_order_to_warehouse(order_id: str, warehouse_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    """Assign an order to a warehouse (Management or SystemAdmin role required)"""
    role = current_user.get("role")
    if not check_role_permission(role, ["Management"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Management or SystemAdmin role required"
        )
    
    # Verify order exists
    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
    
    # Verify warehouse exists
    warehouse = db.query(model.Stores).filter(model.Stores.store_id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse {warehouse_id} not found")
    
    # Assign warehouse to order
    order.warehouse_id = warehouse_id
    
    # If order was PLACED, update status to IN_WAREHOUSE
    if order.status == model.OrderStatus.PLACED:
        order.status = model.OrderStatus.IN_WAREHOUSE
    
    db.commit()
    db.refresh(order)
    return order


@router.get("/{order_id}/space", status_code=status.HTTP_200_OK)
def get_order_space(
    order_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Calculate the space consumption for an order"""
    role = current_user.get("role")
    if not check_role_permission(role, ["StoreManager", "Management"]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )
    
    # Import capacity calculator
    from app.utils.capacity_calculator import calculate_order_space
    
    try:
        space = calculate_order_space(db, order_id)
        return {
            "order_id": order_id,
            "space": space
        }
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )