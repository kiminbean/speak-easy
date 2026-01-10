/**
 * SpeakEasy - Settings Store
 * Zustand store for user settings
 */

import { create } from 'zustand';
import { UserSettings, CaregiverContact } from '../types';
import { StorageService, TTSService } from '../services';
import { generateId } from '../utils/hash';

interface SettingsStoreState {
  // State
  settings: UserSettings;
  isLoaded: boolean;
  isLLMReady: boolean;
  llmProgress: number;

  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  addCaregiver: (caregiver: Omit<CaregiverContact, 'id'>) => Promise<void>;
  removeCaregiver: (id: string) => Promise<void>;
  setLLMStatus: (ready: boolean, progress?: number) => void;
  resetSettings: () => Promise<void>;
}

const DEFAULT_SETTINGS: UserSettings = {
  userId: 'default_user',
  name: '',
  language: 'en',
  speechRate: 0.9,
  speechPitch: 1.0,
  caregivers: [],
  enableHaptics: true,
  largeText: false,
  highContrast: false,
  hasCompletedOnboarding: false,
};

export const useSettingsStore = create<SettingsStoreState>((set, get) => ({
  // Initial state
  settings: DEFAULT_SETTINGS,
  isLoaded: false,
  isLLMReady: false,
  llmProgress: 0,

  // Load settings from storage
  loadSettings: async () => {
    try {
      const settings = await StorageService.getSettings();
      
      // Apply TTS settings
      TTSService.setDefaultRate(settings.speechRate);
      TTSService.setDefaultPitch(settings.speechPitch);
      TTSService.setDefaultLanguage(settings.language);

      set({ settings, isLoaded: true });
    } catch (error) {
      if (__DEV__) console.error('Error loading settings:', error);
      set({ settings: DEFAULT_SETTINGS, isLoaded: true });
    }
  },

  // Update settings
  updateSettings: async (updates: Partial<UserSettings>) => {
    const newSettings = { ...get().settings, ...updates };
    
    // Apply TTS settings if changed
    if (updates.speechRate !== undefined) {
      TTSService.setDefaultRate(updates.speechRate);
    }
    if (updates.speechPitch !== undefined) {
      TTSService.setDefaultPitch(updates.speechPitch);
    }
    if (updates.language !== undefined) {
      TTSService.setDefaultLanguage(updates.language);
    }

    await StorageService.saveSettings(updates);
    set({ settings: newSettings });
  },

  // Add caregiver
  addCaregiver: async (caregiver: Omit<CaregiverContact, 'id'>) => {
    const newCaregiver: CaregiverContact = {
      ...caregiver,
      id: generateId(),
    };

    const settings = get().settings;
    const caregivers = [...settings.caregivers, newCaregiver];
    
    await StorageService.saveSettings({ caregivers });
    set({ settings: { ...settings, caregivers } });
  },

  // Remove caregiver
  removeCaregiver: async (id: string) => {
    const settings = get().settings;
    const caregivers = settings.caregivers.filter((c) => c.id !== id);
    
    await StorageService.saveSettings({ caregivers });
    set({ settings: { ...settings, caregivers } });
  },

  // Set LLM status
  setLLMStatus: (ready: boolean, progress?: number) => {
    set({
      isLLMReady: ready,
      llmProgress: progress ?? (ready ? 100 : get().llmProgress),
    });
  },

  // Reset to defaults
  resetSettings: async () => {
    await StorageService.clearAllData();
    set({ settings: DEFAULT_SETTINGS });
  },
}));
