"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  MapPin, 
  CreditCard, 
  Truck, 
  Shield,
  Star,
  AlertCircle
} from "lucide-react";

interface InstantBuyOffer {
  id: string;
  evaluation_id: string;
  plant_species: string;
  estimated_market_price: number;
  our_offer_price: number;
  offer_expires_at: string;
  pickup_terms: string;
  payment_method: string;
  ai_identification: {
    species: string;
    confidence: number;
  };
  photos: string[];
  price_reasoning: string;
}

export default function InstantBuyOfferPage() {
  const params = useParams();
  const router = useRouter();
  const [offer, setOffer] = useState<InstantBuyOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/instantbuy/offer/${params.evaluationId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch offer');
        }
        
        const offerData = await response.json();
        setOffer(offerData);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อเสนอได้');
        console.error('Error fetching offer:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.evaluationId) {
      fetchOffer();
    }
  }, [params.evaluationId]);

  const handleAcceptOffer = async () => {
    if (!offer) return;

    setAccepting(true);
    
    try {
      const response = await fetch('/api/v1/instantbuy/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offer.id })
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept offer');
      }
      
      const result = await response.json();
      router.push(`/instant-buy/transaction/${result.transaction_id}`);
      
    } catch (error) {
      console.error('Accept offer error:', error);
      alert('เกิดข้อผิดพลาดในการยืนยันข้อเสนอ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = () => {
    router.push('/instant-buy');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อเสนอ...</p>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-gray-600 mb-4">{error || 'ไม่พบข้อเสนอ'}</p>
          <Button onClick={() => router.push('/instant-buy')}>
            กลับไปหน้า InstantBuy
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(offer.offer_expires_at) < new Date();
  const timeRemaining = Math.max(0, new Date(offer.offer_expires_at).getTime() - new Date().getTime());
  const hoursRemaining = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ข้อเสนอการซื้อต้นไม้
            </h1>
            <p className="text-gray-600">
              ตรวจสอบรายละเอียดและยืนยันการขาย
            </p>
          </div>

          {/* Offer Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">ข้อเสนอของเรา</CardTitle>
                <Badge 
                  variant={isExpired ? "destructive" : "default"}
                  className={isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}
                >
                  {isExpired ? "หมดอายุ" : "ยังใช้งานได้"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Plant Info & Photos */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">ข้อมูลต้นไม้</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">ชนิด:</span>
                        <span className="font-medium">{offer.plant_species}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">AI Confidence:</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">{offer.ai_identification.confidence}%</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < Math.floor(offer.ai_identification.confidence / 20) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">ราคาตลาด:</span>
                        <span className="font-medium text-green-600">
                          ฿{offer.estimated_market_price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Photo Gallery */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">รูปภาพต้นไม้</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {offer.photos.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Price Reasoning */}
                  <div>
                    <h4 className="font-medium mb-3">เหตุผลในการตั้งราคา</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {offer.price_reasoning}
                    </p>
                  </div>
                </div>

                {/* Right Column - Offer Details */}
                <div>
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200 mb-6">
                    <h3 className="text-xl font-bold text-center mb-4">ราคาที่เราเสนอ</h3>
                    <div className="text-center mb-4">
                      <span className="text-4xl font-bold text-blue-600">
                        ฿{offer.our_offer_price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="text-center mb-4">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        รับเงินทันที
                      </Badge>
                    </div>

                    {!isExpired && (
                      <div className="text-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        เหลือเวลา: {hoursRemaining} ชม. {minutesRemaining} นาที
                      </div>
                    )}
                  </div>

                  {/* Offer Terms */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">การรับต้นไม้</h4>
                        <p className="text-sm text-gray-600">{offer.pickup_terms}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <CreditCard className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">วิธีการชำระเงิน</h4>
                        <p className="text-sm text-gray-600">{offer.payment_method}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">การขนส่ง</h4>
                        <p className="text-sm text-gray-600">เรามารับต้นไม้ถึงที่</p>
                      </div>
                    </div>
                  </div>

                  {/* Trust Signals */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-800">การรับประกัน</span>
                    </div>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• ราคายุติธรรมตามตลาด</li>
                      <li>• ไม่มีค่าธรรมเนียมแอบแฝง</li>
                      <li>• รับประกันความพึงพอใจ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isExpired ? (
              <>
                <Button 
                  onClick={handleAcceptOffer}
                  disabled={accepting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
                  size="lg"
                >
                  {accepting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังยืนยัน...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      ยืนยันการขาย
                    </>
                  )}
                </Button>
                
                <Button 
                  onClick={handleDecline}
                  variant="outline"
                  className="px-8 py-3 text-lg"
                  size="lg"
                >
                  ปฏิเสธข้อเสนอ
                </Button>
              </>
            ) : (
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">ข้อเสนอหมดอายุแล้ว</h3>
                <p className="text-gray-600 mb-4">กรุณาส่งรูปภาพใหม่เพื่อรับข้อเสนอใหม่</p>
                <Button onClick={() => router.push('/instant-buy/upload')}>
                  ส่งรูปภาพใหม่
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 