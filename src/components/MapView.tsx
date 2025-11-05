import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Property } from '../entities/property';
import { PropertyCard } from './PropertyCard';

interface MapViewProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function MapView({ properties, favorites, onToggleFavorite, onViewDetails }: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="relative bg-card rounded-2xl shadow-md overflow-hidden" style={{ height: 'calc(100vh - 16rem)' }}>
      {/* Map Background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-gray-50">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Map Center Point */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-sm text-gray-400 mb-2">Interactive Map View</div>
          <MapPin className="w-8 h-8 text-blue-900 mx-auto animate-bounce" />
        </div>

        {/* Property Markers */}
        {properties.map((property, index) => {
          const top = 20 + (index % 4) * 20;
          const left = 15 + ((index * 17) % 70);

          return (
            <button
              key={property.id}
              onClick={() => setSelectedProperty(property)}
              className="absolute group"
              style={{ 
                top: `${top}%`, 
                left: `${left}%`,
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Marker */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 group-hover:scale-125 ${
                  selectedProperty?.id === property.id
                    ? 'bg-blue-900 text-primary-foreground ring-4 ring-blue-300 scale-125'
                    : 'bg-card text-blue-900 group-hover:bg-blue-900 group-hover:text-primary-foreground'
                }`}>
                  <MapPin className="w-5 h-5" />
                </div>
                
                {/* Pulse Animation */}
                {selectedProperty?.id === property.id && (
                  <div className="absolute inset-0 rounded-full bg-blue-900 animate-ping opacity-30" />
                )}

                {/* Price Label */}
                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs whitespace-nowrap shadow-md transition-all duration-200 ${
                  selectedProperty?.id === property.id
                    ? 'bg-blue-900 text-primary-foreground opacity-100'
                    : 'bg-card text-gray-900 opacity-0 group-hover:opacity-100'
                }`}>
                  {property.status === 'For Rent' 
                    ? `$${property.price.toLocaleString()}/mo`
                    : `$${(property.price / 1000000).toFixed(2)}M`
                  }
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Property Details Panel */}
      {selectedProperty && (
        <div className="absolute bottom-0 left-0 right-0 sm:bottom-auto sm:top-4 sm:right-4 sm:left-auto sm:w-96 bg-card rounded-t-3xl sm:rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-8 sm:slide-in-from-right-8 duration-300 z-10">
          <button
            onClick={() => setSelectedProperty(null)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <PropertyCard
            property={selectedProperty}
            isFavorite={favorites.includes(selectedProperty.id)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
          />
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-card rounded-xl shadow-lg p-1 flex flex-col gap-1">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
          <span className="text-xl">+</span>
        </button>
        <div className="h-px bg-gray-200" />
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700">
          <span className="text-xl">−</span>
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
