// DeviceContext.tsx
// Device context for global device state management
// Feature Sliced Design - Device context layer

"use client";

import React, { createContext, useContext, useReducer, ReactNode } from 'react';

interface DeviceState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  orientation: 'portrait' | 'landscape';
}

type DeviceAction =
  | { type: 'SET_DEVICE_TYPE'; payload: { isMobile: boolean; isTablet: boolean; isDesktop: boolean } }
  | { type: 'SET_SCREEN_SIZE'; payload: 'sm' | 'md' | 'lg' | 'xl' | '2xl' }
  | { type: 'SET_ORIENTATION'; payload: 'portrait' | 'landscape' };

const initialState: DeviceState = {
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  screenSize: 'lg',
  orientation: 'landscape',
};

function deviceReducer(state: DeviceState, action: DeviceAction): DeviceState {
  switch (action.type) {
    case 'SET_DEVICE_TYPE':
      return { ...state, ...action.payload };
    case 'SET_SCREEN_SIZE':
      return { ...state, screenSize: action.payload };
    case 'SET_ORIENTATION':
      return { ...state, orientation: action.payload };
    default:
      return state;
  }
}

interface DeviceContextType {
  state: DeviceState;
  setDeviceType: (deviceType: { isMobile: boolean; isTablet: boolean; isDesktop: boolean }) => void;
  setScreenSize: (screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => void;
  setOrientation: (orientation: 'portrait' | 'landscape') => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(deviceReducer, initialState);

  const setDeviceType = (deviceType: { isMobile: boolean; isTablet: boolean; isDesktop: boolean }) => {
    dispatch({ type: 'SET_DEVICE_TYPE', payload: deviceType });
  };

  const setScreenSize = (screenSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl') => {
    dispatch({ type: 'SET_SCREEN_SIZE', payload: screenSize });
  };

  const setOrientation = (orientation: 'portrait' | 'landscape') => {
    dispatch({ type: 'SET_ORIENTATION', payload: orientation });
  };

  return (
    <DeviceContext.Provider value={{ state, setDeviceType, setScreenSize, setOrientation }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
}