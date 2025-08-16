"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";

interface PhotoUploadInterfaceProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  onEvaluate: () => void;
  loading: boolean;
}

export function PhotoUploadInterface({ 
  photos, 
  onPhotosChange, 
  onEvaluate, 
  loading 
}: PhotoUploadInterfaceProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/')
      );
      onPhotosChange([...photos, ...newFiles].slice(0, 5));
    }
  }, [photos, onPhotosChange]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      onPhotosChange([...photos, ...newFiles].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  const openCamera = () => {
    // This would integrate with device camera
    alert('Camera integration coming soon!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold mb-2">
          อัปโหลดรูปต้นไม้
        </CardTitle>
        <p className="text-gray-600">
          ถ่ายรูปต้นไม้หลายมุมเพื่อการประเมินราคาที่แม่นยำ
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Photo Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {photos.length === 0 ? (
            <div>
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                ลากและวางรูปภาพที่นี่
              </p>
              <p className="text-gray-600 mb-4">
                หรือคลิกเพื่อเลือกไฟล์
              </p>
              
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  เลือกไฟล์
                </Button>
                <Button
                  variant="outline"
                  onClick={openCamera}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  ใช้กล้อง
                </Button>
              </div>
              
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('file-input')?.click()}
                  disabled={photos.length >= 5}
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  เพิ่มรูป
                </Button>
                <Button
                  variant="outline"
                  onClick={openCamera}
                  disabled={photos.length >= 5}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  ใช้กล้อง
                </Button>
              </div>
              
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Photo Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">
                  เคล็ดลับการถ่ายรูปที่ดี
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• ถ่ายรูปในแสงที่เพียงพอ</li>
                  <li>• ถ่ายหลายมุม (ด้านหน้า, ด้านข้าง, ด้านบน)</li>
                  <li>• แสดงขนาดต้นไม้ให้ชัดเจน</li>
                  <li>• ถ่ายรูปใบไม้และลำต้นให้ชัด</li>
                  <li>• หลีกเลี่ยงเงาและแสงสะท้อน</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Count Badge */}
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="text-sm">
            รูปภาพ: {photos.length}/5
          </Badge>
        </div>

        {/* Evaluate Button */}
        <Button 
          onClick={onEvaluate}
          disabled={photos.length === 0 || loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              กำลังประเมิน...
            </>
          ) : (
            <>
              <Camera className="h-5 w-5 mr-2" />
              ประเมินราคาต้นไม้
            </>
          )}
        </Button>

        {/* Requirements */}
        <div className="text-center text-sm text-gray-500">
          <p>ต้องมีรูปภาพอย่างน้อย 1 รูป</p>
          <p>รองรับไฟล์: JPG, PNG, WebP (สูงสุด 5 รูป)</p>
        </div>
      </CardContent>
    </div>
  );
} 