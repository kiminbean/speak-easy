import React, { useCallback, useState, useMemo, memo } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Pressable,
  AccessibilityInfo,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Phrase } from '../types';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TOUCH_TARGET } from '../constants';
import { TTSService } from '../services';
import { useEmotionStore, usePredictionStore, useSettingsStore } from '../stores';
import { isRTLLanguage, getWritingDirection } from '../utils/rtl';

interface PhraseCardProps {
  phrase: Phrase;
  onPress?: (phrase: Phrase) => void;
  onLongPress?: (phrase: Phrase) => void;
  onFavoriteToggle?: (phrase: Phrase, isFavorite: boolean) => void;
  size?: 'small' | 'medium' | 'large';
  highlighted?: boolean;
  showFavoriteIndicator?: boolean;
}

export const PhraseCard = memo(function PhraseCard({
  phrase,
  onPress,
  onLongPress,
  onFavoriteToggle,
  size = 'medium',
  highlighted = false,
  showFavoriteIndicator = true,
}: PhraseCardProps) {
  const { recordTap, recordPhrase } = useEmotionStore();
  const { addRecentPhrase, toggleFavorite } = usePredictionStore();
  const { settings } = useSettingsStore();
  const [localFavorite, setLocalFavorite] = useState(phrase.isFavorite ?? false);
  
  const isRTL = isRTLLanguage(settings.language);
  const writingDirection = getWritingDirection(settings.language);

  const handlePress = useCallback(async () => {
    const startTime = Date.now();

    // Haptic feedback
    if (settings.enableHaptics) {
      if (phrase.isEmergency) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }

    if (phrase.isEmergency) {
      await TTSService.speakEmergency(phrase.text, settings.language);
    } else {
      await TTSService.speak(phrase.text, { language: settings.language });
    }

    // Record for emotion analysis
    const duration = Date.now() - startTime;
    recordTap(1, duration);
    recordPhrase(phrase.text);

    // Add to recent phrases
    addRecentPhrase(phrase.text);

    // Callback
    onPress?.(phrase);

    // Accessibility announcement
    AccessibilityInfo.announceForAccessibility(`Said: ${phrase.text}`);
  }, [phrase, settings.enableHaptics, recordTap, recordPhrase, addRecentPhrase, onPress]);

  const handleLongPress = useCallback(async () => {
    if (settings.enableHaptics) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    if (onLongPress) {
      onLongPress(phrase);
      return;
    }

    const newFavoriteState = !localFavorite;
    setLocalFavorite(newFavoriteState);
    
    await toggleFavorite(phrase);
    onFavoriteToggle?.(phrase, newFavoriteState);

    AccessibilityInfo.announceForAccessibility(
      newFavoriteState ? `Added ${phrase.text} to favorites` : `Removed ${phrase.text} from favorites`
    );
  }, [phrase, settings.enableHaptics, localFavorite, toggleFavorite, onLongPress, onFavoriteToggle]);

  const sizeStyles = useMemo(() => ({
    small: styles.cardSmall,
    medium: styles.cardMedium,
    large: styles.cardLarge,
  }), []);

  const textSizeStyles = useMemo(() => ({
    small: styles.textSmall,
    medium: styles.textMedium,
    large: styles.textLarge,
  }), []);

  const isFavorite = localFavorite || phrase.isFavorite;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        sizeStyles[size],
        highlighted && styles.cardHighlighted,
        phrase.isEmergency && styles.cardEmergency,
        isFavorite && styles.cardFavorite,
        pressed && styles.cardPressed,
        settings.highContrast && styles.cardHighContrast,
      ]}
      onPress={handlePress}
      onLongPress={handleLongPress}
      delayLongPress={400}
      accessibilityRole="button"
      accessibilityLabel={`${phrase.text}${phrase.isEmergency ? ', emergency phrase' : ''}${isFavorite ? ', favorite' : ''}`}
      accessibilityHint="Double tap to speak. Long press to toggle favorite."
    >
      {showFavoriteIndicator && isFavorite && (
        <View style={[styles.favoriteIndicator, isRTL && styles.favoriteIndicatorRTL]}>
          <Text style={styles.favoriteIcon}>⭐</Text>
        </View>
      )}
      {phrase.emoji && (
        <Text style={[styles.emoji, size === 'small' && styles.emojiSmall]}>
          {phrase.emoji}
        </Text>
      )}
      <Text
        style={[
          styles.text,
          textSizeStyles[size],
          phrase.isEmergency && styles.textEmergency,
          settings.largeText && styles.textLarger,
          settings.highContrast && styles.textHighContrast,
          { writingDirection },
        ]}
        numberOfLines={2}
        adjustsFontSizeToFit
      >
        {phrase.text}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.md,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    position: 'relative',
    minHeight: TOUCH_TARGET.recommended,
  },
  favoriteIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.accent + '20',
    borderRadius: BORDER_RADIUS.full,
    padding: SPACING.xxs,
  },
  favoriteIndicatorRTL: {
    right: undefined,
    left: SPACING.sm,
  },
  favoriteIcon: {
    fontSize: 14,
  },
  cardSmall: {
    minHeight: TOUCH_TARGET.min + 20,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  cardMedium: {
    minHeight: TOUCH_TARGET.recommended + 30,
    padding: SPACING.md,
  },
  cardLarge: {
    minHeight: TOUCH_TARGET.large + 50,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.xxl,
  },
  cardHighlighted: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
    borderWidth: 2,
  },
  cardEmergency: {
    backgroundColor: COLORS.emergencyBackground,
    borderColor: COLORS.emergency,
    borderWidth: 2,
  },
  cardFavorite: {
    borderColor: COLORS.accent,
    borderWidth: 2,
    backgroundColor: COLORS.accent + '05',
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  cardHighContrast: {
    borderWidth: 3,
    borderColor: COLORS.text,
  },
  emoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  emojiSmall: {
    fontSize: 24,
    marginBottom: SPACING.xxs,
  },
  text: {
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  textSmall: {
    fontSize: 14,
    lineHeight: 18,
  },
  textMedium: {
    fontSize: 17,
    lineHeight: 22,
  },
  textLarge: {
    fontSize: 20,
    lineHeight: 26,
  },
  textEmergency: {
    color: COLORS.emergency,
    fontWeight: '700',
  },
  textLarger: {
    fontSize: 20,
    lineHeight: 26,
  },
  textHighContrast: {
    color: COLORS.text,
    fontWeight: '700',
  },
});
