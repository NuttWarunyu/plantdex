#!/usr/bin/env python3
"""
Clear Data from Railway PostgreSQL Database
ลบข้อมูลออกจาก PostgreSQL บน Railway
"""

import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.models.plant import Plant
from app.models.plant_detailed import (
    PlantImage, PlantPropagation, PlantPestDisease,
    PlantSeasonalInfo, PlantShippingInfo, PlantPriceDetailed
)
from app.models.user import Seller, User
from app.models.market import MarketTrend, PlantPriceIndex, TrendingPlant

def clear_all_data(db: Session):
    """ลบข้อมูลทั้งหมดออกจากฐานข้อมูล"""
    print("🗑️ ลบข้อมูลเก่าออกจากฐานข้อมูล...")

    try:
        # ลบข้อมูลตามลำดับ (ลบ child ก่อน parent)
        db.query(PlantPriceDetailed).delete()
        db.query(PlantShippingInfo).delete()
        db.query(PlantSeasonalInfo).delete()
        db.query(PlantPestDisease).delete()
        db.query(PlantPropagation).delete()
        db.query(PlantImage).delete()
        db.query(MarketTrend).delete()
        db.query(TrendingPlant).delete()
        db.query(PlantPriceIndex).delete()
        db.query(Plant).delete()
        db.query(Seller).delete()
        db.query(User).delete()

        db.commit()
        print("  ✅ ลบข้อมูลเก่าเสร็จสิ้น")

    except Exception as e:
        print(f"  ❌ เกิดข้อผิดพลาดในการลบข้อมูล: {e}")
        db.rollback()
        raise

def main():
    """ฟังก์ชันหลัก"""
    print("🚀 เริ่มต้นการลบข้อมูลจาก Railway PostgreSQL...")

    db = SessionLocal()
    try:
        # ลบข้อมูลเก่า
        clear_all_data(db)
        print("\n🎉 การลบข้อมูลจาก Railway PostgreSQL เสร็จสิ้น!")

    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main() 