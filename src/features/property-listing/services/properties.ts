  import { Property } from '@/entities/property';

export interface PropertySearchFilters {
  query?: string;
  propertyType?: string[];
  status?: string[];
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  location?: string;
  featured?: boolean;
}

export interface PropertySearchResponse {
  properties: Property[];
  totalCount: number;
  hasMore: boolean;
  page: number;
  pageSize: number;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  images: string[];
  features: string[];
  isFeatured?: boolean;
}

class PropertiesService {
  async searchProperties(page = 1, pageSize = 20): Promise<PropertySearchResponse> {
    // For now, return mock response - local filtering is done in usePropertySearch hook
    // In production: const response = await apiClient.get('/properties/search', { params: { ...filters, page, pageSize } });

    // This would typically return from API, but for now we rely on local filtering
    return {
      properties: [],
      totalCount: 0,
      hasMore: false,
      page,
      pageSize,
    };
  }

  async getPropertyById(): Promise<Property> {
    // In production: const response = await apiClient.get(`/properties/${_id}`);
    throw new Error('Property not found');
  }

  async getFeaturedProperties(): Promise<Property[]> {
    // In production: const response = await apiClient.get('/properties/featured', { params: { limit } });
    return [];
  }

  async getRecentProperties(): Promise<Property[]> {
    // In production: const response = await apiClient.get('/properties/recent', { params: { limit } });
    return [];
  }

  async createProperty(): Promise<Property> {
    // In production: const response = await apiClient.post('/properties', data);
    throw new Error('Create property not implemented');
  }

  async updateProperty(): Promise<Property> {
    // In production: const response = await apiClient.put(`/properties/${id}`, data);
    throw new Error('Update property not implemented');
  }

  async deleteProperty(): Promise<void> {
    // In production: await apiClient.delete(`/properties/${id}`);
    throw new Error('Delete property not implemented');
  }

  async toggleFavorite(propertyId: string, userId: string): Promise<boolean> {
    // In production: const response = await apiClient.post(`/properties/${propertyId}/favorite`, { userId });
    // For now, handle locally via localStorage
    const favorites: string[] = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    const isFavorite = favorites.includes(propertyId);

    if (isFavorite) {
      const updatedFavorites = favorites.filter((id: string) => id !== propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(updatedFavorites));
      return false;
    } else {
      favorites.push(propertyId);
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
      return true;
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    // In production: const response = await apiClient.get(`/users/${userId}/favorites`);
    const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
    return favorites;
  }

  async saveSearch(userId: string, searchData: {
    name: string;
    filters: PropertySearchFilters;
    notificationEnabled: boolean;
  }): Promise<void> {
    // In production: await apiClient.post(`/users/${userId}/saved-searches`, searchData);
    const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
    searches.push({ ...searchData, id: Date.now().toString(), createdAt: new Date().toISOString() });
    localStorage.setItem(`searches_${userId}`, JSON.stringify(searches));
  }

  async getSavedSearches(userId: string): Promise<unknown[]> {
    // In production: const response = await apiClient.get(`/users/${userId}/saved-searches`);
    const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
    return searches;
  }

  async promoteProperty(propertyId: string): Promise<void> {
    // In production: await apiClient.post(`/properties/${propertyId}/promote`);
    // This would integrate with payment system
    throw new Error('Promotion feature coming soon');
  }
}

export const propertiesService = new PropertiesService();
export default propertiesService;