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
      // Check if we're returning from OAuth success
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
          // Use the JWT token from URL parameter
          apiService.setToken(tokenParam);
          console.log('Token set, fetching user data...');
          
          // Get user data with the new token
          const userData = await apiService.getCurrentUser();
          const userSettings = await apiService.getUserSettings();
          setUser(userData);
          setSettings(userSettings);
          console.log('User data loaded successfully');
          
          // Only clear URL parameters AFTER successful authentication
          const newUrl = window.location.pathname + '?success=true';
          window.history.replaceState({}, document.title, newUrl);
        } catch (error) {
          console.error('Failed to get user data after OAuth:', error);
          // No fallback - if JWT fails, user is not authenticated
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
        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // If token is in URL, use it
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
      
      // Check for existing JWT token in localStorage
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
      
      // For Spring Security OAuth2, we need to redirect to the OAuth URL
      // The backend will handle the OAuth flow and redirect back with tokens
      window.location.href = url;
      
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      setUser(null);
      setSettings(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Clear local state anyway
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
