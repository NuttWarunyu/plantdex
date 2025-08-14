'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';

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

  // Mock suggestions (replace with real API call)
  const mockSuggestions = [
    'Monstera Deliciosa',
    'Philodendron',
    'Snake Plant',
    'Pothos',
    'ZZ Plant',
    'Fiddle Leaf Fig',
    'Peace Lily',
    'Aloe Vera'
  ];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.toLowerCase().includes(query.toLowerCase())
        );
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = useCallback(() => {
    const searchFilters = { ...filters, query };
    onSearch(query, searchFilters);
  }, [query, filters, onSearch]);

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

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    handleSearch();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pl-10 pr-12 h-12 text-lg"
        />
        <Button
          onClick={handleSearch}
          disabled={isLoading}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4"
        >
          {isLoading ? 'ค้นหา...' : 'ค้นหา'}
        </Button>
        
        {/* Clear button */}
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-20 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-medium text-gray-900">{suggestion}</div>
              <div className="text-sm text-gray-500">ต้นไม้ในตระกูล</div>
            </button>
          ))}
        </div>
      )}

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          ตัวกรอง
          {Object.values(filters).some(f => f !== '' && f !== 0) && (
            <Badge variant="secondary" className="ml-2">
              {Object.values(filters).filter(f => f !== '' && f !== 0).length}
            </Badge>
          )}
        </Button>

        {Object.values(filters).some(f => f !== '' && f !== 0) && (
          <Button
            variant="ghost"
            onClick={handleClear}
            className="text-gray-500 hover:text-gray-700"
          >
            ล้างตัวกรอง
          </Button>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หมวดหมู่
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">ทุกหมวดหมู่</option>
                <option value="indoor">ต้นไม้ในร่ม</option>
                <option value="outdoor">ต้นไม้นอกบ้าน</option>
                <option value="tropical">ต้นไม้เขตร้อน</option>
                <option value="succulent">แคคตัส/ไม้อวบน้ำ</option>
                <option value="orchid">กล้วยไม้</option>
                <option value="herb">สมุนไพร</option>
                <option value="tree">ต้นไม้ใหญ่</option>
                <option value="shrub">ไม้พุ่ม</option>
                <option value="vine">ไม้เลื้อย</option>
                <option value="garden">ไม้ประดับสวน</option>
                <option value="water">ไม้น้ำ</option>
                <option value="rock">ไม้หิน</option>
                <option value="border">ไม้ขอบ</option>
                <option value="other">อื่นๆ</option>
              </select>
            </div>

            {/* Care Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ระดับการดูแล
              </label>
              <select
                value={filters.care_level}
                onChange={(e) => handleFilterChange('care_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">ทุกระดับ</option>
                <option value="easy">ง่าย</option>
                <option value="moderate">ปานกลาง</option>
                <option value="difficult">ยาก</option>
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {Object.entries(filters).some(([key, value]) => value !== '' && value !== 0) && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (value === '' || value === 0) return null;
                
                const filterLabels: Record<string, string> = {
                  category: 'หมวดหมู่',
                  care_level: 'ระดับการดูแล',
                  price_min: 'ราคาต่ำสุด',
                  price_max: 'ราคาสูงสุด'
                };

                const valueLabels: Record<string, Record<string, string>> = {
                  category: {
                    indoor: 'ต้นไม้ในร่ม',
                    outdoor: 'ต้นไม้นอกบ้าน',
                    tropical: 'ต้นไม้เขตร้อน',
                    succulent: 'แคคตัส/ไม้อวบน้ำ',
                    orchid: 'กล้วยไม้',
                    herb: 'สมุนไพร',
                    tree: 'ต้นไม้ใหญ่',
                    shrub: 'ไม้พุ่ม',
                    vine: 'ไม้เลื้อย',
                    garden: 'ไม้ประดับสวน',
                    water: 'ไม้น้ำ',
                    rock: 'ไม้หิน',
                    border: 'ไม้ขอบ',
                    other: 'อื่นๆ'
                  },
                  care_level: {
                    easy: 'ง่าย',
                    moderate: 'ปานกลาง',
                    difficult: 'ยาก'
                  }
                };

                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {filterLabels[key]}: {valueLabels[key]?.[value] || value}
                    <button
                      onClick={() => handleFilterChange(key as keyof SearchFilters, '')}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantSearch; 