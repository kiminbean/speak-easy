import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePredictionStore, useSettingsStore } from '../stores';
import { StorageService, TTSService } from '../services';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants';
import { getTranslations } from '../i18n';
import * as Haptics from 'expo-haptics';

interface HistoryItem {
  phrase: string;
  timestamp: number;
}

export default function HistoryScreen() {
  const { settings } = useSettingsStore();
  const T = getTranslations(settings.language);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = useCallback(async () => {
    const data = await StorageService.getPhraseHistory();
    setHistory(data.reverse());
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const handleSpeak = useCallback(async (phrase: string) => {
    if (settings.enableHaptics) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await TTSService.speak(phrase, { language: settings.language });
  }, [settings.enableHaptics, settings.language]);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return T.history?.justNow || 'Just now';
    if (diffMins < 60) return `${diffMins}${T.history?.minutesAgo || 'm ago'}`;
    if (diffHours < 24) return `${diffHours}${T.history?.hoursAgo || 'h ago'}`;
    if (diffDays < 7) return `${diffDays}${T.history?.daysAgo || 'd ago'}`;
    
    return date.toLocaleDateString(settings.language, {
      month: 'short',
      day: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <Pressable style={styles.historyItem} onPress={() => handleSpeak(item.phrase)}>
      <View style={styles.itemContent}>
        <Text style={styles.phraseText} numberOfLines={2}>
          {item.phrase}
        </Text>
        <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
      </View>
      <View style={styles.speakButton}>
        <Text style={styles.speakIcon}>🔊</Text>
      </View>
    </Pressable>
  );

  if (history.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📜</Text>
          <Text style={styles.emptyTitle}>{T.history?.noHistory || 'No History Yet'}</Text>
          <Text style={styles.emptySubtitle}>
            {T.history?.noHistoryHint || 'Phrases you speak will appear here'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Text style={styles.headerHint}>
        {T.history?.tapToSpeak || 'Tap any phrase to speak it again'}
      </Text>
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.timestamp}_${index}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerHint: {
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  listContent: {
    padding: SPACING.md,
  },
  historyItem: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  itemContent: {
    flex: 1,
  },
  phraseText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  timeText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  speakButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  speakIcon: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
});
