// src/context/ThemeContext.tsx
'use client';
import React, { createContext, useContext, useState } from 'react';

type ThemeClasses = {
    body: string;
    nav: string;
    card: string;
    button: string;
    cardText: string;
    secondaryText: string;
    activeNavItem: string;
    inactiveNavItem: string;
  };

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  getThemeClasses: ThemeClasses;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const getThemeClasses: ThemeClasses = {
    body: isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black',
    nav: isDarkMode ? 'bg-gray-800 shadow-md' : 'bg-white shadow-md',
    card: isDarkMode ? 'border-gray-700 bg-gray-800' : 'border bg-white',
    button: isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800',
    cardText: isDarkMode ? 'text-slate-100' : 'text-slate-900',
    secondaryText: isDarkMode ? 'text-gray-400' : 'text-gray-600',
    activeNavItem: isDarkMode ? 'border-blue-400 text-white' : 'border-blue-500 text-gray-900',
    inactiveNavItem: isDarkMode ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-500 hover:text-gray-700',
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, getThemeClasses }}>
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