'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchSaleById } from '@/domains/adds/services/sale.service';
import { PropertyDetails } from '@/domains/adds/ui/PropertyDetails';
import type { SaleProperty } from '@/domains/adds/model/types';

/**
 * SalePropertyPage (refactor domain-based)
 *
 * IMPORTANT:
 * - UI/UX rămâne echivalent cu versiunea existentă (loading, eroare, detalii).
 * - Folosește domeniul "adds" (fetchSaleById + PropertyDetails) în loc de shared/data direct.
 * - Rutele rămân /sale/[id] pentru compatibilitate.
 */

export default function SalePropertyPage() {
  const params = useParams();
  const router = useRouter();

  const [property, setProperty] = useState<SaleProperty | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const id = params?.id;
      if (!id || typeof id !== 'string') {
        setError('ID proprietate invalid');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchSaleById(id);
        if (!data) {
          setError('Proprietatea nu a fost găsită');
        } else {
          setProperty(data);
        }
      } catch (e) {
        console.error('Eroare la încărcarea proprietății:', e);
        setError('A apărut o eroare la încărcarea proprietății');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [params]);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };

  const handleBack = () => {
    // momentan rămânem pe /sale pentru compatibilitate;
    // ulterior putem schimba în /adds/sale sau folosim router.back()
    router.push('/sale');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Se încarcă proprietatea...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {error || 'Proprietatea nu a fost găsită'}
          </h2>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Înapoi la proprietăți
          </button>
        </div>
      </div>
    );
  }

  return (
    <PropertyDetails
      property={property}
      isFavorite={favorites.includes(property.id)}
      onToggleFavorite={handleToggleFavorite}
      onBack={handleBack}
    />
  );
}