"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Camera, 
  Upload, 
  Leaf, 
  Heart, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface PlantFormData {
  plantName: string;
  plantType: string;
  condition: string;
  size: string;
  age: string;
  reason: string;
  desiredPrice: string;
  location: string;
  contactPhone: string;
  contactLine: string;
  photos: File[];
}

export default function GivePlantPage() {
  const [formData, setFormData] = useState<PlantFormData>({
    plantName: "",
    plantType: "",
    condition: "",
    size: "",
    age: "",
    reason: "",
    desiredPrice: "",
    location: "",
    contactPhone: "",
    contactLine: "",
    photos: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plantTypes = [
    "ต้นไม้ในร่ม",
    "ต้นไม้กลางแจ้ง", 
    "ไม้ดอก",
    "ไม้ใบ",
    "ไม้ผล",
    "แคคตัส/ไม้อวบน้ำ",
    "บอนไซ",
    "อื่นๆ"
  ];

  const conditions = [
    "สมบูรณ์มาก",
    "สมบูรณ์",
    "ปานกลาง",
    "ต้องการการดูแล",
    "ป่วย/มีปัญหา"
  ];

  const sizes = [
    "เล็ก (สูง < 30cm)",
    "กลาง (สูง 30-100cm)",
    "ใหญ่ (สูง 100-200cm)",
    "ใหญ่มาก (สูง > 200cm)"
  ];

  const handleInputChange = (field: keyof PlantFormData, value: string | File[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files].slice(0, 5) // Max 5 photos
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setIsSubmitted(true);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            ส่งข้อมูลสำเร็จ! 🎉
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            เราได้รับข้อมูลต้นไม้ของคุณแล้ว ระบบจะประมวลผลและแนะนำราคาที่เหมาะสมภายใน 24 ชั่วโมง
          </p>
          <div className="space-y-4">
            <Link href="/give-plant">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                ปล่อยต้นไม้อีกต้น
              </Button>
            </Link>
            <div>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  กลับหน้าหลัก
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ปล่อยต้นไม้
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ช่วยต้นไม้ของคุณหาบ้านใหม่ที่ดีกว่า เปลี่ยนต้นไม้ที่ไม่ได้ใช้ให้เป็นความสุขของคนอื่น
          </p>
        </div>

        {/* Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              รายละเอียดต้นไม้
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อต้นไม้ *
                  </label>
                  <Input
                    required
                    placeholder="เช่น Monstera, Fiddle Leaf Fig"
                    value={formData.plantName}
                    onChange={(e) => handleInputChange("plantName", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ประเภทต้นไม้ *
                  </label>
                  <Select value={formData.plantType} onValueChange={(value) => handleInputChange("plantType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทต้นไม้" />
                    </SelectTrigger>
                    <SelectContent>
                      {plantTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    สภาพต้นไม้ *
                  </label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกสภาพ" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ขนาด *
                  </label>
                  <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกขนาด" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    อายุต้นไม้
                  </label>
                  <Input
                    placeholder="เช่น 2 ปี, 6 เดือน"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เหตุผลที่ต้องการปล่อยต้นไม้ *
                </label>
                <Textarea
                  required
                  placeholder="บอกเหตุผลที่ต้องการปล่อยต้นไม้ เช่น ย้ายบ้าน, ต้นไม้โตเกินไป, ไม่มีเวลาดูแล"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                />
              </div>

              {/* Price & Location */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ราคาที่ต้องการ (บาท)
                  </label>
                  <Input
                    type="number"
                    placeholder="0 (ให้ฟรี) หรือใส่ราคาที่ต้องการ"
                    value={formData.desiredPrice}
                    onChange={(e) => handleInputChange("desiredPrice", e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    ใส่ 0 ถ้าต้องการให้ฟรี หรือใส่ราคาที่เหมาะสม
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ที่อยู่ (จังหวัด) *
                  </label>
                  <Input
                    required
                    placeholder="เช่น กรุงเทพฯ, เชียงใหม่, ภูเก็ต"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์
                  </label>
                  <Input
                    type="tel"
                    placeholder="081-234-5678"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Line ID
                  </label>
                  <Input
                    placeholder="line_id"
                    value={formData.contactLine}
                    onChange={(e) => handleInputChange("contactLine", e.target.value)}
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปภาพต้นไม้ *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <label htmlFor="photo-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="bg-white">
                        <Upload className="mr-2 h-4 w-4" />
                        อัพรูปภาพ
                      </Button>
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    อัพรูปภาพต้นไม้อย่างน้อย 1 รูป สูงสุด 5 รูป
                  </p>
                </div>

                {/* Photo Preview */}
                {formData.photos.length > 0 && (
                  <div className="mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  disabled={isSubmitting || formData.photos.length === 0}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังส่งข้อมูล...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-5 w-5" />
                      ส่งข้อมูลต้นไม้
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              เคล็ดลับการปล่อยต้นไม้
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <ul className="space-y-2 text-sm">
              <li>• ถ่ายรูปต้นไม้ในมุมที่เห็นสภาพชัดเจน</li>
              <li>• บอกเหตุผลที่ชัดเจนเพื่อให้ผู้รับเลี้ยงเข้าใจ</li>
              <li>• ตั้งราคาที่เหมาะสมกับสภาพและขนาดต้นไม้</li>
              <li>• เตรียมต้นไม้ให้สะอาดและพร้อมส่งมอบ</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 