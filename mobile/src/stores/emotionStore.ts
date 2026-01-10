/**
 * SpeakEasy - Emotion Store
 * Zustand store for emotion state management
 */

import { create } from 'zustand';
import { EmotionType, EmotionState, SupportedLanguage } from '../types';
import { EmotionService, NotificationService } from '../services';
import { useSettingsStore } from './settingsStore';

interface EmotionStoreState {
  // State
  currentEmotion: EmotionState | null;
  explicitEmotion: EmotionType | null;
  copingPhrases: string[];
  shouldAlert: boolean;
  recommendedActions: string[];

  // Actions
  detectEmotion: (language?: SupportedLanguage) => void;
  setExplicitEmotion: (emotion: EmotionType | null) => void;
  recordTap: (tapCount: number, durationMs: number) => void;
  recordPhrase: (phrase: string) => void;
  triggerEmergencyAlert: (phrase?: string) => Promise<void>;
  clearEmotion: () => void;
}

export const useEmotionStore = create<EmotionStoreState>((set, get) => ({
  // Initial state
  currentEmotion: null,
  explicitEmotion: null,
  copingPhrases: [],
  shouldAlert: false,
  recommendedActions: [],

  detectEmotion: (overrideLanguage?: SupportedLanguage) => {
    const emotion = EmotionService.detectEmotion();
    const shouldAlert = EmotionService.shouldAlertCaregiver(emotion);
    const language = overrideLanguage || useSettingsStore.getState().settings.language;
    const copingPhrases = EmotionService.getCopingPhrases(emotion.emotion, language);
    const recommendedActions = EmotionService.getRecommendedActions(
      emotion.emotion,
      emotion.intensity
    );

    set({
      currentEmotion: emotion,
      shouldAlert,
      copingPhrases,
      recommendedActions,
    });

    if (shouldAlert) {
      get().triggerEmergencyAlert();
    }
  },

  // Set explicit emotion from button press
  setExplicitEmotion: (emotion: EmotionType | null) => {
    if (emotion) {
      EmotionService.setExplicitEmotion(emotion);
    } else {
      EmotionService.clearExplicitEmotion();
    }

    set({ explicitEmotion: emotion });
    get().detectEmotion();
  },

  // Record tap for pattern analysis
  recordTap: (tapCount: number, durationMs: number) => {
    EmotionService.recordTap(tapCount, durationMs);
    // Detect emotion after accumulating some data
    get().detectEmotion();
  },

  // Record phrase for sentiment analysis
  recordPhrase: (phrase: string) => {
    EmotionService.recordPhrase(phrase);
  },

  // Trigger emergency alert
  triggerEmergencyAlert: async (phrase?: string) => {
    const { currentEmotion } = get();
    
    if (currentEmotion) {
      await NotificationService.sendEmergencyAlert(currentEmotion, phrase);
    } else {
      // Create a default emergency emotion state
      await NotificationService.sendEmergencyAlert(
        {
          emotion: 'scared',
          intensity: 'high',
          confidence: 1.0,
          timestamp: Date.now(),
        },
        phrase
      );
    }
  },

  // Clear emotion state
  clearEmotion: () => {
    EmotionService.clearHistory();
    set({
      currentEmotion: null,
      explicitEmotion: null,
      copingPhrases: [],
      shouldAlert: false,
      recommendedActions: [],
    });
  },
}));
