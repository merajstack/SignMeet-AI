import React, { useState } from 'react';
import { speechService } from '../services/speechService';

interface ChromeExtensionOverlayProps {
  onClose: () => void;
  onOpenFullApp: () => void;
}

export const ChromeExtensionOverlay: React.FC<ChromeExtensionOverlayProps> = ({
  onClose,
  onOpenFullApp,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeSign, setActiveSign] = useState('HELLO EVERYONE');
  const [isTransparent, setIsTransparent] = useState(false);

  const handleTestSign = (signText: string) => {
    setActiveSign(signText);
    speechService.speak(signText);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 rounded-3xl transition-all shadow-2xl border ${
      isTransparent ? 'bg-[#121c2a]/70 backdrop-blur-md border-white/20' : 'bg-[#121c2a] border-[#89f5e7]/40'
    } text-white overflow-hidden`}>
      {/* Top Header */}
      <div className="p-3 bg-[#0040a1] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-5 h-5 rounded object-cover" />
          <span className="font-headline-md text-sm font-bold text-white">SignMeet Chrome Extension</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsTransparent(!isTransparent)}
            className="p-1 hover:bg-white/20 rounded text-xs"
            title="Toggle Glass Transparency"
          >
            <span className="material-symbols-outlined text-[16px]">opacity</span>
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded text-xs"
            title="Minimize"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isMinimized ? 'unfold_more' : 'remove'}
            </span>
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded text-xs"
            title="Close Extension"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      </div>

      {/* Main Extension Body */}
      {!isMinimized && (
        <div className="p-4 space-y-4">
          
          {/* Mini Webcam Preview Stage with Hand Skeleton */}
          <div className="relative h-44 bg-[#1c2636] rounded-2xl overflow-hidden border border-white/10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjnSvh3FrO-jia1WWbQ6TN2QyZobnvf1DOP2YfGmR8gN0kvsGcZZZVAxFvABLrlty-QBIhSUsdUDzIJAIJFA1EoRi95aMZz2Hs217WAhu0oMNJStfwbR17EzWA7i298_C4xRYkiLIWBjQzbEiJTGcbIIbAxjIG34JqOs9L9QFR4Cu-c9KXiojWEZZ2RuHFqG2YFTImsk0ViJuNQtds6tXz9dBiVSzn-sKQ8BwUY7geJus4BQ65P8iV"
              alt="Extension Camera Stream"
              className="w-full h-full object-cover"
            />
            
            {/* SVG Landmark Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
              <path d="M180,180 L190,160 L205,150 L220,160" stroke="#89f5e7" strokeWidth="2" fill="none" />
              <circle cx="180" cy="180" r="3" fill="#89f5e7" />
              <circle cx="190" cy="160" r="3" fill="#89f5e7" />
              <circle cx="205" cy="150" r="3" fill="#89f5e7" />
              <circle cx="220" cy="160" r="3" fill="#89f5e7" />
            </svg>

            <div className="absolute top-2 left-2 bg-[#121c2a]/80 px-2.5 py-1 rounded-full text-[10px] font-mono text-[#89f5e7] flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              Google Meet Connected
            </div>
          </div>

          {/* Subtitle Banner */}
          <div className="p-3 bg-white/10 rounded-xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#89f5e7] tracking-wider block mb-1">
              Live Interpretation Subtitle
            </span>
            <p className="font-caption-bold text-sm text-white">
              "{activeSign}"
            </p>
          </div>

          {/* Quick Sign Actions */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-white/60 uppercase">Quick Test Signs:</span>
            <div className="flex flex-wrap gap-1">
              {[
                "Hello everyone, nice to meet you!",
                "Thank you for joining today.",
                "Can you please repeat that?",
                "Accessibility is important."
              ].map((msg, i) => (
                <button
                  key={i}
                  onClick={() => handleTestSign(msg)}
                  className="px-2 py-1 bg-white/5 hover:bg-[#0040a1] text-xs text-white/90 rounded-lg transition-colors border border-white/10 text-left"
                >
                  💬 {msg.substring(0, 24)}...
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onOpenFullApp}
            className="w-full py-2.5 rounded-xl bg-[#0040a1] hover:bg-[#0056d2] text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">open_in_new</span>
            Open Full Workspace Dashboard
          </button>
        </div>
      )}
    </div>
  );
};
