from fastapi import FastAPI, HTTPException , Depends, status 
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base, get_db
from app.api import api_router
import app.core.model as model
from typing import Annotated
from sqlalchemy.orm import Session

app = FastAPI(
    title="KandyPack Logistics API",
    description="Backend API for KandyPack Supply Chain Management Platform",
    version="1.0.0"
)

# Configure CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative frontend port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers including Authorization
)

model.Base.metadata.create_all(bind=engine)
db_dependancy = Annotated[Session, Depends(get_db)]
 
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Kandypack Supply Chain API"}