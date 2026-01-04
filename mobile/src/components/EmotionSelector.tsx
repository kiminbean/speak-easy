import React, { memo, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  AccessibilityInfo,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { EmotionType } from '../types';
import { EMOTIONS } from '../constants';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, TOUCH_TARGET } from '../constants';
import { useEmotionStore, useSettingsStore } from '../stores';
import { t } from '../i18n';
import { isRTLLanguage, getWritingDirection } from '../utils/rtl';

interface EmotionSelectorProps {
  onSelect?: (emotion: EmotionType) => void;
}

export const EmotionSelector = memo(function EmotionSelector({ onSelect }: EmotionSelectorProps) {
  const { explicitEmotion, setExplicitEmotion, currentEmotion } = useEmotionStore();
  const { settings } = useSettingsStore();

  const lang = settings.language;
  const isRTL = isRTLLanguage(lang);
  const writingDirection = getWritingDirection(lang);

  const emotions: EmotionType[] = useMemo(() => [
    'happy',
    'calm',
    'tired',
    'sad',
    'anxious',
    'frustrated',
    'scared',
  ], []);

  const getEmotionLabel = useCallback((emotionId: EmotionType) => {
    return t(lang, `emotions.${emotionId}`);
  }, [lang]);

  const handlePress = useCallback(async (emotion: EmotionType) => {
    if (settings.enableHaptics) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (explicitEmotion === emotion) {
      setExplicitEmotion(null);
      AccessibilityInfo.announceForAccessibility(t(lang, 'emotions.emotionCleared'));
    } else {
      setExplicitEmotion(emotion);
      const label = getEmotionLabel(emotion);
      const announcement = t(lang, 'emotions.feelingSelected').replace('%s', label);
      AccessibilityInfo.announceForAccessibility(announcement);
    }

    onSelect?.(emotion);
  }, [settings.enableHaptics, explicitEmotion, setExplicitEmotion, lang, getEmotionLabel, onSelect]);

  return (
    <View style={[styles.container, { direction: writingDirection }]}>
      <Text style={[styles.label, isRTL && styles.labelRTL]}>{t(lang, 'emotions.howAreYouFeeling')}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isRTL && styles.scrollContentRTL]}
      >
        {emotions.map((emotionId) => {
          const emotion = EMOTIONS[emotionId];
          const emotionLabel = getEmotionLabel(emotionId);
          const isSelected = explicitEmotion === emotionId;
          const isDetected = currentEmotion?.emotion === emotionId && !explicitEmotion;

          return (
            <Pressable
              key={emotionId}
              style={({ pressed }) => [
                styles.button,
                { borderColor: emotion.color },
                isSelected && [styles.buttonSelected, { backgroundColor: emotion.color }],
                isDetected && styles.buttonDetected,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => handlePress(emotionId)}
              accessibilityRole="button"
              accessibilityLabel={`${emotionLabel} ${emotion.emoji}`}
              accessibilityState={{ selected: isSelected }}
              accessibilityHint={isSelected ? t(lang, 'emotions.emotionCleared') : t(lang, 'emotions.feelingSelected').replace('%s', emotionLabel)}
            >
              <Text style={styles.emoji}>{emotion.emoji}</Text>
              <Text
                style={[
                  styles.buttonText,
                  isSelected && styles.buttonTextSelected,
                ]}
              >
                {emotionLabel}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.md,
  },
  label: {
    ...TYPOGRAPHY.smallMedium,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  scrollContent: {
    paddingHorizontal: SPACING.sm,
    gap: SPACING.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    marginHorizontal: SPACING.xxs,
    minHeight: TOUCH_TARGET.min,
    ...SHADOWS.sm,
  },
  buttonSelected: {
    ...SHADOWS.lg,
  },
  buttonDetected: {
    borderStyle: 'dashed',
    backgroundColor: COLORS.backgroundSecondary,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  emoji: {
    fontSize: 22,
    marginRight: SPACING.sm,
  },
  buttonText: {
    ...TYPOGRAPHY.smallMedium,
    color: COLORS.text,
  },
  buttonTextSelected: {
    color: COLORS.onPrimary,
    fontWeight: '600',
  },
  labelRTL: {
    textAlign: 'right',
  },
  scrollContentRTL: {
    flexDirection: 'row-reverse',
  },
});
