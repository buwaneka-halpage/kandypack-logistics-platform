"""
Utility functions for calculating cargo capacity and space consumption
"""
from sqlalchemy.orm import Session
from app.core.model import Orders, OrderItems, Products, TrainSchedules, RailAllocations
from sqlalchemy import func


def calculate_order_space(db: Session, order_id: str) -> float:
    """
    Calculate the total space consumption for an order based on its items and product space rates.
    
    Args:
        db: Database session
        order_id: The order ID to calculate space for
        
    Returns:
        float: Total space units consumed by the order
        
    Raises:
        ValueError: If order not found or has no items
    """
    # Query order items with their products to get space consumption rate
    items = db.query(OrderItems, Products).join(
        Products, OrderItems.product_type_id == Products.product_type_id
    ).filter(OrderItems.order_id == order_id).all()
    
    if not items:
        raise ValueError(f"No items found for order {order_id}")
    
    total_space = 0.0
    for order_item, product in items:
        # Space = quantity * space_consumption_rate
        item_space = order_item.quantity * product.space_consumption_rate
        total_space += item_space
    
    return total_space


def get_schedule_allocated_space(db: Session, schedule_id: str) -> float:
    """
    Get the total allocated space for a train schedule.
    
    Args:
        db: Database session
        schedule_id: The schedule ID to check
        
    Returns:
        float: Total space currently allocated on this schedule
    """
    result = db.query(func.sum(RailAllocations.allocated_space)).filter(
        RailAllocations.schedule_id == schedule_id,
        RailAllocations.status.in_(['PLANNED', 'IN_PROGRESS'])  # Only count active allocations
    ).scalar()
    
    return result or 0.0


def get_schedule_available_space(db: Session, schedule_id: str) -> float:
    """
    Get the available space remaining on a train schedule.
    
    Args:
        db: Database session
        schedule_id: The schedule ID to check
        
    Returns:
        float: Available space remaining
        
    Raises:
        ValueError: If schedule not found
    """
    schedule = db.query(TrainSchedules).filter(TrainSchedules.schedule_id == schedule_id).first()
    if not schedule:
        raise ValueError(f"Schedule {schedule_id} not found")
    
    allocated_space = get_schedule_allocated_space(db, schedule_id)
    available_space = schedule.cargo_capacity - allocated_space
    
    return max(0.0, available_space)  # Ensure non-negative


def check_capacity_available(db: Session, schedule_id: str, required_space: float) -> tuple[bool, float, float]:
    """
    Check if there is sufficient capacity on a schedule for a given space requirement.
    
    Args:
        db: Database session
        schedule_id: The schedule ID to check
        required_space: The space required
        
    Returns:
        tuple: (is_available: bool, available_space: float, required_space: float)
    """
    available_space = get_schedule_available_space(db, schedule_id)
    is_available = available_space >= required_space
    
    return is_available, available_space, required_space


def get_next_available_schedule(
    db: Session, 
    train_id: str, 
    source_station_id: str, 
    destination_station_id: str,
    required_space: float,
    after_date=None
) -> TrainSchedules | None:
    """
    Find the next available train schedule with sufficient capacity on the same route.
    
    Args:
        db: Database session
        train_id: The train ID to search for
        source_station_id: Source station
        destination_station_id: Destination station
        required_space: Space needed
        after_date: Search for schedules after this date (optional)
        
    Returns:
        TrainSchedules: Next available schedule or None if not found
    """
    from datetime import date
    
    query = db.query(TrainSchedules).filter(
        TrainSchedules.train_id == train_id,
        TrainSchedules.source_station_id == source_station_id,
        TrainSchedules.destination_station_id == destination_station_id,
        TrainSchedules.status == 'PLANNED'
    )
    
    if after_date:
        query = query.filter(TrainSchedules.scheduled_date > after_date)
    else:
        query = query.filter(TrainSchedules.scheduled_date >= date.today())
    
    schedules = query.order_by(TrainSchedules.scheduled_date).all()
    
    # Find first schedule with sufficient capacity
    for schedule in schedules:
        available_space = get_schedule_available_space(db, schedule.schedule_id)
        if available_space >= required_space:
            return schedule
    
    return None


def get_schedule_capacity_info(db: Session, schedule_id: str) -> dict:
    """
    Get comprehensive capacity information for a schedule.
    
    Args:
        db: Database session
        schedule_id: The schedule ID
        
    Returns:
        dict: Capacity information including total, allocated, available, and percentage
    """
    schedule = db.query(TrainSchedules).filter(TrainSchedules.schedule_id == schedule_id).first()
    if not schedule:
        raise ValueError(f"Schedule {schedule_id} not found")
    
    allocated_space = get_schedule_allocated_space(db, schedule_id)
    available_space = schedule.cargo_capacity - allocated_space
    utilization_percentage = (allocated_space / schedule.cargo_capacity * 100) if schedule.cargo_capacity > 0 else 0
    
    return {
        "schedule_id": schedule_id,
        "cargo_capacity": schedule.cargo_capacity,
        "allocated_space": allocated_space,
        "available_space": max(0.0, available_space),
        "utilization_percentage": round(utilization_percentage, 2),
        "is_full": available_space <= 0
    }
