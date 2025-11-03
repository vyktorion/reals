import { Menu, X, User, Heart, Search, Home, Bell, Plus, LogIn, Building2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/ui/components/button';
import { ThemeToggle } from '../../../components/ThemeToggle';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  favoriteCount: number;
  onSignInClick?: () => void;
}

export function Header({ currentView, onViewChange, favoriteCount, onSignInClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteCount },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handlePostProperty = () => {
    onViewChange('post');
  };

  return (
    <header className="sticky top-0 z-50 bg-card dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Building2 className="w-8 h-8 text-primary transition-all duration-300 group-hover:scale-110" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-900 to-blue-700 dark:from-blue-400 dark:to-blue-300 tracking-tight">
                ImoEstate
              </div>
            </div>
          </button>

          {/* Post Property Button */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {onSignInClick && (
              <button
                onClick={onSignInClick}
                className="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
            <Button
              onClick={handlePostProperty}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Post Property
            </Button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`relative px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    currentView === item.id
                      ? 'bg-blue-900 dark:bg-blue-800 text-primary-foreground shadow-md'
                      : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Notification Icon */}
            <button
              onClick={() => onViewChange('notifications')}
              className="relative p-2 ml-2 rounded-lg text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`relative w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                    currentView === item.id
                      ? 'bg-blue-900 dark:bg-blue-800 text-primary-foreground'
                      : 'text-foreground hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Theme Toggle for Mobile */}
            <div className="flex items-center justify-between px-4 py-3 mt-2 border-t border-gray-200 dark:border-gray-800">
              <span className="text-foreground">Theme</span>
              <ThemeToggle />
            </div>
            
            {/* Sign In & Post Property Buttons for Mobile */}
            <div className="px-4 py-3 space-y-3">
              {onSignInClick && (
                <button
                  onClick={() => {
                    onSignInClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-foreground hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
              )}
              <Button
                onClick={() => {
                  handlePostProperty();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Post Property
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
