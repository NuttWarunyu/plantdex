#!/usr/bin/env python3
"""
Import CSV Data to Database
นำข้อมูลจากไฟล์ CSV เข้าไปในฐานข้อมูล
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
from app.models.user import Seller
from app.models.market import MarketTrend, PlantPriceIndex, TrendingPlant

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
            # ตรวจสอบว่าพืชมีอยู่แล้วหรือไม่
            existing_plant = db.query(Plant).filter(Plant.id == int(row['id'])).first()
            if existing_plant:
                print(f"  ⚠️  พืช ID {row['id']} มีอยู่แล้ว ข้ามไป")
                continue
            
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
            # ตรวจสอบว่าพืชมีอยู่หรือไม่
            plant = db.query(Plant).filter(Plant.id == int(row['plant_id'])).first()
            if not plant:
                print(f"  ⚠️  ไม่พบพืช ID {row['plant_id']} ข้ามไป")
                continue
                
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
            plant = db.query(Plant).filter(Plant.id == int(row['plant_id'])).first()
            if not plant:
                print(f"  ⚠️  ไม่พบพืช ID {row['plant_id']} ข้ามไป")
                continue
                
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
            plant = db.query(Plant).filter(Plant.id == int(row['plant_id'])).first()
            if not plant:
                print(f"  ⚠️  ไม่พบพืช ID {row['plant_id']} ข้ามไป")
                continue
                
            pest = PlantPestDisease(
                plant_id=int(row['plant_id']),
                pest_name=row['pest_name'],
                pest_type=row['pest_type'],
                symptoms=row['symptoms'],
                prevention_methods=row['prevention_methods'],
                treatment_methods=row['treatment_methods'],
                severity_level=row['severity_level'],
                risk_season=row['risk_season']
            )
            db.add(pest)
            print(f"  ✅ เพิ่มโรค/แมลง: {row['pest_name']} สำหรับพืช {row['plant_id']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลโรคและแมลงเสร็จสิ้น")

def import_plant_seasonal_infos_from_csv(db: Session, csv_file: str):
    """นำข้อมูลฤดูกาลจาก CSV"""
    print(f"🌸 นำเข้าข้อมูลฤดูกาลจาก {csv_file}...")
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            plant = db.query(Plant).filter(Plant.id == int(row['plant_id'])).first()
            if not plant:
                print(f"  ⚠️  ไม่พบพืช ID {row['plant_id']} ข้ามไป")
                continue
                
            seasonal = PlantSeasonalInfo(
                plant_id=int(row['plant_id']),
                growing_season=row['growing_season'],
                flowering_season=row['flowering_season'],
                dormancy_season=row['dormancy_season'],
                seasonal_care_notes=row['seasonal_care_notes'],
                watering_frequency=row['watering_frequency'],
                fertilizing_schedule=row['fertilizing_schedule']
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
            plant = db.query(Plant).filter(Plant.id == int(row['plant_id'])).first()
            if not plant:
                print(f"  ⚠️  ไม่พบพืช ID {row['plant_id']} ข้ามไป")
                continue
                
            shipping = PlantShippingInfo(
                plant_id=int(row['plant_id']),
                fragility_level=row['fragility_level'],
                packaging_requirements=row['packaging_requirements'],
                max_distance_km=int(row['max_distance_km']) if row['max_distance_km'] else None,
                preparation_time_days=int(row['preparation_time_days']) if row['preparation_time_days'] else None,
                special_handling=row['special_handling']
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
            plant = db.query(Plant).filter(Plant.id == int(row['plant_id'])).first()
            if not plant:
                print(f"  ⚠️  ไม่พบพืช ID {row['plant_id']} ข้ามไป")
                continue
                
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
            # ตรวจสอบว่าผู้ขายมีอยู่แล้วหรือไม่
            existing_seller = db.query(Seller).filter(Seller.id == int(row['seller_id'])).first()
            if existing_seller:
                print(f"  ⚠️  ผู้ขาย ID {row['seller_id']} มีอยู่แล้ว ข้ามไป")
                continue
                
            seller = Seller(
                id=int(row['seller_id']),
                name=row['seller_name'],
                seller_type=row['seller_type'],
                registration_number=row['registration_number'],
                tax_id=row['tax_id'],
                business_license=row['business_license'],
                license_expiry=datetime.strptime(row['license_expiry'], '%Y-%m-%d').date() if row['license_expiry'] != 'not_provided' else None,
                business_years=int(row['business_years']) if row['business_years'] else None,
                employee_count=row['employee_count'],
                annual_revenue=row['annual_revenue'],
                business_hours=row['business_hours'],
                production_capacity=row['production_capacity'],
                quality_certifications=row['quality_certifications'],
                organic_certified=row['organic_certified'].lower() == 'true',
                channels=row['channels'],
                location=row['province']
            )
            db.add(seller)
            print(f"  ✅ เพิ่มผู้ขาย: {row['seller_name']}")
    
    db.commit()
    print(f"  🎯 นำเข้าข้อมูลผู้ขายเสร็จสิ้น")

def main():
    """ฟังก์ชันหลัก"""
    print("🚀 เริ่มต้นการนำเข้าข้อมูลจากไฟล์ CSV...")
    
    db = SessionLocal()
    try:
        # นำเข้าข้อมูลตามลำดับ
        import_plants_from_csv(db, 'plants.csv')
        import_sellers_from_csv(db, 'sellers.csv')
        import_plant_images_from_csv(db, 'plant_images.csv')
        import_plant_propagations_from_csv(db, 'plant_propagations.csv')
        import_plant_pest_diseases_from_csv(db, 'plant_pest_diseases.csv')
        import_plant_seasonal_infos_from_csv(db, 'plant_seasonal_infos.csv')
        import_plant_shipping_infos_from_csv(db, 'plant_shipping_infos.csv')
        import_plant_prices_detailed_from_csv(db, 'plant_prices_detailed.csv')
        
        print("\n🎉 การนำเข้าข้อมูลเสร็จสิ้น!")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main() 