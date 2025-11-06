'use client'

import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { PropertyDetailsEnhanced } from '@/components/PropertyDetailsEnhanced';

export default function SalePropertyPage() {
  const params = useParams();
  const router = useRouter();
  const { properties, favorites, toggleFavorite, setSelectedProperty } = useApp();
  
  const property = properties.find((p) => p.id === params.id);

  const handleToggleFavorite = (id: string) => {
    toggleFavorite(id);
  };

  const handleBackToSale = () => {
    router.push('/(sale)');
  };

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Property not found</h2>
          <button 
            onClick={handleBackToSale}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-blue-800 transition-colors"
          >
            Back to Sale Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <PropertyDetailsEnhanced
      property={property}
      isFavorite={favorites.includes(property.id)}
      onToggleFavorite={handleToggleFavorite}
      onClose={handleBackToSale}
    />
  );
}