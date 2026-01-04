/**
 * SpeakEasy - Type Definitions
 * AAC (Augmentative and Alternative Communication) App Types
 */

// ============================================
// Emotion Types
// ============================================

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'frustrated'
  | 'scared'
  | 'calm'
  | 'excited'
  | 'tired'
  | 'unknown';

export type EmotionIntensity = 'low' | 'medium' | 'high' | 'critical';

export interface EmotionState {
  emotion: EmotionType;
  intensity: EmotionIntensity;
  confidence: number;
  timestamp: number;
}

export interface TapSignal {
  timestamp: number;
  tapCount: number;
  durationMs: number;
  pressure?: number;
}

// ============================================
// Context Types
// ============================================

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export type DayOfWeek = 'weekday' | 'weekend';

export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm' | 'fog' | 'unknown';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  isRaining: boolean;
  isSnowing: boolean;
  windSpeed: number;
  humidity: number;
  timestamp: number;
  source: 'api' | 'cache' | 'fallback';
}

export type LocationType =
  | 'home'
  | 'school'
  | 'hospital'
  | 'outdoor'
  | 'restaurant'
  | 'unknown';

export interface SavedLocation {
  id: string;
  type: LocationType;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  createdAt: number;
}

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationDetectionResult {
  detected: boolean;
  locationType: LocationType;
  savedLocation?: SavedLocation;
  distance?: number;
}

export interface UserContext {
  userId: string;
  timeOfDay: TimeOfDay;
  season: Season;
  dayOfWeek: DayOfWeek;
  locationType: LocationType;
  recentPhrases: string[];
  emotionState?: EmotionType;
  conversationPartner?: string;
  language?: SupportedLanguage;
  weather?: WeatherData;
}

// ============================================
// Phrase Types
// ============================================

export type PhraseCategory =
  | 'greeting'
  | 'need'
  | 'want'
  | 'feeling'
  | 'question'
  | 'response'
  | 'social'
  | 'emergency';

export interface Phrase {
  id: string;
  text: string;
  category: PhraseCategory;
  emoji?: string;
  isEmergency?: boolean;
  isFavorite?: boolean;
  usageCount?: number;
  isCustom?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface CustomPhrase extends Phrase {
  isCustom: true;
  createdAt: number;
  updatedAt: number;
}

export interface PredictionResult {
  phrases: Phrase[];
  confidence: number[];
  reasoning: string;
  cached: boolean;
  latencyMs: number;
  source: 'llm' | 'rules' | 'cache';
}

// ============================================
// User & Settings Types
// ============================================

export interface CaregiverContact {
  id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  notifyOnEmergency: boolean;
}

export type SupportedLanguage = 
  | 'en' | 'ko' | 'ja' | 'es' | 'ru'
  | 'id' | 'pt' | 'fr' | 'de' | 'bn'
  | 'ar' | 'ur' | 'hi' | 'it' | 'pl'
  | 'uk' | 'ro' | 'nl' | 'vi' | 'tr';

export interface UserSettings {
  userId: string;
  name: string;
  language: SupportedLanguage;
  voiceId?: string;
  speechRate: number;
  speechPitch: number;
  caregivers: CaregiverContact[];
  enableHaptics: boolean;
  largeText: boolean;
  highContrast: boolean;
  hasCompletedOnboarding: boolean;
}

// ============================================
// Notification Types
// ============================================

export interface EmergencyAlert {
  id: string;
  timestamp: number;
  emotion: EmotionType;
  intensity: EmotionIntensity;
  phrase?: string;
  location?: { latitude: number; longitude: number };
}

// ============================================
// Store Types
// ============================================

export interface PredictionStore {
  predictions: Phrase[];
  isLoading: boolean;
  error: string | null;
  context: UserContext | null;
  setPredictions: (phrases: Phrase[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setContext: (context: UserContext) => void;
  addRecentPhrase: (phrase: string) => void;
}

export interface EmotionStore {
  currentEmotion: EmotionState | null;
  tapHistory: TapSignal[];
  phraseHistory: { timestamp: number; phrase: string }[];
  explicitEmotion: EmotionType | null;
  setEmotion: (emotion: EmotionState) => void;
  addTap: (tap: TapSignal) => void;
  addPhraseToHistory: (phrase: string) => void;
  setExplicitEmotion: (emotion: EmotionType | null) => void;
  clearHistory: () => void;
}

export interface SettingsStore {
  settings: UserSettings;
  isLLMReady: boolean;
  llmProgress: number;
  updateSettings: (settings: Partial<UserSettings>) => void;
  setLLMReady: (ready: boolean) => void;
  setLLMProgress: (progress: number) => void;
}
