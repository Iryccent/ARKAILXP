import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { themes } from '@/styles/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('arkai-theme');
    if (savedTheme && themes[savedTheme]) {
      return savedTheme;
    }

    // Automatic Dark Mode Logic
    const currentHour = new Date().getHours();
    if (currentHour >= 19 || currentHour < 6) { // After 7 PM or before 6 AM
      return 'midnightAurora';
    }
    
    return 'skywash'; // Default day theme
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