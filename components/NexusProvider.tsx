
import React, { createContext, useContext, useState, useEffect } from 'react';
import { NexusState } from '../types';

interface NexusContextType extends NexusState {
  togglePrivacy: () => void;
  toggleShowroom: () => void;
  toggleDarkMode: () => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

export const NexusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<NexusState>(() => {
    const saved = localStorage.getItem('nexus_ui_config');
    return saved ? JSON.parse(saved) : {
      isPrivacyEnabled: false,
      isShowroomMode: false,
      isDarkMode: true
    };
  });

  useEffect(() => {
    localStorage.setItem('nexus_ui_config', JSON.stringify(state));
    if (state.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const togglePrivacy = () => setState(s => ({ ...s, isPrivacyEnabled: !s.isPrivacyEnabled }));
  const toggleShowroom = () => setState(s => ({ ...s, isShowroomMode: !s.isShowroomMode }));
  const toggleDarkMode = () => setState(s => ({ ...s, isDarkMode: !s.isDarkMode }));

  return (
    <NexusContext.Provider value={{ ...state, togglePrivacy, toggleShowroom, toggleDarkMode }}>
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) throw new Error("useNexus must be used within a NexusProvider");
  return context;
};
