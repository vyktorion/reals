import { useState, useMemo } from 'react';
import { useDebounce } from './search/useDebounce';
import { Property } from '@/entities/property';
import { properties } from '@/shared/data/properties';

export interface SearchFilters {
  query?: string;
  propertyType?: string[];
  status?: string[];
  priceRange?: [number, number];
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  location?: string;
}

export interface SearchState {
  results: Property[];
  filters: SearchFilters;
  isLoading: boolean;
  totalCount: number;
  hasMore: boolean;
}

export function usePropertySearch(initialFilters: SearchFilters = {}) {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce search query for performance
  const debouncedQuery = useDebounce(filters.query || '', 300);

  // Update filters with debounced query
  const searchFilters = useMemo(() => ({
    ...filters,
    query: debouncedQuery,
  }), [filters, debouncedQuery]);

  // Search and filter properties
  const searchResults = useMemo(() => {
    setIsLoading(true);

    let filtered = [...properties];

    // Text search
    if (searchFilters.query) {
      const query = searchFilters.query.toLowerCase();
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(query) ||
        property.location.city.toLowerCase().includes(query) ||
        property.location.state.toLowerCase().includes(query) ||
        property.type.toLowerCase().includes(query) ||
        property.description.toLowerCase().includes(query)
      );
    }

    // Property type filter
    if (searchFilters.propertyType && searchFilters.propertyType.length > 0) {
      filtered = filtered.filter(property =>
        searchFilters.propertyType!.includes(property.type)
      );
    }

    // Status filter
    if (searchFilters.status && searchFilters.status.length > 0) {
      filtered = filtered.filter(property =>
        searchFilters.status!.includes(property.status)
      );
    }

    // Price range filter
    if (searchFilters.priceRange) {
      const [minPrice, maxPrice] = searchFilters.priceRange;
      filtered = filtered.filter(property =>
        property.price >= minPrice && property.price <= maxPrice
      );
    }

    // Bedrooms filter
    if (searchFilters.bedrooms !== undefined && searchFilters.bedrooms > 0) {
      filtered = filtered.filter(property =>
        property.bedrooms >= searchFilters.bedrooms!
      );
    }

    // Bathrooms filter
    if (searchFilters.bathrooms !== undefined && searchFilters.bathrooms > 0) {
      filtered = filtered.filter(property =>
        property.bathrooms >= searchFilters.bathrooms!
      );
    }

    // Area filters
    if (searchFilters.minArea !== undefined && searchFilters.minArea > 0) {
      filtered = filtered.filter(property =>
        property.area >= searchFilters.minArea!
      );
    }

    if (searchFilters.maxArea !== undefined && searchFilters.maxArea > 0) {
      filtered = filtered.filter(property =>
        property.area <= searchFilters.maxArea!
      );
    }

    // Location filter
    if (searchFilters.location) {
      const location = searchFilters.location.toLowerCase();
      filtered = filtered.filter(property =>
        property.location.city.toLowerCase().includes(location) ||
        property.location.state.toLowerCase().includes(location) ||
        property.location.address.toLowerCase().includes(location)
      );
    }

    // Sort by featured first, then by date
    filtered.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.listedDate || 0).getTime() - new Date(a.listedDate || 0).getTime();
    });

    setIsLoading(false);
    return filtered;
  }, [searchFilters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const setQuery = (query: string) => {
    updateFilters({ query });
  };

  const togglePropertyType = (type: string) => {
    const currentTypes = filters.propertyType || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    updateFilters({ propertyType: newTypes });
  };

  const toggleStatus = (status: string) => {
    const currentStatuses = filters.status || [];
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status];
    updateFilters({ status: newStatuses });
  };

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.propertyType?.length) count++;
    if (filters.status?.length) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.minArea) count++;
    if (filters.maxArea) count++;
    if (filters.location) count++;
    return count;
  }, [filters]);

  return {
    results: searchResults,
    filters: searchFilters,
    isLoading,
    totalCount: searchResults.length,
    hasMore: false, // For future pagination
    updateFilters,
    clearFilters,
    setQuery,
    togglePropertyType,
    toggleStatus,
    activeFiltersCount,
  };
}