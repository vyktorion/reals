'use client';

import { useState } from 'react';
import { Tabs } from '@/components/navigation/Tabs';
import { SaleDesktop } from './desktop/SaleDesktop';

export default function SalePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'map'>('list');

  return (
    <div className="min-h-screen bg-background">
      <Tabs
        onSearchChange={setSearchQuery}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        onViewModeChange={setViewMode}
        activeViewMode={viewMode}
      />
      <SaleDesktop
        searchQuery={searchQuery}
        showFilters={showFilters}
        viewMode={viewMode}
      />
    </div>
  );
}
