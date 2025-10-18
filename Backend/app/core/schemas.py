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

    model_config = {"from_attributes": True}


class ScheduleStatus(str, enum.Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED" 

    model_config = {"from_attributes": True}


# user 
class UserBase(BaseModel):
    user_name: str

    model_config = {"from_attributes": True}


class UserCreate(UserBase):
    user_name: str 
    password: str
    role: str

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    user_name: str | None = None
    password: str | None = None
    role: str | None = None

    model_config = {"from_attributes": True}


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

    model_config = {"from_attributes": True}


class CustomerCreate(BaseModel):
    customer_user_name : str 
    customer_name : str 
    phone_number : str 
    address : str
    password : str 

    model_config = {"from_attributes": True}


# order 
class order(BaseModel):
    order_id : str 
    customer_id: str 
    order_date: datetime
    deliver_address  : str 
    status : str 
    deliver_city_id: str 
    full_price  : float 

    model_config = {"from_attributes": True}

class store(BaseModel):
    store_id : str 
    name : str 
    telephone_number : str 
    address : str 
    contact_person : str 
    station_id : str 

    model_config = {"from_attributes": True}


class route(BaseModel):
    route_id  : str 
    store_id : str 
    start_city_id : str 
    end_city_id : str 
    distance : int 

    model_config = {"from_attributes": True}

class routeOrderBase(BaseModel):
    route_order_id : str 
    route_id : str 
    order_id : str 

    model_config = {"from_attributes": True}


class ProductBase(BaseModel):
    product_name: str
    space_consumption_rate: float

    model_config = {"from_attributes": True}


class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    product_name: str | None = None
    space_consumption_rate: float | None = None

    model_config = {"from_attributes": True}


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

    model_config = {"from_attributes": True}


class City(BaseModel):
    city_id :str 
    city_name : str
    province : str 
    
    model_config = {"from_attributes": True}


class RailwayStation(BaseModel):
    station_id : str 
    station_name : str 
    city_id : str 
    
    model_config = {"from_attributes": True}


class Train(BaseModel):
    train_id : str 
    train_name : str 
    capacity : int 

    model_config = {"from_attributes": True}


class Train_Schedules(BaseModel):
    schedule_id : str 
    train_id : str 
    station_id : str 
    scheduled_date : date
    departure_time : time
    arrival_time : time
    status : ScheduleStatus

    model_config = {"from_attributes": True, "orm_mode": True, "use_enum_values": True}
    

class RailwayAllocationBase(BaseModel):
    allocation_id : str 
    order_id : str 
    schedule_id : str 
    shipment_date : str 
    status : str 

    model_config = {"from_attributes": True}

class DriverBase(BaseModel):
    name: str
    
    model_config = {"from_attributes": True}

    
class DriverCreate(DriverBase):
    user_id: str

    model_config = {"from_attributes": True}


class DriverUpdate(BaseModel):
    name: str | None = None
    weekly_working_hours: int | None = None

    model_config = {"from_attributes": True}


class DriverResponse(DriverBase):
    driver_id: str
    weekly_working_hours: int
    user_id: str

    model_config = {"from_attributes": True}

class TruckBase(BaseModel):
    truck_id : str 
    license_num : str 
    capacity : int 
    is_active  : bool

    model_config = {"from_attributes": True}

class AssistantBase(BaseModel):
    name: str

    model_config = {"from_attributes": True}

    
class AssistantCreate(AssistantBase):
    user_id: str

    model_config = {"from_attributes": True}


class AssistantUpdate(BaseModel):
    name: str | None = None
    weekly_working_hours: int | None = None

    model_config = {"from_attributes": True}


class AssistantResponse(AssistantBase):
    assistant_id: str
    weekly_working_hours: int
    user_id: str

    model_config = {"from_attributes": True}

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

    model_config = {"from_attributes": True, "orm_mode" : True} 
    
class Truck_allocationBase(BaseModel):
    allocation_id : str 
    order_id : str 
    schedule_id : str 
    shipment_date : str 
    status  : str 

    model_config = {"from_attributes": True}





class customerUpdate(CustomerBase):
    customer_name : str 
    phone_number : str 
    address : str 

    model_config = {"from_attributes": True}



class StoreCreate(BaseModel):
    store_id : str 
    name : str 
    telephone_number : str
    address : str
    contact_person: str 
    station_id : str 

    model_config = {"from_attributes": True}


class StoreUpdate(BaseModel):
    name : str 
    telephone_number : str
    address : str
    contact_person: str 
    station_id : str 

    model_config = {"from_attributes": True}

class get_order_by_customer_name(order):
    order_id : str 
    customer_name : str 
    order_date  : date
    deliver_address : str 
    state : str 
    
    model_config = {"from_attributes": True}

class create_new_order(order):
    customer_id: str 
    order_date: datetime
    deliver_address  : str  
    status : str 
    deliver_city_id: str 
    full_price  : float 

    model_config = {"from_attributes": True}

class order_history(order):
    customer_id : str 

    model_config = {"from_attributes": True}


class update_order(order):
    order_date: date
    deliver_address  : str
    status : OrderStatus
    deliver_city_id : str 
    full_price  : float 

    model_config = {"from_attributes": True}


class route_create(route):
    route_id  : str 
    store_id : str
    start_city_id : str 
    end_city_id : str 
    distance : int 

    model_config = {"from_attributes": True}

    

class route_update(route):
    route_id  : str 
    store_id : str 
    start_city_id : str 
    end_city_id : str 
    distance : int 

    model_config = {"from_attributes": True}

    
    
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
    
    model_config = {"from_attributes": True, "use_enum_values" :True} 
    

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
    
    model_config = {"from_attributes": True, "use_enum_values" :True} 
    