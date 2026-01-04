/**
 * SpeakEasy - Prediction Service
 * AI-powered phrase prediction with Progressive Enhancement
 * 1. Instant rule-based results
 * 2. Optional LLM enhancement in background
 */

import { Phrase, UserContext, PredictionResult, EmotionType, SupportedLanguage } from '../types';
import {
  FALLBACK_PHRASES,
  EMOTION_PHRASES,
  EMERGENCY_PHRASES,
  QUICK_RESPONSES,
} from '../constants';
import { ContextService } from './ContextService';
import { StorageService } from './StorageService';
import { createHash } from '../utils/hash';
import {
  getQuickResponsesForLanguage,
  getEmergencyPhrasesForLanguage,
  getLocationPhrasesForLanguage,
  getCopingPhrasesForLanguage,
  getWeatherPhrasesForLanguage,
} from '../i18n/phrases';

interface LLMInterface {
  isReady: boolean;
  generate: (prompt: string) => Promise<string>;
}

class PredictionServiceClass {
  private cache: Map<string, { result: PredictionResult; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000;
  private llm: LLMInterface | null = null;

  initialize(llm?: LLMInterface): void {
    this.llm = llm || null;
    console.log(`PredictionService initialized. LLM available: ${!!this.llm}`);
  }

  isLLMAvailable(): boolean {
    return this.llm?.isReady ?? false;
  }

  /**
   * Main prediction - returns rule-based instantly
   */
  predict(context: UserContext, numPredictions: number = 6): PredictionResult {
    const startTime = Date.now();

    // Check cache first
    const cacheKey = this.buildCacheKey(context);
    const cached = this.getCached(cacheKey);
    if (cached) {
      return {
        ...cached,
        cached: true,
        latencyMs: Date.now() - startTime,
      };
    }

    // Return rule-based immediately (fast, ~0ms)
    const result = this.predictWithRules(context, numPredictions);

    // Cache the rule-based result
    this.setCache(cacheKey, result);

    return {
      ...result,
      latencyMs: Date.now() - startTime,
    };
  }

  /**
   * Async LLM enhancement - call after predict() for AI-powered results
   */
  async enhanceWithLLM(context: UserContext, numPredictions: number = 6): Promise<PredictionResult | null> {
    if (!this.isLLMAvailable()) return null;

    try {
      const startTime = Date.now();
      const result = await this.predictWithLLM(context, numPredictions);
      
      if (result.phrases.length < numPredictions) {
        const ruleResult = this.predictWithRules(context, numPredictions);
        const existingTexts = new Set(result.phrases.map(p => p.text.toLowerCase()));
        
        for (const phrase of ruleResult.phrases) {
          if (result.phrases.length >= numPredictions) break;
          if (!existingTexts.has(phrase.text.toLowerCase())) {
            result.phrases.push(phrase);
            result.confidence.push(0.7);
          }
        }
      }
      
      const cacheKey = this.buildCacheKey(context);
      this.setCache(cacheKey, result);
      
      return {
        ...result,
        latencyMs: Date.now() - startTime,
      };
    } catch (error) {
      console.log('[Prediction] LLM enhancement failed');
      return null;
    }
  }

  /**
   * Rule-based prediction (always available offline, instant)
   */
  predictWithRules(context: UserContext, numPredictions: number = 6): PredictionResult {
    const phrases: Phrase[] = [];
    const confidence: number[] = [];
    const language = context.language || 'en';

    if (context.weather) {
      const weatherPhrases = getWeatherPhrasesForLanguage(language, {
        condition: context.weather.condition,
        isRaining: context.weather.isRaining,
        isSnowing: context.weather.isSnowing,
        temperature: context.weather.temperature,
        windSpeed: context.weather.windSpeed,
      });
      
      const weatherPhraseObjects: Phrase[] = weatherPhrases.slice(0, 2).map((text, index) => ({
        id: `weather_${context.weather!.condition}_${Date.now()}_${index}`,
        text,
        category: 'need' as const,
        emoji: this.getWeatherEmoji(context.weather!),
      }));
      
      for (const phrase of weatherPhraseObjects) {
        phrases.push(phrase);
        confidence.push(0.95);
      }
    }

    const allPhrases = getLocationPhrasesForLanguage(
      language, 
      context.locationType, 
      context.timeOfDay,
      context.season,
      context.dayOfWeek
    );
    
    const shuffled = this.shuffleAndPrioritize(allPhrases, context);
    
    const timePhraseObjects: Phrase[] = shuffled.map((text, index) => ({
      id: `${context.locationType}_${context.timeOfDay}_${context.season}_${context.dayOfWeek}_${Date.now()}_${index}`,
      text,
      category: 'need' as const,
      emoji: this.getContextualEmoji(context, index),
    }));

    for (const phrase of timePhraseObjects) {
      if (phrases.length < numPredictions) {
        phrases.push(phrase);
        confidence.push(0.8);
      }
    }

    if (context.emotionState) {
      const emotionPhraseTexts = getCopingPhrasesForLanguage(language, context.emotionState).slice(0, 2);
      const emotionPhrases: Phrase[] = emotionPhraseTexts.map((text, index) => ({
        id: `${context.locationType}_emotion_${context.emotionState}_${Date.now()}_${index}`,
        text,
        category: 'feeling' as const,
        emoji: this.getEmojiForEmotion(context.emotionState!),
      }));
      
      for (const phrase of emotionPhrases) {
        if (phrases.length < numPredictions) {
          phrases.unshift(phrase);
          confidence.unshift(0.9);
        }
      }
    }

    const finalPhrases = phrases.slice(0, numPredictions);
    const finalConfidence = confidence.slice(0, numPredictions);

    const weatherInfo = context.weather ? `/${context.weather.condition}/${context.weather.temperature}°C` : '';
    return {
      phrases: finalPhrases,
      confidence: finalConfidence,
      reasoning: `Rule-based: ${context.locationType}/${context.timeOfDay}/${context.season}/${context.dayOfWeek}${weatherInfo}`,
      cached: false,
      latencyMs: 0,
      source: 'rules',
    };
  }

  private shuffleAndPrioritize(phrases: string[], context: UserContext): string[] {
    const scored = phrases.map((phrase, originalIndex) => {
      let score = 100 - originalIndex;
      
      const lowerPhrase = phrase.toLowerCase();
      if (context.season === 'summer' && (lowerPhrase.includes('hot') || lowerPhrase.includes('cold') || lowerPhrase.includes('ice'))) score += 20;
      if (context.season === 'winter' && (lowerPhrase.includes('cold') || lowerPhrase.includes('warm') || lowerPhrase.includes('snow'))) score += 20;
      if (context.dayOfWeek === 'weekend' && (lowerPhrase.includes('play') || lowerPhrase.includes('fun') || lowerPhrase.includes('park'))) score += 15;
      if (context.dayOfWeek === 'weekday' && (lowerPhrase.includes('school') || lowerPhrase.includes('work') || lowerPhrase.includes('homework'))) score += 15;
      
      score += Math.random() * 10;
      
      return { phrase, score };
    });
    
    return scored.sort((a, b) => b.score - a.score).map(item => item.phrase);
  }

  private getContextualEmoji(context: UserContext, index: number): string {
    const seasonEmojis: Record<string, string[]> = {
      spring: ['🌸', '🌷', '🌱', '🦋', '☀️', '🌈'],
      summer: ['☀️', '🏖️', '🍦', '🌴', '💦', '🌻'],
      fall: ['🍂', '🍁', '🎃', '🌰', '🍎', '🌙'],
      winter: ['❄️', '⛄', '🧣', '☕', '🔥', '🌨️'],
    };
    
    const timeEmojis: Record<string, string[]> = {
      morning: ['🌅', '🍳', '☀️', '🥣', '💧', '🌤️'],
      afternoon: ['🌞', '🎮', '📚', '🍪', '💧', '🏃'],
      evening: ['🌆', '🍽️', '📺', '🌙', '🍰', '🏠'],
      night: ['🌙', '😴', '⭐', '🛏️', '💤', '🌃'],
    };
    
    if (index < 3 && seasonEmojis[context.season]) {
      return seasonEmojis[context.season][index % seasonEmojis[context.season].length];
    }
    
    return timeEmojis[context.timeOfDay]?.[index % 6] || '💬';
  }

  private getEmojiForTimeOfDay(timeOfDay: string, index: number): string {
    const emojiMap: Record<string, string[]> = {
      morning: ['🌅', '🍳', '🥣', '💧', '🚿', '☀️'],
      afternoon: ['💧', '🎮', '🆘', '😴', '🍪', '📚'],
      evening: ['🍽️', '🎮', '😐', '📺', '🍰', '🌙'],
      night: ['😴', '🌙', '💧', '😔', '🤗', '🛏️'],
      general: ['👋', '👋', '🆘', '👍', '🙏', '🏠'],
    };
    return emojiMap[timeOfDay]?.[index] || '💬';
  }

  private getWeatherEmoji(weather: { condition: string; isRaining: boolean; isSnowing: boolean; temperature: number }): string {
    if (weather.isSnowing) return '❄️';
    if (weather.isRaining) return '🌧️';
    if (weather.condition === 'storm') return '⛈️';
    if (weather.condition === 'fog') return '🌫️';
    if (weather.temperature >= 30) return '🥵';
    if (weather.temperature <= 0) return '🥶';
    if (weather.condition === 'clear') return '☀️';
    if (weather.condition === 'cloudy') return '☁️';
    return '🌤️';
  }

  private getEmojiForEmotion(emotion: string): string {
    const emojiMap: Record<string, string> = {
      happy: '😊',
      sad: '😢',
      anxious: '😰',
      frustrated: '😤',
      scared: '😨',
      calm: '😌',
      excited: '🤩',
      tired: '😴',
    };
    return emojiMap[emotion] || '💭';
  }

  /**
   * LLM-based prediction (when sLLM is available)
   */
  private async predictWithLLM(context: UserContext, numPredictions: number = 6): Promise<PredictionResult> {
    if (!this.llm) {
      throw new Error('LLM not available');
    }

    const prompt = this.buildLLMPrompt(context, numPredictions);
    const response = await this.llm.generate(prompt);

    try {
      const parsed = this.parseLLMResponse(response, numPredictions);
      return {
        phrases: parsed.phrases,
        confidence: parsed.confidence,
        reasoning: 'AI-powered prediction',
        cached: false,
        latencyMs: 0,
        source: 'llm',
      };
    } catch {
      throw new Error('Failed to parse LLM response');
    }
  }

  private buildLLMPrompt(context: UserContext, numPredictions: number): string {
    const timeBasedExamples: Record<string, Record<string, string[]>> = {
      home: {
        morning: ['I want breakfast', 'I am hungry', 'Can I have cereal?', 'I need bathroom', 'Good morning', 'I am thirsty', 'Can I watch cartoons?', 'Where is mom?'],
        afternoon: ['I am thirsty', 'Can I have a snack?', 'I want to play', 'Can I watch TV?', 'I am bored', 'I need help', 'Can we go outside?', 'I am hungry'],
        evening: ['What is for dinner?', 'I am hungry', 'Can I help cook?', 'I want to play', 'Can we read a story?', 'I am thirsty', 'I want dessert', 'I am tired'],
        night: ['I am sleepy', 'Good night', 'I need water', 'I cannot sleep', 'Stay with me please', 'I had a bad dream', 'Can you read to me?', 'I need bathroom'],
      },
      school: {
        morning: ['Good morning teacher', 'I need help', 'Can I go to bathroom?', 'I do not understand', 'I have a question', 'I am ready to learn', 'I forgot my homework', 'Can I sit here?'],
        afternoon: ['I am hungry', 'When is lunch?', 'Can I have a break?', 'I finished my work', 'I need help with this', 'Can I get water?', 'I am tired', 'I need more time'],
        evening: ['Is school over?', 'I am tired', 'When can I go home?', 'Thank you teacher', 'See you tomorrow', 'I had fun today', 'Where is my backpack?', 'Goodbye'],
        night: ['Good night', 'See you tomorrow', 'Thank you for teaching me', 'I learned a lot today', 'I am going home now', 'Goodbye', 'Have a nice evening', 'Take care'],
      },
      hospital: {
        morning: ['Good morning doctor', 'I feel sick', 'It hurts here', 'I need medicine', 'I am scared', 'Can I see my family?', 'When is breakfast?', 'I need bathroom'],
        afternoon: ['I need my medicine', 'Am I getting better?', 'Can I go home soon?', 'I am thirsty', 'It still hurts', 'I need to rest', 'When is the doctor coming?', 'I am bored'],
        evening: ['When can I leave?', 'I want to see my family', 'I am tired', 'It hurts', 'I need help', 'What is for dinner?', 'Can I watch TV?', 'I miss home'],
        night: ['I cannot sleep', 'I need help', 'I am in pain', 'I want my mom', 'I am scared', 'Can someone stay with me?', 'I need water', 'I had a bad dream'],
      },
      restaurant: {
        morning: ['I am hungry', 'Can I see the menu?', 'I want pancakes', 'Orange juice please', 'This looks good', 'Can I have more?', 'Where is the bathroom?', 'Thank you'],
        afternoon: ['I am hungry', 'I want this one', 'More water please', 'This is delicious', 'I am full', 'Can I have dessert?', 'I need napkins', 'Check please'],
        evening: ['I am hungry', 'What do you recommend?', 'Can I have dessert?', 'This is yummy', 'Thank you for dinner', 'I am full', 'Can we go home now?', 'That was great'],
        night: ['I am tired', 'Can we go home?', 'Thank you', 'I am full', 'That was nice', 'I am sleepy', 'I had a good time', 'Goodbye'],
      },
      outdoor: {
        morning: ['It is nice outside', 'I want to play', 'Let us go explore', 'I need sunscreen', 'Can we go to the park?', 'Look at that', 'I am excited', 'Can I run around?'],
        afternoon: ['I am tired', 'I am hungry', 'I am thirsty', 'Can we rest in the shade?', 'It is too hot', 'I need water', 'Can we go home soon?', 'I want ice cream'],
        evening: ['It is getting dark', 'Can we go home?', 'I am cold', 'I am tired', 'That was fun', 'I want to come back', 'Look at the sunset', 'I am hungry'],
        night: ['Look at the stars', 'I am cold', 'Can we go inside?', 'I am tired', 'It is dark', 'I want to go home', 'Hold my hand', 'I am sleepy'],
      },
      unknown: {
        morning: ['Good morning', 'Hello', 'I need help', 'I am okay', 'Thank you', 'Where am I?', 'Can you help me?', 'I am looking for someone'],
        afternoon: ['Hello', 'I need help', 'I am okay', 'Thank you', 'I am lost', 'Can you help me?', 'Where is this place?', 'I need directions'],
        evening: ['Hello', 'Good evening', 'I need help', 'I am okay', 'Thank you', 'I want to go home', 'Can you call someone for me?', 'I am tired'],
        night: ['Hello', 'I need help', 'I am okay', 'Thank you', 'I want to go home', 'I am scared', 'It is dark', 'Please help me'],
      },
    };
    
    const locationExamples = timeBasedExamples[context.locationType] || timeBasedExamples.unknown;
    const examples = locationExamples[context.timeOfDay] || locationExamples.morning;
    const categories = ['need', 'want', 'need', 'feeling', 'need', 'want', 'need', 'social'];
    
    return `Generate exactly ${numPredictions} short phrases for a non-verbal person at ${context.locationType} during ${context.timeOfDay}. Emotion: ${context.emotionState || 'neutral'}.
Return JSON: {"phrases":["phrase1","phrase2",...],"categories":["need","want",...]}
Example: ${JSON.stringify({ phrases: examples, categories: categories })}`;
  }

  private parseLLMResponse(response: string, numPredictions: number): { phrases: Phrase[]; confidence: number[] } {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    const data = JSON.parse(jsonMatch[0]);
    const phrases: Phrase[] = (data.phrases || []).slice(0, numPredictions).map((text: string, index: number) => ({
      id: `llm_${createHash(text)}_${Date.now()}_${index}`,
      text,
      category: data.categories?.[index] || 'need',
      emoji: this.getEmojiForCategory(data.categories?.[index]),
    }));

    const confidence = (data.confidence || []).slice(0, numPredictions);
    while (confidence.length < phrases.length) {
      confidence.push(0.8);
    }

    return { phrases, confidence };
  }

  private getEmojiForCategory(category: string): string {
    const emojiMap: Record<string, string> = {
      need: '🆘',
      want: '💭',
      feeling: '💗',
      question: '❓',
      greeting: '👋',
      response: '✅',
      social: '🙂',
      emergency: '🚨',
    };
    return emojiMap[category] || '💬';
  }

  getEmergencyPhrases(language: SupportedLanguage = 'en'): Phrase[] {
    const translatedPhrases = getEmergencyPhrasesForLanguage(language);
    return translatedPhrases.map((text, index) => ({
      id: `emergency_${index}`,
      text,
      category: 'emergency' as const,
      emoji: '🚨',
    }));
  }

  getQuickResponses(language: SupportedLanguage = 'en'): Phrase[] {
    const translatedPhrases = getQuickResponsesForLanguage(language);
    const emojis = ['✅', '❌', '🤔', '❓', '🙏', '💖', '😔', '😊'];
    return translatedPhrases.map((text, index) => ({
      id: `quick_${index}`,
      text,
      category: 'response' as const,
      emoji: emojis[index] || '💬',
    }));
  }

  getEmotionPhrases(emotion: EmotionType): Phrase[] {
    return EMOTION_PHRASES[emotion] || [];
  }

  private buildCacheKey(context: UserContext): string {
    const weatherKey = context.weather ? `${context.weather.condition}:${context.weather.temperature}` : 'noweather';
    return `${context.timeOfDay}:${context.season}:${context.dayOfWeek}:${context.locationType}:${context.emotionState || 'none'}:${context.language || 'en'}:${weatherKey}`;
  }

  private getCached(key: string): PredictionResult | null {
    const entry = this.cache.get(key);
    if (entry && Date.now() - entry.timestamp < this.CACHE_TTL) {
      return entry.result;
    }
    return null;
  }

  private setCache(key: string, result: PredictionResult): void {
    this.cache.set(key, { result, timestamp: Date.now() });

    if (this.cache.size > 50) {
      const oldest = [...this.cache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
      this.cache.delete(oldest[0][0]);
    }
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const PredictionService = new PredictionServiceClass();
export default PredictionService;
