# 🌱 PlantDex - ฐานข้อมูลแบบละเอียด

## 📋 ภาพรวม

ฐานข้อมูลแบบละเอียดสำหรับ PlantDex ที่รองรับการเก็บข้อมูลจริงในเชิงเทคนิค ครอบคลุมข้อมูลพืช การขยายพันธุ์ โรคและแมลง ฤดูกาล การขนส่ง ราคา ผู้ขาย และข้อมูลตลาด

## 🗄️ โครงสร้างฐานข้อมูล

### 🌱 ตารางพืชแบบละเอียด

#### `plant_images`
- **รูปภาพพืช**: รูปหลัก, แกลเลอรี่, คู่มือการดูแล
- **ฟิลด์**: `plant_id`, `image_type`, `image_url`, `image_alt`, `image_order`, `is_primary`

#### `plant_propagations`
- **ข้อมูลการขยายพันธุ์**: วิธี, ความยาก, อัตราความสำเร็จ, เวลาออกราก
- **ฟิลด์**: `plant_id`, `method`, `difficulty`, `success_rate`, `time_to_root`, `best_season`, `instructions`, `tools_needed`

#### `plant_pest_diseases`
- **โรคและแมลง**: ชื่อ, ประเภท, อาการ, การป้องกัน, การรักษา
- **ฟิลด์**: `plant_id`, `pest_or_disease`, `type`, `symptoms`, `prevention`, `treatment`, `severity`, `season_risk`

#### `plant_seasonal_infos`
- **ข้อมูลฤดูกาล**: ฤดูปลูก, ฤดูออกดอก, ฤดูพักตัว
- **ฟิลด์**: `plant_id`, `best_planting_season`, `blooming_season`, `dormancy_period`, `seasonal_care`, `seasonal_watering`, `seasonal_fertilizing`

#### `plant_shipping_infos`
- **ข้อมูลการขนส่ง**: ระดับความเปราะบาง, ข้อกำหนดการแพ็ค, ระยะทางสูงสุด
- **ฟิลด์**: `plant_id`, `fragility_level`, `packaging_requirements`, `max_shipping_distance`, `shipping_preparation`, `special_handling`, `temperature_control`, `humidity_control`

### 💰 ตารางราคาแบบละเอียด

#### `plant_prices_detailed`
- **ข้อมูลราคาแบบละเอียด**: ราคา, ขนาด, คุณภาพ, ฤดูกาล, ภูมิภาค, แหล่งขาย
- **ฟิลด์หลัก**:
  - **ราคา**: `base_price`, `currency`, `price_type`
  - **ขนาด**: `height`, `width`, `pot_size`, `leaf_count`, `maturity_level`
  - **คุณภาพ**: `quality_grade`, `variegation_level`, `health_score`
  - **ฤดูกาล**: `seasonal_multiplier`, `peak_season`, `off_season`
  - **ภูมิภาค**: `province`, `city`, `local_market_factor`
  - **แหล่งขาย**: `platform`, `seller_type`, `verification_status`, `rating`, `review_count`

### 🏪 ตารางผู้ขายแบบละเอียด

#### `seller_business_details`
- **ข้อมูลธุรกิจ**: ใบอนุญาต, เลขประจำตัวผู้เสียภาษี, ประสบการณ์
- **ฟิลด์**: `seller_id`, `registration_number`, `tax_id`, `business_license`, `license_expiry`, `business_years`, `employee_count`, `annual_revenue`, `business_hours`, `production_capacity`, `quality_certifications`, `organic_certified`

#### `seller_shipping_policies`
- **นโยบายการจัดส่ง**: วิธีจัดส่ง, โซน, ค่าจัดส่งฟรี
- **ฟิลด์**: `seller_id`, `shipping_methods`, `shipping_zones`, `free_shipping_threshold`, `packaging_fee`, `insurance_fee`, `processing_time`, `delivery_time`

#### `seller_warranty_policies`
- **นโยบายการรับประกัน**: ระยะเวลา, สิ่งที่รับประกัน, เงื่อนไข
- **ฟิลด์**: `seller_id`, `warranty_period`, `warranty_coverage`, `warranty_conditions`, `return_policy`, `refund_policy`, `return_period`

#### `seller_payment_policies`
- **นโยบายการชำระเงิน**: วิธีชำระ, ผ่อนชำระ, ส่วนลด
- **ฟิลด์**: `seller_id`, `payment_methods`, `installment_available`, `installment_terms`, `down_payment_percentage`, `bulk_discount`, `bulk_discount_rates`, `member_discount`

