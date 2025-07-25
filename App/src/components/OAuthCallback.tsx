import React, { useEffect } from 'react';
export const OAuthCallback: React.FC = () => {
  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const error = urlParams.get('error');
      if (error) {
        console.error('OAuth error:', error);
        window.close();
        return;
      }
      if (code) {
        if (window.opener) {
          window.opener.postMessage({
            type: 'OAUTH_SUCCESS',
            code,
            state
          }, window.location.origin);
          window.close();
        }
      }
    };
    handleCallback();
  }, []);
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold text-teal-400 mb-4">Authenticating...</div>
        <p className="text-slate-400">Please wait while we complete your login.</p>
      </div>
    </div>
  );
};



