'use client'

import { PropertyDetailsEnhanced } from '@/components/PropertyDetailsEnhanced'
import { useApp } from '@/contexts/AppContext'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Property } from '@/entities/property'
import { Search, SlidersHorizontal, List, Grid3x3, Map as MapIcon, ArrowLeft, Share2, Heart } from 'lucide-react'

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
    <div className="min-h-screen bg-background">
      {/* Header with Back and Actions */}
      <div className="bg-card border-b border-border sticky top-20 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-foreground hover:bg-accent rounded-xl transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: property.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 border border-border bg-card text-card-foreground hover:bg-accent rounded-xl transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>

              <button
                onClick={() => toggleFavorite(property.id)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all duration-200 ${
                  favorites.includes(property.id)
                    ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    : 'bg-card border-border text-card-foreground hover:bg-accent'
                }`}
              >
                <Heart className={`w-5 h-5 ${favorites.includes(property.id) ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">
                  {favorites.includes(property.id) ? 'Saved' : 'Save'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <PropertyDetailsEnhanced
        property={property}
        isFavorite={favorites.includes(property.id)}
        onToggleFavorite={() => toggleFavorite(property.id)}
        onClose={() => router.back()}
      />
    </div>
  );
}