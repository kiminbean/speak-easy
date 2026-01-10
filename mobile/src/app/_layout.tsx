/**
 * SpeakEasy - Root Layout
 * App-wide providers and navigation setup
 */

import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  TTSService,
  NotificationService,
  PredictionService,
  LLMService,
  EmotionService,
} from '../services';
import { useSettingsStore, usePredictionStore } from '../stores';
import { COLORS } from '../constants';
import { ErrorBoundary } from '../components';
import { configureRTLRequiresRestart } from '../utils/rtl';
import { getTranslations } from '../i18n';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { loadSettings, setLLMStatus, settings } = useSettingsStore();
  const { loadPredictions } = usePredictionStore();
  const [isInitializing, setIsInitializing] = useState(true);
  const [initStatus, setInitStatus] = useState('Starting...');
  const [_shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setInitStatus('Loading settings...');
        await loadSettings();

        const currentSettings = useSettingsStore.getState().settings;
        configureRTLRequiresRestart(currentSettings.language);

        setInitStatus('Initializing voice...');
        await TTSService.initialize();

        setInitStatus('Restoring emotional context...');
        await EmotionService.initialize();

        setInitStatus('Setting up notifications...');
        await NotificationService.initialize();

        setInitStatus('Preparing AI assistant...');
        
        LLMService.onProgress((progress) => {
          setLLMStatus(false, progress);
          setInitStatus(`Loading AI model... ${progress}%`);
        });
        
        LLMService.onReady(() => {
          setLLMStatus(true, 100);
        });

        await LLMService.initialize();

        setInitStatus('Connecting AI...');
        PredictionService.initialize({
          isReady: LLMService.isReady,
          generate: (prompt) => LLMService.generate(prompt).then(r => r.text),
        });

        setInitStatus('Loading phrases...');
        await loadPredictions();

        console.log('App initialized successfully');
        setIsInitializing(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setInitStatus('Ready (offline mode)');
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    const inOnboarding = segments[0] === 'onboarding';
    const needsOnboarding = !settings.hasCompletedOnboarding;

    if (needsOnboarding && !inOnboarding) {
      setShouldShowOnboarding(true);
      router.replace('/onboarding');
    } else if (!needsOnboarding && inOnboarding) {
      router.replace('/');
    }
  }, [isInitializing, settings.hasCompletedOnboarding, segments]);

  const { llmProgress } = useSettingsStore();
  const T = getTranslations(settings.language);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🗣️</Text>
        <Text style={styles.loadingTitle}>SpeakEasy</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${llmProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{llmProgress}%</Text>
        </View>
        <Text style={styles.loadingStatus}>{initStatus}</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaProvider>
          <StatusBar style="dark" />
          <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: COLORS.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: COLORS.background,
            },
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              title: `🗣️ ${T.nav.home}`,
              headerTitleAlign: 'center',
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: `⚙️ ${T.nav.settings}`,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="add-phrase"
            options={{
              title: `➕ ${T.nav.addPhrase}`,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="favorites"
            options={{
              title: `⭐ ${T.nav.favorites}`,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="caregivers"
            options={{
              title: `👨‍👩‍👧 ${T.nav.caregivers}`,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="history"
            options={{
              title: `📜 ${T.nav.history}`,
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 40,
  },
  loadingEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '80%',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    width: 40,
  },
  loadingStatus: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});
