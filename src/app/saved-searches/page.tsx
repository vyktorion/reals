'use client'

import { SavedSearches } from '../../features/user-profile/components/SavedSearches'
import { useRouter } from 'next/navigation'
import { FilterOptions } from '../../types'

export default function SavedSearchesPage() {
  const router = useRouter();

  const handleNavigateToSearch = (filters?: FilterOptions) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key as keyof FilterOptions]) {
          params.set(key, filters[key as keyof FilterOptions]?.toString() || '');
        }
      });
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <SavedSearches onNavigateToSearch={handleNavigateToSearch} />
  );
}