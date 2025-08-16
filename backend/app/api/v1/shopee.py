"""
Shopee API Endpoints for PlantDex
Provide access to Shopee plant data
"""

from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import psycopg2
import json
import os
from pydantic import BaseModel

router = APIRouter()

# Shopee Affiliate Configuration
SHOPEE_APP_ID = "15394330041"
SHOPEE_AFFILIATE_BASE_URL = "https://shopee.co.th"

# Database connection
def get_db_connection():
    """Get database connection"""
    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres@localhost:5432/plantdex')
    return psycopg2.connect(database_url)

# Pydantic models
class ShopeeProduct(BaseModel):
    id: int
    item_id: int
    name: str
    price: float
    original_price: Optional[float]
    category: Optional[str]
    shop_name: Optional[str]
    rating: Optional[float]
    sold_count: Optional[int]
    view_count: Optional[int]
    like_count: Optional[int]
    description: Optional[str]
    primary_image_url: Optional[str]
    additional_images: Optional[List[str]]
    created_at: str
    updated_at: str
    affiliate_link: Optional[str] = None

class ShopeeProductList(BaseModel):
    products: List[ShopeeProduct]
    total: int
    page: int
    limit: int

def generate_affiliate_link(item_id: int, shop_id: int) -> str:
    """Generate Shopee affiliate link"""
    return f"{SHOPEE_AFFILIATE_BASE_URL}/product/{shop_id}/{item_id}?affiliate_id={SHOPEE_APP_ID}"

@router.get("/products", response_model=ShopeeProductList)
async def get_shopee_products(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    category: Optional[str] = Query(None, description="Filter by category"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price"),
    search: Optional[str] = Query(None, description="Search in product names")
):
    """Get Shopee plant products with pagination and filters"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Build WHERE clause
        where_conditions = []
        params = []
        param_count = 0
        
        if category:
            param_count += 1
            where_conditions.append(f"category = %s")
            params.append(category)
        
        if min_price is not None:
            param_count += 1
            where_conditions.append(f"price >= %s")
            params.append(min_price)
        
        if max_price is not None:
            param_count += 1
            where_conditions.append(f"price <= %s")
            params.append(max_price)
        
        if search:
            param_count += 1
            where_conditions.append(f"name ILIKE %s")
            params.append(f"%{search}%")
        
        where_clause = " AND ".join(where_conditions) if where_conditions else "1=1"
        
        # Count total products
        count_query = f"SELECT COUNT(*) FROM shopee_products WHERE {where_clause}"
        cursor.execute(count_query, params)
        total = cursor.fetchone()[0]
        
        # Calculate offset
        offset = (page - 1) * limit
        
        # Get products
        query = f"""
            SELECT id, item_id, name, price, original_price, category, shop_name,
                   rating, sold_count, view_count, like_count, description,
                   primary_image_url, additional_images, created_at, updated_at, shop_id
            FROM shopee_products 
            WHERE {where_clause}
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        
        cursor.execute(query, params + [limit, offset])
        rows = cursor.fetchall()
        
        # Convert to Pydantic models
        products = []
        for row in rows:
            # Handle additional_images JSON field safely
            additional_images = []
            if row[13]:  # additional_images field
                try:
                    if isinstance(row[13], str):
                        additional_images = json.loads(row[13])
                    elif isinstance(row[13], list):
                        additional_images = row[13]
                    else:
                        additional_images = []
                except (json.JSONDecodeError, TypeError):
                    additional_images = []
            
            # Generate affiliate link
            affiliate_link = generate_affiliate_link(row[1], row[16]) if row[16] else None
            
            product = ShopeeProduct(
                id=row[0],
                item_id=row[1],
                name=row[2],
                price=float(row[3]) if row[3] else 0,
                original_price=float(row[4]) if row[4] else None,
                category=row[5],
                shop_name=row[6],
                rating=float(row[7]) if row[7] else None,
                sold_count=row[8],
                view_count=row[9],
                like_count=row[10],
                description=row[11],
                primary_image_url=row[12],
                additional_images=additional_images,
                created_at=row[14].isoformat() if row[14] else "",
                updated_at=row[15].isoformat() if row[15] else "",
                affiliate_link=affiliate_link
            )
            products.append(product)
        
        return ShopeeProductList(
            products=products,
            total=total,
            page=page,
            limit=limit
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/products/categories")
async def get_shopee_categories():
    """Get all available product categories"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT category, COUNT(*) as count 
            FROM shopee_products 
            WHERE category IS NOT NULL
            GROUP BY category 
            ORDER BY count DESC
        """)
        
        categories = [{"category": row[0], "count": row[1]} for row in cursor.fetchall()]
        
        return {"categories": categories}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/products/stats")
async def get_shopee_stats():
    """Get Shopee products statistics"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Total products
        cursor.execute("SELECT COUNT(*) FROM shopee_products")
        total_products = cursor.fetchone()[0]
        
        # Price statistics
        cursor.execute("""
            SELECT MIN(price), MAX(price), AVG(price), COUNT(*)
            FROM shopee_products 
            WHERE price > 0
        """)
        price_stats = cursor.fetchone()
        
        # Category count
        cursor.execute("SELECT COUNT(DISTINCT category) FROM shopee_products")
        category_count = cursor.fetchone()[0]
        
        # Shop count
        cursor.execute("SELECT COUNT(DISTINCT shop_id) FROM shopee_products")
        shop_count = cursor.fetchone()[0]
        
        stats = {
            "total_products": total_products,
            "category_count": category_count,
            "shop_count": shop_count,
            "price_stats": {
                "min": float(price_stats[0]) if price_stats[0] else 0,
                "max": float(price_stats[1]) if price_stats[1] else 0,
                "average": float(price_stats[2]) if price_stats[2] else 0,
                "count": price_stats[3]
            }
        }
        
        return stats
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@router.get("/products/{item_id}", response_model=ShopeeProduct)
async def get_shopee_product(item_id: int):
    """Get specific Shopee product by item_id"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, item_id, name, price, original_price, category, shop_name,
                   rating, sold_count, view_count, like_count, description,
                   primary_image_url, additional_images, created_at, updated_at, shop_id
            FROM shopee_products 
            WHERE item_id = %s
        """, [item_id])
        
        row = cursor.fetchone()
        
        if not row:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Convert to Pydantic model
        additional_images = []
        if row[13]:  # additional_images field
            try:
                if isinstance(row[13], str):
                    additional_images = json.loads(row[13])
                elif isinstance(row[13], list):
                    additional_images = row[13]
                else:
                    additional_images = []
            except (json.JSONDecodeError, TypeError):
                additional_images = []
        
        # Generate affiliate link
        affiliate_link = generate_affiliate_link(row[1], row[16]) if row[16] else None
        
        product = ShopeeProduct(
            id=row[0],
            item_id=row[1],
            name=row[2],
            price=float(row[3]) if row[3] else 0,
            original_price=float(row[4]) if row[4] else None,
            category=row[5],
            shop_name=row[6],
            rating=float(row[7]) if row[7] else None,
            sold_count=row[8],
            view_count=row[9],
            like_count=row[10],
            description=row[11],
            primary_image_url=row[12],
            additional_images=additional_images,
            created_at=row[14].isoformat() if row[14] else "",
            updated_at=row[15].isoformat() if row[15] else "",
            affiliate_link=affiliate_link
        )
        
        return product
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close() 