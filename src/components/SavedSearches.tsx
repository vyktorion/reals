import { Search, Bell, BellOff, Trash2, ChevronRight, MapPin, DollarSign, Home } from 'lucide-react';
import { SavedSearch } from '../types';
import { toast } from 'sonner';

interface SavedSearchesProps {
  onNavigateToSearch: (filters?: any) => void;
}

export function SavedSearches({ onNavigateToSearch }: SavedSearchesProps) {
  const savedSearches: SavedSearch[] = [
    {
      id: '1',
      name: 'Downtown Condos',
      filters: {
        priceRange: [500000, 1000000],
        propertyType: ['Condo', 'Apartment'],
        status: ['For Sale'],
        bedrooms: 2,
        bathrooms: null,
        minArea: null,
        maxArea: null
      },
      location: 'Downtown LA',
      createdAt: '2024-10-15',
      alertsEnabled: true,
      newListings: 3
    },
    {
      id: '2',
      name: 'Family Homes in Suburbs',
      filters: {
        priceRange: [700000, 1200000],
        propertyType: ['House'],
        status: ['For Sale'],
        bedrooms: 4,
        bathrooms: 3,
        minArea: 2500,
        maxArea: null
      },
      location: 'Austin, TX',
      createdAt: '2024-10-10',
      alertsEnabled: true,
      newListings: 5
    },
    {
      id: '3',
      name: 'Luxury Penthouses',
      filters: {
        priceRange: [2000000, 5000000],
        propertyType: ['Penthouse'],
        status: ['For Sale'],
        bedrooms: 3,
        bathrooms: null,
        minArea: 3000,
        maxArea: null
      },
      location: 'Manhattan, NY',
      createdAt: '2024-09-28',
      alertsEnabled: false,
      newListings: 1
    }
  ];

  const handleToggleAlerts = (id: string, currentState: boolean) => {
    toast.success(currentState ? 'Alerts disabled' : 'Alerts enabled');
  };

  const handleDeleteSearch = (id: string) => {
    toast.success('Saved search deleted');
  };

  const handleApplySearch = (search: SavedSearch) => {
    onNavigateToSearch(search.filters);
    toast.success(`Applied "${search.name}" search`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Saved Searches</h1>
          <p className="text-gray-600">
            Manage your saved searches and get alerts for new listings
          </p>
        </div>

        {/* Searches List */}
        <div className="space-y-4">
          {savedSearches.map((search, index) => (
            <div
              key={search.id}
              className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-gray-900">{search.name}</h3>
                      {search.newListings > 0 && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                          {search.newListings} new
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span>{search.location}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Created {new Date(search.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleAlerts(search.id, search.alertsEnabled)}
                      className={`p-2 rounded-lg transition-colors ${
                        search.alertsEnabled
                          ? 'bg-blue-100 text-blue-900 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title={search.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                    >
                      {search.alertsEnabled ? (
                        <Bell className="w-4 h-4" />
                      ) : (
                        <BellOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteSearch(search.id)}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Delete search"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Criteria Summary */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {search.filters.propertyType.map((type, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg flex items-center gap-1">
                      <Home className="w-3 h-3" />
                      {type}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    ${(search.filters.priceRange[0] / 1000)}K - ${(search.filters.priceRange[1] / 1000000).toFixed(1)}M
                  </span>
                  {search.filters.bedrooms && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                      {search.filters.bedrooms}+ beds
                    </span>
                  )}
                  {search.filters.minArea && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
                      {search.filters.minArea}+ sqft
                    </span>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => handleApplySearch(search)}
                  className="w-full px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>View {search.newListings > 0 ? `${search.newListings} New ` : ''}Properties</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {savedSearches.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No saved searches</h3>
            <p className="text-gray-600 mb-6">
              Save your searches to get alerts when new properties match your criteria
            </p>
            <button
              onClick={() => onNavigateToSearch()}
              className="px-6 py-3 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors"
            >
              Start Searching
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
