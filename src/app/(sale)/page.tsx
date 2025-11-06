// app/(sale)/page.tsx - Properties For Sale
// Search page specifically for properties for sale

"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Bed, Bath, Car, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyCard } from '@/components/property/PropertyCard';
import { MapView } from '@/components/map/MapView';
import { Property } from '@/entities/property';

type PropertyType = 'all' | 'sale' | 'rent' | 'hotel';
type ViewMode = 'grid' | 'list' | 'map';

export default function SalePage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: [0, 10000000],
    bedrooms: 0,
    bathrooms: 0,
    propertyType: 'sale' as PropertyType
  });

  // Mock properties data for sale
  const properties: Property[] = [
    {
      id: '1',
      title: 'Modern Luxury Villa',
      description: 'Beautiful modern villa with panoramic city views',
      price: 750000,
      type: 'sale',
      status: 'active',
      location: {
        address: 'Downtown, City Center',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        zipCode: '10001',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        neighborhood: 'Manhattan'
      },
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      areaUnit: 'sqft',
      yearBuilt: 2020,
      images: ['/placeholder-property.jpg'],
      amenities: ['Pool', 'Gym', 'Parking', 'Balcony'],
      features: ['City Views', 'Modern Design'],
      furnished: false,
      featured: true,
      userId: 'user-1',
      views: 125,
      favorites: 8,
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2024-10-20')
    },
    {
      id: '3',
      title: 'Cozy Family House',
      description: 'Perfect family home with garden',
      price: 450000,
      type: 'sale',
      status: 'active',
      location: {
        address: 'Suburban Area',
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
        zipCode: '60601',
        coordinates: { lat: 41.8781, lng: -87.6298 },
        neighborhood: 'Lincoln Park'
      },
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      areaUnit: 'sqft',
      yearBuilt: 2015,
      images: ['/placeholder-property.jpg'],
      amenities: ['Garden', 'Garage', 'Fireplace'],
      features: ['Family Friendly', 'Quiet Neighborhood'],
      furnished: false,
      featured: false,
      userId: 'user-2',
      views: 89,
      favorites: 12,
      createdAt: new Date('2024-10-10'),
      updatedAt: new Date('2024-10-18')
    }
  ];

  const filteredProperties = properties.filter(property => {
    if (filters.propertyType !== 'all' && property.type !== filters.propertyType) return false;
    if (filters.location && !property.location.address.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) return false;
    if (filters.bedrooms > 0 && property.bedrooms < filters.bedrooms) return false;
    if (filters.bathrooms > 0 && property.bathrooms < filters.bathrooms) return false;
    return true;
  });

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleViewDetails = (propertyId: string) => {
    console.log('View details for property:', propertyId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Properties For Sale</h1>
        <p className="text-gray-600">Find your perfect home to buy from our curated collection of properties</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by location, property type..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          {/* View Toggle */}
          <div className="flex border rounded-lg">
            {(['grid', 'list', 'map'] as ViewMode[]).map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                onClick={() => setViewMode(mode)}
                className="rounded-none first:rounded-l-lg last:rounded-r-lg"
              >
                {mode === 'grid' && <div className="w-4 h-4" />}
                {mode === 'list' && <div className="w-4 h-1" />}
                {mode === 'map' && <MapPin className="w-4 h-4" />}
              </Button>
            ))}
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-1 block">Min Price</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [Number(e.target.value), prev.priceRange[1]]
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Max Price</label>
              <Input
                type="number"
                placeholder="10000000"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)]
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bedrooms</label>
              <Select
                value={filters.bedrooms.toString()}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  bedrooms: Number(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Bathrooms</label>
              <Select
                value={filters.bathrooms.toString()}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  bathrooms: Number(value)
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Any</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {filteredProperties.length} properties for sale found
          </span>
          <Badge variant="default" className="bg-green-600">
            For Sale
          </Badge>
        </div>
      </div>

      {/* Properties Grid/List/Map */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              isFavorite={favorites.includes(property.id)}
              onToggleFavorite={() => handleToggleFavorite(property.id)}
              onViewDetails={() => handleViewDetails(property.id)}
            />
          ))}
        </div>
      )}

      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={property.images[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{property.title}</h3>
                    <p className="text-gray-600 mb-2">{property.location.address}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bed`}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        {property.bathrooms} bath
                      </span>
                      <span>{property.area} sq ft</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${property.price.toLocaleString()}
                    </div>
                    <Badge variant="default" className="bg-green-600">
                      For Sale
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {viewMode === 'map' && (
        <div className="h-96">
          <MapView
            properties={filteredProperties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onViewDetails={handleViewDetails}
          />
        </div>
      )}

      {/* No Results */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties for sale found</h3>
          <p className="text-gray-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}