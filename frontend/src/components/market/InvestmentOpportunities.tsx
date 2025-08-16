"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Zap, Calendar } from "lucide-react";

interface InvestmentOpportunity {
  id: number;
  plant_name: string;
  opportunity_type: string;
  confidence_score: number;
  potential_upside_pct: number;
  time_horizon_days: number;
  detected_at: string;
}

export function InvestmentOpportunities() {
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/market-intelligence/opportunities');
        
        if (!response.ok) {
          throw new Error('Failed to fetch opportunities');
        }
        
        const data = await response.json();
        setOpportunities(data.opportunities || []);
      } catch (err) {
        setError('ไม่สามารถโหลดข้อมูลโอกาสการลงทุนได้');
        console.error('Error fetching opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
    
    // Refresh every 10 minutes
    const interval = setInterval(fetchOpportunities, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'UNDERVALUED':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'BREAKOUT':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'SEASONAL':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'UNDERVALUED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'BREAKOUT':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SEASONAL':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-orange-100 text-orange-800 border-orange-200';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-600" />
            Investment Opportunities Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
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
            <Zap className="h-5 w-5 mr-2 text-yellow-600" />
            Investment Opportunities Alert
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

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-600" />
            Investment Opportunities Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-600">ไม่มีโอกาสการลงทุนที่ตรวจพบในขณะนี้</p>
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
          <Zap className="h-5 w-5 mr-2 text-yellow-600" />
          Investment Opportunities Alert
        </CardTitle>
        <p className="text-sm text-gray-600">
          โอกาสการลงทุนที่ตรวจพบโดย AI
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {opportunities.slice(0, 5).map((opp) => (
            <div key={opp.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getOpportunityIcon(opp.opportunity_type)}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getOpportunityColor(opp.opportunity_type)}`}
                  >
                    {opp.opportunity_type}
                  </Badge>
                </div>
                <span className={`text-sm font-medium ${getConfidenceColor(opp.confidence_score)}`}>
                  Confidence: {opp.confidence_score}%
                </span>
              </div>
              
              <div className="font-medium text-gray-900 mb-2">
                {opp.plant_name}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Potential upside:</span>
                  <span className="ml-2 font-medium text-green-600">
                    +{opp.potential_upside_pct}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Time horizon:</span>
                  <span className="ml-2 font-medium text-blue-600">
                    {opp.time_horizon_days} days
                  </span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Detected: {new Date(opp.detected_at).toLocaleDateString('th-TH')}
              </div>
            </div>
          ))}
        </div>
        
        {opportunities.length > 5 && (
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              และอีก {opportunities.length - 5} โอกาส...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 