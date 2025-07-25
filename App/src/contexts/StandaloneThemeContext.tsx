import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '../types';
interface StandaloneThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}
const StandaloneThemeContext = createContext<StandaloneThemeContextType | undefined>(undefined);
interface StandaloneThemeProviderProps {
  children: ReactNode;
}
export const StandaloneThemeProvider: React.FC<StandaloneThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);
  useEffect(() => {
    const updateActualTheme = () => {
      if (theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setActualTheme(systemPrefersDark ? 'dark' : 'light');
      } else {
        setActualTheme(theme);
      }
    };
    updateActualTheme();
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', updateActualTheme);
      return () => mediaQuery.removeEventListener('change', updateActualTheme);
    }
  }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
  }, [actualTheme]);
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  return (
    <StandaloneThemeContext.Provider value={{ theme, actualTheme, setTheme }}>
      {children}
    </StandaloneThemeContext.Provider>
  );
};
export const useStandaloneTheme = () => {
  const context = useContext(StandaloneThemeContext);
  if (context === undefined) {
    throw new Error('useStandaloneTheme must be used within a StandaloneThemeProvider');
  }
  return context;
};



