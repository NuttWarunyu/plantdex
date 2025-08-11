#!/usr/bin/env python3
"""
Database initialization script for PlantDex
Run this script to create all database tables
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base
from app.models import plant, user, price, market

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    
    # Import all models to ensure they are registered
    from app.models.plant import Plant, PlantCategory, CareLevel
    from app.models.user import User, Seller, PlantListing
    from app.models.price import PlantPrice
    from app.models.market import MarketTrend, PlantPriceIndex, TrendingPlant
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # Print table information
    print("\n📊 Database Tables Created:")
    for table_name in Base.metadata.tables.keys():
        print(f"  - {table_name}")

if __name__ == "__main__":
    create_tables() 