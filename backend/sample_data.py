#!/usr/bin/env python3
"""
Sample data insertion script for PlantDex
Run this script to populate database with sample plants and data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.plant import Plant, PlantCategory, CareLevel
from app.models.price import PlantPrice
from app.models.user import User, Seller
from app.core.security import get_password_hash
from datetime import datetime, date

def insert_sample_data():
    """Insert sample data into database"""
    db = SessionLocal()
    
    try:
        print("🌱 Inserting sample plants...")
        
        # Sample plants
        plants_data = [
            {
                "scientific_name": "Monstera deliciosa",
                "common_name_th": "มอนสเตอร่า",
                "common_name_en": "Monstera",
                "category": PlantCategory.INDOOR,
                "care_level": CareLevel.EASY,
                "origin_country": "Mexico",
                "description_th": "ต้นไม้ใบสวย ใบมีรูเป็นเอกลักษณ์",
                "description_en": "Beautiful plant with distinctive leaf holes",
                "care_instructions": "รดน้ำเมื่อดินแห้ง วางในที่แสงรำไร",
                "water_needs": "moderate",
                "light_needs": "indirect",
                "humidity_needs": "high",
                "temperature_min": 18.0,
                "temperature_max": 30.0,
                "growth_rate": "moderate",
                "max_height": 300.0,
                "max_width": 200.0,
                "is_poisonous": False,
                "is_rare": False,
                "is_trending": True
            },
            {
                "scientific_name": "Ficus lyrata",
                "common_name_th": "ไทรใบสัก",
                "common_name_en": "Fiddle Leaf Fig",
                "category": PlantCategory.INDOOR,
                "care_level": CareLevel.MODERATE,
                "origin_country": "West Africa",
                "description_th": "ต้นไม้ใบใหญ่สวยงาม เหมาะสำหรับตกแต่งบ้าน",
                "description_en": "Beautiful large-leaved plant perfect for home decoration",
                "care_instructions": "รดน้ำปานกลาง ต้องการแสงสว่าง",
                "water_needs": "moderate",
                "light_needs": "bright",
                "humidity_needs": "moderate",
                "temperature_min": 16.0,
                "temperature_max": 28.0,
                "growth_rate": "slow",
                "max_height": 400.0,
                "max_width": 150.0,
                "is_poisonous": False,
                "is_rare": False,
                "is_trending": True
            },
            {
                "scientific_name": "Echeveria elegans",
                "common_name_th": "หยก",
                "common_name_en": "Mexican Snowball",
                "category": PlantCategory.SUCCULENT,
                "care_level": CareLevel.EASY,
                "origin_country": "Mexico",
                "description_th": "ต้นไม้ใบอวบน้ำ ดูแลง่าย เหมาะสำหรับมือใหม่",
                "description_en": "Succulent plant, easy to care for, perfect for beginners",
                "care_instructions": "รดน้ำน้อย ต้องการแสงแดด",
                "water_needs": "low",
                "light_needs": "full sun",
                "humidity_needs": "low",
                "temperature_min": 10.0,
                "temperature_max": 35.0,
                "growth_rate": "slow",
                "max_height": 15.0,
                "max_width": 20.0,
                "is_poisonous": False,
                "is_rare": False,
                "is_trending": False
            }
        ]
        
        # Insert plants
        plants = []
        for plant_data in plants_data:
            plant = Plant(**plant_data)
            db.add(plant)
            plants.append(plant)
        
        db.commit()
        print(f"✅ Inserted {len(plants)} plants")
        
        # Insert sample prices
        print("💰 Inserting sample prices...")
        
        price_data = [
            {
                "plant_id": 1,  # Monstera
                "source": "shopee",
                "source_url": "https://shopee.co.th/monstera",
                "price": 299.0,
                "currency": "THB",
                "plant_size": "medium",
                "pot_size": "6\"",
                "condition": "new",
                "seller_location": "Bangkok",
                "seller_name": "GreenHouse Thailand",
                "seller_rating": 4.8,
                "availability": True,
                "stock_quantity": 50,
                "shipping_cost": 50.0,
                "shipping_time": "1-2 days"
            },
            {
                "plant_id": 1,  # Monstera
                "source": "lazada",
                "source_url": "https://lazada.co.th/monstera",
                "price": 350.0,
                "currency": "THB",
                "plant_size": "large",
                "pot_size": "8\"",
                "condition": "new",
                "seller_location": "Chiang Mai",
                "seller_name": "Plant Paradise",
                "seller_rating": 4.6,
                "availability": True,
                "stock_quantity": 25,
                "shipping_cost": 80.0,
                "shipping_time": "2-3 days"
            },
            {
                "plant_id": 2,  # Fiddle Leaf Fig
                "source": "nursery",
                "source_url": "https://nursery.co.th/ficus",
                "price": 1200.0,
                "currency": "THB",
                "plant_size": "large",
                "pot_size": "10\"",
                "condition": "new",
                "seller_location": "Bangkok",
                "seller_name": "Bangkok Garden Center",
                "seller_rating": 4.9,
                "availability": True,
                "stock_quantity": 10,
                "shipping_cost": 100.0,
                "shipping_time": "1-2 days"
            }
        ]
        
        for price_data_item in price_data:
            price = PlantPrice(**price_data_item)
            db.add(price)
        
        db.commit()
        print(f"✅ Inserted {len(price_data)} price records")
        
        # Insert sample users
        print("👥 Inserting sample users...")
        
        users_data = [
            {
                "email": "buyer@example.com",
                "username": "plantlover",
                "hashed_password": get_password_hash("password123"),
                "full_name": "สมชาย รักต้นไม้",
                "phone": "0812345678",
                "location": "Bangkok",
                "province": "กรุงเทพมหานคร",
                "is_verified": True,
                "subscription_tier": "free"
            },
            {
                "email": "seller@example.com",
                "username": "greengarden",
                "hashed_password": get_password_hash("password123"),
                "full_name": "สมหญิง สวนเขียว",
                "phone": "0898765432",
                "location": "Chiang Mai",
                "province": "เชียงใหม่",
                "is_verified": True,
                "subscription_tier": "premium"
            }
        ]
        
        users = []
        for user_data in users_data:
            user = User(**user_data)
            db.add(user)
            users.append(user)
        
        db.commit()
        print(f"✅ Inserted {len(users)} users")
        
        # Insert sample seller
        print("🏪 Inserting sample seller...")
        
        seller_data = {
            "user_id": 2,  # seller@example.com
            "business_name": "Green Garden Nursery",
            "business_type": "nursery",
            "business_license": "NUR-001-2024",
            "description": "สวนต้นไม้คุณภาพสูง จำหน่ายต้นไม้หายากและต้นไม้ทั่วไป",
            "address": "123 ถนนดอกไม้ ตำบลสวนดอก อำเภอเมือง",
            "city": "เชียงใหม่",
            "province": "เชียงใหม่",
            "postal_code": "50200",
            "phone": "053-123-456",
            "website": "https://greengarden.co.th",
            "rating": 4.8,
            "total_reviews": 150,
            "total_sales": 500,
            "total_plants_listed": 200,
            "is_verified": True
        }
        
        seller = Seller(**seller_data)
        db.add(seller)
        db.commit()
        print("✅ Inserted 1 seller")
        
        print("\n🎉 Sample data insertion completed successfully!")
        print("📊 Database now contains:")
        print(f"  - {len(plants)} plants")
        print(f"  - {len(price_data)} price records")
        print(f"  - {len(users)} users")
        print(f"  - 1 seller")
        
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    insert_sample_data() 