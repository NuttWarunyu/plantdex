"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Heart, 
  MapPin, 
  Leaf, 
  Star,
  ArrowLeft,
  Eye,
  MessageCircle,
  Phone,
  Calendar
} from "lucide-react";
import Link from "next/link";

interface PlantForAdoption {
  id: string;
  name: string;
  type: string;
  condition: string;
  size: string;
  age: string;
  reason: string;
  price: number;
  location: string;
  photos: string[];
  contactPhone: string;
  contactLine: string;
  postedAt: string;
  isFree: boolean;
}

export default function AdoptPlantPage() {
  const [plants, setPlants] = useState<PlantForAdoption[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantForAdoption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
                const [selectedType, setSelectedType] = useState("all");
              const [selectedCondition, setSelectedCondition] = useState("all");
              const [selectedSize, setSelectedSize] = useState("all");
              const [priceRange, setPriceRange] = useState("all");
              const [selectedLocation, setSelectedLocation] = useState("all");

  // Mock data for now
  useEffect(() => {
    const mockPlants: PlantForAdoption[] = [
      {
        id: "1",
        name: "Monstera Deliciosa",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์มาก",
        size: "ใหญ่ (สูง 100-200cm)",
        age: "2 ปี",
        reason: "ย้ายบ้าน ไม่มีที่ปลูก",
        price: 0,
        location: "กรุงเทพฯ",
        photos: ["/api/placeholder/300/200"],
        contactPhone: "081-234-5678",
        contactLine: "monstera_lover",
        postedAt: "2024-01-15",
        isFree: true
      },
      {
        id: "2",
        name: "Fiddle Leaf Fig",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์",
        size: "กลาง (สูง 30-100cm)",
        age: "1 ปี",
        reason: "ต้นไม้โตเกินไปสำหรับห้องเล็ก",
        price: 500,
        location: "เชียงใหม่",
        photos: ["/api/placeholder/300/200"],
        contactPhone: "089-876-5432",
        contactLine: "fig_care",
        postedAt: "2024-01-14",
        isFree: false
      },
      {
        id: "3",
        name: "Snake Plant",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์มาก",
        size: "เล็ก (สูง < 30cm)",
        age: "6 เดือน",
        reason: "ซื้อมาเยอะเกินไป",
        price: 200,
        location: "ภูเก็ต",
        photos: ["/api/placeholder/300/200"],
        contactPhone: "082-345-6789",
        contactLine: "snake_plant",
        postedAt: "2024-01-13",
        isFree: false
      },
      {
        id: "4",
        name: "ZZ Plant",
        type: "ต้นไม้ในร่ม",
        condition: "ปานกลาง",
        size: "กลาง (สูง 30-100cm)",
        age: "1.5 ปี",
        reason: "ไม่มีเวลาดูแล",
        price: 0,
        location: "กรุงเทพฯ",
        photos: ["/api/placeholder/300/200"],
        contactPhone: "083-456-7890",
        contactLine: "zz_care",
        postedAt: "2024-01-12",
        isFree: true
      },
      {
        id: "5",
        name: "Pothos Golden",
        type: "ต้นไม้ในร่ม",
        condition: "สมบูรณ์มาก",
        size: "ใหญ่ (สูง 100-200cm)",
        age: "3 ปี",
        reason: "ต้นไม้โตเกินไป ต้องการตัดแต่ง",
        price: 800,
        location: "ชลบุรี",
        photos: ["/api/placeholder/300/200"],
        contactPhone: "084-567-8901",
        contactLine: "pothos_lover",
        postedAt: "2024-01-11",
        isFree: false
      }
    ];

    setPlants(mockPlants);
    setFilteredPlants(mockPlants);
    setLoading(false);
  }, []);

  // Filter plants based on search and filters
  useEffect(() => {
    let filtered = plants;

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plant.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

                  // Type filter
              if (selectedType && selectedType !== 'all') {
                filtered = filtered.filter(plant => plant.type === selectedType);
              }

              // Condition filter
              if (selectedCondition && selectedCondition !== 'all') {
                filtered = filtered.filter(plant => plant.condition === selectedCondition);
              }

              // Size filter
              if (selectedSize && selectedSize !== 'all') {
                filtered = filtered.filter(plant => plant.size === selectedSize);
              }

                  // Price range filter
              if (priceRange && priceRange !== 'all') {
                switch (priceRange) {
                  case "free":
                    filtered = filtered.filter(plant => plant.isFree);
                    break;
                  case "0-500":
                    filtered = filtered.filter(plant => plant.price <= 500);
                    break;
                  case "500-1000":
                    filtered = filtered.filter(plant => plant.price > 500 && plant.price <= 1000);
                    break;
                  case "1000+":
                    filtered = filtered.filter(plant => plant.price > 1000);
                    break;
                }
              }

              // Location filter
              if (selectedLocation && selectedLocation !== 'all') {
                filtered = filtered.filter(plant => plant.location === selectedLocation);
              }

    setFilteredPlants(filtered);
  }, [plants, searchTerm, selectedType, selectedCondition, selectedSize, priceRange, selectedLocation]);

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

  const priceRanges = [
    { value: "free", label: "ให้ฟรี" },
    { value: "0-500", label: "0 - 500 บาท" },
    { value: "500-1000", label: "500 - 1,000 บาท" },
    { value: "1000+", label: "1,000+ บาท" }
  ];

  const locations = [
    "กรุงเทพฯ",
    "เชียงใหม่",
    "ภูเก็ต",
    "ชลบุรี",
    "นครราชสีมา",
    "ขอนแก่น",
    "อุบลราชธานี",
    "สงขลา"
  ];

                const clearFilters = () => {
                setSearchTerm("");
                setSelectedType("all");
                setSelectedCondition("all");
                setSelectedSize("all");
                setPriceRange("all");
                setSelectedLocation("all");
              };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดต้นไม้...</p>
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
            รับเลี้ยงต้นไม้
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            หาต้นไม้ที่ใช่สำหรับคุณ เปลี่ยนต้นไม้ที่ไม่ได้ใช้ให้เป็นความสุขของคนอื่น
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600" />
              ค้นหาและกรอง
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ค้นหาต้นไม้, ประเภท, หรือเหตุผล..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                            <Select value={selectedType} onValueChange={setSelectedType}>
                              <SelectTrigger>
                                <SelectValue placeholder="ประเภท" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกประเภท</SelectItem>
                                {plantTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                                            <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                              <SelectTrigger>
                                <SelectValue placeholder="สภาพ" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกสภาพ</SelectItem>
                                {conditions.map((condition) => (
                                  <SelectItem key={condition} value={condition}>
                                    {condition}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                                            <Select value={selectedSize} onValueChange={setSelectedSize}>
                              <SelectTrigger>
                                <SelectValue placeholder="ขนาด" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกขนาด</SelectItem>
                                {sizes.map((size) => (
                                  <SelectItem key={size} value={size}>
                                    {size}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                                            <Select value={priceRange} onValueChange={setPriceRange}>
                              <SelectTrigger>
                                <SelectValue placeholder="ราคา" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกราคา</SelectItem>
                                {priceRanges.map((range) => (
                                  <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                                            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                              <SelectTrigger>
                                <SelectValue placeholder="ที่อยู่" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">ทุกที่</SelectItem>
                                {locations.map((location) => (
                                  <SelectItem key={location} value={location}>
                                    {location}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                <Button onClick={clearFilters} variant="outline" className="w-full">
                  ล้างตัวกรอง
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            พบต้นไม้ {filteredPlants.length} ต้น
          </p>
          <Link href="/give-plant">
            <Button className="bg-green-600 hover:bg-green-700">
              <Heart className="mr-2 h-4 w-4" />
              ปล่อยต้นไม้
            </Button>
          </Link>
        </div>

        {/* Plants Grid */}
        {filteredPlants.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ไม่พบต้นไม้ที่ตรงกับเงื่อนไข
              </h3>
              <p className="text-gray-600 mb-4">
                ลองเปลี่ยนตัวกรองหรือกลับมาดูใหม่ในภายหลัง
              </p>
              <Button onClick={clearFilters} variant="outline">
                ล้างตัวกรอง
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlants.map((plant) => (
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
                    <Badge variant={plant.isFree ? "default" : "secondary"}>
                      {plant.isFree ? "ให้ฟรี" : `฿${plant.price.toLocaleString()}`}
                    </Badge>
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
                      <span className="font-medium">สภาพ:</span> {plant.condition}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">ขนาด:</span> {plant.size}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {plant.reason}
                  </p>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <Eye className="mr-2 h-4 w-4" />
                      ดูรายละเอียด
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <Card className="mt-12 bg-green-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              ไม่เจอต้นไม้ที่ใช่?
            </h2>
            <p className="text-green-100 mb-6">
              ลองปล่อยต้นไม้ของคุณเอง หรือรอต้นไม้ใหม่ที่ตรงใจ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/give-plant">
                <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                  <Heart className="mr-2 h-5 w-5" />
                  ปล่อยต้นไม้
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-green-700">
                <Calendar className="mr-2 h-5 w-5" />
                รับการแจ้งเตือน
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 