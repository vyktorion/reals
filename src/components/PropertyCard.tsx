import { Heart, MapPin, Bed, Bath, Maximize, Eye } from 'lucide-react';
import { Property } from '../entities/property';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function PropertyCard({ property, isFavorite, onToggleFavorite, onViewDetails }: PropertyCardProps) {
  const formatPrice = (price: number) => {
    if (property.status === 'For Rent') {
      return `$${price.toLocaleString('en-US')}/mo`;
    }
    return `$${price.toLocaleString('en-US')}`;
  };

  return (
    <div className="group bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-border hover:border-blue-200/50 dark:hover:border-blue-500/20 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-gray-50 dark:bg-gray-800">
        <ImageWithFallback
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase shadow-sm ${
            property.status === 'For Sale' 
              ? 'bg-blue-900/80 text-white' 
              : 'bg-amber-900/80 text-white'
          }`}>
            {property.status}
          </span>
        </div>

        {/* Featured Badge */}
        {property.isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase bg-amber-500/80 text-white shadow-sm">
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
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 ${
            property.isFeatured ? 'mt-10' : ''
          } ${
            isFavorite
              ? 'bg-red-500/90 text-white scale-110'
              : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:scale-110'
          } shadow-sm hover:shadow-md`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* View Details Button - shown on hover */}
        <button
          onClick={() => onViewDetails(property.id)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 rounded-full text-sm font-medium text-gray-900 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Price & Type */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-2xl font-serif text-blue-900 dark:text-blue-100 tracking-tight">
            {formatPrice(property.price)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-medium">
            {property.type}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
          <MapPin className="w-4 h-4 shrink-0 text-gray-400 dark:text-gray-500" />
          <span className="line-clamp-1">{property.location.city}, {property.location.state}</span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Bed className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Bath className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Maximize className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span>{property.area.toLocaleString('en-US')} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
