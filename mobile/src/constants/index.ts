import { PhraseCategory } from '../types';

export * from './emotions';
export * from './phrases';

export const APP_NAME = 'SpeakEasy';
export const APP_VERSION = '1.1.0';

export const UI_STYLE_VERSIONS = {
  legacy: 'v1-classic',
  liquidGlass: 'v2-liquid-glass',
} as const;

export type UIStyleVersion = typeof UI_STYLE_VERSIONS[keyof typeof UI_STYLE_VERSIONS];

export const ACTIVE_UI_STYLE_VERSION: UIStyleVersion = UI_STYLE_VERSIONS.liquidGlass;

type ColorTokens = {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  onSecondary: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  onAccent: string;
  emergency: string;
  emergencyLight: string;
  emergencyDark: string;
  emergencyBackground: string;
  onEmergency: string;
  success: string;
  successLight: string;
  successDark: string;
  successBackground: string;
  onSuccess: string;
  warning: string;
  warningLight: string;
  warningBackground: string;
  onWarning: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  surfaceElevated: string;
  surfaceStrong: string;
  headerSurface: string;
  inputSurface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textDisabled: string;
  border: string;
  borderLight: string;
  divider: string;
  ripple: string;
  overlay: string;
  disabled: string;
  textLight: string;
  primarySurface: string;
};

type GlassTokens = {
  border: string;
  highlight: string;
  tint: string;
  overlay: string;
  shadow: string;
  orbA: string;
  orbB: string;
  orbC: string;
};

type ShadowToken = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

type BorderRadiusTokens = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  full: number;
};

type ThemeTokens = {
  colors: ColorTokens;
  glass: GlassTokens;
  shadows: {
    sm: ShadowToken;
    md: ShadowToken;
    lg: ShadowToken;
    xl: ShadowToken;
    emergency: ShadowToken;
  };
  borderRadius: BorderRadiusTokens;
};

const LEGACY_THEME: ThemeTokens = {
  colors: {
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    primaryDark: '#1D4ED8',
    onPrimary: '#FFFFFF',
    secondary: '#0D9488',
    secondaryLight: '#14B8A6',
    secondaryDark: '#0F766E',
    onSecondary: '#FFFFFF',
    accent: '#D97706',
    accentLight: '#F59E0B',
    accentDark: '#B45309',
    onAccent: '#FFFFFF',
    emergency: '#DC2626',
    emergencyLight: '#EF4444',
    emergencyDark: '#B91C1C',
    emergencyBackground: '#FEF2F2',
    onEmergency: '#FFFFFF',
    success: '#059669',
    successLight: '#10B981',
    successDark: '#047857',
    successBackground: '#ECFDF5',
    onSuccess: '#FFFFFF',
    warning: '#D97706',
    warningLight: '#F59E0B',
    warningBackground: '#FFFBEB',
    onWarning: '#FFFFFF',
    background: '#F8FAFC',
    backgroundSecondary: '#F1F5F9',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceStrong: '#FFFFFF',
    headerSurface: '#FFFFFF',
    inputSurface: '#FFFFFF',
    text: '#1E293B',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',
    textDisabled: '#CBD5E1',
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    divider: '#E2E8F0',
    ripple: 'rgba(37, 99, 235, 0.12)',
    overlay: 'rgba(15, 23, 42, 0.5)',
    disabled: '#94A3B8',
    textLight: '#64748B',
    primarySurface: 'rgba(37, 99, 235, 0.12)',
  },
  glass: {
    border: 'rgba(255, 255, 255, 0.65)',
    highlight: 'rgba(255, 255, 255, 0.8)',
    tint: 'rgba(255, 255, 255, 0.2)',
    overlay: 'rgba(255, 255, 255, 0.12)',
    shadow: 'rgba(15, 23, 42, 0.18)',
    orbA: 'rgba(59, 130, 246, 0.16)',
    orbB: 'rgba(20, 184, 166, 0.14)',
    orbC: 'rgba(245, 158, 11, 0.12)',
  },
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000000',
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
  },
  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
  },
};

