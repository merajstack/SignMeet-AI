import React, { useState } from 'react';
import { UserProfile } from '../types';

interface SettingsPageProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'accessibility' | 'integrations' | 'privacy'>('accessibility');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(userProfile.fullName);
  const [displayName, setDisplayName] = useState(userProfile.displayName);
  const [email, setEmail] = useState(userProfile.email);
  const [dialect, setDialect] = useState(userProfile.dialect);
  const [fontSize, setFontSize] = useState(userProfile.captionFontSize || 20);
  const [highContrast, setHighContrast] = useState(userProfile.highContrast || false);
  const [autoSpeak, setAutoSpeak] = useState(userProfile.autoSpeak ?? true);
  const [cloudStorage, setCloudStorage] = useState(userProfile.cloudStorage ?? true);
  const [aiConsent, setAiConsent] = useState(userProfile.aiTrainingConsent ?? false);

  const handleSave = () => {
    onUpdateProfile({
      fullName,
      displayName,
      email,
      dialect,
      captionFontSize: fontSize,
      highContrast,
      autoSpeak,
      cloudStorage,
      aiTrainingConsent: aiConsent,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#f8f9ff] pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="font-display text-3xl font-extrabold text-[#121c2a]">Settings & Accessibility</h1>
          <p className="font-body-lg text-base text-[#424654] mt-1">
            Customize your sign language recognition, live caption preferences, and security options.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#c3c6d6]/40 space-x-8">
          <button
            onClick={() => setActiveTab('accessibility')}
            className={`pb-4 font-headline-md text-base transition-colors flex items-center gap-2 ${
              activeTab === 'accessibility'
                ? 'text-[#0040a1] border-b-2 border-[#0040a1] font-bold'
                : 'text-[#737785] hover:text-[#121c2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">accessibility_new</span>
            Accessibility & Sign
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 font-headline-md text-base transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'text-[#0040a1] border-b-2 border-[#0040a1] font-bold'
                : 'text-[#737785] hover:text-[#121c2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">person</span>
            Profile Settings
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`pb-4 font-headline-md text-base transition-colors flex items-center gap-2 ${
              activeTab === 'integrations'
                ? 'text-[#0040a1] border-b-2 border-[#0040a1] font-bold'
                : 'text-[#737785] hover:text-[#121c2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">extension</span>
            Integrations
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`pb-4 font-headline-md text-base transition-colors flex items-center gap-2 ${
              activeTab === 'privacy'
                ? 'text-[#0040a1] border-b-2 border-[#0040a1] font-bold'
                : 'text-[#737785] hover:text-[#121c2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">lock</span>
            Privacy & Security
          </button>
        </div>

        {/* TAB 1: ACCESSIBILITY */}
        {activeTab === 'accessibility' && (
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-8 bg-white p-8 rounded-3xl border border-[#c3c6d6]/30 shadow-sm space-y-8">
              
              {/* Dialect */}
              <div className="space-y-3">
                <label className="font-headline-lg text-lg text-[#121c2a] block">
                  Preferred Sign Language Dialect
                </label>
                <p className="text-xs text-[#424654]">
                  Select the sign language model optimized for your regional dialect.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'ASL', name: 'American Sign Language (ASL)', region: 'North America' },
                    { id: 'BSL', name: 'British Sign Language (BSL)', region: 'United Kingdom' },
                    { id: 'Auslan', name: 'Australian Sign Language (Auslan)', region: 'Australia' },
                    { id: 'IS', name: 'International Sign (IS)', region: 'Global' },
                  ].map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setDialect(item.id as any)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        dialect === item.id
                          ? 'border-[#0040a1] bg-[#eff4ff]'
                          : 'border-[#c3c6d6]/30 hover:border-[#0040a1]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#121c2a]">{item.id}</span>
                        {dialect === item.id && (
                          <span className="material-symbols-outlined text-[#0040a1] text-[20px]">check_circle</span>
                        )}
                      </div>
                      <p className="text-xs text-[#424654] mt-1">{item.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Caption Font Size Slider */}
              <div className="space-y-4 pt-6 border-t border-[#c3c6d6]/30">
                <div className="flex justify-between items-center">
                  <label className="font-headline-lg text-lg text-[#121c2a]">
                    Subtitle Font Size
                  </label>
                  <span className="font-mono text-sm font-bold text-[#0040a1]">{fontSize}px</span>
                </div>

                <input
                  type="range"
                  min={14}
                  max={36}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-[#dee9fc] rounded-lg appearance-none cursor-pointer accent-[#0040a1]"
                />

                {/* Live Preview Box */}
                <div className="p-4 bg-[#121c2a] text-white rounded-2xl border border-white/10 mt-2">
                  <span className="text-[10px] text-[#89f5e7] uppercase tracking-wider block font-bold mb-1">
                    Live Subtitle Stage Preview
                  </span>
                  <p style={{ fontSize: `${fontSize}px` }} className="font-bold leading-tight text-white">
                    "AI Interpreter: SignMeet converts signs into text instantly."
                  </p>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-4 pt-6 border-t border-[#c3c6d6]/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-headline-md text-base text-[#121c2a]">Auto-Speak Aloud Translated Signs</h4>
                    <p className="text-xs text-[#424654]">Automatically synthesize speech when you perform a sign language gesture.</p>
                  </div>
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`w-12 h-6 rounded-full transition-colors p-1 ${
                      autoSpeak ? 'bg-[#0040a1]' : 'bg-[#c3c6d6]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      autoSpeak ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-headline-md text-base text-[#121c2a]">High Contrast Accessibility Theme</h4>
                    <p className="text-xs text-[#424654]">Enhance UI border definition and text contrast ratios for WCAG AAA compliance.</p>
                  </div>
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`w-12 h-6 rounded-full transition-colors p-1 ${
                      highContrast ? 'bg-[#0040a1]' : 'bg-[#c3c6d6]'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      highContrast ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleSave}
                className="bg-[#0040a1] text-white px-8 py-3 rounded-full font-label-sm hover:bg-[#0056d2] transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                Save Accessibility Settings
              </button>

              {saveSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Settings saved successfully!
                </div>
              )}
            </div>

            {/* Side Card */}
            <div className="md:col-span-4 bg-[#eff4ff] p-6 rounded-3xl border border-[#c3c6d6]/30 space-y-4">
              <span className="material-symbols-outlined text-[#0040a1] text-[36px]">support_agent</span>
              <h3 className="font-headline-lg text-xl text-[#121c2a]">Accessibility Support</h3>
              <p className="text-xs text-[#424654] leading-relaxed">
                Need customized gestures for specialized medical or technical terminology? Our team builds custom sign models for enterprise organizations.
              </p>
              <button
                onClick={() => alert("Enterprise sign customization request submitted!")}
                className="w-full bg-white text-[#0040a1] border border-[#0040a1] py-2 rounded-full font-label-sm text-xs hover:bg-[#dee9fc]"
              >
                Request Custom Sign
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl border border-[#c3c6d6]/30 shadow-sm max-w-2xl space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-[#0040a1] text-white flex items-center justify-center text-2xl font-bold">
                SJ
              </div>
              <div>
                <h3 className="font-headline-lg text-xl text-[#121c2a]">{fullName}</h3>
                <span className="px-2.5 py-0.5 bg-[#0040a1]/10 text-[#0040a1] rounded-full text-xs font-bold uppercase">
                  {userProfile.subscriptionPlan} Member
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-[#c3c6d6]/30">
              <div>
                <label className="text-xs font-bold text-[#424654] uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d6]/40 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#424654] uppercase block mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d6]/40 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#424654] uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-[#f8f9ff] border border-[#c3c6d6]/40 rounded-xl text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="bg-[#0040a1] text-white px-8 py-3 rounded-full font-label-sm hover:bg-[#0056d2]"
            >
              Update Profile
            </button>
          </div>
        )}

        {/* TAB 3: INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="bg-white p-8 rounded-3xl border border-[#c3c6d6]/30 shadow-sm space-y-6">
            <h2 className="font-headline-lg text-2xl text-[#121c2a]">Connected Platforms</h2>

            <div className="space-y-4">
              <div className="p-4 border border-[#c3c6d6]/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0040a1]/10 text-[#0040a1] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">extension</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#121c2a]">Google Meet Chrome Extension</h4>
                    <p className="text-xs text-[#424654]">Floating subtitle & webcam landmark interpreter overlay.</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Connected</span>
              </div>

              <div className="p-4 border border-[#c3c6d6]/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4648d4]/10 text-[#4648d4] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">videocam</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#121c2a]">Zoom Virtual Camera Driver</h4>
                    <p className="text-xs text-[#424654]">Stream sign translations directly into Zoom camera input.</p>
                  </div>
                </div>
                <button
                  onClick={() => alert("Downloading SignMeet Universal Virtual Camera Driver installer...")}
                  className="bg-[#0040a1] text-white px-4 py-2 rounded-full text-xs font-bold"
                >
                  Download Driver
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRIVACY */}
        {activeTab === 'privacy' && (
          <div className="bg-white p-8 rounded-3xl border border-[#c3c6d6]/30 shadow-sm space-y-6">
            <h2 className="font-headline-lg text-2xl text-[#121c2a]">Privacy & Security</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-[#c3c6d6]/30 rounded-2xl">
                <div>
                  <h4 className="font-bold text-sm text-[#121c2a]">Cloud Transcript Storage</h4>
                  <p className="text-xs text-[#424654]">Encrypt and store past sign language translations securely in cloud database.</p>
                </div>
                <button
                  onClick={() => setCloudStorage(!cloudStorage)}
                  className={`w-12 h-6 rounded-full p-1 ${cloudStorage ? 'bg-[#0040a1]' : 'bg-[#c3c6d6]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${cloudStorage ? 'translate-x-6' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-[#c3c6d6]/30 rounded-2xl">
                <div>
                  <h4 className="font-bold text-sm text-[#121c2a]">Anonymous AI Gesture Training</h4>
                  <p className="text-xs text-[#424654]">Opt-in to help improve sign language accuracy for rare regional dialects.</p>
                </div>
                <button
                  onClick={() => setAiConsent(!aiConsent)}
                  className={`w-12 h-6 rounded-full p-1 ${aiConsent ? 'bg-[#0040a1]' : 'bg-[#c3c6d6]'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${aiConsent ? 'translate-x-6' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
