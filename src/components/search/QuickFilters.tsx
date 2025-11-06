import { Home, Building2, TrendingUp, DollarSign } from 'lucide-react';

interface QuickFiltersProps {
  onFilterSelect: (filter: Record<string, unknown>) => void;
}

export function QuickFilters({ onFilterSelect }: QuickFiltersProps) {
  const quickFilters = [
    {
      id: 'luxury',
      name: 'Luxury Homes',
      icon: Home,
      gradient: 'from-amber-500 to-amber-600',
      filter: {
        priceRange: [1000000, 10000000],
        propertyType: ['Villa', 'Estate', 'Penthouse']
      }
    },
    {
      id: 'condos',
      name: 'Urban Condos',
      icon: Building2,
      gradient: 'from-blue-500 to-blue-600',
      filter: {
        priceRange: [400000, 1500000],
        propertyType: ['Condo', 'Apartment']
      }
    },
    {
      id: 'investment',
      name: 'Investment',
      icon: TrendingUp,
      gradient: 'from-green-500 to-green-600',
      filter: {
        priceRange: [300000, 800000],
        status: ['For Sale']
      }
    },
    {
      id: 'affordable',
      name: 'Under $500K',
      icon: DollarSign,
      gradient: 'from-purple-500 to-purple-600',
      filter: {
        priceRange: [0, 500000],
        status: ['For Sale']
      }
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {quickFilters.map((filter) => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.id}
            onClick={() => onFilterSelect(filter.filter)}
            className={`relative overflow-hidden rounded-2xl p-6 bg-linear-to-br ${filter.gradient} dark:from-opacity-80 dark:to-opacity-80 text-primary-foreground shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-all duration-300 hover:scale-105 active:scale-95 group`}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '24px 24px'
              }} />
            </div>

            {/* Content */}
            <div className="relative">
              <div className="w-12 h-12 bg-card/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-sm opacity-90">{filter.name}</div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        );
      })}
    </div>
  );
}
