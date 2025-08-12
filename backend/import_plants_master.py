#!/usr/bin/env python3
"""
Import Plants from PlantDex Master CSV
นำข้อมูลพืชจากไฟล์ plantdex_master CSV เข้าไปในฐานข้อมูล
"""

import csv
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.plant import Plant, PlantCategory, CareLevel

def import_plants_from_master_csv(db: Session, csv_file: str):
    """นำข้อมูลพืชจาก PlantDex Master CSV"""
    print(f"🌱 นำเข้าข้อมูลพืชจาก {csv_file}...")
    
    # แปลงค่า category ให้ตรงกับ enum
    category_mapping = {
        'indoor': PlantCategory.INDOOR,
        'outdoor': PlantCategory.OUTDOOR,
        'tropical': PlantCategory.TROPICAL,
        'succulent': PlantCategory.SUCCULENT,
        'cactus': PlantCategory.CACTUS,
        'orchid': PlantCategory.ORCHID,
        'herb': PlantCategory.HERB,
        'tree': PlantCategory.TREE,
        'shrub': PlantCategory.SHRUB,
        'vine': PlantCategory.VINE,
        'garden': PlantCategory.GARDEN,
        'water': PlantCategory.WATER,
        'rock': PlantCategory.ROCK,
        'border': PlantCategory.BORDER,
        'other': PlantCategory.OTHER
    }
    
    # แปลงค่า care_level ให้ตรงกับ enum
    care_level_mapping = {
        'easy': CareLevel.EASY,
        'moderate': CareLevel.MODERATE,
        'difficult': CareLevel.DIFFICULT
    }
    
    # แปลงค่า boolean
    def parse_boolean(value):
        if isinstance(value, str):
            return value.lower() in ['true', '1', 'yes', 'y']
        return bool(value)
    
    # แปลงค่า numeric
    def parse_float(value):
        try:
            return float(value) if value else 0.0
        except (ValueError, TypeError):
            return 0.0
    
    plants_added = 0
    plants_skipped = 0
    
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                # ตรวจสอบว่าพืชมีอยู่แล้วหรือไม่ (ใช้ชื่อวิทยาศาสตร์)
                existing_plant = db.query(Plant).filter(
                    Plant.scientific_name == row['scientific_name']
                ).first()
                
                if existing_plant:
                    print(f"  ⚠️  พืชมีอยู่แล้ว: {row['scientific_name']} ข้ามไป")
                    plants_skipped += 1
                    continue
                
                # แปลงค่า category
                csv_category = row['category'].lower()
                mapped_category = category_mapping.get(csv_category, PlantCategory.OTHER)
                
                # แปลงค่า care_level
                csv_care_level = row['care_level'].lower()
                mapped_care_level = care_level_mapping.get(csv_care_level, CareLevel.MODERATE)
                
                # สร้างพืชใหม่
                plant = Plant(
                    scientific_name=row['scientific_name'],
                    common_name_th=row['common_name_th'],
                    common_name_en=row['common_name_en'],
                    category=mapped_category,
                    care_level=mapped_care_level,
                    origin_country=row['origin_country'],
                    description_th=row['description_th'],
                    description_en=row['description_en'],
                    care_instructions=row['care_instructions'],
                    water_needs=row['water_needs'],
                    light_needs=row['light_needs'],
                    humidity_needs=row['humidity_needs'],
                    temperature_min=parse_float(row['temperature_min']),
                    temperature_max=parse_float(row['temperature_max']),
                    growth_rate=row['growth_rate'],
                    max_height=parse_float(row['max_height']),
                    max_width=parse_float(row['max_width']),
                    is_poisonous=parse_boolean(row['is_poisonous']),
                    is_rare=parse_boolean(row['is_rare']),
                    is_trending=parse_boolean(row['is_trending'])
                )
                
                db.add(plant)
                plants_added += 1
                print(f"  ✅ เพิ่มพืช: {row['common_name_th']} ({row['scientific_name']})")
                
            except Exception as e:
                print(f"  ❌ เกิดข้อผิดพลาดกับพืช: {row.get('scientific_name', 'Unknown')} - {e}")
                continue
    
    try:
        db.commit()
        print(f"\n🎯 นำเข้าพืชเสร็จสิ้น!")
        print(f"  ✅ เพิ่มพืชใหม่: {plants_added} ต้น")
        print(f"  ⚠️  ข้ามพืชที่มีอยู่: {plants_skipped} ต้น")
        print(f"  📊 รวมพืชในฐานข้อมูล: {db.query(Plant).count()} ต้น")
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาดในการ commit: {e}")
        db.rollback()

def main():
    """ฟังก์ชันหลัก"""
    csv_file = "plant_data/plantdex_master_1-118.csv"
    
    if not os.path.exists(csv_file):
        print(f"❌ ไม่พบไฟล์: {csv_file}")
        return
    
    db = SessionLocal()
    try:
        import_plants_from_master_csv(db, csv_file)
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main() 