const LIQUID_GLASS_THEME: ThemeTokens = {
  colors: {
    primary: '#4D72FF',
    primaryLight: '#7CA7FF',
    primaryDark: '#244AC7',
    onPrimary: '#FFFFFF',
    secondary: '#4EC1E9',
    secondaryLight: '#7EDAF7',
    secondaryDark: '#1D90BE',
    onSecondary: '#FFFFFF',
    accent: '#F6A45A',
    accentLight: '#FFC48A',
    accentDark: '#D88336',
    onAccent: '#FFFFFF',
    emergency: '#E15A6C',
    emergencyLight: '#FF8C9A',
    emergencyDark: '#BE3951',
    emergencyBackground: 'rgba(255, 231, 236, 0.82)',
    onEmergency: '#FFFFFF',
    success: '#2E9D80',
    successLight: '#54C0A2',
    successDark: '#1F7E66',
    successBackground: 'rgba(226, 251, 243, 0.78)',
    onSuccess: '#FFFFFF',
    warning: '#D98934',
    warningLight: '#F5B96A',
    warningBackground: 'rgba(255, 245, 221, 0.8)',
    onWarning: '#FFFFFF',
    background: '#E9F1FB',
    backgroundSecondary: 'rgba(255, 255, 255, 0.4)',
    surface: 'rgba(255, 255, 255, 0.68)',
    surfaceElevated: 'rgba(255, 255, 255, 0.78)',
    surfaceStrong: 'rgba(255, 255, 255, 0.88)',
    headerSurface: 'rgba(244, 248, 255, 0.86)',
    inputSurface: 'rgba(255, 255, 255, 0.74)',
    text: '#11233F',
    textSecondary: '#4A617F',
    textTertiary: '#7A8EA8',
    textDisabled: '#A9B6C8',
    border: 'rgba(255, 255, 255, 0.62)',
    borderLight: 'rgba(255, 255, 255, 0.84)',
    divider: 'rgba(92, 117, 153, 0.16)',
    ripple: 'rgba(255, 255, 255, 0.3)',
    overlay: 'rgba(13, 25, 45, 0.34)',
    disabled: '#94A3B8',
    textLight: '#677D98',
    primarySurface: 'rgba(77, 114, 255, 0.16)',
  },
  glass: {
    border: 'rgba(255, 255, 255, 0.74)',
    highlight: 'rgba(255, 255, 255, 0.92)',
    tint: 'rgba(255, 255, 255, 0.34)',
    overlay: 'rgba(255, 255, 255, 0.22)',
    shadow: 'rgba(48, 72, 109, 0.2)',
    orbA: 'rgba(125, 164, 255, 0.34)',
    orbB: 'rgba(101, 212, 255, 0.22)',
    orbC: 'rgba(255, 191, 146, 0.24)',
  },
  shadows: {
    sm: {
      shadowColor: '#2A436E',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 14,
      elevation: 2,
    },
    md: {
      shadowColor: '#2A436E',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
      elevation: 5,
    },
    lg: {
      shadowColor: '#2A436E',
      shadowOffset: { width: 0, height: 18 },
      shadowOpacity: 0.15,
      shadowRadius: 36,
      elevation: 8,
    },
    xl: {
      shadowColor: '#2A436E',
      shadowOffset: { width: 0, height: 22 },
      shadowOpacity: 0.18,
      shadowRadius: 42,
      elevation: 10,
    },
    emergency: {
      shadowColor: '#E15A6C',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.22,
      shadowRadius: 30,
      elevation: 8,
    },
  },
  borderRadius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 22,
    xl: 28,
    xxl: 34,
    full: 999,
  },
};

const THEMES: Record<UIStyleVersion, ThemeTokens> = {
  [UI_STYLE_VERSIONS.legacy]: LEGACY_THEME,
  [UI_STYLE_VERSIONS.liquidGlass]: LIQUID_GLASS_THEME,
};

const ACTIVE_THEME = THEMES[ACTIVE_UI_STYLE_VERSION];

export const AVAILABLE_THEME_VERSIONS = THEMES;
export const COLORS = ACTIVE_THEME.colors;
export const GLASS = ACTIVE_THEME.glass;

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
export const SHADOWS = ACTIVE_THEME.shadows;

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

export const BORDER_RADIUS = ACTIVE_THEME.borderRadius;

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
  CURRENT_LOCATION: '@speakeasy/current_location',
  EXPLICIT_EMOTION: '@speakeasy/explicit_emotion',
  TAP_HISTORY: '@speakeasy/tap_history',
  PHRASE_SENTIMENT_HISTORY: '@speakeasy/phrase_sentiment_history',
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
