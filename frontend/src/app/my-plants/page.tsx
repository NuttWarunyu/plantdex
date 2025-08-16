"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { 
  Heart, 
  Leaf, 
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  MessageCircle,
  Calendar,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

interface PlantListing {
  id: string;
  name: string;
  type: string;
  condition: string;
  price: number;
  location: string;
  photos: string[];
  status: 'active' | 'pending' | 'adopted' | 'expired';
  postedAt: string;
  views: number;
  inquiries: number;
  isFree: boolean;
}

interface AdoptedPlant {
  id: string;
  name: string;
  type: string;
  condition: string;
  price: number;
  location: string;
  photos: string[];
  adoptedAt: string;
  sellerName: string;
  sellerContact: string;
  pickupDate: string;
  status: 'pending' | 'confirmed' | 'completed';
}

function MyPlantsPageContent() {
  const [givenPlants, setGivenPlants] = useState<PlantListing[]>([]);
  const [adoptedPlants, setAdoptedPlants] = useState<AdoptedPlant[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for now
  useEffect(() => {
    const mockGivenPlants: PlantListing[] = [
      {
        id: "1",
        name: "Monstera Deliciosa",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์มาก",
        price: 0,
        location: "กรุงเทพฯ",
        photos: ["/api/placeholder/300/200"],
        status: 'active',
        postedAt: "2024-01-15",
        views: 45,
        inquiries: 3,
        isFree: true
      },
      {
        id: "2",
        name: "Fiddle Leaf Fig",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์",
        price: 500,
        location: "เชียงใหม่",
        photos: ["/api/placeholder/300/200"],
        status: 'pending',
        postedAt: "2024-01-14",
        views: 23,
        inquiries: 1,
        isFree: false
      },
      {
        id: "3",
        name: "Snake Plant",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์มาก",
        price: 200,
        location: "ภูเก็ต",
        photos: ["/api/placeholder/300/200"],
        status: 'adopted',
        postedAt: "2024-01-13",
        views: 67,
        inquiries: 5,
        isFree: false
      }
    ];

    const mockAdoptedPlants: AdoptedPlant[] = [
      {
        id: "1",
        name: "ZZ Plant",
        type: "ต้นไม้ในร่ม",
        condition: "ปานกลาง",
        price: 0,
        location: "กรุงเทพฯ",
        photos: ["/api/placeholder/300/200"],
        adoptedAt: "2024-01-12",
        sellerName: "คุณสมชาย",
        sellerContact: "081-234-5678",
        pickupDate: "2024-01-20",
        status: 'confirmed'
      },
      {
        id: "2",
        name: "Pothos Golden",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์มาก",
        price: 800,
        location: "ชลบุรี",
        photos: ["/api/placeholder/300/200"],
        adoptedAt: "2024-01-10",
        sellerName: "คุณสมหญิง",
        sellerContact: "089-876-5432",
        pickupDate: "2024-01-18",
        status: 'completed'
      }
    ];

    setGivenPlants(mockGivenPlants);
    setAdoptedPlants(mockAdoptedPlants);
    setLoading(false);
  }, []);

  const getStatusBadge = (status: string, type: 'given' | 'adopted') => {
    const statusConfig = {
      active: { label: 'กำลังแสดง', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      pending: { label: 'รอการยืนยัน', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      adopted: { label: 'มีคนรับแล้ว', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' },
      expired: { label: 'หมดอายุ', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      confirmed: { label: 'ยืนยันแล้ว', variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      completed: { label: 'เสร็จสิ้น', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'adopted':
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ต้นไม้ของฉัน
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            จัดการต้นไม้ที่คุณปล่อยและรับเลี้ยง
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {givenPlants.filter(p => p.status === 'active').length}
            </div>
            <div className="text-gray-600">กำลังแสดง</div>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {givenPlants.filter(p => p.status === 'adopted').length}
            </div>
            <div className="text-gray-600">มีคนรับแล้ว</div>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {givenPlants.reduce((sum, p) => sum + p.inquiries, 0)}
            </div>
            <div className="text-gray-600">คำถามทั้งหมด</div>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {givenPlants.reduce((sum, p) => sum + p.views, 0)}
            </div>
            <div className="text-gray-600">การดูทั้งหมด</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="given" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="given" className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              ต้นไม้ที่ปล่อย ({givenPlants.length})
            </TabsTrigger>
            <TabsTrigger value="adopted" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              ต้นไม้ที่รับเลี้ยง ({adoptedPlants.length})
            </TabsTrigger>
          </TabsList>

          {/* Given Plants Tab */}
          <TabsContent value="given" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">ต้นไม้ที่ปล่อย</h2>
              <Link href="/give-plant">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Leaf className="mr-2 h-4 w-4" />
                  ปล่อยต้นไม้ใหม่
                </Button>
              </Link>
            </div>

            {givenPlants.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ยังไม่มีต้นไม้ที่ปล่อย
                  </h3>
                  <p className="text-gray-600 mb-6">
                    เริ่มปล่อยต้นไม้ของคุณเพื่อหาบ้านใหม่
                  </p>
                  <Link href="/give-plant">
                    <Button className="bg-green-600 hover:bg-green-700">
                      ปล่อยต้นไม้ใหม่
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {givenPlants.map((plant) => (
                  <Card key={plant.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                      <img
                        src={plant.photos[0]}
                        alt={plant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x300?text=ต้นไม้";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {plant.name}
                        </h3>
                        {getStatusBadge(plant.status, 'given')}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Leaf className="h-4 w-4" />
                          <span>{plant.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{plant.location}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">ราคา:</span> {plant.price === 0 ? 'ให้ฟรี' : `฿${plant.price.toLocaleString()}`}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>โพสต์เมื่อ {plant.postedAt}</span>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {plant.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-3 w-3" />
                            {plant.inquiries}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="mr-2 h-3 w-3" />
                          ดูรายละเอียด
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Adopted Plants Tab */}
          <TabsContent value="adopted" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">ต้นไม้ที่รับเลี้ยง</h2>
              <Link href="/adopt-plant">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Heart className="mr-2 h-4 w-4" />
                  รับเลี้ยงต้นไม้ใหม่
                </Button>
              </Link>
            </div>

            {adoptedPlants.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    ยังไม่มีต้นไม้ที่รับเลี้ยง
                  </h3>
                  <p className="text-gray-600 mb-6">
                    เริ่มรับเลี้ยงต้นไม้เพื่อให้ได้บ้านใหม่
                  </p>
                  <Link href="/adopt-plant">
                    <Button className="bg-green-600 hover:bg-green-700">
                      รับเลี้ยงต้นไม้ใหม่
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adoptedPlants.map((plant) => (
                  <Card key={plant.id} className="hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                      <img
                        src={plant.photos[0]}
                        alt={plant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300x300?text=ต้นไม้";
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {plant.name}
                        </h3>
                        {getStatusBadge(plant.status, 'adopted')}
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Leaf className="h-4 w-4" />
                          <span>{plant.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{plant.location}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">ราคา:</span> {plant.price === 0 ? 'ให้ฟรี' : `฿${plant.price.toLocaleString()}`}
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">ผู้ขาย:</span> {plant.sellerName}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>รับเลี้ยงเมื่อ {plant.adoptedAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>นัดรับ {plant.pickupDate}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <MessageCircle className="mr-2 h-3 w-3" />
                          ติดต่อผู้ขาย
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <Card className="mt-12 bg-green-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              ต้องการทำอะไรเพิ่มเติม?
            </h2>
            <p className="text-green-100 mb-6">
              ปล่อยต้นไม้ใหม่ หรือรับเลี้ยงต้นไม้ที่ต้องการ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/give-plant">
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  <Leaf className="mr-2 h-5 w-5" />
                  ปล่อยต้นไม้ใหม่
                </Button>
              </Link>
              <Link href="/adopt-plant">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
                  <Heart className="mr-2 h-5 w-5" />
                  รับเลี้ยงต้นไม้ใหม่
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function MyPlantsPage() {
  return (
    <ProtectedRoute>
      <MyPlantsPageContent />
    </ProtectedRoute>
  );
} 