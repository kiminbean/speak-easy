import { TTSService } from '@/services/TTSService';

jest.mock('expo-speech', () => ({
  getAvailableVoicesAsync: jest.fn().mockResolvedValue([
    { identifier: 'en-US-voice', name: 'Samantha', quality: 'Enhanced', language: 'en-US' },
    { identifier: 'en-GB-voice', name: 'Daniel', quality: 'Default', language: 'en-GB' },
    { identifier: 'ko-KR-voice', name: 'Yuna', quality: 'Premium', language: 'ko-KR' },
    { identifier: 'ja-JP-voice', name: 'Kyoko', quality: 'Enhanced', language: 'ja-JP' },
    { identifier: 'es-ES-voice', name: 'Monica', quality: 'Default', language: 'es-ES' },
  ]),
  speak: jest.fn(),
  stop: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn().mockResolvedValue(undefined),
  resume: jest.fn().mockResolvedValue(undefined),
  isSpeakingAsync: jest.fn().mockResolvedValue(false),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  notificationAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Warning: 'warning', Success: 'success', Error: 'error' },
}));

const Speech = require('expo-speech');
const Haptics = require('expo-haptics');

describe('TTSService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should load available voices', async () => {
      await TTSService.initialize();

      expect(Speech.getAvailableVoicesAsync).toHaveBeenCalled();
    });

    it('should not throw on initialization error', async () => {
      Speech.getAvailableVoicesAsync.mockRejectedValueOnce(new Error('Voice error'));

      await expect(TTSService.initialize()).resolves.not.toThrow();
    });
  });

  describe('speak', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should call Speech.speak with text', async () => {
      await TTSService.speak('Hello world');

      expect(Speech.speak).toHaveBeenCalledWith('Hello world', expect.any(Object));
    });

    it('should not speak empty text', async () => {
      await TTSService.speak('');
      await TTSService.speak('   ');

      expect(Speech.speak).not.toHaveBeenCalled();
    });

    it('should stop previous speech before starting new one', async () => {
      await TTSService.speak('First message');
      await TTSService.speak('Second message');

      expect(Speech.stop).toHaveBeenCalledTimes(2);
    });

    it('should trigger haptic feedback', async () => {
      await TTSService.speak('Hello');

      expect(Haptics.impactAsync).toHaveBeenCalledWith('light');
    });

    it('should use custom options', async () => {
      await TTSService.speak('Test', {
        rate: 1.5,
        pitch: 1.2,
        language: 'ko-KR',
      });

      expect(Speech.speak).toHaveBeenCalledWith(
        'Test',
        expect.objectContaining({
          rate: 1.5,
          pitch: 1.2,
          language: 'ko-KR',
        })
      );
    });
  });

  describe('speakWithEmotion', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should adjust rate and pitch for happy emotion', async () => {
      await TTSService.speakWithEmotion('I am happy', 'happy');

      expect(Speech.speak).toHaveBeenCalledWith(
        'I am happy',
        expect.objectContaining({
          rate: expect.any(Number),
          pitch: expect.any(Number),
        })
      );

      const callArgs = Speech.speak.mock.calls[0][1];
      expect(callArgs.rate).toBeGreaterThan(0.9);
      expect(callArgs.pitch).toBeGreaterThan(1.0);
    });

    it('should adjust rate and pitch for sad emotion', async () => {
      await TTSService.speakWithEmotion('I am sad', 'sad');

      const callArgs = Speech.speak.mock.calls[0][1];
      expect(callArgs.rate).toBeLessThan(0.9);
    });

    it('should adjust rate for anxious emotion', async () => {
      await TTSService.speakWithEmotion('I am anxious', 'anxious');

      const callArgs = Speech.speak.mock.calls[0][1];
      expect(callArgs.rate).toBeGreaterThan(1.0);
    });
  });

  describe('speakEmergency', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should trigger warning haptic', async () => {
      await TTSService.speakEmergency('Help me');

      expect(Haptics.notificationAsync).toHaveBeenCalledWith('warning');
    });

    it('should speak with slower rate', async () => {
      await TTSService.speakEmergency('Emergency');

      expect(Speech.speak).toHaveBeenCalledWith(
        'Emergency',
        expect.objectContaining({
          rate: 0.85,
        })
      );
    });

    it('should use specified language', async () => {
      await TTSService.speakEmergency('도와주세요', 'ko-KR');

      expect(Speech.speak).toHaveBeenCalledWith(
        '도와주세요',
        expect.objectContaining({
          language: 'ko-KR',
        })
      );
    });
  });

  describe('stop', () => {
    it('should call Speech.stop', async () => {
      await TTSService.stop();

      expect(Speech.stop).toHaveBeenCalled();
    });

    it('should not throw on stop error', async () => {
      Speech.stop.mockRejectedValueOnce(new Error('Stop error'));

      await expect(TTSService.stop()).resolves.not.toThrow();
    });
  });

  describe('pause', () => {
    it('should call Speech.pause', async () => {
      await TTSService.pause();

      expect(Speech.pause).toHaveBeenCalled();
    });
  });

  describe('resume', () => {
    it('should call Speech.resume', async () => {
      await TTSService.resume();

      expect(Speech.resume).toHaveBeenCalled();
    });
  });

  describe('checkIsSpeaking', () => {
    it('should return speaking state', async () => {
      Speech.isSpeakingAsync.mockResolvedValueOnce(true);

      const isSpeaking = await TTSService.checkIsSpeaking();

      expect(isSpeaking).toBe(true);
    });
  });

  describe('setDefaultRate', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should set default rate', async () => {
      TTSService.setDefaultRate(1.2);
      await TTSService.speak('Test');

      expect(Speech.speak).toHaveBeenCalledWith(
        'Test',
        expect.objectContaining({
          rate: 1.2,
        })
      );
    });

    it('should clamp rate to valid range', async () => {
      TTSService.setDefaultRate(3.0);
      await TTSService.speak('Test');

      const callArgs = Speech.speak.mock.calls[0][1];
      expect(callArgs.rate).toBeLessThanOrEqual(2.0);

      TTSService.setDefaultRate(0.01);
      await TTSService.speak('Test2');

      const callArgs2 = Speech.speak.mock.calls[1][1];
      expect(callArgs2.rate).toBeGreaterThanOrEqual(0.1);
    });
  });

  describe('setDefaultPitch', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should set default pitch', async () => {
      TTSService.setDefaultPitch(1.5);
      await TTSService.speak('Test');

      expect(Speech.speak).toHaveBeenCalledWith(
        'Test',
        expect.objectContaining({
          pitch: 1.5,
        })
      );
    });

    it('should clamp pitch to valid range', async () => {
      TTSService.setDefaultPitch(3.0);
      await TTSService.speak('Test');

      const callArgs = Speech.speak.mock.calls[0][1];
      expect(callArgs.pitch).toBeLessThanOrEqual(2.0);
    });
  });

  describe('setDefaultLanguage', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should set default language', async () => {
      TTSService.setDefaultLanguage('ko-KR');
      await TTSService.speak('안녕하세요');

      expect(Speech.speak).toHaveBeenCalledWith(
        '안녕하세요',
        expect.objectContaining({
          language: 'ko-KR',
        })
      );
    });
  });

  describe('getVoicesForLanguage', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should return voices for specified language', () => {
      const voices = TTSService.getVoicesForLanguage('en');

      expect(voices.length).toBeGreaterThan(0);
      expect(voices.every(v => v.language.toLowerCase().startsWith('en'))).toBe(true);
    });

    it('should return empty array for unsupported language', () => {
      const voices = TTSService.getVoicesForLanguage('xyz');

      expect(voices).toEqual([]);
    });
  });

  describe('getAllVoices', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should return all available voices', () => {
      const voices = TTSService.getAllVoices();

      expect(voices.length).toBe(5);
    });
  });

  describe('getPreferredVoiceForLanguage', () => {
    beforeEach(async () => {
      await TTSService.initialize();
    });

    it('should return preferred voice identifier', () => {
      const voiceId = TTSService.getPreferredVoiceForLanguage('en');

      expect(voiceId).toBeDefined();
      expect(typeof voiceId).toBe('string');
    });

    it('should return undefined for unsupported language', () => {
      const voiceId = TTSService.getPreferredVoiceForLanguage('xyz');

      expect(voiceId).toBeUndefined();
    });
  });
});
