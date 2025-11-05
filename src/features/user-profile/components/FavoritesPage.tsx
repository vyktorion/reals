import { Heart, Trash2 } from 'lucide-react';
import { Property } from '@/entities/property';
import { PropertyCard } from '@/features/property-listing/components/PropertyCard';

interface FavoritesPageProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
  onClearAll: () => void;
}

export function FavoritesPage({ 
  properties, 
  favorites, 
  onToggleFavorite, 
  onViewDetails,
  onClearAll 
}: FavoritesPageProps) {
  const favoriteProperties = properties.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-foreground mb-2">My Favorites</h1>
            <p className="text-muted-foreground">
              {favoriteProperties.length} {favoriteProperties.length === 1 ? 'property' : 'properties'} saved
            </p>
          </div>
          
          {favoriteProperties.length > 0 && (
            <button
              onClick={onClearAll}
              className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear All</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {favoriteProperties.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-linear-to-br from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in-50 duration-500">
              <Heart className="w-12 h-12 text-red-500 dark:text-red-400" />
            </div>
            <h2 className="text-foreground mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              No favorites yet
            </h2>
            <p className="text-muted-foreground mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              Start exploring properties and save your favorites here
            </p>
          </div>
        )}

        {/* Favorites Grid */}
        {favoriteProperties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property, index) => (
              <div 
                key={property.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PropertyCard
                  property={property}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onViewDetails={onViewDetails}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
