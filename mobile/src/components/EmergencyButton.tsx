import React, { useState, memo, useCallback, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  AccessibilityInfo,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { COLORS, GLASS, SPACING, BORDER_RADIUS, SHADOWS, TYPOGRAPHY, TOUCH_TARGET, ANIMATION } from '../constants';
import { TTSService, NotificationService } from '../services';
import { useEmotionStore, useSettingsStore } from '../stores';
import { PhraseCard } from './PhraseCard';
import { getTranslations } from '../i18n';
import { getEmergencyPhrasesForLanguage } from '../i18n/phrases';
import { Phrase } from '../types';
import { isRTLLanguage } from '../utils/rtl';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EmergencyButtonProps {
  onEmergency?: () => void;
}

export const EmergencyButton = memo(function EmergencyButton({ onEmergency }: EmergencyButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const { triggerEmergencyAlert } = useEmotionStore();
  const { settings } = useSettingsStore();
  const T = getTranslations(settings.language);
  const isRTL = isRTLLanguage(settings.language);

  const scale = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(ANIMATION.scale.pulseMax, { 
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(ANIMATION.scale.pulseMin, { 
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(pulseScale);
    };
  }, [pulseScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * pulseScale.value }],
  }));

  const emergencyPhrases = useMemo(() => {
    const texts = getEmergencyPhrasesForLanguage(settings.language);
    return texts.map((text, index): Phrase => ({
      id: `emergency_${index}`,
      text,
      category: 'emergency' as const,
      emoji: ['🆘', '🚨', '📞', '⚠️', '❗', '🚨', '🆘', '🙏'][index] || '🚨',
      isEmergency: true,
    }));
  }, [settings.language]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(ANIMATION.scale.pressed, ANIMATION.spring);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, ANIMATION.spring);
  }, [scale]);

  const handleEmergencyPress = useCallback(async () => {
    if (settings.enableHaptics) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    setShowModal(true);
  }, [settings.enableHaptics]);

  const handleQuickEmergency = useCallback(async () => {
    scale.value = withSequence(
      withSpring(ANIMATION.scale.longPressed, ANIMATION.springBouncy),
      withSpring(1, ANIMATION.spring)
    );

    const phrase = emergencyPhrases[0].text;

    if (settings.enableHaptics) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    await TTSService.speakEmergency(phrase, settings.language);
    await triggerEmergencyAlert(phrase);
    await NotificationService.sendPhraseAlert(phrase);

    AccessibilityInfo.announceForAccessibility(T.emergency.alertSent);

    setShowModal(false);
    onEmergency?.();

    if (settings.caregivers.length > 0) {
      setTimeout(() => {
        NotificationService.showEmergencyContactOptions(settings.caregivers, settings.language);
      }, 500);
    }
  }, [emergencyPhrases, settings.enableHaptics, settings.language, settings.caregivers, triggerEmergencyAlert, T.emergency.alertSent, onEmergency, scale]);

  const handlePhraseSelect = useCallback(async (phrase: Phrase) => {
    if (settings.enableHaptics) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    await TTSService.speakEmergency(phrase.text, settings.language);
    await triggerEmergencyAlert(phrase.text);
    await NotificationService.sendPhraseAlert(phrase.text);

    setShowModal(false);
  }, [settings.enableHaptics, settings.language, triggerEmergencyAlert]);

  return (
    <>
      <AnimatedPressable
        style={[
          styles.button,
          isRTL && styles.buttonRTL,
          animatedStyle,
        ]}
        onPress={handleEmergencyPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onLongPress={handleQuickEmergency}
        delayLongPress={500}
        accessibilityRole="button"
        accessibilityLabel={T.emergency.title}
        accessibilityHint={T.emergency.needHelp}
      >
        <Text style={[styles.emoji, isRTL && styles.emojiRTL]}>🆘</Text>
        <Text style={styles.text}>{T.emergency.title.toUpperCase()}</Text>
      </AnimatedPressable>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, isRTL && styles.modalHeaderRTL]}>
              <Text style={styles.modalTitle}>🚨 {T.emergency.title}</Text>
              <Pressable
                onPress={() => setShowModal(false)}
                style={styles.closeButton}
                accessibilityLabel={T.common.close}
                accessibilityRole="button"
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              {T.emergency.caregiverNotified}
            </Text>

            <View style={styles.phrasesContainer}>
              {emergencyPhrases.map((phrase) => (
                <View key={phrase.id} style={styles.phraseWrapper}>
                  <PhraseCard
                    phrase={phrase}
                    onPress={() => handlePhraseSelect(phrase)}
                    size="medium"
                  />
                </View>
              ))}
            </View>

            <Pressable
              style={styles.quickHelpButton}
              onPress={handleQuickEmergency}
              accessibilityRole="button"
              accessibilityLabel={T.emergency.needHelp}
              accessibilityHint={T.emergency.caregiverNotified}
            >
              <Text style={styles.quickHelpText}>🚨 {T.emergency.needHelp}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.emergency,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: TOUCH_TARGET.large,
    borderWidth: 1,
    borderColor: GLASS.highlight,
    ...SHADOWS.emergency,
  },
  emoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  text: {
    color: COLORS.onEmergency,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surfaceStrong,
    borderTopLeftRadius: BORDER_RADIUS.xxl,
    borderTopRightRadius: BORDER_RADIUS.xxl,
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    color: COLORS.emergency,
  },
  closeButton: {
    padding: SPACING.sm,
    minWidth: TOUCH_TARGET.min,
    minHeight: TOUCH_TARGET.min,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 24,
    color: COLORS.textSecondary,
  },
  modalSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  phrasesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  phraseWrapper: {
    width: '50%',
    padding: SPACING.xs,
  },
  quickHelpButton: {
    backgroundColor: COLORS.emergency,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    alignItems: 'center',
    marginTop: SPACING.lg,
    minHeight: TOUCH_TARGET.recommended,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: GLASS.highlight,
    ...SHADOWS.emergency,
  },
  quickHelpText: {
    color: COLORS.onEmergency,
    ...TYPOGRAPHY.h4,
    fontWeight: '700',
  },
  buttonRTL: {
    flexDirection: 'row-reverse',
  },
  emojiRTL: {
    marginRight: 0,
    marginLeft: SPACING.md,
  },
  modalHeaderRTL: {
    flexDirection: 'row-reverse',
  },
});
