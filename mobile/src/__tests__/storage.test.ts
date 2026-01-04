import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../services/StorageService';

const mockAsyncStorage: Record<string, string> = {};

beforeEach(() => {
  jest.clearAllMocks();
  Object.keys(mockAsyncStorage).forEach(key => delete mockAsyncStorage[key]);
  
  (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
    return Promise.resolve(mockAsyncStorage[key] || null);
  });
  
  (AsyncStorage.setItem as jest.Mock).mockImplementation((key: string, value: string) => {
    mockAsyncStorage[key] = value;
    return Promise.resolve();
  });
  
  (AsyncStorage.removeItem as jest.Mock).mockImplementation((key: string) => {
    delete mockAsyncStorage[key];
    return Promise.resolve();
  });
  
  (AsyncStorage.multiRemove as jest.Mock).mockImplementation((keys: string[]) => {
    keys.forEach(key => delete mockAsyncStorage[key]);
    return Promise.resolve();
  });
});

describe('StorageService', () => {
  describe('Settings', () => {
    it('returns default settings when no data exists', async () => {
      const settings = await StorageService.getSettings();
      
      expect(settings.language).toBe('en');
      expect(settings.speechRate).toBe(0.9);
      expect(settings.enableHaptics).toBe(true);
      expect(settings.hasCompletedOnboarding).toBe(false);
    });

    it('saves and retrieves settings', async () => {
      await StorageService.saveSettings({ language: 'ko', speechRate: 1.2 });
      const settings = await StorageService.getSettings();
      
      expect(settings.language).toBe('ko');
      expect(settings.speechRate).toBe(1.2);
    });

    it('merges partial settings with existing', async () => {
      await StorageService.saveSettings({ language: 'ja' });
      await StorageService.saveSettings({ largeText: true });
      const settings = await StorageService.getSettings();
      
      expect(settings.language).toBe('ja');
      expect(settings.largeText).toBe(true);
    });
  });

  describe('Phrase History', () => {
    it('adds phrase to history', async () => {
      await StorageService.addPhraseToHistory('Hello');
      await StorageService.addPhraseToHistory('How are you?');
      
      const history = await StorageService.getPhraseHistory();
      expect(history).toHaveLength(2);
      expect(history[0].phrase).toBe('Hello');
      expect(history[1].phrase).toBe('How are you?');
    });

    it('returns recent phrases', async () => {
      for (let i = 0; i < 15; i++) {
        await StorageService.addPhraseToHistory(`Phrase ${i}`);
      }
      
      const recent = await StorageService.getRecentPhrases(5);
      expect(recent).toHaveLength(5);
      expect(recent[4]).toBe('Phrase 14');
    });

    it('trims history to 100 entries', async () => {
      for (let i = 0; i < 105; i++) {
        await StorageService.addPhraseToHistory(`Phrase ${i}`);
      }
      
      const history = await StorageService.getPhraseHistory();
      expect(history).toHaveLength(100);
    });
  });

  describe('Favorites', () => {
    const mockPhrase = {
      id: 'test-1',
      text: 'Test phrase',
      category: 'greeting' as const,
      isFavorite: false,
    };

    it('toggles favorite on', async () => {
      const result = await StorageService.toggleFavorite(mockPhrase);
      expect(result).toBe(true);
      
      const isFav = await StorageService.isFavorite('test-1');
      expect(isFav).toBe(true);
    });

    it('toggles favorite off', async () => {
      await StorageService.toggleFavorite(mockPhrase);
      const result = await StorageService.toggleFavorite(mockPhrase);
      expect(result).toBe(false);
      
      const isFav = await StorageService.isFavorite('test-1');
      expect(isFav).toBe(false);
    });

    it('returns all favorites', async () => {
      await StorageService.toggleFavorite({ ...mockPhrase, id: 'fav-1' });
      await StorageService.toggleFavorite({ ...mockPhrase, id: 'fav-2' });
      
      const favorites = await StorageService.getFavorites();
      expect(favorites).toHaveLength(2);
    });
  });

  describe('Custom Phrases', () => {
    it('adds custom phrase', async () => {
      const phrase = await StorageService.addCustomPhrase('My custom phrase', 'greeting', '🌟');
      
      expect(phrase.text).toBe('My custom phrase');
      expect(phrase.category).toBe('greeting');
      expect(phrase.emoji).toBe('🌟');
      expect(phrase.isCustom).toBe(true);
      expect(phrase.id).toContain('custom_');
    });

    it('retrieves custom phrases', async () => {
      await StorageService.addCustomPhrase('Phrase 1', 'greeting');
      await StorageService.addCustomPhrase('Phrase 2', 'social');
      
      const phrases = await StorageService.getCustomPhrases();
      expect(phrases).toHaveLength(2);
    });

    it('updates custom phrase', async () => {
      const phrase = await StorageService.addCustomPhrase('Original', 'greeting');
      const updated = await StorageService.updateCustomPhrase(phrase.id, { text: 'Updated' });
      
      expect(updated?.text).toBe('Updated');
    });

    it('deletes custom phrase', async () => {
      const phrase = await StorageService.addCustomPhrase('To delete', 'greeting');
      const result = await StorageService.deleteCustomPhrase(phrase.id);
      
      expect(result).toBe(true);
      const phrases = await StorageService.getCustomPhrases();
      expect(phrases).toHaveLength(0);
    });
  });

  describe('Saved Locations', () => {
    it('saves location', async () => {
      const location = await StorageService.saveLocation('home', 'My Home', 37.5, 127.0);
      
      expect(location.type).toBe('home');
      expect(location.name).toBe('My Home');
      expect(location.latitude).toBe(37.5);
    });

    it('retrieves location by type', async () => {
      await StorageService.saveLocation('school', 'My School', 37.6, 127.1);
      
      const location = await StorageService.getLocationByType('school');
      expect(location?.name).toBe('My School');
    });

    it('deletes location', async () => {
      await StorageService.saveLocation('hospital', 'Hospital', 37.7, 127.2);
      const result = await StorageService.deleteLocation('hospital');
      
      expect(result).toBe(true);
      const location = await StorageService.getLocationByType('hospital');
      expect(location).toBeNull();
    });
  });
});
