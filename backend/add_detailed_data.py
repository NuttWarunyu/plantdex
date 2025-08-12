#!/usr/bin/env python3
"""
Add detailed sample data to PlantDex
เพิ่มข้อมูลตัวอย่างแบบละเอียดในตารางใหม่
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal
from app.models.plant_detailed import *
from app.models.plant import Plant
from app.models.user import User, Seller
from datetime import datetime, date
import json

def add_plant_images():
    """เพิ่มรูปภาพพืช"""
    print("🖼️ เพิ่มรูปภาพพืช...")
    
    db = SessionLocal()
    try:
        # หาพืชที่มีอยู่
        plants = db.query(Plant).all()
        if not plants:
            print("❌ ไม่พบข้อมูลพืช")
            return
        
        # รูปภาพสำหรับพืชแต่ละชนิด
        plant_images_data = [
            # Monstera deliciosa
            {
                "plant_id": 1,
                "images": [
                    {"type": "main", "url": "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee", "alt": "Monstera deliciosa ใบใหญ่", "order": 1, "is_primary": True},
                    {"type": "gallery", "url": "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee", "alt": "Monstera ในกระถาง", "order": 2, "is_primary": False},
                    {"type": "care_guide", "url": "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee", "alt": "การดูแล Monstera", "order": 3, "is_primary": False}
                ]
            },
            # Philodendron Pink Princess
            {
                "plant_id": 4,
                "images": [
                    {"type": "main", "url": "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee", "alt": "Philodendron Pink Princess", "order": 1, "is_primary": True},
                    {"type": "gallery", "url": "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee", "alt": "ใบสีชมพู", "order": 2, "is_primary": False}
                ]
            }
        ]
        
        for plant_data in plant_images_data:
            plant_id = plant_data["plant_id"]
            for img_data in plant_data["images"]:
                # ตรวจสอบว่ามีรูปภาพนี้แล้วหรือไม่
                existing = db.query(PlantImage).filter(
                    PlantImage.plant_id == plant_id,
                    PlantImage.image_url == img_data["url"]
                ).first()
                
                if not existing:
                    plant_image = PlantImage(
                        plant_id=plant_id,
                        image_type=img_data["type"],
                        image_url=img_data["url"],
                        image_alt=img_data["alt"],
                        image_order=img_data["order"],
                        is_primary=img_data["is_primary"]
                    )
                    db.add(plant_image)
        
        db.commit()
        print(f"✅ เพิ่มรูปภาพพืชสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_plant_propagations():
    """เพิ่มข้อมูลการขยายพันธุ์"""
    print("🌱 เพิ่มข้อมูลการขยายพันธุ์...")
    
    db = SessionLocal()
    try:
        # ข้อมูลการขยายพันธุ์
        propagation_data = [
            {
                "plant_id": 1,  # Monstera
                "method": PropagationMethod.CUTTING,
                "difficulty": DifficultyLevel.EASY,
                "success_rate": 85.0,
                "time_to_root": 21,
                "best_season": "ฤดูร้อน",
                "instructions": "ตัดกิ่งที่มีใบ 2-3 ใบ วางในน้ำหรือดินชื้น",
                "tools_needed": "กรรไกรตัดกิ่ง, กระถาง, ดินปลูก"
            },
            {
                "plant_id": 4,  # Philodendron Pink Princess
                "method": PropagationMethod.AIR_LAYERING,
                "difficulty": DifficultyLevel.MODERATE,
                "success_rate": 70.0,
                "time_to_root": 45,
                "best_season": "ฤดูฝน",
                "instructions": "ห่อกิ่งด้วยมอสชื้นและพลาสติก",
                "tools_needed": "มอส, พลาสติกห่อ, เชือก"
            }
        ]
        
        for data in propagation_data:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(PlantPropagation).filter(
                PlantPropagation.plant_id == data["plant_id"],
                PlantPropagation.method == data["method"]
            ).first()
            
            if not existing:
                propagation = PlantPropagation(**data)
                db.add(propagation)
        
        db.commit()
        print(f"✅ เพิ่มข้อมูลการขยายพันธุ์สำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_plant_pest_diseases():
    """เพิ่มข้อมูลโรคและแมลง"""
    print("🐛 เพิ่มข้อมูลโรคและแมลง...")
    
    db = SessionLocal()
    try:
        # ข้อมูลโรคและแมลง
        pest_disease_data = [
            {
                "plant_id": 1,  # Monstera
                "pest_or_disease": "ไรแมงมุม",
                "type": "pest",
                "symptoms": "ใบเหลือง มีจุดสีน้ำตาล ใยบางๆ บนใบ",
                "prevention": "ฉีดน้ำเป็นประจำ ใช้สบู่ฆ่าแมลง",
                "treatment": "ใช้ยาฆ่าไร ฉีดน้ำแรงๆ",
                "severity": "medium",
                "season_risk": "ฤดูร้อน-ฤดูฝน"
            },
            {
                "plant_id": 1,  # Monstera
                "pest_or_disease": "โรครากเน่า",
                "type": "disease",
                "symptoms": "ใบเหลือง รากดำ มีกลิ่นเหม็น",
                "prevention": "รดน้ำไม่ให้ดินแฉะ ใช้ดินระบายน้ำดี",
                "treatment": "ตัดรากเน่า เปลี่ยนดินใหม่",
                "severity": "high",
                "season_risk": "ฤดูฝน"
            }
        ]
        
        for data in pest_disease_data:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(PlantPestDisease).filter(
                PlantPestDisease.plant_id == data["plant_id"],
                PlantPestDisease.pest_or_disease == data["pest_or_disease"]
            ).first()
            
            if not existing:
                pest_disease = PlantPestDisease(**data)
                db.add(pest_disease)
        
        db.commit()
        print(f"✅ เพิ่มข้อมูลโรคและแมลงสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_plant_seasonal_infos():
    """เพิ่มข้อมูลฤดูกาล"""
    print("🌦️ เพิ่มข้อมูลฤดูกาล...")
    
    db = SessionLocal()
    try:
        # ข้อมูลฤดูกาล
        seasonal_data = [
            {
                "plant_id": 1,  # Monstera
                "best_planting_season": ["spring", "summer"],
                "blooming_season": ["summer"],
                "dormancy_period": ["winter"],
                "seasonal_care": "ฤดูร้อนรดน้ำมาก ฤดูหนาวรดน้ำน้อย",
                "seasonal_watering": "ฤดูร้อน: 2-3 วัน/ครั้ง, ฤดูหนาว: 7-10 วัน/ครั้ง",
                "seasonal_fertilizing": "ฤดูร้อน: ทุก 2 สัปดาห์, ฤดูหนาว: หยุดให้ปุ๋ย"
            },
            {
                "plant_id": 4,  # Philodendron Pink Princess
                "best_planting_season": ["spring", "summer"],
                "blooming_season": ["spring", "summer"],
                "dormancy_period": ["winter"],
                "seasonal_care": "ต้องการความชื้นสูงในฤดูร้อน",
                "seasonal_watering": "ฤดูร้อน: ทุกวัน, ฤดูหนาว: 3-5 วัน/ครั้ง",
                "seasonal_fertilizing": "ฤดูร้อน: ทุกสัปดาห์, ฤดูหนาว: ทุกเดือน"
            }
        ]
        
        for data in seasonal_data:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(PlantSeasonalInfo).filter(
                PlantSeasonalInfo.plant_id == data["plant_id"]
            ).first()
            
            if not existing:
                seasonal_info = PlantSeasonalInfo(**data)
                db.add(seasonal_info)
        
        db.commit()
        print(f"✅ เพิ่มข้อมูลฤดูกาลสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_plant_shipping_infos():
    """เพิ่มข้อมูลการขนส่ง"""
    print("📦 เพิ่มข้อมูลการขนส่ง...")
    
    db = SessionLocal()
    try:
        # ข้อมูลการขนส่ง
        shipping_data = [
            {
                "plant_id": 1,  # Monstera
                "fragility_level": "medium",
                "packaging_requirements": "ห่อใบด้วยกระดาษ ใส่กล่องแข็ง",
                "max_shipping_distance": 500,
                "shipping_preparation": "รดน้ำก่อนจัดส่ง 1 วัน",
                "special_handling": "ห้ามวางกล่องคว่ำ",
                "temperature_control": False,
                "humidity_control": True
            },
            {
                "plant_id": 4,  # Philodendron Pink Princess
                "fragility_level": "high",
                "packaging_requirements": "ห่อใบด้วยกระดาษชุ่มน้ำ ใส่กล่องแข็งพิเศษ",
                "max_shipping_distance": 300,
                "shipping_preparation": "รดน้ำก่อนจัดส่ง 2 วัน",
                "special_handling": "ห้ามวางกล่องคว่ำ หลีกเลี่ยงแสงแดด",
                "temperature_control": True,
                "humidity_control": True
            }
        ]
        
        for data in shipping_data:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(PlantShippingInfo).filter(
                PlantShippingInfo.plant_id == data["plant_id"]
            ).first()
            
            if not existing:
                shipping_info = PlantShippingInfo(**data)
                db.add(shipping_info)
        
        db.commit()
        print(f"✅ เพิ่มข้อมูลการขนส่งสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_plant_prices_detailed():
    """เพิ่มข้อมูลราคาแบบละเอียด"""
    print("💰 เพิ่มข้อมูลราคาแบบละเอียด...")
    
    db = SessionLocal()
    try:
        # หาพืชและผู้ขายที่มีอยู่
        plants = db.query(Plant).all()
        sellers = db.query(Seller).all()
        
        if not plants or not sellers:
            print("❌ ไม่พบข้อมูลพืชหรือผู้ขาย")
            return
        
        # ข้อมูลราคาแบบละเอียด
        price_data = [
            {
                "plant_id": 1,  # Monstera
                "seller_id": 1,  # Plant Collector Thailand
                "base_price": 2500.0,
                "currency": "THB",
                "price_type": "fixed",
                "height": 80.0,
                "width": 60.0,
                "pot_size": "6inch",
                "leaf_count": 8,
                "maturity_level": "juvenile",
                "quality_grade": QualityGrade.A,
                "variegation_level": VariegationLevel.NONE,
                "health_score": 95.0,
                "seasonal_multiplier": 1.2,
                "peak_season": ["spring", "summer"],
                "off_season": ["winter"],
                "province": "กรุงเทพมหานคร",
                "city": "บางนา",
                "local_market_factor": 1.1,
                "platform": "facebook",
                "seller_type": "nursery",
                "verification_status": "verified",
                "rating": 4.8,
                "review_count": 156,
                "shipping_cost": 150.0,
                "shipping_methods": ["kerry", "thailand_post"],
                "shipping_time": "1-2 วัน",
                "condition": "new",
                "availability": True,
                "stock_quantity": 25
            },
            {
                "plant_id": 4,  # Philodendron Pink Princess
                "seller_id": 2,  # Green Paradise
                "base_price": 8500.0,
                "currency": "THB",
                "price_type": "negotiable",
                "height": 45.0,
                "width": 35.0,
                "pot_size": "4inch",
                "leaf_count": 6,
                "maturity_level": "baby",
                "quality_grade": QualityGrade.A,
                "variegation_level": VariegationLevel.HIGH,
                "health_score": 98.0,
                "seasonal_multiplier": 1.5,
                "peak_season": ["spring", "summer"],
                "off_season": ["winter"],
                "province": "เชียงใหม่",
                "city": "เมือง",
                "local_market_factor": 0.9,
                "platform": "line_shop",
                "seller_type": "garden_center",
                "verification_status": "verified",
                "rating": 4.9,
                "review_count": 89,
                "shipping_cost": 200.0,
                "shipping_methods": ["ems", "kerry"],
                "shipping_time": "2-3 วัน",
                "condition": "new",
                "availability": True,
                "stock_quantity": 8
            }
        ]
        
        for data in price_data:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(PlantPriceDetailed).filter(
                PlantPriceDetailed.plant_id == data["plant_id"],
                PlantPriceDetailed.seller_id == data["seller_id"]
            ).first()
            
            if not existing:
                price_detailed = PlantPriceDetailed(**data)
                db.add(price_detailed)
        
        db.commit()
        print(f"✅ เพิ่มข้อมูลราคาแบบละเอียดสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_seller_business_details():
    """เพิ่มข้อมูลธุรกิจผู้ขายแบบละเอียด"""
    print("🏪 เพิ่มข้อมูลธุรกิจผู้ขายแบบละเอียด...")
    
    db = SessionLocal()
    try:
        # หาผู้ขายที่มีอยู่
        sellers = db.query(Seller).all()
        if not sellers:
            print("❌ ไม่พบข้อมูลผู้ขาย")
            return
        
        # ข้อมูลธุรกิจ
        business_data = [
            {
                "seller_id": 1,  # Plant Collector Thailand
                "registration_number": "0105560001234",
                "tax_id": "0123456789012",
                "business_license": "LIC-2024-001",
                "license_expiry": datetime(2026, 12, 31),
                "business_years": 8,
                "employee_count": 15,
                "annual_revenue": "5-10 ล้านบาท",
                "business_hours": "จันทร์-อาทิตย์ 8:00-18:00",
                "production_capacity": "10,000 ต้น/เดือน",
                "quality_certifications": ["GAP", "Organic Thailand"],
                "organic_certified": True
            },
            {
                "seller_id": 2,  # Green Paradise
                "registration_number": "0205560005678",
                "tax_id": "0987654321098",
                "business_license": "LIC-2024-002",
                "license_expiry": datetime(2026, 6, 30),
                "business_years": 5,
                "employee_count": 8,
                "annual_revenue": "2-5 ล้านบาท",
                "business_hours": "อังคาร-อาทิตย์ 9:00-17:00",
                "production_capacity": "3,000 ต้น/เดือน",
                "quality_certifications": ["GAP"],
                "organic_certified": False
            }
        ]
        
        for data in business_data:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(SellerBusinessDetails).filter(
                SellerBusinessDetails.seller_id == data["seller_id"]
            ).first()
            
            if not existing:
                business_details = SellerBusinessDetails(**data)
                db.add(business_details)
        
        db.commit()
        print(f"✅ เพิ่มข้อมูลธุรกิจผู้ขายสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_seller_shipping_policies():
    """เพิ่มนโยบายการจัดส่ง"""
    print("🚚 เพิ่มนโยบายการจัดส่ง...")
    
    db = SessionLocal()
    try:
        # ข้อมูลนโยบายการจัดส่ง
        shipping_policies = [
            {
                "seller_id": 1,  # Plant Collector Thailand
                "shipping_methods": ["kerry", "thailand_post", "ems"],
                "shipping_zones": [
                    {"zone": "กรุงเทพฯ", "cost": 100, "delivery_time": "1-2 วัน"},
                    {"zone": "ปริมณฑล", "cost": 150, "delivery_time": "2-3 วัน"},
                    {"zone": "ต่างจังหวัด", "cost": 200, "delivery_time": "3-5 วัน"}
                ],
                "free_shipping_threshold": 3000.0,
                "packaging_fee": 50.0,
                "insurance_fee": 100.0,
                "processing_time": "1-2 วันทำการ",
                "delivery_time": [
                    {"zone": "กรุงเทพฯ", "time": "1-2 วัน"},
                    {"zone": "ปริมณฑล", "time": "2-3 วัน"},
                    {"zone": "ต่างจังหวัด", "time": "3-5 วัน"}
                ]
            },
            {
                "seller_id": 2,  # Green Paradise
                "shipping_methods": ["ems", "kerry"],
                "shipping_zones": [
                    {"zone": "เชียงใหม่", "cost": 80, "delivery_time": "1 วัน"},
                    {"zone": "ภาคเหนือ", "cost": 150, "delivery_time": "2-3 วัน"},
                    {"zone": "ภาคอื่นๆ", "cost": 250, "delivery_time": "3-5 วัน"}
                ],
                "free_shipping_threshold": 5000.0,
                "packaging_fee": 80.0,
                "insurance_fee": 150.0,
                "processing_time": "2-3 วันทำการ",
                "delivery_time": [
                    {"zone": "เชียงใหม่", "time": "1 วัน"},
                    {"zone": "ภาคเหนือ", "time": "2-3 วัน"},
                    {"zone": "ภาคอื่นๆ", "time": "3-5 วัน"}
                ]
            }
        ]
        
        for data in shipping_policies:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(SellerShippingPolicy).filter(
                SellerShippingPolicy.seller_id == data["seller_id"]
            ).first()
            
            if not existing:
                shipping_policy = SellerShippingPolicy(**data)
                db.add(shipping_policy)
        
        db.commit()
        print(f"✅ เพิ่มนโยบายการจัดส่งสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_seller_warranty_policies():
    """เพิ่มนโยบายการรับประกัน"""
    print("🛡️ เพิ่มนโยบายการรับประกัน...")
    
    db = SessionLocal()
    try:
        # ข้อมูลนโยบายการรับประกัน
        warranty_policies = [
            {
                "seller_id": 1,  # Plant Collector Thailand
                "warranty_period": 30,
                "warranty_coverage": ["health", "variegation", "size"],
                "warranty_conditions": "พืชต้องไม่ได้รับความเสียหายจากการขนส่ง",
                "return_policy": "รับคืนภายใน 7 วันหากพืชเสียหาย",
                "refund_policy": "คืนเงินเต็มจำนวนหรือเปลี่ยนพืชใหม่",
                "return_period": 7
            },
            {
                "seller_id": 2,  # Green Paradise
                "warranty_period": 14,
                "warranty_coverage": ["health"],
                "warranty_conditions": "พืชต้องไม่ได้รับความเสียหายจากการขนส่ง",
                "return_policy": "รับคืนภายใน 3 วันหากพืชเสียหาย",
                "refund_policy": "คืนเงิน 80% หรือเปลี่ยนพืชใหม่",
                "return_period": 3
            }
        ]
        
        for data in warranty_policies:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(SellerWarrantyPolicy).filter(
                SellerWarrantyPolicy.seller_id == data["seller_id"]
            ).first()
            
            if not existing:
                warranty_policy = SellerWarrantyPolicy(**data)
                db.add(warranty_policy)
        
        db.commit()
        print(f"✅ เพิ่มนโยบายการรับประกันสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def add_seller_payment_policies():
    """เพิ่มนโยบายการชำระเงิน"""
    print("💳 เพิ่มนโยบายการชำระเงิน...")
    
    db = SessionLocal()
    try:
        # ข้อมูลนโยบายการชำระเงิน
        payment_policies = [
            {
                "seller_id": 1,  # Plant Collector Thailand
                "payment_methods": ["cash", "bank_transfer", "credit_card", "promptpay"],
                "installment_available": True,
                "installment_terms": ["3 months", "6 months", "12 months"],
                "down_payment_percentage": 30.0,
                "bulk_discount": True,
                "bulk_discount_rates": [
                    {"quantity": 5, "discount": 10},
                    {"quantity": 10, "discount": 15},
                    {"quantity": 20, "discount": 20}
                ],
                "member_discount": True
            },
            {
                "seller_id": 2,  # Green Paradise
                "payment_methods": ["cash", "bank_transfer", "promptpay"],
                "installment_available": False,
                "bulk_discount": True,
                "bulk_discount_rates": [
                    {"quantity": 3, "discount": 5},
                    {"quantity": 5, "discount": 10}
                ],
                "member_discount": False
            }
        ]
        
        for data in payment_policies:
            # ตรวจสอบว่ามีข้อมูลนี้แล้วหรือไม่
            existing = db.query(SellerPaymentPolicy).filter(
                SellerPaymentPolicy.seller_id == data["seller_id"]
            ).first()
            
            if not existing:
                payment_policy = SellerPaymentPolicy(**data)
                db.add(payment_policy)
        
        db.commit()
        print(f"✅ เพิ่มนโยบายการชำระเงินสำเร็จ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """ฟังก์ชันหลัก"""
    print("🚀 PlantDex - เพิ่มข้อมูลแบบละเอียด")
    print("=" * 50)
    
    try:
        # เพิ่มข้อมูลพืชแบบละเอียด
        add_plant_images()
        add_plant_propagations()
        add_plant_pest_diseases()
        add_plant_seasonal_infos()
        add_plant_shipping_infos()
        
        # เพิ่มข้อมูลราคาแบบละเอียด
        add_plant_prices_detailed()
        
        # เพิ่มข้อมูลผู้ขายแบบละเอียด
        add_seller_business_details()
        add_seller_shipping_policies()
        add_seller_warranty_policies()
        add_seller_payment_policies()
        
        print("\n🎉 เพิ่มข้อมูลแบบละเอียดเสร็จสิ้น!")
        print("\n💡 ขั้นตอนต่อไป:")
        print("  1. ใช้ ChatGPT หาข้อมูลพืชหายากเพิ่มเติม")
        print("  2. อัปเดต frontend เพื่อแสดงข้อมูลใหม่")
        print("  3. ทดสอบการทำงานของระบบ")
        
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาดในฟังก์ชันหลัก: {e}")

if __name__ == "__main__":
    main() 