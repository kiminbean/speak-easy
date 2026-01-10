import React, { memo, useMemo, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Phrase } from '../types';
import { PhraseCard } from './PhraseCard';
import { SkeletonLoader } from './SkeletonLoader';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, ANIMATION } from '../constants';

interface AnimatedCardWrapperProps {
  children: React.ReactNode;
  index: number;
  numColumns: number;
}

const AnimatedCardWrapper = memo(function AnimatedCardWrapper({
  children,
  index,
  numColumns,
}: AnimatedCardWrapperProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(ANIMATION.enter.translateY);

  useEffect(() => {
    const delay = ANIMATION.stagger.initialDelay + (index * ANIMATION.stagger.delay);
    
    opacity.value = withDelay(
      delay,
      withTiming(1, { 
        duration: ANIMATION.timing.normal,
        easing: Easing.out(Easing.ease),
      })
    );
    
    translateY.value = withDelay(
      delay,
      withTiming(0, { 
        duration: ANIMATION.timing.normal,
        easing: Easing.out(Easing.ease),
      })
    );
  }, [index, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.cardContainer, { flex: 1 / numColumns }, animatedStyle]}>
      {children}
    </Animated.View>
  );
});

interface PhraseGridProps {
  phrases: Phrase[];
  isLoading?: boolean;
  onPhrasePress?: (phrase: Phrase) => void;
  onPhraseLongPress?: (phrase: Phrase) => void;
  numColumns?: number;
  cardSize?: 'small' | 'medium' | 'large';
  title?: string;
  emptyMessage?: string;
}

export const PhraseGrid = memo(function PhraseGrid({
  phrases,
  isLoading = false,
  onPhrasePress,
  onPhraseLongPress,
  numColumns = 2,
  cardSize = 'medium',
  title,
  emptyMessage,
}: PhraseGridProps) {
  const rows = useMemo(() => {
    const result: Phrase[][] = [];
    for (let i = 0; i < phrases.length; i += numColumns) {
      result.push(phrases.slice(i, i + numColumns));
    }
    return result;
  }, [phrases, numColumns]);

  if (isLoading) {
    return <SkeletonLoader numColumns={numColumns} numRows={3} cardSize={cardSize} />;
  }

  if (phrases.length === 0 && emptyMessage) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }
  
  if (phrases.length === 0) {
    return null;
  }

  let cardIndex = 0;

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      {rows.map((row, rowIndex) => (
        <View key={`row_${rowIndex}`} style={styles.row}>
          {row.map((phrase) => {
            const currentIndex = cardIndex++;
            return (
              <AnimatedCardWrapper
                key={phrase.id}
                index={currentIndex}
                numColumns={numColumns}
              >
                <PhraseCard
                  phrase={phrase}
                  onPress={onPhrasePress}
                  onLongPress={onPhraseLongPress}
                  size={cardSize}
                />
              </AnimatedCardWrapper>
            );
          })}
          {row.length < numColumns &&
            Array(numColumns - row.length)
              .fill(null)
              .map((_, i) => (
                <View
                  key={`empty_${rowIndex}_${i}`}
                  style={[styles.cardContainer, { flex: 1 / numColumns }]}
                />
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
  header: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.h4,
    color: COLORS.text,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.backgroundSecondary,
    borderRadius: BORDER_RADIUS.xl,
    marginHorizontal: SPACING.xs,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
