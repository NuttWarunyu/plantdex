# 🚀 Railway Deploy Guide - PlantDex

## 📋 **ขั้นตอนการ Deploy ไป Railway**

### **1. เตรียมไฟล์สำหรับ Production**

#### **1.1 สร้างไฟล์ .env สำหรับ Production**
```bash
# สร้างไฟล์ .env ใน backend/
ENVIRONMENT=production
DEBUG=false
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-super-secret-production-key-here
```

#### **1.2 ตรวจสอบ requirements.txt**
```bash
# ตรวจสอบว่ามี psycopg2-binary หรือไม่
pip install psycopg2-binary
pip freeze > requirements.txt
```

### **2. Deploy ไป Railway**

#### **2.1 Login Railway**
```bash
railway login
```

#### **2.2 สร้าง Project ใหม่**
```bash
railway init
```

#### **2.3 เพิ่ม PostgreSQL Service**
```bash
railway add
# เลือก PostgreSQL
```

#### **2.4 Deploy Backend**
```bash
railway up
```

#### **2.5 ดู Database URL**
```bash
railway variables
# คัดลอก DATABASE_URL
```

### **3. นำเข้าข้อมูลไปยัง PostgreSQL**

#### **3.1 อัพเดท .env ด้วย DATABASE_URL จริง**
```bash
# ใส่ DATABASE_URL ที่ได้จาก Railway
DATABASE_URL=postgresql://username:password@host:port/database
```

#### **3.2 รัน Migration Scripts**
```bash
# สร้างตารางใน PostgreSQL
python3 create_detailed_tables.py

# นำเข้าข้อมูลจาก CSV
python3 clear_and_import_data.py
```

## 🔧 **ไฟล์ที่ต้องเตรียม**

### **ไฟล์หลัก**
- `main.py` - FastAPI app
- `requirements.txt` - Python dependencies
- `railway.json` - Railway configuration

### **ไฟล์ CSV (ข้อมูล)**
- `plants.csv` - ข้อมูลพืช 20 ชนิด
- `plant_prices_detailed.csv` - ข้อมูลราคา 240 รายการ
- `plant_images.csv` - ข้อมูลรูปภาพ 60 รูป
- `plant_propagations.csv` - ข้อมูลการขยายพันธุ์
- `plant_pest_diseases.csv` - ข้อมูลโรคและแมลง
- `plant_seasonal_infos.csv` - ข้อมูลฤดูกาล
- `plant_shipping_infos.csv` - ข้อมูลการขนส่ง
- `sellers.csv` - ข้อมูลผู้ขาย

### **ไฟล์ Scripts**
- `create_detailed_tables.py` - สร้างตาราง
- `clear_and_import_data.py` - นำเข้าข้อมูล

## 📊 **ข้อมูลที่จะถูกนำเข้า PostgreSQL**

### **ตารางหลัก**
1. **plants** - พืช 20 ชนิด
2. **sellers** - ผู้ขาย 4 ราย
3. **plant_images** - รูปภาพ 60 รูป
4. **plant_propagations** - การขยายพันธุ์ 20 รายการ
5. **plant_pest_diseases** - โรคและแมลง 60 รายการ
6. **plant_seasonal_infos** - ฤดูกาล 20 รายการ
7. **plant_shipping_infos** - การขนส่ง 20 รายการ
8. **plant_prices_detailed** - ราคา 240 รายการ

### **ข้อมูลตัวอย่าง**
- **พืชหายาก**: Monstera Thai Constellation, Philodendron Pink Princess
- **ราคา**: 2,339 - 53,762 THB
- **ผู้ขาย**: Amazon Garden Thailand, Greenboog, Me Greenery Export
- **แพลตฟอร์ม**: Facebook, Shopee, Lazada, Nursery

## 🚨 **ข้อควรระวัง**

### **ก่อน Deploy**
- ✅ ตรวจสอบ requirements.txt
- ✅ ตรวจสอบ environment variables
- ✅ ตรวจสอบ database models
- ✅ ตรวจสอบ API endpoints

### **หลัง Deploy**
- ✅ ตรวจสอบ DATABASE_URL
- ✅ รัน migration scripts
- ✅ นำเข้าข้อมูลจาก CSV
- ✅ ทดสอบ API endpoints

### **การ Backup**
- ✅ เก็บไฟล์ CSV ไว้ใน Git
- ✅ เก็บ seeding scripts ไว้
- ✅ เก็บ database schema ไว้

## 🎯 **ผลลัพธ์ที่คาดหวัง**

### **หลัง Deploy สำเร็จ**
- 🌐 Backend API ทำงานบน Railway
- 🗄️ ข้อมูลอยู่ใน PostgreSQL
- 📊 API endpoints ใช้งานได้
- 🔒 ระบบปลอดภัยใน production

### **ข้อมูลที่พร้อมใช้งาน**
- 🌱 พืชหายาก 20 ชนิด
- 💰 ราคาแบบละเอียด 240 รายการ
- 🖼️ รูปภาพและข้อมูลครบถ้วน
- 📈 ระบบพร้อมให้บริการจริง

## 📝 **คำสั่งที่ต้องรัน**

```bash
# 1. Deploy ไป Railway
railway up

# 2. ดู DATABASE_URL
railway variables

# 3. อัพเดท .env
# ใส่ DATABASE_URL จริง

# 4. รัน migration
python3 create_detailed_tables.py

# 5. นำเข้าข้อมูล
python3 clear_and_import_data.py

# 6. ทดสอบ API
curl https://your-railway-app.railway.app/api/v1/plants
```

## 🔄 **การอัพเดทข้อมูลในอนาคต**

### **วิธีที่ 1: อัพเดทผ่าน CSV**
```bash
# แก้ไขไฟล์ CSV
# รัน import script ใหม่
python3 clear_and_import_data.py
```

### **วิธีที่ 2: อัพเดทผ่าน API**
```bash
# สร้าง admin endpoints
# อัพเดทข้อมูลผ่าน web interface
```

### **วิธีที่ 3: อัพเดทอัตโนมัติ**
```bash
# สร้าง cron job
# อัพเดทข้อมูลตามกำหนดเวลา
``` 