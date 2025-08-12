from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20))
    location = Column(String(255))
    province = Column(String(100))
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    subscription_tier = Column(String(50), default="free")  # free, basic, premium, enterprise
    subscription_expires = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller_profile = relationship("Seller", back_populates="user", uselist=False)
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', username='{self.username}')>"

class Seller(Base):
    __tablename__ = "sellers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    business_name = Column(String(255), nullable=False)
    business_type = Column(String(100))  # nursery, farm, retailer, wholesaler
    business_license = Column(String(100))
    description = Column(Text)
    address = Column(Text)
    city = Column(String(100))
    province = Column(String(100))
    postal_code = Column(String(20))
    phone = Column(String(20))
    website = Column(String(255))
    social_media = Column(Text)  # JSON string
    rating = Column(Float, default=0.0)
    total_reviews = Column(Integer, default=0)
    total_sales = Column(Integer, default=0)
    total_plants_listed = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    verification_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="seller_profile")
    plant_listings = relationship("PlantListing", back_populates="seller")
    
    # New detailed relationships
    business_details = relationship("SellerBusinessDetails", back_populates="seller", uselist=False)
    shipping_policies = relationship("SellerShippingPolicy", back_populates="seller")
    warranty_policies = relationship("SellerWarrantyPolicy", back_populates="seller")
    payment_policies = relationship("SellerPaymentPolicy", back_populates="seller")
    reviews = relationship("SellerReview", back_populates="seller")
    prices_detailed = relationship("PlantPriceDetailed")
    
    def __repr__(self):
        return f"<Seller(id={self.id}, business_name='{self.business_name}', user_id={self.user_id})>"

class PlantListing(Base):
    __tablename__ = "plant_listings"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="THB")
    quantity_available = Column(Integer, default=1)
    plant_size = Column(String(100))
    pot_size = Column(String(100))
    condition = Column(String(100), default="new")
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller = relationship("Seller", back_populates="plant_listings")
    
    def __repr__(self):
        return f"<PlantListing(id={self.id}, title='{self.title}', seller_id={self.seller_id}, price={self.price})>" 