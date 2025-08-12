#!/usr/bin/env python3
"""
Clear and Import CSV Data to Database
ลบข้อมูลเก่าและนำข้อมูลใหม่จากไฟล์ CSV เข้าไปในฐานข้อมูล
"""

import csv
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.plant import Plant
from app.models.plant_detailed import (
    PlantImage, PlantPropagation, PlantPestDisease, 
    PlantSeasonalInfo, PlantShippingInfo, PlantPriceDetailed
)
from app.models.user import Seller, User
from app.models.market import MarketTrend, PlantPriceIndex, TrendingPlant

def clear_all_data(db: Session):
    """ลบข้อมูลทั้งหมดออกจากฐานข้อมูล"""
    print("🗑️ ลบข้อมูลเก่าออกจากฐานข้อมูล...")
    
    try:
        # ลบข้อมูลตามลำดับ (ลบ child ก่อน parent)
        db.query(PlantPriceDetailed).delete()
        db.query(PlantShippingInfo).delete()
        db.query(PlantSeasonalInfo).delete()
        db.query(PlantPestDisease).delete()
        db.query(PlantPropagation).delete()
        db.query(PlantImage).delete()
        db.query(MarketTrend).delete()
        db.query(TrendingPlant).delete()
        db.query(PlantPriceIndex).delete()
        db.query(Plant).delete()
        db.query(Seller).delete()
        db.query(User).delete()
        
        db.commit()
        print("  ✅ ลบข้อมูลเก่าเสร็จสิ้น")
        
    except Exception as e:
        print(f"  ❌ เกิดข้อผิดพลาดในการลบข้อมูล: {e}")
        db.rollback()
        raise

def import_plants_from_csv(db: Session, csv_file: str):
    """นำข้อมูลพืชจาก CSV"""
    print(f"🌱 นำเข้าข้อมูลพืชจาก {csv_file}...")
    
    # แปลงค่า category ให้ตรงกับ enum
    category_mapping = {
        'Aroid': 'TROPICAL',
        'Prayer Plant': 'TROPICAL',
        'Hoya': 'TROPICAL',
        'Caladium': 'TROPICAL',
        'Aglaonema': 'TROPICAL'
    }
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # แปลงค่า category
            csv_category = row['category']
            mapped_category = category_mapping.get(csv_category, 'TROPICAL')
            print(f"  🔍 แปลง category: '{csv_category}' -> '{mapped_category}'")
                
            plant = Plant(
                id=int(row['id']),
                scientific_name=row['scientific_name'],
                common_name_th=row['common_name'],
                common_name_en=row['common_name'],
                category=mapped_category,
                care_level='moderate',  # default value
                origin_country='Thailand',  # default value
                description_th=row['notes'],
                description_en=row['notes'],
                care_instructions=f"แสง: {row['light']}, น้ำ: {row['water']}, ความชื้น: {row['humidity']}, อุณหภูมิ: {row['temp_min_c']}-{row['temp_max_c']}°C, ดิน: {row['soil']}",
                water_needs=row['water'],
                light_needs=row['light'],
                humidity_needs=row['humidity'],
                temperature_min=float(row['temp_min_c']),
                temperature_max=float(row['temp_max_c']),
                growth_rate='moderate',  # default value
                max_height=100.0,  # default value
                max_width=50.0,  # default value
                is_poisonous=False,  # default value
                is_rare=int(row['rarity_score']) >= 7,
                is_trending=int(row['trending_score']) >= 7
            )
            db.add(plant)
            print(f"  ✅ เพิ่มพืช: {row['common_name']}")
    
    db.commit()
    print(f"  🎯 นำเข้าพืชเสร็จสิ้น")

