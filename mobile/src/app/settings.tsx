import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useRouter, Link } from 'expo-router';

import { useSettingsStore, usePredictionStore, useEmotionStore } from '../stores';
import { TTSService, StorageService, ContextService, LLMService } from '../services';
import { COLORS, SPACING, BORDER_RADIUS } from '../constants';
import { getTranslations } from '../i18n';
import { SupportedLanguage, SavedLocation, LocationType } from '../types';
import { configureRTLRequiresRestart, isRTLLanguage, getWritingDirection } from '../utils/rtl';

const LOCATION_EMOJIS: Record<LocationType, string> = {
  home: '🏠',
  school: '🏫',
  hospital: '🏥',
  outdoor: '🌳',
  restaurant: '🍽️',
  unknown: '📍',
};

const LANGUAGES: { code: SupportedLanguage; label: string; emoji: string }[] = [
  { code: 'en', label: 'English', emoji: '🇺🇸' },
  { code: 'ko', label: '한국어', emoji: '🇰🇷' },
  { code: 'ja', label: '日本語', emoji: '🇯🇵' },
  { code: 'es', label: 'Español', emoji: '🇪🇸' },
  { code: 'ru', label: 'Русский', emoji: '🇷🇺' },
  { code: 'id', label: 'Bahasa', emoji: '🇮🇩' },
  { code: 'pt', label: 'Português', emoji: '🇧🇷' },
  { code: 'fr', label: 'Français', emoji: '🇫🇷' },
  { code: 'de', label: 'Deutsch', emoji: '🇩🇪' },
  { code: 'bn', label: 'বাংলা', emoji: '🇧🇩' },
  { code: 'ar', label: 'العربية', emoji: '🇸🇦' },
  { code: 'ur', label: 'اردو', emoji: '🇵🇰' },
  { code: 'hi', label: 'हिन्दी', emoji: '🇮🇳' },
  { code: 'it', label: 'Italiano', emoji: '🇮🇹' },
  { code: 'pl', label: 'Polski', emoji: '🇵🇱' },
  { code: 'uk', label: 'Українська', emoji: '🇺🇦' },
  { code: 'ro', label: 'Română', emoji: '🇷🇴' },
  { code: 'nl', label: 'Nederlands', emoji: '🇳🇱' },
  { code: 'vi', label: 'Tiếng Việt', emoji: '🇻🇳' },
  { code: 'tr', label: 'Türkçe', emoji: '🇹🇷' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, isLLMReady, llmProgress, resetSettings } = useSettingsStore();
  const { refreshPredictions } = usePredictionStore();
  const { detectEmotion } = useEmotionStore();
  const [testText, setTestText] = useState("Hello, I'm SpeakEasy!");
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [savingLocation, setSavingLocation] = useState<LocationType | null>(null);
  
  const T = getTranslations(settings.language);
  const isRTL = isRTLLanguage(settings.language);
  const writingDirection = getWritingDirection(settings.language);
  
  const LOCATION_TYPES: { id: LocationType; label: string; emoji: string }[] = [
    { id: 'home', label: T.locations.home, emoji: LOCATION_EMOJIS.home },
    { id: 'school', label: T.locations.school, emoji: LOCATION_EMOJIS.school },
    { id: 'hospital', label: T.locations.hospital, emoji: LOCATION_EMOJIS.hospital },
    { id: 'outdoor', label: T.locations.outdoor, emoji: LOCATION_EMOJIS.outdoor },
    { id: 'restaurant', label: T.locations.restaurant, emoji: LOCATION_EMOJIS.restaurant },
  ];

  useEffect(() => {
    loadSavedLocations();
  }, []);

  const loadSavedLocations = async () => {
    const locations = await StorageService.getSavedLocations();
    setSavedLocations(locations);
  };

  const handleSaveCurrentLocation = async (locationType: LocationType) => {
    setSavingLocation(locationType);
    
    const locationInfo = LOCATION_TYPES.find(l => l.id === locationType);
    const name = locationInfo?.label || locationType;
    
    try {
      const saved = await ContextService.saveCurrentLocationAs(
        locationType,
        name
      );
      
      if (saved) {
        await loadSavedLocations();
        Alert.alert(
          T.common.success,
          `${name} - ${T.common.save}`
        );
      } else {
        Alert.alert(
          T.common.error,
          T.common.error
        );
      }
    } catch (error) {
      Alert.alert(
        T.common.error,
        T.common.error
      );
    }
    
    setSavingLocation(null);
  };

  const handleDeleteLocation = async (locationType: LocationType) => {
    const locationInfo = LOCATION_TYPES.find(l => l.id === locationType);
    const name = locationInfo?.label || locationType;
    
    Alert.alert(
      T.common.delete,
      `${name}?`,
      [
        { text: T.common.cancel, style: 'cancel' },
        {
          text: T.common.delete,
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteLocation(locationType);
            await loadSavedLocations();
          },
        },
      ]
    );
  };

  const getSavedLocationForType = (type: LocationType): SavedLocation | undefined => {
    return savedLocations.find(l => l.type === type);
  };

  const handleRateChange = async (value: number) => {
    await updateSettings({ speechRate: value });
  };

  const handlePitchChange = async (value: number) => {
    await updateSettings({ speechPitch: value });
  };

  const handleTestVoice = async () => {
    await TTSService.speak(testText, { language: settings.language });
  };

  const handleLanguageChange = async (language: SupportedLanguage) => {
    const needsRestart = configureRTLRequiresRestart(language);
    
    await updateSettings({ language });
    await refreshPredictions(language);
    detectEmotion(language);

    if (needsRestart) {
      const newT = getTranslations(language);
      Alert.alert(
        isRTLLanguage(language) ? newT.layout.rtlEnabled : newT.layout.ltrEnabled,
        newT.layout.restartRequired,
        [{ text: newT.common.ok }]
      );
    }
  };

  const handleResetData = () => {
    Alert.alert(
      T.settings.resetConfirmTitle,
      T.settings.resetConfirmMessage,
      [
        { text: T.settings.cancel, style: 'cancel' },
        {
          text: T.settings.reset,
          style: 'destructive',
          onPress: async () => {
            await resetSettings();
            Alert.alert(T.settings.done, T.settings.allDataReset);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={{ direction: writingDirection }}>
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 {T.settings.userProfile}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>{T.settings.nameOptional}</Text>
            <TextInput
              style={styles.input}
              value={settings.name}
              onChangeText={(text) => updateSettings({ name: text })}
              placeholder={T.settings.enterYourName}
              placeholderTextColor={COLORS.textLight}
            />
          </View>
        </View>

        {/* Voice Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔊 {T.settings.voiceSettings}</Text>
          <View style={styles.card}>
            <View style={styles.sliderRow}>
              <Text style={styles.label}>{T.settings.speechRate}</Text>
              <Text style={styles.sliderValue}>{settings.speechRate.toFixed(1)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={1.5}
              value={settings.speechRate}
              onSlidingComplete={handleRateChange}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />

            <View style={styles.sliderRow}>
              <Text style={styles.label}>{T.settings.voicePitch}</Text>
              <Text style={styles.sliderValue}>{settings.speechPitch.toFixed(1)}</Text>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={1.5}
              value={settings.speechPitch}
              onSlidingComplete={handlePitchChange}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.border}
              thumbTintColor={COLORS.primary}
            />

            <View style={styles.testSection}>
              <TextInput
                style={[styles.input, styles.testInput]}
                value={testText}
                onChangeText={setTestText}
                placeholder={T.settings.typeToTest}
                placeholderTextColor={COLORS.textLight}
              />
              <Pressable style={styles.testButton} onPress={handleTestVoice}>
                <Text style={styles.testButtonText}>🔊 {T.settings.test}</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* AI Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 {T.settings.aiAssistant}</Text>
          <View style={styles.card}>
            <View style={styles.statusRow}>
              <Text style={styles.label}>
                {LLMService.isNativeMode ? T.settings.onDeviceAI : T.settings.ruleBasedMode}
              </Text>
              <View style={[
                styles.statusBadge, 
                LLMService.isNativeMode ? styles.statusActive : styles.statusRuleBased
              ]}>
                <Text style={styles.statusText}>
                  {LLMService.isNativeMode 
                    ? `🧠 ${T.settings.ready}` 
                    : isLLMReady ? '📋 Active' : `${llmProgress}%`}
                </Text>
              </View>
            </View>
            <Text style={styles.helpText}>
              {LLMService.isNativeMode
                ? T.settings.aiReadyMessage
                : T.settings.ruleBasedMessage}
            </Text>
          </View>
        </View>

        {/* Accessibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>♿ {T.settings.accessibility}</Text>
          <View style={styles.card}>
            <View style={[styles.switchRow, isRTL && styles.rowReverse]}>
              <View style={isRTL && styles.itemsEnd}>
                <Text style={[styles.label, isRTL && styles.textRight]}>{T.settings.hapticFeedback}</Text>
                <Text style={[styles.helpText, isRTL && styles.textRight]}>{T.settings.hapticDesc}</Text>
              </View>
              <Switch
                value={settings.enableHaptics}
                onValueChange={(value) => updateSettings({ enableHaptics: value })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.divider} />

            <View style={[styles.switchRow, isRTL && styles.rowReverse]}>
              <View style={isRTL && styles.itemsEnd}>
                <Text style={[styles.label, isRTL && styles.textRight]}>{T.settings.largeText}</Text>
                <Text style={[styles.helpText, isRTL && styles.textRight]}>{T.settings.largeTextDesc}</Text>
              </View>
              <Switch
                value={settings.largeText}
                onValueChange={(value) => updateSettings({ largeText: value })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>

            <View style={styles.divider} />

            <View style={[styles.switchRow, isRTL && styles.rowReverse]}>
              <View style={isRTL && styles.itemsEnd}>
                <Text style={[styles.label, isRTL && styles.textRight]}>{T.settings.highContrast}</Text>
                <Text style={[styles.helpText, isRTL && styles.textRight]}>{T.settings.highContrastDesc}</Text>
              </View>
              <Switch
                value={settings.highContrast}
                onValueChange={(value) => updateSettings({ highContrast: value })}
                trackColor={{ false: COLORS.border, true: COLORS.primary }}
              />
            </View>
          </View>
        </View>

        {/* Caregiver Contacts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👨‍👩‍👧 {T.settings.caregiverContacts}</Text>
          <View style={styles.card}>
            {settings.caregivers.length === 0 ? (
              <Text style={styles.helpText}>
                {T.settings.noCaregivers}
              </Text>
            ) : (
              <>
                {settings.caregivers.slice(0, 2).map((caregiver) => (
                  <View key={caregiver.id} style={styles.caregiverRow}>
                    <View>
                      <Text style={styles.label}>{caregiver.name}</Text>
                      <Text style={styles.helpText}>{caregiver.relationship}</Text>
                    </View>
                  </View>
                ))}
                {settings.caregivers.length > 2 && (
                  <Text style={styles.helpText}>
                    +{settings.caregivers.length - 2} {T.settings.more}
                  </Text>
                )}
              </>
            )}
            <Link href="/caregivers" asChild>
              <Pressable style={styles.addButton}>
                <Text style={styles.addButtonText}>
                  {settings.caregivers.length > 0 ? T.settings.manageCaregivers : T.settings.addCaregiver}
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Saved Locations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 {T.home.whereAreYou}</Text>
          <View style={styles.card}>
            <Text style={styles.helpText}>
              GPS Auto-detection
            </Text>
            <View style={styles.locationList}>
              {LOCATION_TYPES.map((locType) => {
                const savedLoc = getSavedLocationForType(locType.id);
                const isSaving = savingLocation === locType.id;
                
                return (
                  <View key={locType.id} style={styles.locationItem}>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationEmoji}>{locType.emoji}</Text>
                      <View>
                        <Text style={styles.locationLabel}>
                          {locType.label}
                        </Text>
                        {savedLoc && (
                          <Text style={styles.locationSavedText}>
                            ✓ GPS
                          </Text>
                        )}
                      </View>
                    </View>
                    <View style={styles.locationActions}>
                      {isSaving ? (
                        <ActivityIndicator size="small" color={COLORS.primary} />
                      ) : (
                        <>
                          <Pressable
                            style={styles.locationActionButton}
                            onPress={() => handleSaveCurrentLocation(locType.id)}
                          >
                            <Text style={styles.locationActionText}>
                              {savedLoc ? T.common.edit : T.common.save}
                            </Text>
                          </Pressable>
                          {savedLoc && (
                            <Pressable
                              style={styles.locationDeleteButton}
                              onPress={() => handleDeleteLocation(locType.id)}
                            >
                              <Text style={styles.locationDeleteText}>🗑️</Text>
                            </Pressable>
                          )}
                        </>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 {T.settings.language}</Text>
          <View style={styles.card}>
            <Text style={styles.label}>{T.settings.selectLanguage}</Text>
            <View style={styles.languageOptions}>
              {LANGUAGES.map((lang) => (
                <Pressable
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    settings.language === lang.code && styles.languageButtonActive,
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text style={styles.languageEmoji}>{lang.emoji}</Text>
                  <Text
                    style={[
                      styles.languageText,
                      settings.language === lang.code && styles.languageTextActive,
                    ]}
                  >
                    {lang.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ {T.settings.dataManagement}</Text>
          <View style={styles.card}>
            <Pressable style={styles.dangerButton} onPress={handleResetData}>
              <Text style={styles.dangerButtonText}>🗑️ {T.settings.resetAllData}</Text>
            </Pressable>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfo}>
            <Text style={styles.appName}>🗣️ {T.appName}</Text>
            <Text style={styles.appVersion}>{T.settings.version} 1.0.0</Text>
            <Text style={styles.appTagline}>
              {T.settings.tagline}
            </Text>
          </View>
        </View>
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
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  helpText: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
    marginTop: SPACING.sm,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  sliderValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  testSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: SPACING.sm,
  },
  testInput: {
    flex: 1,
    marginTop: 0,
  },
  testButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusPending: {
    backgroundColor: '#FFF3E0',
  },
  statusRuleBased: {
    backgroundColor: '#E3F2FD',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },
  caregiverRow: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  addButton: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  addButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 15,
  },
  languageOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.xs,
  },
  languageButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E8F4FD',
  },
  languageEmoji: {
    fontSize: 20,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  languageTextActive: {
    color: COLORS.primary,
  },
  dangerButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: COLORS.emergency,
    fontWeight: '600',
    fontSize: 15,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  appVersion: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SPACING.xs,
  },
  appTagline: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  locationList: {
    marginTop: SPACING.md,
  },
  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationEmoji: {
    fontSize: 24,
  },
  locationLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },
  locationSavedText: {
    fontSize: 12,
    color: COLORS.success,
    marginTop: 2,
  },
  locationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationActionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  locationActionText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  locationDeleteButton: {
    padding: SPACING.xs,
  },
  locationDeleteText: {
    fontSize: 16,
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
