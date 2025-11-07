// Property Types - Consolidated for all property types (sale/rent/hotel)

export interface Property {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  type?: 'sale' | 'rent' | 'hotel';
  status?: 'active' | 'sold' | 'rented' | 'pending';
  location: {
    address?: string;
    city: string;
    county: string;
    zone?: string;
    country?: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
    neighborhood?: string;
  };
  propertyType: string;
  bedrooms?: number;
  bathrooms?: number;
  rooms?: number;
  area: number;
  areaUnit?: 'sqft' | 'sqm' | 'acre' | 'mp';
  yearBuilt?: number;
  floor?: number;
  totalFloors?: number;
  lotSize?: number;
  lotSizeUnit?: 'sqft' | 'sqm' | 'acre';
  parking?: number;
  floors?: number;
  images: string[];
  amenities?: string[];
  features: string[];
  propertyTax?: number;
  hoa?: number;
  utilities?: string[];
  availableDate?: Date;
  petPolicy?: 'allowed' | 'not_allowed' | 'conditional';
  furnished?: boolean;
  featured?: boolean;
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
    showPhone: boolean;
    avatar?: string | null;
    role?: string;
  };
  userId: string;
  agentId?: string;
  isActive: boolean;
  views?: number;
  favorites?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Property filters for search
export interface PropertyFilters {
  type?: 'sale' | 'rent' | 'hotel';
  status?: 'active' | 'sold' | 'rented' | 'pending';
  price?: {
    min?: number;
    max?: number;
  };
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: {
    min?: number;
    max?: number;
  };
  amenities?: string[];
  features?: string[];
  search?: string;
  featured?: boolean;
  sortBy?: 'price' | 'date' | 'area' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Property form data
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  type: 'sale' | 'rent' | 'hotel';
  location: string;
  city: string;
  state: string;
  zipCode?: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: 'sqft' | 'sqm' | 'acre';
  images: File[];
  amenities: string[];
  features: string[];
  availableDate?: Date;
  petPolicy?: 'allowed' | 'not_allowed' | 'conditional';
  furnished?: boolean;
}

// Property list response with pagination
export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  totalPages: number;
}

// Property search response
export interface PropertySearchResponse extends PropertyListResponse {
  filters: {
    availableTypes: string[];
    priceRange: {
      min: number;
      max: number;
    };
    locationSuggestions: string[];
    popularAmenities: string[];
  };
}

// Property comparison
export interface PropertyComparison {
  properties: Property[];
  comparisonData: {
    [key: string]: {
      label: string;
      value: string | number;
      type: 'text' | 'number' | 'currency' | 'boolean';
    }[];
  };
}

// Property analytics
export interface PropertyAnalytics {
  totalViews: number;
  totalFavorites: number;
  totalInquiries: number;
  viewsByDate: { date: string; count: number }[];
  viewsBySource: { source: string; count: number }[];
  inquiriesByDate: { date: string; count: number }[];
}