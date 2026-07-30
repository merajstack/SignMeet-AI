export type ActiveTab = 'home' | 'meetings' | 'dashboard' | 'custom-signs' | 'settings' | 'extension';

export type TranslationMode = 'sign' | 'voice';

export type LanguageCode = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ar';

export interface UserProfile {
  id: string;
  fullName: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  role: 'user' | 'admin';
  subscriptionPlan: 'free' | 'pro' | 'team';
  memberSince: string;
  dialect: 'ASL' | 'BSL' | 'Auslan' | 'IS';
  captionFontSize: number;
  highContrast: boolean;
  speechRate: number;
  speechVoice: string;
  autoSpeak: boolean;
  cloudStorage: boolean;
  aiTrainingConsent: boolean;
}

export interface Participant {
  id: string;
  name: string;
  avatar: string;
  initials: string;
  isSigning?: boolean;
  isSpeaking?: boolean;
}

export interface TranscriptEntry {
  id: string;
  timestamp: string;
  sender: string;
  type: 'sign-to-text' | 'voice-to-text' | 'chat';
  originalText: string;
  translatedText?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  confidence: number;
  aiReconstructed?: boolean;   // true when sentence was reconstructed by Gemini Copilot
  rawKeywords?: string[];      // original buffered sign keywords before reconstruction
  isEmoji?: boolean;           // true when message is an emoji or GIF reaction
}

export interface MeetingSession {
  id: string;
  title: string;
  date: string;
  duration: string;
  durationSeconds: number;
  status: 'Verified' | 'AI-Drafted' | 'In-Progress';
  participants: Participant[];
  transcripts: TranscriptEntry[];
  summary?: string;
  actionItems?: string[];
  platform: 'Google Meet' | 'Zoom' | 'MS Teams' | 'SignMeet Native';
}

export interface LandmarkPoint {
  x: number;
  y: number;
  z?: number;
}

export interface HandLandmarks {
  landmarks: LandmarkPoint[];
  gestureName?: string;
  confidence?: number;
}

export interface AIPipelineConfig {
  gestureRecognizer: {
    model: string;
    confidenceThreshold: number;
  };
  sentenceGenerator: {
    model: string;
    contextWindow: number;
  };
  translator: {
    sourceLang: string;
    targetLang: string;
  };
  speechGenerator: {
    voice: string;
    rate: number;
  };
}

export interface ASLSign {
  id: string;
  sign: string;
  category: string;
  description: string;
  handshape: string;
  movement: string;
  imageUrl?: string;
  videoPreviewUrl?: string;
}

export interface AdminMetrics {
  activeUsers: number;
  mrr: number;
  totalTranslationsToday: number;
  gpuStatus: {
    provider: string;
    model: string;
    utilization: number;
    vramUsed: number;
    vramTotal: number;
    latencyMs: number;
    tempCelsius: number;
  };
  apiStatus: {
    status: 'healthy' | 'degraded' | 'down';
    requestsPerMin: number;
    errorRate: number;
  };
}
