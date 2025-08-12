#!/usr/bin/env python3
"""
Check Enum Values in Database
ตรวจสอบค่า enum ในฐานข้อมูล
"""

import os
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from sqlalchemy import text

def check_enum_values():
    """ตรวจสอบค่า enum ในฐานข้อมูล"""
    print("🔍 ตรวจสอบค่า enum ในฐานข้อมูล...")

    db = SessionLocal()
    try:
        # ตรวจสอบ enum qualitygrade
        result = db.execute(text("""
            SELECT enumlabel 
            FROM pg_enum 
            WHERE enumtypid = (
                SELECT oid 
                FROM pg_type 
                WHERE typname = 'qualitygrade'
            )
            ORDER BY enumsortorder;
        """)).fetchall()
        
        print("📊 ค่า enum qualitygrade ที่มีอยู่:")
        for row in result:
            print(f"  - {row[0]}")
            
        # ตรวจสอบ enum propagationmethod
        result = db.execute(text("""
            SELECT enumlabel 
            FROM pg_enum 
            WHERE enumtypid = (
                SELECT oid 
                FROM pg_type 
                WHERE typname = 'propagationmethod'
            )
            ORDER BY enumsortorder;
        """)).fetchall()
        
        print("\n📊 ค่า enum propagationmethod ที่มีอยู่:")
        for row in result:
            print(f"  - {row[0]}")
            
        # ตรวจสอบ enum difficultylevel
        result = db.execute(text("""
            SELECT enumlabel 
            FROM pg_enum 
            WHERE enumtypid = (
                SELECT oid 
                FROM pg_type 
                WHERE typname = 'difficultylevel'
            )
            ORDER BY enumsortorder;
        """)).fetchall()
        
        print("\n📊 ค่า enum difficultylevel ที่มีอยู่:")
        for row in result:
            print(f"  - {row[0]}")

    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    check_enum_values() 