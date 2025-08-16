"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Leaf,
  Users,
  Shield,
  Camera,
  Search,
  ArrowRight,
  Star,
  AlertCircle,
  Sparkles,
  Globe,
  CheckCircle
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-400/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-300/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/20 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm bg-green-100 text-green-700 border-green-200">
              <Sparkles className="h-4 w-4 mr-2" />
              แพลตฟอร์มปล่อยต้นไม้ใหม่
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span>Where Plants Get</span>{" "}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                New Stories
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-10 leading-relaxed">
              Plant swap = Planet happy
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link href="/give-plant">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-10 py-6 text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Heart className="mr-3 h-6 w-6" />
                  ปล่อยต้นไม้
                </Button>
              </Link>
              <Link href="/adopt-plant">
                <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-10 py-6 text-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Search className="mr-3 h-6 w-6" />
                  รับเลี้ยงต้นไม้
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>ฟรี 100%</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>ผู้ใช้ยืนยันแล้ว</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span>จับคู่ทันที</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why PlantDex Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm border-green-200 text-green-700">
              ทำไมต้องเลือกเรา
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              ทำไมต้องใช้ PlantDex?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              เราเชื่อมต่อผู้คนที่รักต้นไม้ ให้ต้นไม้ได้บ้านใหม่ที่ดีกว่า
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-4 text-gray-900">หาบ้านใหม่ที่ดีกว่า</CardTitle>
              <CardContent className="text-gray-600 text-lg leading-relaxed">
                ต้นไม้ของคุณจะได้บ้านใหม่ที่ดูแลดีกว่า ไม่อยู่ในมือคนที่ไม่สนใจ
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-4 text-gray-900">ชุมชนคนรักต้นไม้</CardTitle>
              <CardContent className="text-gray-600 text-lg leading-relaxed">
                เชื่อมต่อกับคนที่รักต้นไม้จริงๆ รับประกันว่าต้นไม้จะได้รับการดูแลที่ดี
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl mb-4 text-gray-900">ปลอดภัยและน่าเชื่อถือ</CardTitle>
              <CardContent className="text-gray-600 text-lg leading-relaxed">
                ระบบตรวจสอบผู้ใช้ การประเมินราคาที่เป็นธรรม และการจัดการธุรกรรมที่ปลอดภัย
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
} 