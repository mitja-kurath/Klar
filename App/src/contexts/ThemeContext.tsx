import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Theme } from '../types';
import { useAuth } from './AuthContext';
interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
interface ThemeProviderProps {
  children: ReactNode;
}
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings, updateSettings } = useAuth();
  const [theme, setThemeState] = useState<Theme>('light');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    if (settings?.theme) {
      setThemeState(settings.theme);
    } else {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme) {
        setThemeState(savedTheme);
      } else {
        setThemeState('light');
      }
    }
  }, [settings]);
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
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateActualTheme);
    return () => mediaQuery.removeEventListener('change', updateActualTheme);
  }, [theme]);
  useEffect(() => {
    const root = document.documentElement;
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [actualTheme]);
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    if (settings) {
      try {
        await updateSettings({ theme: newTheme });
      } catch (error) {
        console.error('Failed to save theme to backend:', error);
      }
    }
  };
  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
  };
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};



