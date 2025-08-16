"""
InstantBuy API Endpoints for PlantDex
Core functionality for InstantBuy service and transaction management
"""
from fastapi import APIRouter, HTTPException, Query, UploadFile, File, Form
from typing import List, Optional, Dict, Any
import psycopg2
import json
import os
from datetime import datetime, timedelta
from decimal import Decimal
from pydantic import BaseModel
import uuid

router = APIRouter()

# Database connection
def get_db_connection():
    """Get database connection"""
    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:password@localhost:5432/plantdex')
    return psycopg2.connect(database_url)

# Pydantic models
class InstantBuyEvaluation(BaseModel):
    id: int
    photos: List[str]
    ai_plant_identification: Optional[Dict[str, Any]]
    estimated_market_price: Optional[float]
    our_offer_price: Optional[float]
    offer_expires_at: Optional[str]
    evaluation_confidence: Optional[float]
    plant_species: Optional[str]
    plant_condition: Optional[str]
    plant_size: Optional[str]
    estimated_age_months: Optional[int]
    care_requirements: Optional[str]
    created_at: str

class InstantBuyTransaction(BaseModel):
    id: int
    transaction_id: str
    evaluation_id: int
    seller_contact: Dict[str, Any]
    agreed_price: float
    pickup_location: str
    pickup_scheduled_at: Optional[str]
    status: str
    payment_method: Optional[str]
    payment_status: str
    logistics_notes: Optional[str]
    created_at: str

class InstantBuyInventory(BaseModel):
    id: int
    transaction_id: str
    plant_species: str
    condition_score: int
    purchase_price: float
    listing_price: Optional[float]
    status: str
    acquired_at: str
    listed_at: Optional[str]
    sold_at: Optional[str]
    final_sale_price: Optional[float]
    profit_loss: Optional[float]

# Mock AI Plant Identification (replace with real AI service)
def mock_ai_plant_identification(photos: List[str]) -> Dict[str, Any]:
    """Mock AI plant identification - replace with real AI service"""
    import random
    
    plant_species = [
        "Monstera deliciosa",
        "Philodendron pink princess", 
        "Anthurium crystallinum",
        "Alocasia amazonica",
        "Calathea orbifolia"
    ]
    
    conditions = ["EXCELLENT", "GOOD", "FAIR"]
    sizes = ["SMALL", "MEDIUM", "LARGE"]
    
    return {
        "species": random.choice(plant_species),
        "confidence": round(random.uniform(0.75, 0.98), 2),
        "condition": random.choice(conditions),
        "size": random.choice(sizes),
        "estimated_age_months": random.randint(6, 36),
        "care_requirements": "Bright indirect light, moderate watering"
    }

# Mock Price Estimation (replace with real market analysis)
def mock_price_estimation(plant_species: str, condition: str, size: str) -> Dict[str, float]:
    """Mock price estimation - replace with real market analysis"""
    base_prices = {
        "Monstera deliciosa": 1500,
        "Philodendron pink princess": 6000,
        "Anthurium crystallinum": 2500,
        "Alocasia amazonica": 1800,
        "Calathea orbifolia": 1200
    }
    
    condition_multipliers = {
        "EXCELLENT": 1.3,
        "GOOD": 1.0,
        "FAIR": 0.7
    }
    
    size_multipliers = {
        "SMALL": 0.6,
        "MEDIUM": 1.0,
        "LARGE": 1.5
    }
    
    base_price = base_prices.get(plant_species, 1000)
    condition_mult = condition_multipliers.get(condition, 1.0)
    size_mult = size_multipliers.get(size, 1.0)
    
    estimated_price = base_price * condition_mult * size_mult
    our_offer = estimated_price * 0.8  # 20% discount for instant buy
    
    return {
        "estimated_market_price": round(estimated_price, 2),
        "our_offer_price": round(our_offer, 2)
    }

