from sqlalchemy import Column, Boolean, Integer, String, ForeignKey, event, DateTime, Float, Date, Time, CheckConstraint, Enum, UniqueConstraint
from app.core.database import Base
from datetime import datetime, timezone, date, time 
from sqlalchemy.orm import relationship, validates
import uuid 
import enum


# generate uuid 
def generate_uuid():
    return str(uuid.uuid4())

class OrderStatus(enum.Enum):
    PLACED = "Placed"
    SCHEDULED_RAIL = "Scheduled for Railway"
    IN_WAREHOUSE = "IN Warehouse"
    SCHEDULED_ROAD =  "Scheduled for road"
    DELIVERED = "Delivered"
    FAILED = "Failed"


class ScheduleStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED" 

class Users(Base):
    __tablename__ = "users"
    user_id = Column(String(36), primary_key= True, index = True, default= generate_uuid)
    user_name = Column(String(50), unique=True, nullable= False)
    password_hash = Column(String(255), nullable= False)
    role = Column(String(50), nullable= False)
    created_at = Column(DateTime, default= lambda : datetime.now(timezone.utc))

class Customers(Base):
    __tablename__ = "customers"
    customer_id = Column(String(36), primary_key=True, index = True, default=generate_uuid)
    customer_user_name = Column(String(50), unique=True, nullable= False)
    customer_name = Column(String(100), nullable= False)
    phone_number = Column(String(30),unique=True, nullable= False)
    address = Column(String(200), nullable= False)
    password_hash = Column(String(255), nullable= False)
    # the relationship 
    orders = relationship("Orders", back_populates= "customer")
    __table_args__ = (
        CheckConstraint("phone_number REGEXP '^\\+?[0-9-]+$'", name = "Valid_phone_number"),
    )

class Orders(Base):
    __tablename__ = "orders"
    order_id = Column(String(36), primary_key=True, index = True, default= generate_uuid)
    customer_id = Column(String(36), ForeignKey("customers.customer_id"))
    order_date = Column(DateTime, default = lambda : datetime.now(timezone.utc))
    deliver_address = Column(String(200), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PLACED, nullable=False)
    deliver_city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    full_price = Column(Float, nullable=False)
    # the relationship 
    customer = relationship("Customers", back_populates="orders")
    items = relationship("OrderItems", back_populates="order")
    rail_allocations = relationship("RailAllocations", back_populates="order")
    truck_allocations = relationship("TruckAllocations", back_populates="order")
    __table_args__ = (
        CheckConstraint("full_price >= 0", name="positive_price"),
    )
class Stores(Base):
    __tablename__ = "stores"
    store_id = Column(String(36),primary_key=True,index=True, default= generate_uuid )
    name = Column(String(100), nullable=False)
    telephone_number = Column(String(15), nullable=False)
    address = Column(String(255), nullable=False)
    contact_person = Column(String(100), nullable=False)
    station_id = Column(String(36), ForeignKey("railway_stations.station_id"), nullable=False)
    station = relationship("RailwayStations")
    __table_args__ = (
        CheckConstraint("telephone_number  REGEXP '^\\+?[0-9\-]+$'", name="valid_store_phone"),
    )


class Cities(Base):
    __tablename__ = "cities"
    city_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    city_name = Column(String(100), unique=True, nullable=False)
    province = Column(String(100), nullable=False)
    stations = relationship("RailwayStations", back_populates="city")

class RailwayStations(Base):
    __tablename__ = "railway_stations"
    station_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    station_name = Column(String(100), unique=False, nullable=False)
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    # relationship
    city = relationship("Cities", back_populates="stations")
    stores = relationship("Stores", back_populates="station")

class Routes(Base):
    __tablename__ = "routes"
    route_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    store_id = Column(String(36), ForeignKey("stores.store_id"), nullable=False)
    start_city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    end_city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    distance = Column(Integer, nullable=False)
    # relationship
    store = relationship("Stores")
    start_city = relationship("Cities", foreign_keys=[start_city_id])
    end_city = relationship("Cities", foreign_keys=[end_city_id])
    truck_schedules = relationship("TruckSchedules", back_populates="route", cascade="all, delete")
    __table_args__ = (
        CheckConstraint("distance > 0", name="positive_distance"),
    )

class RouteOrders(Base):
    __tablename__ = "route_orders"
    route_order_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    route_id = Column(String(36), ForeignKey("routes.route_id"), nullable=False)
    order_id = Column(String(36), ForeignKey("orders.order_id"), nullable=False)
    route = relationship("Routes")
    order = relationship("Orders")
    __table_args__ = (
        UniqueConstraint("route_id", "order_id", name="unique_route_order"),
    )


class Products(Base):
    __tablename__ = "products"
    product_type_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    product_name = Column(String(100), nullable=False)
    space_consumption_rate = Column(Float, nullable=False)
    __table_args__ = (
        CheckConstraint("space_consumption_rate > 0", name="positive_space_rate"),
    )

