from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class PlantSubmissionStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SHIPPED = "shipped"
    RECEIVED = "received"
    PAID = "paid"
    CANCELLED = "cancelled"

class PlantSubmissionBase(BaseModel):
    species: str = Field(..., description="Plant species/variety")
    size: str = Field(..., description="Plant size (e.g., 6 inches, 15cm)")
    age: str = Field(..., description="Plant age (e.g., 1 year, 6 months)")
    health: str = Field(..., description="Plant health condition")
    description: Optional[str] = Field(None, description="Additional plant details")

class PlantSubmissionCreate(PlantSubmissionBase):
    status: PlantSubmissionStatus = Field(default=PlantSubmissionStatus.PENDING)
    submitted_at: datetime = Field(default_factory=datetime.utcnow)

class PlantSubmissionUpdate(BaseModel):
    species: Optional[str] = None
    size: Optional[str] = None
    age: Optional[str] = None
    health: Optional[str] = None
    description: Optional[str] = None
    status: Optional[PlantSubmissionStatus] = None
    price_offer: Optional[float] = None
    rejection_reason: Optional[str] = None
    admin_notes: Optional[str] = None

class PlantSubmissionResponse(PlantSubmissionBase):
    id: int
    status: str
    submitted_at: datetime
    reviewed_at: Optional[datetime] = None
    price_offer: Optional[float] = None
    rejection_reason: Optional[str] = None
    message: Optional[str] = None
    
    class Config:
        from_attributes = True

class PlantPhotoBase(BaseModel):
    photo_type: str = Field(..., description="Type of photo (before, after, roots, video)")
    file_name: str = Field(..., description="Original file name")
    file_size: Optional[int] = Field(None, description="File size in bytes")
    mime_type: Optional[str] = Field(None, description="MIME type of the file")

class PlantPhotoCreate(PlantPhotoBase):
    submission_id: int = Field(..., description="ID of the plant submission")

class PlantPhotoResponse(PlantPhotoBase):
    id: int
    submission_id: int
    photo_url: str
    uploaded_at: datetime
    is_verified: bool
    
    class Config:
        from_attributes = True

class QualityStandardBase(BaseModel):
    category: str = Field(..., description="Standard category (rare, healthy, size, seasonal)")
    title: str = Field(..., description="Standard title")
    description: str = Field(..., description="Detailed description")
    min_score: Optional[int] = Field(None, description="Minimum score to pass (1-10)")
    weight: float = Field(default=1.0, description="Importance weight")

class QualityStandardCreate(QualityStandardBase):
    examples: Optional[str] = Field(None, description="JSON array of examples")
    guidelines: Optional[str] = Field(None, description="Detailed guidelines")

class QualityStandardResponse(QualityStandardBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class MarketInsightBase(BaseModel):
    category: str = Field(..., description="Insight category (plant_species, seasonal, size)")
    title: str = Field(..., description="Insight title")
    description: str = Field(..., description="Detailed description")
    current_demand: str = Field(..., description="Current demand level (low, medium, high, very_high)")
    price_range_min: Optional[float] = Field(None, description="Minimum price in THB")
    price_range_max: Optional[float] = Field(None, description="Maximum price in THB")
    trend_direction: Optional[str] = Field(None, description="Trend direction (rising, stable, declining)")
    trend_strength: Optional[str] = Field(None, description="Trend strength (weak, moderate, strong)")

class MarketInsightCreate(MarketInsightBase):
    valid_from: datetime = Field(..., description="When this insight becomes valid")
    valid_until: Optional[datetime] = Field(None, description="When this insight expires")
    source: Optional[str] = Field(None, description="Data source")
    confidence_level: Optional[int] = Field(None, description="Confidence level (1-10)")

class MarketInsightResponse(MarketInsightBase):
    id: int
    currency: str
    is_current: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class PlantSubmissionReview(BaseModel):
    status: PlantSubmissionStatus = Field(..., description="New status for the submission")
    price_offer: Optional[float] = Field(None, description="Price offer if approved")
    rejection_reason: Optional[str] = Field(None, description="Reason for rejection if rejected")
    admin_notes: Optional[str] = Field(None, description="Internal admin notes")

class PlantSubmissionFilter(BaseModel):
    status: Optional[PlantSubmissionStatus] = None
    species: Optional[str] = None
    health: Optional[str] = None
    submitted_after: Optional[datetime] = None
    submitted_before: Optional[datetime] = None
    limit: int = Field(default=50, le=100)
    offset: int = Field(default=0, ge=0)

class PlantSubmissionStats(BaseModel):
    total_submissions: int
    pending_review: int
    approved: int
    rejected: int
    shipped: int
    received: int
    paid: int
    total_value: float
    average_price: float
    
    class Config:
        from_attributes = True 