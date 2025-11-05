import { Home, Search, Heart, User, Plus } from 'lucide-react';

interface MobileNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  favoriteCount: number;
}

export function MobileNavigation({ currentView, onViewChange, favoriteCount }: MobileNavigationProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'favorites', label: 'Saved', icon: Heart, badge: favoriteCount },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'post-property', label: 'Post', icon: Plus },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-premium-md safe-bottom">
      <div className="grid grid-cols-5 h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                isActive 
                  ? 'text-gold-500' 
                  : 'text-navy-700 dark:text-gray-300 active:bg-gray-100 dark:active:bg-gray-800'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gold-500 rounded-b-md" />
              )}
              
              {/* Icon */}
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-transform duration-300 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2 : 1.5}
                />
                
                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-premium-sm">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-body ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
