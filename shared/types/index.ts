// Shared types between frontend and backend

export interface Plant {
  id: number;
  name: string;
  scientificName: string;
  category: PlantCategory;
  description: string;
  careLevel: CareLevel;
  price: number;
  location: string;
  seller: string;
  images: string[];
  isVerified: boolean;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MarketData {
  id: number;
  plantId: number;
  price: number;
  supply: SupplyLevel;
  demand: DemandLevel;
  location: string;
  date: string;
  trend: TrendDirection;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

export interface TrendAnalysis {
  id: number;
  plantId: number;
  confidence: number;
  prediction: string;
  factors: string[];
  riskLevel: RiskLevel;
  opportunity: string;
  createdAt: string;
}

// Enums
export enum PlantCategory {
  INDOOR = 'indoor',
  OUTDOOR = 'outdoor',
  SUCCULENT = 'succulent',
  RARE = 'rare'
}

export enum CareLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export enum SupplyLevel {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

export enum DemandLevel {
  VERY_HIGH = 'very_high',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  VERY_LOW = 'very_low'
}

export enum TrendDirection {
  RISING = 'rising',
  STABLE = 'stable',
  DECLINING = 'declining'
}

export enum UserRole {
  USER = 'user',
  SELLER = 'seller',
  ADMIN = 'admin'
}

export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Language types
export type Language = 'en' | 'th';

// Search and filter types
export interface SearchFilters {
  category?: PlantCategory;
  priceRange?: [number, number];
  location?: string;
  careLevel?: CareLevel;
  inStock?: boolean;
}

export interface SortOptions {
  field: 'price' | 'name' | 'createdAt' | 'popularity';
  direction: 'asc' | 'desc';
} 