// src/providers/font-provider.tsx
'use client';
import { createContext, useContext, useState, useEffect } from 'react';

type FontFamily = 
  | 'default' 
  | 'times' 
  | 'palatino'
  | 'serif' 
  | 'mono'
  | 'courier'
  | 'arial'
  | 'terminal';
type FontSize = 'small' | 'default' | 'large' | 'xl';

interface FontSettings {
  family: FontFamily;
  size: FontSize;
}

type FontProviderProps = {
  children: React.ReactNode;
  defaultSettings?: FontSettings;
  storageKey?: string;
};

type FontProviderState = {
  settings: FontSettings;
  setFontFamily: (family: FontFamily) => void;
  setFontSize: (size: FontSize) => void;
};

const FontContext = createContext<FontProviderState | undefined>(undefined);

const DEFAULT_SETTINGS: FontSettings = {
  family: 'default',
  size: 'default'
};

export function FontProvider({
  children,
  defaultSettings = DEFAULT_SETTINGS,
  storageKey = 'font-preferences',
}: FontProviderProps) {
  const [settings, setSettings] = useState<FontSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem(storageKey);
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    setMounted(true);
  }, [storageKey]);

  const setFontFamily = (family: FontFamily) => {
    setSettings(prev => {
      const newSettings = { ...prev, family };
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
      return newSettings;
    });
  };

  const setFontSize = (size: FontSize) => {
    setSettings(prev => {
      const newSettings = { ...prev, size };
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
      return newSettings;
    });
  };

  if (!mounted) {
    return (
      <div className={`font-${defaultSettings.family} text-${defaultSettings.size}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`font-${settings.family} text-size-${settings.size}`}>
      <FontContext.Provider value={{ settings, setFontFamily, setFontSize }}>
        {children}
      </FontContext.Provider>
    </div>
  );
}

export const useFont = () => {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};