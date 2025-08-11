from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Base schemas
class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    province: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    province: Optional[str] = None

class UserResponse(UserBase):
    id: int
    is_verified: bool
    is_active: bool
    subscription_tier: str
    subscription_expires: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Authentication schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# Seller schemas
class SellerBase(BaseModel):
    business_name: str
    business_type: Optional[str] = None
    business_license: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    social_media: Optional[str] = None

class SellerCreate(SellerBase):
    pass

class SellerUpdate(BaseModel):
    business_name: Optional[str] = None
    business_type: Optional[str] = None
    business_license: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    province: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    social_media: Optional[str] = None

class SellerInDB(SellerBase):
    id: int
    user_id: int
    rating: float
    total_reviews: int
    total_sales: int
    total_plants_listed: int
    is_verified: bool
    verification_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SellerResponse(SellerInDB):
    pass

# Password change
class PasswordChange(BaseModel):
    current_password: str
    new_password: str

# Subscription
class SubscriptionUpdate(BaseModel):
    subscription_tier: str 