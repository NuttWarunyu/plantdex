#!/usr/bin/env python3
"""
Detailed Plant Models for PlantDex
โมเดลพืชแบบละเอียดสำหรับการเก็บข้อมูลจริง
"""

from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

# ===== ENUMS =====
class PropagationMethod(str, enum.Enum):
    SEED = "seed"
    CUTTING = "cutting"
    DIVISION = "division"
    AIR_LAYERING = "air_layering"
    TISSUE_CULTURE = "tissue_culture"
    GRAFTING = "grafting"

class DifficultyLevel(str, enum.Enum):
    EASY = "easy"
    MODERATE = "moderate"
    DIFFICULT = "difficult"
    EXPERT = "expert"

class QualityGrade(str, enum.Enum):
    AA = "AA"
    A = "A"
    B = "B"
    C = "C"
    D = "D"

class VariegationLevel(str, enum.Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EXTREME = "extreme"

class ShippingMethod(str, enum.Enum):
    KERRY = "kerry"
    THAILAND_POST = "thailand_post"
    EMS = "ems"
    FLASH_EXPRESS = "flash_express"
    JNT = "jnt"
    DHL = "dhl"
    FEDEX = "fedex"
    UPS = "ups"

class PaymentMethod(str, enum.Enum):
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    LINE_PAY = "line_pay"
    PROMPTPAY = "promptpay"
    SHOPEE_PAY = "shopee_pay"
    LAZADA_WALLET = "lazada_wallet"

# ===== PLANT DETAILED MODELS =====

class PlantImage(Base):
    """รูปภาพพืช"""
    __tablename__ = "plant_images"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    image_type = Column(String(50), nullable=False)  # main, gallery, care_guide
    image_url = Column(Text, nullable=False)
    image_alt = Column(String(255))
    image_order = Column(Integer, default=0)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant", back_populates="images")

class PlantPropagation(Base):
    """ข้อมูลการขยายพันธุ์"""
    __tablename__ = "plant_propagations"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    method = Column(Enum(PropagationMethod), nullable=False)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    success_rate = Column(Float)  # 0-100
    time_to_root = Column(Integer)  # วัน
    best_season = Column(String(100))  # ฤดูที่เหมาะสม
    instructions = Column(Text)  # คำแนะนำการขยายพันธุ์
    tools_needed = Column(Text)  # เครื่องมือที่ต้องใช้
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant", back_populates="propagations")

class PlantPestDisease(Base):
    """ข้อมูลโรคและแมลง"""
    __tablename__ = "plant_pest_diseases"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    pest_or_disease = Column(String(100), nullable=False)  # ชื่อโรคหรือแมลง
    type = Column(String(50), nullable=False)  # pest, disease
    symptoms = Column(Text)  # อาการ
    prevention = Column(Text)  # วิธีป้องกัน
    treatment = Column(Text)  # วิธีรักษา
    severity = Column(String(50))  # low, medium, high, critical
    season_risk = Column(String(100))  # ฤดูที่มีความเสี่ยง
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant", back_populates="pest_diseases")

class PlantSeasonalInfo(Base):
    """ข้อมูลฤดูกาล"""
    __tablename__ = "plant_seasonal_infos"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    best_planting_season = Column(JSON)  # ['spring', 'summer']
    blooming_season = Column(JSON)  # ['winter', 'spring']
    dormancy_period = Column(JSON)  # ['summer']
    seasonal_care = Column(Text)  # การดูแลตามฤดูกาล
    seasonal_watering = Column(Text)  # การรดน้ำตามฤดูกาล
    seasonal_fertilizing = Column(Text)  # การให้ปุ๋ยตามฤดูกาล
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant", back_populates="seasonal_infos")

class PlantShippingInfo(Base):
    """ข้อมูลการขนส่ง"""
    __tablename__ = "plant_shipping_infos"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    fragility_level = Column(String(50), nullable=False)  # low, medium, high
    packaging_requirements = Column(Text)  # ข้อกำหนดการแพ็ค
    max_shipping_distance = Column(Integer)  # กม.
    shipping_preparation = Column(Text)  # การเตรียมก่อนจัดส่ง
    special_handling = Column(Text)  # การจัดการพิเศษ
    temperature_control = Column(Boolean, default=False)  # ต้องการควบคุมอุณหภูมิ
    humidity_control = Column(Boolean, default=False)  # ต้องการควบคุมความชื้น
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant", back_populates="shipping_infos")

# ===== PRICING DETAILED MODELS =====

class PlantPriceDetailed(Base):
    """ข้อมูลราคาแบบละเอียด"""
    __tablename__ = "plant_prices_detailed"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False, index=True)
    
    # ข้อมูลราคา
    base_price = Column(Float, nullable=False)
    currency = Column(String(3), default="THB")
    price_type = Column(String(50))  # fixed, negotiable, auction
    
    # ข้อมูลขนาด
    height = Column(Float)  # ซม.
    width = Column(Float)  # ซม.
    pot_size = Column(String(100))  # 4inch, 6inch, 8inch
    leaf_count = Column(Integer)  # จำนวนใบ
    maturity_level = Column(String(50))  # baby, juvenile, mature
    
    # ข้อมูลคุณภาพ
    quality_grade = Column(String(10))  # AA, A, B, C, D
    variegation_level = Column(Enum(VariegationLevel))
    health_score = Column(Float)  # 0-100
    damage_description = Column(Text)  # รายละเอียดความเสียหาย
    
    # ข้อมูลฤดูกาล
    seasonal_multiplier = Column(Float, default=1.0)  # ตัวคูณตามฤดูกาล
    peak_season = Column(JSON)  # ฤดูที่ราคาสูง
    off_season = Column(JSON)  # ฤดูที่ราคาต่ำ
    
    # ข้อมูลภูมิภาค
    province = Column(String(100))
    city = Column(String(100))
    local_market_factor = Column(Float, default=1.0)  # ปัจจัยตลาดท้องถิ่น
    transportation_cost = Column(Float)  # ค่าขนส่งในพื้นที่
    
    # ข้อมูลแหล่งขาย
    platform = Column(String(100))  # facebook, shopee, lazada, line_shop
    seller_type = Column(String(100))  # individual, nursery, garden_center
    verification_status = Column(String(50))  # verified, unverified, pending
    rating = Column(Float)  # 0-5
    review_count = Column(Integer)  # จำนวนรีวิว
    
    # ข้อมูลการจัดส่ง
    shipping_cost = Column(Float)
    shipping_methods = Column(JSON)  # วิธีจัดส่ง
    shipping_time = Column(String(100))  # เวลาจัดส่ง
    
    # ข้อมูลอื่นๆ
    condition = Column(String(100))  # new, used, damaged
    availability = Column(Boolean, default=True)
    stock_quantity = Column(Integer)
    is_featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    plant = relationship("Plant")
    seller = relationship("Seller")

