import { useState, useEffect, useCallback } from 'react';

export type UseLocalStorageOptions<T> = {
  serializer?: {
    parse: (value: string) => T;
    stringify: (value: T) => string;
  };
  onError?: (error: Error) => void;
};

const defaultSerializer = {
  parse: JSON.parse,
  stringify: JSON.stringify,
};

export function useLocalStorage<T>(
  key: string, 
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  const { serializer = defaultSerializer, onError } = options;
  
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? serializer.parse(item) : initialValue;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to read from localStorage');
      console.error(`useLocalStorage Error reading key "${key}":`, err);
      onError?.(err);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, serializer.stringify(valueToStore));
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to write to localStorage');
      console.error(`useLocalStorage Error writing key "${key}":`, err);
      onError?.(err);
    }
  }, [key, storedValue, serializer, onError]);

  // Function to remove the item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to remove from localStorage');
      console.error(`useLocalStorage Error removing key "${key}":`, err);
      onError?.(err);
    }
  }, [key, initialValue, onError]);

  // Function to check if the key exists in localStorage
  const hasValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      return window.localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [key]);

  // Listen for changes to the localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(serializer.parse(e.newValue));
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to parse storage change');
          console.error(`useLocalStorage Error parsing storage change for key "${key}":`, err);
          onError?.(err);
        }
      }
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab communication
    const handleCustomStorage = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: string }>;
      if (customEvent.detail.key === key) {
        try {
          setStoredValue(serializer.parse(customEvent.detail.value));
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to parse custom storage change');
          console.error(`useLocalStorage Error parsing custom storage change for key "${key}":`, err);
          onError?.(err);
        }
      }
    };

    window.addEventListener('localStorageChange', handleCustomStorage as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorage as EventListener);
    };
  }, [key, serializer, onError]);

  // Helper function to trigger custom storage changes for same-tab updates
  const triggerChange = useCallback((value: T) => {
    const customEvent = new CustomEvent('localStorageChange', {
      detail: { key, value: serializer.stringify(value) }
    });
    window.dispatchEvent(customEvent);
  }, [key, serializer]);

  // Enhanced setValue that also triggers custom events
  const setValueWithTrigger = useCallback((value: T | ((val: T) => T)) => {
    setValue(value);
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    triggerChange(valueToStore);
  }, [setValue, triggerChange, storedValue]);

  return [
    storedValue,
    setValue,
    {
      removeValue,
      hasValue,
      setValueWithTrigger,
      triggerChange
    }
  ] as const;
}

// Export a hook with default error handling
export function useLocalStorageSafe<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  return useLocalStorage(key, initialValue, {
    ...options,
    onError: (error) => {
      // Default error handling - could be extended to show notifications
      console.warn('useLocalStorage error:', error.message);
    }
  });
}

// Export a hook specifically for boolean values with toggling
export function useLocalStorageBoolean(key: string, initialValue: boolean = false) {
  const [value, setValue] = useLocalStorage(key, initialValue);
  
  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, [setValue]);
  
  return [value, setValue, toggle] as const;
}