'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { DollarSign, Upload, CheckCircle } from 'lucide-react';

interface SellRequest {
  plantName: string;
  category: string;
  size: string;
  condition: string;
  description: string;
  estimatedValue: number;
  contactName: string;
  contactPhone: string;
  location: string;
}

export default function PlantExchangePage() {
  const [sellRequest, setSellRequest] = useState<SellRequest>({
    plantName: '',
    category: '',
    size: '',
    condition: '',
    description: '',
    estimatedValue: 0,
    contactName: '',
    contactPhone: '',
    location: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleInputChange = (field: keyof SellRequest, value: string | number) => {
    setSellRequest(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Send to backend API
      console.log('Submitting sell request:', sellRequest);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmissionSuccess(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Failed to submit:', error);
      setIsSubmitting(false);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center p-8">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <CardTitle className="text-2xl font-bold text-gray-800 mb-4">
            ส่งคำขอขายต้นไม้สำเร็จ!
          </CardTitle>
          <CardContent>
            <p className="text-gray-600 mb-6">
              เราได้รับคำขอขายต้นไม้ของคุณแล้ว ทีมงานจะติดต่อกลับภายใน 24-48 ชั่วโมง
            </p>
            <Button 
              onClick={() => {
                setSubmissionSuccess(false);
                setSellRequest({
                  plantName: '',
                  category: '',
                  size: '',
                  condition: '',
                  description: '',
                  estimatedValue: 0,
                  contactName: '',
                  contactPhone: '',
                  location: ''
                });
              }}
              className="w-full"
            >
              ส่งคำขอใหม่
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              💰 InstantBuy Portal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              ขายต้นไม้ให้เรา รับเงินทันที!
            </p>
            
            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-2">💵</div>
                <h3 className="font-semibold mb-2">รับเงินทันที</h3>
                <p className="text-sm text-green-200">จ่ายเงินสดหลังรับต้นไม้</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🚚</div>
                <h3 className="font-semibold mb-2">รับฟรีถึงบ้าน</h3>
                <p className="text-sm text-green-200">ไม่ต้องเสียค่าเดินทาง</p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">ประเมินเร็ว</h3>
                <p className="text-sm text-green-200">ภายใน 24-48 ชั่วโมง</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-green-600" />
                ขอขายต้นไม้
              </CardTitle>
              <p className="text-gray-600">
                กรอกข้อมูลต้นไม้ที่ต้องการขาย เราจะติดต่อกลับภายใน 24-48 ชั่วโมง
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Plant Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    📋 ข้อมูลต้นไม้
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อต้นไม้ (ภาษาไทย) *
                    </label>
                    <Input
                      value={sellRequest.plantName}
                      onChange={(e) => handleInputChange('plantName', e.target.value)}
                      placeholder="เช่น มอนสเตอร่า, ฟิโลเดนดรอน"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        หมวดหมู่ *
                      </label>
                      <Select value={sellRequest.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกหมวดหมู่" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indoor">ไม้ในร่ม</SelectItem>
                          <SelectItem value="outdoor">ไม้นอกบ้าน</SelectItem>
                          <SelectItem value="tropical">ไม้เมืองร้อน</SelectItem>
                          <SelectItem value="succulent">ไม้อวบน้ำ</SelectItem>
                          <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ขนาดต้นไม้ *
                      </label>
                      <Select value={sellRequest.size} onValueChange={(value) => handleInputChange('size', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="เลือกขนาด" />
                        </SelectTrigger>
                        <SelectContent>
                                                  <SelectItem value="small">เล็ก (สูงน้อยกว่า 30cm)</SelectItem>
                        <SelectItem value="medium">กลาง (สูง 30-100cm)</SelectItem>
                        <SelectItem value="large">ใหญ่ (สูงมากกว่า 100cm)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      สภาพต้นไม้ *
                    </label>
                    <Select value={sellRequest.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกสภาพ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">ยอดเยี่ยม (ไม่มีปัญหา)</SelectItem>
                        <SelectItem value="good">ดี (มีปัญหาเล็กน้อย)</SelectItem>
                        <SelectItem value="fair">ปานกลาง (มีปัญหาบางส่วน)</SelectItem>
                        <SelectItem value="poor">แย่ (มีปัญหาหลายจุด)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      รายละเอียดเพิ่มเติม
                    </label>
                    <Textarea
                      value={sellRequest.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                      placeholder="อธิบายเพิ่มเติมเกี่ยวกับต้นไม้ เช่น อายุ, การดูแล, ปัญหาที่พบ, ฯลฯ"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      มูลค่าที่คาดหวัง (บาท)
                    </label>
                    <Input
                      type="number"
                      value={sellRequest.estimatedValue}
                                             onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('estimatedValue', parseInt(e.target.value) || 0)}
                      placeholder="เช่น 5000"
                      min="0"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    📞 ข้อมูลติดต่อ
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ชื่อ-นามสกุล *
                      </label>
                      <Input
                        value={sellRequest.contactName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contactName', e.target.value)}
                        placeholder="ชื่อของคุณ"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        เบอร์โทรศัพท์ *
                      </label>
                      <Input
                        value={sellRequest.contactPhone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('contactPhone', e.target.value)}
                        placeholder="081-234-5678"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ที่อยู่ *
                    </label>
                    <Input
                      value={sellRequest.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                      placeholder="จังหวัด, เขต/อำเภอ"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอขายต้นไม้'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 