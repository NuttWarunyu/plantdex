from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class MarketTrend(Base):
    __tablename__ = "market_trends"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    week_start = Column(Date, nullable=False, index=True)
    search_volume = Column(Integer, default=0)
    sales_volume = Column(Integer, default=0)
    avg_price = Column(Float)
    price_change_percent = Column(Float)
    trend_direction = Column(String(20))  # up, down, stable
    demand_score = Column(Float)  # 0-100
    supply_score = Column(Float)  # 0-100
    export_demand = Column(Float)  # 0-100
    seasonal_factor = Column(Float)  # 0-2 (0.5 = low season, 1.5 = high season)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant", back_populates="market_trends")
    
    def __repr__(self):
        return f"<MarketTrend(id={self.id}, plant_id={self.plant_id}, week_start='{self.week_start}', trend_direction='{self.trend_direction}')>"

class PlantPriceIndex(Base):
    __tablename__ = "plant_price_indices"
    
    id = Column(Integer, primary_key=True, index=True)
    index_date = Column(Date, nullable=False, unique=True, index=True)
    overall_index = Column(Float, nullable=False)
    indoor_index = Column(Float)
    outdoor_index = Column(Float)
    rare_index = Column(Float)
    succulent_index = Column(Float)
    fortune_index = Column(Float)
    total_plants_tracked = Column(Integer)
    total_sources = Column(Integer)
    confidence_score = Column(Float)  # 0-100
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    def __repr__(self):
        return f"<PlantPriceIndex(id={self.id}, index_date='{self.index_date}', overall_index={self.overall_index})>"

class TrendingPlant(Base):
    __tablename__ = "trending_plants"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    rank = Column(Integer, nullable=False)
    week_start = Column(Date, nullable=False, index=True)
    popularity_score = Column(Float)  # 0-100
    search_growth = Column(Float)  # percentage change
    sales_growth = Column(Float)  # percentage change
    price_growth = Column(Float)  # percentage change
    social_mentions = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant")
    
    def __repr__(self):
        return f"<TrendingPlant(id={self.id}, plant_id={self.plant_id}, rank={self.rank}, week_start='{self.week_start}')>" 