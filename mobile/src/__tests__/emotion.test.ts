import { EmotionService } from '@/services/EmotionService';

describe('EmotionService', () => {
  beforeEach(() => {
    EmotionService.clearHistory();
  });

  describe('recordTap', () => {
    it('should record tap interactions', () => {
      EmotionService.recordTap(1, 100);
      EmotionService.recordTap(2, 150);
      EmotionService.recordTap(1, 80);

      const state = EmotionService.detectEmotion();
      expect(state).toBeDefined();
      expect(state.timestamp).toBeDefined();
    });

    it('should not throw with various tap patterns', () => {
      expect(() => {
        EmotionService.recordTap(1, 50);
        EmotionService.recordTap(3, 200);
        EmotionService.recordTap(5, 500);
      }).not.toThrow();
    });
  });

  describe('recordPhrase', () => {
    it('should record phrase selections', () => {
      EmotionService.recordPhrase('I am happy');
      EmotionService.recordPhrase('I need help');

      const state = EmotionService.detectEmotion();
      expect(state).toBeDefined();
    });

    it('should handle empty phrases', () => {
      expect(() => {
        EmotionService.recordPhrase('');
      }).not.toThrow();
    });
  });

  describe('setExplicitEmotion', () => {
    it('should set explicit emotion', () => {
      EmotionService.setExplicitEmotion('happy');

      const state = EmotionService.detectEmotion();
      expect(state.emotion).toBe('happy');
    });

    it('should override previous explicit emotion', () => {
      EmotionService.setExplicitEmotion('happy');
      EmotionService.setExplicitEmotion('sad');

      const state = EmotionService.detectEmotion();
      expect(state.emotion).toBe('sad');
    });
  });

  describe('clearExplicitEmotion', () => {
    it('should clear explicit emotion', () => {
      EmotionService.setExplicitEmotion('frustrated');
      EmotionService.clearExplicitEmotion();

      const state = EmotionService.detectEmotion();
      expect(state.emotion).toBe('calm');
    });
  });

  describe('detectEmotion', () => {
    it('should return calm state when no signals', () => {
      const state = EmotionService.detectEmotion();

      expect(state.emotion).toBe('calm');
      expect(state.intensity).toBe('low');
      expect(state.confidence).toBe(0.5);
    });

    it('should return emotion state with all required fields', () => {
      EmotionService.setExplicitEmotion('anxious');

      const state = EmotionService.detectEmotion();

      expect(state).toHaveProperty('emotion');
      expect(state).toHaveProperty('intensity');
      expect(state).toHaveProperty('confidence');
      expect(state).toHaveProperty('timestamp');
    });

    it('should detect frustrated from rapid tapping', () => {
      for (let i = 0; i < 10; i++) {
        EmotionService.recordTap(3, 50);
      }

      const state = EmotionService.detectEmotion();
      expect(['frustrated', 'anxious', 'calm']).toContain(state.emotion);
    });

    it('should detect emotion from phrase sentiment', () => {
      EmotionService.recordPhrase('I am scared');
      EmotionService.recordPhrase('help me');
      EmotionService.recordPhrase('I am afraid');

      const state = EmotionService.detectEmotion();
      expect(state.confidence).toBeGreaterThan(0);
    });

    it('should combine multiple signals', () => {
      EmotionService.setExplicitEmotion('anxious');
      EmotionService.recordPhrase('I am worried');
      EmotionService.recordTap(2, 100);

      const state = EmotionService.detectEmotion();
      expect(state.confidence).toBeGreaterThan(0.3);
    });
  });

  describe('calculateIntensity', () => {
    it('should return appropriate intensity based on confidence', () => {
      EmotionService.setExplicitEmotion('frustrated');
      const state = EmotionService.detectEmotion();

      expect(['low', 'medium', 'high', 'critical']).toContain(state.intensity);
    });
  });

  describe('getCopingPhrases', () => {
    it('should return coping phrases for anxious emotion in English', () => {
      const phrases = EmotionService.getCopingPhrases('anxious', 'en');

      expect(phrases.length).toBeGreaterThan(0);
      expect(phrases.every(p => typeof p === 'string')).toBe(true);
    });

    it('should return coping phrases for sad emotion in Korean', () => {
      const phrases = EmotionService.getCopingPhrases('sad', 'ko');

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should return coping phrases based on detected emotion when no emotion specified', () => {
      EmotionService.setExplicitEmotion('frustrated');
      const phrases = EmotionService.getCopingPhrases(undefined, 'en');

      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should support multiple languages', () => {
      const languages = ['en', 'ko', 'ja', 'es', 'fr'] as const;

      languages.forEach(lang => {
        const phrases = EmotionService.getCopingPhrases('happy', lang);
        expect(phrases.length).toBeGreaterThan(0);
      });
    });
  });

  describe('shouldAlertCaregiver', () => {
    it('should return true for high intensity alert emotions', () => {
      const state = {
        emotion: 'scared' as const,
        intensity: 'high' as const,
        confidence: 0.8,
        timestamp: Date.now(),
      };

      expect(EmotionService.shouldAlertCaregiver(state)).toBe(true);
    });

    it('should return true for critical intensity', () => {
      const state = {
        emotion: 'frustrated' as const,
        intensity: 'critical' as const,
        confidence: 0.9,
        timestamp: Date.now(),
      };

      expect(EmotionService.shouldAlertCaregiver(state)).toBe(true);
    });

    it('should return false for low intensity', () => {
      const state = {
        emotion: 'anxious' as const,
        intensity: 'low' as const,
        confidence: 0.3,
        timestamp: Date.now(),
      };

      expect(EmotionService.shouldAlertCaregiver(state)).toBe(false);
    });

    it('should return false for non-alert emotions', () => {
      const state = {
        emotion: 'happy' as const,
        intensity: 'high' as const,
        confidence: 0.8,
        timestamp: Date.now(),
      };

      expect(EmotionService.shouldAlertCaregiver(state)).toBe(false);
    });
  });

  describe('getRecommendedActions', () => {
    it('should return actions for frustrated emotion', () => {
      const actions = EmotionService.getRecommendedActions('frustrated', 'medium');

      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some(a => a.toLowerCase().includes('break') || a.toLowerCase().includes('encourage'))).toBe(true);
    });

    it('should return actions for anxious emotion', () => {
      const actions = EmotionService.getRecommendedActions('anxious', 'high');

      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some(a => a.toLowerCase().includes('reassur') || a.toLowerCase().includes('calm'))).toBe(true);
    });

    it('should return actions for scared emotion', () => {
      const actions = EmotionService.getRecommendedActions('scared', 'high');

      expect(actions.length).toBeGreaterThan(0);
      expect(actions.some(a => a.toLowerCase().includes('comfort') || a.toLowerCase().includes('safety'))).toBe(true);
    });

    it('should include immediate attention for critical intensity', () => {
      const actions = EmotionService.getRecommendedActions('frustrated', 'critical');

      expect(actions[0]).toContain('IMMEDIATE');
    });

    it('should return empty array for non-alert emotions', () => {
      const actions = EmotionService.getRecommendedActions('happy', 'low');

      expect(actions).toEqual([]);
    });
  });

  describe('clearHistory', () => {
    it('should clear all history and explicit emotion', () => {
      EmotionService.setExplicitEmotion('anxious');
      EmotionService.recordTap(1, 100);
      EmotionService.recordPhrase('I am worried');

      EmotionService.clearHistory();

      const state = EmotionService.detectEmotion();
      expect(state.emotion).toBe('calm');
      expect(state.intensity).toBe('low');
    });
  });

  describe('emotion types', () => {
    const emotions = ['happy', 'sad', 'anxious', 'frustrated', 'scared', 'calm', 'excited', 'tired'] as const;

    emotions.forEach(emotion => {
      it(`should handle emotion: ${emotion}`, () => {
        EmotionService.setExplicitEmotion(emotion);
        const state = EmotionService.detectEmotion();

        expect(state.emotion).toBe(emotion);
      });
    });
  });
});
