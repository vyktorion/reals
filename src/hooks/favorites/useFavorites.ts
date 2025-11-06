import { useState, useEffect } from 'react';
import { FavoriteService, FavoritesResponse, Favorite } from '@/services/favorite.service';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch user's favorites
  const fetchFavorites = async (pageNum = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: FavoritesResponse = await FavoriteService.getFavorites(pageNum, limit);
      
      if (pageNum === 1) {
        setFavorites(response.favorites);
      } else {
        setFavorites(prev => [...prev, ...response.favorites]);
      }
      
      setTotal(response.total);
      setHasMore(response.hasMore);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  // Add property to favorites
  const addToFavorites = async (propertyId: string) => {
    try {
      const result = await FavoriteService.addToFavorites(propertyId);
      if (result.success) {
        setFavorites(prev => [result.favorite, ...prev]);
        setTotal(prev => prev + 1);
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to favorites');
      throw err;
    }
  };

  // Remove property from favorites
  const removeFromFavorites = async (propertyId: string) => {
    try {
      const result = await FavoriteService.removeFromFavorites(propertyId);
      if (result.success) {
        setFavorites(prev => prev.filter(fav => fav.propertyId !== propertyId));
        setTotal(prev => Math.max(0, prev - 1));
      }
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove from favorites');
      throw err;
    }
  };

  // Check if property is favorited
  const isFavorite = async (propertyId: string): Promise<boolean> => {
    try {
      const result = await FavoriteService.isFavorite(propertyId);
      return result.isFavorite;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check favorite status');
      return false;
    }
  };

  // Get favorites count
  const getFavoritesCount = async (): Promise<number> => {
    try {
      const result = await FavoriteService.getFavoritesCount();
      return result.count;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get favorites count');
      return 0;
    }
  };

  // Load more favorites
  const loadMore = () => {
    if (!loading && hasMore) {
      fetchFavorites(page + 1, 10);
    }
  };

  // Refresh favorites list
  const refresh = () => {
    setPage(1);
    fetchFavorites(1, 10);
  };

  // Toggle favorite status
  const toggleFavorite = async (propertyId: string) => {
    const currentlyFavorite = favorites.some(fav => fav.propertyId === propertyId);
    
    if (currentlyFavorite) {
      return removeFromFavorites(propertyId);
    } else {
      return addToFavorites(propertyId);
    }
  };

  return {
    favorites,
    loading,
    error,
    total,
    hasMore,
    page,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    getFavoritesCount,
    loadMore,
    refresh,
    toggleFavorite
  };
}