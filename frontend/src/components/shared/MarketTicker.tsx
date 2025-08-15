'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3, Activity } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { plantsApi, mockData, handleApiError } from '../../lib/api';

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

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setIsLoading(true);
        const data = await plantsApi.getQuickStats();
        setMarketData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch market data:', err);
        // Fallback to mock data
        setMarketData(mockData.quickStats);
        setError('ไม่สามารถโหลดข้อมูลตลาดได้ - แสดงข้อมูลจำลอง');
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
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <span className="ml-2 text-gray-600">กำลังโหลดข้อมูลตลาด...</span>
        </div>
      </div>
    );
  }

  if (!marketData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
        <div className="text-center text-gray-500">
          ไม่สามารถโหลดข้อมูลตลาดได้
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          Live Plant Market Index
        </h2>
        <Badge variant="outline" className="text-green-600 border-green-200">
          <Activity className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{marketData.total_plants.toLocaleString()}</div>
          <div className="text-sm text-gray-600">ต้นไม้ทั้งหมด</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{marketData.trending_plants.toLocaleString()}</div>
          <div className="text-sm text-gray-600">กำลังเป็นที่นิยม</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{marketData.rare_plants.toLocaleString()}</div>
          <div className="text-sm text-gray-600">หายาก</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{marketData.indoor_plants.toLocaleString()}</div>
          <div className="text-sm text-gray-600">ปลูกในบ้าน</div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Market Status:</span>
          <Badge 
            variant={marketData.market_status === 'active' ? 'default' : 'secondary'}
            className={marketData.market_status === 'active' ? 'bg-green-100 text-green-800' : ''}
          >
            {marketData.market_status === 'active' ? 'Active' : marketData.market_status}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-600">Last Updated:</span>
          <span className="text-gray-800">{marketData.last_updated}</span>
        </div>
      </div>

      {/* Market Movement Indicators */}
      <div className="mt-4 pt-4 border-t">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Market Movements</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Monstera Thai</span>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+15%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Philodendron Pink Princess</span>
            <div className="flex items-center text-green-600">
              <TrendingUp className="w-3 h-3 mr-1" />
              <span>+8%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Anthurium Crystallinum</span>
            <div className="flex items-center text-red-600">
              <TrendingDown className="w-3 h-3 mr-1" />
              <span>-3%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketTicker; 