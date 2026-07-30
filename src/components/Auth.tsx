import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('error_description') || hashParams.get('error_description') || null;
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6eeff] via-[#f8f9ff] to-[#f0f4ff] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#0040a1]/6 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#4648d4]/6 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-[#00514a]/4 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="relative bg-white max-w-md w-full rounded-3xl px-10 py-12 shadow-2xl border border-[#c3c6d6]/20 flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#0040a1] flex items-center justify-center text-white shadow-xl">
            <span className="material-symbols-outlined text-[38px]">sign_language</span>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-[#0040a1] tracking-tight leading-none">
              SignMeet <span className="text-[#4648d4]">AI</span>
            </div>
            <div className="text-[11px] uppercase tracking-widest text-[#00514a] font-semibold mt-1">
              Accessibility First
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[#121c2a] mb-2">Welcome</h1>
          <p className="text-[#737686] text-sm leading-relaxed max-w-xs">
            Real-time AI sign language interpretation for inclusive meetings.
          </p>
        </div>

        {errorMessage && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs text-center font-medium leading-relaxed">
            {errorMessage}
          </div>
        )}

        {/* Google Sign In Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-[#c3c6d6]/60 hover:border-[#0040a1] py-3.5 px-6 rounded-2xl font-semibold text-[#121c2a] text-base hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 group"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-[#c3c6d6] border-t-[#0040a1] rounded-full animate-spin" />
          ) : (
            /* Google SVG Logo */
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {loading ? 'Redirecting to Google...' : 'Continue with Google'}
        </button>

        {/* Features badges */}
        <div className="flex flex-wrap justify-center gap-2 w-full">
          {['ASL / BSL Support', 'Live Captions', 'AI Transcripts', 'Cloud Storage'].map((f) => (
            <span
              key={f}
              className="px-3 py-1 bg-[#eff4ff] text-[#0040a1] rounded-full text-xs font-semibold border border-[#0040a1]/10"
            >
              {f}
            </span>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-[#737686] leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          <br />SignMeet AI is committed to full WCAG AAA accessibility compliance.
        </p>
      </div>
    </div>
  );
};
