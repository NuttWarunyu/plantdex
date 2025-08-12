#!/usr/bin/env python3
"""
Add real plant data to PlantDex
เพิ่มข้อมูลพืชจริงที่กำลังนิยมในตลาด
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.plant import Plant, PlantCategory, CareLevel
from app.models.price import PlantPrice
from datetime import datetime

def add_real_plants():
    """เพิ่มข้อมูลพืชจริงที่กำลังนิยม"""
    db = SessionLocal()
    
    try:
        print("🌱 เพิ่มข้อมูลพืชจริงที่กำลังนิยม...")
        
        # พืชยอดนิยม 2024
        real_plants = [
            {
                "scientific_name": "Philodendron 'Pink Princess'",
                "common_name_th": "ฟิลโลเดนดรอน พิงค์ พรินเซส",
                "common_name_en": "Philodendron Pink Princess",
                "category": PlantCategory.INDOOR,
                "care_level": CareLevel.MODERATE,
                "origin_country": "Colombia",
                "description_th": "ฟิลโลเดนดรอนใบสีชมพูสวยงาม กำลังเป็นที่นิยมมากในตลาด",
                "description_en": "Beautiful pink variegated Philodendron, highly sought after in the market",
                "care_instructions": "รดน้ำปานกลาง ต้องการแสงรำไร ความชื้นสูง",
                "water_needs": "moderate",
                "light_needs": "indirect",
                "humidity_needs": "high",
                "temperature_min": 18.0,
                "temperature_max": 28.0,
                "growth_rate": "slow",
                "max_height": 200.0,
                "max_width": 150.0,
                "is_poisonous": True,
                "is_rare": True,
                "is_trending": True
            },
            {
                "scientific_name": "Monstera 'Thai Constellation'",
                "common_name_th": "มอนสเตอร่า ไทย คอนสเตลเลชัน",
                "common_name_en": "Monstera Thai Constellation",
                "category": PlantCategory.INDOOR,
                "care_level": CareLevel.MODERATE,
                "origin_country": "Thailand",
                "description_th": "มอนสเตอร่าพันธุ์ไทยที่มีจุดสีครีมสวยงาม เป็นที่นิยมในตลาด",
                "description_en": "Thai Monstera variety with beautiful cream variegation, popular in the market",
                "care_instructions": "รดน้ำปานกลาง ต้องการแสงรำไร ความชื้นสูง",
                "water_needs": "moderate",
                "light_needs": "indirect",
                "humidity_needs": "high",
                "temperature_min": 18.0,
                "temperature_max": 30.0,
                "growth_rate": "moderate",
                "max_height": 300.0,
                "max_width": 200.0,
                "is_poisonous": True,
                "is_rare": True,
                "is_trending": True
            },
            {
                "scientific_name": "Alocasia 'Dragon Scale'",
                "common_name_th": "อะโลคาเซีย ดรากอน สเกล",
                "common_name_en": "Alocasia Dragon Scale",
                "category": PlantCategory.INDOOR,
                "care_level": CareLevel.MODERATE,
                "origin_country": "Borneo",
                "description_th": "อะโลคาเซียใบมีลายคล้ายเกล็ดมังกร สวยงามและหายาก",
                "description_en": "Alocasia with dragon scale-like leaf pattern, beautiful and rare",
                "care_instructions": "รดน้ำปานกลาง ต้องการแสงรำไร ความชื้นสูงมาก",
                "water_needs": "moderate",
                "light_needs": "indirect",
                "humidity_needs": "very_high",
                "temperature_min": 20.0,
                "temperature_max": 28.0,
                "growth_rate": "slow",
                "max_height": 150.0,
                "max_width": 100.0,
                "is_poisonous": True,
                "is_rare": True,
                "is_trending": True
            },
            {
                "scientific_name": "Anthurium 'Crystallinum'",
                "common_name_th": "แอนธูเรียม คริสตัลลินัม",
                "common_name_en": "Anthurium Crystallinum",
                "category": PlantCategory.INDOOR,
                "care_level": CareLevel.MODERATE,
                "origin_country": "Colombia",
                "description_th": "แอนธูเรียมใบมีลายเส้นสีขาวสวยงาม เหมาะสำหรับตกแต่งบ้าน",
                "description_en": "Anthurium with beautiful white veining, perfect for home decoration",
                "care_instructions": "รดน้ำปานกลาง ต้องการแสงรำไร ความชื้นสูง",
                "water_needs": "moderate",
                "light_needs": "indirect",
                "humidity_needs": "high",
                "temperature_min": 18.0,
                "temperature_max": 28.0,
                "growth_rate": "slow",
                "max_height": 120.0,
                "max_width": 80.0,
                "is_poisonous": True,
                "is_rare": False,
                "is_trending": True
            },
            {
                "scientific_name": "Calathea 'White Fusion'",
                "common_name_th": "คาลาเทีย ไวท์ ฟิวชัน",
                "common_name_en": "Calathea White Fusion",
                "category": PlantCategory.INDOOR,
                "care_level": CareLevel.MODERATE,
                "origin_country": "Brazil",
                "description_th": "คาลาเทียใบมีลายสีขาวสวยงาม ต้องการการดูแลพิเศษ",
                "description_en": "Calathea with beautiful white variegation, requires special care",
                "care_instructions": "รดน้ำสม่ำเสมอ ต้องการแสงรำไร ความชื้นสูงมาก",
                "water_needs": "high",
                "light_needs": "indirect",
                "humidity_needs": "very_high",
                "temperature_min": 18.0,
                "temperature_max": 26.0,
                "growth_rate": "slow",
                "max_height": 100.0,
                "max_width": 80.0,
                "is_poisonous": False,
                "is_rare": False,
                "is_trending": True
            }
        ]
        
        # เพิ่มพืชใหม่
        new_plants = []
        for plant_data in real_plants:
            # ตรวจสอบว่ามีอยู่แล้วหรือไม่
            existing = db.query(Plant).filter(
                Plant.scientific_name == plant_data["scientific_name"]
            ).first()
            
            if not existing:
                plant = Plant(**plant_data)
                db.add(plant)
                new_plants.append(plant)
                print(f"✅ เพิ่ม: {plant_data['common_name_th']}")
            else:
                print(f"⚠️  มีอยู่แล้ว: {plant_data['common_name_th']}")
        
        db.commit()
        print(f"\n🎉 เพิ่มพืชใหม่สำเร็จ: {len(new_plants)} ชนิด")
        
        # เพิ่มราคาจริง (ประมาณการ)
        print("\n💰 เพิ่มราคาจริง...")
        
        price_data = [
            # Philodendron Pink Princess
            {
                "plant_id": 4,  # ฟิลโลเดนดรอน
                "source": "facebook_marketplace",
                "source_url": "https://facebook.com/marketplace",
                "price": 2500.0,
                "currency": "THB",
                "plant_size": "small",
                "pot_size": "4\"",
                "condition": "new",
                "seller_location": "Bangkok",
                "seller_name": "Plant Collector Thailand",
                "seller_rating": 4.9,
                "availability": True,
                "stock_quantity": 5,
                "shipping_cost": 100.0,
                "shipping_time": "1-2 days"
            },
            {
                "plant_id": 4,
                "source": "shopee",
                "source_url": "https://shopee.co.th",
                "price": 3200.0,
                "currency": "THB",
                "plant_size": "medium",
                "pot_size": "6\"",
                "condition": "new",
                "seller_location": "Chiang Mai",
                "seller_name": "Rare Plant Shop",
                "seller_rating": 4.7,
                "availability": True,
                "stock_quantity": 3,
                "shipping_cost": 80.0,
                "shipping_time": "2-3 days"
            },
            # Monstera Thai Constellation
            {
                "plant_id": 5,  # มอนสเตอร่า ไทย
                "source": "nursery",
                "source_url": "https://nursery.co.th",
                "price": 8000.0,
                "currency": "THB",
                "plant_size": "large",
                "pot_size": "8\"",
                "condition": "new",
                "seller_location": "Bangkok",
                "seller_name": "Bangkok Rare Plant Nursery",
                "seller_rating": 4.8,
                "availability": True,
                "stock_quantity": 2,
                "shipping_cost": 150.0,
                "shipping_time": "1-2 days"
            },
            {
                "plant_id": 5,
                "source": "facebook_marketplace",
                "source_url": "https://facebook.com/marketplace",
                "price": 6500.0,
                "currency": "THB",
                "plant_size": "medium",
                "pot_size": "6\"",
                "condition": "new",
                "seller_location": "Phuket",
                "seller_name": "Phuket Plant Paradise",
                "seller_rating": 4.6,
                "availability": True,
                "stock_quantity": 1,
                "shipping_cost": 200.0,
                "shipping_time": "3-5 days"
            }
        ]
        
        for price_item in price_data:
            price = PlantPrice(**price_item)
            db.add(price)
        
        db.commit()
        print(f"✅ เพิ่มราคา: {len(price_data)} รายการ")
        
        print("\n📊 สรุปข้อมูลปัจจุบัน:")
        total_plants = db.query(Plant).count()
        total_prices = db.query(PlantPrice).count()
        print(f"  - พืชทั้งหมด: {total_plants} ชนิด")
        print(f"  - ราคาทั้งหมด: {total_prices} รายการ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_real_plants() 