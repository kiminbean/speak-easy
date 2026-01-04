import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, BORDER_RADIUS, CATEGORIES } from '../constants';
import { StorageService, TTSService } from '../services';
import { PhraseCategory, CustomPhrase } from '../types';
import { useSettingsStore } from '../stores';
import { getTranslations } from '../i18n';

const EMOJI_OPTIONS = ['💬', '👋', '🆘', '💭', '💗', '❓', '✅', '🙂', '🎉', '😊', '🙏', '👍', '👎', '🏠', '🍽️', '💧', '😴', '🚽', '📺', '🎮'];

export default function AddPhraseScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; text?: string; category?: string; emoji?: string }>();
  const { settings } = useSettingsStore();
  const T = getTranslations(settings.language);
  
  const isEditing = !!params.id;
  
  const [text, setText] = useState(params.text || '');
  const [category, setCategory] = useState<PhraseCategory>((params.category as PhraseCategory) || 'need');
  const [emoji, setEmoji] = useState(params.emoji || '💬');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) {
      Alert.alert(T.common.error, T.addPhrase.errorEnterPhrase);
      return;
    }

    setIsSaving(true);
    try {
      if (isEditing && params.id) {
        await StorageService.updateCustomPhrase(params.id, {
          text: text.trim(),
          category,
          emoji,
        });
      } else {
        await StorageService.addCustomPhrase(text.trim(), category, emoji);
      }
      router.back();
    } catch (error) {
      Alert.alert(T.common.error, T.common.error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!params.id) return;
    
    Alert.alert(
      T.addPhrase.deleteConfirmTitle,
      T.addPhrase.deleteConfirmMessage,
      [
        { text: T.addPhrase.cancel, style: 'cancel' },
        {
          text: T.addPhrase.delete,
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteCustomPhrase(params.id!);
            router.back();
          },
        },
      ]
    );
  };

  const handleTestVoice = async () => {
    if (text.trim()) {
      await TTSService.speak(text.trim(), { language: settings.language });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>
              {T.addPhrase.phraseText} *
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.phraseInput]}
                value={text}
                onChangeText={setText}
                placeholder={T.addPhrase.phrasePlaceholder}
                placeholderTextColor={COLORS.textLight}
                multiline
                maxLength={100}
              />
              <Pressable style={styles.testButton} onPress={handleTestVoice}>
                <Text style={styles.testButtonText}>🔊</Text>
              </Pressable>
            </View>
            <Text style={styles.charCount}>{text.length}/100</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              {T.addPhrase.category}
            </Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryButton,
                    category === cat.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                  <Text
                    style={[
                      styles.categoryText,
                      category === cat.id && styles.categoryTextActive,
                    ]}
                  >
                    {settings.language === 'ko' ? cat.labelKo : cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              {T.addPhrase.emoji}
            </Text>
            <View style={styles.emojiGrid}>
              {EMOJI_OPTIONS.map((e) => (
                <Pressable
                  key={e}
                  style={[
                    styles.emojiButton,
                    emoji === e && styles.emojiButtonActive,
                  ]}
                  onPress={() => setEmoji(e)}
                >
                  <Text style={styles.emojiText}>{e}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.preview}>
            <Text style={styles.previewLabel}>
              Preview
            </Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewEmoji}>{emoji}</Text>
              <Text style={styles.previewText}>{text || T.addPhrase.phrasePlaceholder}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.saveButton, isSaving && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving
                  ? T.common.loading
                  : isEditing
                  ? T.addPhrase.update
                  : T.addPhrase.save}
              </Text>
            </Pressable>

            {isEditing && (
              <Pressable style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>
                  {T.addPhrase.delete}
                </Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl * 2,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  phraseInput: {
    flex: 1,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  testButton: {
    backgroundColor: COLORS.primary,
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 24,
  },
  charCount: {
    fontSize: 12,
    color: COLORS.textLight,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.full,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  categoryButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E8F4FD',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.primary,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  emojiButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  emojiButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#E8F4FD',
  },
  emojiText: {
    fontSize: 24,
  },
  preview: {
    marginBottom: SPACING.lg,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
  },
  previewCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewEmoji: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: SPACING.sm,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#FFEBEE',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.emergency,
    fontSize: 16,
    fontWeight: '600',
  },
});
