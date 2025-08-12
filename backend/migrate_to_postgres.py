#!/usr/bin/env python3
"""
Migration script: SQLite to PostgreSQL
ใช้เมื่อต้องการย้ายข้อมูลจาก development ไป production
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models import Plant, PlantPrice, User, Seller, PlantListing
from app.core.config import settings
import os

def migrate_to_postgres():
    """Migrate data from SQLite to PostgreSQL"""
    
    # Source: SQLite (development)
    sqlite_url = "sqlite:///./plantdex.db"
    sqlite_engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})
    SQLiteSession = sessionmaker(bind=sqlite_engine)
    
    # Target: PostgreSQL (production)
    postgres_url = os.getenv("DATABASE_URL")
    if not postgres_url:
        print("❌ DATABASE_URL not found. Please set PostgreSQL connection string.")
        return
    
    postgres_engine = create_engine(postgres_url)
    PostgresSession = sessionmaker(bind=postgres_engine)
    
    print("🚀 Starting migration from SQLite to PostgreSQL...")
    
    try:
        # Test PostgreSQL connection
        with postgres_engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ PostgreSQL connection successful")
        
        # Migrate data
        sqlite_session = SQLiteSession()
        postgres_session = PostgresSession()
        
        # Migrate Plants
        print("🌱 Migrating plants...")
        plants = sqlite_session.query(Plant).all()
        for plant in plants:
            # Create new plant in PostgreSQL
            new_plant = Plant(
                scientific_name=plant.scientific_name,
                common_name_th=plant.common_name_th,
                common_name_en=plant.common_name_en,
                category=plant.category,
                care_level=plant.care_level,
                origin_country=plant.origin_country,
                description_th=plant.description_th,
                description_en=plant.description_en,
                care_instructions=plant.care_instructions,
                water_needs=plant.water_needs,
                light_needs=plant.light_needs,
                humidity_needs=plant.humidity_needs,
                temperature_min=plant.temperature_min,
                temperature_max=plant.temperature_max,
                growth_rate=plant.growth_rate,
                max_height=plant.max_height,
                max_width=plant.max_width,
                is_poisonous=plant.is_poisonous,
                is_rare=plant.is_rare,
                is_trending=plant.is_trending
            )
            postgres_session.add(new_plant)
        
        postgres_session.commit()
        print(f"✅ Migrated {len(plants)} plants")
        
        # Migrate Users
        print("👥 Migrating users...")
        users = sqlite_session.query(User).all()
        for user in users:
            new_user = User(
                email=user.email,
                username=user.username,
                hashed_password=user.hashed_password,
                full_name=user.full_name,
                phone=user.phone,
                location=user.location,
                province=user.province,
                is_verified=user.is_verified,
                subscription_tier=user.subscription_tier
            )
            postgres_session.add(new_user)
        
        postgres_session.commit()
        print(f"✅ Migrated {len(users)} users")
        
        # Migrate Plant Prices
        print("💰 Migrating plant prices...")
        prices = sqlite_session.query(PlantPrice).all()
        for price in prices:
            new_price = PlantPrice(
                plant_id=price.plant_id,
                source=price.source,
                source_url=price.source_url,
                price=price.price,
                currency=price.currency,
                plant_size=price.plant_size,
                pot_size=price.pot_size,
                condition=price.condition,
                seller_location=price.seller_location,
                seller_name=price.seller_name,
                seller_rating=price.seller_rating,
                availability=price.availability,
                stock_quantity=price.stock_quantity,
                shipping_cost=price.shipping_cost,
                shipping_time=price.shipping_time,
                is_verified=price.is_verified
            )
            postgres_session.add(new_price)
        
        postgres_session.commit()
        print(f"✅ Migrated {len(prices)} price records")
        
        print("\n🎉 Migration completed successfully!")
        print(f"📊 Total migrated:")
        print(f"  - Plants: {len(plants)}")
        print(f"  - Users: {len(users)}")
        print(f"  - Prices: {len(prices)}")
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        postgres_session.rollback()
    finally:
        sqlite_session.close()
        postgres_session.close()

if __name__ == "__main__":
    migrate_to_postgres() 