# ===== SELLER DETAILED MODELS =====

class SellerBusinessDetails(Base):
    """ข้อมูลธุรกิจแบบละเอียด"""
    __tablename__ = "seller_business_details"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False, unique=True)
    
    # ข้อมูลทางกฎหมาย
    registration_number = Column(String(100))  # เลขทะเบียนธุรกิจ
    tax_id = Column(String(100))  # เลขประจำตัวผู้เสียภาษี
    business_license = Column(String(100))  # เลขที่ใบอนุญาต
    license_expiry = Column(DateTime(timezone=True))  # วันหมดอายุใบอนุญาต
    
    # ข้อมูลธุรกิจ
    business_years = Column(Integer)  # จำนวนปีที่ทำธุรกิจ
    employee_count = Column(Integer)  # จำนวนพนักงาน
    annual_revenue = Column(String(100))  # รายได้ต่อปี
    business_hours = Column(Text)  # เวลาทำการ
    
    # ข้อมูลการผลิต
    production_capacity = Column(Text)  # ความสามารถในการผลิต
    quality_certifications = Column(JSON)  # ใบรับรองคุณภาพ
    organic_certified = Column(Boolean, default=False)  # ได้รับการรับรองออร์แกนิค
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller = relationship("Seller", back_populates="business_details")

class SellerShippingPolicy(Base):
    """นโยบายการจัดส่ง"""
    __tablename__ = "seller_shipping_policies"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    
    # ข้อมูลการจัดส่ง
    shipping_methods = Column(JSON)  # วิธีจัดส่ง
    shipping_zones = Column(JSON)  # โซนการจัดส่ง
    free_shipping_threshold = Column(Float)  # ราคาขั้นต่ำที่จัดส่งฟรี
    packaging_fee = Column(Float)  # ค่าแพ็ค
    insurance_fee = Column(Float)  # ค่าประกัน
    
    # ข้อมูลเวลา
    processing_time = Column(String(100))  # เวลาประมวลผล
    delivery_time = Column(JSON)  # เวลาจัดส่งตามโซน
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller = relationship("Seller", back_populates="shipping_policies")

class SellerWarrantyPolicy(Base):
    """นโยบายการรับประกัน"""
    __tablename__ = "seller_warranty_policies"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    
    # ข้อมูลการรับประกัน
    warranty_period = Column(Integer)  # วัน
    warranty_coverage = Column(JSON)  # สิ่งที่รับประกัน
    warranty_conditions = Column(Text)  # เงื่อนไขการรับประกัน
    
    # ข้อมูลการคืนสินค้า
    return_policy = Column(Text)  # นโยบายการคืนสินค้า
    refund_policy = Column(Text)  # นโยบายการคืนเงิน
    return_period = Column(Integer)  # ระยะเวลาคืนสินค้า
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller = relationship("Seller", back_populates="warranty_policies")

