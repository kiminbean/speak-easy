import React, { memo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, TOUCH_TARGET } from '../constants';

interface SkeletonCardProps {
  size?: 'small' | 'medium' | 'large';
}

const SHIMMER_DURATION = 1200;

const SkeletonCard = memo(function SkeletonCard({ size = 'medium' }: SkeletonCardProps) {
  const shimmerOpacity = useSharedValue(0.3);

  useEffect(() => {
    shimmerOpacity.value = withRepeat(
      withTiming(0.7, { duration: SHIMMER_DURATION, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [shimmerOpacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerOpacity.value,
  }));

  const sizeStyle = size === 'small' 
    ? styles.cardSmall 
    : size === 'large' 
      ? styles.cardLarge 
      : styles.cardMedium;

  return (
    <Animated.View style={[styles.card, sizeStyle, animatedStyle]}>
      <View style={styles.emojiPlaceholder} />
      <View style={styles.textPlaceholder} />
      <View style={styles.textPlaceholderShort} />
    </Animated.View>
  );
});

interface SkeletonLoaderProps {
  numColumns?: number;
  numRows?: number;
  cardSize?: 'small' | 'medium' | 'large';
}

export const SkeletonLoader = memo(function SkeletonLoader({
  numColumns = 2,
  numRows = 3,
  cardSize = 'medium',
}: SkeletonLoaderProps) {
  const rows = Array.from({ length: numRows }, (_, i) => i);
  const cols = Array.from({ length: numColumns }, (_, i) => i);

  return (
    <View style={styles.container}>
      {rows.map((rowIndex) => (
        <View key={`skeleton-row-${rowIndex}`} style={styles.row}>
          {cols.map((colIndex) => (
            <View
              key={`skeleton-card-${rowIndex}-${colIndex}`}
              style={[styles.cardContainer, { flex: 1 / numColumns }]}
            >
              <SkeletonCard size={cardSize} />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  cardContainer: {
    padding: SPACING.xs,
  },
  card: {
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  cardSmall: {
    minHeight: TOUCH_TARGET.min + 20,
    padding: SPACING.sm,
  },
  cardMedium: {
    minHeight: TOUCH_TARGET.recommended + 30,
    padding: SPACING.md,
  },
  cardLarge: {
    minHeight: TOUCH_TARGET.large + 50,
    padding: SPACING.lg,
  },
  emojiPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  textPlaceholder: {
    width: '80%',
    height: 16,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  textPlaceholderShort: {
    width: '50%',
    height: 12,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.border,
  },
});

export default SkeletonLoader;
