import AsyncStorage from '@react-native-async-storage/async-storage';
import { WeatherData, WeatherCondition, Season, GPSCoordinates } from '../types';

const WEATHER_CACHE_KEY = 'speakeasy_weather_cache';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000;
const API_TIMEOUT_MS = 10000;

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    rain: number;
    snowfall: number;
    weather_code: number;
    wind_speed_10m: number;
    relative_humidity_2m: number;
  };
}

class WeatherServiceClass {
  private cachedWeather: WeatherData | null = null;
  private lastFetchTime: number = 0;

  async getWeather(coords: GPSCoordinates | null, season: Season): Promise<WeatherData> {
    if (!coords) {
      return this.getFallbackWeather(season);
    }

    const cached = await this.getCachedWeather();
    if (cached && this.isCacheValid(cached)) {
      this.cachedWeather = cached;
      return cached;
    }

    try {
      const weather = await this.fetchFromAPI(coords);
      await this.cacheWeather(weather);
      this.cachedWeather = weather;
      return weather;
    } catch {
      if (__DEV__) console.warn('[Weather] API failed, using fallback');
      if (cached) {
        return { ...cached, source: 'cache' };
      }
      return this.getFallbackWeather(season);
    }
  }

  private async fetchFromAPI(coords: GPSCoordinates): Promise<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m,apparent_temperature,rain,snowfall,weather_code,wind_speed_10m,relative_humidity_2m&timezone=auto`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: OpenMeteoResponse = await response.json();
      return this.parseAPIResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private parseAPIResponse(data: OpenMeteoResponse): WeatherData {
    const current = data.current;
    const condition = this.weatherCodeToCondition(current.weather_code);

    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition,
      isRaining: current.rain > 0,
      isSnowing: current.snowfall > 0,
      windSpeed: Math.round(current.wind_speed_10m),
      humidity: current.relative_humidity_2m,
      timestamp: Date.now(),
      source: 'api',
    };
  }

  private weatherCodeToCondition(code: number): WeatherCondition {
    if (code === 0) return 'clear';
    if (code >= 1 && code <= 3) return 'cloudy';
    if (code >= 45 && code <= 48) return 'fog';
    if (code >= 51 && code <= 67) return 'rain';
    if (code >= 71 && code <= 77) return 'snow';
    if (code >= 80 && code <= 82) return 'rain';
    if (code >= 85 && code <= 86) return 'snow';
    if (code >= 95 && code <= 99) return 'storm';
    return 'unknown';
  }

  private getFallbackWeather(season: Season): WeatherData {
    const seasonDefaults: Record<Season, { temperature: number; feelsLike: number; condition: WeatherCondition; humidity: number }> = {
      spring: { temperature: 15, feelsLike: 14, condition: 'cloudy', humidity: 60 },
      summer: { temperature: 28, feelsLike: 30, condition: 'clear', humidity: 70 },
      fall: { temperature: 12, feelsLike: 10, condition: 'cloudy', humidity: 55 },
      winter: { temperature: 2, feelsLike: -2, condition: 'cloudy', humidity: 50 },
    };

    const defaults = seasonDefaults[season];
    return {
      temperature: defaults.temperature,
      feelsLike: defaults.feelsLike,
      condition: defaults.condition,
      isRaining: false,
      isSnowing: season === 'winter',
      windSpeed: 10,
      humidity: defaults.humidity,
      timestamp: Date.now(),
      source: 'fallback',
    };
  }

  private async getCachedWeather(): Promise<WeatherData | null> {
    try {
      const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      if (__DEV__) console.warn('[Weather] Cache read error');
    }
    return null;
  }

  private async cacheWeather(weather: WeatherData): Promise<void> {
    try {
      await AsyncStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(weather));
    } catch {
      if (__DEV__) console.warn('[Weather] Cache write error');
    }
  }

  private isCacheValid(weather: WeatherData): boolean {
    return Date.now() - weather.timestamp < CACHE_DURATION_MS;
  }

  getCachedWeatherSync(): WeatherData | null {
    return this.cachedWeather;
  }

  getTemperatureCategory(temp: number): 'freezing' | 'cold' | 'cool' | 'mild' | 'warm' | 'hot' | 'scorching' {
    if (temp <= -5) return 'freezing';
    if (temp <= 5) return 'cold';
    if (temp <= 12) return 'cool';
    if (temp <= 20) return 'mild';
    if (temp <= 28) return 'warm';
    if (temp <= 35) return 'hot';
    return 'scorching';
  }

  getWindCategory(speed: number): 'calm' | 'light' | 'moderate' | 'strong' | 'dangerous' {
    if (speed < 5) return 'calm';
    if (speed < 15) return 'light';
    if (speed < 30) return 'moderate';
    if (speed < 50) return 'strong';
    return 'dangerous';
  }
}

export const WeatherService = new WeatherServiceClass();
export default WeatherService;
