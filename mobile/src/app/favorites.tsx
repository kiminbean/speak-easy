import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePredictionStore, useSettingsStore } from '../stores';
import { PhraseCard, ScreenBackground } from '../components';
import { COLORS, GLASS, SHADOWS, SPACING } from '../constants';
import { Phrase } from '../types';
import { StorageService } from '../services';
import { getTranslations } from '../i18n';

export default function FavoritesScreen() {
  const { favorites, loadPredictions } = usePredictionStore();
  const { settings } = useSettingsStore();
  const T = getTranslations(settings.language);
  const [localFavorites, setLocalFavorites] = useState<Phrase[]>([]);

  useEffect(() => {
    setLocalFavorites(favorites);
  }, [favorites]);

  const handleRemoveFavorite = (phrase: Phrase) => {
    Alert.alert(
      T.favorites.removeFavorite,
      T.favorites.removeConfirm.replace('%s', phrase.text),
      [
        { text: T.common.cancel, style: 'cancel' },
        {
          text: T.favorites.remove,
          style: 'destructive',
          onPress: async () => {
            await StorageService.toggleFavorite(phrase);
            await loadPredictions();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Phrase }) => (
    <View style={styles.cardWrapper}>
      <PhraseCard
        phrase={item}
        size="medium"
        onLongPress={() => handleRemoveFavorite(item)}
        showFavoriteIndicator={false}
      />
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item)}
        accessibilityLabel={`Remove ${item.text} from favorites`}
      >
        <Text style={styles.removeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  if (localFavorites.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScreenBackground>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyTitle}>{T.favorites.noFavorites}</Text>
            <Text style={styles.emptySubtitle}>
              {T.favorites.noFavoritesHint}
            </Text>
          </View>
        </ScreenBackground>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScreenBackground>
        <Text style={styles.headerHint}>
          {T.favorites.longPressHint}
        </Text>
        <FlatList
          data={localFavorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </ScreenBackground>
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
  row: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardWrapper: {
    width: '48%',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.emergency,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: GLASS.highlight,
    ...SHADOWS.md,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
