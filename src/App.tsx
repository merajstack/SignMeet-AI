import React, { useState, useEffect } from 'react';
import { ActiveTab, MeetingSession, UserProfile } from './types';
import { Navigation } from './components/Navigation';
import { LandingPage } from './components/LandingPage';
import { MeetingRoom } from './components/MeetingRoom';
import { Dashboard } from './components/Dashboard';
import { CustomSignsPage } from './components/CustomSignsPage';
import { SettingsPage } from './components/SettingsPage';
import { ChromeExtensionOverlay } from './components/ChromeExtensionOverlay';
import { ASLDictionaryModal } from './components/ASLDictionaryModal';
import { SmartSummaryModal } from './components/SmartSummaryModal';
import { Auth } from './components/Auth';
import { supabase } from './lib/supabaseClient';

export default function App() {
  const [session, setSession] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showExtensionOverlay, setShowExtensionOverlay] = useState(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryTranscriptText, setSummaryTranscriptText] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [meetings, setMeetings] = useState<MeetingSession[]>([]);
  const [activeMeetingUrl, setActiveMeetingUrl] = useState<string>('');

  const checkSession = () => {
    const localGoogleSession = localStorage.getItem('signmeet_google_session');
    if (localGoogleSession) {
      try {
        const parsed = JSON.parse(localGoogleSession);
        if (parsed && parsed.user) {
          setSession(parsed);
          initUserProfile(parsed.user);
          return;
        }
      } catch (e) {
        localStorage.removeItem('signmeet_google_session');
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        initUserProfile(session.user);
      }
    });
  };

  useEffect(() => {
    checkSession();

    const handleAuthChange = () => {
      checkSession();
    };

    window.addEventListener('signmeet_auth_change', handleAuthChange);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setSession(session);
        initUserProfile(session.user);
      } else if (!localStorage.getItem('signmeet_google_session')) {
        setSession(null);
        setUserProfile(null);
      }
    });

    return () => {
      window.removeEventListener('signmeet_auth_change', handleAuthChange);
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    localStorage.removeItem('signmeet_google_session');
    try {
      await supabase.auth.signOut();
    } catch (e) {}
    setSession(null);
    setUserProfile(null);
  };

  const initUserProfile = (user: any) => {
    setUserProfile({
      id: user.id,
      fullName: user.user_metadata?.full_name || 'User',
      displayName: user.user_metadata?.full_name?.split(' ')[0] || 'User',
      email: user.email || '',
      avatarUrl: user.user_metadata?.avatar_url || '',
      role: 'user',
      subscriptionPlan: 'pro',
      memberSince: new Date(user.created_at || Date.now()).getFullYear().toString(),
      dialect: 'ASL',
      captionFontSize: 20,
      highContrast: false,
      speechRate: 1.0,
      speechVoice: '',
      autoSpeak: true,
      cloudStorage: true,
      aiTrainingConsent: false,
    });
  };

  useEffect(() => {
    if (!session) return;
    
    // Fetch meetings from Supabase
    const fetchMeetings = async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (data) {
        setMeetings(data);
      }
    };
    
    fetchMeetings();
  }, [session]);

  // Parse URL query parameter or hash on load to handle meeting links automatically
  useEffect(() => {
    const handleUrlRoute = () => {
      const params = new URLSearchParams(window.location.search);
      const meetingParam = params.get('meeting') || params.get('join') || params.get('room') || params.get('url');
      const pathname = window.location.pathname;

      let targetMeeting = meetingParam || '';

      if (!targetMeeting && (pathname.startsWith('/join/') || pathname.startsWith('/meet/'))) {
        targetMeeting = pathname.split('/')[2];
      }

      if (!targetMeeting && window.location.hash.includes('meeting')) {
        targetMeeting = window.location.hash.replace('#meeting', '').replace('=', '').replace('/', '') || 'meet-live';
      }

      if (targetMeeting) {
        const fullUrl = targetMeeting.startsWith('http') ? targetMeeting : `https://signmeet.ai/join/${targetMeeting}`;
        setActiveMeetingUrl(fullUrl);
        setActiveTab('meetings');
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);

    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  const handleStartMeeting = (urlOrCode?: string) => {
    if (urlOrCode && urlOrCode.trim()) {
      const cleaned = urlOrCode.trim();
      const fullUrl = cleaned.startsWith('http') ? cleaned : `https://signmeet.ai/join/${cleaned}`;
      setActiveMeetingUrl(fullUrl);
      try {
        const newUrl = new URL(window.location.href);
        const code = cleaned.replace('https://signmeet.ai/join/', '');
        newUrl.searchParams.set('meeting', code);
        window.history.pushState({}, '', newUrl.toString());
      } catch (_) {}
    } else {
      const defaultCode = `meet-${Math.floor(100000 + Math.random() * 900000)}`;
      setActiveMeetingUrl(`https://signmeet.ai/join/${defaultCode}`);
    }
    setActiveTab('meetings');
  };

  const handleEndMeeting = () => {
    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('meeting');
      newUrl.searchParams.delete('join');
      newUrl.searchParams.delete('room');
      newUrl.searchParams.delete('url');
      window.history.pushState({}, '', newUrl.pathname);
    } catch (_) {}
    setActiveTab('dashboard');
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => prev ? { ...prev, ...updated } : null);
  };

  const handleOpenSummary = (text: string) => {
    setSummaryTranscriptText(text);
    setShowSummaryModal(true);
  };

  if (!session || !userProfile) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen w-full bg-[#f8f9ff] text-[#121c2a] ${userProfile?.highContrast ? 'contrast-125' : ''}`}>
      {/* Navigation Header */}
      {activeTab !== 'meetings' && (
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          onStartMeeting={handleStartMeeting}
          onOpenExtension={() => setShowExtensionOverlay(true)}
          onSignOut={handleSignOut}
        />
      )}

      {/* Main Content Tabs */}
      <main className="w-full">
        {activeTab === 'home' && (
          <LandingPage
            onStartMeeting={handleStartMeeting}
            onOpenExtension={() => setShowExtensionOverlay(true)}
            onOpenDictionary={() => setActiveTab('custom-signs')}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingRoom
            userProfile={userProfile}
            meetingUrl={activeMeetingUrl}
            onEndMeeting={handleEndMeeting}
            onOpenSummaryModal={handleOpenSummary}
          />
        )}

        {activeTab === 'custom-signs' && (
          <CustomSignsPage
            onStartMeeting={handleStartMeeting}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            meetings={meetings}
            onStartMeeting={handleStartMeeting}
            onOpenExtension={() => setShowExtensionOverlay(true)}
            onOpenDictionary={() => setActiveTab('custom-signs')}
            onSelectMeeting={(m) => {
              handleOpenSummary(m.transcripts?.map((t: any) => `${t.sender}: ${t.originalText}`).join('\n') || '');
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Floating Chrome Extension Widget Overlay */}
      {showExtensionOverlay && (
        <ChromeExtensionOverlay
          onClose={() => setShowExtensionOverlay(false)}
          onOpenFullApp={() => {
            setShowExtensionOverlay(false);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* Floating Extension Button at Bottom */}
      {!showExtensionOverlay && (
        <button
          onClick={() => setShowExtensionOverlay(true)}
          className="fixed bottom-6 right-6 z-50 bg-[#0040a1] text-white p-4 rounded-full shadow-2xl hover:bg-[#0056d2] transition-transform hover:scale-110 flex items-center justify-center"
          title="Open Extension Widget"
        >
          <span className="material-symbols-outlined text-[28px]">extension</span>
        </button>
      )}

      {/* ASL Sign Dictionary Modal */}
      {showDictionaryModal && (
        <ASLDictionaryModal
          onClose={() => setShowDictionaryModal(false)}
          onSelectSignToPractice={() => {
            setShowDictionaryModal(false);
            setActiveTab('meetings');
          }}
        />
      )}

      {/* Gemini AI Meeting Summary Modal */}
      {showSummaryModal && (
        <SmartSummaryModal
          transcriptText={summaryTranscriptText}
          onClose={() => setShowSummaryModal(false)}
        />
      )}
    </div>
  );
}
