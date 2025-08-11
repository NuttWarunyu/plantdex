from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.plant import Plant, PlantCategory, CareLevel
from app.schemas.plant import PlantResponse, PlantCreate, PlantUpdate
from app.models.price import PlantPrice

router = APIRouter()

@router.get("/", response_model=List[PlantResponse])
def get_plants(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[PlantCategory] = None,
    care_level: Optional[CareLevel] = None,
    search: Optional[str] = None,
    trending: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all plants with optional filtering"""
    query = db.query(Plant)
    
    if category:
        query = query.filter(Plant.category == category)
    
    if care_level:
        query = query.filter(Plant.care_level == care_level)
    
    if trending is not None:
        query = query.filter(Plant.is_trending == trending)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Plant.common_name_th.ilike(search_filter)) |
            (Plant.common_name_en.ilike(search_filter)) |
            (Plant.scientific_name.ilike(search_filter))
        )
    
    plants = query.offset(skip).limit(limit).all()
    return plants

@router.get("/{plant_id}", response_model=PlantResponse)
def get_plant(plant_id: int, db: Session = Depends(get_db)):
    """Get a specific plant by ID"""
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant

@router.get("/{plant_id}/prices")
def get_plant_prices(plant_id: int, db: Session = Depends(get_db)):
    """Get all prices for a specific plant"""
    plant = db.query(Plant).filter(Plant.id == plant_id).first()
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    
    prices = db.query(PlantPrice).filter(PlantPrice.plant_id == plant_id).all()
    return {
        "plant": plant,
        "prices": prices,
        "price_summary": {
            "min_price": min([p.price for p in prices]) if prices else None,
            "max_price": max([p.price for p in prices]) if prices else None,
            "avg_price": sum([p.price for p in prices]) / len(prices) if prices else None,
            "total_sources": len(prices)
        }
    }

@router.get("/categories/{category}", response_model=List[PlantResponse])
def get_plants_by_category(
    category: PlantCategory,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get plants by category"""
    plants = db.query(Plant).filter(Plant.category == category).offset(skip).limit(limit).all()
    return plants

@router.get("/trending/list")
def get_trending_plants(db: Session = Depends(get_db)):
    """Get trending plants"""
    trending_plants = db.query(Plant).filter(Plant.is_trending == True).all()
    return {
        "trending_plants": trending_plants,
        "total_count": len(trending_plants)
    }

@router.get("/search/suggestions")
def get_search_suggestions(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get search suggestions for plants"""
    if len(q) < 2:
        return {"suggestions": []}
    
    search_filter = f"%{q}%"
    suggestions = db.query(Plant).filter(
        (Plant.common_name_th.ilike(search_filter)) |
        (Plant.common_name_en.ilike(search_filter)) |
        (Plant.scientific_name.ilike(search_filter))
    ).limit(limit).all()
    
    return {
        "query": q,
        "suggestions": [
            {
                "id": plant.id,
                "common_name_th": plant.common_name_th,
                "common_name_en": plant.common_name_en,
                "scientific_name": plant.scientific_name,
                "category": plant.category.value
            }
            for plant in suggestions
        ]
    } 