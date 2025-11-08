'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SaleProperty } from '../model/types';
import { MapPin } from 'lucide-react';
import Image from 'next/image';

/**
 * PropertyDetails
 *
 * Versiune domain-based a UI-ului de detalii pentru proprietăți (pornind de la Sale).
 * IMPORTANT:
 * - Păstrăm UI/UX actual (stil modern, layout pe care îl ai acum).
 * - Primește un SaleProperty deja mapat (din domeniu).
 * - Nu știe de sursa de date (DB, API, legacy) -> doar afișare + acțiuni simple.
 * - Va fi folosit în /sale/[id] și ulterior /adds/sale/[id].
 */

export interface PropertyDetailsProps {
  property: SaleProperty;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onBack?: () => void;
}

export function PropertyDetails({ property, isFavorite, onToggleFavorite, onBack }: PropertyDetailsProps) {
  const router = useRouter();
  const [localFavorite, setLocalFavorite] = useState<boolean>(!!isFavorite);

  const handleFavoriteClick = () => {
    const next = !localFavorite;
    setLocalFavorite(next);
    if (onToggleFavorite) {
      onToggleFavorite(property.id);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="w-full border-b border-border bg-card/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:bg-accent transition"
          >
            Înapoi la rezultate
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent transition"
            >
              {localFavorite ? 'Elimină din favorite' : 'Adaugă la favorite'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-4 space-y-4">
        {/* Title & location */}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground line-clamp-2">
            {property.title}
          </h1>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">
              {property.location.city}
              {property.location.zone ? `, ${property.location.zone}` : ''}
              {property.location.address ? `, ${property.location.address}` : ''}
            </span>
          </div>
        </div>

        {/* Price & meta */}
        <div className="flex flex-wrap items-baseline gap-4">
          <div className="text-3xl font-semibold text-primary">
            {property.price.toLocaleString('ro-RO')} {property.currency}
          </div>
          {property.type && (
            <div className="px-2 py-1 rounded-full bg-secondary text-[11px] text-secondary-foreground">
              {property.type}
            </div>
          )}
          {property.status && (
            <div className="px-2 py-1 rounded-full bg-primary/10 text-[11px] text-primary">
              {property.status}
            </div>
          )}
        </div>

        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="relative col-span-2 aspect-video bg-muted rounded-2xl overflow-hidden">
            <Image
              src={property.images[0] || '/placeholder-property.jpg'}
              alt={property.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-rows-2 gap-2">
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
              <Image
                src={property.images[1] || property.images[0] || '/placeholder-property.jpg'}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden">
              <Image
                src={property.images[2] || property.images[0] || '/placeholder-property.jpg'}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
          {property.rooms !== undefined && (
            <div className="bg-card border border-border rounded-xl px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide">Camere</div>
              <div className="text-foreground font-medium">
                {property.rooms}
              </div>
            </div>
          )}
          {property.area !== undefined && (
            <div className="bg-card border border-border rounded-xl px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide">Suprafață</div>
              <div className="text-foreground font-medium">
                {property.area} mp
              </div>
            </div>
          )}
          {property.floor !== undefined && (
            <div className="bg-card border border-border rounded-xl px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide">Etaj</div>
              <div className="text-foreground font-medium">
                {property.floor}
                {property.totalFloors ? ` / ${property.totalFloors}` : ''}
              </div>
            </div>
          )}
          {property.yearBuilt !== undefined && (
            <div className="bg-card border border-border rounded-xl px-3 py-2">
              <div className="text-[10px] uppercase tracking-wide">An construcție</div>
              <div className="text-foreground font-medium">
                {property.yearBuilt}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        {property.description && (
          <div className="bg-card border border-border rounded-2xl p-4 text-sm text-muted-foreground leading-relaxed">
            {property.description}
          </div>
        )}
      </div>
    </div>
  );
}