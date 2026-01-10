import { PhraseCategory } from '../types';

export * from './emotions';
export * from './phrases';

// App-wide constants
export const APP_NAME = 'SpeakEasy';
export const APP_VERSION = '1.0.0';

// Design System - AAC Accessible Color Palette
// WCAG 2.1 AA compliant, calming medical-appropriate colors

export const COLORS = {
  // Primary - Trustworthy calming blue
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  onPrimary: '#FFFFFF',
  
  // Secondary - Soft teal
  secondary: '#0D9488',
  secondaryLight: '#14B8A6',
  secondaryDark: '#0F766E',
  onSecondary: '#FFFFFF',
  
  // Accent - Warm amber (muted)
  accent: '#D97706',
  accentLight: '#F59E0B',
  accentDark: '#B45309',
  onAccent: '#FFFFFF',
  
  // Emergency - Accessible red (not aggressive)
  emergency: '#DC2626',
  emergencyLight: '#EF4444',
  emergencyDark: '#B91C1C',
  emergencyBackground: '#FEF2F2',
  onEmergency: '#FFFFFF',
  
  // Success - Soft green
  success: '#059669',
  successLight: '#10B981',
  successDark: '#047857',
  successBackground: '#ECFDF5',
  onSuccess: '#FFFFFF',
  
  // Warning - Warm orange
  warning: '#D97706',
  warningLight: '#F59E0B',
  warningBackground: '#FFFBEB',
  onWarning: '#FFFFFF',
  
  // Neutral - Warm grays for readability
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Text - Dark gray (not pure black) for readability
  text: '#1E293B',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  textDisabled: '#CBD5E1',
  
  // Borders & Dividers
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E2E8F0',
  
  // Interactive states
  ripple: 'rgba(37, 99, 235, 0.12)',
  overlay: 'rgba(15, 23, 42, 0.5)',
  
  // Semantic aliases
  disabled: '#94A3B8',
  textLight: '#64748B',
  
  // Legacy support
  get primarySurface() { return this.primary + '15'; },
};

// Emotion Colors - Soft, calming palette
export const EMOTION_COLORS = {
  happy: '#FBBF24',
  calm: '#60A5FA',
  tired: '#A78BFA',
  sad: '#64748B',
  anxious: '#FB923C',
  frustrated: '#F87171',
  scared: '#C084FC',
};

// Shadows - Subtle depth
export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
  emergency: {
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
};

// Layout - Generous spacing for accessibility
export const SPACING = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Touch targets - Minimum 48dp for accessibility
export const TOUCH_TARGET = {
  min: 48,
  recommended: 56,
  large: 64,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

// Typography scale
export const TYPOGRAPHY = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h4: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const, lineHeight: 24 },
  bodySemibold: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  small: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  smallMedium: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  captionMedium: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
};

// TTS Settings
export const TTS_DEFAULTS = {
  rate: 0.9,
  pitch: 1.0,
  language: 'en-US',
};

export const STORAGE_KEYS = {
  USER_SETTINGS: '@speakeasy/user_settings',
  PHRASE_HISTORY: '@speakeasy/phrase_history',
  EMOTION_HISTORY: '@speakeasy/emotion_history',
  FAVORITES: '@speakeasy/favorites',
  LLM_CACHE: '@speakeasy/llm_cache',
  CUSTOM_PHRASES: '@speakeasy/custom_phrases',
  SAVED_LOCATIONS: '@speakeasy/saved_locations',
};

export const DEFAULT_LOCATION_RADIUS = 150;

// Animation configurations for react-native-reanimated
export const ANIMATION = {
  // Spring presets
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  springBouncy: {
    damping: 10,
    stiffness: 180,
    mass: 0.8,
  },
  springGentle: {
    damping: 20,
    stiffness: 120,
    mass: 1,
  },
  // Timing durations (ms)
  timing: {
    fast: 150,
    normal: 250,
    slow: 400,
  },
  // Scale values
  scale: {
    pressed: 0.95,
    longPressed: 0.92,
    selected: 1.05,
    bounce: 1.1,
    pulseMin: 1.0,
    pulseMax: 1.02,
  },
  // Stagger animation
  stagger: {
    delay: 50,
    initialDelay: 100,
  },
  // Fade & translate
  enter: {
    translateY: 20,
    opacity: 0,
  },
};

export const CATEGORIES: { id: PhraseCategory; label: string; labelKo: string; emoji: string }[] = [
  { id: 'greeting', label: 'Greeting', labelKo: '인사', emoji: '👋' },
  { id: 'need', label: 'Need', labelKo: '필요', emoji: '🆘' },
  { id: 'want', label: 'Want', labelKo: '원해요', emoji: '💭' },
  { id: 'feeling', label: 'Feeling', labelKo: '감정', emoji: '💗' },
  { id: 'question', label: 'Question', labelKo: '질문', emoji: '❓' },
  { id: 'response', label: 'Response', labelKo: '대답', emoji: '✅' },
  { id: 'social', label: 'Social', labelKo: '사회적', emoji: '🙂' },
  { id: 'emergency', label: 'Emergency', labelKo: '긴급', emoji: '🚨' },
];
