"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TopMover {
  id: number;
  plant_name: string;
  price_change_pct: number;
  current_price: number;
  volume_change_pct: number;
  market_cap: number;
  trend_direction: string;
}

export function TopMovers() {
  const [topMovers, setTopMovers] = useState<TopMover[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopMovers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/market-intelligence/top-movers');
        
        if (!response.ok) {
          throw new Error('Failed to fetch top movers');
        }
        
        const data = await response.json();
        setTopMovers(data.top_movers || []);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูล Top Movers ได้');
        console.error('Error fetching top movers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovers();
    
    // Refresh every 15 minutes
    const interval = setInterval(fetchTopMovers, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeBadgeColor = (change: number) => {
    if (change > 0) return 'bg-green-100 text-green-800 border-green-200';
    if (change < 0) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Top Price Movers This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Top Price Movers This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 text-6xl mb-4">❌</div>
            <p className="text-gray-600">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (topMovers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
            Top Price Movers This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-600">ไม่มีข้อมูลการเปลี่ยนแปลงราคาในขณะนี้</p>
            <p className="text-sm text-gray-500 mt-2">ตรวจสอบอีกครั้งในภายหลัง</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
          Top Price Movers This Week
        </CardTitle>
        <p className="text-sm text-gray-600">
          ต้นไม้ที่มีการเปลี่ยนแปลงราคาสูงสุด
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topMovers.slice(0, 5).map((mover) => (
            <div key={mover.id} className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex-1">
                <div className="font-medium text-gray-900 mb-1">
                  {mover.plant_name}
                </div>
                <div className="text-sm text-gray-600">
                  ราคาปัจจุบัน: ฿{mover.current_price.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Market Cap: ฿{(mover.market_cap / 1000000).toFixed(1)}M
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center justify-end mb-1">
                  {getChangeIcon(mover.price_change_pct)}
                  <Badge 
                    variant="outline" 
                    className={`ml-2 ${getChangeBadgeColor(mover.price_change_pct)}`}
                  >
                    {mover.price_change_pct > 0 ? '+' : ''}{mover.price_change_pct.toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-500">
                  Volume: {mover.volume_change_pct > 0 ? '+' : ''}{mover.volume_change_pct.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {topMovers.length > 5 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              และอีก {topMovers.length - 5} รายการ...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 