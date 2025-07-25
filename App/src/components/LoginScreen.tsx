import React, { useState } from 'react';
import { Github, Chrome, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
export const LoginScreen: React.FC = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState<'github' | 'google' | null>(null);
  const handleLogin = async (provider: 'github' | 'google') => {
    setIsLoading(provider);
    try {
      await login(provider);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(null);
    }
  };
  return (
    <div className="min-h-screen bg-slate-900 dark:bg-slate-900 text-slate-100 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-teal-400 mb-2">Klar</h1>
          <p className="text-slate-400">Focus better with the Pomodoro technique</p>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-center">Sign in to continue</h2>
          <div className="space-y-4">
            <button
              onClick={() => handleLogin('github')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 border border-gray-600 rounded-lg transition-colors font-medium"
            >
              {isLoading === 'github' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Github className="w-5 h-5" />
              )}
              Continue with GitHub
            </button>
            <button
              onClick={() => handleLogin('google')}
              disabled={isLoading !== null}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 border border-blue-500 rounded-lg transition-colors font-medium"
            >
              {isLoading === 'google' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Chrome className="w-5 h-5" />
              )}
              Continue with Google
            </button>
          </div>
          <div className="mt-6 text-center text-sm text-slate-400">
            <p>Sign in to sync your tasks and settings across devices</p>
          </div>
        </div>
        <div className="text-center mt-6 text-xs text-slate-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};



