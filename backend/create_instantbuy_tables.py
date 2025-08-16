#!/usr/bin/env python3
"""
Create InstantBuy Database Tables for PlantDex
Core tables for InstantBuy service and transaction management
"""
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def create_instantbuy_tables():
    """Create core tables for InstantBuy service"""
    
    # Database connection
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
        
        # 1. InstantBuy Evaluations Table
        print("🔨 Creating instantbuy_evaluations table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS instantbuy_evaluations (
                id SERIAL PRIMARY KEY,
                photos JSON NOT NULL,
                ai_plant_identification JSON,
                estimated_market_price DECIMAL(10,2),
                our_offer_price DECIMAL(10,2),
                offer_expires_at TIMESTAMP,
                evaluation_confidence DECIMAL(3,2),
                plant_species VARCHAR(100),
                plant_condition VARCHAR(50),
                plant_size VARCHAR(50),
                estimated_age_months INTEGER,
                care_requirements TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # 2. InstantBuy Transactions Table
        print("🔨 Creating instantbuy_transactions table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS instantbuy_transactions (
                id SERIAL PRIMARY KEY,
                transaction_id VARCHAR(20) UNIQUE NOT NULL,
                evaluation_id INTEGER NOT NULL,
                seller_contact JSON NOT NULL,
                agreed_price DECIMAL(10,2) NOT NULL,
                pickup_location TEXT NOT NULL,
                pickup_scheduled_at TIMESTAMP,
                status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, COMPLETED, CANCELLED
                payment_method VARCHAR(20),
                payment_status VARCHAR(20) DEFAULT 'PENDING',
                logistics_notes TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW(),
                
                FOREIGN KEY (evaluation_id) REFERENCES instantbuy_evaluations(id)
            );
        """)
        
        # 3. InstantBuy Inventory Table
        print("🔨 Creating instantbuy_inventory table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS instantbuy_inventory (
                id SERIAL PRIMARY KEY,
                transaction_id VARCHAR(20) NOT NULL,
                plant_species VARCHAR(100) NOT NULL,
                condition_score INTEGER NOT NULL, -- 1-10 scale
                purchase_price DECIMAL(10,2) NOT NULL,
                listing_price DECIMAL(10,2),
                status VARCHAR(20) NOT NULL DEFAULT 'ACQUIRED', -- ACQUIRED, LISTED, SOLD, DISPOSED
                acquired_at TIMESTAMP DEFAULT NOW(),
                listed_at TIMESTAMP,
                sold_at TIMESTAMP,
                final_sale_price DECIMAL(10,2),
                profit_loss DECIMAL(10,2),
                notes TEXT,
                
                FOREIGN KEY (transaction_id) REFERENCES instantbuy_transactions(transaction_id)
            );
        """)
        
        # 4. InstantBuy Price History Table
        print("🔨 Creating instantbuy_price_history table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS instantbuy_price_history (
                id SERIAL PRIMARY KEY,
                plant_species VARCHAR(100) NOT NULL,
                price_date DATE NOT NULL,
                market_price DECIMAL(10,2) NOT NULL,
                our_buy_price DECIMAL(10,2) NOT NULL,
                our_sell_price DECIMAL(10,2),
                profit_margin_pct DECIMAL(5,2),
                volume_traded INTEGER,
                market_demand VARCHAR(20), -- HIGH, MEDIUM, LOW
                seasonal_factor DECIMAL(3,2), -- 0.5 to 2.0
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # 5. InstantBuy Analytics Table
        print("🔨 Creating instantbuy_analytics table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS instantbuy_analytics (
                id SERIAL PRIMARY KEY,
                date DATE NOT NULL,
                total_evaluations INTEGER DEFAULT 0,
                total_transactions INTEGER DEFAULT 0,
                total_inventory_value DECIMAL(12,2) DEFAULT 0,
                total_profit_loss DECIMAL(12,2) DEFAULT 0,
                average_profit_margin DECIMAL(5,2) DEFAULT 0,
                top_performing_species VARCHAR(100),
                conversion_rate DECIMAL(5,2) DEFAULT 0, -- evaluations to transactions
                average_transaction_value DECIMAL(10,2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Create indexes for better performance
        print("🔨 Creating indexes...")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_instantbuy_eval_created ON instantbuy_evaluations(created_at);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_instantbuy_trans_status ON instantbuy_transactions(status);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_instantbuy_trans_id ON instantbuy_transactions(transaction_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_instantbuy_inv_status ON instantbuy_inventory(status);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_instantbuy_inv_species ON instantbuy_inventory(plant_species);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_instantbuy_price_species_date ON instantbuy_price_history(plant_species, price_date);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_instantbuy_analytics_date ON instantbuy_analytics(date);")
        
        # Commit changes
        conn.commit()
        
        print("✅ All InstantBuy tables created successfully!")
        
        # Show table info
        cursor.execute("""
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'instantbuy%'
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        print("\n📊 Created InstantBuy tables:")
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

def insert_sample_data():
    """Insert sample InstantBuy data"""
    try:
        conn = psycopg2.connect("postgresql://postgres:password@localhost:5432/plantdex")
        cursor = conn.cursor()
        
        print("\n🔨 Inserting sample InstantBuy data...")
        
        # Sample evaluations
        cursor.execute("""
            INSERT INTO instantbuy_evaluations (
                photos, ai_plant_identification, estimated_market_price, 
                our_offer_price, plant_species, plant_condition, plant_size,
                evaluation_confidence
            ) VALUES 
            ('["photo1.jpg", "photo2.jpg"]', '{"species": "Monstera deliciosa", "confidence": 0.95}', 2500.00, 2000.00, 'Monstera deliciosa', 'EXCELLENT', 'LARGE', 0.95),
            ('["photo3.jpg"]', '{"species": "Philodendron pink princess", "confidence": 0.88}', 8000.00, 6500.00, 'Philodendron pink princess', 'GOOD', 'MEDIUM', 0.88),
            ('["photo4.jpg", "photo5.jpg"]', '{"species": "Anthurium crystallinum", "confidence": 0.92}', 3500.00, 2800.00, 'Anthurium crystallinum', 'EXCELLENT', 'SMALL', 0.92)
            ON CONFLICT DO NOTHING;
        """)
        
        # Sample transactions
        cursor.execute("""
            INSERT INTO instantbuy_transactions (
                transaction_id, evaluation_id, seller_contact, agreed_price,
                pickup_location, status, payment_method
            ) VALUES 
            ('IB-2025-001', 1, '{"name": "สมชาย ใจดี", "phone": "081-234-5678", "line": "somchai123"}', 2000.00, 'กรุงเทพมหานคร, วัฒนา', 'CONFIRMED', 'CASH'),
            ('IB-2025-002', 2, '{"name": "สมหญิง รักต้นไม้", "phone": "089-876-5432", "line": "somying456"}', 6500.00, 'กรุงเทพมหานคร, สาทร', 'PENDING', 'BANK_TRANSFER'),
            ('IB-2025-003', 3, '{"name": "สมศักดิ์ นักสะสม", "phone": "082-111-2222", "line": "somsak789"}', 2800.00, 'กรุงเทพมหานคร, บางนา', 'COMPLETED', 'CASH')
            ON CONFLICT DO NOTHING;
        """)
        
        # Sample inventory
        cursor.execute("""
            INSERT INTO instantbuy_inventory (
                transaction_id, plant_species, condition_score, purchase_price,
                listing_price, status
            ) VALUES 
            ('IB-2025-001', 'Monstera deliciosa', 9, 2000.00, 2800.00, 'LISTED'),
            ('IB-2025-002', 'Philodendron pink princess', 8, 6500.00, 8500.00, 'LISTED'),
            ('IB-2025-003', 'Anthurium crystallinum', 9, 2800.00, 3800.00, 'SOLD')
            ON CONFLICT DO NOTHING;
        """)
        
        # Sample price history
        cursor.execute("""
            INSERT INTO instantbuy_price_history (
                plant_species, price_date, market_price, our_buy_price, our_sell_price, profit_margin_pct
            ) VALUES 
            ('Monstera deliciosa', CURRENT_DATE, 2500.00, 2000.00, 2800.00, 28.57),
            ('Philodendron pink princess', CURRENT_DATE, 8000.00, 6500.00, 8500.00, 23.53),
            ('Anthurium crystallinum', CURRENT_DATE, 3500.00, 2800.00, 3800.00, 26.32)
            ON CONFLICT DO NOTHING;
        """)
        
        conn.commit()
        print("✅ Sample InstantBuy data inserted successfully!")
        
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
        if conn:
            conn.rollback()
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    print("🚀 Creating InstantBuy Database Tables for PlantDex...")
    
    # Create tables
    success = create_instantbuy_tables()
    
    if success:
        print("\n🎉 InstantBuy database setup completed!")
        
        # Insert sample data
        insert_sample_data()
        
        print("\n📋 Next steps:")
        print("   1. Create InstantBuy API endpoints")
        print("   2. Build InstantBuy frontend portal")
        print("   3. Implement AI plant identification")
        print("   4. Launch InstantBuy service")
    else:
        print("\n❌ InstantBuy database setup failed!") 