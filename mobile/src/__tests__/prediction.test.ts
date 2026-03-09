import { PredictionService } from '@/services/PredictionService';
import { UserContext, SupportedLanguage } from '@/types';

const createContext = (overrides: Partial<UserContext> = {}): UserContext => ({
  userId: 'test-user',
  timeOfDay: 'morning',
  locationType: 'home',
  season: 'summer',
  dayOfWeek: 'weekday',
  recentPhrases: [],
  language: 'en',
  ...overrides,
});

describe('PredictionService', () => {
  beforeEach(() => {
    PredictionService.clearCache();
  });

  describe('predict', () => {
    it('should return phrases for home location in morning', () => {
      const context = createContext();

      const result = PredictionService.predict(context, 6);

      expect(result.phrases).toHaveLength(6);
      expect(result.confidence).toHaveLength(6);
      expect(result.source).toBe('rules');
      expect(result.cached).toBe(false);
      expect(result.latencyMs).toBeDefined();
    });

    it('should return phrases for school location in afternoon', () => {
      const context = createContext({
        timeOfDay: 'afternoon',
        locationType: 'school',
        season: 'fall',
      });

      const result = PredictionService.predict(context, 4);

      expect(result.phrases).toHaveLength(4);
      expect(result.phrases.every(p => p.id && p.text && p.category)).toBe(true);
    });

    it('should return cached result on second call with same context', () => {
      const context = createContext({
        timeOfDay: 'evening',
        locationType: 'restaurant',
        season: 'winter',
        dayOfWeek: 'weekend',
      });

      const firstResult = PredictionService.predict(context, 6);
      const secondResult = PredictionService.predict(context, 6);

      expect(firstResult.cached).toBe(false);
      expect(secondResult.cached).toBe(true);
      expect(secondResult.latencyMs).toBeLessThanOrEqual(firstResult.latencyMs);
    });

    it('should include emotion phrases when emotionState is provided', () => {
      const context = createContext({
        season: 'spring',
        emotionState: 'anxious',
      });

      const result = PredictionService.predict(context, 6);

      expect(result.phrases.length).toBeGreaterThan(0);
      expect(result.reasoning).toContain('Rule-based');
    });

    it('should include weather phrases when weather context is provided', () => {
      const context = createContext({
        timeOfDay: 'afternoon',
        locationType: 'outdoor',
        dayOfWeek: 'weekend',
        weather: {
          condition: 'clear',
          isRaining: false,
          isSnowing: false,
          temperature: 28,
          windSpeed: 10,
          feelsLike: 30,
          humidity: 60,
          timestamp: Date.now(),
          source: 'fallback',
        },
      });

      const result = PredictionService.predict(context, 6);

      expect(result.phrases.length).toBeGreaterThan(0);
      expect(result.reasoning).toContain('clear');
      expect(result.reasoning).toContain('28°C');
    });

    it('should keep location-specific phrases visible across locations with the same weather', () => {
      const weather = {
        condition: 'rain' as const,
        isRaining: true,
        isSnowing: false,
        temperature: 12,
        windSpeed: 8,
        feelsLike: 10,
        humidity: 88,
        timestamp: Date.now(),
        source: 'fallback' as const,
      };

      const home = PredictionService.predict(createContext({ locationType: 'home', timeOfDay: 'afternoon', weather }), 6);
      const hospital = PredictionService.predict(createContext({ locationType: 'hospital', timeOfDay: 'afternoon', weather }), 6);

      expect(home.phrases.map((phrase) => phrase.text)).not.toEqual(hospital.phrases.map((phrase) => phrase.text));
      expect(home.phrases[0]?.text).not.toBe(hospital.phrases[0]?.text);
    });
  });

  describe('predictWithRules', () => {
    it('should return rule-based predictions for hospital location', () => {
      const context = createContext({
        timeOfDay: 'night',
        locationType: 'hospital',
        season: 'winter',
      });

      const result = PredictionService.predictWithRules(context, 6);

      expect(result.phrases).toHaveLength(6);
      expect(result.source).toBe('rules');
      expect(result.confidence.every(c => c >= 0.7 && c <= 1.0)).toBe(true);
    });

    it('should assign correct emojis based on context', () => {
      const context = createContext({
        season: 'spring',
        dayOfWeek: 'weekend',
      });

      const result = PredictionService.predictWithRules(context, 6);

      expect(result.phrases.every(p => p.emoji)).toBe(true);
    });
  });

  describe('getEmergencyPhrases', () => {
    it('should return emergency phrases in English', () => {
      const phrases = PredictionService.getEmergencyPhrases('en');

      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.every(p => p.category === 'emergency')).toBe(true);
      expect(phrases.every(p => p.emoji === '🚨')).toBe(true);
    });

    it('should return emergency phrases in Korean', () => {
      const phrases = PredictionService.getEmergencyPhrases('ko');

      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.every(p => p.category === 'emergency')).toBe(true);
    });

    it('should return emergency phrases in Japanese', () => {
      const phrases = PredictionService.getEmergencyPhrases('ja');

      expect(phrases.length).toBeGreaterThan(0);
    });
  });

  describe('getQuickResponses', () => {
    it('should return quick response phrases in English', () => {
      const phrases = PredictionService.getQuickResponses('en');

      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.every(p => p.category === 'response')).toBe(true);
    });

    it('should return quick response phrases in Spanish', () => {
      const phrases = PredictionService.getQuickResponses('es');

      expect(phrases.length).toBeGreaterThan(0);
    });
  });

  describe('isLLMAvailable', () => {
    it('should return false when LLM is not initialized', () => {
      PredictionService.initialize();

      expect(PredictionService.isLLMAvailable()).toBe(false);
    });

    it('should return true when LLM is initialized and ready', () => {
      const mockLLM = {
        isReady: true,
        generate: jest.fn().mockResolvedValue('{"phrases":["test"],"categories":["need"]}'),
      };

      PredictionService.initialize(mockLLM);

      expect(PredictionService.isLLMAvailable()).toBe(true);
    });
  });

  describe('enhanceWithLLM', () => {
    it('should return null when LLM is not available', async () => {
      PredictionService.initialize();

      const context = createContext();
      const result = await PredictionService.enhanceWithLLM(context, 6);

      expect(result).toBeNull();
    });

    it('should return LLM-enhanced predictions when LLM is available', async () => {
      const mockLLM = {
        isReady: true,
        generate: jest.fn().mockResolvedValue(JSON.stringify({
          phrases: ['I want breakfast', 'I am hungry', 'Good morning'],
          categories: ['want', 'feeling', 'greeting'],
        })),
      };

      PredictionService.initialize(mockLLM);

      const context = createContext();
      const result = await PredictionService.enhanceWithLLM(context, 6);

      expect(result).not.toBeNull();
      expect(result?.source).toBe('llm');
      expect(result?.phrases.length).toBeGreaterThan(0);
    });
  });

  describe('clearCache', () => {
    it('should clear the prediction cache', () => {
      const context = createContext();

      PredictionService.predict(context, 6);
      const cachedResult = PredictionService.predict(context, 6);
      expect(cachedResult.cached).toBe(true);

      PredictionService.clearCache();

      const afterClearResult = PredictionService.predict(context, 6);
      expect(afterClearResult.cached).toBe(false);
    });
  });

  describe('language support', () => {
    const languages: SupportedLanguage[] = ['en', 'ko', 'ja', 'es', 'fr', 'de', 'ar'];

    languages.forEach(lang => {
      it(`should return predictions for language: ${lang}`, () => {
        const context = createContext({
          timeOfDay: 'afternoon',
          season: 'spring',
          language: lang,
        });

        const result = PredictionService.predict(context, 6);

        expect(result.phrases.length).toBeGreaterThan(0);
        expect(result.phrases.every(p => p.text.length > 0)).toBe(true);
      });
    });
  });

  describe('location types', () => {
    const locations = ['home', 'school', 'hospital', 'restaurant', 'outdoor', 'unknown'] as const;

    locations.forEach(location => {
      it(`should return predictions for location: ${location}`, () => {
        const context = createContext({ locationType: location });

        const result = PredictionService.predict(context, 6);

        expect(result.phrases.length).toBeGreaterThan(0);
      });
    });
  });

  describe('time of day', () => {
    const times = ['morning', 'afternoon', 'evening', 'night'] as const;

    times.forEach(time => {
      it(`should return predictions for time: ${time}`, () => {
        const context = createContext({ timeOfDay: time });

        const result = PredictionService.predict(context, 6);

        expect(result.phrases.length).toBeGreaterThan(0);
      });
    });
  });
});