class SellerPaymentPolicy(Base):
    """นโยบายการชำระเงิน"""
    __tablename__ = "seller_payment_policies"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False)
    
    # ข้อมูลการชำระเงิน
    payment_methods = Column(JSON)  # วิธีชำระเงิน
    installment_available = Column(Boolean, default=False)  # มีบริการผ่อนชำระ
    installment_terms = Column(JSON)  # เงื่อนไขการผ่อนชำระ
    down_payment_percentage = Column(Float)  # เปอร์เซ็นต์ดาวน์
    
    # ข้อมูลส่วนลด
    bulk_discount = Column(Boolean, default=False)  # มีส่วนลดปริมาณ
    bulk_discount_rates = Column(JSON)  # อัตราส่วนลดปริมาณ
    member_discount = Column(Boolean, default=False)  # มีส่วนลดสมาชิก
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    seller = relationship("Seller", back_populates="payment_policies")

class SellerReview(Base):
    """รีวิวผู้ขาย"""
    __tablename__ = "seller_reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("sellers.id"), nullable=False, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # ข้อมูลรีวิว
    overall_rating = Column(Float, nullable=False)  # 0-5
    review_text = Column(Text)
    
    # คะแนนแยกหมวดหมู่
    product_quality = Column(Float)  # คุณภาพสินค้า
    shipping_speed = Column(Float)  # ความเร็วการจัดส่ง
    customer_service = Column(Float)  # บริการลูกค้า
    packaging_quality = Column(Float)  # คุณภาพการแพ็ค
    value_for_money = Column(Float)  # ความคุ้มค่าเงิน
    
    # ข้อมูลเพิ่มเติม
    order_id = Column(String(100))  # เลขที่คำสั่งซื้อ
    plant_id = Column(Integer, ForeignKey("plants.id"))  # พืชที่ซื้อ
    is_verified_purchase = Column(Boolean, default=False)  # การซื้อที่ยืนยันแล้ว
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    seller = relationship("Seller", back_populates="reviews")
    reviewer = relationship("User")
    plant = relationship("Plant")

# ===== MARKET INTELLIGENCE MODELS =====

class TradeData(Base):
    """ข้อมูลการนำเข้า/ส่งออก"""
    __tablename__ = "trade_data"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    
    # ข้อมูลการค้า
    trade_type = Column(String(50), nullable=False)  # import, export
    country = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50))  # pieces, kg, containers
    value_thb = Column(Float)  # มูลค่าในบาท
    trade_date = Column(DateTime(timezone=True), nullable=False)
    
    # ข้อมูลเพิ่มเติม
    source = Column(String(100))  # ข้อมูลจากกรมศุลกากร
    notes = Column(Text)  # หมายเหตุ
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant")

class DemandSupplyData(Base):
    """ข้อมูลอุปสงค์-อุปทาน"""
    __tablename__ = "demand_supply_data"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    date = Column(DateTime(timezone=True), nullable=False)
    
    # ข้อมูลอุปสงค์
    search_volume = Column(Integer)  # ปริมาณการค้นหา
    social_media_mentions = Column(Integer)  # การกล่าวถึงในโซเชียล
    influencer_posts = Column(Integer)  # โพสต์จากอินฟลูเอนเซอร์
    news_mentions = Column(Integer)  # การกล่าวถึงในข่าว
    
    # ข้อมูลอุปทาน
    available_stock = Column(Integer)  # สต็อกที่มี
    new_listings = Column(Integer)  # รายการใหม่
    price_volatility = Column(Float)  # ความผันผวนของราคา
    market_saturation = Column(Float)  # ความอิ่มตัวของตลาด
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant")

# ===== GEOGRAPHIC DATA MODELS =====

class GeographicData(Base):
    """ข้อมูลภูมิศาสตร์"""
    __tablename__ = "geographic_data"
    
    id = Column(Integer, primary_key=True, index=True)
    province = Column(String(100), nullable=False, index=True)
    city = Column(String(100), nullable=False, index=True)
    
    # ข้อมูลภูมิอากาศ
    climate_data = Column(JSON)  # ข้อมูลภูมิอากาศ
    
    # ข้อมูลดิน
    soil_data = Column(JSON)  # ข้อมูลดิน
    
    # ข้อมูลการปลูก
    cultivation_data = Column(JSON)  # ข้อมูลการปลูก
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

# ===== DIGITAL DATA MODELS =====

class DigitalData(Base):
    """ข้อมูลดิจิทัล"""
    __tablename__ = "digital_data"
    
    id = Column(Integer, primary_key=True, index=True)
    plant_id = Column(Integer, ForeignKey("plants.id"), nullable=False, index=True)
    date = Column(DateTime(timezone=True), nullable=False)
    
    # ข้อมูล Social Media
    social_media_metrics = Column(JSON)  # ข้อมูล Social Media
    
    # ข้อมูลการค้นหา
    search_trends = Column(JSON)  # ข้อมูลการค้นหา
    
    # ข้อมูลอิทธิพล
    influencer_data = Column(JSON)  # ข้อมูลอิทธิพล
    
    # ข้อมูลข่าวสาร
    news_sentiment = Column(JSON)  # ข้อมูลข่าวสาร
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    plant = relationship("Plant") 