import apiClient from './api';
import { Property } from '@/entities/property/model/types';

export interface PropertyFilters {
  type?: 'sale' | 'rent' | 'hotel';
  status?: 'active' | 'sold' | 'rented';
  price?: { min?: number; max?: number };
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: { min?: number; max?: number };
  amenities?: string[];
  search?: string;
}

export interface PropertyListResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export class PropertyService {
  // Get properties with type parameter support (consolidated API)
  static async getProperties(filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    const params = new URLSearchParams();
    
    // Add filters as query parameters
    if (filters.type) params.append('type', filters.type);
    if (filters.status) params.append('status', filters.status);
    if (filters.price?.min) params.append('priceMin', filters.price.min.toString());
    if (filters.price?.max) params.append('priceMax', filters.price.max.toString());
    if (filters.location) params.append('location', filters.location);
    if (filters.bedrooms) params.append('bedrooms', filters.bedrooms.toString());
    if (filters.bathrooms) params.append('bathrooms', filters.bathrooms.toString());
    if (filters.area?.min) params.append('areaMin', filters.area.min.toString());
    if (filters.area?.max) params.append('areaMax', filters.area.max.toString());
    if (filters.search) params.append('search', filters.search);
    
    // Add amenities
    if (filters.amenities?.length) {
      filters.amenities.forEach(amenity => {
        params.append('amenities', amenity);
      });
    }

    const queryString = params.toString();
    const url = `/api/properties${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<PropertyListResponse>(url);
    return response.data;
  }

  // Get single property
  static async getProperty(id: string): Promise<Property> {
    const response = await apiClient.get<Property>(`/api/properties/${id}`);
    return response.data;
  }

  // Create new property
  static async createProperty(propertyData: Partial<Property>): Promise<Property> {
    const response = await apiClient.post<Property>('/api/properties', propertyData);
    return response.data;
  }

  // Update property
  static async updateProperty(id: string, propertyData: Partial<Property>): Promise<Property> {
    const response = await apiClient.put<Property>(`/api/properties/${id}`, propertyData);
    return response.data;
  }

  // Delete property
  static async deleteProperty(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/api/properties/${id}`);
    return response.data;
  }

  // Get property types
  static async getPropertyTypes(): Promise<string[]> {
    const response = await apiClient.get<string[]>('/api/properties/types');
    return response.data;
  }

  // Get featured properties
  static async getFeaturedProperties(type?: 'sale' | 'rent' | 'hotel'): Promise<Property[]> {
    const params = new URLSearchParams();
    if (type) params.append('featured', 'true');
    if (type) params.append('type', type);
    
    const queryString = params.toString();
    const url = `/api/properties${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<PropertyListResponse>(url);
    return response.data.properties;
  }

  // Search properties (legacy compatibility)
  static async searchProperties(query: string, filters: PropertyFilters = {}): Promise<PropertyListResponse> {
    return this.getProperties({ ...filters, search: query });
  }
}