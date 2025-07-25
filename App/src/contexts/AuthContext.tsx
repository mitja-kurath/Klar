import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, UserSettings, AuthContextType } from '../types';
import { apiService } from '../services/api';
const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const initializeAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const oauthSuccess = urlParams.get('success');
      const tokenParam = urlParams.get('token');
      console.log('Initializing auth - URL params:', {
        success: oauthSuccess,
        token: tokenParam ? 'TOKEN_PRESENT' : 'NO_TOKEN',
        fullUrl: window.location.href
      });
      if (oauthSuccess === 'true' && tokenParam) {
        console.log('OAuth success with token - processing...');
        try {
          apiService.setToken(tokenParam);
          console.log('Token set, fetching user data...');
          const userData = await apiService.getCurrentUser();
          const userSettings = await apiService.getUserSettings();
          setUser(userData);
          setSettings(userSettings);
          console.log('User data loaded successfully');
          const newUrl = window.location.pathname + '?success=true';
          window.history.replaceState({}, document.title, newUrl);
        } catch (error) {
          console.error('Failed to get user data after OAuth:', error);
          apiService.setToken(null);
        }
        setIsLoading(false);
        return;
      }
      if (oauthSuccess === 'true' && !tokenParam) {
        console.error('OAuth success but no token in URL - backend redirect issue');
        console.log('Your backend OAuth success handler needs to redirect with token parameter');
        setIsLoading(false);
        return;
      }
      if (tokenParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
        apiService.setToken(tokenParam);
        try {
          const userData = await apiService.getCurrentUser();
          const userSettings = await apiService.getUserSettings();
          setUser(userData);
          setSettings(userSettings);
        } catch (error) {
          console.error('Failed to get user data with URL token:', error);
          apiService.setToken(null);
        }
        setIsLoading(false);
        return;
      }
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        apiService.setToken(storedToken);
        try {
          const userData = await apiService.getCurrentUser();
          const userSettings = await apiService.getUserSettings();
          setUser(userData);
          setSettings(userSettings);
        } catch (error) {
          console.error('Failed to initialize auth with stored JWT token:', error);
          apiService.setToken(null);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);
  const login = async (provider: 'github' | 'google') => {
    try {
      const { url } = await apiService.initiateOAuth(provider);
      window.location.href = url;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      try {
        const { invoke } = await import('@tauri-apps/api/core');
        await invoke('close_all_widgets');
        console.log('Widgets closed successfully during logout');
      } catch (error) {
        console.error('Failed to close widgets during logout:', error);
      }
      await apiService.logout();
      setUser(null);
      setSettings(null);
    } catch (error) {
      console.error('Logout failed:', error);
      apiService.setToken(null);
      setUser(null);
      setSettings(null);
    }
  };
  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!settings) return;
    try {
      const updatedSettings = await apiService.updateUserSettings(newSettings);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };
  const value: AuthContextType = {
    user,
    settings,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateSettings,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



