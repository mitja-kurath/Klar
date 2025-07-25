import React from 'react';
import { Loader2 } from 'lucide-react';
export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-teal-400 mb-4">Klar</div>
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-teal-400" />
        <p className="text-slate-400 mt-4">Loading...</p>
      </div>
    </div>
  );
};



