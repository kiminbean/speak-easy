import { UserContext, Phrase, PhraseCategory, SupportedLanguage } from '../types';
import { createHash } from '../utils/hash';
import { getLocationPhrasesForLanguage } from '../i18n/phrases';
import { useSettingsStore } from '../stores/settingsStore';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface LLMGenerationConfig {
  temperature?: number;
  topp?: number;
}

interface LLMModuleConfig {
  generationConfig: LLMGenerationConfig;
}

interface LLMModuleInstance {
  load: (model: string, onProgress: (progress: number) => void) => Promise<void>;
  generate: (messages: Message[]) => Promise<string>;
  configure: (config: LLMModuleConfig) => void;
  delete: () => void;
  getGeneratedTokenCount?: () => number;
}

interface LLMModuleConstructor {
  new (config: { tokenCallback: (token: string) => void }): LLMModuleInstance;
}

let LLMModuleClass: LLMModuleConstructor | null = null;
let SMOLLM2_360M_QUANTIZED: string | null = null;

try {
  const executorch = require('react-native-executorch');
  if (__DEV__) console.log('[LLM] react-native-executorch loaded');
  LLMModuleClass = executorch.LLMModule;
  SMOLLM2_360M_QUANTIZED = executorch.SMOLLM2_1_360M_QUANTIZED;
  if (__DEV__) console.log('[LLM] SmolLM2-360M-Quantized:', SMOLLM2_360M_QUANTIZED ? 'Found' : 'Not found');
} catch {
  if (__DEV__) console.log('[LLM] react-native-executorch not available (Expo Go mode)');
}

export interface LLMConfig {
  modelName: string;
  maxTokens: number;
  temperature: number;
}

export interface LLMResponse {
  text: string;
  tokensPerSecond?: number;
  totalTimeMs?: number;
}

const DEFAULT_CONFIG: LLMConfig = {
  modelName: 'SmolLM2-360M-Quantized',
  maxTokens: 128,
  temperature: 0.5,
};

const LOCATION_EXAMPLES: Record<string, string> = {
  home: '{"phrases":["I want breakfast","Can I watch TV?","I need bathroom"]}',
  school: '{"phrases":["I need help","Can I go to bathroom?","I finished"]}',
  hospital: '{"phrases":["It hurts here","I need medicine","When can I leave?"]}',
  restaurant: '{"phrases":["I want this","More water please","Check please"]}',
  outdoor: '{"phrases":["I am thirsty","Can we go home?","I am tired"]}',
  unknown: '{"phrases":["I need help","Thank you","I want to go home"]}',
};

const SYSTEM_PROMPT = `Output JSON only: {"phrases":["p1","p2","p3"]}`;

class LLMServiceClass {
  private config: LLMConfig = DEFAULT_CONFIG;
  private isInitialized = false;
  private isModelLoaded = false;
  private downloadProgress = 0;
  private llmModule: LLMModuleInstance | null = null;
  private useNativeModule = false;
  private currentResponse = '';
  private onProgressCallback?: (progress: number) => void;
  private onReadyCallback?: () => void;

  get isReady(): boolean {
    return this.isModelLoaded;
  }

  get progress(): number {
    return this.downloadProgress;
  }

  get isNativeMode(): boolean {
    return this.useNativeModule;
  }

  async initialize(config?: Partial<LLMConfig>): Promise<void> {
    if (this.isInitialized) return;

    this.config = { ...DEFAULT_CONFIG, ...config };
    this.isInitialized = true;

    if (__DEV__) console.log(`[LLM] Initializing: ${this.config.modelName}`);

    if (LLMModuleClass && SMOLLM2_360M_QUANTIZED) {
      try {
        if (__DEV__) console.log('[LLM] Loading SmolLM2-360M...');
        await this.initializeNativeModule();
        if (__DEV__) console.log('[LLM] SmolLM2-360M ready!');
        return;
      } catch (error) {
        if (__DEV__) console.warn('[LLM] Native init failed:', error);
      }
    }

    if (__DEV__) console.log('[LLM] Using rule-based fallback');
    await this.simulateModelDownload();
  }

  private async initializeNativeModule(): Promise<void> {
    if (!LLMModuleClass || !SMOLLM2_360M_QUANTIZED) {
      throw new Error('LLM module not available');
    }

    this.llmModule = new LLMModuleClass({
      tokenCallback: (token: string) => {
        this.currentResponse += token;
      },
    });

    await this.llmModule.load(
      SMOLLM2_360M_QUANTIZED,
      (progress: number) => {
        this.downloadProgress = progress;
        this.onProgressCallback?.(progress);
        if (__DEV__ && progress % 25 === 0) {
          console.log(`[LLM] Download: ${progress}%`);
        }
      }
    );

    this.llmModule.configure({
      generationConfig: {
        temperature: this.config.temperature,
        topp: 0.9,
      },
    });

    this.useNativeModule = true;
    this.isModelLoaded = true;
    this.onReadyCallback?.();
  }

  private async simulateModelDownload(): Promise<void> {
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      this.downloadProgress = i;
      this.onProgressCallback?.(i);
    }

