'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Map as MapIcon, MapPin, Bed, Maximize } from 'lucide-react';
import { SaleProperty, SaleFilters, ViewMode } from '../shared/types';
import { formatPrice, formatStatus } from '../shared/utils';
import { PROPERTY_TYPES, STATUS_OPTIONS, DEFAULT_FILTERS } from '../shared/constants';
import { getSaleProperties } from '../shared/data';

type SaleDesktopProps = {
  searchQuery?: string;
  showFilters?: boolean;
  viewMode?: ViewMode;
};

export function SaleDesktop(props: SaleDesktopProps) {
  // state intern păstrat doar pentru fallback, dar nu folosește settere neutilizate
  const [searchQuery] = useState(props.searchQuery ?? '');
  const [showFilters] = useState(props.showFilters ?? false);
  const [viewMode] = useState<ViewMode>(props.viewMode ?? 'list');
  const [properties, setProperties] = useState<SaleProperty[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<SaleFilters>(DEFAULT_FILTERS);

  // Încarcă proprietățile la montare
  useEffect(() => {
    const loadProperties = async () => {
      try {
        setLoading(true);
        const data = await getSaleProperties();
        setProperties(data);
      } catch (error) {
        console.error('Eroare la încărcarea proprietăților:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, []);

  // Filtrare proprietăți
  const effectiveSearchQuery = props.searchQuery ?? searchQuery;
  const effectiveShowFilters = props.showFilters ?? showFilters;
  const effectiveViewMode = props.viewMode ?? viewMode;

  const filteredProperties = properties.filter((property) => {
    const matchesQuery = effectiveSearchQuery === '' ||
      property.title.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      property.location.city.toLowerCase().includes(effectiveSearchQuery.toLowerCase()) ||
      property.location.address.toLowerCase().includes(effectiveSearchQuery.toLowerCase());

    const matchesPrice = property.price >= filters.priceRange[0] && property.price <= filters.priceRange[1];
    const matchesType = filters.propertyType.length === 0 || filters.propertyType.includes(property.type);
    const matchesStatus = filters.status.length === 0 || filters.status.includes(property.status);
    const matchesBedrooms = filters.bedrooms === null || property.rooms === filters.bedrooms;
    const matchesBathrooms = filters.bathrooms === null || property.bathrooms === filters.bathrooms;
    const matchesArea = (filters.minArea === null || property.area >= filters.minArea) &&
                       (filters.maxArea === null || property.area <= filters.maxArea);

    return matchesQuery && matchesPrice && matchesType && matchesStatus &&
           matchesBedrooms && matchesBathrooms && matchesArea;
  });

  const togglePropertyType = (type: string) => {
    setFilters(prev => ({
      ...prev,
      propertyType: prev.propertyType.includes(type)
        ? prev.propertyType.filter((t) => t !== type)
        : [...prev.propertyType, type],
    }));
  };

  const toggleStatus = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleToggleFavorite = (propertyId: string) => {
    setFavorites(prev =>
      prev.includes(propertyId)
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const _activeFilterCount =
    filters.propertyType.length +
    filters.status.length +
    (filters.bedrooms !== null ? 1 : 0) +
    (filters.bathrooms !== null ? 1 : 0) +
    (filters.minArea !== null ? 1 : 0) +
    (filters.maxArea !== null ? 1 : 0);

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
    <div className="min-h-screen bg-background">
      
      {/*
        HEADER ORIGINAL MUTAT ÎN TABS (NU ȘTERS, DOAR COMENTAT PENTRU REFERINȚĂ)

      <div className="bg-card border-b border-border sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Caută după locație, tip proprietate..."
                className="w-full pl-12 pr-4 py-3 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2">

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`relative px-4 py-3 border rounded-xl transition-all duration-200 flex items-center gap-2 ${
                  showFilters
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-card-foreground border-border hover:bg-accent'
                }`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filtre</span>
                {activeFilterCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <div className="flex gap-1 border border-border rounded-xl p-1 bg-card">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                  }`}
                  aria-label="Vizualizare listă"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'
                  }`}
                  aria-label="Vizualizare grilă"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  disabled
                  className="p-2 rounded-lg transition-all text-muted-foreground/50 cursor-not-allowed"
                  aria-label="Vizualizare hartă (în curând)"
                  title="Vizualizare hartă în curând"
                >
                  <MapIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'proprietate găsită' : 'proprietăți găsite'}
          </div>
        </div>
      </div>
      */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="py-3 px-4 text-sm text-muted-foreground">
            {filteredProperties.length} {filteredProperties.length === 1 ? 'proprietate găsită' : 'proprietăți găsite'}
          </div>
        <div className="flex gap-6">
          {/* Sidebar cu filtre */}
          {effectiveShowFilters && (
            <div className="w-full sm:w-80 shrink-0">
              <div className="bg-card rounded-2xl shadow-md p-6 sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-foreground">Filtre</h3>
                  <button
                    onClick={resetFilters}
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Resetează
                  </button>
                </div>

                {/* Tip proprietate */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Tip proprietate</label>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_TYPES.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => togglePropertyType(type.value)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                          filters.propertyType.includes(type.value)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Status</label>
                  <div className="flex gap-2">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => toggleStatus(status.value)}
                        className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-all ${
                          filters.status.includes(status.value)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preț */}
                <div className="mb-6">
                  <label className="block text-sm text-foreground mb-3">Preț (RON)</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange[0] || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [Number(e.target.value) || 0, prev.priceRange[1]]
                        }))}
                        className="w-full px-3 py-2 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange[1] || ''}
                        onChange={(e) => setFilters(prev => ({
                          ...prev,
                          priceRange: [prev.priceRange[0], Number(e.target.value) || 10000000]
                        }))}
                        className="w-full px-3 py-2 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-lg outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rezultate */}
          <div className="flex-1 min-w-0">
            {effectiveViewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => {
                  console.log('🎯 Rendering property:', property.id, property.title, 'Location:', property.location);
                  return (
                  <div key={property.id} className="bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-border hover:border-blue-200/50 dark:hover:border-blue-500/20 hover:-translate-y-1">
                    <div className="relative aspect-video overflow-hidden bg-gray-50 dark:bg-gray-800">
                      <Image
                        src={property.images[0] || '/placeholder-property.jpg'}
                        alt={property.title}
                        width={400}
                        height={350}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 text-xs rounded-full text-primary-foreground ${
                          property.status === 'active' ? 'bg-green-500/90' : 'bg-red-500/90'
                        }`}>
                          {formatStatus(property.status)}
                        </span>
                      </div>
                      <button
                        onClick={() => handleToggleFavorite(property.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-all"
                        title={favorites.includes(property.id) ? 'Elimină din favorite' : 'Adaugă la favorite'}
                      >
                        <svg className={`w-4 h-4 ${favorites.includes(property.id) ? 'text-red-500 fill-red-500' : 'text-muted-foreground'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </button>
                      <Link
                        href={`/sale/${property.id}`}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/90 dark:bg-gray-800/90 rounded-full text-sm font-medium text-gray-900 dark:text-white opacity-0 hover:opacity-100 transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 flex items-center gap-2 shadow-md hover:shadow-lg"
                        title="Vezi detalii"
                      >
                        Vezi detalii
                      </Link>
                    </div>
                    <div className="p-6">
                      <div className="flex items-baseline justify-between mb-3">
                        <div className="text-2xl font-serif text-blue-900 dark:text-blue-100">
                          {formatPrice(property.price, property.currency)}
                        </div>
                        <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                          {property.type}
                        </div>
                      </div>
                      <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                        <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                        <span className="line-clamp-1">{property.location.city}, {property.location.county}{property.location.zone ? `, ${property.location.zone}` : ''}</span>
                      </div>
                      <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="text-center"> 
                          <div className="text-sm text-gray-700 dark:text-gray-300">• {property.rooms} camere</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-700 dark:text-gray-300">• {property.area} mp</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-700 dark:text-gray-300">• {property.floor && property.totalFloors ? `Etaj ${property.floor}/${property.totalFloors}` : 'Etaj N/A'}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-700 dark:text-gray-300">• {property.yearBuilt}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : effectiveViewMode === 'list' ? (
              <div className="space-y-4">
                {filteredProperties.map((property) => (
                  <div key={property.id} className="bg-card rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-border">
                    <div className="flex flex-col sm:flex-row">
                      {/* Imagine */}
                      <div className="relative sm:w-80 aspect-video shrink-0">
                        <Link href={`/sale/${property.id}`}>
                          <Image
                            src={property.images[0] || '/placeholder-property.jpg'}
                            alt={property.title}
                            width={320}
                            height={160}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        </Link>
                        <div className="absolute top-3 left-3">
                          <span className={`px-3 py-1 text-xs rounded-full text-primary-foreground ${
                            property.status === 'active'
                              ? 'bg-green-500/90 dark:bg-green-600/90'
                              : 'bg-red-500/90 dark:bg-red-600/90'
                          }`}>
                            {formatStatus(property.status)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleToggleFavorite(property.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card transition-all"
                          aria-label={favorites.includes(property.id) ? 'Elimină din favorite' : 'Adaugă la favorite'}
                        >
                          <svg
                            className={`w-4 h-4 ${
                              favorites.includes(property.id)
                                ? 'text-red-500 fill-red-500'
                                : 'text-muted-foreground'
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                        </button>
                      </div>

                      {/* Conținut */}
                      <div className="flex-1 px-6 py-3">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-serif text-gray-900 dark:text-white mb-2 line-clamp-1">
                              {property.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                              <MapPin className="w-4 h-4 shrink-0 text-gray-400" />
                              <span className="line-clamp-1">{property.location.city}, {property.location.county}{property.location.zone ? `, ${property.location.zone}` : ''}</span>
                            </div>
                          </div>
                          <div className="text-right ml-4 shrink-0">
                            <div className="text-2xl font-serif text-blue-900 dark:text-blue-100">
                              {formatPrice(property.price, property.currency)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Bed className="w-4 h-4 text-gray-400" />
                              <span>{property.rooms} camere</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Maximize className="w-4 h-4 text-gray-400" />
                              <span>{property.area} mp</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              <span>{property.floor && property.totalFloors ? `Etaj ${property.floor}/${property.totalFloors}` : 'Etaj N/A'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{property.yearBuilt}</span>
                            </div>
                          </div>

                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {property.description}
                        </p>

                        <div className="flex justify-between items-center">
                           <Link
                             href={`/sale/${property.id}`}
                             className="px-4 py-1 bg-primary/80 text-primary-foreground rounded-lg hover:bg-primary transition-colors"
                           >
                             Vezi detalii
                           </Link>
                           <div className="text-xs text-muted-foreground">
                             24 octombrie
                           </div>
                         </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <MapIcon className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground mb-2">Vizualizare hartă</h3>
                  <p className="text-muted-foreground">Această funcționalitate va fi disponibilă în curând.</p>
                </div>
              </div>
            )}

            {filteredProperties.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-foreground mb-2">Nu s-au găsit proprietăți</h3>
                <p className="text-muted-foreground mb-6">Încearcă să ajustezi căutarea sau filtrele</p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Resetează filtrele
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

