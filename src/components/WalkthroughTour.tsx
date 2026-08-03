import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab } from '../types';

export type TourStep =
  | 'STEP_1_NAVBAR_CUSTOM_SIGNS'
  | 'STEP_1_NOTE'
  | 'STEP_2_NAVBAR_LOGO'
  | 'STEP_3_LANDING_START_MEETING'
  | 'STEP_4_MEETING_NOTE'
  | 'COMPLETED';

interface WalkthroughTourProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
}

export const WalkthroughTour: React.FC<WalkthroughTourProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  onRestart,
}) => {
  const [step, setStep] = useState<TourStep>('STEP_1_NAVBAR_CUSTOM_SIGNS');
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  // Initialize or handle visibility
  useEffect(() => {
    if (isOpen) {
      setStep('STEP_1_NAVBAR_CUSTOM_SIGNS');
    }
  }, [isOpen]);

  // Track activeTab changes to auto-advance steps when user interacts with target elements
  useEffect(() => {
    if (!isOpen) return;

    if (step === 'STEP_1_NAVBAR_CUSTOM_SIGNS' && activeTab === 'custom-signs') {
      setStep('STEP_1_NOTE');
    } else if (step === 'STEP_2_NAVBAR_LOGO' && activeTab === 'home') {
      setStep('STEP_3_LANDING_START_MEETING');
    } else if (step === 'STEP_3_LANDING_START_MEETING' && activeTab === 'meetings') {
      setStep('STEP_4_MEETING_NOTE');
    }
  }, [activeTab, step, isOpen]);

  // Measure target bounding rectangle dynamically
  const updateTargetRect = useCallback(() => {
    let elementId = '';
    if (step === 'STEP_1_NAVBAR_CUSTOM_SIGNS') {
      elementId = 'nav-custom-signs';
    } else if (step === 'STEP_2_NAVBAR_LOGO') {
      elementId = 'nav-logo';
    } else if (step === 'STEP_3_LANDING_START_MEETING') {
      elementId = 'hero-start-meeting';
    }

    if (elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
        return;
      }
    }
    setTargetRect(null);
  }, [step]);

  useEffect(() => {
    if (!isOpen) return;

    updateTargetRect();
    const interval = setInterval(updateTargetRect, 200);
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect);
    };
  }, [isOpen, updateTargetRect, activeTab, step]);

  const handleFinish = () => {
    localStorage.setItem('signmeet_walkthrough_completed', 'true');
    setStep('COMPLETED');
    onClose();
  };

  const handleNextStepFromNote1 = () => {
    setStep('STEP_2_NAVBAR_LOGO');
  };

  if (!isOpen || step === 'COMPLETED') {
    return null;
  }

  // Check if current step is a pointer arrow or note modal
  const isPointerStep =
    step === 'STEP_1_NAVBAR_CUSTOM_SIGNS' ||
    step === 'STEP_2_NAVBAR_LOGO' ||
    step === 'STEP_3_LANDING_START_MEETING';

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none transition-all">
      {/* Background Dim Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isPointerStep ? 'opacity-25' : 'opacity-60 pointer-events-auto'
        }`}
      />

      {/* Target Element Glowing Spotlight Border */}
      {isPointerStep && targetRect && (
        <div
          className="absolute rounded-xl border-2 border-[#0040a1] shadow-[0_0_20px_rgba(0,64,161,0.6)] pointer-events-none transition-all duration-300 animate-pulse"
          style={{
            top: `${targetRect.top - 6}px`,
            left: `${targetRect.left - 6}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
          }}
        />
      )}

      {/* Pointing Arrow & Tooltip for Target Element Steps */}
      {isPointerStep && targetRect && (
        <div
          className="absolute flex flex-col items-center pointer-events-none transition-all duration-300 z-[10000]"
          style={{
            top: `${targetRect.bottom + 12}px`,
            left: `${Math.max(16, Math.min(window.innerWidth - 320, targetRect.left + targetRect.width / 2 - 140))}px`,
          }}
        >
          {/* Realistic Pointer Arrow without any background color */}
          <div className="animate-bounce mb-1 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#0040a1] filter drop-shadow-[0_4px_10px_rgba(0,64,161,0.5)]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 3L4 12h5v9h6v-9h5L12 3z" />
            </svg>
          </div>

          {/* Premium Tooltip Card */}
          <div className="bg-white/95 backdrop-blur-xl text-[#121c2a] px-5 py-4 rounded-2xl shadow-[0_15px_40px_rgba(0,64,161,0.2)] border border-[#0040a1]/20 text-left max-w-[300px]">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0040a1] animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0040a1]">
                Interactive Tour • Step {step === 'STEP_1_NAVBAR_CUSTOM_SIGNS' ? '1 of 3' : step === 'STEP_2_NAVBAR_LOGO' ? '2 of 3' : '3 of 3'}
              </span>
            </div>
            <p className="text-sm font-semibold text-[#121c2a] leading-snug">
              {step === 'STEP_1_NAVBAR_CUSTOM_SIGNS' && '👉 Click the Custom Signs tab to manage your AI gestures.'}
              {step === 'STEP_2_NAVBAR_LOGO' && '👉 Click the SignMeet AI Logo to return to the Home page.'}
              {step === 'STEP_3_LANDING_START_MEETING' && "👉 Click 'Start Meeting' to launch the AI meeting room."}
            </p>
          </div>
        </div>
      )}

      {/* STEP 1 NOTE: Custom Signs Page Context Note */}
      {step === 'STEP_1_NOTE' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-2xl border border-[#0040a1]/20 rounded-3xl p-7 shadow-[0_25px_60px_rgba(0,64,161,0.2)] max-w-lg w-full transform animate-in fade-in zoom-in duration-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-[#0040a1]/10 text-[#0040a1] flex items-center justify-center mb-4 border border-[#0040a1]/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v5.5" />
              </svg>
            </div>

            <div className="inline-block mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#0040a1] bg-[#eff4ff] px-3 py-1 rounded-full border border-[#0040a1]/15">
                Guided Walkthrough
              </span>
            </div>

            <h3 className="font-headline-md text-2xl font-extrabold text-[#121c2a] mb-2 tracking-tight">
              Custom Signs Library 🖐️
            </h3>

            <p className="font-body-md text-base text-[#424654] leading-relaxed mb-6">
              Welcome to the Custom Signs section! Here you can register, record, and train custom sign gestures for your personalized AI dictionary. Custom signs enhance real-time translation accuracy during live video meetings.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#c3c6d6]/30">
              <span className="text-xs font-semibold text-[#737686]">Step 1 of 3 complete</span>
              <button
                onClick={handleNextStepFromNote1}
                className="bg-[#0040a1] text-white px-6 py-3 rounded-xl font-headline-md font-bold text-sm hover:bg-[#0056d2] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
              >
                <span>Next Step</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 NOTE: Meeting Room Brief Intro Note */}
      {step === 'STEP_4_MEETING_NOTE' && (
        <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-2xl border border-[#0040a1]/20 rounded-3xl p-7 shadow-[0_25px_60px_rgba(0,64,161,0.2)] max-w-lg w-full transform animate-in fade-in zoom-in duration-300 relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-500/20">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="inline-block mb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Walkthrough Complete!
              </span>
            </div>

            <h3 className="font-headline-md text-2xl font-extrabold text-[#121c2a] mb-2 tracking-tight">
              Welcome to Meeting Room! 🎉
            </h3>

            <p className="font-body-md text-base text-[#424654] leading-relaxed mb-6">
              You are now inside the AI Meeting Room! Here, experience real-time MediaPipe hand gesture tracking, speech-to-text captions, live ASL dictionary lookup, and automatic Gemini AI meeting transcript summaries.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-[#c3c6d6]/30">
              <span className="text-xs font-semibold text-[#737686]">Tour Finished</span>
              <button
                onClick={handleFinish}
                className="bg-emerald-600 text-white px-7 py-3 rounded-xl font-headline-md font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 cursor-pointer"
              >
                <span>Finish Tour 🚀</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
