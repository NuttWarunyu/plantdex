from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Enum, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import enum

Base = declarative_base()

class PlantSubmissionStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SHIPPED = "shipped"
    RECEIVED = "received"
    PAID = "paid"
    CANCELLED = "cancelled"

class PlantSubmission(Base):
    __tablename__ = "plant_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Basic plant information
    species = Column(String(255), nullable=False, index=True)
    size = Column(String(100), nullable=False)
    age = Column(String(100), nullable=False)
    health = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    
    # Submission details
    status = Column(Enum(PlantSubmissionStatus), default=PlantSubmissionStatus.PENDING, nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Review results
    price_offer = Column(Float, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    admin_notes = Column(Text, nullable=True)
    
    # Seller information (if available)
    seller_name = Column(String(255), nullable=True)
    seller_email = Column(String(255), nullable=True)
    seller_phone = Column(String(50), nullable=True)
    
    # Shipping information
    shipping_address = Column(Text, nullable=True)
    shipping_method = Column(String(100), nullable=True)
    tracking_number = Column(String(100), nullable=True)
    
    # Payment information
    payment_method = Column(String(100), nullable=True)
    payment_status = Column(String(100), default="pending", nullable=False)
    payment_date = Column(DateTime(timezone=True), nullable=True)
    
    # Quality verification
    quality_score = Column(Integer, nullable=True)  # 1-10 scale
    verification_notes = Column(Text, nullable=True)
    verified_by = Column(String(255), nullable=True)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<PlantSubmission(id={self.id}, species='{self.species}', status='{self.status}')>"

class PlantPhoto(Base):
    __tablename__ = "plant_photos"
    
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, nullable=False, index=True)
    
    # Photo details
    photo_url = Column(String(500), nullable=False)
    photo_type = Column(String(100), nullable=False)  # before, after, roots, video
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=True)  # in bytes
    mime_type = Column(String(100), nullable=True)
    
    # Upload details
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    uploaded_by = Column(String(255), nullable=True)
    
    # Verification
    is_verified = Column(Boolean, default=False, nullable=False)
    verification_notes = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<PlantPhoto(id={self.id}, submission_id={self.submission_id}, type='{self.photo_type}')>"

class QualityStandard(Base):
    __tablename__ = "quality_standards"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Standard details
    category = Column(String(100), nullable=False, index=True)  # rare, healthy, size, seasonal
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # Criteria
    min_score = Column(Integer, nullable=True)  # minimum score to pass
    weight = Column(Float, default=1.0, nullable=False)  # importance weight
    
    # Examples and guidelines
    examples = Column(Text, nullable=True)  # JSON array of examples
    guidelines = Column(Text, nullable=True)  # detailed guidelines
    
    # Status
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<QualityStandard(id={self.id}, category='{self.category}', title='{self.title}')>"

class MarketInsight(Base):
    __tablename__ = "market_insights"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Insight details
    category = Column(String(100), nullable=False, index=True)  # plant_species, seasonal, size
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    
    # Market data
    current_demand = Column(String(100), nullable=False)  # low, medium, high, very_high
    price_range_min = Column(Float, nullable=True)
    price_range_max = Column(Float, nullable=True)
    currency = Column(String(10), default="THB", nullable=False)
    
    # Trends
    trend_direction = Column(String(50), nullable=True)  # rising, stable, declining
    trend_strength = Column(String(50), nullable=True)  # weak, moderate, strong
    trend_reason = Column(Text, nullable=True)
    
    # Validity
    valid_from = Column(DateTime(timezone=True), nullable=False)
    valid_until = Column(DateTime(timezone=True), nullable=True)
    is_current = Column(Boolean, default=True, nullable=False)
    
    # Source
    source = Column(String(255), nullable=True)  # data source
    confidence_level = Column(Integer, nullable=True)  # 1-10 scale
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<MarketInsight(id={self.id}, category='{self.category}', title='{self.title}')>" 