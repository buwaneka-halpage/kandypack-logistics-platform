from pydantic import BaseModel
from typing import Annotated
from app.core.database import engine
import app.core.model as model
from datetime import datetime, timezone, date, time
import enum



model.Base.metadata.create_all(bind= engine)

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

# user 
class UserBase(BaseModel):
    user_name: str
    model_config = {"from_attributes": True}


class UserCreate(UserBase):
    user_name: str 
    password: str
    role: str

class UserUpdate(BaseModel):
    user_name: str | None = None
    password: str | None = None
    role: str | None = None

class UserResponse(UserBase):
    user_id: str
    role: str
    created_at: datetime

    model_config = {"from_attributes": True}

# customer 
class CustomerBase(BaseModel):
    customer_user_name : str 
    customer_id : str 
    customer_name : str 
    phone_number : str 
    address : str 

class CustomerCreate(BaseModel):
    customer_user_name : str 
    customer_name : str 
    phone_number : str 
    address : str
    password : str 

# order 
class order(BaseModel):
    order_id : str 
    customer_id: str 
    order_date: datetime
    deliver_address  : str 
    status : str 
    deliver_city_id: str 
    full_price  : float 

class store(BaseModel):
    store_id : str 
    name : str 
    telephone_number : str 
    address : str 
    contact_person : str 
    station_id : str 

class route(BaseModel):
    route_id  : str 
    store_id : str 
    start_city_id : str 
    end_city_id : str 
    distance : int 
    class Config:
        orm_mode = True

class routeOrderBase(BaseModel):
    route_order_id : str 
    route_id : str 
    order_id : str 

class ProductBase(BaseModel):
    product_name: str
    space_consumption_rate: float

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: str | None = None
    space_consumption_rate: float | None = None

class ProductResponse(ProductBase):
    product_type_id: str

    model_config = {"from_attributes": True}

class order_itemsBase(BaseModel):
    item_id : str 
    order_id : str 
    store_id : str 
    product_type_id : str 
    quantity : int 
    item_price: float

class City(BaseModel):
    city_id :str 
    city_name : str
    province : str 
    class Config:
        orm_mode = True

class RailwayStation(BaseModel):
    station_id : str 
    station_name : str 
    city_id : str 
    class Config:
        orm_mode = True

class Train(BaseModel):
    train_id : str 
    train_name : str 
    capacity : int 

class Train_Schedules(BaseModel):
    schedule_id : str 
    train_id : str 
    station_id : str 
    scheduled_date : date
    departure_time : time
    arrival_time : time
    status : ScheduleStatus

    class Config:
        orm_mode = True
        use_enum_values = True
        from_attributes = True

class RailwayAllocationBase(BaseModel):
    allocation_id : str 
    order_id : str 
    schedule_id : str 
    shipment_date : str 
    status : str 

class DriverBase(BaseModel):
    name: str
    
class DriverCreate(DriverBase):
    user_id: str

class DriverUpdate(BaseModel):
    name: str | None = None
    weekly_working_hours: int | None = None

class DriverResponse(DriverBase):
    driver_id: str
    weekly_working_hours: int
    user_id: str

    class Config:
        from_attributes = True

class TruckBase(BaseModel):
    truck_id : str 
    license_num : str 
    capacity : int 
    is_active  : bool

class AssistantBase(BaseModel):
    name: str
    
class AssistantCreate(AssistantBase):
    user_id: str

class AssistantUpdate(BaseModel):
    name: str | None = None
    weekly_working_hours: int | None = None

class AssistantResponse(AssistantBase):
    assistant_id: str
    weekly_working_hours: int
    user_id: str

    class Config:
        from_attributes = True

class Truck_Schedule(BaseModel):
    schedule_id : str 
    route_id : str 
    truck_id : str 
    driver_id : str 
    assistant_id : str 
    scheduled_date : date 
    departure_time : time
    duration : int  
    status : ScheduleStatus
    class Config:
        orm_mode = True
        use_enum_values = True

class Truck_allocationBase(BaseModel):
    allocation_id : str 
    order_id : str 
    schedule_id : str 
    shipment_date : str 
    status  : str 




class customerUpdate(CustomerBase):
    customer_name : str 
    phone_number : str 
    address : str 


class StoreCreate(BaseModel):
    store_id : str 
    name : str 
    telephone_number : str
    address : str
    contact_person: str 
    station_id : str 

class StoreUpdate(BaseModel):
    name : str 
    telephone_number : str
    address : str
    contact_person: str 
    station_id : str 

class create_new_order(order):
    customer_id: str 
    order_date: datetime
    deliver_address  : str 
    status : str 
    deliver_city_id: str 
    full_price  : float 

class update_order(order):
    order_date: date
    deliver_address  : str
    status : OrderStatus
    deliver_city_id : str 
    full_price  : float 

class route_create(route):
    route_id  : str 
    store_id : str
    start_city_id : str 
    end_city_id : str 
    distance : int 
    

class route_update(route):
    route_id  : str 
    store_id : str 
    start_city_id : str 
    end_city_id : str 
    distance : int 
    
    
class create_new_trainSchedule(Train_Schedules):
    train_id : str 
    station_id : str 
    scheduled_date: datetime 
    arrival_time  : time
    departure_time : time
    status: ScheduleStatus
    model_config = {"from_attributes": True, "use_enum_values": True}
    

# class update_trainSchedules(BaseModel):
#     train_id : str | None = None
#     station_id : str | None = None
#     scheduled_date: datetime | None = None
#     arrival_time: time | None = None
#     departure_time: time | None = None
#     status: ScheduleStatus | None = None
    
#     class Config:
#         from_attributes = True
#         use_enum_values = True

class Trucks(BaseModel):
    truck_id : str 
    license_num: str 
    capacity : int
    is_active : bool
    model_config = {"from_attributes": True}

class update_trainSchedules(Train_Schedules):
    train_id : str 
    station_id : str 
    scheduled_date: datetime 
    arrival_time  : time
    departure_time : time
    status: ScheduleStatus
    
    class Config:
        from_attributes = True
        use_enum_values = True
    pass

class update_truckSchedules(Truck_Schedule):
    schedule_id : str 
    route_id : str 
    truck_id : str 
    driver_id : str 
    assistant_id : str 
    scheduled_date : date 
    departure_time : time
    duration : int  
    status : ScheduleStatus
    
    class Config:
        from_attributes = True
        use_enum_values = True
    pass