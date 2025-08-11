from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.plant import PlantCategory, CareLevel

class PlantBase(BaseModel):
    scientific_name: str
    common_name_th: str
    common_name_en: str
    category: PlantCategory
    care_level: CareLevel
    origin_country: Optional[str] = None
    description_th: Optional[str] = None
    description_en: Optional[str] = None
    care_instructions: Optional[str] = None
    water_needs: Optional[str] = None
    light_needs: Optional[str] = None
    humidity_needs: Optional[str] = None
    temperature_min: Optional[float] = None
    temperature_max: Optional[float] = None
    growth_rate: Optional[str] = None
    max_height: Optional[float] = None
    max_width: Optional[float] = None
    is_poisonous: bool = False
    is_rare: bool = False
    is_trending: bool = False

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    scientific_name: Optional[str] = None
    common_name_th: Optional[str] = None
    common_name_en: Optional[str] = None
    category: Optional[PlantCategory] = None
    care_level: Optional[CareLevel] = None
    origin_country: Optional[str] = None
    description_th: Optional[str] = None
    description_en: Optional[str] = None
    care_instructions: Optional[str] = None
    water_needs: Optional[str] = None
    light_needs: Optional[str] = None
    humidity_needs: Optional[str] = None
    temperature_min: Optional[float] = None
    temperature_max: Optional[float] = None
    growth_rate: Optional[str] = None
    max_height: Optional[float] = None
    max_width: Optional[float] = None
    is_poisonous: Optional[bool] = None
    is_rare: Optional[bool] = None
    is_trending: Optional[bool] = None

class PlantResponse(PlantBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class PlantPriceResponse(BaseModel):
    id: int
    plant_id: int
    source: str
    source_url: Optional[str] = None
    price: float
    currency: str
    plant_size: Optional[str] = None
    pot_size: Optional[str] = None
    condition: Optional[str] = None
    seller_location: Optional[str] = None
    seller_name: Optional[str] = None
    seller_rating: Optional[float] = None
    availability: bool
    stock_quantity: Optional[int] = None
    shipping_cost: Optional[float] = None
    shipping_time: Optional[str] = None
    is_verified: bool
    data_collected_at: datetime
    
    class Config:
        from_attributes = True

class PlantWithPrices(PlantResponse):
    prices: List[PlantPriceResponse] = []
    avg_price: Optional[float] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    total_sources: int = 0

class PlantSearchParams(BaseModel):
    query: Optional[str] = None
    category: Optional[PlantCategory] = None
    care_level: Optional[CareLevel] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    location: Optional[str] = None
    is_rare: Optional[bool] = None
    is_trending: Optional[bool] = None
    limit: int = 50
    offset: int = 0 