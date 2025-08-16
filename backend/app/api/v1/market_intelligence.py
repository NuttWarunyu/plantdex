"""
Market Intelligence API Endpoints for PlantDex
Core market intelligence and investment analysis functionality
"""
from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional, Dict, Any
import psycopg2
import json
import os
from datetime import datetime, timedelta
from decimal import Decimal
from pydantic import BaseModel

router = APIRouter()

# Database connection
def get_db_connection():
    """Get database connection"""
    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/plantdex')
    return psycopg2.connect(database_url)

# Pydantic models
class MarketIntelligenceDaily(BaseModel):
    date: str
    plantdx_index: float
    total_market_value: int
    daily_volume: int
    sentiment_score: float
    top_mover_plant_id: Optional[int]
    top_mover_change_pct: Optional[float]
    market_cap_change_pct: Optional[float]
    volatility_index: Optional[float]

class PlantInvestmentScore(BaseModel):
    id: int
    plant_id: int
    investment_score: float
    roi_potential_12m: Optional[float]
    risk_level: str
    liquidity_score: float
    trend_direction: str
    market_cap: Optional[int]
    price_volatility: Optional[float]
    demand_score: Optional[float]
    supply_score: Optional[float]
    last_updated: str

class MarketOpportunity(BaseModel):
    id: int
    plant_id: int
    opportunity_type: str
    confidence_score: float
    potential_upside_pct: float
    time_horizon_days: int
    risk_assessment: Optional[str]
    market_conditions: Optional[str]
    detected_at: str
    expires_at: Optional[str]
    is_active: bool

class MarketAnalysis(BaseModel):
    plant_id: int
    analysis_date: str
    price_at_analysis: float
    volume_at_analysis: Optional[int]
    market_sentiment: Optional[str]
    technical_indicators: Optional[Dict[str, Any]]
    fundamental_analysis: Optional[Dict[str, Any]]
    ai_predictions: Optional[Dict[str, Any]]
    accuracy_score: Optional[float]

class MarketSentiment(BaseModel):
    timestamp: str
    overall_sentiment: float
    bullish_percentage: Optional[float]
    bearish_percentage: Optional[float]
    neutral_percentage: Optional[float]
    market_fear_greed_index: Optional[float]
    volatility_measure: Optional[float]
    volume_trend: Optional[str]
    price_trend: Optional[str]

# Market Intelligence Core Functions
def calculate_plantdx_index() -> float:
    """Calculate PlantDx Index based on market data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get latest market data
        cursor.execute("""
            SELECT plantdx_index, total_market_value, daily_volume
            FROM market_intelligence_daily 
            ORDER BY date DESC 
            LIMIT 1
        """)
        
        result = cursor.fetchone()
        if result:
            return float(result[0])
        else:
            # Return default index if no data
            return 1250.0
            
    except Exception as e:
        print(f"Error calculating PlantDx Index: {e}")
        return 1250.0
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def detect_investment_opportunities() -> List[Dict[str, Any]]:
    """Detect investment opportunities using AI algorithms"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get active opportunities
        cursor.execute("""
            SELECT mo.*, p.name as plant_name
            FROM market_opportunities mo
            JOIN shopee_products p ON mo.plant_id = p.id
            WHERE mo.is_active = TRUE
            ORDER BY mo.confidence_score DESC
            LIMIT 10
        """)
        
        opportunities = []
        for row in cursor.fetchall():
            opportunities.append({
                'id': row[0],
                'plant_id': row[1],
                'plant_name': row[8],
                'opportunity_type': row[2],
                'confidence_score': float(row[3]),
                'potential_upside_pct': float(row[4]),
                'time_horizon_days': row[5],
                'risk_assessment': row[6],
                'market_conditions': row[7]
            })
        
        return opportunities
        
    except Exception as e:
        print(f"Error detecting opportunities: {e}")
        return []
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

