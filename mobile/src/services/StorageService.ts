/**
 * SpeakEasy - Storage Service
 * Local storage using AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, DEFAULT_LOCATION_RADIUS } from '../constants';
import { UserSettings, Phrase, CaregiverContact, CustomPhrase, SavedLocation, LocationType, EmotionType, TapSignal } from '../types';
import { generateId } from '../utils/hash';

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

interface LLMCacheEntry {
  response: string;
  timestamp: number;
}

class StorageServiceClass {
  /**
   * Save user settings
   */
  async saveSettings(settings: Partial<UserSettings>): Promise<void> {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updated));
    } catch (error) {
      if (__DEV__) console.error('Error saving settings:', error);
      throw error;
    }
  }

  /**
   * Get user settings
   */
  async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
      return DEFAULT_SETTINGS;
    } catch (error) {
      if (__DEV__) console.error('Error getting settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Add phrase to history
   */
  async addPhraseToHistory(phrase: string): Promise<void> {
    try {
      const sanitizedPhrase = this.sanitizeText(phrase, 200);
      if (!sanitizedPhrase) return;

      const history = await this.getPhraseHistory();
      history.push({
        phrase: sanitizedPhrase,
        timestamp: Date.now(),
      });

      const trimmedHistory = history.slice(-100);
      await AsyncStorage.setItem(STORAGE_KEYS.PHRASE_HISTORY, JSON.stringify(trimmedHistory));
    } catch (error) {
      if (__DEV__) {
        console.error('Error adding phrase to history:', error);
      }
    }
  }

  /**
   * Get phrase history
   */
  async getPhraseHistory(): Promise<{ phrase: string; timestamp: number }[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PHRASE_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      if (__DEV__) console.error('Error getting phrase history:', error);
      return [];
    }
  }

  /**
   * Get recent phrases (for prediction context)
   */
  async getRecentPhrases(limit: number = 10): Promise<string[]> {
    const history = await this.getPhraseHistory();
    return history.slice(-limit).map((h) => h.phrase);
  }

  /**
   * Add/update favorite phrase
   */
  async toggleFavorite(phrase: Phrase): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const index = favorites.findIndex((f) => f.id === phrase.id);

      if (index >= 0) {
        // Remove from favorites
        favorites.splice(index, 1);
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        return false;
      } else {
        // Add to favorites
        favorites.push({ ...phrase, isFavorite: true });
        await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        return true;
      }
    } catch (error) {
      if (__DEV__) console.error('Error toggling favorite:', error);
      return false;
    }
  }

  /**
   * Get favorite phrases
   */
  async getFavorites(): Promise<Phrase[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      if (__DEV__) console.error('Error getting favorites:', error);
      return [];
    }
  }

  /**
   * Check if phrase is favorite
   */
  async isFavorite(phraseId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.some((f) => f.id === phraseId);
  }

  /**
   * Add caregiver contact
   */
  async addCaregiver(caregiver: CaregiverContact): Promise<void> {
    const settings = await this.getSettings();
    settings.caregivers.push(caregiver);
    await this.saveSettings({ caregivers: settings.caregivers });
  }

  async removeCaregiver(caregiverId: string): Promise<void> {
    const settings = await this.getSettings();
    settings.caregivers = settings.caregivers.filter((c) => c.id !== caregiverId);
    await this.saveSettings({ caregivers: settings.caregivers });
  }

  async updateCaregiver(caregiver: CaregiverContact): Promise<void> {
    const settings = await this.getSettings();
    const index = settings.caregivers.findIndex((c) => c.id === caregiver.id);
    if (index >= 0) {
      settings.caregivers[index] = caregiver;
      await this.saveSettings({ caregivers: settings.caregivers });
    }
  }

  async getCustomPhrases(): Promise<CustomPhrase[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CUSTOM_PHRASES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      if (__DEV__) console.error('Error getting custom phrases:', error);
      return [];
    }
  }

  private sanitizeText(text: string, maxLength: number = 200): string {
    return text.trim().slice(0, maxLength);
  }

  async addCustomPhrase(text: string, category: Phrase['category'], emoji?: string): Promise<CustomPhrase> {
    const sanitizedText = this.sanitizeText(text, 200);
    if (!sanitizedText) {
      throw new Error('Phrase text cannot be empty');
    }

    const phrases = await this.getCustomPhrases();
    const now = Date.now();
    const newPhrase: CustomPhrase = {
      id: `custom_${generateId()}`,
      text: sanitizedText,
      category,
      emoji: emoji?.slice(0, 10),
      isCustom: true,
      isFavorite: false,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    
    phrases.push(newPhrase);
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PHRASES, JSON.stringify(phrases));
    return newPhrase;
  }

  async updateCustomPhrase(id: string, updates: Partial<Pick<CustomPhrase, 'text' | 'category' | 'emoji'>>): Promise<CustomPhrase | null> {
    const phrases = await this.getCustomPhrases();
    const index = phrases.findIndex((p) => p.id === id);
    
    if (index < 0) return null;

    const sanitizedUpdates: Partial<Pick<CustomPhrase, 'text' | 'category' | 'emoji'>> = {};
    if (updates.text !== undefined) {
      const sanitizedText = this.sanitizeText(updates.text, 200);
      if (!sanitizedText) {
        throw new Error('Phrase text cannot be empty');
      }
      sanitizedUpdates.text = sanitizedText;
    }
    if (updates.category !== undefined) {
      sanitizedUpdates.category = updates.category;
    }
    if (updates.emoji !== undefined) {
      sanitizedUpdates.emoji = updates.emoji?.slice(0, 10);
    }
    
    phrases[index] = {
      ...phrases[index],
      ...sanitizedUpdates,
      updatedAt: Date.now(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PHRASES, JSON.stringify(phrases));
    return phrases[index];
  }

  async deleteCustomPhrase(id: string): Promise<boolean> {
    const phrases = await this.getCustomPhrases();
    const filtered = phrases.filter((p) => p.id !== id);
    
    if (filtered.length === phrases.length) return false;
    
    await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PHRASES, JSON.stringify(filtered));
    
    const favorites = await this.getFavorites();
    const filteredFavorites = favorites.filter((f) => f.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filteredFavorites));
    
    return true;
  }

  async incrementPhraseUsage(phraseId: string): Promise<void> {
    if (phraseId.startsWith('custom_')) {
      const phrases = await this.getCustomPhrases();
      const index = phrases.findIndex((p) => p.id === phraseId);
      if (index >= 0) {
        phrases[index].usageCount = (phrases[index].usageCount || 0) + 1;
        await AsyncStorage.setItem(STORAGE_KEYS.CUSTOM_PHRASES, JSON.stringify(phrases));
      }
    }
  }

  async getSavedLocations(): Promise<SavedLocation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_LOCATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      if (__DEV__) console.error('Error getting saved locations:', error);
      return [];
    }
  }

  async saveLocation(
    type: LocationType,
    name: string,
    latitude: number,
    longitude: number,
    radius: number = DEFAULT_LOCATION_RADIUS
  ): Promise<SavedLocation> {
    const locations = await this.getSavedLocations();
    const existingIndex = locations.findIndex((l) => l.type === type);
    
    const newLocation: SavedLocation = {
      id: `loc_${type}_${Date.now()}`,
      type,
      name,
      latitude,
      longitude,
      radius,
      createdAt: Date.now(),
    };

    if (existingIndex >= 0) {
      locations[existingIndex] = newLocation;
    } else {
      locations.push(newLocation);
    }

    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(locations));
    return newLocation;
  }

  async deleteLocation(type: LocationType): Promise<boolean> {
    const locations = await this.getSavedLocations();
    const filtered = locations.filter((l) => l.type !== type);
    
    if (filtered.length === locations.length) return false;
    
    await AsyncStorage.setItem(STORAGE_KEYS.SAVED_LOCATIONS, JSON.stringify(filtered));
    return true;
  }

  async getLocationByType(type: LocationType): Promise<SavedLocation | null> {
    const locations = await this.getSavedLocations();
    return locations.find((l) => l.type === type) || null;
  }
