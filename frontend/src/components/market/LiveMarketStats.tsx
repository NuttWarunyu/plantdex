"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketStats {
  plantdx_index: number;
  index_change_pct: string;
  sentiment_score: number;
  market_volume: number;
  active_plants: number;
}

export function LiveMarketStats() {
  const [data, setData] = useState<MarketStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/market-intelligence/index');
        
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }
        
        const marketData = await response.json();
        setData(marketData);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลตลาดได้');
        console.error('Error fetching market data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-red-200 bg-red-50">
            <CardContent className="pt-6 text-center">
              <div className="text-red-600 text-sm">ข้อมูลไม่พร้อม</div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const getChangeIcon = (change: string) => {
    const changeNum = parseFloat(change);
    if (changeNum > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (changeNum < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getSentimentText = (score: number) => {
    if (score > 0.3) return 'Bullish';
    if (score < -0.3) return 'Bearish';
    return 'Neutral';
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'text-green-600';
    if (score < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* PlantDx Index */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            PlantDx Index
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            ฿{data.plantdx_index.toLocaleString()}
          </div>
          <div className="flex items-center mt-1">
            {getChangeIcon(data.index_change_pct)}
            <span className={`text-sm ml-1 ${
              parseFloat(data.index_change_pct) >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {data.index_change_pct}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Market Volume */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Market Volume
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            ฿{(data.market_volume / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-500 mt-1">
            วันนี้
          </div>
        </CardContent>
      </Card>

      {/* Active Plants */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Active Plants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900">
            {data.active_plants.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            ต้นไม้ที่ติดตาม
          </div>
        </CardContent>
      </Card>

      {/* Market Sentiment */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Market Sentiment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getSentimentColor(data.sentiment_score)}`}>
            {getSentimentText(data.sentiment_score)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            Score: {data.sentiment_score.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 