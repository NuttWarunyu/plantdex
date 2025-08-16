#!/usr/bin/env python3
"""
Collect Shopee Plant Data for PlantDex
Collect plant data from Shopee and store in database
"""

import psycopg2
import os
import json
from datetime import datetime
from dotenv import load_dotenv
from shopee_client import ShopeeClient

# Load environment variables
load_dotenv('../env.production')

class ShopeeDataCollector:
    """Collect and store Shopee plant data"""
    
    def __init__(self):
        self.database_url = os.getenv('DATABASE_URL')
        self.shopee_client = ShopeeClient()
        
        if not self.database_url:
            raise ValueError("DATABASE_URL not found in environment variables")
    
    def connect_db(self):
        """Connect to database"""
        return psycopg2.connect(self.database_url)
    
    def save_product(self, product_data: dict) -> bool:
        """Save product data to database"""
        try:
            conn = self.connect_db()
            cursor = conn.cursor()
            
            # Extract data from Shopee response
            item_id = product_data.get('item_id')
            name = product_data.get('name', '')
            price = product_data.get('price', 0) / 100000  # Convert from Shopee format
            original_price = product_data.get('original_price', 0) / 100000
            category = product_data.get('category_name', '')
            shop_name = product_data.get('shop_name', '')
            shop_id = product_data.get('shop_id')
            rating = product_data.get('item_rating', {}).get('rating_star', 0)
            sold_count = product_data.get('historical_sold', 0)
            view_count = product_data.get('view_count', 0)
            like_count = product_data.get('like_count', 0)
            description = product_data.get('description', '')
            
            # Handle images
            primary_image = ""
            additional_images = []
            
            if product_data.get('images'):
                images = product_data['images']
                if images:
                    primary_image = f"https://cf.shopee.co.th/file/{images[0]}"
                    additional_images = [f"https://cf.shopee.co.th/file/{img}" for img in images[1:]]
            
            # Insert or update product
            cursor.execute("""
                INSERT INTO shopee_products (
                    item_id, name, price, original_price, category, shop_name, 
                    shop_id, rating, sold_count, view_count, like_count, 
                    description, primary_image_url, additional_images, updated_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
                ON CONFLICT (item_id) DO UPDATE SET
                    name = EXCLUDED.name,
                    price = EXCLUDED.price,
                    original_price = EXCLUDED.original_price,
                    category = EXCLUDED.category,
                    shop_name = EXCLUDED.shop_name,
                    rating = EXCLUDED.rating,
                    sold_count = EXCLUDED.sold_count,
                    view_count = EXCLUDED.view_count,
                    like_count = EXCLUDED.like_count,
                    description = EXCLUDED.description,
                    primary_image_url = EXCLUDED.primary_image_url,
                    additional_images = EXCLUDED.additional_images,
                    updated_at = NOW()
                RETURNING id;
            """, (
                item_id, name, price, original_price, category, shop_name,
                shop_id, rating, sold_count, view_count, like_count,
                description, primary_image, json.dumps(additional_images)
            ))
            
            product_id = cursor.fetchone()[0]
            
            # Save price history
            if price > 0:
                cursor.execute("""
                    INSERT INTO price_history (item_id, price, original_price, discount_percentage)
                    VALUES (%s, %s, %s, %s)
                """, (
                    item_id, 
                    price, 
                    original_price,
                    ((original_price - price) / original_price * 100) if original_price > price else 0
                ))
            
            # Save shop info
            if shop_id:
                cursor.execute("""
                    INSERT INTO shopee_shops (shop_id, shop_name, created_at, updated_at)
                    VALUES (%s, %s, NOW(), NOW())
                    ON CONFLICT (shop_id) DO UPDATE SET
                        shop_name = EXCLUDED.shop_name,
                        updated_at = NOW()
                """, (shop_id, shop_name))
            
            conn.commit()
            print(f"✅ Saved product: {name[:50]}... (ID: {product_id})")
            return True
            
        except Exception as e:
            print(f"❌ Error saving product {product_data.get('name', 'Unknown')}: {e}")
            if conn:
                conn.rollback()
            return False
            
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    def collect_plants(self, keywords: list = None, limit_per_keyword: int = 20):
        """Collect plant data for multiple keywords"""
        if keywords is None:
            keywords = [
                "ต้นไม้มีชีวิต",
                "มอนสเตอร่า", 
                "ฟิโลเดนดรอน",
                "แคคตัส",
                "บอนไซ",
                "ไม้ดอก",
                "ไม้ใบ"
            ]
        
        total_collected = 0
        
        for keyword in keywords:
            print(f"\n🔍 Collecting data for keyword: '{keyword}'")
            
            try:
                # Search for plants
                plants = self.shopee_client.search_plants(keyword, limit_per_keyword)
                
                if plants:
                    print(f"📊 Found {len(plants)} products for '{keyword}'")
                    
                    # Save each product
                    for plant in plants:
                        if self.save_product(plant):
                            total_collected += 1
                        
                        # Small delay to avoid rate limiting
                        import time
                        time.sleep(0.1)
                else:
                    print(f"⚠️ No products found for '{keyword}'")
                    
            except Exception as e:
                print(f"❌ Error collecting data for '{keyword}': {e}")
                continue
        
        print(f"\n🎉 Data collection completed!")
        print(f"📊 Total products collected: {total_collected}")
        return total_collected
    
    def get_collection_stats(self):
        """Get statistics about collected data"""
        try:
            conn = self.connect_db()
            cursor = conn.cursor()
            
            # Count products
            cursor.execute("SELECT COUNT(*) FROM shopee_products;")
            total_products = cursor.fetchone()[0]
            
            # Count by category
            cursor.execute("""
                SELECT category, COUNT(*) as count 
                FROM shopee_products 
                GROUP BY category 
                ORDER BY count DESC;
            """)
            category_stats = cursor.fetchall()
            
            # Price range
            cursor.execute("""
                SELECT MIN(price), MAX(price), AVG(price) 
                FROM shopee_products 
                WHERE price > 0;
            """)
            price_stats = cursor.fetchone()
            
            # Recent updates
            cursor.execute("""
                SELECT COUNT(*) 
                FROM shopee_products 
                WHERE updated_at > NOW() - INTERVAL '24 hours';
            """)
            recent_updates = cursor.fetchone()[0]
            
            print(f"\n📊 Collection Statistics:")
            print(f"   Total Products: {total_products}")
            print(f"   Recent Updates (24h): {recent_updates}")
            
            if price_stats[0]:
                print(f"   Price Range: ฿{price_stats[0]:.2f} - ฿{price_stats[1]:.2f}")
                print(f"   Average Price: ฿{price_stats[2]:.2f}")
            
            print(f"\n📋 Products by Category:")
            for category, count in category_stats[:10]:  # Top 10 categories
                print(f"   {category}: {count}")
            
            return {
                'total_products': total_products,
                'recent_updates': recent_updates,
                'category_stats': category_stats,
                'price_stats': price_stats
            }
            
        except Exception as e:
            print(f"❌ Error getting stats: {e}")
            return None
            
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()

def main():
    """Main data collection process"""
    print("🚀 Starting Shopee Plant Data Collection...")
    
    try:
        # Initialize collector
        collector = ShopeeDataCollector()
        
        # Test Shopee connection
        print("🧪 Testing Shopee API connection...")
        if not collector.shopee_client.test_connection():
            print("❌ Shopee API connection failed!")
            return
        
        # Collect data
        print("\n📥 Starting data collection...")
        total_collected = collector.collect_plants()
        
        # Show statistics
        if total_collected > 0:
            collector.get_collection_stats()
        
        print(f"\n🎉 Data collection completed successfully!")
        print(f"📊 Total products collected: {total_collected}")
        
    except Exception as e:
        print(f"❌ Data collection failed: {e}")

if __name__ == "__main__":
    main() 