class OrderItems(Base):
    __tablename__ = "order_items"
    item_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.order_id"), nullable=False)
    store_id = Column(String(36), ForeignKey("stores.store_id"), nullable=False)
    product_type_id = Column(String(36), ForeignKey("products.product_type_id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    item_price = Column(Float, nullable=False)
    order = relationship("Orders", back_populates="items")
    store = relationship("Stores")
    product = relationship("Products")
    __table_args__ = (
        CheckConstraint("quantity > 0", name="positive_quantity"),
        CheckConstraint("item_price >= 0", name="positive_item_price"),
    )

class Trains(Base):
    __tablename__ = "trains"
    train_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    train_name = Column(String(100), nullable=False)
    capacity = Column(Integer, nullable=False)
    __table_args__ = (
        CheckConstraint("capacity > 0", name="positive_train_capacity"),
    )

class TrainSchedules(Base):
    __tablename__ = "train_schedules"
    schedule_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    train_id = Column(String(36), ForeignKey("trains.train_id"), nullable=False)
    station_id = Column(String(36), ForeignKey("railway_stations.station_id"), nullable=False)
    scheduled_date = Column(Date, nullable=False)
    departure_time = Column(Time, nullable=False)
    arrival_time = Column(Time, nullable=False)
    status = Column(Enum(ScheduleStatus), default=ScheduleStatus.PLANNED, nullable=False)
    train = relationship("Trains")
    station = relationship("RailwayStations")
    rail_allocations = relationship("RailAllocations", back_populates="schedule", cascade="all, delete")


class RailAllocations(Base):
    __tablename__ = "rail_allocations"
    allocation_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.order_id"), nullable=False)
    schedule_id = Column(String(36), ForeignKey("train_schedules.schedule_id"), nullable=False)
    shipment_date = Column(Date, nullable=False)
    status = Column(Enum(ScheduleStatus), default=ScheduleStatus.PLANNED, nullable=False)
    order = relationship("Orders", back_populates="rail_allocations")
    schedule = relationship("TrainSchedules", back_populates="rail_allocations")
     
    @validates("shipment_date")
    def validate_shipment_date(self, key, value):
        if value < date.today():
            raise ValueError("Shipment date cannot be in the past.")
        return value


class Drivers(Base):
    __tablename__ = "drivers"
    driver_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    weekly_working_hours = Column(Integer, default=0, nullable=False)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    user = relationship("Users")
    __table_args__ = (
        CheckConstraint("weekly_working_hours >= 0 AND weekly_working_hours <= 40", name="driver_hours_limit"),
    )
class Trucks(Base):
    __tablename__ = "trucks"
    truck_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    license_num = Column(String(50), unique=True, nullable=False)
    capacity = Column(Integer, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    __table_args__ = (
        CheckConstraint("capacity > 0", name="positive_truck_capacity"),
    )

class Assistants(Base):
    __tablename__ = "assistants"
    assistant_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    weekly_working_hours = Column(Integer, default=0, nullable=False)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    user = relationship("Users")
    __table_args__ = (
        CheckConstraint("weekly_working_hours >= 0 AND weekly_working_hours <= 60", name="assistant_hours_limit"),
    )
    
class TruckSchedules(Base):
    __tablename__ = "truck_schedules"
    schedule_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    route_id = Column(String(36), ForeignKey("routes.route_id"), nullable=False)
    truck_id = Column(String(36), ForeignKey("trucks.truck_id"), nullable=False)
    driver_id = Column(String(36), ForeignKey("drivers.driver_id"), nullable=False)
    assistant_id = Column(String(36), ForeignKey("assistants.assistant_id"), nullable=False)
    scheduled_date = Column(Date, nullable=False)
    departure_time = Column(Time, nullable=False)
    duration = Column(Integer, nullable=False)
    status = Column(Enum(ScheduleStatus), default=ScheduleStatus.PLANNED, nullable=False)
    route = relationship("Routes", back_populates="truck_schedules")
    truck = relationship("Trucks",  cascade="all, delete")
    driver = relationship("Drivers")
    assistant = relationship("Assistants")
    truck_allocations = relationship("TruckAllocations", back_populates="schedule", cascade="all, delete")
    __table_args__ = (
        CheckConstraint("duration > 0", name="positive_duration"),
    )


class TruckAllocations(Base):
    __tablename__ = "truck_allocations"
    allocation_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("orders.order_id"), nullable=False)
    schedule_id = Column(String(36), ForeignKey("truck_schedules.schedule_id"), nullable=False)
    shipment_date = Column(Date, nullable=False)
    status = Column(Enum(ScheduleStatus), default=ScheduleStatus.PLANNED, nullable=False)
    order = relationship("Orders", back_populates="truck_allocations")
    schedule = relationship("TruckSchedules", back_populates="truck_allocations")

    @validates("shipment_date")
    def shipment_date_validate(self, key, value):
        if value < date.today():
            raise ValueError("Shipment date cannot be in the past.")
        return  value
    