# API Endpoints
@router.post("/evaluate", response_model=InstantBuyEvaluation)
async def evaluate_plant(
    photos: List[UploadFile] = File(...),
    plant_description: Optional[str] = Form(None),
    seller_notes: Optional[str] = Form(None)
):
    """Evaluate a plant for InstantBuy service"""
    try:
        # Process uploaded photos
        photo_urls = []
        for photo in photos:
            # In production, upload to cloud storage and get URLs
            # For now, use mock URLs
            photo_urls.append(f"mock_photo_{uuid.uuid4().hex[:8]}.jpg")
        
        # Mock AI plant identification
        ai_result = mock_ai_plant_identification(photo_urls)
        
        # Mock price estimation
        price_result = mock_price_estimation(
            ai_result["species"], 
            ai_result["condition"], 
            ai_result["size"]
        )
        
        # Calculate offer expiration (24 hours from now)
        offer_expires = datetime.now() + timedelta(hours=24)
        
        # Save evaluation to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO instantbuy_evaluations (
                photos, ai_plant_identification, estimated_market_price,
                our_offer_price, offer_expires_at, evaluation_confidence,
                plant_species, plant_condition, plant_size, estimated_age_months,
                care_requirements
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at;
        """, (
            json.dumps(photo_urls),
            json.dumps(ai_result),
            price_result["estimated_market_price"],
            price_result["our_offer_price"],
            offer_expires,
            ai_result["confidence"],
            ai_result["species"],
            ai_result["condition"],
            ai_result["size"],
            ai_result["estimated_age_months"],
            ai_result["care_requirements"]
        ))
        
        result = cursor.fetchone()
        evaluation_id = result[0]
        created_at = result[1]
        
        conn.commit()
        
        return InstantBuyEvaluation(
            id=evaluation_id,
            photos=photo_urls,
            ai_plant_identification=ai_result,
            estimated_market_price=price_result["estimated_market_price"],
            our_offer_price=price_result["our_offer_price"],
            offer_expires_at=offer_expires.isoformat(),
            evaluation_confidence=ai_result["confidence"],
            plant_species=ai_result["species"],
            plant_condition=ai_result["condition"],
            plant_size=ai_result["size"],
            estimated_age_months=ai_result["estimated_age_months"],
            care_requirements=ai_result["care_requirements"],
            created_at=created_at.isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.post("/offer", response_model=InstantBuyTransaction)
async def create_offer(
    evaluation_id: int = Form(...),
    seller_contact: str = Form(...),  # JSON string
    pickup_location: str = Form(...),
    payment_method: str = Form("CASH")
):
    """Create InstantBuy offer and transaction"""
    try:
        # Parse seller contact
        try:
            contact_data = json.loads(seller_contact)
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid seller contact format")
        
        # Get evaluation details
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT our_offer_price, offer_expires_at
            FROM instantbuy_evaluations 
            WHERE id = %s
        """, [evaluation_id])
        
        evaluation = cursor.fetchone()
        if not evaluation:
            raise HTTPException(status_code=404, detail="Evaluation not found")
        
        offer_price = evaluation[0]
        expires_at = evaluation[1]
        
        # Check if offer is still valid
        if datetime.now() > expires_at:
            raise HTTPException(status_code=400, detail="Offer has expired")
        
        # Generate transaction ID
        transaction_id = f"IB-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        
        # Create transaction
        cursor.execute("""
            INSERT INTO instantbuy_transactions (
                transaction_id, evaluation_id, seller_contact, agreed_price,
                pickup_location, payment_method, status
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, created_at;
        """, (
            transaction_id,
            evaluation_id,
            seller_contact,
            offer_price,
            pickup_location,
            payment_method,
            "PENDING"
        ))
        
        result = cursor.fetchone()
        transaction_id_db = result[0]
        created_at = result[1]
        
        conn.commit()
        
        return InstantBuyTransaction(
            id=transaction_id_db,
            transaction_id=transaction_id,
            evaluation_id=evaluation_id,
            seller_contact=contact_data,
            agreed_price=float(offer_price),
            pickup_location=pickup_location,
            pickup_scheduled_at=None,
            status="PENDING",
            payment_method=payment_method,
            payment_status="PENDING",
            logistics_notes=None,
            created_at=created_at.isoformat()
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Offer creation error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/transactions", response_model=List[InstantBuyTransaction])
async def get_transactions(
    status: Optional[str] = Query(None, description="Filter by transaction status"),
    limit: int = Query(20, ge=1, le=100, description="Number of transactions to return")
):
    """Get InstantBuy transactions"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build query
        query = """
            SELECT id, transaction_id, evaluation_id, seller_contact, agreed_price,
                   pickup_location, pickup_scheduled_at, status, payment_method,
                   payment_status, logistics_notes, created_at
            FROM instantbuy_transactions
        """
        params = []
        
        if status:
            query += " WHERE status = %s"
            params.append(status)
        
        query += " ORDER BY created_at DESC LIMIT %s"
        params.append(limit)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        transactions = []
        for row in results:
            transactions.append(InstantBuyTransaction(
                id=row[0],
                transaction_id=row[1],
                evaluation_id=row[2],
                seller_contact=json.loads(row[3]) if row[3] else {},
                agreed_price=float(row[4]),
                pickup_location=row[5],
                pickup_scheduled_at=row[6].isoformat() if row[6] else None,
                status=row[7],
                payment_method=row[8],
                payment_status=row[9],
                logistics_notes=row[10],
                created_at=row[11].isoformat()
            ))
        
        return transactions
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/inventory", response_model=List[InstantBuyInventory])
async def get_inventory(
    status: Optional[str] = Query(None, description="Filter by inventory status"),
    limit: int = Query(20, ge=1, le=100, description="Number of items to return")
):
    """Get InstantBuy inventory"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build query
        query = """
            SELECT id, transaction_id, plant_species, condition_score, purchase_price,
                   listing_price, status, acquired_at, listed_at, sold_at,
                   final_sale_price, profit_loss
            FROM instantbuy_inventory
        """
        params = []
        
        if status:
            query += " WHERE status = %s"
            params.append(status)
        
        query += " ORDER BY acquired_at DESC LIMIT %s"
        params.append(limit)
        
        cursor.execute(query, params)
        results = cursor.fetchall()
        
        inventory = []
        for row in results:
            inventory.append(InstantBuyInventory(
                id=row[0],
                transaction_id=row[1],
                plant_species=row[2],
                condition_score=row[3],
                purchase_price=float(row[4]),
                listing_price=float(row[5]) if row[5] else None,
                status=row[6],
                acquired_at=row[7].isoformat(),
                listed_at=row[8].isoformat() if row[8] else None,
                sold_at=row[9].isoformat() if row[9] else None,
                final_sale_price=float(row[10]) if row[10] else None,
                profit_loss=float(row[11]) if row[11] else None
            ))
        
        return inventory
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/stats", response_model=Dict[str, Any])
async def get_instantbuy_stats():
    """Get InstantBuy service statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        stats = {}
        
        # Total evaluations
        cursor.execute("SELECT COUNT(*) FROM instantbuy_evaluations")
        stats["total_evaluations"] = cursor.fetchone()[0]
        
        # Total transactions
        cursor.execute("SELECT COUNT(*) FROM instantbuy_transactions")
        stats["total_transactions"] = cursor.fetchone()[0]
        
        # Transaction status breakdown
        cursor.execute("""
            SELECT status, COUNT(*) 
            FROM instantbuy_transactions 
            GROUP BY status
        """)
        status_breakdown = cursor.fetchall()
        stats["transaction_status"] = {status: count for status, count in status_breakdown}
        
        # Total inventory value
        cursor.execute("""
            SELECT SUM(purchase_price) 
            FROM instantbuy_inventory 
            WHERE status IN ('ACQUIRED', 'LISTED')
        """)
        total_value = cursor.fetchone()[0]
        stats["total_inventory_value"] = float(total_value) if total_value else 0
        
        # Profit/loss
        cursor.execute("""
            SELECT SUM(profit_loss) 
            FROM instantbuy_inventory 
            WHERE status = 'SOLD'
        """)
        total_profit = cursor.fetchone()[0]
        stats["total_profit_loss"] = float(total_profit) if total_profit else 0
        
        # Conversion rate
        if stats["total_evaluations"] > 0:
            stats["conversion_rate"] = round((stats["total_transactions"] / stats["total_evaluations"]) * 100, 2)
        else:
            stats["conversion_rate"] = 0
        
        # Average transaction value
        if stats["total_transactions"] > 0:
            cursor.execute("SELECT AVG(agreed_price) FROM instantbuy_transactions")
            avg_value = cursor.fetchone()[0]
            stats["average_transaction_value"] = float(avg_value) if avg_value else 0
        else:
            stats["average_transaction_value"] = 0
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close() 