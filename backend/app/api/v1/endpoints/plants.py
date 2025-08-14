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

@router.get("/search/advanced")
async def search_plants_advanced(
    q: str = Query("", description="Search query"),
    category: Optional[str] = Query(None, description="Plant category"),
    care_level: Optional[str] = Query(None, description="Care level"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """Advanced search plants with filters and pagination"""
    try:
        from sqlalchemy import or_, func
        import math
        
        # Build query
        query = db.query(Plant)
        
        # Text search (fuzzy search)
        if q:
            search_term = f"%{q}%"
            query = query.filter(
                or_(
                    Plant.scientific_name.ilike(search_term),
                    Plant.common_name_th.ilike(search_term),
                    Plant.common_name_en.ilike(search_term),
                    Plant.description_th.ilike(search_term),
                    Plant.description_en.ilike(search_term)
                )
            )
        
        # Category filter
        if category:
            try:
                plant_category = PlantCategory(category)
                query = query.filter(Plant.category == plant_category)
            except ValueError:
                pass  # Invalid category, ignore filter
        
        # Care level filter
        if care_level:
            try:
                plant_care_level = CareLevel(care_level)
                query = query.filter(Plant.care_level == plant_care_level)
            except ValueError:
                pass  # Invalid care level, ignore filter
        
        # Get total count for pagination
        total_count = query.count()
        total_pages = math.ceil(total_count / limit)
        
        # Apply pagination
        offset = (page - 1) * limit
        plants = query.offset(offset).limit(limit).all()
        
        # Format response
        plant_data = []
        for plant in plants:
            plant_data.append({
                "id": plant.id,
                "scientific_name": plant.scientific_name,
                "common_name_th": plant.common_name_th,
                "common_name_en": plant.common_name_en,
                "category": plant.category.value if plant.category else None,
                "care_level": plant.care_level.value if plant.care_level else None,
                "description_th": plant.description_th,
                "description_en": plant.description_en,
                "origin_country": plant.origin_country,
                "water_needs": plant.water_needs,
                "light_needs": plant.light_needs,
                "humidity_needs": plant.humidity_needs,
                "temperature_min": plant.temperature_min,
                "temperature_max": plant.temperature_max,
                "growth_rate": plant.growth_rate,
                "max_height": plant.max_height,
                "max_width": plant.max_width,
                "is_poisonous": plant.is_poisonous,
                "is_rare": plant.is_rare,
                "is_trending": plant.is_trending,
                "investment_score": calculate_investment_score(plant)
            })
        
        return {
            "plants": plant_data,
            "pagination": {
                "page": page,
                "limit": limit,
                "total_count": total_count,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            },
            "filters": {
                "query": q,
                "category": category,
                "care_level": care_level
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/market-data")
async def get_market_data(db: Session = Depends(get_db)):
    """Get market data and trends"""
    try:
        from sqlalchemy import func
        
        # Category distribution
        category_stats = db.query(
            Plant.category, 
            func.count(Plant.id)
        ).group_by(Plant.category).all()
        
        # Care level distribution
        care_level_stats = db.query(
            Plant.care_level, 
            func.count(Plant.id)
        ).group_by(Plant.care_level).all()
        
        # Trending plants
        trending_plants = db.query(Plant).filter(
            Plant.is_trending == True
        ).limit(10).all()
        
        # Rare plants
        rare_plants = db.query(Plant).filter(
            Plant.is_rare == True
        ).limit(10).all()
        
        # Market summary
        total_plants = db.query(Plant).count()
        indoor_plants = db.query(Plant).filter(
            Plant.category == PlantCategory.INDOOR
        ).count()
        outdoor_plants = db.query(Plant).filter(
            Plant.category == PlantCategory.OUTDOOR
        ).count()
        
        return {
            "market_summary": {
                "total_plants": total_plants,
                "indoor_plants": indoor_plants,
                "outdoor_plants": outdoor_plants,
                "market_health": "healthy"
            },
            "category_distribution": {
                str(cat): count for cat, count in category_stats
            },
            "care_level_distribution": {
                str(level): count for level, count in care_level_stats
            },
            "trending_plants": [
                {
                    "id": plant.id,
                    "scientific_name": plant.scientific_name,
                    "common_name_th": plant.common_name_th,
                    "category": plant.category.value if plant.category else None
                }
                for plant in trending_plants
            ],
            "rare_plants": [
                {
                    "id": plant.id,
                    "scientific_name": plant.scientific_name,
                    "common_name_th": plant.common_name_th,
                    "category": plant.category.value if plant.category else None
                }
                for plant in rare_plants
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get market data: {str(e)}")

@router.get("/quick-stats")
async def get_quick_stats(db: Session = Depends(get_db)):
    """Get quick stats for homepage"""
    try:
        total_plants = db.query(Plant).count()
        trending_count = db.query(Plant).filter(Plant.is_trending == True).count()
        rare_count = db.query(Plant).filter(Plant.is_rare == True).count()
        indoor_count = db.query(Plant).filter(Plant.category == PlantCategory.INDOOR).count()
        
        return {
            "total_plants": total_plants,
            "trending_plants": trending_count,
            "rare_plants": rare_count,
            "indoor_plants": indoor_count,
            "market_status": "active",
            "last_updated": "2025-01-27"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get quick stats: {str(e)}")

def calculate_investment_score(plant):
    """Calculate investment score based on plant attributes"""
    score = 50  # Base score
    
    # Rare plants get higher score
    if plant.is_rare:
        score += 20
    
    # Trending plants get higher score
    if plant.is_trending:
        score += 15
    
    # Indoor plants (easier to maintain) get higher score
    if plant.category == PlantCategory.INDOOR:
        score += 10
    
    # Easy care plants get higher score
    if plant.care_level == CareLevel.EASY:
        score += 10
    
    # Normalize score to 0-100
    return min(max(score, 0), 100) 