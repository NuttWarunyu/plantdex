// API service for PlantDex
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Plant {
  id: number;
  scientific_name: string;
  common_name_th: string;
  common_name_en?: string;
  category?: string;
  care_level?: string;
  description_th?: string;
  description_en?: string;
  origin_country?: string;
  water_needs?: string;
  light_needs?: string;
  humidity_needs?: string;
  temperature_min?: number;
  temperature_max?: number;
  growth_rate?: string;
  max_height?: number;
  max_width?: number;
  is_poisonous?: boolean;
  is_rare?: boolean;
  is_trending?: boolean;
  investment_score?: number;
}

export interface SearchFilters {
  query: string;
  category: string;
  care_level: string;
  price_min?: number;
  price_max?: number;
}

export interface SearchResponse {
  plants: Plant[];
  pagination: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
  };
  filters: {
    query: string;
    category: string | null;
    care_level: string | null;
  };
}

export interface MarketData {
  market_summary: {
    total_plants: number;
    indoor_plants: number;
    outdoor_plants: number;
    market_health: string;
  };
  category_distribution: Record<string, number>;
  care_level_distribution: Record<string, number>;
  trending_plants: Plant[];
  rare_plants: Plant[];
}

export interface QuickStats {
  total_plants: number;
  trending_plants: number;
  rare_plants: number;
  indoor_plants: number;
  market_status: string;
  last_updated: string;
}

// API functions
export const plantsApi = {
  // Advanced search with filters and pagination
  async searchAdvanced(filters: SearchFilters, page: number = 1, limit: number = 20): Promise<SearchResponse> {
    const params = new URLSearchParams({
      q: filters.query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (filters.category) params.append('category', filters.category);
    if (filters.care_level) params.append('care_level', filters.care_level);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/search/advanced?${params}`);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`);
    }
    
    return response.json();
  },

  // Get market data and trends
  async getMarketData(): Promise<MarketData> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/market-data`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch market data: ${response.status}`);
    }
    
    return response.json();
  },

  // Get quick stats for homepage
  async getQuickStats(): Promise<QuickStats> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/quick-stats`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch quick stats: ${response.status}`);
    }
    
    return response.json();
  },

  // Get search suggestions
  async getSearchSuggestions(query: string, limit: number = 10): Promise<string[]> {
    if (query.length < 2) return [];
    
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    if (!response.ok) {
      return [];
    }
    
         const data = await response.json();
     return data.suggestions.map((s: { common_name_th: string }) => s.common_name_th);
  },

  // Get all plants with basic filtering
  async getAll(skip: number = 0, limit: number = 100, category?: string, care_level?: string, search?: string): Promise<Plant[]> {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString()
    });
    
    if (category) params.append('category', category);
    if (care_level) params.append('care_level', care_level);
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/api/v1/plants?${params}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch plants: ${response.status}`);
    }
    
    return response.json();
  },

  // Get trending plants
  async getTrending(): Promise<Plant[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/trending/list`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending plants: ${response.status}`);
    }
    
    const data = await response.json();
    return data.trending_plants;
  }
};

// Error handling utility
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ';
}

// Mock data fallback (for development/testing)
export const mockData = {
  plants: [
    {
      id: 1,
      scientific_name: 'Monstera deliciosa',
      common_name_th: 'มอนสเตอร่า',
      common_name_en: 'Swiss Cheese Plant',
      category: 'indoor',
      care_level: 'easy',
      description_th: 'ต้นไม้ใบใหญ่ที่มีรูตามธรรมชาติ เป็นที่นิยมในการตกแต่งบ้าน',
      description_en: 'Large-leafed plant with natural holes, popular for home decoration',
      origin_country: 'Mexico',
      water_needs: 'moderate',
      light_needs: 'bright indirect',
      humidity_needs: 'high',
      temperature_min: 18,
      temperature_max: 30,
      growth_rate: 'fast',
      max_height: 300,
      max_width: 200,
      is_poisonous: false,
      is_rare: false,
      is_trending: true,
      investment_score: 85
    }
  ],
  
  marketData: {
    market_summary: {
      total_plants: 1247,
      indoor_plants: 678,
      outdoor_plants: 569,
      market_health: 'healthy'
    },
    category_distribution: {
      'indoor': 678,
      'outdoor': 569
    },
    care_level_distribution: {
      'easy': 456,
      'moderate': 523,
      'difficult': 268
    },
    trending_plants: [],
    rare_plants: []
  },
  
  quickStats: {
    total_plants: 1247,
    trending_plants: 89,
    rare_plants: 156,
    indoor_plants: 678,
    market_status: 'active',
    last_updated: '2025-01-27'
  }
}; 