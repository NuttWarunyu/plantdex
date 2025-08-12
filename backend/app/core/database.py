from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
import os

# Database URL - รองรับทั้ง SQLite และ PostgreSQL
def get_database_url():
    # ถ้ามี DATABASE_URL ใน environment ให้ใช้ PostgreSQL
    if os.getenv("DATABASE_URL"):
        return os.getenv("DATABASE_URL")
    
    # ถ้าไม่มี ให้ใช้ SQLite (development)
    return "sqlite:///./plantdex.db"

SQLALCHEMY_DATABASE_URL = get_database_url()

# สร้าง engine ตาม database type
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    # SQLite configuration
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL configuration
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Health check
        pool_recycle=300,    # Recycle connections
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 