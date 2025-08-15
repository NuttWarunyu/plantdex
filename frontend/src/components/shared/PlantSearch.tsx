'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { plantsApi, mockData } from '../../lib/api';

interface PlantSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
}

export interface SearchFilters {
  query: string;
  category: string;
  care_level: string;
  price_min?: number;
  price_max?: number;
}

const PlantSearch: React.FC<PlantSearchProps> = ({
  onSearch,
  onClear,
  placeholder = "ค้นหาต้นไม้...",
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    care_level: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch search suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setIsLoading(true);
      const apiSuggestions = await plantsApi.getSearchSuggestions(searchQuery, 8);
      setSuggestions(apiSuggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      // Fallback to mock suggestions
      const mockSuggestions = mockData.plants
        .filter(plant => 
          plant.common_name_th.toLowerCase().includes(searchQuery.toLowerCase()) ||
          plant.scientific_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(plant => plant.common_name_th)
        .slice(0, 8);
      setSuggestions(mockSuggestions);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search suggestions
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, fetchSuggestions]);

  const handleSearch = () => {
    const searchFilters = { ...filters, query };
    onSearch(query, searchFilters);
  };

  const handleClear = () => {
    setQuery('');
    setFilters({
      query: '',
      category: '',
      care_level: ''
    });
    setSuggestions([]);
    onClear?.();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    const searchFilters = { ...filters, query: suggestion };
    onSearch(suggestion, searchFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="pl-10 pr-20"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-7 px-2"
          >
            <Filter className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={!query.trim()}
            className="h-7 px-3"
          >
            ค้นหา
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">คำแนะนำ:</div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">ตัวกรอง</h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowFilters(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                หมวดหมู่
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="indoor">ไม้ในร่ม</option>
                <option value="outdoor">ไม้นอกบ้าน</option>
                <option value="tropical">ไม้เมืองร้อน</option>
                <option value="succulent">ไม้อวบน้ำ</option>
                <option value="cactus">กระบองเพชร</option>
                <option value="orchid">กล้วยไม้</option>
                <option value="herb">สมุนไพร</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                ระดับการดูแล
              </label>
              <select
                value={filters.care_level}
                onChange={(e) => handleFilterChange('care_level', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">ทั้งหมด</option>
                <option value="easy">ง่าย</option>
                <option value="moderate">ปานกลาง</option>
                <option value="difficult">ยาก</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={handleSearch}
              disabled={!query.trim()}
              className="flex-1"
            >
              ค้นหาด้วยตัวกรอง
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleClear}
            >
              ล้าง
            </Button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.category || filters.care_level) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.category && (
            <Badge variant="secondary" className="text-xs">
              หมวดหมู่: {filters.category}
              <button
                onClick={() => handleFilterChange('category', '')}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.care_level && (
            <Badge variant="secondary" className="text-xs">
              การดูแล: {filters.care_level}
              <button
                onClick={() => handleFilterChange('care_level', '')}
                className="ml-1 hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantSearch; 