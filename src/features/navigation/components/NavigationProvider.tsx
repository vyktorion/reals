import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface NavigationContextType {
  currentView: string;
  favoriteCount: number;
  setCurrentView: (view: string) => void;
  setFavoriteCount: (count: number) => void;
  navigateTo: (path: string) => void;
  navigateBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Convert pathname to view for compatibility
  const getCurrentView = () => {
    switch (pathname) {
      case '/': return 'home';
      case '/search': return 'search';
      case '/favorites': return 'favorites';
      case '/profile': return 'profile';
      case '/signin': return 'signin';
      case '/post':
      case '/post-property': return 'post-property'; // Mobile navigation uses 'post-property'
      case '/notifications': return 'notifications';
      case '/saved-searches': return 'saved-searches';
      default:
        if (pathname.startsWith('/property/')) return 'property';
        return 'home';
    }
  };

  const currentView = getCurrentView();

  const handleViewChange = (view: string) => {
    switch (view) {
      case 'home': router.push('/'); break;
      case 'search': router.push('/search'); break;
      case 'favorites': router.push('/favorites'); break;
      case 'profile': router.push('/profile'); break;
      case 'post':
      case 'post-property': router.push('/post'); break;
      case 'notifications': router.push('/notifications'); break;
      case 'saved-searches': router.push('/saved-searches'); break;
      default: router.push('/'); break;
    }
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const navigateBack = () => {
    router.back();
  };

  const setCurrentView = (view: string) => {
    handleViewChange(view);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        favoriteCount,
        setCurrentView,
        setFavoriteCount,
        navigateTo,
        navigateBack,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationContext must be used within a NavigationProvider');
  }
  return context;
}