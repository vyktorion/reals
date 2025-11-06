// ThemeContext.tsx
// Theme context for global theme state management
// Feature Sliced Design - Theme context layer

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
}

type ThemeAction =
  | { type: 'SET_THEME'; payload: Theme }
  | { type: 'SET_RESOLVED_THEME'; payload: 'light' | 'dark' };

const initialState: ThemeState = {
  theme: 'system',
  resolvedTheme: 'light',
};

function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_RESOLVED_THEME':
      return { ...state, resolvedTheme: action.payload };
    default:
      return state;
  }
}

interface ThemeContextType {
  state: ThemeState;
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  const setTheme = (theme: Theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setResolvedTheme = (resolvedTheme: 'light' | 'dark') => {
    dispatch({ type: 'SET_RESOLVED_THEME', payload: resolvedTheme });
  };

  return (
    <ThemeContext.Provider value={{ state, setTheme, setResolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}