from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class PlantPrice(Base):
    __tablename__ = "plant_prices"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    source = Column(String(100), nullable=False, index=True)  # shopee, lazada, nursery, etc.
    source_url = Column(Text)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="THB")
    plant_size = Column(String(100))  # small, medium, large, extra large
    pot_size = Column(String(100))  # 4", 6", 8", etc.
    condition = Column(String(100))  # new, used, damaged
    seller_location = Column(String(255), index=True)
    seller_name = Column(String(255))
    seller_rating = Column(Float)
    availability = Column(Boolean, default=True)
    stock_quantity = Column(Integer)
    shipping_cost = Column(Float)
    shipping_time = Column(String(100))  # 1-2 days, 3-5 days, etc.
    is_verified = Column(Boolean, default=False)
    data_collected_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant", back_populates="prices")
    
    def __repr__(self):
        return f"<PlantPrice(id={self.id}, plant_id={self.plant_id}, source='{self.source}', price={self.price})>" 