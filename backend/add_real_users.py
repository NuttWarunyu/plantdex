#!/usr/bin/env python3
"""
Add real user and seller data to PlantDex
เพิ่มข้อมูลผู้ใช้และผู้ขายจริง
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.user import User, Seller
from app.core.security import get_password_hash
from datetime import datetime
import json

def add_real_users():
    """เพิ่มข้อมูลผู้ใช้และผู้ขายจริง"""
    db = SessionLocal()
    
    try:
        print("👥 เพิ่มข้อมูลผู้ใช้และผู้ขายจริง...")
        
        # ผู้ใช้จริง
        real_users = [
            {
                "username": "plant_collector_th",
                "email": "info@plantcollectorthailand.com",
                "full_name": "Plant Collector Thailand",
                "phone": "+66-2-123-4567",
                "location": "Bangkok",
                "province": "Bangkok",
                "is_active": True,
                "is_verified": True
            },
            {
                "username": "rare_plant_shop",
                "email": "contact@rareplantshop.co.th",
                "full_name": "Rare Plant Shop",
                "phone": "+66-53-234-5678",
                "location": "Chiang Mai",
                "province": "Chiang Mai",
                "is_active": True,
                "is_verified": True
            },
            {
                "username": "bangkok_nursery",
                "email": "sales@bangkoknursery.co.th",
                "full_name": "Bangkok Rare Plant Nursery",
                "phone": "+66-2-345-6789",
                "location": "Bangkok",
                "province": "Bangkok",
                "is_active": True,
                "is_verified": True
            },
            {
                "username": "phuket_paradise",
                "email": "hello@phuketplantparadise.com",
                "full_name": "Phuket Plant Paradise",
                "phone": "+66-76-456-7890",
                "location": "Phuket",
                "province": "Phuket",
                "is_active": True,
                "is_verified": True
            }
        ]
        
        new_users = []
        for user_data in real_users:
            # ตรวจสอบว่ามีผู้ใช้นี้อยู่แล้วหรือไม่
            existing_user = db.query(User).filter(
                (User.username == user_data["username"]) | 
                (User.email == user_data["email"])
            ).first()
            
            if existing_user:
                print(f"⚠️  มีอยู่แล้ว: {user_data['full_name']}")
                continue
            
            # สร้างผู้ใช้ใหม่
            user_data["hashed_password"] = get_password_hash("password123")
            user_data["created_at"] = datetime.utcnow()
            user_data["updated_at"] = datetime.utcnow()
            
            user = User(**user_data)
            db.add(user)
            new_users.append(user)
        
        db.commit()
        print(f"\n🎉 เพิ่มผู้ใช้ใหม่สำเร็จ: {len(new_users)} คน")
        
        # เพิ่มข้อมูลผู้ขาย
        print("\n🏪 เพิ่มข้อมูลผู้ขาย...")
        
        sellers_data = [
            {
                "user_id": 1,  # Plant Collector Thailand
                "business_name": "Plant Collector Thailand",
                "business_type": "retailer",
                "business_license": "BKK-2024-001",
                "description": "ผู้เชี่ยวชาญด้านพืชหายากและพืชประดับในประเทศไทย",
                "address": "123 Sukhumvit Road, Khlong Toei, Bangkok 10110",
                "city": "Bangkok",
                "province": "Bangkok",
                "postal_code": "10110",
                "phone": "+66-2-123-4567",
                "website": "https://plantcollectorthailand.com",
                "social_media": json.dumps({
                    "facebook": "PlantCollectorThailand",
                    "instagram": "plantcollectorth",
                    "line": "plantcollectorth"
                }),
                "rating": 4.9,
                "total_reviews": 150,
                "total_sales": 150,
                "total_plants_listed": 45,
                "is_verified": True,
                "verification_date": datetime.utcnow()
            },
            {
                "user_id": 2,  # Rare Plant Shop
                "business_name": "Rare Plant Shop",
                "business_type": "retailer",
                "business_license": "CM-2024-002",
                "description": "ร้านพืชหายากและพืชประดับในเชียงใหม่",
                "address": "456 Nimman Road, Suthep, Chiang Mai 50200",
                "city": "Chiang Mai",
                "province": "Chiang Mai",
                "postal_code": "50200",
                "phone": "+66-53-234-5678",
                "website": "https://rareplantshop.co.th",
                "social_media": json.dumps({
                    "facebook": "RarePlantShopCM",
                    "instagram": "rareplantshopcm",
                    "line": "rareplantshop"
                }),
                "rating": 4.7,
                "total_reviews": 89,
                "total_sales": 89,
                "total_plants_listed": 32,
                "is_verified": True,
                "verification_date": datetime.utcnow()
            },
            {
                "user_id": 3,  # Bangkok Nursery
                "business_name": "Bangkok Rare Plant Nursery",
                "business_type": "nursery",
                "business_license": "BKK-2024-003",
                "description": "สวนเพาะชำพืชหายากและพืชประดับในกรุงเทพฯ",
                "address": "789 Ladphrao Road, Chatuchak, Bangkok 10900",
                "city": "Bangkok",
                "province": "Bangkok",
                "postal_code": "10900",
                "phone": "+66-2-345-6789",
                "website": "https://bangkoknursery.co.th",
                "social_media": json.dumps({
                    "facebook": "BangkokRarePlantNursery",
                    "instagram": "bangkoknursery",
                    "line": "bangkoknursery"
                }),
                "rating": 4.8,
                "total_reviews": 234,
                "total_sales": 234,
                "total_plants_listed": 78,
                "is_verified": True,
                "verification_date": datetime.utcnow()
            },
            {
                "user_id": 4,  # Phuket Paradise
                "business_name": "Phuket Plant Paradise",
                "business_type": "retailer",
                "business_license": "PKT-2024-004",
                "description": "สวนสวรรค์แห่งพืชในภูเก็ต",
                "address": "321 Patong Road, Patong, Phuket 83150",
                "city": "Phuket",
                "province": "Phuket",
                "postal_code": "83150",
                "phone": "+66-76-456-7890",
                "website": "https://phuketplantparadise.com",
                "social_media": json.dumps({
                    "facebook": "PhuketPlantParadise",
                    "instagram": "phuketplantparadise",
                    "line": "phuketparadise"
                }),
                "rating": 4.6,
                "total_reviews": 67,
                "total_sales": 67,
                "total_plants_listed": 28,
                "is_verified": True,
                "verification_date": datetime.utcnow()
            }
        ]
        
        new_sellers = []
        for seller_data in sellers_data:
            # ตรวจสอบว่ามีผู้ขายนี้อยู่แล้วหรือไม่
            existing_seller = db.query(Seller).filter(
                Seller.user_id == seller_data["user_id"]
            ).first()
            
            if existing_seller:
                print(f"⚠️  มีผู้ขายอยู่แล้ว: {seller_data['business_name']}")
                continue
            
            seller_data["created_at"] = datetime.utcnow()
            seller_data["updated_at"] = datetime.utcnow()
            
            seller = Seller(**seller_data)
            db.add(seller)
            new_sellers.append(seller)
        
        db.commit()
        print(f"✅ เพิ่มผู้ขาย: {len(new_sellers)} รายการ")
        
        print("\n📊 สรุปข้อมูลปัจจุบัน:")
        total_users = db.query(User).count()
        total_sellers = db.query(Seller).count()
        print(f"  - ผู้ใช้ทั้งหมด: {total_users} คน")
        print(f"  - ผู้ขายทั้งหมด: {total_sellers} คน")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_real_users() 