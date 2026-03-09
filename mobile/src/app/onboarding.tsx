import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '../stores';
import { ScreenBackground } from '../components';
import { COLORS, GLASS, SHADOWS, SPACING, BORDER_RADIUS } from '../constants';
import { getTranslations } from '../i18n';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateSettings, settings } = useSettingsStore();
  
  const T = getTranslations(settings.language);
  
  const SLIDES: OnboardingSlide[] = useMemo(() => [
    {
      id: '1',
      emoji: '🗣️',
      title: T.onboarding.slide1Title,
      description: T.onboarding.slide1Desc,
    },
    {
      id: '2',
      emoji: '🤖',
      title: T.onboarding.slide2Title,
      description: T.onboarding.slide2Desc,
    },
    {
      id: '3',
      emoji: '⭐',
      title: T.onboarding.slide3Title,
      description: T.onboarding.slide3Desc,
    },
    {
      id: '4',
      emoji: '🚨',
      title: T.onboarding.slide4Title,
      description: T.onboarding.slide4Desc,
    },
  ], [T]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = async () => {
    await completeOnboarding();
  };

  const handleGetStarted = async () => {
    await completeOnboarding();
  };

  const updateIndexFromOffset = (offsetX: number) => {
    const nextIndex = Math.min(
      SLIDES.length - 1,
      Math.max(0, Math.round(offsetX / width))
    );
    setCurrentIndex(nextIndex);
  };

  const completeOnboarding = async () => {
    await updateSettings({ hasCompletedOnboarding: true });
    router.replace('/');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const Dot = ({ index }: { index: number }) => {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * width,
        index * width,
        (index + 1) * width,
      ];
      const dotWidth = interpolate(
        scrollX.value,
        inputRange,
        [8, 24, 8],
        Extrapolation.CLAMP
      );
      const opacity = interpolate(
        scrollX.value,
        inputRange,
        [0.3, 1, 0.3],
        Extrapolation.CLAMP
      );
      return { width: dotWidth, opacity };
    });

    return <Animated.View style={[styles.dot, animatedStyle]} />;
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {SLIDES.map((_, index) => (
        <Dot key={index} index={index} />
      ))}
    </View>
  );

  const isLastSlide = currentIndex === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenBackground>
        <View style={styles.header}>
          {!isLastSlide && (
            <Pressable style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipText}>{T.onboarding.skip}</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.slidesContainer}>
          <FlatList
            ref={flatListRef}
            data={SLIDES}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            scrollEnabled={!isLastSlide}
            showsHorizontalScrollIndicator={false}
            bounces={false}
            style={styles.slidesList}
            onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
              scrollX.value = event.nativeEvent.contentOffset.x;
            }}
            onScrollEndDrag={(event) => {
              updateIndexFromOffset(event.nativeEvent.contentOffset.x);
            }}
            onMomentumScrollEnd={(event) => {
              updateIndexFromOffset(event.nativeEvent.contentOffset.x);
            }}
            scrollEventThrottle={16}
          />
        </View>

        {renderDots()}

        <View style={styles.footer}>
          {isLastSlide ? (
            <Pressable style={styles.getStartedButton} onPress={handleGetStarted}>
              <Text style={styles.getStartedText}>{T.onboarding.getStarted}</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextText}>{T.onboarding.next} →</Text>
            </Pressable>
          )}
        </View>
      </ScreenBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  skipButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  skipText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  slidesContainer: {
    flex: 1,
  },
  slidesList: {
    flex: 1,
  },
  emoji: {
    fontSize: 100,
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 4,
  },
  footer: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    zIndex: 2,
  },
  nextButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    ...SHADOWS.md,
  },
  nextText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  getStartedButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GLASS.highlight,
    ...SHADOWS.md,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
