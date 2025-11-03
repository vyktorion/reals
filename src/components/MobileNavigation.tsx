import { Home, Search, Heart, User, Plus, FileText } from 'lucide-react';

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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg safe-bottom">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`relative flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                isActive 
                  ? 'text-blue-900 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 active:bg-gray-50 dark:active:bg-gray-700'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-blue-900 dark:bg-blue-400 rounded-b-full" />
              )}
              
              {/* Icon */}
              <div className="relative">
                <Icon 
                  className={`w-6 h-6 transition-transform ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                
                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
