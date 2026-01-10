import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter, useFocusEffect } from 'expo-router';
import {
  PhraseGrid,
  EmotionSelector,
  EmergencyButton,
} from '../components';
import {
  usePredictionStore,
  useEmotionStore,
  useSettingsStore,
} from '../stores';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, TOUCH_TARGET } from '../constants';
import { ContextService, LLMService } from '../services';
import { LocationType, Phrase } from '../types';
import { getTranslations } from '../i18n';
import { isRTLLanguage, getWritingDirection } from '../utils/rtl';
import { WeatherCondition } from '../types';

const LOCATION_EMOJIS: Record<LocationType, string> = {
  home: '🏠',
  school: '🏫',
  hospital: '🏥',
  outdoor: '🌳',
  restaurant: '🍽️',
  unknown: '📍',
};

const WEATHER_EMOJIS: Record<WeatherCondition, string> = {
  clear: '☀️',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
  fog: '🌫️',
  unknown: '🌡️',
};

export default function HomeScreen() {
  const router = useRouter();
  const {
    predictions,
    customPhrases,
    favorites,
    isLoading,
    currentLocation,
    isLocationAutoDetected,
    isAutoDetecting,
    setLocation,
    autoDetectLocation,
    refreshPredictions,
    loadCustomPhrases,
    quickResponses,
    currentWeather,
  } = usePredictionStore();
  
  const { copingPhrases } = useEmotionStore();
  const { settings, isLLMReady } = useSettingsStore();
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [showCustomPhrases, setShowCustomPhrases] = useState(true);
  const [showFavorites, setShowFavorites] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [hasAttemptedAutoDetect, setHasAttemptedAutoDetect] = useState(false);

  const T = getTranslations(settings.language);
  const isRTL = isRTLLanguage(settings.language);
  const writingDirection = getWritingDirection(settings.language);
  
  const LOCATIONS: { id: LocationType; label: string; emoji: string }[] = [
    { id: 'home', label: T.locations.home, emoji: LOCATION_EMOJIS.home },
    { id: 'school', label: T.locations.school, emoji: LOCATION_EMOJIS.school },
    { id: 'hospital', label: T.locations.hospital, emoji: LOCATION_EMOJIS.hospital },
    { id: 'outdoor', label: T.locations.outdoor, emoji: LOCATION_EMOJIS.outdoor },
    { id: 'restaurant', label: T.locations.restaurant, emoji: LOCATION_EMOJIS.restaurant },
  ];

  const timeOfDay = ContextService.getTimeOfDay();
  
  useEffect(() => {
    const initLocation = async () => {
      if (!hasAttemptedAutoDetect) {
        setHasAttemptedAutoDetect(true);
        const result = await autoDetectLocation();
        if (!result.detected) {
          setShowLocationPicker(true);
        }
      }
    };
    initLocation();
  }, []);

  const getGreeting = () => {
    return T.greeting[timeOfDay];
  };

  const getTimeLabel = () => {
    return T.timeOfDay[timeOfDay];
  };

  const getLocationLabel = () => {
    if (currentLocation === 'unknown') {
      return T.home.whereAreYou;
    }
    const loc = LOCATIONS.find(l => l.id === currentLocation);
    return loc ? `${loc.emoji} ${loc.label}` : currentLocation;
  };

  useFocusEffect(
    useCallback(() => {
      loadCustomPhrases();
    }, [])
  );

  const handleLocationChange = useCallback((location: LocationType) => {
    setLocation(location, false);
    setShowLocationPicker(false);
  }, [setLocation]);

  const handleRetryAutoDetect = useCallback(async () => {
    const result = await autoDetectLocation();
    if (!result.detected) {
      setShowLocationPicker(true);
    } else {
      setShowLocationPicker(false);
    }
  }, [autoDetectLocation]);

  const handlePhrasePress = useCallback(async (phrase: Phrase) => {
    // TTS is handled in PhraseCard, this callback is for additional actions
    if (__DEV__) console.log('Phrase selected:', phrase.text);
  }, []);

  const handleEditPhrase = useCallback((phrase: Phrase) => {
    if (phrase.isCustom) {
      router.push({
        pathname: '/add-phrase',
        params: { id: phrase.id, text: phrase.text, category: phrase.category, emoji: phrase.emoji },
      });
    }
  }, [router]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleRetryAutoDetect();
    await refreshPredictions();
    setRefreshing(false);
  }, [refreshPredictions, handleRetryAutoDetect]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || isLoading}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        <View style={[styles.header, { direction: writingDirection }]}>
          <View style={[styles.headerTop, isRTL && styles.rowReverse]}>
            <View style={isRTL && styles.itemsEnd}>
              <Text style={[styles.greeting, isRTL && styles.textRight]}>{getGreeting()}</Text>
                <Text style={[styles.contextInfo, isRTL && styles.textRight]}>
                📍 {getLocationLabel()}
                {isLocationAutoDetected && (
                  <Text style={styles.autoDetectedBadge}> ✓ Auto</Text>
                )}
                {' • '}
                🕐 {getTimeLabel()}
                {currentWeather && currentWeather.source !== 'fallback' && (
                  <>
                    {' • '}
                    {WEATHER_EMOJIS[currentWeather.condition]} {Math.round(currentWeather.temperature)}°C
                  </>
                )}
              </Text>
            </View>
            <View style={styles.headerActions}>
              <Link href="/history" asChild>
                <Pressable style={styles.headerButton}>
                  <Text style={styles.headerButtonIcon}>📜</Text>
                </Pressable>
              </Link>
              <Link href="/settings" asChild>
                <Pressable style={styles.headerButton}>
                  <Text style={styles.headerButtonIcon}>⚙️</Text>
                </Pressable>
              </Link>
            </View>
          </View>

          {isLLMReady && (
            <View style={[styles.llmBadge, LLMService.isNativeMode && styles.llmBadgeNative]}>
              <Text style={[styles.llmBadgeText, LLMService.isNativeMode && styles.llmBadgeTextNative]}>
                {LLMService.isNativeMode ? '🧠' : '🤖'} {T.home.aiActive}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.locationHeader}>
            <Text style={styles.sectionTitle}>📍 {T.home.whereAreYou}</Text>
            {isAutoDetecting && (
              <View style={styles.detectingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.detectingText}>
                  {T.common.loading}
                </Text>
              </View>
            )}
            {isLocationAutoDetected && !isAutoDetecting && (
              <Pressable onPress={() => setShowLocationPicker(!showLocationPicker)}>
                <Text style={styles.changeLocationText}>
                  {T.common.edit}
                </Text>
              </Pressable>
            )}
          </View>

          {(showLocationPicker || !isLocationAutoDetected || currentLocation === 'unknown') && (
            <View style={styles.locationPickerContainer}>
              {!isLocationAutoDetected && currentLocation !== 'unknown' && (
                <Pressable style={styles.retryButton} onPress={handleRetryAutoDetect}>
                  <Text style={styles.retryButtonText}>
                    🔄 Retry GPS
                  </Text>
                </Pressable>
              )}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.locationScroll}
              >
                {LOCATIONS.map((loc) => (
                  <Pressable
                    key={loc.id}
                    style={[
                      styles.locationButton,
                      currentLocation === loc.id && styles.locationButtonActive,
                    ]}
                    onPress={() => handleLocationChange(loc.id)}
                  >
                    <Text style={styles.locationEmoji}>{loc.emoji}</Text>
                    <Text
                      style={[
                        styles.locationText,
                        currentLocation === loc.id && styles.locationTextActive,
                      ]}
                    >
                      {loc.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          )}

          {isLocationAutoDetected && !showLocationPicker && currentLocation !== 'unknown' && (
            <View style={styles.autoDetectedContainer}>
              <View style={styles.autoDetectedInfo}>
                <Text style={styles.autoDetectedLocation}>
                  {LOCATIONS.find(l => l.id === currentLocation)?.emoji}{' '}
                  {LOCATIONS.find(l => l.id === currentLocation)?.label}
                </Text>
                <View style={styles.autoDetectedPill}>
                  <Text style={styles.autoDetectedPillText}>
                    ✓ GPS Auto
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        <EmotionSelector />

        <View style={styles.emergencySection}>
          <EmergencyButton />
        </View>

        {favorites.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Pressable
                style={styles.sectionToggle}
                onPress={() => setShowFavorites(!showFavorites)}
              >
                <Text style={styles.sectionToggleText}>
                  {showFavorites ? '▼' : '▶'} ⭐ {T.home.favorites} ({favorites.length})
                </Text>
              </Pressable>
              <Link href="/favorites" asChild>
                <Pressable style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>
                    {T.home.manage} →
                  </Text>
                </Pressable>
              </Link>
            </View>
            {showFavorites && (
              <View style={styles.section}>
                <PhraseGrid
                  phrases={favorites}
                  numColumns={2}
                  cardSize="medium"
                  onPhrasePress={handlePhrasePress}
                />
              </View>
            )}
          </>
        )}

        <Pressable
          style={styles.sectionToggle}
          onPress={() => setShowCustomPhrases(!showCustomPhrases)}
        >
          <Text style={styles.sectionToggleText}>
            {showCustomPhrases ? '▼' : '▶'} ✏️ {T.home.myPhrases} ({customPhrases.length})
          </Text>
        </Pressable>
        {showCustomPhrases && (
          <View style={styles.section}>
            {customPhrases.length > 0 ? (
              <PhraseGrid
                phrases={customPhrases}
                numColumns={2}
                cardSize="medium"
                onPhrasePress={handlePhrasePress}
                onPhraseLongPress={handleEditPhrase}
              />
            ) : (
              <Text style={styles.emptyText}>
                {T.home.noCustomPhrasesYet}
              </Text>
            )}
            <Link href="/add-phrase" asChild>
              <Pressable style={styles.addButton}>
                <Text style={styles.addButtonText}>
                  ➕ {T.home.addNewPhrase}
                </Text>
              </Pressable>
            </Link>
          </View>
        )}

        {copingPhrases.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              💭 {T.home.copingPhrases}
            </Text>
            <PhraseGrid
              phrases={copingPhrases.slice(0, 4).map((text, i) => ({
                id: `coping_${i}`,
                text,
                category: 'feeling',
                emoji: '💗',
              }))}
              numColumns={2}
              cardSize="small"
              onPhrasePress={handlePhrasePress}
            />
          </View>
        )}

        <Pressable
          style={styles.sectionToggle}
          onPress={() => setShowQuickResponses(!showQuickResponses)}
        >
          <Text style={styles.sectionToggleText}>
            {showQuickResponses ? '▼' : '▶'} ⚡ {T.home.quickResponses}
          </Text>
        </Pressable>

        {showQuickResponses && (
          <View style={styles.section}>
            <PhraseGrid
              phrases={quickResponses}
              numColumns={4}
              cardSize="small"
              onPhrasePress={handlePhrasePress}
            />
          </View>
        )}

        <View style={styles.section} key={`predictions_${currentLocation}`}>
          <Text style={styles.sectionTitle}>
            💬 {T.home.suggestedPhrases}
          </Text>
          <PhraseGrid
            phrases={predictions}
            numColumns={2}
            cardSize="medium"
            isLoading={isLoading}
            onPhrasePress={handlePhrasePress}
            emptyMessage={T.home.pullToRefresh}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  contextInfo: {
    ...TYPOGRAPHY.small,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  autoDetectedBadge: {
    color: COLORS.success,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerButton: {
    padding: SPACING.sm,
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonIcon: {
    fontSize: 24,
  },
  llmBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.successBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
  },
  llmBadgeText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.success,
  },
  llmBadgeNative: {
    backgroundColor: COLORS.primary + '15',
  },
  llmBadgeTextNative: {
    color: COLORS.primary,
  },
  section: {
    paddingHorizontal: SPACING.sm,
    marginTop: SPACING.md,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.text,
  },
  detectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  detectingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  changeLocationText: {
    ...TYPOGRAPHY.smallMedium,
    color: COLORS.primary,
  },
  locationPickerContainer: {
    marginTop: SPACING.xs,
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.warningBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.xs,
    minHeight: TOUCH_TARGET.min,
    justifyContent: 'center',
  },
  retryButtonText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.warning,
  },
  autoDetectedContainer: {
    marginTop: SPACING.xs,
  },
  autoDetectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.successBackground,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  autoDetectedLocation: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  autoDetectedPill: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  autoDetectedPillText: {
    ...TYPOGRAPHY.captionMedium,
    color: COLORS.onSuccess,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  sectionToggle: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginTop: SPACING.md,
    minHeight: TOUCH_TARGET.min,
    justifyContent: 'center',
  },
  sectionToggleText: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.text,
  },
  viewAllButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: TOUCH_TARGET.min,
    justifyContent: 'center',
  },
  viewAllText: {
    ...TYPOGRAPHY.smallMedium,
    color: COLORS.primary,
  },
  locationScroll: {
    paddingHorizontal: SPACING.xs,
    gap: SPACING.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    minHeight: TOUCH_TARGET.min,
    ...SHADOWS.sm,
  },
  locationButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '10',
    ...SHADOWS.md,
  },
  locationEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  locationText: {
    ...TYPOGRAPHY.smallMedium,
    color: COLORS.text,
  },
  locationTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  emergencySection: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: SPACING.xl,
  },
  addButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    minHeight: TOUCH_TARGET.recommended,
    justifyContent: 'center',
  },
  addButtonText: {
    ...TYPOGRAPHY.bodySemibold,
    color: COLORS.primary,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textRight: {
    textAlign: 'right',
  },
  itemsEnd: {
    alignItems: 'flex-end',
  },
});
