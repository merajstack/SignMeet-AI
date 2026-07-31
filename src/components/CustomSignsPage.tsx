import React, { useState, useEffect } from 'react';
import { HandSignGraphic } from './HandSignGraphic';

export interface CustomSignItem {
  id: string;
  title: string;
  defaultVal: string;
  handshape: string;
  description: string;
  badge: string;
}

export const BASE_CUSTOM_SIGNS: CustomSignItem[] = [
  {
    id: 'open palm',
    title: 'open palm',
    defaultVal: 'I',
    handshape: 'Open Palm (5 fingers extended)',
    description: 'Flat open hand with all five fingers extended straight up towards camera.',
    badge: 'Pronoun / Self'
  },
  {
    id: 'thumbs up',
    title: 'thumbs up',
    defaultVal: 'Okay',
    handshape: 'Thumbs Up (Closed fist with thumb up)',
    description: 'Fist with thumb pointing straight up indicating agreement or Okay.',
    badge: 'Affirmation'
  },
  {
    id: 'thumbs down',
    title: 'thumbs down',
    defaultVal: 'No',
    handshape: 'Thumbs Down (Closed fist with thumb down)',
    description: 'Fist with thumb pointing straight down indicating refusal or No.',
    badge: 'Negation'
  },
  {
    id: 'index',
    title: 'index',
    defaultVal: 'Question',
    handshape: 'Single Index Finger Up',
    description: 'Single index finger pointing vertically upward to ask a question.',
    badge: 'Inquiry'
  },
  {
    id: 'index middle',
    title: 'index middle',
    defaultVal: 'Wait',
    handshape: 'Index & Middle Fingers Up (V-shape)',
    description: 'Index and middle fingers extended upwards together (V-shape) indicating Wait.',
    badge: 'Command'
  },
  {
    id: 'Four fingers (thumb folded)',
    title: 'Four fingers (thumb folded)',
    defaultVal: 'Help',
    handshape: '4 Fingers Up (Thumb Folded Across Palm)',
    description: 'Four fingers extended vertically with thumb folded across palm indicating Help.',
    badge: 'Urgent / Request'
  }
];

const STORAGE_KEY = 'signmeet_custom_signs';

export function getCustomSignValues(): Record<string, string> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to parse custom signs from localStorage', e);
  }
  const defaults: Record<string, string> = {};
  BASE_CUSTOM_SIGNS.forEach(s => {
    defaults[s.id] = s.defaultVal;
  });
  return defaults;
}

export function saveCustomSignValues(values: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch (e) {
    console.warn('Failed to save custom signs to localStorage', e);
  }
}

import { fetchCustomSigns, saveCustomSigns } from '../services/supabaseService';

interface CustomSignsPageProps {
  onStartMeeting: () => void;
  userId?: string;
}