    this.isModelLoaded = true;
    this.onReadyCallback?.();
    if (__DEV__) console.log('[LLM] Ready (rule-based mode)');
  }

  onProgress(callback: (progress: number) => void): void {
    this.onProgressCallback = callback;
  }

  onReady(callback: () => void): void {
    this.onReadyCallback = callback;
  }

  async generate(prompt: string): Promise<LLMResponse> {
    if (!this.isModelLoaded) {
      throw new Error('LLM not initialized');
    }

    const startTime = Date.now();
    let response: string;

    if (this.useNativeModule && this.llmModule) {
      try {
        this.currentResponse = '';
        
        const messages: Message[] = [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt },
        ];
        
        response = await this.llmModule.generate(messages);
        
        if (__DEV__) console.log('[LLM] Response:', response?.length || 0, 'chars');
      } catch (error) {
        if (__DEV__) console.warn('[LLM] Gen error:', error instanceof Error ? error.message : 'Unknown error');
        response = await this.generateSimulatedResponse(prompt);
      }
    } else {
      response = await this.generateSimulatedResponse(prompt);
    }

    const totalTimeMs = Date.now() - startTime;

    return {
      text: response,
      tokensPerSecond: this.useNativeModule ? 
        (this.llmModule?.getGeneratedTokenCount?.() || 0) / (totalTimeMs / 1000) : 
        20,
      totalTimeMs,
    };
  }

  async generatePredictions(context: UserContext, numPredictions: number = 6): Promise<Phrase[]> {
    const prompt = this.buildAACPrompt(context, numPredictions);
    const response = await this.generate(prompt);

    try {
      return this.parsePhrasesFromResponse(response.text, numPredictions);
    } catch {
      if (__DEV__) console.warn('[LLM] Parse failed, using fallback');
      return this.getFallbackPhrases(context, numPredictions);
    }
  }

  private buildAACPrompt(context: UserContext, numPredictions: number): string {
    const location = context.locationType || 'unknown';
    const time = context.timeOfDay || 'morning';
    const example = LOCATION_EXAMPLES[location] || LOCATION_EXAMPLES.unknown;
    
    return `${location},${time}:${numPredictions} phrases\n${example}`;
  }

  private parsePhrasesFromResponse(response: string, limit: number): Phrase[] {
    return this.tryParseJson(response, limit)
      || this.tryExtractQuotedStrings(response, limit)
      || this.tryExtractLines(response, limit)
      || this.throwParseError();
  }

  private tryParseJson(response: string, limit: number): Phrase[] | null {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    try {
      const data = JSON.parse(jsonMatch[0]);
      if (!data.phrases || !Array.isArray(data.phrases)) return null;

      return data.phrases.slice(0, limit).map((text: string, i: number) => ({
        id: `llm_${createHash(text)}_${i}`,
        text: String(text).trim(),
        category: (data.categories?.[i] as PhraseCategory) || 'need',
        emoji: this.getCategoryEmoji(data.categories?.[i]),
      }));
    } catch {
      return null;
    }
  }

  private tryExtractQuotedStrings(response: string, limit: number): Phrase[] | null {
    const quotedStrings = response.match(/"([^"]+)"/g);
    if (!quotedStrings || quotedStrings.length === 0) return null;

    const phrases = quotedStrings
      .map(s => s.replace(/"/g, '').trim())
      .filter(s => s.length > 2 && s.length < 100);

    if (phrases.length === 0) return null;

    return phrases.slice(0, limit).map((text, i) => ({
      id: `llm_${createHash(text)}_${i}`,
      text,
      category: 'need' as PhraseCategory,
      emoji: '💬',
    }));
  }

  private tryExtractLines(response: string, limit: number): Phrase[] | null {
    const lines = response
      .split(/[\n,]/)
      .map(line => line.replace(/^\d+[.)]\s*/, '').trim())
      .filter(line => line.length > 2 && line.length < 100 && !line.startsWith('{'));

    if (lines.length === 0) return null;

    return lines.slice(0, limit).map((text, i) => ({
      id: `llm_${createHash(text)}_${i}`,
      text,
      category: 'need' as PhraseCategory,
      emoji: '💬',
    }));
  }

  private throwParseError(): never {
    throw new Error('Could not extract phrases');
  }

  private getFallbackPhrases(context: UserContext, limit: number): Phrase[] {
    const phrases = this.getContextualPhrases(
      context.timeOfDay,
      context.locationType,
      context.emotionState || 'neutral'
    );

    return phrases.slice(0, limit).map((text, i) => ({
      id: `fallback_${createHash(text)}_${i}`,
      text,
      category: 'need' as PhraseCategory,
      emoji: '💬',
    }));
  }

  private getCategoryEmoji(category?: string): string {
    const emojiMap: Record<string, string> = {
      need: '🆘',
      want: '💭',
      feeling: '💗',
      question: '❓',
      greeting: '👋',
      response: '✅',
      social: '🙂',
    };
    return emojiMap[category || 'need'] || '💬';
  }

  private async generateSimulatedResponse(prompt: string): Promise<string> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    const locationMatch = prompt.match(/^(\w+),/);
    const location = locationMatch?.[1] || 'home';

    const phrases = this.getContextualPhrases('morning', location, 'neutral');

    return JSON.stringify({ phrases });
  }

  private getContextualPhrases(time: string, location: string, _emotion: string): string[] {
    const language = useSettingsStore.getState().settings.language as SupportedLanguage;
    return getLocationPhrasesForLanguage(language, location, time);
  }

  async destroy(): Promise<void> {
    if (this.llmModule) {
      try {
        this.llmModule.delete();
      } catch (e) {
        if (__DEV__) console.warn('[LLM] Destroy error:', e);
      }
      this.llmModule = null;
    }
    this.isModelLoaded = false;
    this.isInitialized = false;
    this.useNativeModule = false;
    this.downloadProgress = 0;
  }
}

export const LLMService = new LLMServiceClass();
export default LLMService;
