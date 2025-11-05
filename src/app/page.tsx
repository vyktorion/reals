'use client'

import { HomePage } from '@/components/HomePage'
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { properties, favorites, toggleFavorite, setSelectedProperty } = useApp();
  const router = useRouter();

  const handleViewDetails = (id: string) => {
    const property = properties.find(p => p.id === id);
    if (property) {
      setSelectedProperty(property);
      router.push(`/property/${id}`);
    }
  };

  const handleNavigateToSearch = () => {
    router.push('/search');
  };

  return (
    <HomePage
      properties={properties}
      favorites={favorites}
      onToggleFavorite={toggleFavorite}
      onViewDetails={handleViewDetails}
      onNavigateToSearch={handleNavigateToSearch}
    />
  );
}