"use client";

// import { useLanguage } from "../lib/language-context";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  // const { language, setLanguage, t } = useLanguage(); // ปิดชั่วคราว
  const language: string = 'th'; // ตั้งเป็นไทย
  const setLanguage = (lang: string) => {}; // ฟังก์ชันเปล่า
  const t = (key: string) => {
    // Hardcode ภาษาไทย
    const thaiTexts: Record<string, string> = {
      'home.hero.title': 'PlantDex',
      'home.hero.subtitle': 'ตลาดหุ้นสำหรับพืช - ข้อมูลราคาแบบเรียลไทม์ เทรนด์ และข้อมูลตลาดสำหรับอุตสาหกรรมพืชในประเทศไทย',
      'home.hero.explore': 'สำรวจตลาด',
      'home.hero.demo': 'ดูตัวอย่าง',
      'home.features.title': 'คุณสมบัติหลัก',
      'home.features.subtitle': 'ทุกสิ่งที่คุณต้องการสำหรับการติดตามตลาดพืช',
      'home.features.marketData.title': 'ข้อมูลตลาด',
      'home.features.marketData.description': 'ติดตามราคาและเทรนด์พืชในตลาดแบบเรียลไทม์',
      'home.features.plantDatabase.title': 'ฐานข้อมูลพืช',
      'home.features.plantDatabase.description': 'ข้อมูลครบถ้วนเกี่ยวกับพืชทุกชนิด'
    };
    return thaiTexts[key] || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
            
            {/* Language Switcher */}
            <div className="mb-10">
              <Button 
                onClick={() => setLanguage('en')}
                variant={language === 'en' ? 'default' : 'outline'}
                className="mr-3 px-6 py-2"
              >
                English
              </Button>
              <Button 
                onClick={() => setLanguage('th')}
                variant={language === 'th' ? 'default' : 'outline'}
                className="px-6 py-2"
              >
                ไทย
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link href="/market">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  {t('home.hero.explore')}
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2">
                {t('home.hero.demo')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-blue-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('home.features.marketData.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.features.marketData.description')}
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('home.features.plantDatabase.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.features.plantDatabase.description')}
              </p>
            </div>

            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('home.features.trends.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.features.trends.description')}
              </p>
            </div>

            {/* Pricing feature temporarily hidden - will be available in future updates */}
            {/* <div className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-red-50 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {t('home.features.pricing.title')}
              </h3>
              <p className="text-gray-600">
                {t('home.features.pricing.description')}
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              {t('home.stats.title')}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {t('home.stats.plants')}
              </div>
              <div className="text-lg opacity-90">
                {t('home.stats.plantsLabel')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {t('home.stats.sellers')}
              </div>
              <div className="text-lg opacity-90">
                {t('home.stats.sellersLabel')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {t('home.stats.provinces')}
              </div>
              <div className="text-lg opacity-90">
                {t('home.stats.provincesLabel')}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">
                {t('home.stats.accuracy')}
              </div>
              <div className="text-lg opacity-90">
                {t('home.stats.accuracyLabel')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            {t('home.cta.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              {t('home.cta.primary')}
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-2">
              {t('home.cta.secondary')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
