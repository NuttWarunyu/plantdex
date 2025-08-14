'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Activity } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

interface MarketTickerProps {
  className?: string;
}

interface MarketData {
  total_plants: number;
  trending_plants: number;
  rare_plants: number;
  indoor_plants: number;
  market_status: string;
  last_updated: string;
}

const MarketTicker: React.FC<MarketTickerProps> = ({ className = "" }) => {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock market data for development
  const mockMarketData: MarketData = {
    total_plants: 1247,
    trending_plants: 89,
    rare_plants: 156,
    indoor_plants: 678,
    market_status: 'active',
    last_updated: '2025-01-27'
  };

  useEffect(() => {
    // Simulate API call
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with real API call
        // const response = await fetch('/api/v1/plants/quick-stats');
        // const data = await response.json();
        
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMarketData(mockMarketData);
        setError(null);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลตลาดได้');
        console.error('Failed to fetch market data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-r from-blue-900 to-green-900 text-white p-4 rounded-lg ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <Activity className="w-5 h-5 animate-pulse" />
          <span>กำลังโหลดข้อมูลตลาด...</span>
        </div>
      </div>
    );
  }

  if (error || !marketData) {
    return (
      <div className={`bg-gradient-to-r from-red-900 to-orange-900 text-white p-4 rounded-lg ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <Activity className="w-5 h-5" />
          <span>{error || 'ไม่สามารถโหลดข้อมูลได้'}</span>
        </div>
      </div>
    );
  }

  const getMarketStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'slow':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'ตลาดคึกคัก';
      case 'moderate':
        return 'ตลาดปานกลาง';
      case 'slow':
        return 'ตลาดเงียบ';
      default:
        return 'ไม่ทราบสถานะ';
    }
  };

  return (
    <div className={`bg-gradient-to-r from-blue-900 to-green-900 text-white p-6 rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-8 h-8 text-yellow-400" />
          <div>
            <h2 className="text-2xl font-bold">📊 LIVE PLANT MARKET INDEX</h2>
            <p className="text-blue-100 text-sm">
              อัปเดตล่าสุด: {new Date(marketData.last_updated).toLocaleString('th-TH')}
            </p>
          </div>
        </div>
        
        <Badge className={getMarketStatusColor(marketData.market_status)}>
          {getMarketStatusLabel(marketData.market_status)}
        </Badge>
      </div>

      {/* Market Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">
            {marketData.total_plants.toLocaleString()}
          </div>
          <div className="text-blue-100 text-sm">พืชทั้งหมด</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-400">
            {marketData.trending_plants}
          </div>
          <div className="text-blue-100 text-sm">พืชยอดนิยม</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">
            {marketData.rare_plants}
          </div>
          <div className="text-blue-100 text-sm">พืชหายาก</div>
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">
            {marketData.indoor_plants}
          </div>
          <div className="text-blue-100 text-sm">พืชในร่ม</div>
        </div>
      </div>

      {/* Market Movement Indicators */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Monstera Thai</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-bold">+15%</span>
            <span className="text-blue-100 text-sm">จากเมื่อวาน</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Philodendron</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-400 font-bold">-8%</span>
            <span className="text-blue-100 text-sm">จากเมื่อวาน</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-medium">Snake Plant</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400 font-bold">+12%</span>
            <span className="text-blue-100 text-sm">จากเมื่อวาน</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
          <div className="flex items-center space-x-2">
            <Minus className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400 font-medium">Pothos</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-400 font-bold">0%</span>
            <span className="text-blue-100 text-sm">คงที่</span>
          </div>
        </div>
      </div>

      {/* Market Summary */}
      <div className="mt-6 p-4 bg-white/10 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">💰 มูลค่าตลาดรวม</div>
            <div className="text-2xl font-bold text-yellow-400">฿2.4M</div>
            <div className="text-blue-100 text-sm">ติดตามวันนี้</div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-semibold">📈 ปริมาณการซื้อขาย</div>
            <div className="text-2xl font-bold text-green-400">347</div>
            <div className="text-blue-100 text-sm">รายการสัปดาห์นี้</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-medium rounded-lg transition-colors">
          📊 ดูรายงานตลาด
        </button>
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
          🔔 ตั้งการแจ้งเตือน
        </button>
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors">
          💰 เครื่องคำนวณ ROI
        </button>
      </div>
    </div>
  );
};

export default MarketTicker; 