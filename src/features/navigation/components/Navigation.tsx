"use client";
import { Menu, X, User, Heart, Search, Home, Bell, Plus, LogIn, Building2, LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '../../../components/ui/button';
import { ThemeToggle } from '../../../components/ThemeToggle';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  favoriteCount: number;
  onSignInClick?: () => void;
}

export function Navigation({ currentView, onViewChange, favoriteCount, onSignInClick }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isAuthenticated = status === 'authenticated' && !!session;

  const baseItems: NavItem[] = [
    { id: 'search', label: 'Search', icon: Search },
    { id: 'favorites', label: 'Favorites', icon: Heart, badge: favoriteCount },
  ];
  const authItem: NavItem = mounted
    ? (isAuthenticated
        ? { id: 'profile', label: 'Profile', icon: User }
        : { id: 'signin', label: 'Sign In', icon: LogIn })
    : { id: 'account', label: 'Account', icon: User };
  const navItems: NavItem[] = baseItems;

  const handlePostProperty = () => {
    onViewChange('post');
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-premium-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => onViewChange('home')}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              <Building2 className="w-8 h-8 text-gold-500 transition-all duration-300 group-hover:scale-105" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-heading text-navy-900 dark:text-gold-100 tracking-wide">
                ImoEstate
              </div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`relative px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 text-sm font-body font-medium ${
                    currentView === item.id
                      ? 'text-gold-500 border-b-2 border-gold-500'
                      : 'text-navy-700 dark:text-gray-300 hover:text-gold-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span suppressHydrationWarning>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

          {/* Post Property Button */}
          <div className="hidden md:flex items-center gap-6">
            <Button
              onClick={handlePostProperty}
              className="bg-gold-500 hover:bg-gold-600 text-navy-900 px-6 py-2 rounded-md text-sm font-body font-medium shadow-premium-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Property
            </Button>
          </div>
            
            {/* Notification Icon */}
            <button
              onClick={() => onViewChange('notifications')}
              className="relative p-2 rounded-md text-navy-700 dark:text-gray-300 hover:text-gold-500 transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <ThemeToggle />

            {/* Auth Button */}
            <button
              onClick={() => onViewChange(isAuthenticated ? 'profile' : 'signin')}
              className={`px-4 py-2 rounded-md transition-all duration-300 flex items-center gap-2 text-sm font-body font-medium ${
                currentView === (isAuthenticated ? 'profile' : 'signin')
                  ? 'text-gold-500 border-b-2 border-gold-500'
                  : 'text-navy-700 dark:text-gray-300 hover:text-gold-500'
              }`}
            >
              {isAuthenticated ? <User className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              <span suppressHydrationWarning>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-navy-900 dark:text-gold-100" />
            ) : (
              <Menu className="w-6 h-6 text-navy-900 dark:text-gold-100" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-300">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-6 py-4 transition-all duration-300 flex items-center gap-4 text-base font-body ${
                    currentView === item.id
                      ? 'text-gold-500 bg-gray-50 dark:bg-gray-800'
                      : 'text-navy-700 dark:text-gray-300 hover:text-gold-500'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span suppressHydrationWarning>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            {/* Notification for Mobile */}
            <button
              onClick={() => {
                onViewChange('notifications');
                setMobileMenuOpen(false);
              }}
              className="w-full px-6 py-4 transition-all duration-300 flex items-center gap-4 text-base font-body text-navy-700 dark:text-gray-300 hover:text-gold-500"
            >
              <Bell className="w-5 h-5" />
              Notifications
              <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            {/* Theme Toggle for Mobile */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-base font-body text-navy-700 dark:text-gray-300">Theme</span>
              <ThemeToggle />
            </div>

            {/* Auth Button for Mobile */}
            <button
              onClick={() => {
                onViewChange(isAuthenticated ? 'profile' : 'signin');
                setMobileMenuOpen(false);
              }}
              className={`w-full px-6 py-4 transition-all duration-300 flex items-center gap-4 text-base font-body ${
                currentView === (isAuthenticated ? 'profile' : 'signin')
                  ? 'text-gold-500 bg-gray-50 dark:bg-gray-800'
                  : 'text-navy-700 dark:text-gray-300 hover:text-gold-500'
              }`}
            >
              {isAuthenticated ? <User className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              <span suppressHydrationWarning>{isAuthenticated ? 'Profile' : 'Sign In'}</span>
            </button>
            
            {/* Post Property Button for Mobile */}
            <div className="px-6 py-4">
              <Button
                onClick={() => {
                  handlePostProperty();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gold-500 hover:bg-gold-600 text-navy-900 py-4 rounded-md text-base font-body font-medium shadow-premium-sm flex items-center justify-center gap-3"
              >
                <Plus className="w-5 h-5" />
                Post Property
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}