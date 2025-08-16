#!/usr/bin/env python3
"""
Create Market Intelligence Database Tables for PlantDex
Core tables for market intelligence and investment analysis
"""
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def create_market_intelligence_tables():
    """Create core tables for market intelligence platform"""
    
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
        
        # 1. Market Intelligence Daily Table
        print("🔨 Creating market_intelligence_daily table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS market_intelligence_daily (
                date DATE PRIMARY KEY,
                plantdx_index DECIMAL(8,2) NOT NULL,
                total_market_value BIGINT NOT NULL,
                daily_volume INTEGER NOT NULL,
                sentiment_score DECIMAL(3,2) NOT NULL, -- -1.00 to +1.00
                top_mover_plant_id INTEGER,
                top_mover_change_pct DECIMAL(5,2),
                market_cap_change_pct DECIMAL(5,2),
                volatility_index DECIMAL(5,2),
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # 2. Plant Investment Scores Table
        print("🔨 Creating plant_investment_scores table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS plant_investment_scores (
                id SERIAL PRIMARY KEY,
                plant_id INTEGER NOT NULL,
                investment_score DECIMAL(3,1) NOT NULL, -- 0.0 to 10.0
                roi_potential_12m DECIMAL(5,2), -- Expected ROI in 12 months
                risk_level VARCHAR(20) NOT NULL, -- LOW, MEDIUM, HIGH
                liquidity_score DECIMAL(3,1) NOT NULL, -- 0.0 to 10.0
                trend_direction VARCHAR(10) NOT NULL, -- UP, DOWN, STABLE
                market_cap BIGINT,
                price_volatility DECIMAL(5,2),
                demand_score DECIMAL(3,1), -- 0.0 to 10.0
                supply_score DECIMAL(3,1), -- 0.0 to 10.0
                last_updated TIMESTAMP DEFAULT NOW(),
                
                UNIQUE(plant_id)
            );
        """)
        
        # 3. Market Opportunities Table
        print("🔨 Creating market_opportunities table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS market_opportunities (
                id SERIAL PRIMARY KEY,
                plant_id INTEGER NOT NULL,
                opportunity_type VARCHAR(50) NOT NULL, -- UNDERVALUED, BREAKOUT, SEASONAL, ARBITRAGE
                confidence_score DECIMAL(3,2) NOT NULL, -- 0.00 to 1.00
                potential_upside_pct DECIMAL(5,2) NOT NULL,
                time_horizon_days INTEGER NOT NULL,
                risk_assessment TEXT,
                market_conditions TEXT,
                detected_at TIMESTAMP DEFAULT NOW(),
                expires_at TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE
            );
        """)
        
        # 4. Market Analysis History Table
        print("🔨 Creating market_analysis_history table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS market_analysis_history (
                id SERIAL PRIMARY KEY,
                plant_id INTEGER NOT NULL,
                analysis_date DATE NOT NULL,
                price_at_analysis DECIMAL(10,2) NOT NULL,
                volume_at_analysis INTEGER,
                market_sentiment VARCHAR(20),
                technical_indicators JSON,
                fundamental_analysis JSON,
                ai_predictions JSON,
                accuracy_score DECIMAL(3,2),
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # 5. Market Sentiment Log Table
        print("🔨 Creating market_sentiment_log table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS market_sentiment_log (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP NOT NULL,
                overall_sentiment DECIMAL(3,2) NOT NULL, -- -1.00 to +1.00
                bullish_percentage DECIMAL(5,2),
                bearish_percentage DECIMAL(5,2),
                neutral_percentage DECIMAL(5,2),
                market_fear_greed_index DECIMAL(3,2),
                volatility_measure DECIMAL(5,2),
                volume_trend VARCHAR(20),
                price_trend VARCHAR(20),
                created_at TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # 6. Investment Portfolio Tracking Table
        print("🔨 Creating investment_portfolio_tracking table...")
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS investment_portfolio_tracking (
                id SERIAL PRIMARY KEY,
                portfolio_name VARCHAR(100) NOT NULL,
                plant_id INTEGER NOT NULL,
                entry_price DECIMAL(10,2) NOT NULL,
                entry_date DATE NOT NULL,
                quantity INTEGER NOT NULL,
                current_price DECIMAL(10,2),
                current_value DECIMAL(12,2),
                total_return_pct DECIMAL(5,2),
                total_return_amount DECIMAL(12,2),
                holding_period_days INTEGER,
                last_updated TIMESTAMP DEFAULT NOW()
            );
        """)
        
        # Create indexes for better performance
        print("🔨 Creating indexes...")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_market_intelligence_date ON market_intelligence_daily(date);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_plant_investment_plant_id ON plant_investment_scores(plant_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_plant_investment_score ON plant_investment_scores(investment_score DESC);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_market_opportunities_type ON market_opportunities(opportunity_type);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_market_opportunities_active ON market_opportunities(is_active);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_market_analysis_plant_date ON market_analysis_history(plant_id, analysis_date);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_market_sentiment_timestamp ON market_sentiment_log(timestamp);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_portfolio_plant_id ON investment_portfolio_tracking(plant_id);")
        
        # Commit changes
        conn.commit()
        
        print("✅ All Market Intelligence tables created successfully!")
        
        # Show table info
        cursor.execute("""
            SELECT table_name, table_type 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE 'market%'
            ORDER BY table_name;
        """)
        
        tables = cursor.fetchall()
        print("\n📊 Created Market Intelligence tables:")
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
    """Insert sample market intelligence data"""
    try:
        conn = psycopg2.connect("postgresql://postgres:password@localhost:5432/plantdex")
        cursor = conn.cursor()
        
        print("\n🔨 Inserting sample market intelligence data...")
        
        # Sample market intelligence daily data
        cursor.execute("""
            INSERT INTO market_intelligence_daily (
                date, plantdx_index, total_market_value, daily_volume, 
                sentiment_score, market_cap_change_pct, volatility_index
            ) VALUES 
            (CURRENT_DATE - INTERVAL '7 days', 1245.67, 1250000000, 45000, 0.25, 2.34, 15.67),
            (CURRENT_DATE - INTERVAL '6 days', 1256.78, 1280000000, 52000, 0.31, 0.89, 14.23),
            (CURRENT_DATE - INTERVAL '5 days', 1268.45, 1310000000, 48000, 0.28, 0.93, 16.45),
            (CURRENT_DATE - INTERVAL '4 days', 1259.12, 1290000000, 51000, 0.18, -0.70, 15.89),
            (CURRENT_DATE - INTERVAL '3 days', 1271.34, 1330000000, 55000, 0.42, 0.97, 17.23),
            (CURRENT_DATE - INTERVAL '2 days', 1285.67, 1360000000, 58000, 0.51, 1.13, 18.45),
            (CURRENT_DATE - INTERVAL '1 day', 1298.90, 1390000000, 62000, 0.58, 1.02, 19.12),
            (CURRENT_DATE, 1312.45, 1420000000, 65000, 0.65, 1.04, 20.34)
            ON CONFLICT (date) DO UPDATE SET
                plantdx_index = EXCLUDED.plantdx_index,
                total_market_value = EXCLUDED.total_market_value,
                daily_volume = EXCLUDED.daily_volume,
                sentiment_score = EXCLUDED.sentiment_score,
                market_cap_change_pct = EXCLUDED.market_cap_change_pct,
                volatility_index = EXCLUDED.volatility_index,
                updated_at = NOW();
        """)
        
        # Sample plant investment scores
        cursor.execute("""
            INSERT INTO plant_investment_scores (
                plant_id, investment_score, roi_potential_12m, risk_level, 
                liquidity_score, trend_direction, market_cap, price_volatility
            ) VALUES 
            (1, 8.5, 25.5, 'MEDIUM', 7.8, 'UP', 50000000, 12.3),
            (2, 9.2, 32.1, 'LOW', 8.9, 'UP', 75000000, 8.7),
            (3, 7.8, 18.9, 'HIGH', 6.5, 'STABLE', 30000000, 22.1),
            (4, 8.9, 28.7, 'MEDIUM', 8.2, 'UP', 65000000, 11.4),
            (5, 7.2, 15.6, 'HIGH', 5.9, 'DOWN', 25000000, 28.9)
            ON CONFLICT (plant_id) DO UPDATE SET
                investment_score = EXCLUDED.investment_score,
                roi_potential_12m = EXCLUDED.roi_potential_12m,
                risk_level = EXCLUDED.risk_level,
                liquidity_score = EXCLUDED.liquidity_score,
                trend_direction = EXCLUDED.trend_direction,
                market_cap = EXCLUDED.market_cap,
                price_volatility = EXCLUDED.price_volatility,
                last_updated = NOW();
        """)
        
        # Sample market opportunities
        cursor.execute("""
            INSERT INTO market_opportunities (
                plant_id, opportunity_type, confidence_score, potential_upside_pct,
                time_horizon_days, risk_assessment, market_conditions
            ) VALUES 
            (1, 'UNDERVALUED', 0.85, 25.5, 90, 'Low risk, high potential', 'Market correction created buying opportunity'),
            (2, 'BREAKOUT', 0.78, 18.7, 60, 'Medium risk, strong momentum', 'Technical breakout with volume confirmation'),
            (3, 'SEASONAL', 0.92, 12.3, 120, 'Low risk, predictable pattern', 'Seasonal demand increase expected'),
            (4, 'ARBITRAGE', 0.67, 8.9, 30, 'Low risk, quick profit', 'Price difference between markets'),
            (5, 'UNDERVALUED', 0.73, 22.1, 75, 'Medium risk, recovery potential', 'Oversold condition with fundamental value')
            ON CONFLICT DO NOTHING;
        """)
        
        conn.commit()
        print("✅ Sample data inserted successfully!")
        
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
    print("🚀 Creating Market Intelligence Database Tables for PlantDex...")
    
    # Create tables
    success = create_market_intelligence_tables()
    
    if success:
        print("\n🎉 Market Intelligence database setup completed!")
        
        # Insert sample data
        insert_sample_data()
        
        print("\n📋 Next steps:")
        print("   1. Create Market Intelligence API endpoints")
        print("   2. Implement calculation algorithms")
        print("   3. Build frontend dashboard")
        print("   4. Launch premium subscription system")
    else:
        print("\n❌ Market Intelligence database setup failed!") 