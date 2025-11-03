'use client'

import { SavedSearches } from '../../components/SavedSearches'
import { useRouter } from 'next/navigation'

export default function SavedSearchesPage() {
  const router = useRouter();

  const handleNavigateToSearch = (filters?: any) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.set(key, filters[key]);
        }
      });
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <SavedSearches onNavigateToSearch={handleNavigateToSearch} />
  );
}