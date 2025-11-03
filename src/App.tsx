import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { MobileNavigation } from './components/MobileNavigation';
import { FloatingActionButton } from './components/FloatingActionButton';
import { Onboarding } from './components/Onboarding';
import { HomePage } from './components/HomePage';
import { SearchPage } from './components/SearchPage';
import { PropertyDetailsEnhanced } from './components/PropertyDetailsEnhanced';
import { FavoritesPage } from './components/FavoritesPage';
import { ProfilePage } from './components/ProfilePage';
import { SavedSearches } from './components/SavedSearches';
import { NotificationsCenter } from './components/NotificationsCenter';
import { PostProperty } from './components/PostProperty';
import { EditProperty } from './components/EditProperty';
import { AuthPage } from './components/AuthPage';
import { properties } from './data/properties';
import { toast } from 'sonner';
import { Property } from './types';

type View = 'home' | 'search' | 'favorites' | 'profile' | 'saved-searches' | 'notifications' | 'post' | 'edit' | 'auth';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has seen onboarding
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
    setIsLoading(false);
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const handleCompleteOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasSeenOnboarding', 'true');
    }
    setShowOnboarding(false);
    toast.success('Welcome to LuxeEstate! 🏡', {
      description: 'Start exploring premium properties now'
    });
  };

  const handleSignInClick = () => {
    setShowAuthPage(true);
  };

  const handleAuthSuccess = () => {
    setShowAuthPage(false);
    toast.success('Welcome to LuxeEstate! 🎉', {
      description: 'You are now signed in and ready to explore'
    });
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.includes(id);
      if (isCurrentlyFavorite) {
        toast.success('Removed from favorites', {
          description: 'Property removed from your saved list'
        });
        return prev.filter(fav => fav !== id);
      } else {
        toast.success('Added to favorites', {
          description: 'Property saved to your list'
        });
        return [...prev, id];
      }
    });
  };

  const handleClearAllFavorites = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to remove all favorites?')) {
      setFavorites([]);
      toast.success('All favorites cleared');
    }
  };

  const handleViewDetails = (id: string) => {
    setSelectedPropertyId(id);
    // Update view count (in real app, this would be an API call)
    toast('Property views updated', { duration: 1000 });
  };

  const handleCloseDetails = () => {
    setSelectedPropertyId(null);
  };

  const handleNavigateToSearch = () => {
    setCurrentView('search');
    // In a real app, you would apply the filters here
  };

  const handlePostProperty = () => {
    // Mock - in real app would add to properties array and persist
    toast.success('Property posted successfully!', {
      description: 'Your property is now live on LuxeEstate.'
    });
  };

  const handlePropertyUpdated = () => {
    // Mock - in real app would update properties array and persist
    toast.success('Property updated successfully!');
    setEditingProperty(null);
    setCurrentView('profile');
  };  const selectedProperty = properties.find(p => p.id === selectedPropertyId);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-linear-to-br from-blue-950 via-blue-900 to-blue-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          {/* Logo Animation */}
          <div className="mb-8 animate-in zoom-in-50 duration-700">
            <div className="w-24 h-24 bg-white/20 dark:bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center shadow-2xl mx-auto">
              <Home className="w-12 h-12 text-white" />
            </div>
          </div>
          
          {/* Brand Name */}
          <h1 className="text-4xl text-white mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            LuxeEstate
          </h1>
          <p className="text-blue-200 dark:text-gray-300 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Premium Properties
          </p>
          
          {/* Loading Indicator */}
          <div className="w-48 h-1 bg-white/20 dark:bg-white/10 rounded-full mx-auto overflow-hidden animate-in fade-in duration-700 delay-300">
            <div className="h-full bg-white rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (showAuthPage) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  if (showOnboarding) {
    return <Onboarding onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Desktop/Tablet Header */}
      <Header 
        currentView={currentView} 
        onViewChange={(view) => setCurrentView(view as View)}
        favoriteCount={favorites.length}
        onSignInClick={handleSignInClick}
      />

      {/* Main Content */}
      <main className="pb-16 md:pb-0">
        {currentView === 'home' && (
          <HomePage
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onViewDetails={handleViewDetails}
            onNavigateToSearch={handleNavigateToSearch}
          />
        )}

        {currentView === 'search' && (
          <SearchPage
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentView === 'favorites' && (
          <FavoritesPage
            properties={properties}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onViewDetails={handleViewDetails}
            onClearAll={handleClearAllFavorites}
          />
        )}

        {currentView === 'profile' && (
          <ProfilePage 
            favoriteCount={favorites.length}
            onNavigateToSavedSearches={() => setCurrentView('saved-searches')}
            onNavigateToNotifications={() => setCurrentView('notifications')}
          />
        )}

        {currentView === 'saved-searches' && (
          <SavedSearches onNavigateToSearch={handleNavigateToSearch} />
        )}

        {currentView === 'notifications' && (
          <NotificationsCenter onViewProperty={handleViewDetails} />
        )}

        {currentView === 'post' && (
          <PostProperty onClose={() => setCurrentView('home')} onPropertyPosted={handlePostProperty} />
        )}

        {currentView === 'edit' && editingProperty && (
          <EditProperty
            property={editingProperty}
            onClose={() => {
              setCurrentView('home');
              setEditingProperty(null);
            }}
            onPropertyUpdated={handlePropertyUpdated}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation
        currentView={currentView}
        onViewChange={(view) => setCurrentView(view as View)}
        favoriteCount={favorites.length}
      />

      {/* Floating Action Button (Mobile Only) */}
      {currentView === 'home' && (
        <FloatingActionButton
          onSearch={() => setCurrentView('search')}
          onFavorites={() => setCurrentView('favorites')}
          onNotifications={() => setCurrentView('notifications')}
        />
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsEnhanced 
          property={selectedProperty}
          isFavorite={favorites.includes(selectedProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          onClose={handleCloseDetails}
        />
      )}

      {/* Toast Notifications */}
      <Toaster 
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          className: 'mb-16 md:mb-0',
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px',
          },
        }}
        richColors
      />

      {/* PWA Install Prompt */}
      <style>{`
        .safe-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* Prevent scroll on body when modal is open */
        body:has(.fixed.inset-0) {
          overflow: hidden;
        }

        /* Custom scrollbar for desktop */
        @media (min-width: 768px) {
          ::-webkit-scrollbar {
            width: 10px;
          }
          ::-webkit-scrollbar-track {
            background: #f1f5f9;
          }
          .dark ::-webkit-scrollbar-track {
            background: #1f2937;
          }
          ::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 5px;
          }
          .dark ::-webkit-scrollbar-thumb {
            background: #4b5563;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
          .dark ::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
        }

        /* Smooth page transitions */
        main > div {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Loading skeleton */
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .skeleton {
          background: linear-gradient(
            to right,
            #f0f0f0 0%,
            #e0e0e0 20%,
            #f0f0f0 40%,
            #f0f0f0 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }

        .dark .skeleton {
          background: linear-gradient(
            to right,
            #374151 0%,
            #4b5563 20%,
            #374151 40%,
            #374151 100%
          );
        }
      `}</style>
    </div>
  );
}
