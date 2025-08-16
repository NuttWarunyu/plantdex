"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoUploadInterface } from "../../../components/instantbuy/PhotoUploadInterface";

interface InstantBuyEvaluation {
  id: string;
  plant_species: string;
  confidence_score: number;
  estimated_market_price: number;
  our_offer_price: number;
  offer_expires_at: string;
  evaluation_confidence: number;
}

export default function InstantBuyUpload() {
  const [photos, setPhotos] = useState<File[]>([]);
  const [evaluation, setEvaluation] = useState<InstantBuyEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEvaluate = async () => {
    if (photos.length === 0) return;

    setLoading(true);
    
    try {
      const formData = new FormData();
      photos.forEach(photo => formData.append('photos', photo));
      
      const response = await fetch('/api/v1/instantbuy/evaluate', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Evaluation failed');
      }
      
      const result = await response.json();
      setEvaluation(result);
      
    } catch (error) {
      console.error('Evaluation error:', error);
      alert('เกิดข้อผิดพลาดในการประเมิน กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = () => {
    if (evaluation) {
      router.push(`/instant-buy/offer/${evaluation.id}`);
    }
  };

  const handleRetry = () => {
    setEvaluation(null);
    setPhotos([]);
  };

  if (evaluation) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                ผลการประเมินต้นไม้
              </h1>
              <p className="text-gray-600">
                AI ได้วิเคราะห์ต้นไม้ของคุณแล้ว
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">ข้อมูลต้นไม้</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">ชนิด:</span>
                      <span className="ml-2 font-medium">{evaluation.plant_species}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ความแม่นยำ:</span>
                      <span className="ml-2 font-medium">{evaluation.confidence_score}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">ราคาตลาด:</span>
                      <span className="ml-2 font-medium text-green-600">
                        ฿{evaluation.estimated_market_price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">ข้อเสนอของเรา</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">ราคาที่เสนอ:</span>
                      <span className="ml-2 font-bold text-2xl text-blue-600">
                        ฿{evaluation.our_offer_price.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">หมดอายุ:</span>
                      <span className="ml-2 font-medium">
                        {new Date(evaluation.offer_expires_at).toLocaleString('th-TH')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={handleAcceptOffer}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                รับข้อเสนอ
              </button>
              <button
                onClick={handleRetry}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                ลองใหม่
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <PhotoUploadInterface
          photos={photos}
          onPhotosChange={setPhotos}
          onEvaluate={handleEvaluate}
          loading={loading}
        />
      </div>
    </div>
  );
} 