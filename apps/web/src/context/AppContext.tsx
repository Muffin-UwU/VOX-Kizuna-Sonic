'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, DEFAULT_APP_STATE, CommandType, PermissionStatus } from '@kizuna/types';

interface AppContextType extends AppState {
  setMicPermission: (status: PermissionStatus) => void;
  setCameraPermission: (status: PermissionStatus) => void;
  setPlaying: (isPlaying: boolean) => void;
  setCurrentCommand: (command: CommandType | null) => void;
  setBarkDetected: (detected: boolean) => void;
  setLighthouseActive: (active: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_APP_STATE);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const value: AppContextType = {
    ...state,
    setMicPermission: (micPermission: PermissionStatus) => updateState({ micPermission }),
    setCameraPermission: (cameraPermission: PermissionStatus) => updateState({ cameraPermission }),
    setPlaying: (isPlaying: boolean) => updateState({ isPlaying }),
    setCurrentCommand: (currentCommand: CommandType | null) => updateState({ currentCommand }),
    setBarkDetected: (barkDetected: boolean) => updateState({ barkDetected }),
    setLighthouseActive: (lighthouseActive: boolean) => updateState({ lighthouseActive }),
    setShowOnboarding: (showOnboarding: boolean) => updateState({ showOnboarding }),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
