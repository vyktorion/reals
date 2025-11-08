import { Property } from '@/entities/property';
// import { apiClient } from '../../../shared/lib/api'; // TODO: Move to shared lib

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

class PropertiesApi {
  async searchProperties(_filters: PropertySearchFilters = {}, page = 1, pageSize = 20): Promise<PropertySearchResponse> {
    try {
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
    } catch {
      throw new Error('Failed to search properties');
    }
  }

  async getPropertyById(_id: string): Promise<Property> {
    try {
      // In production: const response = await apiClient.get(`/properties/${id}`);
      throw new Error('Property not found');
    } catch {
      throw new Error('Failed to fetch property');
    }
  }

  async getFeaturedProperties(_limit = 6): Promise<Property[]> {
    try {
      // In production: const response = await apiClient.get('/properties/featured', { params: { limit } });
      return [];
    } catch {
      throw new Error('Failed to fetch featured properties');
    }
  }

  async getRecentProperties(_limit = 6): Promise<Property[]> {
    try {
      // In production: const response = await apiClient.get('/properties/recent', { params: { limit } });
      return [];
    } catch {
      throw new Error('Failed to fetch recent properties');
    }
  }

  async createProperty(_data: CreatePropertyData): Promise<Property> {
    try {
      // In production: const response = await apiClient.post('/properties', data);
      throw new Error('Create property not implemented');
    } catch {
      throw new Error('Failed to create property');
    }
  }

  async updateProperty(_id: string, _data: Partial<CreatePropertyData>): Promise<Property> {
    try {
      // In production: const response = await apiClient.put(`/properties/${id}`, data);
      throw new Error('Update property not implemented');
    } catch {
      throw new Error('Failed to update property');
    }
  }

  async deleteProperty(_id: string): Promise<void> {
    try {
      // In production: await apiClient.delete(`/properties/${id}`);
      throw new Error('Delete property not implemented');
    } catch {
      throw new Error('Failed to delete property');
    }
  }

  async toggleFavorite(propertyId: string, userId: string): Promise<boolean> {
    try {
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
    } catch {
      throw new Error('Failed to toggle favorite');
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    try {
      // In production: const response = await apiClient.get(`/users/${userId}/favorites`);
      const favorites = JSON.parse(localStorage.getItem(`favorites_${userId}`) || '[]');
      return favorites;
    } catch {
      throw new Error('Failed to fetch favorites');
    }
  }

  async saveSearch(userId: string, searchData: {
    name: string;
    filters: PropertySearchFilters;
    notificationEnabled: boolean;
  }): Promise<void> {
    try {
      // In production: await apiClient.post(`/users/${userId}/saved-searches`, searchData);
      const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
      searches.push({ ...searchData, id: Date.now().toString(), createdAt: new Date().toISOString() });
      localStorage.setItem(`searches_${userId}`, JSON.stringify(searches));
    } catch {
      throw new Error('Failed to save search');
    }
  }

  async getSavedSearches(userId: string): Promise<unknown[]> {
    try {
      // In production: const response = await apiClient.get(`/users/${userId}/saved-searches`);
      const searches = JSON.parse(localStorage.getItem(`searches_${userId}`) || '[]');
      return searches;
    } catch {
      throw new Error('Failed to fetch saved searches');
    }
  }

  async promoteProperty(_propertyId: string): Promise<void> {
    try {
      // In production: await apiClient.post(`/properties/${propertyId}/promote`);
      // This would integrate with payment system
      throw new Error('Promotion feature coming soon');
    } catch {
      throw new Error('Failed to promote property');
    }
  }
}

export const propertiesApi = new PropertiesApi();
export default propertiesApi;