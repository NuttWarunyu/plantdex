from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.plant import Plant, PlantCategory, CareLevel
from app.schemas.plant import PlantCreate, PlantUpdate
import csv
import os
from typing import List, Dict, Any

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/plants/import-csv")
async def import_plants_from_csv(
    db: Session = Depends(get_db)
):
    """Import plants from CSV file"""
    try:
        print("🌱 เริ่ม import ข้อมูลพืชจาก CSV...")
        
        # อ่านข้อมูลจาก CSV
        csv_file = 'plant_data/plantdex_master_1-118.csv'
        
        if not os.path.exists(csv_file):
            raise HTTPException(status_code=404, detail=f"CSV file not found: {csv_file}")
        
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
            'shrub': PlantCategory.SHRUB,  # เพิ่ม shrub
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
                    # ตรวจสอบว่าพืชมีอยู่แล้วหรือไม่
                    existing_plant = db.query(Plant).filter(
                        Plant.scientific_name == row['scientific_name']
                    ).first()
                    
                    if existing_plant:
                        plants_skipped += 1
                        continue
                    
                    # แปลงค่า category
                    csv_category = row['category'].lower()
                    mapped_category = category_mapping.get(csv_category, PlantCategory.OTHER)
                    
                    # Debug logging
                    print(f"DEBUG: CSV category: '{csv_category}' -> Mapped: {mapped_category}")
                    
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
                    
                except Exception as e:
                    print(f"❌ เกิดข้อผิดพลาดกับพืช: {row.get('scientific_name', 'Unknown')} - {e}")
                    print(f"  Category: {row.get('category', 'N/A')}")
                    print(f"  Care Level: {row.get('care_level', 'N/A')}")
                    continue
            
            db.commit()
            
            total_plants = db.query(Plant).count()
            
            return {
                "message": "Import completed successfully",
                "plants_added": plants_added,
                "plants_skipped": plants_skipped,
                "total_plants": total_plants,
                "status": "success"
            }
            
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

@router.get("/plants/stats")
async def get_plants_stats(db: Session = Depends(get_db)):
    """Get plants statistics"""
    try:
        total_plants = db.query(Plant).count()
        
        # จำนวนพืชตาม category
        category_stats = db.query(Plant.category, db.func.count(Plant.id)).group_by(Plant.category).all()
        category_counts = {str(cat): count for cat, count in category_stats}
        
        # จำนวนพืชตาม care level
        care_level_stats = db.query(Plant.care_level, db.func.count(Plant.id)).group_by(Plant.care_level).all()
        care_level_counts = {str(level): count for level, count in care_level_stats}
        
        # จำนวนพืชที่ rare และ trending
        rare_plants = db.query(Plant).filter(Plant.is_rare == True).count()
        trending_plants = db.query(Plant).filter(Plant.is_trending == True).count()
        
        return {
            "total_plants": total_plants,
            "category_distribution": category_counts,
            "care_level_distribution": care_level_counts,
            "rare_plants": rare_plants,
            "trending_plants": trending_plants,
            "database_status": "healthy"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")

@router.get("/plants/count")
async def get_plants_count(db: Session = Depends(get_db)):
    """Get total plants count"""
    try:
        count = db.query(Plant).count()
        return {"total_plants": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get count: {str(e)}")

@router.post("/plants/clear")
async def clear_all_plants(db: Session = Depends(get_db)):
    """Clear all plants (DANGER!)"""
    try:
        count_before = db.query(Plant).count()
        db.query(Plant).delete()
        db.commit()
        
        return {
            "message": "All plants cleared successfully",
            "plants_deleted": count_before,
            "status": "success"
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear plants: {str(e)}")

@router.get("/plants/sample")
async def get_sample_plants(db: Session = Depends(get_db), limit: int = 5):
    """Get sample plants for testing"""
    try:
        plants = db.query(Plant).limit(limit).all()
        
        sample_data = []
        for plant in plants:
            sample_data.append({
                "id": plant.id,
                "scientific_name": plant.scientific_name,
                "common_name_th": plant.common_name_th,
                "category": plant.category.value if plant.category else None,
                "care_level": plant.care_level.value if plant.care_level else None
            })
        
        return {
            "sample_plants": sample_data,
            "total_returned": len(sample_data),
            "status": "success"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sample plants: {str(e)}")

@router.get("/health/detailed")
async def get_detailed_health(db: Session = Depends(get_db)):
    """Get detailed health status"""
    try:
        # ทดสอบ database connection
        db.execute("SELECT 1")
        
        # จำนวนพืช
        plant_count = db.query(Plant).count()
        
        # จำนวน categories
        category_count = db.query(Plant.category).distinct().count()
        
        return {
            "status": "healthy",
            "database": "connected",
            "plants": plant_count,
            "categories": category_count,
            "timestamp": "2025-08-12T08:18:23.688888Z"
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e),
            "timestamp": "2025-08-12T08:18:23.688888Z"
        } 