#### `seller_reviews`
- **รีวิวผู้ขาย**: คะแนนรวม, คะแนนแยกหมวดหมู่, ข้อความรีวิว
- **ฟิลด์**: `seller_id`, `reviewer_id`, `overall_rating`, `review_text`, `product_quality`, `shipping_speed`, `customer_service`, `packaging_quality`, `value_for_money`, `order_id`, `plant_id`, `is_verified_purchase`

### 📊 ตารางข้อมูลตลาด

#### `trade_data`
- **ข้อมูลการนำเข้า/ส่งออก**: ประเภท, ประเทศ, ปริมาณ, มูลค่า
- **ฟิลด์**: `plant_id`, `trade_type`, `country`, `quantity`, `unit`, `value_thb`, `trade_date`, `source`, `notes`

#### `demand_supply_data`
- **ข้อมูลอุปสงค์-อุปทาน**: ปริมาณการค้นหา, สต็อก, ความผันผวนของราคา
- **ฟิลด์**: `plant_id`, `date`, `search_volume`, `social_media_mentions`, `influencer_posts`, `news_mentions`, `available_stock`, `new_listings`, `price_volatility`, `market_saturation`

### 🌍 ตารางข้อมูลภูมิศาสตร์

#### `geographic_data`
- **ข้อมูลภูมิศาสตร์**: ภูมิอากาศ, ดิน, การปลูก
- **ฟิลด์**: `province`, `city`, `climate_data`, `soil_data`, `cultivation_data`

### 💻 ตารางข้อมูลดิจิทัล

#### `digital_data`
- **ข้อมูลดิจิทัล**: Social Media, การค้นหา, อิทธิพล, ข่าวสาร
- **ฟิลด์**: `plant_id`, `date`, `social_media_metrics`, `search_trends`, `influencer_data`, `news_sentiment`

## 🚀 การใช้งาน

### 1. สร้างตารางใหม่

```bash
cd backend
python3 create_detailed_tables.py
```

### 2. เพิ่มข้อมูลตัวอย่าง

```bash
python3 add_detailed_data.py
```

### 3. ตรวจสอบข้อมูล

```bash
# ตรวจสอบตารางที่สร้าง
python3 -c "
from app.core.database import engine
from sqlalchemy import inspect
inspector = inspect(engine)
tables = inspector.get_table_names()
print('Tables:', tables)
"
```

## 📝 ตัวอย่างข้อมูล

### 🌱 ข้อมูลพืชแบบละเอียด

```python
# รูปภาพ
plant_image = PlantImage(
    plant_id=1,
    image_type="main",
    image_url="https://example.com/image.jpg",
    image_alt="Monstera deliciosa",
    is_primary=True
)

# การขยายพันธุ์
propagation = PlantPropagation(
    plant_id=1,
    method=PropagationMethod.CUTTING,
    difficulty=DifficultyLevel.EASY,
    success_rate=85.0,
    time_to_root=21,
    best_season="ฤดูร้อน",
    instructions="ตัดกิ่งที่มีใบ 2-3 ใบ วางในน้ำหรือดินชื้น"
)
```

### 💰 ข้อมูลราคาแบบละเอียด

```python
price_detailed = PlantPriceDetailed(
    plant_id=1,
    seller_id=1,
    base_price=2500.0,
    height=80.0,
    width=60.0,
    pot_size="6inch",
    quality_grade=QualityGrade.A,
    variegation_level=VariegationLevel.NONE,
    health_score=95.0,
    seasonal_multiplier=1.2,
    peak_season=["spring", "summer"],
    province="กรุงเทพมหานคร",
    platform="facebook",
    seller_type="nursery",
    verification_status="verified"
)
```

### 🏪 ข้อมูลผู้ขายแบบละเอียด

```python
business_details = SellerBusinessDetails(
    seller_id=1,
    registration_number="0105560001234",
    tax_id="0123456789012",
    business_years=8,
    employee_count=15,
    annual_revenue="5-10 ล้านบาท",
    organic_certified=True
)

shipping_policy = SellerShippingPolicy(
    seller_id=1,
    shipping_methods=["kerry", "thailand_post"],
    free_shipping_threshold=3000.0,
    packaging_fee=50.0
)
```

## 🎯 การเก็บข้อมูลจริง

### ข้อมูลที่ต้องเก็บก่อน (Priority 1)

