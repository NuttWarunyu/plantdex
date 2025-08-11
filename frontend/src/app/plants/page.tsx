"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/lib/language-context";
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign,
  Star,
  BarChart3
} from "lucide-react";

export default function PlantsPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");

  const plants = [
    {
      id: 1,
      name: "Monstera Deliciosa",
      scientificName: "Monstera deliciosa",
      category: "Indoor",
      price: 1200,
      location: "Bangkok",
      rating: 4.8,
      reviews: 127,
      image: "/api/placeholder/300/200",
      seller: "Green Paradise Nursery",
      verified: true,
      inStock: true
    },
    {
      id: 2,
      name: "Fiddle Leaf Fig",
      scientificName: "Ficus lyrata",
      category: "Indoor",
      price: 2500,
      location: "Chiang Mai",
      rating: 4.6,
      reviews: 89,
      image: "/api/placeholder/300/200",
      seller: "Tropical Plants Co.",
      verified: true,
      inStock: true
    },
    {
      id: 3,
      name: "ZZ Plant",
      scientificName: "Zamioculcas zamiifolia",
      category: "Indoor",
      price: 800,
      location: "Bangkok",
      rating: 4.9,
      reviews: 203,
      image: "/api/placeholder/300/200",
      seller: "Urban Jungle",
      verified: true,
      inStock: false
    },
    {
      id: 4,
      name: "Snake Plant",
      scientificName: "Sansevieria trifasciata",
      category: "Indoor",
      price: 450,
      location: "Chonburi",
      rating: 4.7,
      reviews: 156,
      image: "/api/placeholder/300/200",
      seller: "Green Thumb Nursery",
      verified: false,
      inStock: true
    },
    {
      id: 5,
      name: "Pothos",
      scientificName: "Epipremnum aureum",
      category: "Indoor",
      price: 350,
      location: "Bangkok",
      rating: 4.5,
      reviews: 98,
      image: "/api/placeholder/300/200",
      seller: "Plant House",
      verified: true,
      inStock: true
    },
    {
      id: 6,
      name: "Peace Lily",
      scientificName: "Spathiphyllum",
      category: "Indoor",
      price: 650,
      location: "Nakhon Ratchasima",
      rating: 4.4,
      reviews: 73,
      image: "/api/placeholder/300/200",
      seller: "Garden Center",
      verified: true,
      inStock: true
    }
  ];

  const filteredPlants = plants.filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || plant.category === selectedCategory;
    const matchesPrice = selectedPriceRange === "all" || 
      (selectedPriceRange === "0-500" && plant.price <= 500) ||
      (selectedPriceRange === "501-1000" && plant.price > 500 && plant.price <= 1000) ||
      (selectedPriceRange === "1001-2000" && plant.price > 1000 && plant.price <= 2000) ||
      (selectedPriceRange === "2000+" && plant.price > 2000);
    const matchesLocation = selectedLocation === "all" || plant.location === selectedLocation;

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('plants.title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('plants.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              {t('plants.filters.title')}
            </CardTitle>
            <CardDescription>
              {t('plants.filters.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="lg:col-span-2">
                <Input
                  placeholder={t('plants.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t('plants.filters.category')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('plants.filters.all')}</SelectItem>
                  <SelectItem value="Indoor">{t('category.indoor')}</SelectItem>
                  <SelectItem value="Outdoor">{t('category.outdoor')}</SelectItem>
                  <SelectItem value="Succulent">{t('category.succulent')}</SelectItem>
                  <SelectItem value="Rare">{t('category.rare')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder={t('plants.filters.price')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('price.all')}</SelectItem>
                  <SelectItem value="0-500">{t('price.0-500')}</SelectItem>
                  <SelectItem value="501-1000">{t('price.501-1000')}</SelectItem>
                  <SelectItem value="1001-2000">{t('price.1001-2000')}</SelectItem>
                  <SelectItem value="2000+">{t('price.2000+')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder={t('plants.filters.location')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('location.all')}</SelectItem>
                  <SelectItem value="Bangkok">{t('location.bangkok')}</SelectItem>
                  <SelectItem value="Chiang Mai">{t('location.chiangmai')}</SelectItem>
                  <SelectItem value="Chonburi">{t('location.chonburi')}</SelectItem>
                  <SelectItem value="Nakhon Ratchasima">{t('location.nakhonratchasima')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-gray-600">
            {t('plants.results.showing', { count: filteredPlants.length, total: plants.length })}
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              {t('plants.actions.sortBy')}
            </Button>
          </div>
        </div>

        {/* Plant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlants.map((plant) => (
            <Card key={plant.id} className="hover:shadow-lg transition-shadow group">
              <div className="relative">
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <div className="text-gray-400 text-sm">Plant Image</div>
                </div>
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex space-x-2">
                  {plant.verified && (
                    <Badge variant="default" className="text-xs">
                      {t('common.verified')}
                    </Badge>
                  )}
                  {!plant.inStock && (
                    <Badge variant="secondary" className="text-xs">
                      {t('common.outOfStock')}
                    </Badge>
                  )}
                </div>

                {/* Market Info Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg leading-tight">{plant.name}</CardTitle>
                    <CardDescription className="text-sm italic">
                      {plant.scientificName}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {plant.category}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{plant.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({plant.reviews} {t('common.reviews')})</span>
                </div>

                {/* Seller and Location */}
                <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{plant.location}</span>
                </div>

                <div className="text-sm text-gray-600 mb-3">
                  {t('common.soldBy')}: <span className="font-medium">{plant.seller}</span>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold text-green-600">
                    ฿{plant.price.toLocaleString()}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      {t('plants.actions.market')}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredPlants.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🌱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">{t('common.noResults')}</h3>
            <p className="text-gray-600 mb-4">
              {t('common.noResults.subtitle')}
            </p>
            <Button onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedPriceRange("all");
              setSelectedLocation("all");
            }}>
              {t('common.clearFilters')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 