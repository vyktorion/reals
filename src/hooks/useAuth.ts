import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authToken, setAuthToken] = useLocalStorage<string | null>('authToken', null);
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!(authToken && user);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock authentication - replace with real API call
      if (email === 'demo@imoestate.com' && password === 'demo123') {
        const mockUser: User = {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Anderson',
          phone: '+1 (555) 987-6543',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        };

        const mockToken = 'mock-jwt-token-' + Date.now();

        setAuthToken(mockToken);
        setUser(mockUser);

        return { success: true, user: mockUser };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock registration - replace with real API call
      const mockUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
      };

      const mockToken = 'mock-jwt-token-' + Date.now();

      setAuthToken(mockToken);
      setUser(mockUser);

      return { success: true, user: mockUser };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setAuthToken(null);
    setUser(null);
    setError(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    }
    return { success: false, error: 'No user logged in' };
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}