#!/usr/bin/env python3
"""
Create detailed tables for PlantDex
สร้างตารางแบบละเอียดสำหรับการเก็บข้อมูลจริง
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, SessionLocal
from app.models.plant_detailed import *
from app.models.plant import Plant
from app.models.user import User, Seller
from app.models.price import PlantPrice
from app.models.market import MarketTrend, PlantPriceIndex, TrendingPlant

def create_detailed_tables():
    """สร้างตารางใหม่ทั้งหมด"""
    print("🔨 สร้างตารางใหม่สำหรับข้อมูลแบบละเอียด...")
    
    try:
        # สร้างตารางใหม่ทั้งหมด
        Base.metadata.create_all(bind=engine)
        print("✅ สร้างตารางใหม่สำเร็จ!")
        
        # แสดงรายการตารางที่สร้าง
        print("\n📋 ตารางที่สร้างใหม่:")
        detailed_tables = [
            "plant_images",
            "plant_propagations", 
            "plant_pest_diseases",
            "plant_seasonal_infos",
            "plant_shipping_infos",
            "plant_prices_detailed",
            "seller_business_details",
            "seller_shipping_policies",
            "seller_warranty_policies", 
            "seller_payment_policies",
            "seller_reviews",
            "trade_data",
            "demand_supply_data",
            "geographic_data",
            "digital_data"
        ]
        
        for table in detailed_tables:
            print(f"  - {table}")
            
        print(f"\n🎯 รวม {len(detailed_tables)} ตารางใหม่")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        return False
    
    return True

def verify_tables():
    """ตรวจสอบว่าตารางถูกสร้างแล้ว"""
    print("\n🔍 ตรวจสอบตารางที่สร้าง...")
    
    try:
        db = SessionLocal()
        
        # ตรวจสอบตารางหลัก
        from sqlalchemy import inspect
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        print(f"📊 ตารางที่มีอยู่ทั้งหมด: {len(existing_tables)} ตาราง")
        
        # แสดงตารางที่สำคัญ
        important_tables = [
            "plants", "plant_prices", "users", "sellers",
            "plant_images", "plant_propagations", "plant_prices_detailed"
        ]
        
        for table in important_tables:
            if table in existing_tables:
                print(f"  ✅ {table}")
            else:
                print(f"  ❌ {table}")
        
        db.close()
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาดในการตรวจสอบ: {e}")

def show_sample_data_structure():
    """แสดงโครงสร้างข้อมูลตัวอย่าง"""
    print("\n📝 โครงสร้างข้อมูลตัวอย่าง:")
    
    print("\n🌱 ข้อมูลพืชแบบละเอียด:")
    print("  - รูปภาพ: plant_images (main, gallery, care_guide)")
    print("  - การขยายพันธุ์: plant_propagations (method, difficulty, success_rate)")
    print("  - โรคและแมลง: plant_pest_diseases (type, symptoms, prevention)")
    print("  - ฤดูกาล: plant_seasonal_infos (planting, blooming, dormancy)")
    print("  - การขนส่ง: plant_shipping_infos (fragility, packaging, distance)")
    
    print("\n💰 ข้อมูลราคาแบบละเอียด:")
    print("  - ขนาด: height, width, pot_size, leaf_count, maturity")
    print("  - คุณภาพ: quality_grade, variegation_level, health_score")
    print("  - ฤดูกาล: seasonal_multiplier, peak_season, off_season")
    print("  - ภูมิภาค: province, city, local_market_factor")
    print("  - แหล่งขาย: platform, seller_type, verification_status")
    
    print("\n🏪 ข้อมูลผู้ขายแบบละเอียด:")
    print("  - ธุรกิจ: business_details (license, tax_id, years, revenue)")
    print("  - การจัดส่ง: shipping_policies (methods, zones, free_threshold)")
    print("  - การรับประกัน: warranty_policies (period, coverage, conditions)")
    print("  - การชำระเงิน: payment_policies (methods, installment, discounts)")
    print("  - รีวิว: seller_reviews (rating, categories, verified_purchase)")
    
    print("\n📊 ข้อมูลตลาดและภูมิศาสตร์:")
    print("  - การค้า: trade_data (import/export, country, quantity, value)")
    print("  - อุปสงค์-อุปทาน: demand_supply_data (search, social, stock, volatility)")
    print("  - ภูมิศาสตร์: geographic_data (climate, soil, cultivation)")
    print("  - ดิจิทัล: digital_data (social, search, influencer, news)")

if __name__ == "__main__":
    print("🚀 PlantDex - สร้างตารางข้อมูลแบบละเอียด")
    print("=" * 50)
    
    # สร้างตาราง
    if create_detailed_tables():
        # ตรวจสอบตาราง
        verify_tables()
        
        # แสดงโครงสร้างข้อมูล
        show_sample_data_structure()
        
        print("\n🎉 เสร็จสิ้น! ตารางใหม่พร้อมใช้งานแล้ว")
        print("\n💡 ขั้นตอนต่อไป:")
        print("  1. ใช้ ChatGPT หาข้อมูลพืชหายากในประเทศไทย")
        print("  2. รันสคริปต์ add_detailed_data.py เพื่อเพิ่มข้อมูล")
        print("  3. อัปเดต frontend เพื่อแสดงข้อมูลใหม่")
        
    else:
        print("❌ การสร้างตารางล้มเหลว")
        sys.exit(1) 