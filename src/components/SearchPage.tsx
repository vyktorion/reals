import { useState } from 'react';
import Image from 'next/image';
import { Search, SlidersHorizontal, Map as MapIcon, Grid3x3, List } from 'lucide-react';
import { Property } from '@/entities/property';
import { FilterOptions } from '@/entities/property/model/types';
import { PropertyCard } from '@/components/property/PropertyCard';
import { MapView } from '@/components/map/MapView';

interface SearchPageProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function SearchPage({ properties, favorites, onToggleFavorite, onViewDetails }: SearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('list');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 10000000],
    propertyType: [],
    status: [],
    bedrooms: null,
    bathrooms: null,
    minArea: null,
    maxArea: null,
  });

  // Filter properties based on search and filters
  const filteredProperties = properties.filter((property) => {
    // Search query
    const matchesQuery = searchQuery === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.type.toLowerCase().includes(searchQuery.toLowerCase());

    // Price range
    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];

    // Property type
    const matchesType = filters.propertyType.length === 0 || filters.propertyType.includes(property.type);

    // Status
    const matchesStatus = filters.status.length === 0 || filters.status.includes(property.status);

    // Bedrooms
    const matchesBedrooms = filters.bedrooms === null || property.bedrooms >= filters.bedrooms;

    // Bathrooms
    const matchesBathrooms = filters.bathrooms === null || property.bathrooms >= filters.bathrooms;

    // Area
    const matchesArea = (filters.minArea === null || property.area >= filters.minArea) &&
                       (filters.maxArea === null || property.area <= filters.maxArea);

    return matchesQuery && matchesPrice && matchesType && matchesStatus && matchesBedrooms && matchesBathrooms && matchesArea;
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | string[] | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const togglePropertyType = (type: string) => {
    setFilters((prev) => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter((t) => t !== type)
        : [...prev.propertyType, type],
    }));
  };

  const toggleStatus = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: [0, 10000000],
      propertyType: [],
      status: [],
      bedrooms: null,
      bathrooms: null,
      minArea: null,
      maxArea: null,
    });
  };

  const activeFilterCount = 
    filters.propertyType.length +
    filters.status.length +
    (filters.bedrooms !== null ? 1 : 0) +
    (filters.bathrooms !== null ? 1 : 0) +
    (filters.minArea !== null ? 1 : 0) +
    (filters.maxArea !== null ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, property type..."
                className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            {/* Filter & View Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative px-4 py-3 border rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  showFilters
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-card-foreground border-border hover:bg-accent'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex gap-1 border border-border rounded-xl p-1 bg-card">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'map' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                  }`}
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full sm:w-80 shrink-0">
              <div className="bg-card rounded-2xl shadow-md p-6 sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground">Filters</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['House', 'Apartment', 'Villa', 'Penthouse', 'Condo', 'Townhouse', 'Estate'].map((type) => (
                      <button
                        key={type}
                        onClick={() => togglePropertyType(type)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          filters.propertyType.includes(type)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Status</label>
                  <div className="flex gap-2">
                    {['For Sale', 'For Rent'].map((status) => (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                          filters.status.includes(status)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Min Bedrooms</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleFilterChange('bedrooms', filters.bedrooms === num ? null : num)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                          filters.bedrooms === num
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bathrooms */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Min Bathrooms</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        onClick={() => handleFilterChange('bathrooms', filters.bathrooms === num ? null : num)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                          filters.bathrooms === num
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area Range */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Area (sqft)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minArea || ''}
                        onChange={(e) => handleFilterChange('minArea', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxArea || ''}
                        onChange={(e) => handleFilterChange('maxArea', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={onToggleFavorite}
                    onViewDetails={onViewDetails}
                  />
                ))}
              </div>
            ) : viewMode === 'list' ? (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="bg-card rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-border">
                    <div className="flex flex-col sm:flex-row">
                      {/* Image */}
                      <div className="relative sm:w-80 h-48 sm:h-auto shrink-0">
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          width={320}
                          height={192}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => onViewDetails(property.id)}
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 text-xs rounded-full text-primary-foreground ${
                            property.type === 'sale'
                              ? 'bg-green-500/90 dark:bg-green-600/90' 
                              : 'bg-blue-500/90 dark:bg-blue-600/90'
                          }`}>
                            {property.status}
                          </span>
                        </div>
                        <button
                          onClick={() => onToggleFavorite(property.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-all"
                        >
                          <svg
                            className={`w-4 h-4 ${
                              favorites.includes(property.id) 
                                ? 'text-red-500 fill-red-500' 
                                : 'text-muted-foreground'
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 
                              className="text-xl font-medium text-foreground mb-1 cursor-pointer hover:text-primary transition-colors"
                              onClick={() => onViewDetails(property.id)}
                            >
                              {property.title}
                            </h3>
                            <p className="text-muted-foreground text-sm">
                              {property.location.address}, {property.location.city}, {property.location.state}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-medium text-primary">
                              ${property.price.toLocaleString()}
                            </div>
                            {property.type === 'rent' && (
                              <div className="text-sm text-muted-foreground">/month</div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{property.bedrooms} beds</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11" />
                            </svg>
                            <span>{property.bathrooms} baths</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            <span>{property.area.toLocaleString()} sqft</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span className="capitalize">{property.type}</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {property.description}
                        </p>

                        <div className="flex justify-between items-center mt-4">
                          <button
                            onClick={() => onViewDetails(property.id)}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
                          >
                            View Details
                          </button>
                          <div className="text-xs text-muted-foreground">
                            {property.reviews?.length || 0} reviews
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <MapView 
                properties={filteredProperties}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
                onViewDetails={onViewDetails}
              />
            )}

            {filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
