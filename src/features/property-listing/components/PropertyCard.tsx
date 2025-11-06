import { Heart, MapPin, Bed, Bath, Maximize, Eye } from 'lucide-react';
import { Property } from '@/entities/property';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function PropertyCard({ property, isFavorite, onToggleFavorite, onViewDetails }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (property.type === 'rent') {
      return `$${price.toLocaleString()}/mo`;
    }
    return `$${(price / 1000000).toFixed(2)}M`;
  };

  return (
    <div className="group bg-card rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1">
        {/* Image Container */}
        <div className="relative aspect-4/3 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-md ${
            property.type === 'sale'
              ? 'bg-blue-900/90 text-primary-foreground'
              : 'bg-amber-500/90 text-primary-foreground'
          }`}>
            {property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full text-xs bg-amber-400/90 text-gray-900 backdrop-blur-md">
              Featured
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-200 ${
            property.featured ? 'mt-10' : ''
          } ${
            isFavorite
              ? 'bg-red-500 text-primary-foreground scale-110'
              : 'bg-card/90 text-gray-700 hover:bg-card hover:scale-110'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* View Details Button - shown on hover */}
        <button
          onClick={() => onViewDetails(property.id)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-card/95 dark:bg-gray-800/95 backdrop-blur-md rounded-full text-sm text-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-card dark:hover:bg-gray-800 flex items-center gap-2 shadow-lg"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price & Type */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-primary">{formatPrice(property.price)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{property.type}</div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-foreground mb-2 line-clamp-1 group-hover:text-blue-900 dark:group-hover:text-blue-400 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="line-clamp-1">{property.location.city}, {property.location.state}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Bed className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Bath className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-foreground">
            <Maximize className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{property.area.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
