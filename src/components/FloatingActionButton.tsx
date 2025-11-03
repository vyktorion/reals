import { useState } from 'react';
import { Plus, Search, Heart, Bell, X } from 'lucide-react';

interface FloatingActionButtonProps {
  onSearch: () => void;
  onFavorites: () => void;
  onNotifications: () => void;
}

export function FloatingActionButton({ onSearch, onFavorites, onNotifications }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Search, label: 'Search', onClick: onSearch, color: 'bg-blue-900 dark:bg-blue-600' },
    { icon: Heart, label: 'Favorites', onClick: onFavorites, color: 'bg-red-500 dark:bg-red-600' },
    { icon: Bell, label: 'Notifications', onClick: onNotifications, color: 'bg-amber-500 dark:bg-amber-600' }
  ];

  const handleAction = (onClick: () => void) => {
    onClick();
    setIsOpen(false);
  };

  return (
    <div className="md:hidden fixed bottom-20 right-4 z-40">
      {/* Action buttons */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-300">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleAction(action.onClick)}
                className={`${action.color} text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-3 pr-6 animate-in slide-in-from-right-4 duration-300`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm whitespace-nowrap">{action.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-blue-900 dark:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center ${
          isOpen ? 'rotate-45 bg-gray-700 dark:bg-gray-600' : 'rotate-0'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 -z-10 bg-black/20 dark:bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
