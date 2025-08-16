"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  DollarSign, 
  Clock, 
  Shield, 
  Truck, 
  Star,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

export default function InstantBuyPortal() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              InstantBuy Portal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              ขายต้นไม้ให้เราได้ทันที • ราคายุติธรรม • รับเงินสดทันที
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/instant-buy/upload">
                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                  <Camera className="h-5 w-5 mr-2" />
                  เริ่มขายต้นไม้
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                <DollarSign className="h-5 w-5 mr-2" />
                ดูราคาปัจจุบัน
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            วิธีการทำงาน
          </h2>
          <p className="text-lg text-gray-600">
            ขั้นตอนง่ายๆ เพียง 4 ขั้นตอน
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">1. ถ่ายรูป</h3>
            <p className="text-gray-600">ถ่ายรูปต้นไม้หลายมุม</p>
          </div>
          
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">2. AI วิเคราะห์</h3>
            <p className="text-gray-600">AI ระบุชนิดและประเมินราคา</p>
          </div>
          
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">3. รับข้อเสนอ</h3>
            <p className="text-gray-600">รับข้อเสนอราคาทันที</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">4. รับเงิน</h3>
            <p className="text-gray-600">เรามารับและจ่ายเงินทันที</p>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold mb-6">ทำไมต้องเลือกเรา?</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">ราคายุติธรรม</h4>
                  <p className="text-gray-600">ราคาตามตลาดจริง ไม่กดราคา</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">รวดเร็ว</h4>
                  <p className="text-gray-600">ประเมินราคาใน 5 นาที</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Truck className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">รับถึงที่</h4>
                  <p className="text-gray-600">เรามารับถึงบ้านคุณ</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <DollarSign className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">จ่ายเงินทันที</h4>
                  <p className="text-gray-600">รับเงินสดหรือโอนทันที</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>สถิติการทำงาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ต้นไม้ที่ซื้อแล้ว</span>
                    <span className="font-bold text-2xl text-green-600">1,247</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">ความพึงพอใจ</span>
                    <div className="flex items-center">
                      <span className="font-bold text-2xl text-yellow-600 mr-2">4.9</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">เวลาตอบสนอง</span>
                    <span className="font-bold text-2xl text-blue-600">5 นาที</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">อัตราการซื้อ</span>
                    <span className="font-bold text-2xl text-green-600">98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              การซื้อขายล่าสุด
            </h3>
            <p className="text-gray-600">
              ดูตัวอย่างการซื้อขายที่สำเร็จแล้ว
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { plant: "มอนสเตอร่า", price: "฿2,500", rating: 5, comment: "ราคาดีมาก ได้เงินทันที" },
              { plant: "ฟิโลเดนดรอน", price: "฿1,800", rating: 5, comment: "บริการดี รวดเร็ว" },
              { plant: "แคคตัส", price: "฿800", rating: 4, comment: "สะดวกมาก ไม่ต้องไปขายที่ไหน" }
            ].map((transaction, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{transaction.plant}</h4>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {transaction.price}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < transaction.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({transaction.rating})</span>
                  </div>
                  
                  <p className="text-sm text-gray-600 italic">
                    "{transaction.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="pt-8 pb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                พร้อมขายต้นไม้แล้วหรือยัง?
              </h3>
              <p className="text-gray-600 mb-6">
                เริ่มต้นได้ทันที เพียงถ่ายรูปต้นไม้ของคุณ
              </p>
              
              <Link href="/instant-buy/upload">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  เริ่มขายต้นไม้
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 