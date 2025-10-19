from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from urllib.parse import quote_plus
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Database configuration - prefer environment variables for security
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = os.getenv("MYSQL_PORT", "3306")
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", "nilum@2002")  # fallback to old password
DB_NAME = os.getenv("MYSQL_DATABASE", "kandypack_db")

# URL-encode the password to handle special characters
DB_PASSWORD_ENCODED = quote_plus(DB_PASSWORD)

# Create the database URL
DB_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD_ENCODED}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DB_URL)
Session_local = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = Session_local()
    try:
        yield db 
    finally:
        db.close()
