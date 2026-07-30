import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    google?: any;
  }
}

const DEFAULT_CLIENT_ID = '101318699736-omfhvo9m3otktncnsnboeom18v301gl5.apps.googleusercontent.com';
const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_ID = (envClientId && envClientId.trim().length > 10 ? envClientId : DEFAULT_CLIENT_ID)
  .trim()
  .replace(/['"]/g, '');

export const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('error_description') || hashParams.get('error_description') || null;
  });

  const saveGoogleSession = (userData: any, token: string) => {
    const session = {
      user: {
        id: userData.sub || `google-${Date.now()}`,
        email: userData.email || '',
        user_metadata: {
          full_name: userData.name || userData.given_name || userData.email?.split('@')[0] || 'Google User',
          avatar_url: userData.picture || '',
        },
        created_at: new Date().toISOString(),
      },
      access_token: token,
    };
    localStorage.setItem('signmeet_google_session', JSON.stringify(session));
    window.dispatchEvent(new Event('signmeet_auth_change'));
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Render Google Identity Services (GIS) button and initialize SDK
  useEffect(() => {
    const initGsi = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: async (response: any) => {
              if (response.credential) {
                const userData = parseJwt(response.credential);
                if (userData) {
                  saveGoogleSession(userData, response.credential);
                }
              }
            },
          });

          const btnContainer = document.getElementById('gsi-official-button');
          if (btnContainer && btnContainer.children.length === 0) {
            window.google.accounts.id.renderButton(btnContainer, {
              type: 'standard',
              theme: 'outline',
              size: 'large',
              text: 'continue_with',
              shape: 'rectangular',
              width: 380,
            });
          }
        } catch (e) {
          console.warn('Google GSI initialization notice:', e);
        }
      }
    };

    initGsi();
    const interval = setInterval(initGsi, 1000);
    return () => clearInterval(interval);
  }, []);

  // Handle URL hash redirect parsing (e.g. if redirected back with OAuth tokens)
  useEffect(() => {
    const handleUrlHash = async () => {
      const hash = window.location.hash;
      if (!hash) return;

      const params = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = params.get('access_token');
      const idToken = params.get('id_token');

      if (accessToken || idToken) {
        setLoading(true);
        try {
          let userData: any = null;
          if (accessToken) {
            const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (res.ok) {
              userData = await res.json();
            }
          }

          if (!userData && idToken) {
            userData = parseJwt(idToken);
          }

          if (userData && (userData.sub || userData.email)) {
            saveGoogleSession(userData, accessToken || idToken || '');
            window.history.replaceState(null, '', window.location.pathname);
          }
        } catch (err: any) {
          setErrorMessage('Failed to complete Google authentication from redirect.');
        } finally {
          setLoading(false);
        }
      }
    };

    handleUrlHash();
  }, []);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      if (window.google?.accounts?.oauth2) {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: 'openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          prompt: 'select_account',
          callback: async (response: any) => {
            if (response.error) {
              if (response.error === 'invalid_client') {
                setErrorMessage('Google Cloud is propagating your Client ID changes (takes ~5-15 mins). Please wait a few minutes and try again.');
              } else {
                setErrorMessage(`Google Sign-In Notice: ${response.error_description || response.error}`);
              }
              setLoading(false);
              return;
            }
            if (response.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${response.access_token}` },
                });
                const userData = await res.json();
                saveGoogleSession(userData, response.access_token);
              } catch (err: any) {
                setErrorMessage('Failed to fetch user profile from Google.');
              }
            }
            setLoading(false);
          },
        });
        client.requestAccessToken();
      } else {
        const redirectUri = window.location.origin;
        const authUrl =
          `https://accounts.google.com/o/oauth2/v2/auth?` +
          `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&response_type=token` +
          `&scope=${encodeURIComponent('openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')}` +
          `&prompt=select_account`;

        window.location.href = authUrl;
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while signing in with Google.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f8f9ff] text-[#121c2a] overflow-hidden">
      {/* Left Panel: Hero / Testimonial / Purpose */}
      <div className="w-full md:w-1/2 min-h-[450px] md:min-h-screen p-8 md:p-16 flex flex-col justify-between bg-gradient-to-br from-[#e9efff] via-[#f4f7ff] to-[#e6eeff] border-b md:border-b-0 md:border-r border-[#c3c6d6]/20 relative">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#0040a1 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        
        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0040a1] flex items-center justify-center text-white font-bold shadow-md">
            <span className="material-symbols-outlined text-[28px]">sign_language</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-2xl font-extrabold text-[#0040a1] tracking-tight">
              SignMeet <span className="text-[#4648d4]">AI</span>
            </span>
            <span className="text-[10px] uppercase font-bold text-[#00514a] tracking-widest -mt-1">
              Accessibility First
            </span>
          </div>
        </div>

        {/* Center Quote / Purpose Statement */}
        <div className="relative z-10 my-auto py-10 max-w-xl">
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-extrabold text-[#121c2a] leading-[1.25] tracking-tight mb-8">
            "SignMeet AI replaced manual interpreters, expensive captioners, and 3 translation tools for us."
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-[#0040a1]" />
            <p className="text-xs uppercase font-extrabold tracking-widest text-[#595c6b]">
              — HEAD OF ACCESSIBILITY, GLOBAL TECH ENTERPRISE
            </p>
          </div>
        </div>

        {/* Bottom Compliance & Badges */}
        <div className="relative z-10 text-xs font-semibold text-[#737686] flex flex-wrap items-center gap-3 md:gap-6 pt-6 border-t border-[#c3c6d6]/30">
          <span>WCAG 2.1 AAA</span>
          <span>•</span>
          <span>GDPR Compliant</span>
          <span>•</span>
          <span>Real-Time Interpretation</span>
        </div>
      </div>

      {/* Right Panel: Sign In Form */}
      <div className="w-full md:w-1/2 min-h-[550px] md:min-h-screen p-8 md:p-16 lg:p-24 flex flex-col justify-between bg-white relative">
        {/* Top Back Link */}
        <div className="flex justify-start">
          <button 
            onClick={() => window.location.href = '/'}
            className="flex items-center gap-2 text-sm font-semibold text-[#595c6b] hover:text-[#0040a1] transition-colors group cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to home
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-md mx-auto my-auto py-8 flex flex-col items-start text-left">
          {/* Sign In Badge Label */}
          <div className="mb-6">
            <div className="w-10 h-0.5 bg-[#0040a1] mb-2" />
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#737686]">SIGN IN</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#121c2a] tracking-tight mb-3">
            Welcome to SignMeet AI
          </h1>
          
          <p className="text-[#595c6b] text-sm md:text-base leading-relaxed mb-8">
            Continue with your Google Workspace to access your team's sign language interpretation dashboard and live meeting overlays.
          </p>

          {errorMessage && (
            <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs font-medium leading-relaxed mb-6">
              {errorMessage}
            </div>
          )}

          {/* Single Primary Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3.5 bg-[#0040a1] hover:bg-[#0056d2] text-white py-4 px-6 rounded-xl font-bold text-base shadow-lg shadow-[#0040a1]/25 hover:shadow-xl hover:shadow-[#0040a1]/35 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer group mb-8"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center p-1">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
            )}
            <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-[#737686] leading-relaxed text-left">
            By continuing, you agree to SignMeet AI's <a href="#" className="underline hover:text-[#0040a1]">Terms of Service</a> and <a href="#" className="underline hover:text-[#0040a1]">Privacy Policy</a>. New workspace? Your first sign-in creates it automatically.
          </p>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#9aa0a6] text-left">
          SignMeet AI · Real-time Sign Language Interpretation & Accessibility Platform
        </div>
      </div>
    </div>
  );
};
