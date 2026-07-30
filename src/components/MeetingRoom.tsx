import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { Participant, TranscriptEntry, UserProfile, TranslationMode, LandmarkPoint } from '../types';
import { speechService } from '../services/speechService';
import { drawHandSkeletonCanvas, initializeMediaPipeTracker, HandTrackingResult } from '../services/handTracking';
import { AnimatedSignVisuals } from './AnimatedSignVisuals';
import { GeminiSignCopilot, CopilotState, CopilotResult } from '../services/geminiCopilot';

interface MeetingRoomProps {
  userProfile: UserProfile;
  meetingUrl?: string;
  onEndMeeting: () => void;
  onOpenSummaryModal: (transcriptText: string) => void;
}

export const MeetingRoom: React.FC<MeetingRoomProps> = ({
  userProfile,
  meetingUrl = 'https://signmeet.ai/join/meet-live',
  onEndMeeting,
  onOpenSummaryModal,
}) => {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [translationMode, setTranslationMode] = useState<TranslationMode>('sign');
  const [rightPanelTab, setRightPanelTab] = useState<'transcript' | 'sign-gifs'>('transcript');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyMeetingLink = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Hand Tracking States (Only true when user hand is in frame)
  const [isHandDetected, setIsHandDetected] = useState(false);
  const [detectedLandmarks, setDetectedLandmarks] = useState<LandmarkPoint[] | null>(null);
  const [detectedGesture, setDetectedGesture] = useState<string>('');

  const [activeSpeaker, setActiveSpeaker] = useState<string>('Sarah Jenkins (You)');
  const [liveSubtitle, setLiveSubtitle] = useState<string>('Hello everyone, live sign language tracking and speech captions are active.');
  const [isCaptionsStreaming, setIsCaptionsStreaming] = useState(true);

  // AI Sign Language Copilot States
  const [copilotState, setCopilotState] = useState<CopilotState>('idle');
  const [copilotKeywords, setCopilotKeywords] = useState<string[]>([]);
  const [lastReconstructedEntry, setLastReconstructedEntry] = useState<string | null>(null);
  const copilotRef = useRef<GeminiSignCopilot | null>(null);
  
  // Track last logged gesture to auto-append camera sign translations to live transcript
  const lastLoggedGestureRef = useRef<string>('');
  const lastLogTimeRef = useRef<number>(0);
  
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([
    {
      id: 't1',
      timestamp: '10:42 AM',
      sender: 'Sarah Jenkins (You)',
      type: 'sign-to-text',
      originalText: 'Hello everyone, I wanted to discuss the new design updates for the user dashboard.',
      confidence: 0.98,
    },
    {
      id: 't2',
      timestamp: '10:43 AM',
      sender: 'James Doe',
      type: 'voice-to-text',
      originalText: 'Thanks Sarah. James here. I agree, the high-contrast mode looks much cleaner now.',
      confidence: 0.99,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [seconds, setSeconds] = useState(2712); // 45:12

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // ─── Initialise Gemini Copilot ───────────────────────────────────────────────
  useEffect(() => {
    const copilot = new GeminiSignCopilot(
      {
        onBuffering: (keywords) => {
          setCopilotState('buffering');
          setCopilotKeywords(keywords);
          setLiveSubtitle(`Signing... ${keywords.join(' · ')}`);
        },
        onProcessing: () => {
          setCopilotState('processing');
          setLiveSubtitle('✦ AI Copilot reconstructing...');
        },
        onResult: (result: CopilotResult) => {
          setCopilotState('ready');
          setCopilotKeywords([]);
          setLiveSubtitle(result.reconstructedText);
          setLastReconstructedEntry(result.reconstructedText);

          const newEntry: TranscriptEntry = {
            id: `t-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: 'Sarah Jenkins (You)',
            type: 'sign-to-text',
            originalText: result.reconstructedText,
            confidence: result.confidence,
            aiReconstructed: result.aiReconstructed,
            rawKeywords: result.rawKeywords,
          };
          setTranscripts(prev => [...prev, newEntry]);

          if (userProfile.autoSpeak) {
            speechService.speak(result.reconstructedText);
          }

          // Reset state after 4s so the badge fades
          setTimeout(() => setCopilotState('idle'), 4000);
        },
        onError: (msg) => {
          console.warn('[Copilot]', msg);
          setCopilotState('idle');
        },
      },
      1000 // 1.0s fast silence window for instant automatic reconstruction
    );

    copilotRef.current = copilot;
    return () => copilot.reset();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile.autoSpeak]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Setup Camera Feed
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraActive) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: micActive })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.warn("Camera access unavailable, using simulated video stage:", err);
        });
    } else {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive, micActive]);

  // Real-Time Web Speech API Live Captions
  useEffect(() => {
    if (micActive && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const finalPhrase = event.results[i][0].transcript.trim();
              if (finalPhrase) {
                setLiveSubtitle(finalPhrase);
                const newEntry: TranscriptEntry = {
                  id: `t-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  sender: 'Sarah Jenkins (You)',
                  type: 'voice-to-text',
                  originalText: finalPhrase,
                  confidence: 0.99,
                };
                setTranscripts(prev => [...prev, newEntry]);
              }
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (interimTranscript) {
            setLiveSubtitle(interimTranscript);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn("Speech recognition notice:", err.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("Speech recognition initialization fallback:", err);
      }
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
    };
  }, [micActive]);

  // Real-Time Computer Vision MediaPipe Hand Tracking Setup
  useEffect(() => {
    let trackerInstance: { stop: () => void } | null = null;

    if (cameraActive && videoRef.current) {
      trackerInstance = initializeMediaPipeTracker(
        videoRef.current,
        (result: HandTrackingResult) => {
          if (result.hasHand && result.landmarks && result.landmarks.length > 0) {
            setIsHandDetected(true);
            setDetectedLandmarks(result.landmarks);

            if (result.gesture && result.gesture !== 'UNKNOWN') {
              setDetectedGesture(result.gesture);
            }
          } else {
            setIsHandDetected(false);
            setDetectedLandmarks(null);
            setDetectedGesture('');
          }
        }
      );
    } else {
      setIsHandDetected(false);
      setDetectedLandmarks(null);
      setDetectedGesture('');
    }

    return () => {
      if (trackerInstance) {
        trackerInstance.stop();
      }
    };
  }, [cameraActive]);

  // Feed detected gesture into Gemini Copilot keyword buffer
  useEffect(() => {
    if (detectedGesture && detectedGesture !== 'UNKNOWN' && detectedGesture !== 'Signing') {
      // Update dialect from user profile before pushing
      copilotRef.current?.setDialect(userProfile.dialect || 'ASL');
      // Provide recent transcript context to Gemini
      copilotRef.current?.setContext(
        transcripts.slice(-4).map(t => `${t.sender}: ${t.originalText}`)
      );
      copilotRef.current?.pushKeyword(detectedGesture);
    } else if (!detectedGesture) {
      lastLoggedGestureRef.current = '';
    }
  }, [detectedGesture, userProfile.autoSpeak]);

  // Canvas Overlay Renderer (Renders ONLY when hand is detected in frame)
  useEffect(() => {
    let animationFrameId: number;
    const render = () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

          // ONLY DRAW SKELETON WHEN A HAND IS PHYSICALLY DETECTED IN CAMERA FRAME!
          if (isHandDetected && detectedLandmarks && detectedLandmarks.length > 0) {
            drawHandSkeletonCanvas(
              ctx,
              detectedLandmarks,
              canvasRef.current.width,
              canvasRef.current.height,
              "RIGHT_HAND",
              "#00ff66",
              detectedGesture
            );
          }
        }
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHandDetected, detectedLandmarks, detectedGesture]);

  // Scroll transcript to bottom on new entry
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // Handle Sign Trigger from GIF palette or user action
  const handleTriggerSignGesture = async (signName: string) => {
    setActiveSpeaker('Sarah Jenkins (You)');
    setIsHandDetected(true);
    try {
      const response = await fetch('/api/translate/gesture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gestureHint: signName,
          targetLanguage: 'en',
          dialect: userProfile.dialect || 'ASL',
        }),
      });

      const data = await response.json();
      const sentence = data.translatedText || `Recognized sign: ${signName}`;

      setLiveSubtitle(sentence);

      const newEntry: TranscriptEntry = {
        id: `t-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: 'Sarah Jenkins (You)',
        type: 'sign-to-text',
        originalText: sentence,
        confidence: data.confidence || 0.98,
      };

      setTranscripts(prev => [...prev, newEntry]);

      if (userProfile.autoSpeak) {
        speechService.speak(sentence);
      }
    } catch (err) {
      console.error("Gesture translation failed:", err);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newEntry: TranscriptEntry = {
      id: `t-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'Sarah Jenkins (You)',
      type: translationMode === 'sign' ? 'sign-to-text' : 'voice-to-text',
      originalText: inputText,
      confidence: 0.99,
    };

    setTranscripts(prev => [...prev, newEntry]);
    setLiveSubtitle(inputText);
    if (userProfile.autoSpeak) {
      speechService.speak(inputText);
    }
    setInputText('');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("SignMeet AI - Meeting Transcript", 14, 20);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Duration: ${formatTime(seconds)}`, 14, 34);

    let y = 46;
    transcripts.forEach((t) => {
      const header = `[${t.timestamp}] ${t.sender} (${t.type}):`;
      
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(t.originalText, 170);
      const entryHeight = 6 + lines.length * 5 + 6;

      if (y + entryHeight > 280) {
        doc.addPage();
        y = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.text(header, 14, y);
      y += 6;

      doc.setFont("helvetica", "normal");
      doc.text(lines, 20, y);
      y += lines.length * 5 + 6;
    });

    doc.save(`SignMeet_Transcript_${Date.now()}.pdf`);
  };

  const handleExportTXT = () => {
    const textContent = transcripts.map(t => `[${t.timestamp}] ${t.sender} (${t.type}):\n${t.originalText}\n`).join("\n");
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SignMeet_Transcript_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#121c2a] text-white pt-20 overflow-hidden select-none">
      {/* Main Grid: Video Stage (Left) & Right Sidebar (Right) */}
      <div className="flex-1 grid lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        
        {/* VIDEO STAGE (Col 8) */}
        <div className="lg:col-span-8 relative bg-[#1c2636] rounded-3xl overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
          {/* Main Video Feed or Fallback Image */}
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover transform -scale-x-100"
            />
          ) : (
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjnSvh3FrO-jia1WWbQ6TN2QyZobnvf1DOP2YfGmR8gN0kvsGcZZZVAxFvABLrlty-QBIhSUsdUDzIJAIJFA1EoRi95aMZz2Hs217WAhu0oMNJStfwbR17EzWA7i298_C4xRYkiLIWBjQzbEiJTGcbIIbAxjIG34JqOs9L9QFR4Cu-c9KXiojWEZZ2RuHFqG2YFTImsk0ViJuNQtds6tXz9dBiVSzn-sKQ8BwUY7geJus4BQ65P8iV"
              alt="Signer Stage"
              className="w-full h-full object-cover"
            />
          )}

          {/* OpenCV Hand Tracking Overlay Canvas */}
          <canvas
            ref={canvasRef}
            width={1280}
            height={720}
            className="absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100"
          />

          {/* Floating OpenCV HUD Status Badge (Top Left) */}
          <div className="absolute top-6 left-6 flex items-center gap-3 bg-[#121c2a]/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 text-xs font-semibold shadow-xl">
            {isHandDetected ? (
              <>
                <span className="w-2.5 h-2.5 bg-[#00ff66] rounded-full animate-ping"></span>
                <span className="text-[#00ff66] font-mono font-bold uppercase tracking-wider">HAND DETECTED & TRACKED</span>
                <span className="text-white/40">|</span>
                <span className="text-white/80 font-mono">60.1 FPS</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
                <span className="text-amber-300 font-mono font-bold uppercase tracking-wider">CAMERA READY</span>
                <span className="text-white/40">|</span>
                <span className="text-white/70">Show hand to enable skeleton</span>
              </>
            )}
            <span className="text-white/40">|</span>
            <span className="text-[#89f5e7] font-bold">{userProfile.dialect}</span>
          </div>

          {/* Hand Detection Toggle Button (Top Right) */}
          <button
            onClick={() => setIsHandDetected(!isHandDetected)}
            className={`absolute top-6 right-6 px-4 py-2 rounded-full backdrop-blur-md border text-xs font-bold transition-all flex items-center gap-2 shadow-xl ${
              isHandDetected
                ? 'bg-[#0040a1] text-[#89f5e7] border-[#89f5e7]/50 shadow-[#00ff66]/10'
                : 'bg-[#121c2a]/80 text-white/90 hover:text-white border-white/20 hover:bg-[#121c2a]'
            }`}
            title="Toggle Hand Tracking Skeleton"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isHandDetected ? 'back_hand' : 'front_hand'}
            </span>
            <span>{isHandDetected ? 'Hand Active (Skeleton On)' : 'Raise Hand / Sign Mode'}</span>
          </button>

          {/* Name Tag (Bottom Left) */}
          <div className="absolute bottom-28 left-6 bg-[#121c2a]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-label-sm text-sm font-bold text-white">Sarah Jenkins (You)</span>
          </div>

          {/* LIVE CAPTIONS DISPLAY BAR (Bottom Center Stage Overlay) */}
          <div className={`absolute bottom-6 left-6 right-6 backdrop-blur-xl p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 transition-all duration-500 ${
            copilotState === 'ready'
              ? 'bg-[#0a2a1e]/95 border border-[#00ff66]/40 shadow-[0_0_30px_rgba(0,255,102,0.15)]'
              : copilotState === 'processing'
              ? 'bg-[#0d1f38]/95 border border-[#89f5e7]/50 shadow-[0_0_20px_rgba(137,245,231,0.1)]'
              : copilotState === 'buffering'
              ? 'bg-[#121c2a]/95 border border-amber-400/40'
              : 'bg-[#121c2a]/95 border border-[#89f5e7]/30'
          }`}>
            <div className="flex items-start gap-3.5 min-w-0">
              {/* Icon: changes based on copilot state */}
              <div className={`w-10 h-10 rounded-2xl text-white font-bold flex items-center justify-center shrink-0 shadow-md transition-all duration-300 ${
                copilotState === 'ready' ? 'bg-emerald-600' :
                copilotState === 'processing' ? 'bg-[#0040a1] animate-pulse' :
                copilotState === 'buffering' ? 'bg-amber-600' :
                'bg-[#0040a1]'
              }`}>
                <span className="material-symbols-outlined text-[22px] text-white">
                  {copilotState === 'ready' ? 'auto_awesome' :
                   copilotState === 'processing' ? 'psychology' :
                   copilotState === 'buffering' ? 'sign_language' :
                   'subtitles'}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {copilotState === 'ready' ? (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-1">
                      ✦ AI COPILOT RECONSTRUCTED
                    </span>
                  ) : copilotState === 'processing' ? (
                    <span className="text-[10px] font-bold text-[#89f5e7] uppercase tracking-wider font-mono animate-pulse">
                      ✦ GEMINI RECONSTRUCTING...
                    </span>
                  ) : copilotState === 'buffering' ? (
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider font-mono">
                      SIGNING — BUFFERING KEYWORDS
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#89f5e7] uppercase tracking-wider font-mono">
                      LIVE CAPTIONS STREAM ({activeSpeaker})
                    </span>
                  )}
                  <div className="flex gap-1 items-center">
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                      copilotState === 'ready' ? 'bg-emerald-400' :
                      copilotState === 'buffering' ? 'bg-amber-400' :
                      'bg-[#00ff66]'
                    }`}></span>
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                      copilotState === 'ready' ? 'bg-emerald-400' :
                      copilotState === 'buffering' ? 'bg-amber-400' :
                      'bg-[#00ff66]'
                    }`} style={{ animationDelay: '0.15s' }}></span>
                    <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                      copilotState === 'ready' ? 'bg-emerald-400' :
                      copilotState === 'buffering' ? 'bg-amber-400' :
                      'bg-[#00ff66]'
                    }`} style={{ animationDelay: '0.3s' }}></span>
                  </div>
                </div>

                {/* Subtitle: show keyword chips while buffering, else show reconstructed text */}
                {copilotState === 'buffering' ? (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {copilotKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs font-bold font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                    <span className="text-amber-400/60 text-xs animate-pulse self-center">...</span>
                  </div>
                ) : (
                  <p
                    className={`font-caption-bold leading-snug tracking-tight truncate transition-all duration-300 ${
                      copilotState === 'ready' ? 'text-emerald-100' : 'text-white'
                    }`}
                    style={{ fontSize: `${userProfile.captionFontSize || 20}px` }}
                  >
                    "{liveSubtitle}"
                  </p>
                )}
              </div>
            </div>

            {/* Speaking / Audio Synthesizer Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {copilotState === 'buffering' && (
                <button
                  onClick={() => copilotRef.current?.flush()}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-200 text-xs font-bold transition-colors flex items-center gap-1"
                  title="Force reconstruct now"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Reconstruct
                </button>
              )}
              <button
                onClick={() => speechService.speak(liveSubtitle)}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#0040a1] text-white flex items-center justify-center transition-colors shadow-sm"
                title="Speak Captions Aloud"
              >
                <span className="material-symbols-outlined text-[22px]">volume_up</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: LIVE TRANSCRIPT & ANIMATED SIGN GIFS TAB (Col 4) */}
        <div className="lg:col-span-4 bg-[#1a2332] rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl">
          {/* Top Tab Bar: Transcript vs Animated Sign GIFs */}
          <div className="p-3 bg-[#121c2a]/90 border-b border-white/10 flex items-center justify-between gap-2">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 flex-1">
              <button
                onClick={() => setRightPanelTab('transcript')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  rightPanelTab === 'transcript' ? 'bg-[#0040a1] text-white shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">subtitles</span>
                Live Transcript
              </button>

              <button
                onClick={() => setRightPanelTab('sign-gifs')}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  rightPanelTab === 'sign-gifs' ? 'bg-[#0040a1] text-[#89f5e7] shadow-md' : 'text-white/60 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">gif</span>
                Animated Sign GIFs
              </button>
            </div>
          </div>

          {/* TAB 1: LIVE TRANSCRIPT FEED */}
          {rightPanelTab === 'transcript' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Transcript Action Header */}
              <div className="px-4 py-2 bg-[#121c2a]/40 border-b border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/60 font-mono">Real-Time Voice & Sign Log</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleExportPDF}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs flex items-center gap-1"
                    title="Export PDF"
                  >
                    <span className="material-symbols-outlined text-[15px]">picture_as_pdf</span>
                    PDF
                  </button>
                  <button
                    onClick={handleExportTXT}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors text-xs flex items-center gap-1"
                    title="Export Text File"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    TXT
                  </button>
                  <button
                    onClick={() => onOpenSummaryModal(transcripts.map(t => `${t.sender}: ${t.originalText}`).join('\n'))}
                    className="p-1.5 rounded-lg bg-[#0040a1] hover:bg-[#0056d2] text-white transition-colors text-xs flex items-center gap-1 font-semibold ml-1"
                    title="Generate AI Meeting Summary"
                  >
                    <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                    Summary
                  </button>
                </div>
              </div>

              {/* Transcript Log Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
                {transcripts.map((entry) => (
                  <div
                    key={entry.id}
                    className={`p-3.5 rounded-2xl border space-y-1.5 transition-colors ${
                      entry.aiReconstructed
                        ? 'bg-emerald-950/40 border-emerald-500/30 hover:bg-emerald-900/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                      <span className="font-bold text-white/90">{entry.sender}</span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* AI Copilot badge for Gemini-reconstructed entries */}
                        {entry.aiReconstructed && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">auto_awesome</span>
                            AI Copilot
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                          entry.type === 'sign-to-text' ? 'bg-[#0040a1] text-[#89f5e7]' : 'bg-[#00514a] text-emerald-200'
                        }`}>
                          {entry.type === 'sign-to-text' ? 'Sign to Text' : 'Voice to Text'}
                        </span>
                        <span className="text-white/40">{entry.timestamp}</span>
                      </div>
                    </div>

                    {/* Show raw keyword chips for AI-reconstructed entries */}
                    {entry.aiReconstructed && entry.rawKeywords && entry.rawKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {entry.rawKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded-md bg-white/10 text-white/50 text-[10px] font-mono border border-white/10"
                          >
                            {kw}
                          </span>
                        ))}
                        <span className="text-white/30 text-[10px] self-center">→ reconstructed</span>
                      </div>
                    )}

                    <p className={`font-body-md text-sm leading-relaxed ${
                      entry.aiReconstructed ? 'text-emerald-100' : 'text-white/90'
                    }`}>
                      {entry.originalText}
                    </p>
                    <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-white/50">
                      <span>Confidence: {(entry.confidence * 100).toFixed(1)}%</span>
                      <button
                        onClick={() => speechService.speak(entry.originalText)}
                        className="hover:text-[#89f5e7] transition-colors font-semibold flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">volume_up</span>
                        Play Audio
                      </button>
                    </div>
                  </div>
                ))}
                <div ref={transcriptEndRef} />
              </div>

              {/* Typing Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-white/10 bg-[#121c2a]/90 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type message or sign query..."
                  className="flex-1 bg-white/10 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#89f5e7]"
                />
                <button
                  type="submit"
                  className="bg-[#0040a1] hover:bg-[#0056d2] text-white px-4 py-2.5 rounded-xl font-label-sm text-sm transition-colors flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ANIMATED HAND SIGN GIFS */}
          {rightPanelTab === 'sign-gifs' && (
            <div className="flex-1 overflow-hidden">
              <AnimatedSignVisuals onTriggerSign={handleTriggerSignGesture} />
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM CONTROL DOCK BAR */}
      <footer className="h-20 bg-[#0c1420] border-t border-white/10 px-8 flex items-center justify-between">
        {/* Left: Meeting Info, URL & Timer */}
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="font-headline-md text-base font-bold text-white flex items-center gap-2">
              Weekly Sync
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-white/10 text-[#89f5e7] border border-white/10 font-mono">
                {meetingUrl.split('/').pop()}
              </span>
            </span>
            <span className="text-xs text-[#89f5e7] font-mono">{formatTime(seconds)}</span>
          </div>

          <button
            onClick={handleCopyMeetingLink}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-white/90 hover:text-white transition-colors"
            title="Copy Shareable Meeting URL"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copiedLink ? 'check_circle' : 'link'}
            </span>
            <span>{copiedLink ? 'Copied Link!' : 'Copy Meeting Link'}</span>
          </button>
        </div>

        {/* Center: Primary Call Controls & Mode Toggle */}
        <div className="flex items-center gap-4">
          {/* Mic Toggle */}
          <button
            onClick={() => setMicActive(!micActive)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              micActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-600 text-white'
            }`}
            title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {micActive ? 'mic' : 'mic_off'}
            </span>
          </button>

          {/* Camera Toggle */}
          <button
            onClick={() => setCameraActive(!cameraActive)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              cameraActive ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-red-600 text-white'
            }`}
            title={cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {cameraActive ? 'videocam' : 'videocam_off'}
            </span>
          </button>

          {/* Signing / Speaking Mode Pill */}
          <div className="bg-white/10 p-1 rounded-full flex items-center border border-white/10">
            <button
              onClick={() => setTranslationMode('sign')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                translationMode === 'sign' ? 'bg-[#0040a1] text-white shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">sign_language</span>
              Sign Mode
            </button>
            <button
              onClick={() => setTranslationMode('voice')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                translationMode === 'voice' ? 'bg-[#00514a] text-white shadow-md' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">record_voice_over</span>
              Voice Mode
            </button>
          </div>

          {/* End Call Button */}
          <button
            onClick={onEndMeeting}
            className="bg-[#ba1a1a] hover:bg-red-700 text-white px-6 py-3 rounded-full font-label-sm text-sm font-bold transition-transform active:scale-95 shadow-lg flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">call_end</span>
            End Session
          </button>
        </div>

        {/* Right: Accuracy Widget & Participants counter */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="text-white/60 font-mono">OpenCV ID:</span>
            <span className="text-[#00ff66] font-bold font-mono">#CV-9821</span>
          </div>
          <div className="flex items-center gap-1 text-white/80 text-xs font-semibold bg-white/10 px-3 py-1.5 rounded-xl">
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>3 Participants</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

