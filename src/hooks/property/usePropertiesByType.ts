import { useState, useEffect, useMemo, useCallback } from 'react';
import { PropertyService, PropertyFilters, PropertyListResponse } from '@/services/property.service';
import { Property } from '@/entities/property/model/types';

export interface UsePropertiesByTypeOptions {
  type?: 'sale' | 'rent' | 'hotel';
  autoFetch?: boolean;
  debounceMs?: number;
}

export function usePropertiesByType(
  initialFilters: PropertyFilters = {},
  options: UsePropertiesByTypeOptions = {}
) {
  const [data, setData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const filters = useMemo(() => ({
    ...initialFilters,
    ...(options.type && { type: options.type })
  }), [initialFilters, options.type]);

  const fetchProperties = useCallback(async (append = false) => {
    setLoading(true);
    setError(null);

    try {
      const response: PropertyListResponse = await PropertyService.getProperties(filters);

      if (append) {
        setData(prev => [...prev, ...response.properties]);
      } else {
        setData(response.properties);
      }

      setHasMore(response.hasMore);
      setPage(response.page);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const refresh = () => {
    setPage(1);
    fetchProperties(false);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchProperties(true);
    }
  };

  const search = (searchQuery: string) => {
    const newFilters = { ...filters, search: searchQuery };
    // Update filters and fetch
    // This would typically be done through a state management solution
    return PropertyService.getProperties(newFilters);
  };

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    // Update current filters and refetch
    const updatedFilters = { ...filters, ...newFilters };
    return PropertyService.getProperties(updatedFilters);
  };

  // Auto fetch when filters or options.autoFetch change
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchProperties(false);
    }
  }, [filters, options.autoFetch, fetchProperties]);

  return {
    properties: data,
    loading,
    error,
    hasMore,
    page,
    total,
    fetchProperties: () => fetchProperties(false),
    refresh,
    loadMore,
    search,
    updateFilters,
    filters
  };
}

// Specialized hooks for different property types
export function useSaleProperties(filters: PropertyFilters = {}, options: UsePropertiesByTypeOptions = {}) {
  return usePropertiesByType(filters, { ...options, type: 'sale' });
}

export function useRentProperties(filters: PropertyFilters = {}, options: UsePropertiesByTypeOptions = {}) {
  return usePropertiesByType(filters, { ...options, type: 'rent' });
}

export function useHotelProperties(filters: PropertyFilters = {}, options: UsePropertiesByTypeOptions = {}) {
  return usePropertiesByType(filters, { ...options, type: 'hotel' });
}