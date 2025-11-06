// PropertyContext.tsx
// Property context for global property state management
// Feature Sliced Design - Property context layer

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Property } from '@/entities/property';

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    priceRange: [number, number];
    propertyType: string;
    location: string;
    bedrooms: number;
    bathrooms: number;
  };
}

type PropertyAction =
  | { type: 'SET_PROPERTIES'; payload: Property[] }
  | { type: 'SELECT_PROPERTY'; payload: Property | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'UPDATE_FILTERS'; payload: Partial<PropertyState['filters']> }
  | { type: 'CLEAR_ERROR' };

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  isLoading: false,
  error: null,
  filters: {
    priceRange: [0, 1000000],
    propertyType: '',
    location: '',
    bedrooms: 0,
    bathrooms: 0,
  },
};

function propertyReducer(state: PropertyState, action: PropertyAction): PropertyState {
  switch (action.type) {
    case 'SET_PROPERTIES':
      return { ...state, properties: action.payload };
    case 'SELECT_PROPERTY':
      return { ...state, selectedProperty: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'UPDATE_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

interface PropertyContextType {
  state: PropertyState;
  setProperties: (properties: Property[]) => void;
  selectProperty: (property: Property | null) => void;
  setLoading: (loading: boolean) => void;
  updateFilters: (filters: Partial<PropertyState['filters']>) => void;
  clearError: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  const setProperties = (properties: Property[]) => {
    dispatch({ type: 'SET_PROPERTIES', payload: properties });
  };

  const selectProperty = (property: Property | null) => {
    dispatch({ type: 'SELECT_PROPERTY', payload: property });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const updateFilters = (filters: Partial<PropertyState['filters']>) => {
    dispatch({ type: 'UPDATE_FILTERS', payload: filters });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <PropertyContext.Provider value={{
      state,
      setProperties,
      selectProperty,
      setLoading,
      updateFilters,
      clearError
    }}>
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
}