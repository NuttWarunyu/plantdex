"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "../../lib/language-context";
import { plantsApi, Plant } from "../../lib/api";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Target,
  Lightbulb,
  ArrowUpRight,
  Clock,
  Loader2
} from "lucide-react";

export default function TrendsPage() {
  const { t } = useLanguage();
  
  const [timeframe, setTimeframe] = useState("4weeks");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [marketTrends, setMarketTrends] = useState<any[]>([]);
  const [priceIndices, setPriceIndices] = useState<any[]>([]);
  const [trendingPlants, setTrendingPlants] = useState<any[]>([]);
  const [plants, setPlants] = useState<Plant[]>([]);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch market trends
        // const trendsResponse = await marketApi.getTrends({ limit: 10 });
        // setMarketTrends(trendsResponse.trends);
        
        // Fetch price indices
        // const priceResponse = await marketApi.getPriceIndex();
        // setPriceIndices(priceResponse.price_indices);
        
        // Fetch trending plants
        // const trendingResponse = await marketApi.getTrendingPlants({ limit: 10 });
        // setTrendingPlants(trendingResponse.trending_plants);
        
        // Fetch plants for reference
        const plantsData = await plantsApi.getAll(0, 100);
        setPlants(plantsData);
        
      } catch (err) {
        // const errorMessage = handleApiError(err);
        setError('ไม่สามารถโหลดข้อมูลได้');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const getPlantName = (plantId: number): string => {
    const plant = plants.find(p => p.id === plantId);
    return plant ? plant.common_name_th : `พืช ID: ${plantId}`;
  };

  const getPlantCategory = (plantId: number): string => {
    const plant = plants.find(p => p.id === plantId);
    return plant ? (plant.category || 'unknown') : 'unknown';
  };

  const getTrendDirection = (trend: string): 'up' | 'down' | 'stable' => {
    if (trend.includes('up') || trend.includes('rise')) return 'up';
    if (trend.includes('down') || trend.includes('fall')) return 'down';
    return 'stable';
  };

  const getSentimentIcon = (trendDirection: string | null | undefined) => {
    if (!trendDirection) return <BarChart3 className="h-4 w-4 text-blue-600" />;
    
    switch (trendDirection.toLowerCase()) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'stable': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      default: return <BarChart3 className="h-4 w-4 text-blue-600" />;
    }
  };

  const getSentimentColor = (trendDirection: string | null | undefined): string => {
    if (!trendDirection) return 'text-blue-600';
    
    switch (trendDirection.toLowerCase()) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      case 'stable': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentLabel = (trendDirection: string | null | undefined): string => {
    if (!trendDirection) return 'ไม่ระบุ';
    
    switch (trendDirection.toLowerCase()) {
      case 'up': return 'ขึ้น';
      case 'down': return 'ลง';
      case 'stable': return 'คงที่';
      default: return trendDirection;
    }
  };

  // Calculate insights from real data
  const totalTrends = marketTrends.length;
  const upTrends = marketTrends.filter(t => t.trend_direction === 'up').length;
  const downTrends = marketTrends.filter(t => t.trend_direction === 'down').length;
  const stableTrends = marketTrends.filter(t => t.trend_direction === 'stable').length;
  
  const upPercentage = totalTrends > 0 ? Math.round((upTrends / totalTrends) * 100) : 0;
  const confidenceScore = totalTrends > 0 ? Math.round((upTrends + stableTrends) / totalTrends * 100) : 0;

  // Get latest price index
  const latestPriceIndex = priceIndices.length > 0 ? priceIndices[0] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">กำลังโหลดข้อมูลเทรนด์...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">เทรนด์ตลาดพืช</h1>
              <p className="text-gray-600 mt-2">
                ข้อมูลเทรนด์และวิเคราะห์ตลาดพืชในประเทศไทย
              </p>
            </div>
            <div className="flex space-x-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">1 สัปดาห์</SelectItem>
                  <SelectItem value="4weeks">4 สัปดาห์</SelectItem>
                  <SelectItem value="3months">3 เดือน</SelectItem>
                  <SelectItem value="6months">6 เดือน</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                ส่งออกรายงาน
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                ความรู้สึกตลาด
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{upPercentage}%</div>
              <div className="text-sm text-gray-600 mt-1">
                เทรนด์บวกจากทั้งหมด {totalTrends} รายการ
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                ความเชื่อมั่น
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{confidenceScore}%</div>
              <div className="text-sm text-gray-600 mt-1">
                ระดับความเชื่อมั่นในข้อมูล
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                ดัชนีราคารวม
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {latestPriceIndex ? latestPriceIndex.overall_index.toFixed(2) : 'N/A'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                อัปเดตล่าสุด: {latestPriceIndex ? new Date(latestPriceIndex.index_date).toLocaleDateString('th-TH') : 'N/A'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              เทรนด์ตลาดล่าสุด
            </CardTitle>
            <CardDescription>
              ข้อมูลเทรนด์ตลาด 4 สัปดาห์ล่าสุด
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketTrends.slice(0, 10).map((trend) => (
                <div key={trend.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{getPlantName(trend.plant_id)}</div>
                    <div className="text-sm text-gray-600">
                      สัปดาห์: {new Date(trend.week_start).toLocaleDateString('th-TH')} | 
                      ความต้องการ: {trend.demand_score}/10
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {getSentimentIcon(trend.trend_direction)}
                      <Badge variant="outline" className={getSentimentColor(trend.trend_direction)}>
                        {getSentimentLabel(trend.trend_direction)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                       {trend.trend_direction === 'up' ? 'ราคาขึ้น' : 
                        trend.trend_direction === 'down' ? 'ราคาลง' : 'ราคาคงที่'}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trending Plants */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              พืชยอดนิยม
            </CardTitle>
            <CardDescription>
              อันดับพืชยอดนิยมตามความนิยมและอัตราการเติบโต
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingPlants.slice(0, 12).map((trending) => (
                <div key={trending.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">
                      #{trending.rank} {getPlantName(trending.plant_id)}
                    </div>
                    <Badge variant="default" className="text-xs">
                      {trending.popularity_score}/10
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    อัตราการเติบโต: {trending.growth_rate > 0 ? '+' : ''}{trending.growth_rate}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    สัปดาห์: {new Date(trending.week_start).toLocaleDateString('th-TH')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Index Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              ดัชนีราคาพืช
            </CardTitle>
            <CardDescription>
              การเปลี่ยนแปลงดัชนีราคาตามหมวดหมู่พืช
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {latestPriceIndex ? [
                { name: 'รวม', value: latestPriceIndex.overall_index || 0, color: 'text-blue-600' },
                { name: 'Philodendron', value: latestPriceIndex.philodendron_index || 0, color: 'text-green-600' },
                { name: 'Monstera', value: latestPriceIndex.monstera_index || 0, color: 'text-purple-600' },
                { name: 'Alocasia', value: latestPriceIndex.alocasia_index || 0, color: 'text-orange-600' },
              ].map((category, index) => (
                <div key={index} className="p-4 border rounded-lg text-center">
                  <div className={`text-2xl font-bold ${category.color}`}>
                    {typeof category.value === 'number' ? category.value.toFixed(2) : '0.00'}
                  </div>
                  <div className="text-sm text-gray-600">{category.name}</div>
                </div>
              )) : (
                // Fallback when no price index data
                <>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-400">0.00</div>
                    <div className="text-sm text-gray-600">รวม</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-400">0.00</div>
                    <div className="text-sm text-gray-600">Philodendron</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-400">0.00</div>
                    <div className="text-sm text-gray-600">Monstera</div>
                  </div>
                  <div className="p-4 border rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-400">0.00</div>
                    <div className="text-sm text-gray-600">Alocasia</div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                หมวดหมู่ยอดนิยม
              </CardTitle>
              <CardDescription>
                หมวดหมู่พืชที่มีความนิยมสูงสุด
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['philodendron', 'monstera', 'alocasia', 'anthurium', 'calathea'].map((category, index) => {
                  const categoryPlants = plants.filter(p => p.category === category);
                  const trendingCount = categoryPlants.filter(p => p.is_trending).length;
                  
                  return (
                    <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium capitalize">{category}</div>
                        <div className="text-sm text-gray-600">
                          พืชทั้งหมด: {categoryPlants.length} | ยอดนิยม: {trendingCount}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {Math.round((trendingCount / Math.max(categoryPlants.length, 1)) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Market Sentiment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                ความรู้สึกตลาด
              </CardTitle>
              <CardDescription>
                สรุปความรู้สึกตลาดโดยรวม
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { sentiment: 'up', count: upTrends, color: 'text-green-600', bg: 'bg-green-50' },
                  { sentiment: 'stable', count: stableTrends, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { sentiment: 'down', count: downTrends, color: 'text-red-600', bg: 'bg-red-50' },
                ].map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${item.bg}`}>
                    <div className="flex-1">
                      <div className="font-medium capitalize">{item.sentiment === 'up' ? 'ขึ้น' : item.sentiment === 'down' ? 'ลง' : 'คงที่'}</div>
                      <div className="text-sm text-gray-600">
                        {item.count} รายการ
                      </div>
                    </div>
                    <div className={`text-lg font-bold ${item.color}`}>
                      {totalTrends > 0 ? Math.round((item.count / totalTrends) * 100) : 0}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 