#### สำหรับการทำตลาด:
1. **รูปภาพพืชจริง** - ใช้ URL จาก Unsplash, Pexels หรือรูปจริง
2. **ข้อมูลราคาตามขนาด** - height, width, pot_size
3. **ข้อมูลการจัดส่ง** - shipping_methods, shipping_zones
4. **ข้อมูลการรับประกัน** - warranty_period, warranty_coverage

#### สำหรับการวิเคราะห์ตลาด:
1. **ข้อมูลอุปสงค์-อุปทาน** - search_volume, available_stock
2. **ข้อมูล Social Media** - hashtag_count, engagement_rate
3. **ข้อมูลการนำเข้า/ส่งออก** - trade_type, country, quantity
4. **ข้อมูลภูมิศาสตร์** - temperature, humidity, soil_type

### ข้อมูลที่เก็บเพิ่มเติม (Priority 2)

#### ข้อมูลพืช:
- การขยายพันธุ์ (propagation)
- โรคและแมลง (pest_diseases)
- ฤดูกาล (seasonal_info)
- การขนส่ง (shipping_info)

#### ข้อมูลผู้ขาย:
- ใบอนุญาตธุรกิจ (business_details)
- นโยบายการจัดส่ง (shipping_policies)
- นโยบายการรับประกัน (warranty_policies)
- วิธีชำระเงิน (payment_policies)

## 🔧 การอัปเดต Frontend

### 1. อัปเดต API Service

```typescript
// src/lib/api.ts
export interface PlantDetailed {
  id: number;
  images: PlantImage[];
  propagations: PlantPropagation[];
  pest_diseases: PlantPestDisease[];
  seasonal_infos: PlantSeasonalInfo[];
  shipping_infos: PlantShippingInfo[];
}

export const plantsDetailedApi = {
  getPlantDetailed: async (id: number): Promise<PlantDetailed> => {
    const response = await fetch(`${API_BASE_URL}/plants/${id}/detailed`);
    return response.json();
  }
};
```

### 2. อัปเดตหน้าแสดงข้อมูล

```typescript
// src/app/plants/[id]/page.tsx
const PlantDetailPage = ({ params }: { params: { id: string } }) => {
  const [plant, setPlant] = useState<PlantDetailed | null>(null);
  
  useEffect(() => {
    plantsDetailedApi.getPlantDetailed(parseInt(params.id))
      .then(setPlant);
  }, [params.id]);
  
  // แสดงข้อมูลแบบละเอียด
  return (
    <div>
      {/* รูปภาพ */}
      <PlantImageGallery images={plant?.images} />
      
      {/* การขยายพันธุ์ */}
      <PropagationInfo propagations={plant?.propagations} />
      
      {/* โรคและแมลง */}
      <PestDiseaseInfo pest_diseases={plant?.pest_diseases} />
      
      {/* ฤดูกาล */}
      <SeasonalInfo seasonal_infos={plant?.seasonal_infos} />
      
      {/* การขนส่ง */}
      <ShippingInfo shipping_infos={plant?.shipping_infos} />
    </div>
  );
};
```

## 📊 การวิเคราะห์ข้อมูล

### ข้อมูลที่สามารถวิเคราะห์ได้:

1. **เทรนด์ราคา** - ตามฤดูกาล, ภูมิภาค, คุณภาพ
2. **อุปสงค์-อุปทาน** - ปริมาณการค้นหา, สต็อก, ความผันผวน
3. **พฤติกรรมผู้ซื้อ** - วิธีชำระเงิน, การจัดส่ง, การรับประกัน
4. **ประสิทธิภาพผู้ขาย** - คะแนนรีวิว, จำนวนการขาย, คุณภาพสินค้า
5. **ข้อมูลตลาด** - การนำเข้า/ส่งออก, ภูมิศาสตร์, เทรนด์ดิจิทัล

## 🚨 ข้อควรระวัง

1. **ข้อมูลส่วนตัว** - ระวังการเก็บข้อมูลส่วนตัวของผู้ขาย
2. **ข้อมูลทางการเงิน** - ไม่เก็บข้อมูลบัตรเครดิตหรือบัญชีธนาคาร
3. **ข้อมูลสุขภาพ** - ระวังการเก็บข้อมูลสุขภาพของพืชที่อาจเป็นความลับทางการค้า
4. **การยืนยันข้อมูล** - ตรวจสอบความถูกต้องของข้อมูลก่อนบันทึก

## 📞 การสนับสนุน

หากมีปัญหาหรือคำถามเกี่ยวกับฐานข้อมูลแบบละเอียด กรุณาติดต่อทีมพัฒนา PlantDex 