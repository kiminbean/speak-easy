import { LLMService } from '@/services/LLMService';
import { UserContext } from '@/types';

jest.mock('react-native-executorch', () => null, { virtual: true });

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

describe('LLMService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isReady', () => {
    it('should return false before initialization', () => {
      expect(LLMService.isReady).toBe(false);
    });
  });

  describe('progress', () => {
    it('should return download progress', () => {
      expect(typeof LLMService.progress).toBe('number');
      expect(LLMService.progress).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isNativeMode', () => {
    it('should return false when native module not available', () => {
      expect(LLMService.isNativeMode).toBe(false);
    });
  });

  describe('initialize', () => {
    it('should not throw on initialization', async () => {
      await expect(LLMService.initialize()).resolves.not.toThrow();
    });

    it('should accept custom config', async () => {
      await expect(LLMService.initialize({
        temperature: 0.7,
        maxTokens: 256,
      })).resolves.not.toThrow();
    });
  });

  describe('generate', () => {
    beforeEach(async () => {
      await LLMService.initialize();
    });

    it('should return simulated response in fallback mode', async () => {
      const response = await LLMService.generate('Hello');

      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(0);
    });

    it('should include timing information', async () => {
      const response = await LLMService.generate('Test prompt');

      expect(response.totalTimeMs).toBeDefined();
      expect(response.totalTimeMs).toBeGreaterThanOrEqual(0);
    });

    it('should include tokens per second estimate', async () => {
      const response = await LLMService.generate('Test');

      expect(response.tokensPerSecond).toBeDefined();
    });
  });

  describe('generatePredictions', () => {
    beforeEach(async () => {
      await LLMService.initialize();
    });

    it('should return phrases for home context', async () => {
      const context = createContext();
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.length).toBeLessThanOrEqual(6);
      expect(phrases.every(p => p.id && p.text && p.category)).toBe(true);
    });

    it('should return phrases for school context', async () => {
      const context = createContext({ locationType: 'school' });
      const phrases = await LLMService.generatePredictions(context, 4);

      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.every(p => typeof p.text === 'string')).toBe(true);
    });

    it('should return phrases for hospital context', async () => {
      const context = createContext({ locationType: 'hospital' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should return phrases for restaurant context', async () => {
      const context = createContext({ locationType: 'restaurant' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should return phrases for outdoor context', async () => {
      const context = createContext({ locationType: 'outdoor' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should return phrases for unknown context', async () => {
      const context = createContext({ locationType: 'unknown' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should return phrases with valid category', async () => {
      const context = createContext();
      const phrases = await LLMService.generatePredictions(context, 6);
      const validCategories = ['greeting', 'need', 'want', 'feeling', 'question', 'response', 'social', 'emergency'];

      expect(phrases.every(p => validCategories.includes(p.category))).toBe(true);
    });

    it('should return phrases with emoji', async () => {
      const context = createContext();
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.every(p => p.emoji)).toBe(true);
    });
  });

  describe('onProgress', () => {
    it('should register progress callback', () => {
      const callback = jest.fn();
      LLMService.onProgress(callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('onReady', () => {
    it('should register ready callback', () => {
      const callback = jest.fn();
      LLMService.onReady(callback);

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('time of day variations', () => {
    beforeEach(async () => {
      await LLMService.initialize();
    });

    const times = ['morning', 'afternoon', 'evening', 'night'] as const;

    times.forEach(time => {
      it(`should return phrases for ${time}`, async () => {
        const context = createContext({ timeOfDay: time });
        const phrases = await LLMService.generatePredictions(context, 6);

        expect(phrases.length).toBeGreaterThan(0);
      });
    });
  });

  describe('location and time combinations', () => {
    beforeEach(async () => {
      await LLMService.initialize();
    });

    it('should handle home + morning', async () => {
      const context = createContext({ locationType: 'home', timeOfDay: 'morning' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should handle school + afternoon', async () => {
      const context = createContext({ locationType: 'school', timeOfDay: 'afternoon' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should handle hospital + night', async () => {
      const context = createContext({ locationType: 'hospital', timeOfDay: 'night' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should vary fallback suggestions by location and time', async () => {
      const homeMorning = await LLMService.generatePredictions(
        createContext({ locationType: 'home', timeOfDay: 'morning' }),
        6
      );
      const hospitalNight = await LLMService.generatePredictions(
        createContext({ locationType: 'hospital', timeOfDay: 'night' }),
        6
      );

      expect(homeMorning.map((phrase) => phrase.text)).not.toEqual(
        hospitalNight.map((phrase) => phrase.text)
      );
      expect(homeMorning.some((phrase) => /breakfast|cereal|cartoons/i.test(phrase.text))).toBe(true);
      expect(hospitalNight.some((phrase) => /sleep|pain|mom|scared|water/i.test(phrase.text))).toBe(true);
    });

    it('should include weather-aware fallback suggestions when weather is provided', async () => {
      const rainyOutdoor = await LLMService.generatePredictions(
        createContext({
          locationType: 'outdoor',
          timeOfDay: 'afternoon',
          weather: {
            condition: 'rain',
            isRaining: true,
            isSnowing: false,
            temperature: 12,
            feelsLike: 10,
            humidity: 88,
            windSpeed: 8,
            source: 'fallback',
            timestamp: Date.now(),
          },
        }),
        6
      );

      expect(rainyOutdoor.some((phrase) => /rain|umbrella|wet/i.test(phrase.text))).toBe(true);
    });
  });

  describe('edge cases', () => {
    beforeEach(async () => {
      await LLMService.initialize();
    });

    it('should handle numPredictions = 1', async () => {
      const context = createContext();
      const phrases = await LLMService.generatePredictions(context, 1);

      expect(phrases.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle numPredictions = 10', async () => {
      const context = createContext();
      const phrases = await LLMService.generatePredictions(context, 10);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should handle empty recentPhrases', async () => {
      const context = createContext({ recentPhrases: [] });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should handle emotionState', async () => {
      const context = createContext({ emotionState: 'anxious' });
      const phrases = await LLMService.generatePredictions(context, 6);

      expect(phrases.length).toBeGreaterThan(0);
    });
  });
});
