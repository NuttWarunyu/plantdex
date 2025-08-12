"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "../../lib/language-context";
import { 
  TrendingUp, 
  TrendingDown, 
  MapPin,
  Calendar,
  ArrowUpRight,
  Globe
} from "lucide-react";

export default function MarketPage() {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('market.title')}</h1>
              <p className="text-gray-600 mt-2">
                {t('market.subtitle')}
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                {t('market.lastUpdated')}
              </Button>
              <Button>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                {t('market.exportData')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Plant Price Index */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('market.plantPriceIndex.title')}</h2>
            <Badge variant="secondary">{t('market.plantPriceIndex.updated')}</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t('market.plantPriceIndex.overall')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">1,247.85</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2.3% {t('market.plantPriceIndex.fromLastWeek')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t('market.plantPriceIndex.indoor')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">1,156.42</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +1.8% {t('market.plantPriceIndex.fromLastWeek')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t('market.plantPriceIndex.outdoor')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">1,389.67</div>
                <div className="flex items-center text-sm text-red-600 mt-1">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -0.5% {t('market.plantPriceIndex.fromLastWeek')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {t('market.plantPriceIndex.rare')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">2,156.89</div>
                <div className="flex items-center text-sm text-green-600 mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +4.2% {t('market.plantPriceIndex.fromLastWeek')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Trending Plants */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('market.trending.title')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Monstera Deliciosa", category: t('category.indoor'), price: "฿1,200", change: "+15%", rank: 1 },
              { name: "Fiddle Leaf Fig", category: t('category.indoor'), price: "฿2,500", change: "+12%", rank: 2 },
              { name: "ZZ Plant", category: t('category.indoor'), price: "฿800", change: "+8%", rank: 3 },
              { name: "Snake Plant", category: t('category.indoor'), price: "฿450", change: "+5%", rank: 4 },
              { name: "Pothos", category: t('category.indoor'), price: "฿350", change: "+18%", rank: 5 },
              { name: "Peace Lily", category: t('category.indoor'), price: "฿650", change: "+3%", rank: 6 },
            ].map((plant, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      #{plant.rank}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {plant.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{plant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-green-600">{plant.price}</div>
                    <div className="text-sm text-green-600 font-medium">{plant.change}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Market Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Regional Supply */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                {t('market.overview.regionalSupply.title')}
              </CardTitle>
              <CardDescription>
                {t('market.overview.regionalSupply.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { province: t('location.bangkok'), capacity: t('market.capacity.high'), plants: "2,500+", trend: "+" },
                  { province: t('location.chiangmai'), capacity: t('market.capacity.veryHigh'), plants: "3,200+", trend: "+" },
                  { province: t('location.chonburi'), capacity: t('market.capacity.medium'), plants: "1,800+", trend: "=" },
                  { province: t('location.nakhonratchasima'), capacity: t('market.capacity.high'), plants: "2,100+", trend: "+" },
                  { province: t('location.songkhla'), capacity: t('market.capacity.medium'), plants: "1,500+", trend: "-" },
                ].map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{region.province}</div>
                      <div className="text-sm text-gray-600">{region.plants} {t('market.overview.regionalSupply.plants')}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={region.capacity === t('market.capacity.veryHigh') ? "default" : region.capacity === t('market.capacity.high') ? "secondary" : "outline"}>
                        {region.capacity}
                      </Badge>
                      <span className="text-green-600 font-bold">{region.trend}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Export Readiness */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                {t('market.overview.exportReadiness.title')}
              </CardTitle>
              <CardDescription>
                {t('market.overview.exportReadiness.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { country: t('market.countries.singapore'), demand: t('market.demand.veryHigh'), score: "92", trend: "+" },
                  { country: t('market.countries.malaysia'), demand: t('market.demand.high'), score: "87", trend: "+" },
                  { country: t('market.countries.hongkong'), demand: t('market.demand.high'), score: "84", trend: "=" },
                  { country: t('market.countries.taiwan'), demand: t('market.demand.medium'), score: "76", trend: "+" },
                  { country: t('market.countries.japan'), demand: t('market.demand.medium'), score: "72", trend: "-" },
                ].map((exportData, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{exportData.country}</div>
                      <div className="text-sm text-gray-600">{t('market.overview.exportReadiness.score')}: {exportData.score}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={exportData.demand === t('market.demand.veryHigh') ? "default" : exportData.demand === t('market.demand.high') ? "secondary" : "outline"}>
                        {exportData.demand}
                      </Badge>
                      <span className="text-green-600 font-bold">{exportData.trend}</span>
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