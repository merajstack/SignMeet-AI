import React from 'react';
import { ActiveTab, UserProfile } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  onStartMeeting: (meetingUrl?: string) => void;
  onOpenExtension: () => void;
  onSignOut?: () => void;
  isNightMode?: boolean;
  onToggleNightMode?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onStartMeeting,
  onOpenExtension,
  onSignOut,
  isNightMode,
  onToggleNightMode,
}) => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#f8f9ff]/80 dark:bg-[#0b0f19]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#c3c6d6]/20 dark:border-[#1e293b] transition-colors">
      <div className="h-20 w-full px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1e293b] flex items-center justify-center p-0.5 shadow-md border border-[#0040a1]/15 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/logo.jpg" alt="SignMeet AI Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-xl font-bold text-[#0040a1] dark:text-[#38bdf8] tracking-tight">
              SignMeet <span className="text-[#4648d4] dark:text-[#818cf8]">AI</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-[#00514a] dark:text-[#34d399] tracking-wider -mt-1">
              Accessibility First
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => setActiveTab('home')}
            className={`font-body-md text-base transition-colors ${
              activeTab === 'home'
                ? 'text-[#0040a1] dark:text-[#38bdf8] font-bold border-b-2 border-[#0040a1] dark:border-[#38bdf8] pb-1'
                : 'text-[#424654] dark:text-[#94a3b8] hover:text-[#121c2a] dark:hover:text-white'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab('custom-signs')}
            className={`font-body-md text-base transition-colors ${
              activeTab === 'custom-signs'
                ? 'text-[#0040a1] dark:text-[#38bdf8] font-bold border-b-2 border-[#0040a1] dark:border-[#38bdf8] pb-1'
                : 'text-[#424654] dark:text-[#94a3b8] hover:text-[#121c2a] dark:hover:text-white'
            }`}
          >
            Custom Signs
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`font-body-md text-base transition-colors ${
              activeTab === 'dashboard'
                ? 'text-[#0040a1] dark:text-[#38bdf8] font-bold border-b-2 border-[#0040a1] dark:border-[#38bdf8] pb-1'
                : 'text-[#424654] dark:text-[#94a3b8] hover:text-[#121c2a] dark:hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`font-body-md text-base transition-colors ${
              activeTab === 'settings'
                ? 'text-[#0040a1] dark:text-[#38bdf8] font-bold border-b-2 border-[#0040a1] dark:border-[#38bdf8] pb-1'
                : 'text-[#424654] dark:text-[#94a3b8] hover:text-[#121c2a] dark:hover:text-white'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* Action Buttons & Profile */}
        <div className="flex items-center gap-3">
          {onToggleNightMode && (
            <button
              onClick={onToggleNightMode}
              className="p-2 rounded-full text-[#424654] dark:text-[#94a3b8] hover:bg-[#eff4ff] dark:hover:bg-[#1e293b] transition-colors flex items-center justify-center cursor-pointer"
              title={isNightMode ? 'Switch to Light Mode' : 'Switch to Night Mode'}
            >
              <span className="material-symbols-outlined text-[22px] text-amber-500">
                {isNightMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          )}

          <button
            onClick={onOpenExtension}
            className="hidden lg:flex items-center gap-2 bg-[#eff4ff] dark:bg-[#1e293b] text-[#0040a1] dark:text-[#38bdf8] px-4 py-2 rounded-full font-label-sm text-sm hover:bg-[#dee9fc] dark:hover:bg-[#334155] transition-colors border border-[#c3c6d6]/40 dark:border-[#334155]"
            title="Launch Floating Chrome Extension Overlay"
          >
            <span className="material-symbols-outlined text-[18px]">extension</span>
            Open Extension Widget
          </button>

          <button
            id="navbar-start-meeting"
            onClick={() => onStartMeeting()}
            className="bg-[#0040a1] dark:bg-[#0284c7] text-white px-5 py-2.5 rounded-full font-label-sm text-sm hover:bg-[#0056d2] dark:hover:bg-[#0369a1] transition-all flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Start Meeting
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="w-10 h-10 rounded-full bg-[#0040a1] text-white flex items-center justify-center font-bold shadow-md hover:ring-2 hover:ring-[#4648d4] transition-all overflow-hidden"
            title={userProfile.fullName}
          >
            {userProfile.avatarUrl ? (
              <img src={userProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-[22px]">person</span>
            )}
          </button>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="p-2 rounded-full text-[#737686] dark:text-[#94a3b8] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center justify-center"
              title="Sign Out"
            >
              <span className="material-symbols-outlined text-[22px]">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
