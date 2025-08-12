"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, unknown>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Header
    header: {
      nav: {
        market: "Market",
        plants: "Plants",
        trends: "Trends",
        pricing: "Pricing"
      },
      cart: "Cart",
      signIn: "Sign In",
      getStarted: "Get Started",
      actions: {
        login: "Login",
        signup: "Sign Up"
      }
    },
    
    // Home Page
    home: {
      hero: {
        title: "PlantDex - Your Plant Market Intelligence",
        subtitle: "Discover real-time pricing, market trends, and comprehensive plant data for Thailand's growing plant industry",
        explore: "Explore Market",
        demo: "Watch Demo"
      },
      features: {
        title: "Why Choose PlantDex?",
        subtitle: "Comprehensive tools for plant enthusiasts, buyers, and industry professionals",
        marketData: {
          title: "Real-time Market Data",
          description: "Live pricing and supply information from across Thailand"
        },
        plantDatabase: {
          title: "Extensive Plant Database",
          description: "Search and compare thousands of plants with detailed information"
        },
        trends: {
          title: "AI-Powered Trends",
          description: "Predict market movements and identify opportunities"
        },
        pricing: {
          title: "Transparent Pricing",
          description: "Clear, competitive pricing plans for every need"
        }
      },
      stats: {
        title: "PlantDex by the Numbers",
        plants: "10,000+",
        plantsLabel: "Plants in Database",
        sellers: "500+",
        sellersLabel: "Verified Sellers",
        provinces: "77",
        provincesLabel: "Provinces Covered",
        accuracy: "99.9%",
        accuracyLabel: "Data Accuracy"
      },
      cta: {
        title: "Ready to Get Started?",
        subtitle: "Join thousands of plant enthusiasts and professionals",
        primary: "Start Free Trial",
        secondary: "Contact Sales"
      }
    },
    
    // Market Page
    market: {
      title: "Plant Market Intelligence",
      subtitle: "Real-time pricing, trends, and market analysis for the plant industry",
      lastUpdated: "Last Updated: Today",
      exportData: "Export Data",
      plantPriceIndex: {
        title: "Plant Price Index",
        updated: "Updated Today",
        overall: "Overall Index",
        indoor: "Indoor Plants",
        outdoor: "Outdoor Plants",
        rare: "Rare Plants",
        fromLastWeek: "from last week"
      },
      trending: {
        title: "Top 10 Trending Plants"
      },
      overview: {
        regionalSupply: {
          title: "Regional Supply Index",
          description: "Production capacity by province",
          plants: "plants"
        },
        exportReadiness: {
          title: "Export Readiness Index",
          description: "International market demand tracking",
          score: "Score"
        }
      },
      capacity: {
        veryHigh: "Very High",
        high: "High",
        medium: "Medium"
      },
      demand: {
        veryHigh: "Very High",
        high: "High",
        medium: "Medium"
      },
      countries: {
        singapore: "Singapore",
        malaysia: "Malaysia",
        hongkong: "Hong Kong",
        taiwan: "Taiwan",
        japan: "Japan"
      }
    },
    
    // Plants Page
    plants: {
      title: "Plant Database",
      subtitle: "Discover, search, and compare plants from trusted sellers across Thailand",
      filters: {
        title: "Search & Filters",
        subtitle: "Find the perfect plants for your needs",
        category: "Category",
        price: "Price Range",
        location: "Location",
        all: "All Categories"
      },
      search: {
        placeholder: "Search plants or scientific names..."
      },
      results: {
        showing: "Showing {count} of {total} plants"
      },
      actions: {
        market: "Market Data",
        sortBy: "Sort by"
      }
    },
    
    // Trends Page
    trends: {
      header: {
        title: "Market Trends",
        subtitle: "AI-powered market analysis and trend predictions for the plant industry"
      },
      timeframe: {
        "1month": "1 Month",
        "3months": "3 Months",
        "6months": "6 Months",
        "1year": "1 Year"
      },
      actions: {
        exportReport: "Export Report"
      },
      insights: {
        sentiment: {
          title: "Market Sentiment",
          value: "Bullish",
          description: "Strong upward momentum expected"
        },
        confidence: {
          title: "Confidence Score",
          value: "87%",
          description: "High confidence in predictions"
        },
        nextUpdate: {
          title: "Next Update",
          value: "24h",
          description: "Real-time data refresh"
        },
        opportunities: {
          title: "Market Opportunities",
          description: "Identified gaps and emerging markets"
        },
        risks: {
          title: "Risk Factors",
          description: "Potential challenges and mitigation strategies"
        }
      },
      categories: {
        risingStars: {
          title: "Rising Stars",
          description: "Plants with the highest growth potential"
        },
        declining: {
          title: "Declining Trends",
          description: "Plants with decreasing market interest"
        }
      },
      confidence: {
        high: "High",
        medium: "Medium",
        low: "Low"
      },
      reasons: {
        rareVariety: "Rare variety demand",
        socialMedia: "Social media trend",
        collectorInterest: "Collector interest",
        uniqueFoliage: "Unique foliage",
        aestheticAppeal: "Aesthetic appeal",
        marketSaturation: "Market saturation",
        oversupply: "Oversupply",
        priceCompetition: "Price competition",
        seasonalDip: "Seasonal dip",
        marketCorrection: "Market correction"
      },
      seasonal: {
        title: "Seasonal Demand Forecast",
        description: "AI-powered predictions for the next 3 months",
        recommended: "Recommended",
        january: {
          month: "January 2025",
          trend: "High demand for indoor plants",
          reason: "New Year resolutions, home decoration"
        },
        february: {
          month: "February 2025",
          trend: "Valentine's Day boost",
          reason: "Gift-giving season, romantic plants"
        },
        march: {
          month: "March 2025",
          trend: "Spring preparation",
          reason: "Garden planning, outdoor plants"
        }
      },
      opportunities: {
        rareMarket: {
          name: "Rare Plant Market",
          description: "Growing demand for unique varieties",
          action: "Increase rare plant inventory"
        },
        b2b: {
          name: "B2B Wholesale",
          description: "Untapped business-to-business market",
          action: "Develop wholesale platform"
        },
        export: {
          name: "Export to Singapore",
          description: "Strong demand for Thai plants",
          action: "Establish export partnerships"
        },
        careServices: {
          name: "Plant Care Services",
          description: "Subscription-based maintenance",
          action: "Launch care service packages"
        }
      },
      potential: {
        high: "High",
        medium: "Medium"
      },
      risks: {
        climateChange: {
          name: "Climate Change Impact",
          description: "Weather patterns affecting plant growth",
          mitigation: "Diversify suppliers, climate monitoring"
        },
        supplyChain: {
          name: "Supply Chain Disruption",
          description: "Transportation and logistics issues",
          mitigation: "Multiple supplier networks"
        },
        regulatory: {
          name: "Regulatory Changes",
          description: "Import/export policy updates",
          mitigation: "Stay informed, compliance monitoring"
        },
        marketSaturation: {
          name: "Market Saturation",
          description: "Oversupply in common varieties",
          mitigation: "Focus on unique, rare plants"
        }
      },
      severity: {
        high: "High",
        medium: "Medium",
        low: "Low"
      }
    },
    
    // Sell to Us
    sellToUs: {
      hero: {
        title: "Sell Your Plants to PlantDex",
        subtitle: "Get fair prices for your quality plants. We buy rare, healthy, and market-ready plants from enthusiasts like you.",
        badges: {
          quality: "Quality Assured",
          fast: "Fast Response",
          expert: "Expert Curation"
        }
      },
      form: {
        title: "Submit Your Plant",
        subtitle: "Tell us about your plant and upload photos",
        photos: {
          title: "Plant Photos",
          before: "Before Cutting",
          after: "After Cutting", 
          roots: "Roots & Soil",
          video: "Short Video"
        },
        details: {
          species: "Plant Species",
          speciesPlaceholder: "e.g., Monstera Albo, Philodendron Pink Princess",
          size: "Plant Size",
          sizePlaceholder: "e.g., 6 inches, 15cm",
          age: "Plant Age",
          agePlaceholder: "e.g., 1 year, 6 months",
          health: "Plant Health",
          healthOptions: {
            excellent: "Excellent - Perfect condition",
            good: "Good - Minor imperfections",
            fair: "Fair - Some issues"
          }
        },
        description: "Additional Details",
        descriptionPlaceholder: "Tell us more about your plant, any special features, or care requirements...",
        submit: "Submit for Review"
      },
      standards: {
        title: "Quality Standards",
        rare: "Rare and in-demand varieties",
        healthy: "100% healthy condition",
        size: "Market-appropriate size",
        seasonal: "Seasonal market demand"
      },
      process: {
        title: "How It Works",
        step1: {
          title: "Submit Plant",
          description: "Upload photos and details"
        },
        step2: {
          title: "Expert Review",
          description: "Our experts evaluate"
        },
        step3: {
          title: "Get Offer",
          description: "Receive fair price offer"
        },
        step4: {
          title: "Ship & Get Paid",
          description: "Send plant, get money"
        }
      },
      security: {
        title: "Security Notice",
        notice1: "We only buy plants that meet our quality standards",
        notice2: "Photos must match the actual plant received",
        notice3: "Payment made after quality verification"
      }
    },
    
    // Common
    common: {
      verified: "Verified",
      outOfStock: "Out of Stock",
      reviews: "reviews",
      soldBy: "Sold by",
      noResults: "No plants found",
      "noResults.subtitle": "Try adjusting your search criteria or filters",
      clearFilters: "Clear Filters"
    },
    
    // Categories
    category: {
      indoor: "Indoor",
      outdoor: "Outdoor",
      succulent: "Succulent",
      rare: "Rare"
    },
    
    // Price ranges
    price: {
      all: "All Prices",
      "0-500": "฿0 - ฿500",
      "501-1000": "฿501 - ฿1,000",
      "1001-2000": "฿1,001 - ฿2,000",
      "2000+": "฿2,000+"
    },
    
    // Locations
    location: {
      all: "All Locations",
      bangkok: "Bangkok",
      chiangmai: "Chiang Mai",
      chonburi: "Chonburi",
      nakhonratchasima: "Nakhon Ratchasima",
      songkhla: "Songkhla"
    }
  },
  th: {
    // Header
    header: {
      nav: {
        market: "ตลาด",
        plants: "พืช",
        trends: "เทรนด์",
        pricing: "ราคา"
      },
      cart: "ตะกร้า",
      signIn: "เข้าสู่ระบบ",
      getStarted: "เริ่มต้น",
      actions: {
        login: "เข้าสู่ระบบ",
        signup: "สมัครสมาชิก"
      }
    },
    
    // Home Page
    home: {
      hero: {
        title: "PlantDex - ข้อมูลตลาดพืชของคุณ",
        subtitle: "ราคาแบบเรียลไทม์ เทรนด์ และข้อมูลพืชทั่วไปสำหรับอุตสาหกรรมพืชไทยที่เติบโต",
        explore: "ค้นพบตลาด",
        demo: "ดูตัวอย่าง"
      },
      features: {
        title: "ทำไมควรเลือก PlantDex?",
        subtitle: "เครื่องมือทั่วไปสำหรับผู้ที่ชื่นชอบพืช ผู้ซื้อ และผู้เชี่ยวชาญในอุตสาหกรรม",
        marketData: {
          title: "ข้อมูลตลาดที่สดใส",
          description: "ราคาและข้อมูลอุปทานจากทั่วไปในไทย"
        },
        plantDatabase: {
          title: "ฐานข้อมูลพืชที่กว้างขวาง",
          description: "ค้นหาและเปรียบเทียบพืชหลายพันธุ์ด้วยข้อมูลที่ละเอียด"
        },
        trends: {
          title: "เทรนด์ที่ขับเคลื่อนด้วย AI",
          description: "คาดการณ์การเคลื่อนไหวตลาดและระบุโอกาส"
        },
        pricing: {
          title: "ราคาที่โปร่งใส",
          description: "แผนราคาที่ชัดเจน ที่เหมาะสมสำหรับทุกความต้องการ"
        }
      },
      stats: {
        title: "PlantDex ด้วยตัวเลข",
        plants: "10,000+",
        plantsLabel: "พืชในฐานข้อมูล",
        sellers: "500+",
        sellersLabel: "ผู้ขายที่ยืนยันแล้ว",
        provinces: "77",
        provincesLabel: "จังหวัดที่ครอบคลุม",
        accuracy: "99.9%",
        accuracyLabel: "ความแม่นยำของข้อมูล"
      },
      cta: {
        title: "พร้อมที่จะเริ่มต้นแล้วไหม?",
        subtitle: "เข้าร่วมผู้ที่ชื่นชอบพืชและผู้เชี่ยวชาญหลายคน",
        primary: "ทดลองใช้ฟรี",
        secondary: "ติดต่อฝ่ายขาย"
      }
    },
    
    // Market Page
    market: {
      title: "ข้อมูลตลาดพืช",
      subtitle: "ราคาแบบเรียลไทม์ เทรนด์ และการวิเคราะห์ตลาดสำหรับอุตสาหกรรมพืช",
      lastUpdated: "อัปเดตล่าสุด: วันนี้",
      exportData: "ส่งออกข้อมูล",
      plantPriceIndex: {
        title: "ดัชนีราคาพืช",
        updated: "อัปเดตวันนี้",
        overall: "ดัชนีรวม",
        indoor: "พืชในร่ม",
        outdoor: "พืชกลางแจ้ง",
        rare: "พืชหายาก",
        fromLastWeek: "จากสัปดาห์ที่แล้ว"
      },
      trending: {
        title: "พืชยอดนิยม 10 อันดับ"
      },
      overview: {
        regionalSupply: {
          title: "ดัชนีอุปทานภูมิภาค",
          description: "กำลังการผลิตตามจังหวัด",
          plants: "พืช"
        },
        exportReadiness: {
          title: "ดัชนีความพร้อมส่งออก",
          description: "การติดตามความต้องการตลาดต่างประเทศ",
          score: "คะแนน"
        }
      },
      capacity: {
        veryHigh: "สูงมาก",
        high: "สูง",
        medium: "ปานกลาง"
      },
      demand: {
        veryHigh: "สูงมาก",
        high: "สูง",
        medium: "ปานกลาง"
      },
      countries: {
        singapore: "สิงคโปร์",
        malaysia: "มาเลเซีย",
        hongkong: "ฮ่องกง",
        taiwan: "ไต้หวัน",
        japan: "ญี่ปุ่น"
      }
    },
    
    // Plants Page
    plants: {
      title: "ฐานข้อมูลพืช",
      subtitle: "ค้นพบ ค้นหา และเปรียบเทียบพืชจากผู้ขายที่เชื่อถือได้ทั่วไทย",
      filters: {
        title: "ค้นหาและกรอง",
        subtitle: "หาพืชที่สมบูรณ์แบบสำหรับความต้องการของคุณ",
        category: "หมวดหมู่",
        price: "ช่วงราคา",
        location: "ตำแหน่ง",
        all: "ทุกหมวดหมู่"
      },
      search: {
        placeholder: "ค้นหาพืชหรือชื่อวิทยาศาสตร์..."
      },
      results: {
        showing: "แสดง {count} จาก {total} พืช"
      },
      actions: {
        market: "ข้อมูลตลาด",
        sortBy: "เรียงตาม"
      }
    },
    
    // Trends Page
    trends: {
      header: {
        title: "เทรนด์ตลาด",
        subtitle: "การวิเคราะห์ตลาดที่ขับเคลื่อนด้วย AI และการคาดการณ์เทรนด์สำหรับอุตสาหกรรมพืช"
      },
      timeframe: {
        "1month": "1 เดือน",
        "3months": "3 เดือน",
        "6months": "6 เดือน",
        "1year": "1 ปี"
      },
      actions: {
        exportReport: "ส่งออกรายงาน"
      },
      insights: {
        sentiment: {
          title: "ความรู้สึกตลาด",
          value: "ขาขึ้น",
          description: "คาดการณ์โมเมนตัมขาขึ้นที่แข็งแกร่ง"
        },
        confidence: {
          title: "คะแนนความเชื่อมั่น",
          value: "สูง",
          description: "ความเชื่อมั่นสูงในการคาดการณ์"
        },
        nextUpdate: {
          title: "อัปเดตถัดไป",
          value: "24h",
          description: "การรีเฟรชข้อมูลแบบเรียลไทม์"
        },
        opportunities: {
          title: "โอกาสตลาด",
          description: "ช่องว่างที่ระบุและตลาดที่เกิดขึ้นใหม่"
        },
        risks: {
          title: "ปัจจัยความเสี่ยง",
          description: "ความท้าทายที่อาจเกิดขึ้นและกลยุทธ์การบรรเทา"
        }
      },
      categories: {
        risingStars: {
          title: "ดาวรุ่ง",
          description: "พืชที่มีศักยภาพการเติบโตสูงสุด"
        },
        declining: {
          title: "เทรนด์ที่ลดลง",
          description: "พืชที่มีความสนใจตลาดลดลง"
        }
      },
      confidence: {
        high: "สูง",
        medium: "ปานกลาง",
        low: "ต่ำ"
      },
      reasons: {
        rareVariety: "ความต้องการพันธุ์หายาก",
        socialMedia: "เทรนด์โซเชียลมีเดีย",
        collectorInterest: "ความสนใจของนักสะสม",
        uniqueFoliage: "ใบไม้ที่เป็นเอกลักษณ์",
        aestheticAppeal: "ความน่าสนใจทางสุนทรียศาสตร์",
        marketSaturation: "ความอิ่มตัวของตลาด",
        oversupply: "อุปทานเกิน",
        priceCompetition: "การแข่งขันราคา",
        seasonalDip: "การลดลงตามฤดูกาล",
        marketCorrection: "การแก้ไขตลาด"
      },
      seasonal: {
        title: "การคาดการณ์ความต้องการตามฤดูกาล",
        description: "การคาดการณ์ที่ขับเคลื่อนด้วย AI สำหรับ 3 เดือนถัดไป",
        recommended: "แนะนำ",
        january: {
          month: "มกราคม 2025",
          trend: "ความต้องการพืชในร่มสูง",
          reason: "เป้าหมายปีใหม่ การตกแต่งบ้าน"
        },
        february: {
          month: "กุมภาพันธ์ 2025",
          trend: "การเพิ่มขึ้นของวันวาเลนไทน์",
          reason: "ฤดูกาลให้ของขวัญ พืชโรแมนติก"
        },
        march: {
          month: "มีนาคม 2025",
          trend: "การเตรียมฤดูใบไม้ผลิ",
          reason: "การวางแผนสวน พืชกลางแจ้ง"
        }
      },
      opportunities: {
        rareMarket: {
          name: "ตลาดพืชหายาก",
          description: "ความต้องการที่เพิ่มขึ้นสำหรับพันธุ์ที่เป็นเอกลักษณ์",
          action: "เพิ่มสินค้าคงคลังพืชหายาก"
        },
        b2b: {
          name: "ขายส่ง B2B",
          description: "ตลาดธุรกิจต่อธุรกิจที่ยังไม่ได้ใช้ประโยชน์",
          action: "พัฒนาแพลตฟอร์มขายส่ง"
        },
        export: {
          name: "ส่งออกไปสิงคโปร์",
          description: "ความต้องการพืชไทยที่แข็งแกร่ง",
          action: "สร้างพันธมิตรการส่งออก"
        },
        careServices: {
          name: "บริการดูแลพืช",
          description: "การบำรุงรักษาแบบสมัครสมาชิก",
          action: "เปิดตัวแพ็คเกจบริการดูแล"
        }
      },
      potential: {
        high: "สูง",
        medium: "ปานกลาง"
      },
      risks: {
        climateChange: {
          name: "ผลกระทบการเปลี่ยนแปลงสภาพภูมิอากาศ",
          description: "รูปแบบสภาพอากาศที่ส่งผลต่อการเติบโตของพืช",
          mitigation: "กระจายซัพพลายเออร์ การติดตามสภาพภูมิอากาศ"
        },
        supplyChain: {
          name: "การหยุดชะงักของห่วงโซ่อุปทาน",
          description: "ปัญหาการขนส่งและโลจิสติกส์",
          mitigation: "เครือข่ายซัพพลายเออร์หลายแห่ง"
        },
        regulatory: {
          name: "การเปลี่ยนแปลงกฎระเบียบ",
          description: "การอัปเดตนโยบายนำเข้า/ส่งออก",
          mitigation: "ติดตามข้อมูล การตรวจสอบการปฏิบัติตาม"
        },
        marketSaturation: {
          name: "ความอิ่มตัวของตลาด",
          description: "อุปทานเกินในพันธุ์ทั่วไป",
          mitigation: "เน้นพืชที่เป็นเอกลักษณ์และหายาก"
        }
      },
      severity: {
        high: "สูง",
        medium: "ปานกลาง",
        low: "ต่ำ"
      }
    },
    
    // Sell to Us
    sellToUs: {
      hero: {
        title: "ขายพืชให้ PlantDex",
        subtitle: "รับราคายุติธรรมสำหรับพืชคุณภาพ เรารับซื้อพืชหายาก สุขภาพดี และพร้อมขายต่อจากผู้ที่ชื่นชอบพืชเช่นคุณ",
        badges: {
          quality: "รับประกันคุณภาพ",
          fast: "ตอบกลับเร็ว",
          expert: "คัดเลือกโดยผู้เชี่ยวชาญ"
        }
      },
      form: {
        title: "ส่งพืชของคุณ",
        subtitle: "บอกเราเกี่ยวกับพืชของคุณและอัปโหลดรูปภาพ",
        photos: {
          title: "รูปภาพพืช",
          before: "ก่อนตัด",
          after: "หลังตัด",
          roots: "รากและดิน",
          video: "วิดีโอสั้น"
        },
        details: {
          species: "พันธุ์พืช",
          speciesPlaceholder: "เช่น Monstera Albo, Philodendron Pink Princess",
          size: "ขนาดพืช",
          sizePlaceholder: "เช่น 6 นิ้ว, 15 ซม.",
          age: "อายุพืช",
          agePlaceholder: "เช่น 1 ปี, 6 เดือน",
          health: "สุขภาพพืช",
          healthOptions: {
            excellent: "ยอดเยี่ยม - สภาพสมบูรณ์",
            good: "ดี - มีข้อบกพร่องเล็กน้อย",
            fair: "ปานกลาง - มีปัญหาบางอย่าง"
          }
        },
        description: "รายละเอียดเพิ่มเติม",
        descriptionPlaceholder: "บอกเราเพิ่มเติมเกี่ยวกับพืชของคุณ คุณสมบัติพิเศษ หรือข้อกำหนดการดูแล...",
        submit: "ส่งให้ตรวจสอบ"
      },
      standards: {
        title: "มาตรฐานคุณภาพ",
        rare: "พันธุ์หายากและเป็นที่ต้องการ",
        healthy: "สุขภาพสมบูรณ์ 100%",
        size: "ขนาดเหมาะสมกับตลาด",
        seasonal: "ความต้องการตามฤดูกาล"
      },
      process: {
        title: "วิธีการทำงาน",
        step1: {
          title: "ส่งพืช",
          description: "อัปโหลดรูปภาพและรายละเอียด"
        },
        step2: {
          title: "ตรวจสอบโดยผู้เชี่ยวชาญ",
          description: "ผู้เชี่ยวชาญของเราประเมิน"
        },
        step3: {
          title: "รับข้อเสนอ",
          description: "รับข้อเสนอราคายุติธรรม"
        },
        step4: {
          title: "ส่งและรับเงิน",
          description: "ส่งพืช รับเงิน"
        }
      },
      security: {
        title: "ข้อควรระวังด้านความปลอดภัย",
        notice1: "เรารับซื้อเฉพาะพืชที่ตรงตามมาตรฐานคุณภาพของเรา",
        notice2: "รูปภาพต้องตรงกับพืชจริงที่ได้รับ",
        notice3: "จ่ายเงินหลังตรวจสอบคุณภาพ"
      }
    },
    
    // Common
    common: {
      verified: "ยืนยันแล้ว",
      outOfStock: "หมดสต็อก",
      reviews: "รีวิว",
      soldBy: "ขายโดย",
      noResults: "ไม่พบพืช",
      "noResults.subtitle": "ลองปรับเกณฑ์การค้นหาหรือตัวกรองของคุณ",
      clearFilters: "ล้างตัวกรอง"
    },
    
    // Categories
    category: {
      indoor: "ในร่ม",
      outdoor: "กลางแจ้ง",
      succulent: "พืชอวบน้ำ",
      rare: "หายาก"
    },
    
    // Price ranges
    price: {
      all: "ทุกราคา",
      "0-500": "฿0 - ฿500",
      "501-1000": "฿501 - ฿1,000",
      "1001-2000": "฿1,001 - ฿2,000",
      "2000+": "฿2,000+"
    },
    
    // Locations
    location: {
      all: "ทุกตำแหน่ง",
      bangkok: "กรุงเทพฯ",
      chiangmai: "เชียงใหม่",
      chonburi: "ชลบุรี",
      nakhonratchasima: "นครราชสีมา",
      songkhla: "สงขลา"
    }
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'th'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    // Update HTML lang attribute
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.setAttribute('data-lang', lang);
    }
  };

  const t = (key: string, params?: Record<string, unknown>): string => {
    const keys = key.split('.');
    let value: unknown = (translations as Record<string, unknown>)[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    let result = typeof value === 'string' ? value : key;
    
    // Replace parameters if provided
    if (params && typeof result === 'string') {
      Object.keys(params).forEach(paramKey => {
        result = result.replace(`{${paramKey}}`, String(params[paramKey]));
      });
    }
    
    return result;
  };

  // Update HTML lang attribute when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.setAttribute('data-lang', language);
    }
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 