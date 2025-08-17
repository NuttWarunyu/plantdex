// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface Plant {
  id: number;
  common_name_th: string;
  common_name_en: string;
  scientific_name: string;
  category: string;
  price_min: number;
  price_max: number;
  is_trending: boolean;
  image_url?: string;
}

export interface ShopeeProduct {
  id: number;
  item_id: number;
  name: string;
  price: number;
  original_price?: number;
  category?: string;
  shop_name?: string;
  rating?: number;
  sold_count?: number;
  view_count?: number;
  like_count?: number;
  description?: string;
  primary_image_url?: string;
  additional_images?: string[];
  created_at: string;
  updated_at: string;
  affiliate_link?: string;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'rating' | 'sold' | 'newest';
}

export interface SearchResponse {
  products: ShopeeProduct[];
  total: number;
  page: number;
  limit: number;
}

export interface MarketData {
  price_indices: unknown[];
  market_trends: unknown[];
}

export interface QuickStats {
  total_plants: number;
  trending_plants: number;
  rare_plants: number;
  indoor_plants: number;
  market_status: string;
  last_updated: string;
}

export interface MarketIntelligenceData {
  price_indices: unknown[];
  market_trends: unknown[];
}

// API error handler
export const handleApiError = (error: Error): string => {
  console.error('API Error:', error);
  return error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์';
};

// Mock data fallback
const mockData = {
  plants: [
    {
      id: 1,
      common_name_th: 'มอนสเตอร่า',
      common_name_en: 'Monstera',
      scientific_name: 'Monstera deliciosa',
      category: 'ไม้ในร่ม',
      price_min: 500,
      price_max: 2000,
      is_trending: true,
      image_url: '/images/monstera.jpg'
    }
  ]
};

// Plants API
export const plantsApi = {
  // Get all plants with pagination
  async getAll(skip: number = 0, limit: number = 100): Promise<Plant[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/plants/?skip=${skip}&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch plants');
      const data = await response.json();
      return data.plants || [];
    } catch (error) {
      console.warn('Using mock data for plants');
      return mockData.plants;
    }
  },

  // Advanced search
  async searchAdvanced(filters: SearchFilters): Promise<Plant[]> {
    try {
      const params = new URLSearchParams();
      if (filters.query) params.append('q', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.min_price) params.append('min_price', filters.min_price.toString());
      if (filters.max_price) params.append('max_price', filters.max_price.toString());
      
      const response = await fetch(`${API_BASE_URL}/api/v1/plants/search/advanced?${params}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.plants || [];
    } catch (error) {
      console.warn('Using mock data for search');
      return mockData.plants.filter(plant => 
        !filters.query || plant.common_name_th.toLowerCase().includes(filters.query.toLowerCase())
      );
    }
  },

  // Get market data
  async getMarketData(): Promise<MarketData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/plants/market-data`);
      if (!response.ok) throw new Error('Failed to fetch market data');
      return await response.json();
    } catch (error) {
      return { price_indices: [], market_trends: [] };
    }
  },

  // Get quick stats
  async getQuickStats(): Promise<QuickStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/plants/quick-stats`);
      if (!response.ok) throw new Error('Failed to fetch quick stats');
      return await response.json();
    } catch (error) {
      return {
        total_plants: 0,
        trending_plants: 0,
        rare_plants: 0,
        indoor_plants: 0,
        market_status: 'unknown',
        last_updated: new Date().toISOString()
      };
    }
  },

  // Get search suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/plants/search/suggestions?q=${query}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      return ['มอนสเตอร่า', 'ฟิโลเดนดรอน', 'แคคตัส'];
    }
  },

  // Get trending plants
  async getTrending(): Promise<Plant[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/plants/trending`);
      if (!response.ok) throw new Error('Failed to fetch trending plants');
      const data = await response.json();
      return data.plants || [];
    } catch (error) {
      return mockData.plants.filter(plant => plant.is_trending);
    }
  }
};

// Shopee API
export const shopeeApi = {
  // Get Shopee products
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    min_price?: number;
    max_price?: number;
    search?: string;
  } = {}): Promise<SearchResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.category) searchParams.append('category', params.category);
      if (params.min_price) searchParams.append('min_price', params.min_price.toString());
      if (params.max_price) searchParams.append('max_price', params.max_price.toString());
      if (params.search) searchParams.append('search', params.search);

      const response = await fetch(`${API_BASE_URL}/api/v1/shopee/products?${searchParams}`);
      if (!response.ok) throw new Error('Failed to fetch Shopee products');
      return await response.json();
    } catch (error) {
      console.error('Shopee API Error:', error);
      return {
        products: [],
        total: 0,
        page: 1,
        limit: 20
      };
    }
  },

  // Get product categories
  async getCategories(): Promise<{category: string; count: number}[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shopee/products/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Categories API Error:', error);
      return [];
    }
  },

  // Get product statistics
  async getStats(): Promise<{
    total_products: number;
    category_count: number;
    shop_count: number;
    price_stats: { min: number; max: number; average: number; count: number };
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shopee/products/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error('Stats API Error:', error);
      return {
        total_products: 0,
        category_count: 0,
        shop_count: 0,
        price_stats: { min: 0, max: 0, average: 0, count: 0 }
      };
    }
  },

  // Get specific product
  async getProduct(itemId: number): Promise<ShopeeProduct | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/shopee/products/${itemId}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('Product API Error:', error);
      return null;
    }
  }
};

// Market API (placeholder for future implementation)
export const marketApi = {
  getTrends: async () => ({ trends: [] }),
  getPriceIndex: async () => ({ price_indices: [] }),
  getTrendingPlants: async () => ({ trending_plants: [] }),
  getMarketIntelligence: async (): Promise<MarketIntelligenceData> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/market-intelligence/index`);
      if (!response.ok) {
        throw new Error('Failed to fetch market intelligence data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching market intelligence:', error);
      throw error;
    }
  }
}; 