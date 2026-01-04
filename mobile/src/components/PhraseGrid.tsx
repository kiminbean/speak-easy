import React, { memo, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Phrase } from '../types';
import { PhraseCard } from './PhraseCard';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../constants';

interface PhraseGridProps {
  phrases: Phrase[];
  isLoading?: boolean;
  onPhrasePress?: (phrase: Phrase) => void;
  numColumns?: number;
  cardSize?: 'small' | 'medium' | 'large';
  title?: string;
  emptyMessage?: string;
}

export const PhraseGrid = memo(function PhraseGrid({
  phrases,
  isLoading = false,
  onPhrasePress,
  numColumns = 2,
  cardSize = 'medium',
  title,
  emptyMessage = 'No phrases available',
}: PhraseGridProps) {
  const rows = useMemo(() => {
    const result: Phrase[][] = [];
    for (let i = 0; i < phrases.length; i += numColumns) {
      result.push(phrases.slice(i, i + numColumns));
    }
    return result;
  }, [phrases, numColumns]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (phrases.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      {rows.map((row, rowIndex) => (
        <View key={`row_${rowIndex}`} style={styles.row}>
          {row.map((phrase) => (
            <View 
              key={phrase.id} 
              style={[styles.cardContainer, { flex: 1 / numColumns }]}
            >
              <PhraseCard
                phrase={phrase}
                onPress={onPhrasePress}
                size={cardSize}
              />
            </View>
          ))}
          {/* Fill empty spaces if row is incomplete */}
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
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
});
