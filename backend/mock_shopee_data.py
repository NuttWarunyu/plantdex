#!/usr/bin/env python3
"""
Mock Shopee Data for PlantDex Testing
Generate realistic plant data for development and testing
"""

import psycopg2
import json
import random
from datetime import datetime, timedelta
from decimal import Decimal

class MockShopeeDataGenerator:
    """Generate mock Shopee plant data for testing"""
    
    def __init__(self, database_url):
        self.database_url = database_url
        
        # Sample plant data
        self.plant_names = [
            "มอนสเตอร่า เดลิซิโอซา",
            "ฟิโลเดนดรอน พิงค์ พรินเซส",
            "แคคตัส บอล",
            "บอนไซ ต้นไทร",
            "ไม้ดอก กล้วยไม้",
            "ไม้ใบ ครอตัน",
            "ไม้เลื้อย พลู",
            "ไม้ประดับ เงินไหลมา",
            "ไม้มงคล ว่านหางจระเข้",
            "ไม้หายาก แมมมิลลาเรีย"
        ]
        
        self.categories = [
            "ไม้ในร่ม", "ไม้นอกบ้าน", "ไม้เมืองร้อน", 
            "ไม้อวบน้ำ", "ไม้ดอก", "ไม้ใบ", "ไม้เลื้อย"
        ]
        
        self.shop_names = [
            "ร้านต้นไม้สวย", "สวนพฤกษชาติ", "บ้านสวนไม้ประดับ",
            "ร้านต้นไม้มงคล", "สวนไม้หายาก", "บ้านต้นไม้"
        ]
    
    def connect_db(self):
        """Connect to database"""
        return psycopg2.connect(self.database_url)
    
    def generate_mock_products(self, count=50):
        """Generate mock plant products"""
        products = []
        
        for i in range(count):
            # Generate realistic data
            item_id = 1000000 + i
            name = random.choice(self.plant_names)
            price = round(random.uniform(50, 5000), 2)
            original_price = price * random.uniform(1.0, 1.3)
            category = random.choice(self.categories)
            shop_name = random.choice(self.shop_names)
            shop_id = 10000 + random.randint(1, 100)
            rating = round(random.uniform(3.5, 5.0), 1)
            sold_count = random.randint(0, 500)
            view_count = random.randint(10, 2000)
            like_count = random.randint(0, 100)
            
            # Generate description
            descriptions = [
                f"ต้นไม้สวยงาม {name} สภาพดี ดูแลง่าย เหมาะสำหรับตกแต่งบ้าน",
                f"{name} ต้นแข็งแรง ใบสวย ราคาเป็นมิตร",
                f"ต้นไม้มงคล {name} นำโชคเข้าบ้าน ดูแลง่าย",
                f"{name} ต้นไม้หายาก สวยงาม ราคาพิเศษ"
            ]
            description = random.choice(descriptions)
            
            # Generate image URLs
            primary_image = f"https://example.com/images/plant_{item_id}_1.jpg"
            additional_images = [
                f"https://example.com/images/plant_{item_id}_2.jpg",
                f"https://example.com/images/plant_{item_id}_3.jpg"
            ]
            
            product = {
                'item_id': item_id,
                'name': name,
                'price': price,
                'original_price': original_price,
                'category': category,
                'shop_name': shop_name,
                'shop_id': shop_id,
                'rating': rating,
                'sold_count': sold_count,
                'view_count': view_count,
                'like_count': like_count,
                'description': description,
                'primary_image_url': primary_image,
                'additional_images': additional_images
            }
            
            products.append(product)
        
        return products
    
    def insert_mock_data(self, count=50):
        """Insert mock data into database"""
        try:
            conn = self.connect_db()
            cursor = conn.cursor()
            
            print(f"🔨 Generating {count} mock plant products...")
            products = self.generate_mock_products(count)
            
            inserted_count = 0
            
            for product in products:
                try:
                    # Insert product
                    cursor.execute("""
                        INSERT INTO shopee_products (
                            item_id, name, price, original_price, category, shop_name, 
                            shop_id, rating, sold_count, view_count, like_count, 
                            description, primary_image_url, additional_images
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (item_id) DO UPDATE SET
                            name = EXCLUDED.name,
                            price = EXCLUDED.price,
                            updated_at = NOW()
                        RETURNING id;
                    """, (
                        product['item_id'], product['name'], product['price'], 
                        product['original_price'], product['category'], product['shop_name'],
                        product['shop_id'], product['rating'], product['sold_count'], 
                        product['view_count'], product['like_count'], product['description'],
                        product['primary_image_url'], json.dumps(product['additional_images'])
                    ))
                    
                    product_id = cursor.fetchone()[0]
                    
                    # Insert price history
                    cursor.execute("""
                        INSERT INTO price_history (item_id, price, original_price, discount_percentage)
                        VALUES (%s, %s, %s, %s)
                    """, (
                        product['item_id'], 
                        product['price'], 
                        product['original_price'],
                        ((product['original_price'] - product['price']) / product['original_price'] * 100) if product['original_price'] > product['price'] else 0
                    ))
                    
                    # Insert shop info
                    cursor.execute("""
                        INSERT INTO shopee_shops (shop_id, shop_name)
                        VALUES (%s, %s)
                        ON CONFLICT (shop_id) DO UPDATE SET
                            shop_name = EXCLUDED.shop_name,
                            updated_at = NOW()
                    """, (product['shop_id'], product['shop_name']))
                    
                    inserted_count += 1
                    print(f"✅ Inserted: {product['name'][:30]}... (฿{product['price']})")
                    
                except Exception as e:
                    print(f"❌ Error inserting product {product['name']}: {e}")
                    continue
            
            conn.commit()
            print(f"\n🎉 Mock data insertion completed!")
            print(f"📊 Total products inserted: {inserted_count}")
            
            return inserted_count
            
        except Exception as e:
            print(f"❌ Error inserting mock data: {e}")
            if conn:
                conn.rollback()
            return 0
            
        finally:
            if cursor:
                cursor.close()
            if conn:
                conn.close()
    
    def show_database_stats(self):
        """Show statistics about the database"""
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
            
            print(f"\n📊 Database Statistics:")
            print(f"   Total Products: {total_products}")
            
            if price_stats[0]:
                print(f"   Price Range: ฿{price_stats[0]:.2f} - ฿{price_stats[1]:.2f}")
                print(f"   Average Price: ฿{price_stats[2]:.2f}")
            
            print(f"\n📋 Products by Category:")
            for category, count in category_stats:
                print(f"   {category}: {count}")
            
            return {
                'total_products': total_products,
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
    """Main function to generate mock data"""
    print("🚀 Generating Mock Shopee Plant Data...")
    
    # Database URL
    database_url = "postgresql://postgres@localhost:5432/plantdex"
    
    # Initialize generator
    generator = MockShopeeDataGenerator(database_url)
    
    # Generate mock data
    count = 50  # Generate 50 products
    inserted = generator.insert_mock_data(count)
    
    if inserted > 0:
        # Show statistics
        generator.show_database_stats()
        
        print(f"\n🎉 Mock data generation completed!")
        print(f"📊 Ready to display {inserted} products in frontend")
    else:
        print("\n❌ Mock data generation failed!")

if __name__ == "__main__":
    main() 