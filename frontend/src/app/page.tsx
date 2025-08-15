'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import MarketTicker from '../components/shared/MarketTicker';
import PlantSearch, { SearchFilters } from '../components/shared/PlantSearch';
import { Search, TrendingUp, Star, Leaf, Calculator, Bell, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [emailSignup, setEmailSignup] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [lineId, setLineId] = useState('');

  const handleSearch = (query: string, filters: SearchFilters) => {
    console.log('Search:', query, filters);
    // TODO: Navigate to plants page with search results
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email signup:', emailSignup);
    // TODO: Send to backend
    setEmailSignup('');
  };

  const handlePhoneSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Phone signup:', phoneNumber);
    // TODO: Send to backend
    setPhoneNumber('');
  };

  const handleLineSignup = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('LINE signup:', lineId);
    // TODO: Send to backend
    setLineId('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-green-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              🌱 PlantDex
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Thailand&apos;s Real-Time Plant Market Intelligence
            </p>
            <p className="text-lg md:text-xl mb-12 text-blue-200">
              Make smarter plant investments with real data
            </p>
            
            {/* Quick Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <PlantSearch 
                onSearch={handleSearch}
                placeholder="ค้นหาต้นไม้ที่คุณสนใจ..."
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold">
                <Calculator className="w-5 h-5 mr-2" />
                เครื่องคำนวณ ROI
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Bell className="w-5 h-5 mr-2" />
                ตั้งการแจ้งเตือน
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <BarChart3 className="w-5 h-5 mr-2" />
                ดูรายงานตลาด
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Market Intelligence Hub */}
      <div className="container mx-auto px-6 py-12">
        <MarketTicker className="mb-12" />

        {/* Quick Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Plant Price Checker */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Plant Price Checker
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                ตรวจสอบราคาต้นไม้แบบ real-time พร้อม market analysis
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                ตรวจสอบราคา
              </Button>
            </CardContent>
          </Card>

          {/* Market Alert Setup */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-600" />
                Market Alert Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                รับการแจ้งเตือนเมื่อราคาต้นไม้เปลี่ยนแปลง
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                ตั้งการแจ้งเตือน
              </Button>
            </CardContent>
          </Card>

          {/* Investment Calculator */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                Investment Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                คำนวณ ROI และความเสี่ยงของการลงทุนต้นไม้
              </p>
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                คำนวณ ROI
              </Button>
            </CardContent>
          </Card>

          {/* Trend Analyzer */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                Trend Analyzer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                วิเคราะห์เทรนด์ตลาดต้นไม้และโอกาสการลงทุน
              </p>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                วิเคราะห์เทรนด์
              </Button>
            </CardContent>
          </Card>

          {/* Plant Database */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-600" />
                Plant Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                ฐานข้อมูลต้นไม้ครบถ้วนพร้อมข้อมูลการดูแล
              </p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                ดูฐานข้อมูล
              </Button>
            </CardContent>
          </Card>

          {/* Expert Network */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Expert Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                เชื่อมต่อกับผู้เชี่ยวชาญด้านต้นไม้และการลงทุน
              </p>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                หาผู้เชี่ยวชาญ
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Lead Magnets Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Weekly Plant Market Report */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">📊 Weekly Plant Market Report</CardTitle>
              <p className="text-blue-600 text-sm">
                รายงานตลาดต้นไม้รายสัปดาห์ พร้อม insights และโอกาสการลงทุน
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSignup} className="space-y-3">
                <Input
                  type="email"
                  placeholder="อีเมลของคุณ"
                  value={emailSignup}
                  onChange={(e) => setEmailSignup(e.target.value)}
                  className="border-blue-300 focus:border-blue-500"
                  required
                />
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  สมัครรับรายงานฟรี
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Top 10 Plants to Watch 2025 */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">🔥 Top 10 Plants to Watch 2025</CardTitle>
              <p className="text-green-600 text-sm">
                ต้นไม้ที่ควรจับตามองในปี 2025 พร้อมการวิเคราะห์และคำแนะนำ
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhoneSignup} className="space-y-3">
                <Input
                  type="tel"
                  placeholder="เบอร์โทรศัพท์"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="border-green-300 focus:border-green-500"
                  required
                />
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  รับรายงานฟรี
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Plant Investment ROI Calculator */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader>
              <CardTitle className="text-purple-800">💰 Plant Investment ROI Calculator</CardTitle>
              <p className="text-purple-600 text-sm">
                เครื่องมือคำนวณ ROI การลงทุนต้นไม้ พร้อมการวิเคราะห์ความเสี่ยง
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLineSignup} className="space-y-3">
                <Input
                  type="text"
                  placeholder="LINE ID ของคุณ"
                  value={lineId}
                  onChange={(e) => setLineId(e.target.value)}
                  className="border-purple-300 focus:border-purple-500"
                  required
                />
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                  รับเครื่องมือฟรี
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Trust Signals */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">ทำไมต้องเลือก PlantDex?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <h3 className="text-lg font-semibold mb-2">ข้อมูล Real-time</h3>
              <p className="text-gray-600">ข้อมูลตลาดอัปเดตแบบ real-time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🤖</div>
              <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">ใช้ AI วิเคราะห์และแนะนำการลงทุน</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">👨‍🌾</div>
              <h3 className="text-lg font-semibold mb-2">ผู้เชี่ยวชาญ</h3>
              <p className="text-gray-600">ทีมผู้เชี่ยวชาญด้านต้นไม้และการลงทุน</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔒</div>
              <h3 className="text-lg font-semibold mb-2">ปลอดภัย</h3>
              <p className="text-gray-600">ข้อมูลและธุรกรรมปลอดภัย 100%</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">พร้อมเริ่มต้นการลงทุนต้นไม้แล้วหรือยัง?</h2>
          <p className="text-xl mb-8 text-blue-100">
            เข้าร่วมชุมชนนักลงทุนต้นไม้ที่ใหญ่ที่สุดในประเทศไทย
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              เริ่มต้นใช้งานฟรี
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              ดูตัวอย่างรายงาน
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
