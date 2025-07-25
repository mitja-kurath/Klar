import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SettingsScreen } from './SettingsScreen';
export const UserMenu: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowThemeMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];
  const currentThemeOption = themeOptions.find(option => option.value === theme);
  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 transition-colors"
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <span className="text-sm font-medium hidden md:block text-slate-900 dark:text-slate-100">{user?.name}</span>
          <ChevronDown className={`w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50">
            <div className="p-3 border-b border-slate-200 dark:border-slate-700">
              <p className="font-medium text-slate-900 dark:text-slate-100">{user?.name}</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email}</p>
            </div>
            <div className="py-1">
              <div className="relative">
                <button
                  onClick={() => setShowThemeMenu(!showThemeMenu)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {currentThemeOption && <currentThemeOption.icon className="w-4 h-4" />}
                    Theme
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showThemeMenu ? 'rotate-180' : ''}`} />
                </button>
                {showThemeMenu && (
                  <div className="absolute left-full top-0 ml-1 w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setTheme(option.value);
                          setShowThemeMenu(false);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors ${
                          theme === option.value ? 'text-teal-500 dark:text-teal-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSettings(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
      <SettingsScreen 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </>
  );
};



