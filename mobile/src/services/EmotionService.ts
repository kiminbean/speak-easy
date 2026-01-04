/**
 * SpeakEasy - Emotion Service
 * Multi-signal emotion detection (ported from Python emotion_agent.py)
 */

import {
  EmotionType,
  EmotionIntensity,
  EmotionState,
  TapSignal,
  SupportedLanguage,
} from '../types';
import { EMOTIONS, PHRASE_SENTIMENT_MAP, ALERT_EMOTIONS } from '../constants';
import { getCopingPhrasesForLanguage } from '../i18n/phrases';

class EmotionServiceClass {
  private tapHistory: TapSignal[] = [];
  private phraseHistory: { timestamp: number; phrase: string }[] = [];
  private explicitEmotion: EmotionType | null = null;

  // Time windows for signal analysis (in ms)
  private readonly TAP_HISTORY_WINDOW = 5 * 60 * 1000; // 5 minutes
  private readonly PHRASE_HISTORY_WINDOW = 10 * 60 * 1000; // 10 minutes

  /**
   * Record a tap interaction for pattern analysis
   */
  recordTap(tapCount: number, durationMs: number, pressure?: number): void {
    const signal: TapSignal = {
      timestamp: Date.now(),
      tapCount,
      durationMs,
      pressure,
    };

    this.tapHistory.push(signal);
    this.cleanupHistory();
  }

  /**
   * Record a phrase selection for sentiment analysis
   */
  recordPhrase(phrase: string): void {
    this.phraseHistory.push({
      timestamp: Date.now(),
      phrase: phrase.toLowerCase(),
    });
    this.cleanupHistory();
  }

  /**
   * Set emotion explicitly from user button press
   */
  setExplicitEmotion(emotion: EmotionType): void {
    this.explicitEmotion = emotion;
  }

  /**
   * Clear explicit emotion
   */
  clearExplicitEmotion(): void {
    this.explicitEmotion = null;
  }

  /**
   * Clean up old history entries
   */
  private cleanupHistory(): void {
    const now = Date.now();

    this.tapHistory = this.tapHistory.filter(
      (tap) => now - tap.timestamp < this.TAP_HISTORY_WINDOW
    );

    this.phraseHistory = this.phraseHistory.filter(
      (item) => now - item.timestamp < this.PHRASE_HISTORY_WINDOW
    );
  }

  /**
   * Analyze tap patterns for emotional signals
   */
  private analyzeTapPatterns(): { emotion: EmotionType; confidence: number } {
    if (this.tapHistory.length < 3) {
      return { emotion: 'unknown', confidence: 0 };
    }

    const recentTaps = this.tapHistory.slice(-10);
    const totalTaps = recentTaps.reduce((sum, t) => sum + t.tapCount, 0);
    const timeSpan =
      recentTaps[recentTaps.length - 1].timestamp - recentTaps[0].timestamp;

    if (timeSpan === 0) {
      return { emotion: 'unknown', confidence: 0 };
    }

    const tapRate = totalTaps / (timeSpan / 1000); // taps per second

    // Rapid tapping indicates frustration/anxiety
    if (tapRate > 2.0) {
      return { emotion: 'frustrated', confidence: 0.7 };
    } else if (tapRate > 1.0) {
      return { emotion: 'anxious', confidence: 0.5 };
    } else if (tapRate < 0.2) {
      // Very slow tapping might indicate sadness
      return { emotion: 'sad', confidence: 0.4 };
    }

    return { emotion: 'calm', confidence: 0.3 };
  }

  /**
   * Analyze selected phrases for emotional content
   */
  private analyzePhraseSentiment(): { emotion: EmotionType; confidence: number } {
    if (this.phraseHistory.length === 0) {
      return { emotion: 'unknown', confidence: 0 };
    }

    const recentPhrases = this.phraseHistory.slice(-5);
    const emotionMatches: Record<EmotionType, number> = {} as Record<EmotionType, number>;

    // Initialize counts
    for (const emotion of Object.keys(PHRASE_SENTIMENT_MAP) as EmotionType[]) {
      emotionMatches[emotion] = 0;
    }

    // Count keyword matches
    for (const { phrase } of recentPhrases) {
      for (const [emotion, keywords] of Object.entries(PHRASE_SENTIMENT_MAP)) {
        for (const keyword of keywords) {
          if (phrase.includes(keyword)) {
            emotionMatches[emotion as EmotionType]++;
          }
        }
      }
    }

    // Find emotion with highest match count
    let maxEmotion: EmotionType = 'unknown';
    let maxCount = 0;

    for (const [emotion, count] of Object.entries(emotionMatches)) {
      if (count > maxCount) {
        maxCount = count;
        maxEmotion = emotion as EmotionType;
      }
    }

    if (maxCount === 0) {
      return { emotion: 'unknown', confidence: 0 };
    }

    return {
      emotion: maxEmotion,
      confidence: Math.min(maxCount / 5, 1.0),
    };
  }

