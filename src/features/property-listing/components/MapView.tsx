import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Property } from '@/entities/property';
import { PropertyCard } from '@/components/property/PropertyCard';
import './MapView.css';

interface MapViewProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function MapView({ properties, favorites, onToggleFavorite, onViewDetails }: MapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="mapview-root relative bg-card rounded-2xl shadow-md overflow-hidden">
      {/* Map Background */}
  <div className="mapview-bg absolute inset-0">
        {/* Grid Pattern */}
        <div className="mapview-grid absolute inset-0" />

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
              className={`mapview-marker-btn group marker-pos marker-delay-${index}`}
              data-top={top}
              data-left={left}
            >
              {/* Marker */}
              <div className="relative">
                <div className={`mapview-marker${selectedProperty?.id === property.id ? ' selected' : ''}`}>
                  <MapPin className="w-5 h-5" />
                </div>
                
                {/* Pulse Animation */}
                {selectedProperty?.id === property.id && (
                  <div className="absolute inset-0 rounded-full bg-blue-900 animate-ping opacity-30" />
                )}

                {/* Price Label */}
                <div className={`mapview-price-label${selectedProperty?.id === property.id ? ' selected' : ''}`}>
                  {property.type === 'rent'
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
            aria-label="Close property details"
            title="Close"
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

      {/* Accessibility: Ensure close button has discernible text */}
      {/* Note: If you have a close button with only an icon, add aria-label and type="button". */}

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-card rounded-xl shadow-lg p-1 flex flex-col gap-1">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="Zoom in">
          <span className="text-xl">+</span>
        </button>
        <div className="h-px bg-gray-200" />
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700" title="Zoom out">
          <span className="text-xl">−</span>
        </button>
      </div>

    </div>
  );
}
