import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { EmotionType } from '../types';
import { TTS_DEFAULTS } from '../constants';

export interface TTSOptions {
  rate?: number;
  pitch?: number;
  language?: string;
  voiceId?: string;
  onStart?: () => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}

interface VoiceInfo {
  identifier: string;
  name: string;
  quality: string;
  language: string;
}

class TTSServiceClass {
  private isSpeaking = false;
  private availableVoices: VoiceInfo[] = [];
  private preferredVoices: Map<string, string> = new Map();
  private defaultRate = TTS_DEFAULTS.rate;
  private defaultPitch = TTS_DEFAULTS.pitch;
  private defaultLanguage = TTS_DEFAULTS.language;

  async initialize(): Promise<void> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      this.availableVoices = voices.map((v) => ({
        identifier: v.identifier,
        name: v.name,
        quality: v.quality || 'Default',
        language: v.language,
      }));
      
      this.selectBestVoices();
      if (__DEV__) console.log(`TTS initialized with ${this.availableVoices.length} voices`);
    } catch (error) {
      if (__DEV__) console.error('TTS initialization error:', error);
    }
  }

  private selectBestVoices(): void {
    const languages = ['en', 'ko', 'ja', 'es', 'fr', 'de', 'zh', 'pt', 'it', 'ru'];
    
    for (const lang of languages) {
      const bestVoice = this.findBestVoiceForLanguage(lang);
      if (bestVoice) {
        this.preferredVoices.set(lang, bestVoice.identifier);
        if (__DEV__) console.log(`[TTS] Best ${lang} voice: ${bestVoice.name} (${bestVoice.quality})`);
      }
    }
  }

  private findBestVoiceForLanguage(language: string): VoiceInfo | null {
    const langVoices = this.availableVoices.filter((v) =>
      v.language.toLowerCase().startsWith(language.toLowerCase())
    );

    if (langVoices.length === 0) return null;

    if (Platform.OS === 'ios') {
      const qualityOrder = ['Enhanced', 'Premium', 'Default'];
      for (const quality of qualityOrder) {
        const voice = langVoices.find((v) => v.quality === quality);
        if (voice) return voice;
      }
      
      const premiumVoice = langVoices.find((v) => 
        v.identifier.includes('premium') || 
        v.identifier.includes('enhanced') ||
        v.name.includes('Premium') ||
        v.name.includes('Enhanced')
      );
      if (premiumVoice) return premiumVoice;
    }

    if (Platform.OS === 'android') {
      const neuralVoice = langVoices.find((v) =>
        v.name.toLowerCase().includes('neural') ||
        v.identifier.toLowerCase().includes('neural') ||
        v.quality === 'Enhanced'
      );
      if (neuralVoice) return neuralVoice;
    }

    return langVoices[0];
  }

  getPreferredVoiceForLanguage(language: string): string | undefined {
    const langCode = language.split('-')[0].toLowerCase();
    return this.preferredVoices.get(langCode);
  }

  getVoicesForLanguage(language: string = 'en'): VoiceInfo[] {
    return this.availableVoices.filter((v) =>
      v.language.toLowerCase().startsWith(language.toLowerCase())
    );
  }

  getAllVoices(): VoiceInfo[] {
    return this.availableVoices;
  }

  async checkIsSpeaking(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  }

  async speak(text: string, options: TTSOptions = {}): Promise<void> {
    if (!text || text.trim().length === 0) {
      if (__DEV__) console.warn('TTS: Empty text provided');
      return;
    }

    await this.stop();

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptic feedback optional - ignore failures
    }

    const language = options.language ?? this.defaultLanguage;
    const voiceId = options.voiceId ?? this.getPreferredVoiceForLanguage(language);

    const speechOptions: Speech.SpeechOptions = {
      rate: options.rate ?? this.defaultRate,
      pitch: options.pitch ?? this.defaultPitch,
      language,
      voice: voiceId,
      onStart: () => {
        this.isSpeaking = true;
        options.onStart?.();
      },
      onDone: () => {
        this.isSpeaking = false;
        options.onDone?.();
      },
      onError: (error) => {
        this.isSpeaking = false;
        if (__DEV__) console.error('TTS error:', error);
        options.onError?.(new Error(String(error)));
      },
    };

    try {
      Speech.speak(text, speechOptions);
    } catch (error) {
      if (__DEV__) console.error('TTS speak error:', error);
      this.isSpeaking = false;
      throw error;
    }
  }

  async speakWithEmotion(text: string, emotion: EmotionType, baseOptions: TTSOptions = {}): Promise<void> {
    // Adjust rate and pitch based on emotion
    const emotionModifiers = this.getEmotionModifiers(emotion);

    const options: TTSOptions = {
      ...baseOptions,
      rate: (baseOptions.rate ?? this.defaultRate) * emotionModifiers.rateMultiplier,
      pitch: (baseOptions.pitch ?? this.defaultPitch) * emotionModifiers.pitchMultiplier,
    };

    await this.speak(text, options);
  }

  private getEmotionModifiers(emotion: EmotionType): { rateMultiplier: number; pitchMultiplier: number } {
    switch (emotion) {
      case 'happy':
      case 'excited':
        return { rateMultiplier: 1.1, pitchMultiplier: 1.1 };
      case 'sad':
      case 'tired':
        return { rateMultiplier: 0.85, pitchMultiplier: 0.95 };
      case 'anxious':
      case 'scared':
        return { rateMultiplier: 1.15, pitchMultiplier: 1.05 };
      case 'frustrated':
        return { rateMultiplier: 1.0, pitchMultiplier: 0.95 };
      case 'calm':
      default:
        return { rateMultiplier: 1.0, pitchMultiplier: 1.0 };
    }
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
    } catch (error) {
      if (__DEV__) console.error('TTS stop error:', error);
    }
  }

  async pause(): Promise<void> {
    try {
      await Speech.pause();
    } catch (error) {
      if (__DEV__) console.error('TTS pause error:', error);
    }
  }

  async resume(): Promise<void> {
    try {
      await Speech.resume();
    } catch (error) {
      if (__DEV__) console.error('TTS resume error:', error);
    }
  }

  setDefaultRate(rate: number): void {
    this.defaultRate = Math.max(0.1, Math.min(2.0, rate));
  }

  setDefaultPitch(pitch: number): void {
    this.defaultPitch = Math.max(0.5, Math.min(2.0, pitch));
  }

  setDefaultLanguage(language: string): void {
    this.defaultLanguage = language;
  }

  async speakEmergency(text: string, language?: string): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch {
      // Haptic feedback optional
    }

    await this.speak(text, {
      rate: 0.85,
      pitch: 1.0,
      language,
    });
  }
}

export const TTSService = new TTSServiceClass();
export default TTSService;
