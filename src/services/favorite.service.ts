import apiClient from './api';

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: Date;
  property: {
    id: string;
    title: string;
    price: number;
    type: 'sale' | 'rent' | 'hotel';
    location: string;
    image?: string;
  };
}

export interface FavoritesResponse {
  favorites: Favorite[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export class FavoriteService {
  // Get user's favorites
  static async getFavorites(page = 1, limit = 10): Promise<FavoritesResponse> {
    const response = await apiClient.get<FavoritesResponse>('/api/favorites', {
      params: { page: page.toString(), limit: limit.toString() }
    });
    return response.data;
  }

  // Add property to favorites
  static async addToFavorites(propertyId: string): Promise<{ success: boolean; favorite: Favorite }> {
    const response = await apiClient.post<{ success: boolean; favorite: Favorite }>('/api/favorites', {
      propertyId
    });
    return response.data;
  }

  // Remove property from favorites
  static async removeFromFavorites(propertyId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<{ success: boolean }>(`/api/favorites/${propertyId}`);
    return response.data;
  }

  // Check if property is favorited
  static async isFavorite(propertyId: string): Promise<{ isFavorite: boolean }> {
    const response = await apiClient.get<{ isFavorite: boolean }>(`/api/favorites/check/${propertyId}`);
    return response.data;
  }

  // Get favorites count for user
  static async getFavoritesCount(): Promise<{ count: number }> {
    const response = await apiClient.get<{ count: number }>('/api/favorites/count');
    return response.data;
  }
}