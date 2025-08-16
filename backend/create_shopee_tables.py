#!/usr/bin/env python3
"""
Create Shopee Database Tables for PlantDex
Simple tables to get started with Shopee data collection
"""

import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def create_shopee_tables():
    """Create basic tables for Shopee plant data"""
    
    # Database connection - use Railway database
    DATABASE_URL = "postgresql://postgres:password@localhost:5432/plantdex"
    
    # Try to get from environment first
    if os.getenv('DATABASE_URL'):
        DATABASE_URL = os.getenv('DATABASE_URL')
        print("✅ Using DATABASE_URL from environment")
    else:
        print("⚠️ Using local database fallback")
    
    conn = None
    cursor = None
    
    try:
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("✅ Connected to database successfully")
        
        # 1. Shopee Products Table (ข้อมูลหลัก)
        print("🔨 Creating shopee_products table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS shopee_products (
                id SERIAL PRIMARY KEY,
                item_id BIGINT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                price DECIMAL(10,2),
                original_price DECIMAL(10,2),
                category VARCHAR(100),
                shop_name VARCHAR(200),
                shop_id BIGINT,
                rating DECIMAL(2,1),
                sold_count INTEGER DEFAULT 0,
                view_count INTEGER DEFAULT 0,
                like_count INTEGER DEFAULT 0,
                description TEXT,
                primary_image_url TEXT,
                additional_images JSON,
                item_status VARCHAR(20) DEFAULT 'NORMAL',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # 2. Price History Table (ดูเทรนด์ราคา)
        print("🔨 Creating price_history table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS price_history (
                id SERIAL PRIMARY KEY,
                item_id BIGINT NOT NULL,
                price DECIMAL(10,2) NOT NULL,
                original_price DECIMAL(10,2),
                discount_percentage DECIMAL(5,2),
                recorded_at TIMESTAMP DEFAULT NOW(),
                
                FOREIGN KEY (item_id) REFERENCES shopee_products(item_id)
            );
        """)
        
        # 3. Shop Information Table
        print("🔨 Creating shopee_shops table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS shopee_shops (
                id SERIAL PRIMARY KEY,
                shop_id BIGINT UNIQUE NOT NULL,
                shop_name VARCHAR(200) NOT NULL,
                shop_location VARCHAR(100),
                shop_verified BOOLEAN DEFAULT FALSE,
                response_rate INTEGER,
                response_time INTEGER,
                follower_count INTEGER DEFAULT 0,
                shop_rating DECIMAL(2,1),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Create indexes for better performance
        print("🔨 Creating indexes...")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_shopee_item_id ON shopee_products(item_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_shopee_category ON shopee_products(category);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_shopee_price ON shopee_products(price);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_shopee_shop_id ON shopee_products(shop_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_price_history_item ON price_history(item_id, recorded_at);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_shopee_shops_id ON shopee_shops(shop_id);")
        
        # Commit changes
        conn.commit()
        
        print("✅ All tables created successfully!")
        
        # Show table info
        cursor.execute("""
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'shopee%'
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        print("\n📊 Created tables:")
        for table in tables:
            print(f"   - {table[0]} ({table[1]})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        if conn:
            conn.rollback()
        return False
        
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🚀 Creating Shopee Database Tables for PlantDex...")
    success = create_shopee_tables()
    
    if success:
        print("\n🎉 Database setup completed!")
        print("📋 Next steps:")
        print("   1. Test Shopee API connection")
        print("   2. Collect initial plant data")
        print("   3. Display data in frontend")
    else:
        print("\n❌ Database setup failed!") 