from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Optional
from datetime import date, timedelta
from app.core.database import get_db
from app.models.market import MarketTrend, PlantPriceIndex, TrendingPlant
from app.models.plant import Plant
from app.models.price import PlantPrice

router = APIRouter()

@router.get("/trends")
def get_market_trends(
    week_start: Optional[date] = None,
    plant_id: Optional[int] = None,
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Get market trends for plants"""
    query = db.query(MarketTrend)
    
    if week_start:
        query = query.filter(MarketTrend.week_start == week_start)
    
    if plant_id:
        query = query.filter(MarketTrend.plant_id == plant_id)
    
    trends = query.order_by(desc(MarketTrend.week_start)).limit(limit).all()
    
    return {
        "trends": trends,
        "total_count": len(trends)
    }

@router.get("/price-index")
def get_price_index(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get Plant Price Index data"""
    query = db.query(PlantPriceIndex)
    
    if date_from:
        query = query.filter(PlantPriceIndex.index_date >= date_from)
    
    if date_to:
        query = query.filter(PlantPriceIndex.index_date <= date_to)
    
    indices = query.order_by(desc(PlantPriceIndex.index_date)).all()
    
    return {
        "price_indices": indices,
        "total_count": len(indices)
    }

@router.get("/trending")
def get_trending_plants(
    week_start: Optional[date] = None,
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Get trending plants ranking"""
    if not week_start:
        # Default to current week
        week_start = date.today() - timedelta(days=date.today().weekday())
    
    trending = db.query(TrendingPlant).filter(
        TrendingPlant.week_start == week_start
    ).order_by(TrendingPlant.rank).limit(limit).all()
    
    return {
        "week_start": week_start,
        "trending_plants": trending,
        "total_count": len(trending)
    }

@router.get("/price-analysis")
def get_price_analysis(
    plant_id: Optional[int] = None,
    category: Optional[str] = None,
    location: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get comprehensive price analysis"""
    query = db.query(PlantPrice)
    
    if plant_id:
        query = query.filter(PlantPrice.plant_id == plant_id)
    
    if location:
        query = query.filter(PlantPrice.seller_location.ilike(f"%{location}%"))
    
    prices = query.all()
    
    if not prices:
        return {"message": "No price data found"}
    
    # Calculate price statistics
    price_values = [p.price for p in prices]
    avg_price = sum(price_values) / len(price_values)
    min_price = min(price_values)
    max_price = max(price_values)
    
    # Group by source
    sources = {}
    for price in prices:
        if price.source not in sources:
            sources[price.source] = []
        sources[price.source].append(price.price)
    
    source_stats = {}
    for source, source_prices in sources.items():
        source_stats[source] = {
            "count": len(source_prices),
            "avg_price": sum(source_prices) / len(source_prices),
            "min_price": min(source_prices),
            "max_price": max(source_prices)
        }
    
    return {
        "overall_stats": {
            "total_records": len(prices),
            "avg_price": round(avg_price, 2),
            "min_price": min_price,
            "max_price": max_price,
            "price_range": max_price - min_price
        },
        "by_source": source_stats,
        "location_filter": location,
        "plant_id_filter": plant_id
    }

@router.get("/demand-forecast")
def get_demand_forecast(
    plant_id: int,
    weeks_ahead: int = Query(4, ge=1, le=12),
    db: Session = Depends(get_db)
):
    """Get demand forecast for a specific plant"""
    # Get historical trends
    trends = db.query(MarketTrend).filter(
        MarketTrend.plant_id == plant_id
    ).order_by(desc(MarketTrend.week_start)).limit(8).all()
    
    if not trends:
        raise HTTPException(status_code=404, detail="No trend data found for this plant")
    
    # Simple forecasting based on recent trends
    recent_demand = [t.demand_score for t in trends[:4] if t.demand_score]
    recent_supply = [t.supply_score for t in trends[:4] if t.supply_score]
    
    if not recent_demand:
        return {"message": "Insufficient data for forecasting"}
    
    # Calculate trend
    avg_demand = sum(recent_demand) / len(recent_demand)
    avg_supply = sum(recent_supply) / len(recent_supply) if recent_supply else 50
    
    # Simple linear projection
    demand_trend = (recent_demand[0] - recent_demand[-1]) / len(recent_demand) if len(recent_demand) > 1 else 0
    
    forecast = []
    current_date = date.today()
    
    for week in range(1, weeks_ahead + 1):
        forecast_date = current_date + timedelta(weeks=week)
        projected_demand = max(0, min(100, avg_demand + (demand_trend * week)))
        
        forecast.append({
            "week": forecast_date,
            "projected_demand": round(projected_demand, 1),
            "supply_score": avg_supply,
            "demand_supply_ratio": round(projected_demand / avg_supply, 2) if avg_supply > 0 else 0
        })
    
    return {
        "plant_id": plant_id,
        "forecast_periods": weeks_ahead,
        "current_demand": avg_demand,
        "current_supply": avg_supply,
        "trend_direction": "increasing" if demand_trend > 0 else "decreasing" if demand_trend < 0 else "stable",
        "forecast": forecast
    } 