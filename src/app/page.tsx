'use client'

import { HomePage } from '@/components/HomePage'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { SaleProperty } from '@/app/sale/shared/types'
import { getSaleProperties } from '@/app/sale/shared/data'

export default function Home() {
  const router = useRouter();
  const [properties, setProperties] = useState<SaleProperty[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const data = await getSaleProperties();
        // Luăm doar primele 6 proprietăți pentru homepage
        setProperties(data.slice(0, 6));
      } catch (error) {
        console.error('Eroare la încărcarea proprietăților:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const handleViewDetails = (id: string) => {
    router.push(`/sale/${id}`);
  };

  const handleNavigateToSearch = () => {
    router.push('/sale');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Se încarcă proprietățile...</p>
        </div>
      </div>
    );
  }

  return (
    <HomePage
      properties={properties}
      favorites={favorites}
      onToggleFavorite={handleToggleFavorite}
      onViewDetails={handleViewDetails}
      onNavigateToSearch={handleNavigateToSearch}
    />
  );
}