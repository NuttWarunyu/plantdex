"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "../../lib/language-context";
import { plantsApi, Plant, PlantPrice, handleApiError } from "../../lib/api";
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign,
  Star,
  BarChart3,
  Loader2
} from "lucide-react";

export default function PlantsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCareLevel, setSelectedCareLevel] = useState("all");
  const [selectedTrending, setSelectedTrending] = useState("all");
  
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch plants from backend
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: Record<string, string | boolean> = {};
        if (selectedCategory !== "all") params.category = selectedCategory;
        if (selectedCareLevel !== "all") params.care_level = selectedCareLevel;
        if (selectedTrending !== "all") params.trending = selectedTrending === "true";
        if (searchQuery.trim()) params.search = searchQuery.trim();
        
        const plantsData = await plantsApi.getAll(params);
        setPlants(plantsData);
        setFilteredPlants(plantsData);
      } catch (err) {
        setError(handleApiError(err));
        console.error("Failed to fetch plants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [selectedCategory, selectedCareLevel, selectedTrending, searchQuery]);

  // Filter plants based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlants(plants);
    } else {
      const filtered = plants.filter(plant => 
        plant.common_name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.common_name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPlants(filtered);
    }
  }, [searchQuery, plants]);

  const getCategoryLabel = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'philodendron': 'Philodendron',
      'monstera': 'Monstera',
      'alocasia': 'Alocasia',
      'anthurium': 'Anthurium',
      'calathea': 'Calathea',
      'other': 'อื่นๆ'
    };
    return categoryMap[category] || category;
  };

  const getCareLevelLabel = (careLevel: string) => {
    const careMap: { [key: string]: string } = {
      'easy': 'ง่าย',
      'moderate': 'ปานกลาง',
      'difficult': 'ยาก'
    };
    return careMap[careLevel] || careLevel;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">กำลังโหลดข้อมูลพืช...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">เกิดข้อผิดพลาด</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            ลองใหม่
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('plants.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('plants.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              {t('plants.filters.title')}
            </CardTitle>
            <CardDescription>
              {t('plants.filters.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder={t('plants.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('plants.filters.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('plants.filters.all')}</SelectItem>
                  <SelectItem value="philodendron">Philodendron</SelectItem>
                  <SelectItem value="monstera">Monstera</SelectItem>
                  <SelectItem value="alocasia">Alocasia</SelectItem>
                  <SelectItem value="anthurium">Anthurium</SelectItem>
                  <SelectItem value="calathea">Calathea</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCareLevel} onValueChange={setSelectedCareLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="ระดับการดูแล" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="easy">ง่าย</SelectItem>
                  <SelectItem value="moderate">ปานกลาง</SelectItem>
                  <SelectItem value="difficult">ยาก</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4">
              <Select value={selectedTrending} onValueChange={setSelectedTrending}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="พืชยอดนิยม" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="true">พืชยอดนิยม</SelectItem>
                  <SelectItem value="false">พืชทั่วไป</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            แสดงผล {filteredPlants.length} จาก {plants.length} รายการ
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              เรียงตาม
            </Button>
          </div>
        </div>

        {/* Plant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <Card key={plant.id} className="hover:shadow-lg transition-shadow group">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  {plant.image_url ? (
                    <img 
                      src={plant.image_url} 
                      alt={plant.common_name_th}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">ไม่มีรูปภาพ</div>
                  )}
                </div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex space-x-2">
                  {plant.is_trending && (
                    <Badge variant="default" className="text-xs bg-orange-500">
                      ยอดนิยม
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(plant.category)}
                  </Badge>
                </div>

                {/* Market Info Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">
                      {plant.common_name_th}
                    </CardTitle>
                    <CardDescription className="text-sm italic">
                      {plant.scientific_name}
                    </CardDescription>
                    <CardDescription className="text-sm text-gray-500">
                      {plant.common_name_en}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getCareLevelLabel(plant.care_level)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Description */}
                <div className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {plant.description_th || plant.description_en || "ไม่มีคำอธิบาย"}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      ดูราคา
                    </Button>
                    <Button size="sm" variant="outline">
                      <MapPin className="h-4 w-4 mr-2" />
                      หาซื้อ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบผลลัพธ์</h3>
            <p className="text-gray-600 mb-4">
              ลองเปลี่ยนคำค้นหาหรือตัวกรอง
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedCareLevel("all");
              setSelectedTrending("all");
            }}>
              ล้างตัวกรอง
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 