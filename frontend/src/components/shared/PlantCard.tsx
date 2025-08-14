'use client';

import { useState } from 'react';
import { Heart, TrendingUp, Star, Leaf, Droplets, Sun, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

interface PlantCardProps {
  plant: {
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
  };
  onViewDetails?: (plantId: number) => void;
  onAddToWatchlist?: (plantId: number) => void;
  className?: string;
}

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onViewDetails,
  onAddToWatchlist,
  className = ""
}) => {
  const [isWatched, setIsWatched] = useState(false);

  const handleAddToWatchlist = () => {
    setIsWatched(!isWatched);
    onAddToWatchlist?.(plant.id);
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      indoor: 'bg-blue-100 text-blue-800',
      outdoor: 'bg-green-100 text-green-800',
      tropical: 'bg-orange-100 text-orange-800',
      succulent: 'bg-purple-100 text-purple-800',
      cactus: 'bg-yellow-100 text-yellow-800',
      orchid: 'bg-pink-100 text-pink-800',
      herb: 'bg-emerald-100 text-emerald-800',
      tree: 'bg-brown-100 text-brown-800',
      shrub: 'bg-teal-100 text-teal-800',
      vine: 'bg-indigo-100 text-indigo-800',
      garden: 'bg-lime-100 text-lime-800',
      water: 'bg-cyan-100 text-cyan-800',
      rock: 'bg-gray-100 text-gray-800',
      border: 'bg-amber-100 text-amber-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category || ''] || colors.other;
  };

  const getCareLevelColor = (level?: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      difficult: 'bg-red-100 text-red-800'
    };
    return colors[level || ''] || colors.moderate;
  };

  const getInvestmentScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getInvestmentScoreLabel = (score?: number) => {
    if (!score) return 'N/A';
    if (score >= 80) return 'ยอดเยี่ยม';
    if (score >= 60) return 'ดี';
    if (score >= 40) return 'ปานกลาง';
    return 'ต่ำ';
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {plant.common_name_th}
            </CardTitle>
            <p className="text-sm text-gray-600 italic mb-2">
              {plant.scientific_name}
            </p>
            {plant.common_name_en && (
              <p className="text-xs text-gray-500 mb-2">
                {plant.common_name_en}
              </p>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAddToWatchlist}
            className={`p-2 h-8 w-8 ${isWatched ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart className={`w-4 h-4 ${isWatched ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Investment Score */}
        {plant.investment_score && (
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getInvestmentScoreColor(plant.investment_score)}>
              <Star className="w-3 h-3 mr-1" />
              Investment Score: {plant.investment_score}/100
            </Badge>
            <span className="text-xs text-gray-600">
              {getInvestmentScoreLabel(plant.investment_score)}
            </span>
          </div>
        )}

        {/* Category and Care Level */}
        <div className="flex flex-wrap gap-2">
          {plant.category && (
            <Badge className={getCategoryColor(plant.category)}>
              {plant.category === 'indoor' ? 'ต้นไม้ในร่ม' :
               plant.category === 'outdoor' ? 'ต้นไม้นอกบ้าน' :
               plant.category === 'tropical' ? 'ต้นไม้เขตร้อน' :
               plant.category === 'succulent' ? 'แคคตัส/ไม้อวบน้ำ' :
               plant.category === 'orchid' ? 'กล้วยไม้' :
               plant.category === 'herb' ? 'สมุนไพร' :
               plant.category === 'tree' ? 'ต้นไม้ใหญ่' :
               plant.category === 'shrub' ? 'ไม้พุ่ม' :
               plant.category === 'vine' ? 'ไม้เลื้อย' :
               plant.category === 'garden' ? 'ไม้ประดับสวน' :
               plant.category === 'water' ? 'ไม้น้ำ' :
               plant.category === 'rock' ? 'ไม้หิน' :
               plant.category === 'border' ? 'ไม้ขอบ' : plant.category}
            </Badge>
          )}
          
          {plant.care_level && (
            <Badge className={getCareLevelColor(plant.care_level)}>
              {plant.care_level === 'easy' ? 'ดูแลง่าย' :
               plant.care_level === 'moderate' ? 'ดูแลปานกลาง' :
               plant.care_level === 'difficult' ? 'ดูแลยาก' : plant.care_level}
            </Badge>
          )}

          {plant.is_rare && (
            <Badge className="bg-purple-100 text-purple-800">
              <Star className="w-3 h-3 mr-1" />
              หายาก
            </Badge>
          )}

          {plant.is_trending && (
            <Badge className="bg-orange-100 text-orange-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              ยอดนิยม
            </Badge>
          )}

          {plant.is_poisonous && (
            <Badge className="bg-red-100 text-red-800">
              ⚠️ เป็นพิษ
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Description */}
        {plant.description_th && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-3">
            {plant.description_th}
          </p>
        )}

        {/* Care Requirements */}
        <div className="space-y-2 mb-4">
          {plant.water_needs && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span>น้ำ: {plant.water_needs}</span>
            </div>
          )}
          
          {plant.light_needs && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sun className="w-4 h-4 text-yellow-500" />
              <span>แสง: {plant.light_needs}</span>
            </div>
          )}
          
          {plant.humidity_needs && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Leaf className="w-4 h-4 text-green-500" />
              <span>ความชื้น: {plant.humidity_needs}</span>
            </div>
          )}
          
          {(plant.temperature_min || plant.temperature_max) && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span>
                อุณหภูมิ: {plant.temperature_min || 'N/A'}°C - {plant.temperature_max || 'N/A'}°C
              </span>
            </div>
          )}
        </div>

        {/* Physical Properties */}
        {(plant.max_height || plant.max_width) && (
          <div className="text-xs text-gray-500 mb-4">
            {plant.max_height && <span>สูง: {plant.max_height}cm </span>}
            {plant.max_width && <span>กว้าง: {plant.max_width}cm</span>}
          </div>
        )}

        {/* Origin */}
        {plant.origin_country && (
          <div className="text-xs text-gray-500 mb-4">
            ต้นกำเนิด: {plant.origin_country}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onViewDetails?.(plant.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            ดูรายละเอียด
          </Button>
          
          <Button
            variant="outline"
            className="px-3"
            onClick={handleAddToWatchlist}
          >
            {isWatched ? 'ลบออก' : 'เพิ่ม'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantCard; 