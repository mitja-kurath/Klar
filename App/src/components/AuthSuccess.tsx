import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export const AuthSuccess: React.FC = () => {
  const { isLoading } = useAuth();

  useEffect(() => {
    // Redirect to main app after a short delay
    const timer = setTimeout(() => {
      window.location.href = '/';
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-emerald-400 mb-4">✓</div>
        <h1 className="text-2xl font-bold text-emerald-400 mb-2">Login Successful!</h1>
        <p className="text-slate-400 mb-6">Welcome to Klar. Redirecting to your dashboard...</p>
        {isLoading && (
          <div className="animate-pulse text-teal-400">Loading your data...</div>
        )}
      </div>
    </div>
  );
};
