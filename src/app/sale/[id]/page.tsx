'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getSalePropertyById } from '../shared/data';
import { salePropertyToProperty } from '../shared/mappers';
import { SaleProperty } from '../shared/types';
import { PropertyDetailsEnhanced } from '../shared/components/PropertyDetailsEnhanced';
import { Loader } from '@/components/ui/loader';

export default function SalePropertyPage() {
  const params = useParams();
  const router = useRouter();

  const [property, setProperty] = useState<SaleProperty | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProperty = async () => {
      if (!params.id || typeof params.id !== 'string') {
        setError('Invalid property ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getSalePropertyById(params.id);
        if (data) {
          setProperty(data);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        console.error('Error loading property:', err);
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [params.id]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleBackToSale = () => {
    router.push('/sale');
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Proprietatea nu a fost găsită'}
          </h2>
          <button
            onClick={handleBackToSale}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-blue-800 transition-colors"
          >
            Înapoi la proprietăți
          </button>
        </div>
      </div>
    );
  }

  return (
    <PropertyDetailsEnhanced
      property={salePropertyToProperty(property)}
      isFavorite={favorites.includes(property.id)}
      onToggleFavorite={handleToggleFavorite}
      onClose={handleBackToSale}
    />
  );
}