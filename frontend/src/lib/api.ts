const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Plant {
  id: number;
  common_name_th: string;
  common_name_en: string;
  scientific_name: string;
  category: string;
  care_level: string;
  description_th: string;
  description_en: string;
  image_url: string;
  is_trending: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlantPrice {
  id: number;
  plant_id: number;
  price: number;
  currency: string;
  source: string;
  seller_location: string;
  shipping_cost: number;
  condition: string;
  created_at: string;
}

export interface MarketTrend {
  id: number;
  plant_id: number;
  week_start: string;
  demand_score: number;
  trend_direction: string;
  search_volume: number;
  avg_price: number;
  supply_score: number;
  seasonal_factor: number;
  sales_volume: number;
  price_change_percent: number;
  export_demand: number;
  created_at: string;
}

export interface TrendingPlant {
  id: number;
  plant_id: number;
  week_start: string;
  rank: number;
  popularity_score: number;
  growth_rate: number;
  created_at: string;
}

export interface PlantPriceIndex {
  id: number;
  index_date: string;
  overall_index: number;
  philodendron_index: number;
  monstera_index: number;
  alocasia_index: number;
  anthurium_index: number;
  created_at: string;
}

// Plants API
export const plantsApi = {
  async getAll(params?: {
    skip?: number;
    limit?: number;
    category?: string;
    care_level?: string;
    search?: string;
    trending?: boolean;
  }): Promise<Plant[]> {
    const searchParams = new URLSearchParams();
    if (params?.skip) searchParams.append('skip', params.skip.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.care_level) searchParams.append('care_level', params.care_level);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.trending !== undefined) searchParams.append('trending', params.trending.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/plants/?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch plants');
    return response.json();
  },

  async getById(id: number): Promise<Plant> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/${id}`);
    if (!response.ok) throw new Error('Plant not found');
    return response.json();
  },

  async getPrices(id: number): Promise<{
    plant: Plant;
    prices: PlantPrice[];
    price_summary: {
      min_price: number | null;
      max_price: number | null;
      avg_price: number | null;
      total_sources: number;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/${id}/prices`);
    if (!response.ok) throw new Error('Failed to fetch plant prices');
    return response.json();
  },

  async getTrending(): Promise<{
    trending_plants: Plant[];
    total_count: number;
  }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/trending/list`);
    if (!response.ok) throw new Error('Failed to fetch trending plants');
    return response.json();
  },

  async getByCategory(category: string): Promise<Plant[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/categories/${category}`);
    if (!response.ok) throw new Error('Failed to fetch plants by category');
    return response.json();
  },

  async getSearchSuggestions(query: string, limit: number = 10): Promise<{ suggestions: string[] }> {
    const response = await fetch(`${API_BASE_URL}/api/v1/plants/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch search suggestions');
    return response.json();
  }
};

// Market API
export const marketApi = {
  async getTrends(params?: {
    week_start?: string;
    plant_id?: number;
    limit?: number;
  }): Promise<{
    trends: MarketTrend[];
    total_count: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.week_start) searchParams.append('week_start', params.week_start);
    if (params?.plant_id) searchParams.append('plant_id', params.plant_id.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/market/trends?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch market trends');
    return response.json();
  },

  async getPriceIndex(params?: {
    date_from?: string;
    date_to?: string;
  }): Promise<{
    price_indices: PlantPriceIndex[];
    total_count: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.date_from) searchParams.append('date_from', params.date_from);
    if (params?.date_to) searchParams.append('date_to', params.date_to);

    const response = await fetch(`${API_BASE_URL}/api/v1/market/price-index?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch price index');
    return response.json();
  },

  async getTrendingPlants(params?: {
    week_start?: string;
    limit?: number;
  }): Promise<{
    week_start: string;
    trending_plants: TrendingPlant[];
    total_count: number;
  }> {
    const searchParams = new URLSearchParams();
    if (params?.week_start) searchParams.append('week_start', params.week_start);
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/api/v1/market/trending?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch trending plants');
    return response.json();
  },

  async getPriceAnalysis(params?: {
    plant_id?: number;
    category?: string;
    location?: string;
  }): Promise<unknown> {
    const searchParams = new URLSearchParams();
    if (params?.plant_id) searchParams.append('plant_id', params.plant_id.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.location) searchParams.append('location', params.location);

    const response = await fetch(`${API_BASE_URL}/api/v1/market/price-analysis?${searchParams}`);
    if (!response.ok) throw new Error('Failed to fetch price analysis');
    return response.json();
  }
};

// Utility function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}; 