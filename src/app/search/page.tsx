'use client'

import { SearchPage } from '@/components/SearchPage'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'

export default function Search() {
  const { properties, favorites, toggleFavorite, setSelectedProperty } = useApp();
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      router.push(`/property/${id}`);
    }
  };

  return (
    <SearchPage
      properties={properties}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      onViewDetails={handleViewDetails}
    />
  );
}