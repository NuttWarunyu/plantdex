#!/bin/bash

# 🚀 Railway Deploy Script - PlantDex
# Script สำหรับ deploy ไป Railway และนำเข้าข้อมูลไปยัง PostgreSQL

set -e  # หยุดการทำงานถ้าเกิด error

echo "🚀 เริ่มต้นการ Deploy PlantDex ไปยัง Railway..."

# ตรวจสอบว่า railway CLI ติดตั้งแล้วหรือไม่
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI ไม่ได้ติดตั้ง กรุณาติดตั้งก่อน:"
    echo "   npm install -g @railway/cli"
    exit 1
fi

# ตรวจสอบว่า login แล้วหรือไม่
if ! railway whoami &> /dev/null; then
    echo "🔐 กรุณา login Railway ก่อน:"
    echo "   railway login"
    exit 1
fi

echo "✅ Railway CLI พร้อมใช้งาน"

# ตรวจสอบไฟล์ที่จำเป็น
echo "📋 ตรวจสอบไฟล์ที่จำเป็น..."

required_files=(
    "main.py"
    "requirements.txt"
    "railway.json"
    "plants.csv"
    "plant_prices_detailed.csv"
    "plant_images.csv"
    "plant_propagations.csv"
    "plant_pest_diseases.csv"
    "plant_seasonal_infos.csv"
    "plant_shipping_infos.csv"
    "sellers.csv"
    "create_detailed_tables.py"
    "clear_and_import_data.py"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ ไม่พบไฟล์: $file"
        exit 1
    fi
done

echo "✅ ไฟล์ทั้งหมดพร้อมใช้งาน"

# Deploy ไปยัง Railway
echo "🚀 เริ่มต้นการ Deploy..."

if [ ! -f ".railway" ]; then
    echo "📁 สร้าง Railway project ใหม่..."
    railway init
else
    echo "📁 ใช้ Railway project ที่มีอยู่..."
fi

# เพิ่ม PostgreSQL service (ถ้ายังไม่มี)
echo "🗄️ ตรวจสอบ PostgreSQL service..."
if ! railway service list | grep -q "postgresql"; then
    echo "➕ เพิ่ม PostgreSQL service..."
    railway add postgresql
else
    echo "✅ PostgreSQL service มีอยู่แล้ว"
fi

# Deploy
echo "🚀 Deploy ไปยัง Railway..."
railway up

# รอให้ deploy เสร็จ
echo "⏳ รอให้ deploy เสร็จ..."
sleep 10

# ดู DATABASE_URL
echo "🔍 ดู DATABASE_URL..."
railway variables

echo ""
echo "📝 ขั้นตอนต่อไป:"
echo "1. คัดลอก DATABASE_URL จากด้านบน"
echo "2. สร้างไฟล์ .env และใส่ DATABASE_URL"
echo "3. รันคำสั่งต่อไปนี้:"
echo ""
echo "   # อัพเดท .env ด้วย DATABASE_URL จริง"
echo "   # จากนั้นรัน:"
echo "   python3 create_detailed_tables.py"
echo "   python3 clear_and_import_data.py"
echo ""
echo "🎉 Deploy เสร็จสิ้น! ระบบพร้อมใช้งานบน Railway"
echo "🌐 URL: https://your-app-name.railway.app" 