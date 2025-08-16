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
  Phone,
  Calendar,
  AlertCircle,
  Download
} from "lucide-react";

interface InstantBuyTransaction {
  id: string;
  transaction_id: string;
  plant_species: string;
  agreed_price: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  pickup_location: string;
  pickup_scheduled_at: string;
  payment_method: string;
  seller_contact: {
    name: string;
    phone: string;
    address: string;
  };
  created_at: string;
  estimated_completion: string;
}

const statusConfig = {
  PENDING: {
    label: 'รอยืนยัน',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'รอการยืนยันจากทีมของเรา'
  },
  CONFIRMED: {
    label: 'ยืนยันแล้ว',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: CheckCircle,
    description: 'ยืนยันแล้ว รอการนัดหมาย'
  },
  COMPLETED: {
    label: 'เสร็จสิ้น',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    description: 'ธุรกรรมเสร็จสิ้นแล้ว'
  },
  CANCELLED: {
    label: 'ยกเลิก',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
    description: 'ธุรกรรมถูกยกเลิก'
  }
};

export default function InstantBuyTransactionPage() {
  const params = useParams();
  const router = useRouter();
  const [transaction, setTransaction] = useState<InstantBuyTransaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/instantbuy/transactions/${params.transactionId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch transaction');
        }
        
        const transactionData = await response.json();
        setTransaction(transactionData);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลธุรกรรมได้');
        console.error('Error fetching transaction:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.transactionId) {
      fetchTransaction();
    }
  }, [params.transactionId]);

  const handleContactSupport = () => {
    // This would open a chat or contact form
    alert('Contact support functionality coming soon!');
  };

  const handleDownloadReceipt = () => {
    // This would generate and download a receipt
    alert('Receipt download coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูลธุรกรรม...</p>
        </div>
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-gray-600 mb-4">{error || 'ไม่พบข้อมูลธุรกรรม'}</p>
          <Button onClick={() => router.push('/instant-buy')}>
            กลับไปหน้า InstantBuy
          </Button>
        </div>
      </div>
    );
  }

  const status = statusConfig[transaction.status];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              สถานะธุรกรรม
            </h1>
            <p className="text-gray-600">
              ติดตามความคืบหน้าของการขายต้นไม้
            </p>
          </div>

          {/* Transaction ID */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-600 mb-2">Transaction ID</p>
            <p className="font-mono text-lg font-medium bg-gray-100 px-4 py-2 rounded">
              {transaction.transaction_id}
            </p>
          </div>

          {/* Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">สถานะปัจจุบัน</CardTitle>
                <Badge variant="outline" className={status.color}>
                  {status.label}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gray-100 rounded-full">
                  <StatusIcon className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">{status.description}</h3>
                  <p className="text-gray-600">
                    สร้างเมื่อ: {new Date(transaction.created_at).toLocaleString('th-TH')}
                  </p>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="space-y-4">
                {[
                  { step: 1, label: 'ส่งรูปภาพ', completed: true },
                  { step: 2, label: 'AI วิเคราะห์', completed: true },
                  { step: 3, label: 'ยืนยันข้อเสนอ', completed: transaction.status !== 'PENDING' },
                  { step: 4, label: 'นัดหมายรับต้นไม้', completed: ['CONFIRMED', 'COMPLETED'].includes(transaction.status) },
                  { step: 5, label: 'เสร็จสิ้น', completed: transaction.status === 'COMPLETED' }
                ].map((step) => (
                  <div key={step.step} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.completed ? '✓' : step.step}
                    </div>
                    <span className={`${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Left Column - Plant & Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลการขาย</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ชนิดต้นไม้:</span>
                    <span className="font-medium">{transaction.plant_species}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">ราคาที่ตกลง:</span>
                    <span className="font-bold text-2xl text-green-600">
                      ฿{transaction.agreed_price.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">วิธีการชำระเงิน:</span>
                    <span className="font-medium">{transaction.payment_method}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">วันที่สร้าง:</span>
                    <span className="font-medium">
                      {new Date(transaction.created_at).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Pickup & Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลการรับต้นไม้</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600">สถานที่รับ:</span>
                      <p className="font-medium">{transaction.pickup_location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600">วันที่นัดหมาย:</span>
                      <p className="font-medium">
                        {transaction.pickup_scheduled_at 
                          ? new Date(transaction.pickup_scheduled_at).toLocaleString('th-TH')
                          : 'ยังไม่ได้นัดหมาย'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <span className="text-gray-600">ติดต่อ:</span>
                      <p className="font-medium">{transaction.seller_contact.name}</p>
                      <p className="text-sm text-gray-600">{transaction.seller_contact.phone}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estimated Completion */}
          {transaction.estimated_completion && (
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-blue-900">เวลาที่คาดว่าจะเสร็จสิ้น</h3>
                    <p className="text-blue-700">
                      {new Date(transaction.estimated_completion).toLocaleString('th-TH')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleContactSupport}
              variant="outline"
              className="px-6 py-3"
            >
              <Phone className="h-4 w-4 mr-2" />
              ติดต่อฝ่ายสนับสนุน
            </Button>
            
            {transaction.status === 'COMPLETED' && (
              <Button 
                onClick={handleDownloadReceipt}
                className="px-6 py-3 bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                ดาวน์โหลดใบเสร็จ
              </Button>
            )}
            
            <Button 
              onClick={() => router.push('/instant-buy')}
              variant="outline"
              className="px-6 py-3"
            >
              กลับไปหน้า InstantBuy
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600 mb-2">
              มีคำถามหรือต้องการความช่วยเหลือ?
            </p>
            <p className="text-sm text-gray-600">
              ติดต่อเราได้ที่: <span className="font-medium">support@plantdex.com</span> หรือ <span className="font-medium">02-XXX-XXXX</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 