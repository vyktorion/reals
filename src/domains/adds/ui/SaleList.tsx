'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, List, Grid3x3, Map as MapIcon, SlidersHorizontal } from 'lucide-react';
import { fetchSaleList } from '../services/sale.service';
import type { SaleProperty } from '../model/types';

type ViewMode = 'list' | 'grid';

export function SaleList() {
  const [properties, setProperties] = useState<SaleProperty[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchSaleList();
        setProperties(data);
      } catch (e) {
        console.error('Eroare la încărcarea proprietăților de vânzare', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const filtered = properties.filter((property) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      property.title.toLowerCase().includes(q) ||
      property.location.city.toLowerCase().includes(q) ||
      (property.location.address?.toLowerCase().includes(q) ?? false)
    );
  });

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Se încarcă proprietățile de vânzare...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header sticky, max-w-6xl, aliniat cu SaleDesktop */}
      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Caută după locație, tip proprietate..."
                className="w-full pl-3 pr-3 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
            </div>

            {/* Filtre + view mode */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative px-4 py-3 border rounded-xl transition-all duration-200 flex items-center gap-2 text-xs md:text-sm ${
                  showFilters
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-card-foreground border-border hover:bg-accent'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filtre</span>
              </button>

              <div className="flex gap-1 border border-border rounded-xl p-1 bg-card">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                  aria-label="Vizualizare listă"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent'
                  }`}
                  aria-label="Vizualizare grilă"
                >
                  <Grid3x3 className="w-4 h-4" />
                </button>
                <button
                  disabled
                  className="p-2 rounded-lg text-muted-foreground/40 cursor-not-allowed"
                  aria-label="Vizualizare hartă în curând"
                  title="Vizualizare hartă în curând"
                >
                  <MapIcon className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            {filtered.length}{' '}
            {filtered.length === 1 ? 'proprietate găsită' : 'proprietăți găsite'}
          </div>

          {showFilters && (
            <div className="mt-3 pt-3 border-t border-border text-xs text-muted-foreground">
              {/* TODO: Integrează filtrele reale din SaleDesktop (PROPERTY_TYPES, STATUS_OPTIONS, etc.) */}
              Filtre avansate Sale (în lucru) - vor replica exact comportamentul /sale desktop.
            </div>
          )}
        </div>
      </div>

      {/* Content container aliniat la max-w-6xl */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
              <MapPin className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">
              Nu s-au găsit proprietăți
            </p>
            <p className="text-muted-foreground text-sm">
              Încearcă să ajustezi căutarea sau filtrele.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          // GRID VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((property) => (
              <div
                key={property.id}
                className="bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border hover:border-blue-200/50 dark:hover:border-blue-500/20 hover:-translate-y-1"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <Image
                    src={property.images[0] || '/placeholder-property.jpg'}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  {/* Status + favorite pe imagine (stil soft pe bg-card) */}
                  <div className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-card/90 text-foreground shadow-sm">
                    {property.status || 'Activ'}
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(property.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition"
                    aria-label={
                      favorites.includes(property.id)
                        ? 'Elimină din favorite'
                        : 'Adaugă la favorite'
                    }
                  >
                    <span
                      className={
                        favorites.includes(property.id)
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                      }
                    >
                      ♥
                    </span>
                  </button>
                </div>
                <div className="p-4 space-y-1.5">
                  {/* Preț + tip (ca în list view) */}
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-2xl font-serif text-blue-900 dark:text-blue-100">
                      {property.price.toLocaleString('ro-RO')} {property.currency}
                    </div>
                    <div className="text-xs text-gray-500">
                      {property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString('ro-RO', {
                            day: '2-digit',
                            month: 'short'
                          })
                        : ''}
                    </div>
                  </div>
                  {/* Titlu - ca la list */}
                  <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {property.title}
                  </h3>
                  {/* Locație completă - ca la list */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                    <span className="line-clamp-1">
                      {property.location.city}
                      {property.location.county ? `, ${property.location.county}` : ''}
                      {property.location.zone ? `, ${property.location.zone}` : ''}
                    </span>
                  </div>
                  {/* Meta: camere / mp / etaj / an - centrat pe card */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800 text-sm text-muted-foreground flex flex-wrap justify-center gap-3 text-center">
                    {property.rooms !== undefined && (
                      <span>• {property.rooms} camere</span>
                    )}
                    {property.area !== undefined && (
                      <span>• {property.area} mp</span>
                    )}
                    <span>
                      • {property.floor && property.totalFloors
                        ? `Etaj ${property.floor}/${property.totalFloors}`
                        : 'Etaj N/A'}
                    </span>
                    {property.yearBuilt !== undefined && (
                      <span>• {property.yearBuilt}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // LIST VIEW - similar cu SaleDesktop (imagine mare stânga, text mare, meta + dată)
          <div className="space-y-4">
            {filtered.map((property) => (
              <div
                key={property.id}
                className="bg-card rounded-2xl border border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col sm:flex-row"
              >
                {/* Imagine */}
                <div className="relative w-full sm:w-80 aspect-video bg-muted shrink-0">
                  <Link href={`/sale/${property.id}`}>
                    <Image
                      src={property.images[0] || '/placeholder-property.jpg'}
                      alt={property.title}
                      fill
                      className="object-cover cursor-pointer"
                    />
                  </Link>
                  <div className="absolute top-3 left-3 px-3 py-1 text-xs rounded-full bg-card/90 text-foreground shadow-sm">
                    {property.status || 'Activ'}
                  </div>
                  <button
                    onClick={() => handleToggleFavorite(property.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition"
                    aria-label={
                      favorites.includes(property.id)
                        ? 'Elimină din favorite'
                        : 'Adaugă la favorite'
                    }
                  >
                    <span
                      className={
                        favorites.includes(property.id)
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                      }
                    >
                      ♥
                    </span>
                  </button>
                </div>

                {/* Conținut */}
                <div className="flex-1 px-6 py-3 flex flex-col gap-2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Titlu */}
                      <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      {/* Locație */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-2">
                        <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                        <span className="line-clamp-1">
                          {property.location.city}
                          {property.location.county
                            ? `, ${property.location.county}`
                            : ''}
                          {property.location.zone
                            ? `, ${property.location.zone}`
                            : ''}
                        </span>
                      </div>
                    </div>
                    {/* Preț */}
                    <div className="text-right shrink-0">
                      <div className="text-2xl font-serif text-blue-900 dark:text-blue-100">
                        {property.price.toLocaleString('ro-RO')} {property.currency}
                      </div>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap items-center gap-4 mb-2 text-sm text-muted-foreground">
                    {property.rooms !== undefined && (
                      <span>• {property.rooms} camere</span>
                    )}
                    {property.area !== undefined && (
                      <span>• {property.area} mp</span>
                    )}
                    <span>
                      • {property.floor && property.totalFloors
                        ? `Etaj ${property.floor}/${property.totalFloors}`
                        : 'Etaj N/A'}
                    </span>
                    {property.yearBuilt !== undefined && (
                      <span>• {property.yearBuilt}</span>
                    )}
                  </div>

                  {/* Descriere + dată + buton detalii */}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                    {property.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      href={`/sale/${property.id}`}
                      className="px-4 py-1.5 bg-primary/80 text-primary-foreground rounded-lg hover:bg-primary transition-colors text-xs"
                    >
                      Vezi detalii
                    </Link>
                    <div className="text-xs text-muted-foreground">
                      {property.createdAt
                        ? new Date(property.createdAt).toLocaleDateString('ro-RO', {
                            day: '2-digit',
                            month: 'long'
                          })
                        : ''}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}