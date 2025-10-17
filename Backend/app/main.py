from fastapi import FastAPI, HTTPException , Depends, status 
from app.core.database import engine, Base, get_db
from app.api import api_router
import app.core.model as model
from typing import Annotated
from sqlalchemy.orm import Session

app = FastAPI()

model.Base.metadata.create_all(bind=engine)
db_dependancy = Annotated[Session, Depends(get_db)]
 
app.include_router(api_router)

@app.get("/")
def read_root():
    return {"message": "Kandypack Supply Chain API"}