def import_plant_images_from_csv(db: Session, csv_file: str):
    """นำข้อมูลรูปภาพพืชจาก CSV"""
    print(f"🖼️ นำเข้าข้อมูลรูปภาพพืชจาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            image = PlantImage(
                plant_id=int(row['plant_id']),
                image_type=row['image_type'],
                image_url=row['image_url'],
                image_alt=row['image_alt'],
                image_order=int(row['image_order']),
                is_primary=row['is_primary'].lower() == 'true'
            )
            db.add(image)
            print(f"  ✅ เพิ่มรูปภาพ: {row['image_alt']}")
    
    db.commit()
    print(f"  🎯 นำเข้ารูปภาพเสร็จสิ้น")

def import_plant_propagations_from_csv(db: Session, csv_file: str):
    """นำข้อมูลการขยายพันธุ์จาก CSV"""
    print(f"🌱 นำเข้าข้อมูลการขยายพันธุ์จาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            propagation = PlantPropagation(
                plant_id=int(row['plant_id']),
                method=row['method'],
                difficulty=row['difficulty'],
                success_rate=float(row['success_rate']) if row['success_rate'] else None,
                time_to_root=int(row['time_to_root']) if row['time_to_root'] else None,
                best_season=row['best_season'],
                instructions=row['instructions'],
                tools_needed=row['tools_needed']
            )
            db.add(propagation)
            print(f"  ✅ เพิ่มการขยายพันธุ์: {row['method']} สำหรับพืช {row['plant_id']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลการขยายพันธุ์เสร็จสิ้น")

def import_plant_pest_diseases_from_csv(db: Session, csv_file: str):
    """นำข้อมูลโรคและแมลงจาก CSV"""
    print(f"🐛 นำเข้าข้อมูลโรคและแมลงจาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            pest = PlantPestDisease(
                plant_id=int(row['plant_id']),
                pest_or_disease=row['pest_or_disease'],
                type=row['type'],
                symptoms=row['symptoms'],
                prevention=row['prevention'],
                treatment=row['treatment'],
                severity=row['severity'],
                season_risk=row['season_risk']
            )
            db.add(pest)
            print(f"  ✅ เพิ่มโรค/แมลง: {row['pest_or_disease']} สำหรับพืช {row['plant_id']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลโรคและแมลงเสร็จสิ้น")

def import_plant_seasonal_infos_from_csv(db: Session, csv_file: str):
    """นำข้อมูลฤดูกาลจาก CSV"""
    print(f"🌸 นำเข้าข้อมูลฤดูกาลจาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            seasonal = PlantSeasonalInfo(
                plant_id=int(row['plant_id']),
                best_planting_season=row['best_planting_season'],
                blooming_season=row['blooming_season'],
                dormancy_period=row['dormancy_period'],
                seasonal_care=row['seasonal_care'],
                seasonal_watering=row['seasonal_watering'],
                seasonal_fertilizing=row['seasonal_fertilizing']
            )
            db.add(seasonal)
            print(f"  ✅ เพิ่มข้อมูลฤดูกาลสำหรับพืช {row['plant_id']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลฤดูกาลเสร็จสิ้น")

def import_plant_shipping_infos_from_csv(db: Session, csv_file: str):
    """นำข้อมูลการขนส่งจาก CSV"""
    print(f"📦 นำเข้าข้อมูลการขนส่งจาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            shipping = PlantShippingInfo(
                plant_id=int(row['plant_id']),
                fragility_level=row['fragility_level'],
                packaging_requirements=row['packaging_requirements'],
                max_shipping_distance=int(row['max_shipping_distance']) if row['max_shipping_distance'] else None,
                shipping_preparation=row['shipping_preparation'],
                special_handling=row['special_handling'],
                temperature_control=row['temperature_control'] == 'cool_pack_if>32C',
                humidity_control=row['humidity_control'] == 'moist_wrap'
            )
            db.add(shipping)
            print(f"  ✅ เพิ่มข้อมูลการขนส่งสำหรับพืช {row['plant_id']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลการขนส่งเสร็จสิ้น")

