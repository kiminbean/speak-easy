import { create } from 'zustand';
import { Phrase, UserContext, LocationType, CustomPhrase, LocationDetectionResult, SupportedLanguage, WeatherData } from '../types';
import { PredictionService, ContextService, StorageService, WeatherService } from '../services';
import { useSettingsStore } from './settingsStore';

let pendingLocationUpdate: ReturnType<typeof setTimeout> | null = null;
let currentPredictionRequest: number = 0;

// Languages that support LLM enhancement (English-trained models)
const LLM_SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en'];

interface PredictionState {
  predictions: Phrase[];
  customPhrases: CustomPhrase[];
  emergencyPhrases: Phrase[];
  quickResponses: Phrase[];
  favorites: Phrase[];
  recentPhrases: string[];
  isLoading: boolean;
  isEnhancing: boolean;
  error: string | null;
  context: UserContext | null;
  currentLocation: LocationType;
  isLocationAutoDetected: boolean;
  isAutoDetecting: boolean;
  detectionResult: LocationDetectionResult | null;
  predictionSource: 'rules' | 'llm' | 'cache';
  currentWeather: WeatherData | null;
  isLoadingWeather: boolean;

  loadPredictions: (language?: SupportedLanguage) => Promise<void>;
  loadCustomPhrases: () => Promise<void>;
  setLocation: (location: LocationType, isAutoDetected?: boolean) => void;
  autoDetectLocation: () => Promise<LocationDetectionResult>;
  addRecentPhrase: (phrase: string) => void;
  toggleFavorite: (phrase: Phrase) => Promise<void>;
  refreshPredictions: (language?: SupportedLanguage) => Promise<void>;
  refreshWeather: () => Promise<void>;
  clearError: () => void;
}

export const usePredictionStore = create<PredictionState>((set, get) => ({
  predictions: [],
  customPhrases: [],
  emergencyPhrases: [],
  quickResponses: [],
  favorites: [],
  recentPhrases: [],
  isLoading: false,
  isEnhancing: false,
  error: null,
  context: null,
  currentLocation: 'unknown',
  isLocationAutoDetected: false,
  isAutoDetecting: false,
  detectionResult: null,
  predictionSource: 'rules',
  currentWeather: null,
  isLoadingWeather: false,

  loadPredictions: async (overrideLanguage?: SupportedLanguage) => {
    const requestId = ++currentPredictionRequest;
    set({ isLoading: true, error: null });

    try {
      const [favorites, recentPhrases, customPhrases] = await Promise.all([
        StorageService.getFavorites(),
        StorageService.getRecentPhrases(10),
        StorageService.getCustomPhrases(),
      ]);

      if (requestId !== currentPredictionRequest) return;

      const language = overrideLanguage || useSettingsStore.getState().settings.language;

      const context = await ContextService.buildContext('default_user', recentPhrases);
      context.locationType = get().currentLocation;
      context.language = language;
      
      const coords = ContextService.getLastGPSCoordinates();
      const weather = await WeatherService.getWeather(coords, context.season);
      context.weather = weather;
      set({ currentWeather: weather });

      PredictionService.clearCache();
      
      // Phase 1: Instant rule-based predictions (works for ALL languages)
      const ruleResult = PredictionService.predict(context, 8);
      
      if (requestId !== currentPredictionRequest) return;

      // Check if LLM enhancement is available for this language
      const canUseLLM = LLM_SUPPORTED_LANGUAGES.includes(language) && PredictionService.isLLMAvailable();

      set({
        predictions: ruleResult.phrases,
        customPhrases,
        favorites,
        recentPhrases,
        context,
        emergencyPhrases: PredictionService.getEmergencyPhrases(language),
        quickResponses: PredictionService.getQuickResponses(language),
        isLoading: false,
        predictionSource: 'rules',
        isEnhancing: canUseLLM,
      });

      // Phase 2: LLM enhancement ONLY for English (SmolLM2 is English-trained)
      if (canUseLLM) {
        const llmResult = await PredictionService.enhanceWithLLM(context, 8);
        
        if (requestId !== currentPredictionRequest) return;
        
        if (llmResult) {
          set({
            predictions: llmResult.phrases,
            predictionSource: 'llm',
            isEnhancing: false,
          });
        } else {
          set({ isEnhancing: false });
        }
      }
    } catch (error) {
      if (requestId !== currentPredictionRequest) return;
      
      if (__DEV__) console.error('Error loading predictions:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load predictions',
        isLoading: false,
        isEnhancing: false,
      });
    }
  },

  loadCustomPhrases: async () => {
    const customPhrases = await StorageService.getCustomPhrases();
    set({ customPhrases });
  },

  setLocation: (location: LocationType, isAutoDetected: boolean = false) => {
    ContextService.setLocationType(location);
    set({ 
      currentLocation: location,
      isLocationAutoDetected: isAutoDetected,
    });
    
    if (pendingLocationUpdate) {
      clearTimeout(pendingLocationUpdate);
    }
    
    // Debounce 50ms for rapid location changes
    pendingLocationUpdate = setTimeout(() => {
      pendingLocationUpdate = null;
      get().refreshPredictions();
    }, 50);
  },

  autoDetectLocation: async () => {
    set({ isAutoDetecting: true });

    try {
      const result = await ContextService.detectLocationFromGPS();

      set({
        detectionResult: result,
        isAutoDetecting: false,
      });

      if (result.detected) {
        set({
          currentLocation: result.locationType,
          isLocationAutoDetected: true,
        });
        get().refreshPredictions();
      } else {
        set({ isLocationAutoDetected: false });
      }

      return result;
    } catch (error) {
      if (__DEV__) console.error('Error auto-detecting location:', error);
      set({
        isAutoDetecting: false,
        isLocationAutoDetected: false,
        detectionResult: {
          detected: false,
          locationType: 'unknown',
        },
      });
      return { detected: false, locationType: 'unknown' as LocationType };
    }
  },

  addRecentPhrase: async (phrase: string) => {
    const recentPhrases = [...get().recentPhrases, phrase].slice(-20);
    set({ recentPhrases });
    await StorageService.addPhraseToHistory(phrase);
  },

  toggleFavorite: async (phrase: Phrase) => {
    await StorageService.toggleFavorite(phrase);
    const favorites = await StorageService.getFavorites();
    set({ favorites });
  },

  refreshPredictions: async (language?: SupportedLanguage) => {
    await get().loadPredictions(language);
  },

  refreshWeather: async () => {
    set({ isLoadingWeather: true });
    try {
      const coords = ContextService.getLastGPSCoordinates();
      const context = get().context;
      const season = context?.season || ContextService.getSeason();
      const weather = await WeatherService.getWeather(coords, season);
      set({ currentWeather: weather, isLoadingWeather: false });
      
      if (weather.source === 'api') {
        get().refreshPredictions();
      }
    } catch (error) {
      if (__DEV__) console.error('Error refreshing weather:', error);
      set({ isLoadingWeather: false });
    }
  },

  clearError: () => set({ error: null }),
}));
