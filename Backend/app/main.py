from fastapi import FastAPI, HTTPException , Depends, status 
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base, get_db
from app.api import api_router
import app.core.model as model
from typing import Annotated
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get configuration from environment variables
APP_NAME = os.getenv("APP_NAME", "KandyPack Logistics API")
APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
DEBUG = os.getenv("DEBUG", "True").lower() == "true"
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"
).split(",")

app = FastAPI(
    title=APP_NAME,
    description="Backend API for KandyPack Supply Chain Management Platform",
    version=APP_VERSION,
    debug=DEBUG
)

# Configure CORS to allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS],  # Load from env
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