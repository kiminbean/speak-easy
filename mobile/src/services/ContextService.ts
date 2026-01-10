import * as Location from 'expo-location';
import { TimeOfDay, LocationType, UserContext, SavedLocation, GPSCoordinates, LocationDetectionResult, Season, DayOfWeek } from '../types';
import { StorageService } from './StorageService';
import { DEFAULT_LOCATION_RADIUS } from '../constants';

class ContextServiceClass {
  private currentLocation: LocationType = 'unknown';
  private locationPermissionGranted = false;
  private lastGPSCoordinates: GPSCoordinates | null = null;

  getTimeOfDay(): TimeOfDay {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'evening';
    } else {
      return 'night';
    }
  }

  getSeason(): Season {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  getDayOfWeek(): DayOfWeek {
    const day = new Date().getDay();
    return (day === 0 || day === 6) ? 'weekend' : 'weekday';
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.locationPermissionGranted = status === 'granted';
      return this.locationPermissionGranted;
    } catch (error) {
      if (__DEV__) console.error('Location permission error:', error);
      return false;
    }
  }

  async checkLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      this.locationPermissionGranted = status === 'granted';
      return this.locationPermissionGranted;
    } catch (error) {
      if (__DEV__) console.error('Location permission check error:', error);
      return false;
    }
  }

  getLocationType(): LocationType {
    return this.currentLocation;
  }

  setLocationType(location: LocationType): void {
    this.currentLocation = location;
  }

  getLastGPSCoordinates(): GPSCoordinates | null {
    return this.lastGPSCoordinates;
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  async getCurrentGPSCoordinates(): Promise<GPSCoordinates | null> {
    if (!this.locationPermissionGranted) {
      const granted = await this.requestLocationPermission();
      if (!granted) return null;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      this.lastGPSCoordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      return this.lastGPSCoordinates;
    } catch (error) {
      if (__DEV__) console.error('GPS fetch error:', error);
      return null;
    }
  }

  async detectLocationFromGPS(): Promise<LocationDetectionResult> {
    const coords = await this.getCurrentGPSCoordinates();

    if (!coords) {
      return {
        detected: false,
        locationType: 'unknown',
      };
    }

    const savedLocations = await StorageService.getSavedLocations();

    if (savedLocations.length === 0) {
      return {
        detected: false,
        locationType: 'unknown',
      };
    }

    let closestLocation: SavedLocation | null = null;
    let closestDistance = Infinity;

    for (const savedLoc of savedLocations) {
      const distance = this.calculateDistance(
        coords.latitude,
        coords.longitude,
        savedLoc.latitude,
        savedLoc.longitude
      );

      if (distance <= savedLoc.radius && distance < closestDistance) {
        closestDistance = distance;
        closestLocation = savedLoc;
      }
    }

    if (closestLocation) {
      this.currentLocation = closestLocation.type;
      return {
        detected: true,
        locationType: closestLocation.type,
        savedLocation: closestLocation,
        distance: closestDistance,
      };
    }

    return {
      detected: false,
      locationType: 'unknown',
    };
  }

  async saveCurrentLocationAs(
    type: LocationType,
    name: string,
    radius: number = DEFAULT_LOCATION_RADIUS
  ): Promise<SavedLocation | null> {
    const coords = await this.getCurrentGPSCoordinates();

    if (!coords) {
      if (__DEV__) console.error('Cannot save location: GPS not available');
      return null;
    }

    return StorageService.saveLocation(
      type,
      name,
      coords.latitude,
      coords.longitude,
      radius
    );
  }

  async buildContext(userId: string, recentPhrases: string[] = []): Promise<UserContext> {
    return {
      userId,
      timeOfDay: this.getTimeOfDay(),
      season: this.getSeason(),
      dayOfWeek: this.getDayOfWeek(),
      locationType: this.getLocationType(),
      recentPhrases: recentPhrases.slice(-10),
    };
  }

  getGreeting(): string {
    const timeOfDay = this.getTimeOfDay();
    const greetings: Record<TimeOfDay, string> = {
      morning: 'Good morning!',
      afternoon: 'Good afternoon!',
      evening: 'Good evening!',
      night: 'Good night!',
    };
    return greetings[timeOfDay];
  }

  isMealTime(): { isMealTime: boolean; meal: string | null } {
    const hour = new Date().getHours();

    if (hour >= 7 && hour <= 9) {
      return { isMealTime: true, meal: 'breakfast' };
    } else if (hour >= 12 && hour <= 14) {
      return { isMealTime: true, meal: 'lunch' };
    } else if (hour >= 18 && hour <= 20) {
      return { isMealTime: true, meal: 'dinner' };
    }

    return { isMealTime: false, meal: null };
  }

  isBedtime(): boolean {
    const hour = new Date().getHours();
    return hour >= 20 || hour <= 6;
  }
}

export const ContextService = new ContextServiceClass();
export default ContextService;
