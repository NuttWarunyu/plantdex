# PlantDex 🌱

**Your Plant Market Intelligence Platform**

**แพลตฟอร์มข้อมูลตลาดพืชของคุณ**

## 🌟 Overview / ภาพรวม

PlantDex is a comprehensive plant market intelligence platform designed for Thailand's growing plant industry. It provides real-time pricing, market trends, and comprehensive plant data to help enthusiasts, buyers, and industry professionals make informed decisions.

PlantDex เป็นแพลตฟอร์มข้อมูลตลาดพืชที่ครอบคลุม ออกแบบมาสำหรับอุตสาหกรรมพืชไทยที่เติบโต ให้ข้อมูลราคาแบบเรียลไทม์ เทรนด์ตลาด และข้อมูลพืชทั่วไป เพื่อช่วยให้ผู้ที่ชื่นชอบ ผู้ซื้อ และผู้เชี่ยวชาญในอุตสาหกรรมตัดสินใจได้อย่างมีข้อมูล

## ✨ Features / คุณสมบัติ

### 🌿 Real-time Market Data / ข้อมูลตลาดแบบเรียลไทม์
- Live pricing and supply information from across Thailand
- ราคาและข้อมูลอุปทานสดจากทั่วไทย

### 🗃️ Extensive Plant Database / ฐานข้อมูลพืชที่กว้างขวาง
- Search and compare thousands of plants with detailed information
- ค้นหาและเปรียบเทียบพืชหลายพันชนิดด้วยข้อมูลที่ละเอียด

### 🤖 AI-Powered Trends / เทรนด์ที่ขับเคลื่อนด้วย AI
- Predict market movements and identify opportunities
- คาดการณ์การเคลื่อนไหวตลาดและระบุโอกาส

### 💰 Transparent Pricing / ราคาที่โปร่งใส
- Clear, competitive pricing plans for every need
- แผนราคาที่ชัดเจนและแข่งขันได้สำหรับทุกความต้องการ

## 🏗️ Architecture / สถาปัตยกรรม

### Frontend / ส่วนหน้า
- **Next.js 15** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** components
- **React Context** for language management (EN/TH)

### Backend / ส่วนหลัง
- **FastAPI** (Python)
- **SQLAlchemy** ORM
- **PostgreSQL** database
- **JWT** authentication
- **Redis** for caching

## 🚀 Getting Started / เริ่มต้นใช้งาน

### Prerequisites / ความต้องการเบื้องต้น
- Node.js 18+ 
- Python 3.8+
- PostgreSQL
- Redis
- Docker & Docker Compose (optional)

### Quick Start / เริ่มต้นเร็ว

```bash
# Clone repository
git clone https://github.com/NuttWarunyu/plantdex.git
cd plantdex

# Install all dependencies
make install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development servers
make dev
```

### Manual Setup / การตั้งค่าด้วยตนเอง

#### Frontend Setup / การตั้งค่าส่วนหน้า
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup / การตั้งค่าส่วนหลัง
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Docker Setup / การตั้งค่าด้วย Docker
```bash
# Start all services
make docker-up

# Stop all services
make docker-down
```

## 🌐 Languages / ภาษา

PlantDex supports both English and Thai languages with a comprehensive translation system.

PlantDex รองรับทั้งภาษาอังกฤษและไทยด้วยระบบการแปลที่ครอบคลุม

## 📊 Database Schema / โครงสร้างฐานข้อมูล

### Core Models / โมเดลหลัก
- **Users** - User authentication and profiles
- **Plants** - Plant information and specifications
- **Market Data** - Pricing and supply information
- **Trends** - Market analysis and predictions

## 🔧 Development / การพัฒนา

### Code Structure / โครงสร้างโค้ด
```
PlantDex/
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
├── database/          # Database migrations
└── docs/             # Documentation
```

### Contributing / การมีส่วนร่วม
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📈 Roadmap / แผนการพัฒนา

- [ ] User authentication system
- [ ] Plant image recognition
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Export functionality
- [ ] API documentation

## 🤝 Contributing / การมีส่วนร่วม

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

เรายินดีต้อนรับการมีส่วนร่วม! กรุณาอ่านแนวทางการมีส่วนร่วมของเราก่อนส่ง pull request

## 📄 License / ใบอนุญาต

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

โปรเจคนี้ได้รับอนุญาตภายใต้ MIT License - ดูรายละเอียดในไฟล์ [LICENSE](LICENSE)

## 📞 Contact / ติดต่อ

- **Email**: contact@plantdex.com
- **Website**: https://plantdex.com
- **GitHub**: https://github.com/yourusername/plantdex

---

**Made with ❤️ for the plant community**

**สร้างด้วย ❤️ สำหรับชุมชนผู้ที่ชื่นชอบพืช** 