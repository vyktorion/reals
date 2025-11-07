"use client";

import React, { useState } from 'react';
import { Property } from '@/entities/property';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Heart, Eye, Bed, Bath, Car, Square } from 'lucide-react';
import { formatPrice, formatArea, formatRelativeTime } from '@/shared/utils/formatters';

interface PropertyCardProps {
  property: Property;
  onFavorite?: (propertyId: string) => void;
  onView?: (propertyId: string) => void;
  onPropertyClick?: (propertyId: string) => void;
  isFavorite?: boolean;
  viewMode?: 'grid' | 'list';
  showFavoriteButton?: boolean;
  showViewButton?: boolean;
  className?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavorite,
  onView,
  onPropertyClick,
  isFavorite = false,
  viewMode = 'grid',
  showFavoriteButton = true,
  showViewButton = true,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFavorite?.(property.id);
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onView?.(property.id);
  };

  const handleCardClick = () => {
    onPropertyClick?.(property.id);
  };

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'sale':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'hotel':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case 'sale':
        return 'For Sale';
      case 'rent':
        return 'For Rent';
      case 'hotel':
        return 'Hotel';
      default:
        return type;
    }
  };


  if (viewMode === 'list') {
    return (
      <Card 
        className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
        onClick={handleCardClick}
      >
        <CardContent className="p-0">
          <div className="flex">
            {/* Image Section */}
            <div className="relative w-48 h-32 shrink-0">
              {isImageLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-l-lg" />
              )}
              {!imageError ? (
                <img
                  src={property.images?.[0] || '/placeholder-property.jpg'}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-l-lg"
                  onError={() => setImageError(true)}
                  onLoad={() => setIsImageLoading(false)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-l-lg flex items-center justify-center">
                  <span className="text-gray-400 text-sm">No image</span>
                </div>
              )}
              
              {/* Favorite Button */}
              {showFavoriteButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 p-1 h-8 w-8 bg-white/80 hover:bg-white"
                  onClick={handleFavoriteClick}
                >
                  <Heart 
                    className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </Button>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {property.description}
                  </p>
                </div>
                <Badge className={`ml-2 ${getPropertyTypeColor(property.type)}`}>
                  {getPropertyTypeLabel(property.type)}
                </Badge>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms}</span>
                </div>
                {property.parking && (
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4" />
                    <span>{property.parking}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{formatArea(property.area)}</span>
                </div>
              </div>

              {/* Location and Price */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location.address}</span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatRelativeTime(property.createdAt)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-3">
                {showViewButton && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewClick}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={`cursor-pointer hover:shadow-lg transition-shadow duration-200 ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative h-48">
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg" />
          )}
          {!imageError ? (
            <img
              src={property.images?.[0] || '/placeholder-property.jpg'}
              alt={property.title}
              className="w-full h-full object-cover rounded-t-lg"
              onError={() => setImageError(true)}
              onLoad={() => setIsImageLoading(false)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 rounded-t-lg flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Badge */}
          <Badge className={`absolute top-2 left-2 ${getPropertyTypeColor(property.type)}`}>
            {getPropertyTypeLabel(property.type)}
          </Badge>

          {/* Favorite Button */}
          {showFavoriteButton && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 p-1 h-8 w-8 bg-white/80 hover:bg-white"
              onClick={handleFavoriteClick}
            >
              <Heart 
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
              />
            </Button>
          )}

          {/* View Count */}
          {property.views && property.views > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {property.views} views
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {property.title}
            </h3>
            <div className="text-lg font-bold text-gray-900">
              {formatPrice(property.price)}
            </div>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {property.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
            {property.parking && (
              <div className="flex items-center gap-1">
                <Car className="h-4 w-4" />
                <span>{property.parking}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{formatArea(property.area)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{property.location.address}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {formatRelativeTime(property.createdAt)}
            </span>
            {showViewButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewClick}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;