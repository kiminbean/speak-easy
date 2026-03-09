import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenBackground } from '../components';
import { useSettingsStore } from '../stores';
import { StorageService as _StorageService } from '../services';
import { COLORS, GLASS, SHADOWS, SPACING, BORDER_RADIUS } from '../constants';
import { CaregiverContact } from '../types';
import { generateId } from '../utils/hash';
import { getTranslations } from '../i18n';

export default function CaregiversScreen() {
  const _router = useRouter();
  const { settings, updateSettings } = useSettingsStore();
  const T = getTranslations(settings.language);
  const [caregivers, setCaregivers] = useState<CaregiverContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    notifyOnEmergency: true,
  });

  useEffect(() => {
    setCaregivers(settings.caregivers || []);
  }, [settings.caregivers]);

  const resetForm = () => {
    setForm({
      name: '',
      relationship: '',
      phone: '',
      email: '',
      notifyOnEmergency: true,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true;
    const digitsOnly = phone.replace(/[\s\-()+ ]/g, '');
    return digitsOnly.length >= 7 && digitsOnly.length <= 15 && /^\d+$/.test(digitsOnly);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert(T.common.error, T.caregivers.errorEnterName);
      return;
    }
    if (!form.relationship.trim()) {
      Alert.alert(T.common.error, T.caregivers.errorEnterRelationship);
      return;
    }
    
    if (form.email && !validateEmail(form.email)) {
      Alert.alert(T.common.error, T.caregivers.errorInvalidEmail ?? 'Please enter a valid email address');
      return;
    }
    
    if (form.phone && !validatePhone(form.phone)) {
      Alert.alert(T.common.error, T.caregivers.errorInvalidPhone ?? 'Please enter a valid phone number');
      return;
    }
    
    if (form.notifyOnEmergency && !form.phone && !form.email) {
      Alert.alert(T.common.error, T.caregivers.errorNoContactMethod ?? 'Please add at least a phone number or email for emergency contact');
      return;
    }

    if (editingId) {
      const updated = caregivers.map((c) =>
        c.id === editingId ? { ...c, ...form } : c
      );
      setCaregivers(updated);
      await updateSettings({ caregivers: updated });
    } else {
      const newCaregiver: CaregiverContact = {
        id: `caregiver_${generateId()}`,
        ...form,
      };
      const updated = [...caregivers, newCaregiver];
      setCaregivers(updated);
      await updateSettings({ caregivers: updated });
    }

    resetForm();
  };

  const handleEdit = (caregiver: CaregiverContact) => {
    setForm({
      name: caregiver.name,
      relationship: caregiver.relationship,
      phone: caregiver.phone || '',
      email: caregiver.email || '',
      notifyOnEmergency: caregiver.notifyOnEmergency,
    });
    setEditingId(caregiver.id);
    setIsAdding(true);
  };

  const handleDelete = (caregiver: CaregiverContact) => {
    Alert.alert(
      T.caregivers.removeCaregiver,
      T.caregivers.removeConfirm.replace('%s', caregiver.name),
      [
        { text: T.caregivers.cancel, style: 'cancel' },
        {
          text: T.caregivers.remove,
          style: 'destructive',
          onPress: async () => {
            const updated = caregivers.filter((c) => c.id !== caregiver.id);
            setCaregivers(updated);
            await updateSettings({ caregivers: updated });
          },
        },
      ]
    );
  };

  const renderForm = () => (
    <View style={styles.formCard}>
      <Text style={styles.formTitle}>
        {editingId ? T.caregivers.editCaregiver : T.caregivers.addCaregiver}
      </Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{T.caregivers.name} *</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(text) => setForm((f) => ({ ...f, name: text }))}
          placeholder={T.caregivers.namePlaceholder}
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{T.caregivers.relationship} *</Text>
        <TextInput
          style={styles.input}
          value={form.relationship}
          onChangeText={(text) => setForm((f) => ({ ...f, relationship: text }))}
          placeholder={T.caregivers.relationshipPlaceholder}
          placeholderTextColor={COLORS.textLight}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{T.caregivers.phone}</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(text) => setForm((f) => ({ ...f, phone: text }))}
          placeholder={T.caregivers.phonePlaceholder}
          placeholderTextColor={COLORS.textLight}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{T.caregivers.email}</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => setForm((f) => ({ ...f, email: text }))}
          placeholder={T.caregivers.emailPlaceholder}
          placeholderTextColor={COLORS.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.label}>{T.caregivers.emergencyAlerts}</Text>
          <Text style={styles.helpText}>{T.caregivers.emergencyAlertsDesc}</Text>
        </View>
        <Switch
          value={form.notifyOnEmergency}
          onValueChange={(value) =>
            setForm((f) => ({ ...f, notifyOnEmergency: value }))
          }
          trackColor={{ false: COLORS.border, true: COLORS.primary }}
        />
      </View>

      <View style={styles.formButtons}>
        <Pressable style={styles.cancelButton} onPress={resetForm}>
          <Text style={styles.cancelButtonText}>{T.caregivers.cancel}</Text>
        </Pressable>
        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {editingId ? T.caregivers.update : T.caregivers.add}
          </Text>
        </Pressable>
      </View>
    </View>
  );

  const renderCaregiverList = () => (
    <View style={styles.listSection}>
      {caregivers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👨‍👩‍👧</Text>
          <Text style={styles.emptyTitle}>{T.caregivers.noCaregivers}</Text>
          <Text style={styles.emptySubtitle}>
            {T.caregivers.noCaregiversHint}
          </Text>
        </View>
      ) : (
        caregivers.map((caregiver) => (
          <View key={caregiver.id} style={styles.caregiverCard}>
            <View style={styles.caregiverInfo}>
              <Text style={styles.caregiverName}>{caregiver.name}</Text>
              <Text style={styles.caregiverRelation}>{caregiver.relationship}</Text>
              {caregiver.phone && (
                <Text style={styles.caregiverContact}>📞 {caregiver.phone}</Text>
              )}
              {caregiver.email && (
                <Text style={styles.caregiverContact}>✉️ {caregiver.email}</Text>
              )}
              {caregiver.notifyOnEmergency && (
                <View style={styles.emergencyBadge}>
                  <Text style={styles.emergencyBadgeText}>🚨 {T.caregivers.emergencyAlerts}</Text>
                </View>
              )}
            </View>
            <View style={styles.caregiverActions}>
              <Pressable
                style={styles.editButton}
                onPress={() => handleEdit(caregiver)}
              >
                <Text style={styles.editButtonText}>✏️</Text>
              </Pressable>
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(caregiver)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScreenBackground>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
          {isAdding ? (
            renderForm()
          ) : (
            <>
              {renderCaregiverList()}
              <Pressable
                style={styles.addButton}
                onPress={() => setIsAdding(true)}
              >
                <Text style={styles.addButtonText}>+ {T.caregivers.addCaregiver}</Text>
              </Pressable>
            </>
          )}

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>ℹ️ {T.caregivers.aboutEmergencyAlerts}</Text>
              <Text style={styles.infoText}>
                {T.caregivers.emergencyAlertInfo}
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ScreenBackground>
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
  listSection: {
    marginBottom: SPACING.md,
  },
  caregiverCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: GLASS.border,
    ...SHADOWS.md,
  },
  caregiverInfo: {
    flex: 1,
  },
  caregiverName: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  caregiverRelation: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 2,
  },
  caregiverContact: {
    fontSize: 13,
    color: COLORS.text,
    marginTop: 4,
  },
  emergencyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.emergencyBackground,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    marginTop: SPACING.sm,
  },
  emergencyBadgeText: {
    fontSize: 11,
    color: COLORS.emergency,
    fontWeight: '600',
  },
  caregiverActions: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  editButton: {
    padding: SPACING.sm,
  },
  editButtonText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: SPACING.sm,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
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
    paddingHorizontal: SPACING.lg,
  },
  addButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.sm,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: GLASS.border,
    ...SHADOWS.md,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  input: {
    borderWidth: 1,
    borderColor: GLASS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.inputSurface,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  formButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  cancelButtonText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 15,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GLASS.highlight,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  infoCard: {
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: GLASS.border,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
});
