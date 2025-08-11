"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/language-context";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  Target,
  Lightbulb,
  ArrowUpRight,
  Clock
} from "lucide-react";

export default function TrendsPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('trends.header.title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('trends.header.subtitle')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Select defaultValue="3months">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">{t('trends.timeframe.1month')}</SelectItem>
                  <SelectItem value="3months">{t('trends.timeframe.3months')}</SelectItem>
                  <SelectItem value="6months">{t('trends.timeframe.6months')}</SelectItem>
                  <SelectItem value="1year">{t('trends.timeframe.1year')}</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                {t('trends.actions.exportReport')}
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
                {t('trends.insights.sentiment.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{t('trends.insights.sentiment.value')}</div>
              <div className="text-sm text-gray-600 mt-1">
                {t('trends.insights.sentiment.description')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('trends.insights.confidence.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{t('trends.insights.confidence.value')}</div>
              <div className="text-sm text-gray-600 mt-1">
                {t('trends.insights.confidence.description')}
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('trends.insights.nextUpdate.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{t('trends.insights.nextUpdate.value')}</div>
              <div className="text-sm text-gray-600 mt-1">
                {t('trends.insights.nextUpdate.description')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Rising Stars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                {t('trends.categories.risingStars.title')}
              </CardTitle>
              <CardDescription>
                {t('trends.categories.risingStars.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Monstera Thai Constellation", growth: "+45%", confidence: t('trends.confidence.high'), reason: t('trends.reasons.rareVariety') },
                  { name: "Philodendron Pink Princess", growth: "+38%", confidence: t('trends.confidence.high'), reason: t('trends.reasons.socialMedia') },
                  { name: "Anthurium Crystallinum", growth: "+32%", confidence: t('trends.confidence.medium'), reason: t('trends.reasons.collectorInterest') },
                  { name: "Alocasia Dragon Scale", growth: "+28%", confidence: t('trends.confidence.medium'), reason: t('trends.reasons.uniqueFoliage') },
                  { name: "Calathea White Fusion", growth: "+25%", confidence: t('trends.confidence.high'), reason: t('trends.reasons.aestheticAppeal') },
                ].map((plant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{plant.name}</div>
                      <div className="text-sm text-gray-600">{plant.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{plant.growth}</div>
                      <Badge variant="outline" className="text-xs">
                        {plant.confidence}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Declining Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-red-600" />
                {t('trends.categories.declining.title')}
              </CardTitle>
              <CardDescription>
                {t('trends.categories.declining.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Spider Plant", decline: "-18%", confidence: t('trends.confidence.medium'), reason: t('trends.reasons.marketSaturation') },
                  { name: "Pothos Golden", decline: "-15%", confidence: t('trends.confidence.high'), reason: t('trends.reasons.oversupply') },
                  { name: "Snake Plant", decline: "-12%", confidence: t('trends.confidence.medium'), reason: t('trends.reasons.priceCompetition') },
                  { name: "Peace Lily", decline: "-8%", confidence: t('trends.confidence.low'), reason: t('trends.reasons.seasonalDip') },
                  { name: "ZZ Plant", decline: "-5%", confidence: t('trends.confidence.low'), reason: t('trends.reasons.marketCorrection') },
                ].map((plant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{plant.name}</div>
                      <div className="text-sm text-gray-600">{plant.reason}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">{plant.decline}</div>
                      <Badge variant="outline" className="text-xs">
                        {plant.confidence}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seasonal Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {t('trends.seasonal.title')}
            </CardTitle>
            <CardDescription>
              {t('trends.seasonal.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  month: t('trends.seasonal.january.month'),
                  trend: t('trends.seasonal.january.trend'),
                  reason: t('trends.seasonal.january.reason'),
                  confidence: "92%",
                  recommendations: ["Monstera", "Fiddle Leaf Fig", "ZZ Plant"]
                },
                {
                  month: t('trends.seasonal.february.month'),
                  trend: t('trends.seasonal.february.trend'),
                  reason: t('trends.seasonal.february.reason'),
                  confidence: "88%",
                  recommendations: ["Anthurium", "Orchids", "Rose plants"]
                },
                {
                  month: t('trends.seasonal.march.month'),
                  trend: t('trends.seasonal.march.trend'),
                  reason: t('trends.seasonal.march.reason'),
                  confidence: "85%",
                  recommendations: ["Succulents", "Herbs", "Flowering plants"]
                }
              ].map((forecast, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{forecast.month}</h3>
                    <Badge variant="secondary">{forecast.confidence}</Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <div className="font-medium mb-1">{forecast.trend}</div>
                    <div>{forecast.reason}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">{t('trends.seasonal.recommended')}:</div>
                    <div className="flex flex-wrap gap-1">
                      {forecast.recommendations.map((plant, plantIndex) => (
                        <Badge key={plantIndex} variant="outline" className="text-xs">
                          {plant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Market Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-600" />
                {t('trends.insights.opportunities.title')}
              </CardTitle>
              <CardDescription>
                {t('trends.insights.opportunities.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    opportunity: t('trends.opportunities.rareMarket.name'),
                    potential: t('trends.potential.high'),
                    description: t('trends.opportunities.rareMarket.description'),
                    action: t('trends.opportunities.rareMarket.action')
                  },
                  {
                    opportunity: t('trends.opportunities.b2b.name'),
                    potential: t('trends.potential.medium'),
                    description: t('trends.opportunities.b2b.description'),
                    action: t('trends.opportunities.b2b.action')
                  },
                  {
                    opportunity: t('trends.opportunities.export.name'),
                    potential: t('trends.potential.high'),
                    description: t('trends.opportunities.export.description'),
                    action: t('trends.opportunities.export.action')
                  },
                  {
                    opportunity: t('trends.opportunities.careServices.name'),
                    potential: t('trends.potential.medium'),
                    description: t('trends.opportunities.careServices.description'),
                    action: t('trends.opportunities.careServices.action')
                  }
                ].map((opp, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium">{opp.opportunity}</div>
                      <Badge variant={opp.potential === t('trends.potential.high') ? "default" : "secondary"}>
                        {opp.potential}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{opp.description}</div>
                    <div className="text-sm font-medium text-blue-600">{opp.action}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                {t('trends.insights.risks.title')}
              </CardTitle>
              <CardDescription>
                {t('trends.insights.risks.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    risk: t('trends.risks.climateChange.name'),
                    severity: t('trends.severity.high'),
                    description: t('trends.risks.climateChange.description'),
                    mitigation: t('trends.risks.climateChange.mitigation')
                  },
                  {
                    risk: t('trends.risks.supplyChain.name'),
                    severity: t('trends.severity.medium'),
                    description: t('trends.risks.supplyChain.description'),
                    mitigation: t('trends.risks.supplyChain.mitigation')
                  },
                  {
                    risk: t('trends.risks.regulatory.name'),
                    severity: t('trends.severity.low'),
                    description: t('trends.risks.regulatory.description'),
                    mitigation: t('trends.risks.regulatory.mitigation')
                  },
                  {
                    risk: t('trends.risks.marketSaturation.name'),
                    severity: t('trends.severity.medium'),
                    description: t('trends.risks.marketSaturation.description'),
                    mitigation: t('trends.risks.marketSaturation.mitigation')
                  }
                ].map((risk, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-medium">{risk.risk}</div>
                      <Badge variant={risk.severity === t('trends.severity.high') ? "destructive" : risk.severity === t('trends.severity.medium') ? "secondary" : "outline"}>
                        {risk.severity}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{risk.description}</div>
                    <div className="text-sm font-medium text-green-600">{risk.mitigation}</div>
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