def generate_market_sentiment() -> Dict[str, Any]:
    """Generate market sentiment analysis"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get recent sentiment data
        cursor.execute("""
            SELECT sentiment_score, market_cap_change_pct, volatility_index
            FROM market_intelligence_daily 
            ORDER BY date DESC 
            LIMIT 7
        """)
        
        results = cursor.fetchall()
        if not results:
            return {'sentiment': 'neutral', 'confidence': 0.0}
        
        # Calculate average sentiment
        avg_sentiment = sum(float(r[0]) for r in results) / len(results)
        avg_market_change = sum(float(r[1] or 0) for r in results) / len(results)
        avg_volatility = sum(float(r[2] or 0) for r in results) / len(results)
        
        # Determine sentiment
        if avg_sentiment > 0.3:
            sentiment = 'bullish'
        elif avg_sentiment < -0.3:
            sentiment = 'bearish'
        else:
            sentiment = 'neutral'
        
        return {
            'sentiment': sentiment,
            'sentiment_score': avg_sentiment,
            'market_change_pct': avg_market_change,
            'volatility': avg_volatility,
            'confidence': 0.85  # Mock confidence score
        }
        
    except Exception as e:
        print(f"Error generating sentiment: {e}")
        return {'sentiment': 'neutral', 'confidence': 0.0}
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# API Endpoints
@router.get("/index", response_model=Dict[str, Any])
async def get_plantdx_index():
    """Get current PlantDx Index and market metrics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get latest index data
        cursor.execute("""
            SELECT plantdx_index, total_market_value, daily_volume, 
                   sentiment_score, market_cap_change_pct, volatility_index
            FROM market_intelligence_daily 
            ORDER BY date DESC 
            LIMIT 1
        """)
        
        result = cursor.fetchone()
        if not result:
            raise HTTPException(status_code=404, detail="No market data available")
        
        # Get previous day for change calculation
        cursor.execute("""
            SELECT plantdx_index, total_market_value
            FROM market_intelligence_daily 
            ORDER BY date DESC 
            LIMIT 2
        """)
        
        previous_results = cursor.fetchall()
        current_data = result
        
        # Calculate changes
        index_change_pct = 0.0
        market_cap_change_pct = 0.0
        
        if len(previous_results) > 1:
            previous_data = previous_results[1]
            index_change_pct = ((current_data[0] - previous_data[0]) / previous_data[0]) * 100
            market_cap_change_pct = ((current_data[1] - previous_data[1]) / previous_data[1]) * 100
        
        return {
            "plantdx_index": float(current_data[0]),
            "total_market_value": current_data[1],
            "daily_volume": current_data[2],
            "sentiment_score": float(current_data[3]),
            "market_cap_change_pct": float(current_data[4] or 0),
            "volatility_index": float(current_data[5] or 0),
            "index_change_pct": round(index_change_pct, 2),
            "market_cap_change_pct": round(market_cap_change_pct, 2),
            "last_updated": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/opportunities", response_model=List[MarketOpportunity])
async def get_investment_opportunities(
    limit: int = Query(10, ge=1, le=50, description="Number of opportunities to return"),
    opportunity_type: Optional[str] = Query(None, description="Filter by opportunity type")
):
    """Get investment opportunities detected by AI"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build query
        query = """
            SELECT mo.*, p.name as plant_name
            FROM market_opportunities mo
            JOIN shopee_products p ON mo.plant_id = p.id
            WHERE mo.is_active = TRUE
        """
        params = []
        
        if opportunity_type:
            query += " AND mo.opportunity_type = %s"
            params.append(opportunity_type)
        
        query += " ORDER BY mo.confidence_score DESC LIMIT %s"
        params.append(limit)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        opportunities = []
        for row in results:
            opportunities.append(MarketOpportunity(
                id=row[0],
                plant_id=row[1],
                opportunity_type=row[2],
                confidence_score=float(row[3]),
                potential_upside_pct=float(row[4]),
                time_horizon_days=row[5],
                risk_assessment=row[6],
                market_conditions=row[7],
                detected_at=row[8].isoformat() if row[8] else "",
                expires_at=row[9].isoformat() if row[9] else None,
                is_active=row[10]
            ))
        
        return opportunities
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/sentiment", response_model=Dict[str, Any])
async def get_market_sentiment():
    """Get current market sentiment analysis"""
    try:
        sentiment_data = generate_market_sentiment()
        
        # Get additional sentiment metrics
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT COUNT(*) as total_plants,
                   COUNT(CASE WHEN trend_direction = 'UP' THEN 1 END) as up_count,
                   COUNT(CASE WHEN trend_direction = 'DOWN' THEN 1 END) as down_count,
                   COUNT(CASE WHEN trend_direction = 'STABLE' THEN 1 END) as stable_count
            FROM plant_investment_scores
        """)
        
        result = cursor.fetchone()
        if result:
            total_plants = result[0]
            up_percentage = (result[1] / total_plants * 100) if total_plants > 0 else 0
            down_percentage = (result[2] / total_plants * 100) if total_plants > 0 else 0
            stable_percentage = (result[3] / total_plants * 100) if total_plants > 0 else 0
        else:
            up_percentage = down_percentage = stable_percentage = 0
        
        return {
            **sentiment_data,
            "bullish_percentage": round(up_percentage, 2),
            "bearish_percentage": round(down_percentage, 2),
            "neutral_percentage": round(stable_percentage, 2),
            "analysis_timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/top-movers", response_model=List[Dict[str, Any]])