  /**
   * Calculate emotion intensity based on confidence
   */
  private calculateIntensity(confidence: number): EmotionIntensity {
    if (confidence >= 0.85) return 'critical';
    if (confidence >= 0.65) return 'high';
    if (confidence >= 0.4) return 'medium';
    return 'low';
  }

  /**
   * Detect current emotion using all available signals
   */
  detectEmotion(): EmotionState {
    const emotionScores: Record<EmotionType, number> = {} as Record<EmotionType, number>;
    const signalsUsed: string[] = [];

    // Initialize scores
    for (const emotion of Object.keys(EMOTIONS) as EmotionType[]) {
      emotionScores[emotion] = 0;
    }

    // 1. Explicit emotion (highest weight)
    if (this.explicitEmotion) {
      emotionScores[this.explicitEmotion] += 0.8;
      signalsUsed.push('explicit_button');
    }

    // 2. Tap pattern analysis
    const tapResult = this.analyzeTapPatterns();
    if (tapResult.emotion !== 'unknown') {
      emotionScores[tapResult.emotion] += tapResult.confidence * 0.5;
      signalsUsed.push('tap_pattern');
    }

    // 3. Phrase sentiment analysis
    const phraseResult = this.analyzePhraseSentiment();
    if (phraseResult.emotion !== 'unknown') {
      emotionScores[phraseResult.emotion] += phraseResult.confidence * 0.4;
      signalsUsed.push('phrase_sentiment');
    }

    // Default to calm if no signals
    if (signalsUsed.length === 0) {
      return {
        emotion: 'calm',
        intensity: 'low',
        confidence: 0.5,
        timestamp: Date.now(),
      };
    }

    // Find emotion with highest score
    let detectedEmotion: EmotionType = 'calm';
    let maxScore = 0;

    for (const [emotion, score] of Object.entries(emotionScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedEmotion = emotion as EmotionType;
      }
    }

    const confidence = Math.min(maxScore, 1.0);
    const intensity = this.calculateIntensity(confidence);

    return {
      emotion: detectedEmotion,
      intensity,
      confidence,
      timestamp: Date.now(),
    };
  }

  /**
   * Get coping phrases for the current or specified emotion
   */
  getCopingPhrases(emotion?: EmotionType, language: SupportedLanguage = 'en'): string[] {
    const targetEmotion = emotion || this.detectEmotion().emotion;
    return getCopingPhrasesForLanguage(language, targetEmotion);
  }

  /**
   * Check if caregiver should be alerted
   */
  shouldAlertCaregiver(emotion: EmotionState): boolean {
    return (
      ALERT_EMOTIONS.includes(emotion.emotion) &&
      (emotion.intensity === 'high' || emotion.intensity === 'critical')
    );
  }

  /**
   * Get recommended actions for caregiver
   */
  getRecommendedActions(emotion: EmotionType, intensity: EmotionIntensity): string[] {
    const actions: string[] = [];

    switch (emotion) {
      case 'frustrated':
        actions.push('Offer a break', 'Simplify the current task', 'Provide encouragement');
        break;
      case 'anxious':
        actions.push('Provide reassurance', 'Create calm environment', 'Stay close');
        break;
      case 'sad':
        actions.push('Offer comfort', 'Engage in favorite activity', 'Give attention');
        break;
      case 'scared':
        actions.push('Immediate comfort', 'Remove source of fear', 'Reassure safety');
        break;
    }

    if (intensity === 'critical') {
      actions.unshift('IMMEDIATE ATTENTION NEEDED');
    }

    return actions;
  }

  /**
   * Clear all history
   */
  clearHistory(): void {
    this.tapHistory = [];
    this.phraseHistory = [];
    this.explicitEmotion = null;
  }
}

export const EmotionService = new EmotionServiceClass();
export default EmotionService;
