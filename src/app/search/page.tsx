'use client'

import { SearchPage } from '../../components/SearchPage'
import { useApp } from '../../contexts/AppContext'
import { useRouter } from 'next/navigation'

export default function Search() {
  const { properties, favorites, toggleFavorite, setSelectedProperty } = useApp();
  const router = useRouter();

  const handleViewDetails = (property: any) => {
    setSelectedProperty(property);
    router.push(`/property/${property.id}`);
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