async def get_top_movers(
    limit: int = Query(10, ge=1, le=50, description="Number of top movers to return")
):
    """Get top performing plants by price movement"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get top movers from investment scores
        cursor.execute("""
            SELECT pis.plant_id, p.name, pis.investment_score, 
                   pis.trend_direction, pis.roi_potential_12m,
                   pis.market_cap, pis.price_volatility
            FROM plant_investment_scores pis
            JOIN shopee_products p ON pis.plant_id = p.id
            ORDER BY pis.investment_score DESC
            LIMIT %s
        """, [limit])
        
        top_movers = []
        for row in cursor.fetchall():
            top_movers.append({
                "plant_id": row[0],
                "plant_name": row[1],
                "investment_score": float(row[2]),
                "trend_direction": row[3],
                "roi_potential_12m": float(row[4]) if row[4] else 0,
                "market_cap": row[5],
                "price_volatility": float(row[6]) if row[6] else 0
            })
        
        return top_movers
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.post("/analysis/{plant_id}", response_model=Dict[str, Any])
async def analyze_plant(plant_id: int):
    """Generate comprehensive analysis for a specific plant"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get plant investment score
        cursor.execute("""
            SELECT * FROM plant_investment_scores 
            WHERE plant_id = %s
        """, [plant_id])
        
        investment_score = cursor.fetchone()
        if not investment_score:
            raise HTTPException(status_code=404, detail="Plant not found")
        
        # Get plant details
        cursor.execute("""
            SELECT name, price, category, shop_name, rating
            FROM shopee_products 
            WHERE id = %s
        """, [plant_id])
        
        plant_details = cursor.fetchone()
        if not plant_details:
            raise HTTPException(status_code=404, detail="Plant details not found")
        
        # Generate analysis
        analysis = {
            "plant_id": plant_id,
            "plant_name": plant_details[0],
            "current_price": float(plant_details[1]),
            "category": plant_details[2],
            "shop_name": plant_details[3],
            "rating": float(plant_details[4]) if plant_details[4] else 0,
            "investment_score": float(investment_score[2]),
            "roi_potential_12m": float(investment_score[3]) if investment_score[3] else 0,
            "risk_level": investment_score[4],
            "liquidity_score": float(investment_score[5]),
            "trend_direction": investment_score[6],
            "market_cap": investment_score[7],
            "price_volatility": float(investment_score[8]) if investment_score[8] else 0,
            "analysis_timestamp": datetime.now().isoformat(),
            "recommendation": "HOLD" if float(investment_score[2]) < 7.0 else "BUY",
            "confidence_level": "HIGH" if float(investment_score[2]) > 8.0 else "MEDIUM" if float(investment_score[2]) > 6.0 else "LOW"
        }
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/stats", response_model=Dict[str, Any])
async def get_market_stats():
    """Get comprehensive market statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get various statistics
        stats = {}
        
        # Market intelligence stats
        cursor.execute("SELECT COUNT(*) FROM market_intelligence_daily")
        stats["total_market_days"] = cursor.fetchone()[0]
        
        # Investment scores stats
        cursor.execute("""
            SELECT COUNT(*), AVG(investment_score), COUNT(CASE WHEN risk_level = 'LOW' THEN 1 END)
            FROM plant_investment_scores
        """)
        investment_result = cursor.fetchone()
        stats["total_analyzed_plants"] = investment_result[0]
        stats["average_investment_score"] = float(investment_result[1]) if investment_result[1] else 0
        stats["low_risk_plants"] = investment_result[2]
        
        # Opportunities stats
        cursor.execute("""
            SELECT COUNT(*), COUNT(CASE WHEN is_active = TRUE THEN 1 END)
            FROM market_opportunities
        """)
        opp_result = cursor.fetchone()
        stats["total_opportunities"] = opp_result[0]
        stats["active_opportunities"] = opp_result[1]
        
        # Latest PlantDx Index
        cursor.execute("SELECT plantdx_index FROM market_intelligence_daily ORDER BY date DESC LIMIT 1")
        latest_index = cursor.fetchone()
        stats["current_plantdx_index"] = float(latest_index[0]) if latest_index else 0
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close() 