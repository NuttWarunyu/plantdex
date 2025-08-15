'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import PlantSearch, { SearchFilters } from '../../components/shared/PlantSearch';
import PlantCard from '../../components/shared/PlantCard';
import MarketTicker from '../../components/shared/MarketTicker';
import { TrendingUp, Star, Leaf, DollarSign, BarChart3 } from 'lucide-react';
import { plantsApi } from '../../lib/api';

interface Plant {
  id: number;
  scientific_name: string;
  common_name_th: string;
  common_name_en?: string;
  category?: string;
  care_level?: string;
  description_th?: string;
  description_en?: string;
  origin_country?: string;
  water_needs?: string;
  light_needs?: string;
  humidity_needs?: string;
  temperature_min?: number;
  temperature_max?: number;
  growth_rate?: string;
  max_height?: number;
  max_width?: number;
  is_poisonous?: boolean;
  is_rare?: boolean;
  is_trending?: boolean;
  investment_score?: number;
}

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Mock data for development
  const mockPlants: Plant[] = [
    {
      id: 1,
      scientific_name: 'Monstera deliciosa',
      common_name_th: 'มอนสเตอร่า',
      common_name_en: 'Swiss Cheese Plant',
      category: 'indoor',
      care_level: 'easy',
      description_th: 'ต้นไม้ใบใหญ่ที่มีรูตามธรรมชาติ เป็นที่นิยมในการตกแต่งบ้าน',
      description_en: 'Large-leafed plant with natural holes, popular for home decoration',
      origin_country: 'Mexico',
      water_needs: 'moderate',
      light_needs: 'bright indirect',
      humidity_needs: 'high',
      temperature_min: 18,
      temperature_max: 30,
      growth_rate: 'fast',
      max_height: 300,
      max_width: 200,
      is_poisonous: false,
      is_rare: false,
      is_trending: true,
      investment_score: 85
    },
    {
      id: 2,
      scientific_name: 'Philodendron pink princess',
      common_name_th: 'ฟิโลเดนดรอน พิงค์ พรินเซส',
      common_name_en: 'Pink Princess Philodendron',
      category: 'indoor',
      care_level: 'difficult',
      description_th: 'ต้นไม้หายากที่มีใบสีชมพูสวยงาม เป็นที่ต้องการของนักสะสม',
      description_en: 'Rare plant with beautiful pink leaves, highly sought after by collectors',
      origin_country: 'Colombia',
      water_needs: 'moderate',
      light_needs: 'bright indirect',
      humidity_needs: 'high',
      temperature_min: 20,
      temperature_max: 28,
      growth_rate: 'slow',
      max_height: 150,
      max_width: 100,
      is_poisonous: false,
      is_rare: true,
      is_trending: true,
      investment_score: 95
    },
    {
      id: 3,
      scientific_name: 'Anthurium crystallinum',
      common_name_th: 'แอนทูเรียม คริสตัลลินัม',
      common_name_en: 'Crystal Anthurium',
      category: 'indoor',
      care_level: 'difficult',
      description_th: 'ต้นไม้ใบใหญ่ที่มีเส้นใบสีขาวสวยงาม เหมือนคริสตัล',
      description_en: 'Large-leafed plant with beautiful white veins, like crystal',
      origin_country: 'Peru',
      water_needs: 'high',
      light_needs: 'bright indirect',
      humidity_needs: 'very high',
      temperature_min: 22,
      temperature_max: 30,
      growth_rate: 'slow',
      max_height: 120,
      max_width: 80,
      is_poisonous: false,
      is_rare: true,
      is_trending: false,
      investment_score: 88
    }
  ];

  useEffect(() => {
    // Fetch plants from API
    const fetchPlants = async () => {
      try {
        setIsLoading(true);
        const plantsData = await plantsApi.getAll();
        setPlants(plantsData);
        setFilteredPlants(plantsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch plants:', err);
        // Fallback to mock data
        setPlants(mockPlants);
        setFilteredPlants(mockPlants);
        setError('ไม่สามารถโหลดข้อมูลจากเซิร์ฟเวอร์ได้ - แสดงข้อมูลจำลอง');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlants();
  }, []);

  const handleSearch = (query: string, filters: SearchFilters) => {
    console.log('Search:', query, filters);
    
    let filtered = plants.filter(plant => {
      // Text search
      const searchText = query.toLowerCase();
      const matchesSearch = 
        plant.scientific_name.toLowerCase().includes(searchText) ||
        plant.common_name_th.toLowerCase().includes(searchText) ||
        (plant.common_name_en && plant.common_name_en.toLowerCase().includes(searchText)) ||
        (plant.description_th && plant.description_th.toLowerCase().includes(searchText));

      // Category filter
      const matchesCategory = !filters.category || plant.category === filters.category;
      
      // Care level filter
      const matchesCareLevel = !filters.care_level || plant.care_level === filters.care_level;

      return matchesSearch && matchesCategory && matchesCareLevel;
    });

    // Apply sorting
    filtered = sortPlants(filtered, sortBy);
    
    setFilteredPlants(filtered);
    setCurrentPage(1);
  };

  const sortPlants = (plantsToSort: Plant[], sortType: string): Plant[] => {
    return [...plantsToSort].sort((a, b) => {
      switch (sortType) {
        case 'name':
          return a.common_name_th.localeCompare(b.common_name_th);
        case 'investment_score':
          return (b.investment_score || 0) - (a.investment_score || 0);
        case 'rarity':
          return (b.is_rare ? 1 : 0) - (a.is_rare ? 1 : 0);
        case 'trending':
          return (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0);
        default:
          return 0;
      }
    });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const sorted = sortPlants(filteredPlants, value);
    setFilteredPlants(sorted);
  };

  const totalPages = Math.ceil(filteredPlants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPlants = filteredPlants.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">กำลังโหลดข้อมูลต้นไม้...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">เกิดข้อผิดพลาด</h2>
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
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🌱 Live Plant Database
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              ฐานข้อมูลต้นไม้แบบ Real-time พร้อมราคาและข้อมูลการลงทุน
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
              <PlantSearch 
                onSearch={handleSearch}
                placeholder="ค้นหาต้นไม้ที่คุณสนใจ..."
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{plants.length}</div>
                <div className="text-green-200">ต้นไม้ทั้งหมด</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{plants.filter(p => p.is_trending).length}</div>
                <div className="text-green-200">กำลังเป็นที่นิยม</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{plants.filter(p => p.is_rare).length}</div>
                <div className="text-green-200">หายาก</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{plants.filter(p => p.category === 'indoor').length}</div>
                <div className="text-green-200">ปลูกในบ้าน</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Market Ticker */}
      <div className="container mx-auto px-6 py-6">
        <MarketTicker />
      </div>

      {/* Filters and Controls */}
      <div className="container mx-auto px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-800">ตัวกรองและเรียงลำดับ</h3>
              
              {/* Sort Dropdown */}
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="เรียงลำดับตาม" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">ชื่อ (ก-ฮ)</SelectItem>
                  <SelectItem value="investment_score">คะแนนการลงทุน</SelectItem>
                  <SelectItem value="rarity">ความหายาก</SelectItem>
                  <SelectItem value="trending">ความนิยม</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">มุมมอง:</span>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <Leaf className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              แสดงผล: {filteredPlants.length} จาก {plants.length} รายการ
            </Badge>
            {filteredPlants.length !== plants.length && (
              <Badge variant="outline" className="text-blue-600">
                มีการกรองข้อมูล
              </Badge>
            )}
          </div>
        </div>

        {/* Plants Grid/List */}
        {currentPlants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบต้นไม้ที่ค้นหา</h3>
            <p className="text-gray-500 mb-6">ลองเปลี่ยนคำค้นหาหรือตัวกรองดูครับ</p>
            <Button 
              variant="outline"
              onClick={() => {
                setFilteredPlants(plants);
                setCurrentPage(1);
              }}
            >
              แสดงทั้งหมด
            </Button>
          </div>
        ) : (
          <>
            {/* Plants Display */}
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
            }>
              {currentPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  plant={plant}
                  onViewDetails={(id) => console.log('View plant:', id)}
                  onAddToWatchlist={(id) => console.log('Add to watchlist:', id)}
                  className={viewMode === 'list' ? 'flex-row' : ''}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ก่อนหน้า
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(page)}
                    className="w-10 h-10 p-0"
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  ถัดไป
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Investment Tips Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            💡 เคล็ดลับการลงทุนต้นไม้
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <TrendingUp className="w-5 h-5" />
                  ดูเทรนด์ตลาด
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ติดตามความนิยมของต้นไม้แต่ละชนิด และจับจังหวะซื้อขายให้เหมาะสม
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Star className="w-5 h-5" />
                  เลือกต้นไม้หายาก
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ต้นไม้หายากมักมีมูลค่าสูงและมีแนวโน้มราคาเพิ่มขึ้นในระยะยาว
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <DollarSign className="w-5 h-5" />
                  คำนวณ ROI
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ประเมินต้นทุนการดูแลและโอกาสการเติบโตเพื่อคำนวณผลตอบแทนการลงทุน
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 