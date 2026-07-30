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

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [showExtensionOverlay, setShowExtensionOverlay] = useState(false);
  const [showDictionaryModal, setShowDictionaryModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryTranscriptText, setSummaryTranscriptText] = useState('');

  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: 'u-123',
    fullName: 'Sarah Jenkins',
    displayName: 'Sarah',
    email: 'sarah.jenkins@example.com',
    avatarUrl: '',
    role: 'user',
    subscriptionPlan: 'pro',
    memberSince: '2023',
    dialect: 'ASL',
    captionFontSize: 20,
    highContrast: false,
    speechRate: 1.0,
    speechVoice: '',
    autoSpeak: true,
    cloudStorage: true,
    aiTrainingConsent: false,
  });

  const [meetings, setMeetings] = useState<MeetingSession[]>([]);

  useEffect(() => {
    fetch('/api/meetings')
      .then((res) => res.json())
      .then((data) => setMeetings(data))
      .catch((err) => console.warn('Failed to load meetings:', err));
  }, []);

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleOpenSummary = (text: string) => {
    setSummaryTranscriptText(text);
    setShowSummaryModal(true);
  };

  return (
    <div className={`min-h-screen w-full bg-[#f8f9ff] text-[#121c2a] ${userProfile.highContrast ? 'contrast-125' : ''}`}>
      {/* Navigation Header (Hidden in Live Meeting for full screen focus) */}
      {activeTab !== 'meetings' && (
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userProfile={userProfile}
          onStartMeeting={() => setActiveTab('meetings')}
          onOpenExtension={() => setShowExtensionOverlay(true)}
        />
      )}

      {/* Main Content Tabs */}
      <main className="w-full">
        {activeTab === 'home' && (
          <LandingPage
            onStartMeeting={() => setActiveTab('meetings')}
            onOpenExtension={() => setShowExtensionOverlay(true)}
            onOpenDictionary={() => setActiveTab('custom-signs')}
          />
        )}

        {activeTab === 'meetings' && (
          <MeetingRoom
            userProfile={userProfile}
            onEndMeeting={() => setActiveTab('dashboard')}
            onOpenSummaryModal={handleOpenSummary}
          />
        )}

        {activeTab === 'custom-signs' && (
          <CustomSignsPage
            onStartMeeting={() => setActiveTab('meetings')}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            userProfile={userProfile}
            meetings={meetings}
            onStartMeeting={() => setActiveTab('meetings')}
            onOpenExtension={() => setShowExtensionOverlay(true)}
            onOpenDictionary={() => setActiveTab('custom-signs')}
            onSelectMeeting={(m) => {
              handleOpenSummary(m.transcripts.map((t) => `${t.sender}: ${t.originalText}`).join('\n'));
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
