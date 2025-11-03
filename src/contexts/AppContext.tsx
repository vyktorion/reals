'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { properties as initialProperties } from '../shared/data/properties';
import { Property } from '../types';

interface AppContextType {
  // Favorites state
  favorites: string[];
  toggleFavorite: (id: string) => void;
  
  // Properties state
  properties: Property[];
  
  // Auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  
  // Selected property for details
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  
  // Editing property
  editingProperty: Property | null;
  setEditingProperty: (property: Property | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  // Properties state
  const [properties] = useState<Property[]>(initialProperties);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Selected property for details view
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Editing property
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Persist favorites to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.includes(id);
      if (isCurrentlyFavorite) {
        return prev.filter(favId => favId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const value: AppContextType = {
    favorites,
    toggleFavorite,
    properties,
    isAuthenticated,
    setIsAuthenticated,
    selectedProperty,
    setSelectedProperty,
    editingProperty,
    setEditingProperty,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}