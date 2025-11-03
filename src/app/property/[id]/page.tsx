'use client'

import { PropertyDetailsEnhanced } from '../../../components/PropertyDetailsEnhanced'
import { useApp } from '../../../contexts/AppContext'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Property } from '../../../types'

export default function PropertyDetails() {
  const { properties, favorites, toggleFavorite } = useApp();
  const router = useRouter();
  const params = useParams();
  const [property, setProperty] = useState<Property | null>(null);

  useEffect(() => {
    if (params.id) {
      const foundProperty = properties.find(p => p.id === params.id);
      setProperty(foundProperty || null);
    }
  }, [params.id, properties]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Property not found</div>
      </div>
    );
  }

  return (
    <PropertyDetailsEnhanced
      property={property}
      isFavorite={favorites.includes(property.id)}
      onToggleFavorite={() => toggleFavorite(property.id)}
      onClose={() => router.back()}
    />
  );
}