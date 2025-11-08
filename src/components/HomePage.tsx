import { Search, MapPin, Home as HomeIcon, Building2, TrendingUp, Star } from 'lucide-react';
import { useState } from 'react';
import { PropertyCard } from './property/PropertyCard';
import { QuickFilters } from './QuickFilters';
import Image from 'next/image';
import { SaleProperty } from '@/app/sale/shared/types';
// Remove unused import
// import { ImageIcon } from 'lucide-react';

interface HomePageProps {
  properties: SaleProperty[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
  onNavigateToSearch: () => void;
}

export function HomePage({ 
  properties, 
  favorites: _favorites, 
  onToggleFavorite: _onToggleFavorite, 
  onViewDetails: _onViewDetails,
  onNavigateToSearch 
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredProperties = properties.filter(p => p.status === 'active').slice(0, 3);
  const recentProperties = properties.slice(0, 6);

  const stats = [
    { icon: HomeIcon, label: 'Properties', value: '1,200+', color: 'bg-blue-100 text-blue-900' },
    { icon: Building2, label: 'Cities', value: '50+', color: 'bg-purple-100 text-purple-900' },
    { icon: TrendingUp, label: 'Sold', value: '$2.5B+', color: 'bg-green-100 text-green-900' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToSearch();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 dark:from-blue-950 dark:via-blue-900 dark:to-gray-900 text-primary-foreground overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-pattern" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Find Your Dream Home
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Discover premium properties in the most sought-after locations
            </p>

            {/* Search Bar */}
            <form 
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-blue-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                <div className="relative flex items-center bg-card rounded-2xl shadow-2xl overflow-hidden">
                  <MapPin className="w-5 h-5 text-gray-400 dark:text-gray-500 ml-5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter location, property type, or keyword..."
                    className="flex-1 px-4 py-4 sm:py-5 text-foreground dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 outline-none"
                  />
                  <button
                    type="submit"
                    className="m-1.5 sm:m-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-blue-900 hover:bg-blue-800 text-primary-foreground rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <Search className="w-5 h-5" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 80L60 70C120 60 240 40 360 35C480 30 600 40 720 45C840 50 960 50 1080 45C1200 40 1320 30 1380 25L1440 20V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-16">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 hover:-translate-y-1 animate-delay-${index}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-foreground">{stat.value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Filters */}
        <div className="mb-8">
          <h2 className="text-foreground mb-6 text-center">Quick Search</h2>
          <QuickFilters onFilterSelect={onNavigateToSearch} />
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-foreground mb-2">Featured Properties</h2>
            <p className="text-muted-foreground">Handpicked premium listings</p>
          </div>
          <button 
            onClick={onNavigateToSearch}
            className="text-primary hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            View All
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-foreground mb-2">Recent Listings</h2>
          <p className="text-muted-foreground">Latest additions to our portfolio</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-foreground mb-2">What Our Clients Say</h2>
          <p className="text-muted-foreground">Trusted by thousands of happy homeowners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Jennifer Thompson',
              role: 'Homeowner',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
              text: 'LuxeEstate made finding my dream home effortless. The platform is intuitive and the agents are incredibly professional.',
              rating: 5
            },
            {
              name: 'Robert Anderson',
              role: 'Investor',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
              text: 'Best real estate platform I\'ve used. The property details are comprehensive and the search filters are powerful.',
              rating: 5
            },
            {
              name: 'Maria Garcia',
              role: 'First-time Buyer',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
              text: 'The team guided me through every step. Found the perfect condo in just two weeks!',
              rating: 5
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              className={`bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500 animate-delay-${index}`}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-br from-blue-900 to-blue-800 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl text-primary-foreground mb-4">Ready to Find Your Perfect Home?</h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of satisfied clients who found their dream properties with us
            </p>
            <button 
              onClick={onNavigateToSearch}
              className="px-8 py-4 bg-card text-primary rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
            >
              Start Your Search
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
