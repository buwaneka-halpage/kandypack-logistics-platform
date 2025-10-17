# app/api/reports.py
from fastapi import APIRouter, Query, Depends, Security,  HTTPException, status
from typing import List
from app.core.auth import get_current_user, require_management
from app.utils.reports_procs import (
    quarterly_sales, top_items_by_quarter, sales_by_city,
    sales_by_route, driver_work_hours, assistant_work_hours,
    truck_usage_month, customer_order_history
)
from app.core.auth import get_current_user

router = APIRouter(prefix="/reports")

@router.get("/sales/quarterly")
def get_quarterly_sales(year: int = Query(...), quarter: int = Query(..., ge=1, le=4),
                        current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    return quarterly_sales(year, quarter)

@router.get("/sales/top-items")
def get_top_items(year: int = Query(...), quarter: int = Query(..., ge=1, le=4),
                  limit: int = Query(20), current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    return top_items_by_quarter(year, quarter, limit)

@router.get("/sales/by-city")
def get_sales_by_city(start_date: str = Query(...), end_date: str = Query(...),
                      current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    return sales_by_city(start_date, end_date)

@router.get("/sales/by-route")
def get_sales_by_route(start_date: str = Query(...), end_date: str = Query(...),
                       current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    return sales_by_route(start_date, end_date)

@router.get("/work-hours/drivers")
def get_driver_hours(start_date: str = Query(...), end_date: str = Query(...),
                     current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    return driver_work_hours(start_date, end_date)

@router.get("/work-hours/assistants")
def get_assistant_hours(start_date: str = Query(...), end_date: str = Query(...),
                        current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    return assistant_work_hours(start_date, end_date)

@router.get("/truck-usage")
def get_truck_usage(year: int = Query(...), month: int = Query(..., ge=1, le=12),
                    current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    return truck_usage_month(year, month)

@router.get("/customers/{customer_id}/orders")
def get_customer_orders(customer_id: str, start_date: str = Query(...), end_date: str = Query(...),
                        current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    return customer_order_history(customer_id, start_date, end_date)