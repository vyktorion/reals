'use client'

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { PropertyCard } from '@/components/property/PropertyCard';
import { MapView } from '@/components/map/MapView';
import { Grid3x3, List, Map } from 'lucide-react';

export default function HotelPage() {
  const { properties, favorites, toggleFavorite, setSelectedProperty } = useApp();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  
  // Filter properties for hotel/rental (short-term stay)
  const hotelProperties = properties.filter(p => p.type === 'hotel');

  const handleViewDetails = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      router.push(`/hotel/property/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Hotel & Luxury Stays</h1>
              <p className="text-muted-foreground mt-1">
                {hotelProperties.length} {hotelProperties.length === 1 ? 'property' : 'properties'} available
              </p>
            </div>

            {/* View Mode Toggle */}
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
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotelProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={toggleFavorite}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {hotelProperties.map((property) => (
              <div key={property.id} className="bg-card rounded-2xl shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-medium text-foreground">{property.title}</h3>
                    <p className="text-muted-foreground">{property.location.address}, {property.location.city}</p>
                    <p className="text-sm text-primary mt-1">{property.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-medium text-primary">
                      ${property.price.toLocaleString()}/night
                    </div>
                    <button
                      onClick={() => handleViewDetails(property.id)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-blue-800 transition-colors mt-2"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <MapView 
            properties={hotelProperties}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewDetails={handleViewDetails}
          />
        )}

        {hotelProperties.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-foreground mb-2">No luxury properties available</h3>
            <p className="text-muted-foreground">Check back later for new luxury stays</p>
          </div>
        )}
      </div>
    </div>
  );
}