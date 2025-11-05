'use client'

import { Navigation } from '../features/navigation'
import { MobileNavigation } from '../features/navigation/components/MobileNavigation'
import { useApp } from '../contexts/AppContext'
import { usePathname, useRouter } from 'next/navigation'

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { favorites } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  // Convert pathname to view for compatibility
  const getCurrentView = () => {
    switch (pathname) {
      case '/': return 'home';
      case '/search': return 'search';
      case '/favorites': return 'favorites';
      case '/profile': return 'profile';
      case '/signin': return 'signin';
      case '/post': return 'post-property'; 
      case '/notifications': return 'notifications';
      case '/saved-searches': return 'saved-searches';
      default: 
        if (pathname.startsWith('/property/')) return 'property';
        return 'home';
    }
  };

  const handleViewChange = (view: string) => {
    switch (view) {
      case 'home': router.push('/'); break;
      case 'search': router.push('/search'); break;
      case 'favorites': router.push('/favorites'); break;
      case 'profile': router.push('/profile'); break;
      case 'signin': router.push('/signin'); break;
      case 'post': 
      case 'post-property': router.push('/post'); break;
      case 'notifications': router.push('/notifications'); break;
      case 'saved-searches': router.push('/saved-searches'); break;
      default: router.push('/'); break;
    }
  };

  const handleSignInClick = () => {
    router.push('/signin');
  };

  const currentView = getCurrentView();

  return (
    <div className="bg-background">
      {/* Desktop/Tablet Header */}
      <Navigation
        currentView={currentView}
        onViewChange={handleViewChange}
        favoriteCount={favorites.length}
        onSignInClick={handleSignInClick}
      />

      {/* Main Content */}
      <main className="pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation
        currentView={currentView}
        onViewChange={handleViewChange}
        favoriteCount={favorites.length}
      />
    </div>
  );
}