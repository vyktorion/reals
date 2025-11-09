'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { Search, SlidersHorizontal, List, Grid3x3, Map as MapIcon } from 'lucide-react';

const tabs = [
  { href: '/sale', label: 'De vânzare' },
  { href: '/rent', label: 'De închiriat' },
  { href: '/hotel', label: 'Regim hotelier' }
];

type TabsProps = {
  onSearchChange?: (value: string) => void;
  onToggleFilters?: () => void;
  onViewModeChange?: (mode: 'list' | 'grid' | 'map') => void;
  activeViewMode?: 'list' | 'grid' | 'map';
};

export function Tabs({ onSearchChange, onToggleFilters, onViewModeChange, activeViewMode = 'list' }: TabsProps) {
  const pathname = usePathname();

  return (
    <div className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Row: Search (stânga) + Tabs (mijloc) + Filtre/View (dreapta) */}
        <div className="flex items-center gap-3 py-3">
          {/* Left: Search */}
          <div className="w-full max-w-xs relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Caută după locație, tip proprietate..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-border bg-background text-foreground placeholder:text-muted-foreground rounded-full text-md outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Middle: Tabs centrate */}
          <div className="flex-1 flex justify-center">
            <div className="inline-flex items-center gap-2">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={[
                      'px-4 py-2 rounded-md text-sm font-medium transition-all',
                      'border',
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground'
                    ].join(' ')}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Filtre + List/Grid/Map icons (UI only) */}
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-card text-md text-foreground hover:bg-accent hover:text-foreground transition-colors"
              onClick={onToggleFilters}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline text">Filtre</span>
            </button>

            <div className="flex items-center gap-2 px-2 py-1 rounded-md border border-border bg-card">
              <button
                className={`p-1.5 rounded-md ${
                  activeViewMode === 'list'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
                aria-label="Listă"
                onClick={() => onViewModeChange?.('list')}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                className={`p-1.5 rounded-md ${
                  activeViewMode === 'grid'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
                aria-label="Grid"
                onClick={() => onViewModeChange?.('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                className={`p-1.5 rounded-md ${
                  activeViewMode === 'map'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
                aria-label="Hartă"
                onClick={() => onViewModeChange?.('map')}
              >
                <MapIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}