#!/usr/bin/env python3
"""
Drop All Tables and Recreate
ลบตารางทั้งหมดและสร้างใหม่
"""

import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from sqlalchemy import text

def drop_all_tables():
    """ลบตารางทั้งหมด"""
    print("🗑️ ลบตารางทั้งหมด...")

    db = SessionLocal()
    try:
        # ลบตารางทั้งหมด
        db.execute(text("DROP SCHEMA public CASCADE"))
        db.execute(text("CREATE SCHEMA public"))
        db.execute(text("GRANT ALL ON SCHEMA public TO postgres"))
        db.execute(text("GRANT ALL ON SCHEMA public TO public"))
        
        db.commit()
        print("  ✅ ลบตารางทั้งหมดเสร็จสิ้น")

    except Exception as e:
        print(f"  ❌ เกิดข้อผิดพลาดในการลบตาราง: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def main():
    """ฟังก์ชันหลัก"""
    print("🚀 เริ่มต้นการลบตารางทั้งหมด...")

    try:
        # ลบตารางทั้งหมด
        drop_all_tables()
        print("\n🎉 การลบตารางทั้งหมดเสร็จสิ้น!")
        print("💡 ขั้นตอนต่อไป: รัน create_detailed_tables.py เพื่อสร้างตารางใหม่")

    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")

if __name__ == "__main__":
    main() 