async saveCurrentLocation(location: LocationType, isAutoDetected: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CURRENT_LOCATION,
        JSON.stringify({ location, isAutoDetected, timestamp: Date.now() })
      );
    } catch (error) {
      if (__DEV__) console.error('Error saving current location:', error);
    }
  }

  async getCurrentLocation(): Promise<{ location: LocationType; isAutoDetected: boolean } | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_LOCATION);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return { location: parsed.location, isAutoDetected: parsed.isAutoDetected };
    } catch (error) {
      if (__DEV__) console.error('Error getting current location:', error);
      return null;
    }
  }

  async saveExplicitEmotion(emotion: EmotionType | null): Promise<void> {
    try {
      if (emotion === null) {
        await AsyncStorage.removeItem(STORAGE_KEYS.EXPLICIT_EMOTION);
      } else {
        await AsyncStorage.setItem(
          STORAGE_KEYS.EXPLICIT_EMOTION,
          JSON.stringify({ emotion, timestamp: Date.now() })
        );
      }
    } catch (error) {
      if (__DEV__) console.error('Error saving explicit emotion:', error);
    }
  }

  async getExplicitEmotion(): Promise<EmotionType | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.EXPLICIT_EMOTION);
      if (!data) return null;
      const parsed = JSON.parse(data);
      const maxAge = 30 * 60 * 1000;
      if (Date.now() - parsed.timestamp > maxAge) {
        await AsyncStorage.removeItem(STORAGE_KEYS.EXPLICIT_EMOTION);
        return null;
      }
      return parsed.emotion;
    } catch (error) {
      if (__DEV__) console.error('Error getting explicit emotion:', error);
      return null;
    }
  }

  async saveTapHistory(tapHistory: TapSignal[]): Promise<void> {
    try {
      const recentTaps = tapHistory.slice(-20);
      await AsyncStorage.setItem(STORAGE_KEYS.TAP_HISTORY, JSON.stringify(recentTaps));
    } catch (error) {
      if (__DEV__) console.error('Error saving tap history:', error);
    }
  }

  async getTapHistory(): Promise<TapSignal[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TAP_HISTORY);
      if (!data) return [];
      const taps: TapSignal[] = JSON.parse(data);
      const maxAge = 5 * 60 * 1000;
      return taps.filter(tap => Date.now() - tap.timestamp < maxAge);
    } catch (error) {
      if (__DEV__) console.error('Error getting tap history:', error);
      return [];
    }
  }

  async savePhrasesSentimentHistory(phrases: { timestamp: number; phrase: string }[]): Promise<void> {
    try {
      const recentPhrases = phrases.slice(-10);
      await AsyncStorage.setItem(STORAGE_KEYS.PHRASE_SENTIMENT_HISTORY, JSON.stringify(recentPhrases));
    } catch (error) {
      if (__DEV__) console.error('Error saving phrase sentiment history:', error);
    }
  }

  async getPhraseSentimentHistory(): Promise<{ timestamp: number; phrase: string }[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PHRASE_SENTIMENT_HISTORY);
      if (!data) return [];
      const phrases: { timestamp: number; phrase: string }[] = JSON.parse(data);
      const maxAge = 10 * 60 * 1000;
      return phrases.filter(p => Date.now() - p.timestamp < maxAge);
    } catch (error) {
      if (__DEV__) console.error('Error getting phrase sentiment history:', error);
      return [];
    }
  }

  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_SETTINGS,
        STORAGE_KEYS.PHRASE_HISTORY,
        STORAGE_KEYS.EMOTION_HISTORY,
        STORAGE_KEYS.FAVORITES,
        STORAGE_KEYS.LLM_CACHE,
        STORAGE_KEYS.SAVED_LOCATIONS,
        STORAGE_KEYS.CURRENT_LOCATION,
        STORAGE_KEYS.EXPLICIT_EMOTION,
        STORAGE_KEYS.TAP_HISTORY,
        STORAGE_KEYS.PHRASE_SENTIMENT_HISTORY,
      ]);
    } catch (error) {
      if (__DEV__) console.error('Error clearing data:', error);
    }
  }

  async cacheLLMResponse(key: string, response: string): Promise<void> {
    try {
      const cache = await this.getLLMCache();
      cache[key] = {
        response,
        timestamp: Date.now(),
      };

      const entries = Object.entries(cache);
      if (entries.length > 50) {
        entries.sort((a, b) => b[1].timestamp - a[1].timestamp);
        const trimmedCache = Object.fromEntries(entries.slice(0, 50));
        await AsyncStorage.setItem(STORAGE_KEYS.LLM_CACHE, JSON.stringify(trimmedCache));
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.LLM_CACHE, JSON.stringify(cache));
      }
    } catch (_error) {
      if (__DEV__) console.error('Error caching LLM response:', _error);
    }
  }

  async getCachedLLMResponse(key: string, maxAge: number = 30 * 60 * 1000): Promise<string | null> {
    try {
      const cache = await this.getLLMCache();
      const entry = cache[key];

      if (entry && Date.now() - entry.timestamp < maxAge) {
        return entry.response;
      }

      return null;
    } catch (_error) {
      if (__DEV__) console.error('Error getting cached LLM response:', _error);
      return null;
    }
  }

  private async getLLMCache(): Promise<Record<string, LLMCacheEntry>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LLM_CACHE);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }
}

export const StorageService = new StorageServiceClass();
export default StorageService;
