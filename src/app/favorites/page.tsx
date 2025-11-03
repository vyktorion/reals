'use client'

import { FavoritesPage } from '../../components/FavoritesPage'
import { useApp } from '../../contexts/AppContext'
import { useRouter } from 'next/navigation'

export default function Favorites() {
  const { properties, favorites, toggleFavorite, setSelectedProperty } = useApp();
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      router.push(`/property/${id}`);
    }
  };

  const handleClearAll = () => {
    favorites.forEach(id => toggleFavorite(id));
  };

  return (
    <FavoritesPage
      properties={properties}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      onViewDetails={handleViewDetails}
      onClearAll={handleClearAll}
    />
  );
}