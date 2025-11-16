import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { themes } from '@/styles/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('arkai-theme');
    if (savedTheme && themes[savedTheme]) {
      return savedTheme;
    }

    // Default to dark theme
    return 'midnightAurora';
  });

  useEffect(() => {
    localStorage.setItem('arkai-theme', theme);
    
    const root = window.document.documentElement;
    
    // Clean up previous themes
    Object.keys(themes).forEach(themeKey => {
      root.classList.remove(themeKey);
    });
    
    // Add the new theme class
    root.classList.add(theme);

  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, themes }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};