export const CustomSignsPage: React.FC<CustomSignsPageProps> = ({ onStartMeeting, userId }) => {
  const [signValues, setSignValues] = useState<Record<string, string>>(() => getCustomSignValues());
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  useEffect(() => {
    const loadFromCloud = async () => {
      const cloudSigns = await fetchCustomSigns(userId);
      if (cloudSigns && Object.keys(cloudSigns).length > 0) {
        setSignValues(prev => ({ ...prev, ...cloudSigns }));
      }
    };
    loadFromCloud();
  }, [userId]);

  const handleValueChange = (id: string, newValue: string) => {
    setSignValues(prev => {
      const updated = { ...prev, [id]: newValue };
      saveCustomSigns(updated, userId);
      return updated;
    });
    setSavedNotice(id);
    setTimeout(() => {
      setSavedNotice(null);
    }, 1500);
  };

  const handleResetDefaults = () => {
    const defaults: Record<string, string> = {};
    BASE_CUSTOM_SIGNS.forEach(s => {
      defaults[s.id] = s.defaultVal;
    });
    setSignValues(defaults);
    saveCustomSigns(defaults, userId);
  };

  return (
    <div className="pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#c3c6d6]/20 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff4ff] text-[#0040a1] text-xs font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[16px]">tune</span>
            Dynamic Custom Sign Mapping
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#121c2a] tracking-tight">
            Custom Signs Vocabulary
          </h1>
          <p className="text-[#424654] mt-2 text-base max-w-2xl">
            Assign custom dynamic translation values for each hand sign below. 
            When you perform any gesture in the camera meeting, your custom phrase will translate instantly in live captions!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleResetDefaults}
            className="bg-white border border-[#c3c6d6] hover:bg-[#f8f9ff] text-[#121c2a] px-4 py-3 rounded-2xl font-bold text-xs shadow-sm transition-all flex items-center gap-2"
            title="Reset all sign values to original defaults"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset Defaults
          </button>
          
          <button
            onClick={onStartMeeting}
            className="bg-[#0040a1] hover:bg-[#0056d2] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">videocam</span>
            Test Live in Meeting
          </button>
        </div>
      </div>

      {/* Grid of Custom Signs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BASE_CUSTOM_SIGNS.map((item) => {
          const currentValue = signValues[item.id] !== undefined ? signValues[item.id] : item.defaultVal;
          const isJustSaved = savedNotice === item.id;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#c3c6d6]/30 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
            >
              {/* Image Banner */}
              <div className="relative h-52 bg-[#93ccff] overflow-hidden flex items-center justify-center p-2">
                <div className="w-full h-full group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                  <HandSignGraphic signId={item.id} className="w-full h-full max-h-48" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121c2a]/60 via-transparent to-transparent pointer-events-none"></div>
                
                <span className="absolute top-4 left-4 bg-[#121c2a]/80 backdrop-blur-md text-[#89f5e7] border border-[#89f5e7]/30 text-xs font-bold px-3 py-1 rounded-full">
                  {item.badge}
                </span>

                {/* Handshape Overlay Tag */}
                <div className="absolute bottom-3 left-4 text-[#033b82] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-extrabold shadow-md flex items-center gap-2 border border-[#93ccff]">
                  <div className="w-6 h-6 rounded-md overflow-hidden shrink-0 border border-[#93ccff]">
                    <HandSignGraphic signId={item.id} className="w-full h-full" />
                  </div>
                  <span>{item.handshape}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#00514a] font-bold bg-[#eff4ff] px-2.5 py-1 rounded-md">
                      Sign Name
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active in Vision AI
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#121c2a] capitalize mb-4">
                    {item.title}
                  </h3>

                  {/* Dynamic Editable Value Input */}
                  <div className="bg-[#f0f4fd] border border-[#0040a1]/30 focus-within:border-[#0040a1] focus-within:ring-2 focus-within:ring-[#0040a1]/20 rounded-2xl p-4 mb-4 transition-all">
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor={`input-${item.id}`} className="text-xs uppercase font-bold text-[#0040a1] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                        Set Custom Value:
                      </label>
                      {isJustSaved && (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full animate-bounce">
                          ✓ Auto-Saved
                        </span>
                      )}
                    </div>

                    <input
                      id={`input-${item.id}`}
                      type="text"
                      value={currentValue}
                      onChange={(e) => handleValueChange(item.id, e.target.value)}
                      placeholder={`Enter phrase for ${item.title}...`}
                      className="w-full bg-white text-[#121c2a] font-black text-xl px-3 py-2 rounded-xl border border-[#c3c6d6]/60 focus:outline-none shadow-inner"
                    />
                  </div>

                  <p className="text-sm text-[#424654] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Action */}
                <div className="mt-6 pt-4 border-t border-[#c3c6d6]/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#00514a] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">center_focus_strong</span>
                    MediaPipe Vision
                  </span>
                  <button
                    onClick={onStartMeeting}
                    className="text-xs font-bold text-[#0040a1] hover:text-[#0056d2] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    Test Sign
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
