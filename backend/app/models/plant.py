from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class PlantCategory(str, enum.Enum):
    INDOOR = "indoor"
    OUTDOOR = "outdoor"
    SUCCULENT = "succulent"
    CACTUS = "cactus"
    TROPICAL = "tropical"
    RARE = "rare"
    FORTUNE = "fortune"  # Lucky/feng shui plants
    HERB = "herb"
    FRUIT = "fruit"
    ORNAMENTAL = "ornamental"

class CareLevel(str, enum.Enum):
    EASY = "easy"
    MODERATE = "moderate"
    DIFFICULT = "difficult"
    EXPERT = "expert"

class Plant(Base):
    __tablename__ = "plants"
    
    id = Column(Integer, primary_key=True, index=True)
    scientific_name = Column(String(255), unique=True, index=True, nullable=False)
    common_name_th = Column(String(255), nullable=False)
    common_name_en = Column(String(255), nullable=False)
    category = Column(Enum(PlantCategory), nullable=False, index=True)
    care_level = Column(Enum(CareLevel), nullable=False)
    origin_country = Column(String(100))
    description_th = Column(Text)
    description_en = Column(Text)
    care_instructions = Column(Text)
    water_needs = Column(String(100))  # low, moderate, high
    light_needs = Column(String(100))  # low, indirect, bright, full sun
    humidity_needs = Column(String(100))  # low, moderate, high
    temperature_min = Column(Float)  # Celsius
    temperature_max = Column(Float)  # Celsius
    growth_rate = Column(String(100))  # slow, moderate, fast
    max_height = Column(Float)  # cm
    max_width = Column(Float)  # cm
    is_poisonous = Column(Boolean, default=False)
    is_rare = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    prices = relationship("PlantPrice", back_populates="plant")
    market_trends = relationship("MarketTrend", back_populates="plant")
    
    # New detailed relationships
    images = relationship("PlantImage", back_populates="plant")
    propagations = relationship("PlantPropagation", back_populates="plant")
    pest_diseases = relationship("PlantPestDisease", back_populates="plant")
    seasonal_infos = relationship("PlantSeasonalInfo", back_populates="plant")
    shipping_infos = relationship("PlantShippingInfo", back_populates="plant")
    prices_detailed = relationship("PlantPriceDetailed")
    
    def __repr__(self):
        return f"<Plant(id={self.id}, scientific_name='{self.scientific_name}', common_name_th='{self.common_name_th}')>" 