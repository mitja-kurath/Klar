import React, { useState } from 'react';
import { X, User, Clock, Palette, Bell, Sun, Moon, Monitor } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { UserSettings } from '../types';
interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
}
export const SettingsScreen: React.FC<SettingsScreenProps> = ({ isOpen, onClose }) => {
  const { user, settings, updateSettings } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'account' | 'timer' | 'appearance' | 'notifications'>('account');
  const [localSettings, setLocalSettings] = useState<Partial<UserSettings>>(settings || {});
  const [isSaving, setIsSaving] = useState(false);
  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun, description: 'Light mode for better daytime visibility' },
    { value: 'dark' as const, label: 'Dark', icon: Moon, description: 'Dark mode for reduced eye strain' },
    { value: 'system' as const, label: 'System', icon: Monitor, description: 'Follow your system preference' },
  ];
  const tabs = [
    { id: 'account' as const, label: 'Account', icon: User },
    { id: 'timer' as const, label: 'Timer', icon: Clock },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  ];
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex h-[600px]">
          {}
          <div className="w-64 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-500 text-white'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          {}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Account Information</h2>
                  <div className="flex items-center gap-4 mb-6">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-16 h-16 rounded-full"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">{user?.name}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Account Type</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {user?.github_id ? 'GitHub' : user?.google_id ? 'Google' : 'Unknown'}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                      <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Member Since</h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'timer' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Timer Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Work Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={Math.round((localSettings.workDuration || localSettings.work_duration || 1500) / 60)}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        workDuration: parseInt(e.target.value) * 60,
                        work_duration: parseInt(e.target.value) * 60
                      })}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Short Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={Math.round((localSettings.shortBreakDuration || localSettings.short_break_duration || 300) / 60)}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        shortBreakDuration: parseInt(e.target.value) * 60,
                        short_break_duration: parseInt(e.target.value) * 60
                      })}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Long Break Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={Math.round((localSettings.longBreakDuration || localSettings.long_break_duration || 900) / 60)}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        longBreakDuration: parseInt(e.target.value) * 60,
                        long_break_duration: parseInt(e.target.value) * 60
                      })}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Long Break Interval
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={localSettings.sessionsUntilLongBreak || localSettings.sessions_until_long_break || 4}
                      onChange={(e) => setLocalSettings({
                        ...localSettings,
                        sessionsUntilLongBreak: parseInt(e.target.value),
                        sessions_until_long_break: parseInt(e.target.value)
                      })}
                      className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Number of work sessions before a long break
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Appearance</h2>
                <div>
                  <h3 className="text-lg font-medium mb-3 text-slate-900 dark:text-slate-100">Theme</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-colors ${
                          theme === option.value
                            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          theme === option.value
                            ? 'bg-teal-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                        }`}>
                          <option.icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-slate-900 dark:text-slate-100">{option.label}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{option.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-slate-100">Notifications</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">Desktop Notifications</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Get notified when timers complete</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.notificationsEnabled || localSettings.notifications_enabled || false}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          notificationsEnabled: e.target.checked,
                          notifications_enabled: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-100">Sound Notifications</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Play sound when timers complete</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localSettings.soundEnabled || false}
                        onChange={(e) => setLocalSettings({
                          ...localSettings,
                          soundEnabled: e.target.checked
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400 text-white rounded-lg font-medium transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};



