# app/api/__init__.py
from fastapi import APIRouter


from app.api.customers import router as customer_router
from app.api.users import router as user_router
from app.api.cities import router as city_router
from app.api.railway_stations import router as railway_stations
from app.api.stores import router as stores
from app.api.trains import router as trains
from app.api.trucks import router as trucks 
from app.api.orders import router as orders
from app.api.routes import router as routs
from app.api.train_schedules import router as trainSchedules
from app.api.truck_schedules import router as truckSchedules
from app.api.allocations import router as allocations
from app.api.reports import router as reports_router 
from app.api.products import router as products_router
from app.api.assistants import router as assistant_router 

api_router = APIRouter()
api_router.include_router(customer_router, tags=["customer"])
api_router.include_router(user_router, tags= ["users"])
api_router.include_router(city_router, tags= ["Cities"])
api_router.include_router(railway_stations, tags = ["Railway_Stations"])
api_router.include_router(stores, tags = ["Stores"])
api_router.include_router(trains,tags= ["Trains"])
api_router.include_router(orders, tags = ["Orders"])
api_router.include_router(routs, tags=["Routs"] )
api_router.include_router(trainSchedules, tags = ["Train Allocations"])
api_router.include_router(truckSchedules, tags = ["Truck Schedules"])
api_router.include_router(allocations, tags = ["Allocations"])
api_router.include_router(reports_router, tags=["reports"]) 
api_router.include_router(products_router, tags=["products"]) 
api_router.include_router(assistant_router, tags= ["Assistant"])
api_router.include_router(trucks, tags=["Trucks"])