def import_plant_prices_detailed_from_csv(db: Session, csv_file: str):
    """นำข้อมูลราคาแบบละเอียดจาก CSV"""
    print(f"💰 นำเข้าข้อมูลราคาแบบละเอียดจาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            price = PlantPriceDetailed(
                plant_id=int(row['plant_id']),
                seller_id=int(row['seller_id']),
                base_price=float(row['base_price']),
                currency=row['currency'],
                price_type=row['price_type'],
                height=float(row['height']) if row['height'] else None,
                width=float(row['width']) if row['width'] else None,
                pot_size=row['pot_size'],
                leaf_count=int(row['leaf_count']) if row['leaf_count'] else None,
                maturity_level=row['maturity_level'],
                quality_grade=row['quality_grade'],
                variegation_level=row['variegation_level'],
                health_score=float(row['health_score']) if row['health_score'] else None,
                seasonal_multiplier=float(row['seasonal_multiplier']) if row['seasonal_multiplier'] else None,
                peak_season=row['peak_season'],
                off_season=row['off_season'],
                province=row['province'],
                city=row['city'],
                local_market_factor=float(row['local_market_factor']) if row['local_market_factor'] else None,
                platform=row['platform'],
                seller_type=row['seller_type'],
                verification_status=row['verification_status'],
                rating=float(row['rating']) if row['rating'] else None,
                review_count=int(row['review_count']) if row['review_count'] else None
            )
            db.add(price)
            print(f"  ✅ เพิ่มราคา: {row['base_price']} {row['currency']} สำหรับพืช {row['plant_id']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลราคาเสร็จสิ้น")

def import_sellers_from_csv(db: Session, csv_file: str):
    """นำข้อมูลผู้ขายจาก CSV"""
    print(f"🏪 นำเข้าข้อมูลผู้ขายจาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            # สร้าง User ก่อน
            user = User(
                id=int(row['seller_id']),
                email=f"seller{row['seller_id']}@example.com",
                username=f"seller{row['seller_id']}",
                hashed_password="dummy_hash",  # dummy value
                full_name=row['seller_name'],
                phone="",  # empty for now
                location=row['province'],
                province=row['province'],
                is_verified=True,
                is_active=True
            )
            db.add(user)
            
            # สร้าง Seller
            seller = Seller(
                id=int(row['seller_id']),
                user_id=int(row['seller_id']),
                business_name=row['seller_name'],
                business_type=row['seller_type'],
                business_license=row['business_license'],
                description=f"ผู้ขาย {row['seller_name']} ประเภท {row['seller_type']}",
                address=row['province'],
                city=row['province'],
                province=row['province'],
                postal_code="",
                phone="",
                website="",
                social_media="",
                rating=4.0,  # default value
                total_reviews=0,
                total_sales=0,
                total_plants_listed=0,
                is_verified=True
            )
            db.add(seller)
            print(f"  ✅ เพิ่มผู้ขาย: {row['seller_name']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลผู้ขายเสร็จสิ้น")

def main():
    """ฟังก์ชันหลัก"""
    print("🚀 เริ่มต้นการลบข้อมูลเก่าและนำเข้าข้อมูลใหม่จากไฟล์ CSV...")
    
    db = SessionLocal()
    try:
        # ลบข้อมูลเก่าก่อน
        clear_all_data(db)
        
        # นำเข้าข้อมูลใหม่ตามลำดับ
        import_sellers_from_csv(db, 'sellers.csv')
        import_plants_from_csv(db, 'plants.csv')
        import_plant_images_from_csv(db, 'plant_images.csv')
        import_plant_propagations_from_csv(db, 'plant_propagations.csv')
        import_plant_pest_diseases_from_csv(db, 'plant_pest_diseases.csv')
        import_plant_seasonal_infos_from_csv(db, 'plant_seasonal_infos.csv')
        import_plant_shipping_infos_from_csv(db, 'plant_shipping_infos.csv')
        import_plant_prices_detailed_from_csv(db, 'plant_prices_detailed.csv')
        
        print("\n🎉 การลบข้อมูลเก่าและนำเข้าข้อมูลใหม่เสร็จสิ้น!")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main() 