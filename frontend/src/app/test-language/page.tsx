"use client";

// import { useLanguage } from "../../lib/language-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestLanguagePage() {
  // const { t, language, setLanguage } = useLanguage(); // ปิดชั่วคราว
  const language: string = 'th'; // ตั้งเป็นไทย
  const setLanguage = (lang: string) => {}; // ฟังก์ชันเปล่า
  const t = (key: string) => {
    // Hardcode ภาษาไทย
    const thaiTexts: Record<string, string> = {
      'test.title': 'หน้าทดสอบภาษา',
      'test.description': 'หน้านี้สำหรับทดสอบการทำงานของระบบภาษา',
      'test.current': 'ภาษาปัจจุบัน',
      'test.change': 'เปลี่ยนภาษา',
      'header.nav.market': 'ตลาด',
      'header.nav.plants': 'พืช',
      'header.nav.trends': 'เทรนด์',
      'header.nav.pricing': 'ราคา',
      'header.cart': 'ตะกร้า',
      'header.signIn': 'เข้าสู่ระบบ',
      'header.getStarted': 'เริ่มต้นใช้งาน',
      'home.features.subtitle': 'ทุกสิ่งที่คุณต้องการสำหรับการติดตามตลาดพืช'
    };
    return thaiTexts[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'th' : 'en');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Language Test Page' : 'หน้าทดสอบภาษา'}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {language === 'en' 
              ? 'Test the bilingual functionality and layout adjustments' 
              : 'ทดสอบฟังก์ชันสองภาษาและการปรับแต่งเลย์เอาต์'
            }
          </p>
          
          <Button onClick={toggleLanguage} size="lg" className="mb-8">
            {language === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Current Language: {language === 'en' ? 'English' : 'ไทย'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Header Navigation Test */}
          <Card>
            <CardHeader>
              <CardTitle>Header Navigation</CardTitle>
              <CardDescription>Testing navigation text lengths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Market:</span>
                <span className="text-sm">{t('header.nav.market')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Plants:</span>
                <span className="text-sm">{t('header.nav.plants')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Trends:</span>
                <span className="text-sm">{t('header.nav.trends')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Pricing:</span>
                <span className="text-sm">{t('header.nav.pricing')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Button Text Test */}
          <Card>
            <CardHeader>
              <CardTitle>Button Text</CardTitle>
              <CardDescription>Testing button text lengths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Cart:</span>
                <span className="text-sm">{t('header.cart')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Sign In:</span>
                <span className="text-sm">{t('header.signIn')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Get Started:</span>
                <span className="text-sm">{t('header.getStarted')}</span>
              </div>
            </CardContent>
          </Card>

          {/* Long Text Test */}
          <Card>
            <CardHeader>
              <CardTitle>Long Text Test</CardTitle>
              <CardDescription>Testing long text handling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {t('home.features.subtitle')}
              </p>
            </CardContent>
          </Card>

          {/* Layout Test */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Test</CardTitle>
              <CardDescription>Testing flexible layout</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flexible-container">
                <span className="badge badge-secondary">{t('header.nav.market')}</span>
                <span className="badge badge-secondary">{t('header.nav.plants')}</span>
                <span className="badge badge-secondary">{t('header.nav.trends')}</span>
                <span className="badge badge-secondary">{t('header.nav.pricing')}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Responsive Test */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Responsive Layout Test</CardTitle>
            <CardDescription>Testing how layout adapts to different screen sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t('header.nav.market')}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'Market intelligence and pricing data' 
                    : 'ข้อมูลตลาดและข้อมูลราคา'
                  }
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t('header.nav.plants')}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'Plant database and search' 
                    : 'ฐานข้อมูลพืชและการค้นหา'
                  }
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t('header.nav.trends')}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'Market trends and predictions' 
                    : 'เทรนด์ตลาดและการคาดการณ์'
                  }
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">{t('header.nav.pricing')}</h3>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' 
                    ? 'Pricing plans and packages' 
                    : 'แผนราคาและแพ็กเกจ'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 