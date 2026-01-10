/**
 * SpeakEasy - Notification Service
 * Local push notifications for caregiver alerts
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as SMS from 'expo-sms';
import * as Linking from 'expo-linking';
import { Platform, Alert } from 'react-native';
import { EmotionState, CaregiverContact, EmergencyAlert } from '../types';
import { EMOTIONS } from '../constants';
import { StorageService } from './StorageService';
import { generateId } from '../utils/hash';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationServiceClass {
  private expoPushToken: string | null = null;

  /**
   * Initialize notification service
   */
  async initialize(): Promise<void> {
    // Request permissions
    await this.requestPermissions();

    // Configure notification channels (Android)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('emergency', {
        name: 'Emergency Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 250, 500],
        lightColor: '#FF0000',
        sound: 'default',
      });

      await Notifications.setNotificationChannelAsync('caregiver', {
        name: 'Caregiver Notifications',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      });
    }

    if (__DEV__) console.log('NotificationService initialized');
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
      if (__DEV__) console.log('Notifications require a physical device');
      return false;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        if (__DEV__) console.log('Notification permissions not granted');
        return false;
      }

      return true;
    } catch (error) {
      if (__DEV__) console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Send emergency alert to caregivers
   */
  async sendEmergencyAlert(
    emotion: EmotionState,
    phrase?: string
  ): Promise<void> {
    const emotionInfo = EMOTIONS[emotion.emotion];
    const settings = await StorageService.getSettings();

    // Create alert record
    const alert: EmergencyAlert = {
      id: generateId(),
      timestamp: Date.now(),
      emotion: emotion.emotion,
      intensity: emotion.intensity,
      phrase,
    };

    // Send local notification
    await this.sendLocalNotification({
      title: '🚨 SpeakEasy Alert',
      body: `${settings.name || 'User'} needs attention. Emotion: ${emotionInfo.emoji} ${emotionInfo.label} (${emotion.intensity})${phrase ? `. Said: "${phrase}"` : ''}`,
      data: { type: 'emergency', alert },
      channelId: 'emergency',
      priority: 'max',
    });

    if (__DEV__) {
      console.log('Emergency alert sent:', alert.id);
    }
  }

  async sendPhraseAlert(phrase: string): Promise<void> {
    const settings = await StorageService.getSettings();

    await this.sendLocalNotification({
      title: '⚠️ SpeakEasy: Help Requested',
      body: `${settings.name || 'User'} said: "${phrase}"`,
      data: { type: 'phrase_alert', phrase },
      channelId: 'emergency',
      priority: 'high',
    });

    const caregiversWithPhone = settings.caregivers.filter(
      (c) => c.notifyOnEmergency && c.phone
    );
    
    if (caregiversWithPhone.length > 0) {
      await this.sendSMSToCaregiversSilent(
        caregiversWithPhone,
        `🚨 SpeakEasy Emergency\n\n${settings.name || 'User'} said: "${phrase}"\n\nPlease check on them.`
      );
    }
  }

  async sendSMSToCaregiversSilent(
    caregivers: CaregiverContact[],
    message: string
  ): Promise<{ success: boolean; sentCount: number }> {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      if (__DEV__) console.log('SMS not available on this device');
      return { success: false, sentCount: 0 };
    }

    const phoneNumbers = caregivers
      .filter((c) => c.phone)
      .map((c) => c.phone!)
      .filter((phone) => phone.length > 0);

    if (phoneNumbers.length === 0) {
      return { success: false, sentCount: 0 };
    }

    try {
      const { result } = await SMS.sendSMSAsync(phoneNumbers, message);
      return { 
        success: result === 'sent' || result === 'unknown',
        sentCount: phoneNumbers.length 
      };
    } catch (error) {
      if (__DEV__) console.error('Error sending SMS:', error);
      return { success: false, sentCount: 0 };
    }
  }

  async callCaregiver(phone: string): Promise<boolean> {
    const phoneUrl = Platform.select({
      ios: `tel:${phone}`,
      android: `tel:${phone}`,
    });

    if (!phoneUrl) return false;

    const canOpen = await Linking.canOpenURL(phoneUrl);
    if (canOpen) {
      await Linking.openURL(phoneUrl);
      return true;
    }
    return false;
  }

  async showEmergencyContactOptions(caregivers: CaregiverContact[]): Promise<void> {
    const caregiversWithPhone = caregivers.filter((c) => c.phone);
    
    if (caregiversWithPhone.length === 0) {
      Alert.alert(
        'No Contacts',
        'No caregivers with phone numbers are set up. Please add caregiver contacts in Settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (caregiversWithPhone.length === 1) {
      const caregiver = caregiversWithPhone[0];
      Alert.alert(
        `Call ${caregiver.name}?`,
        `${caregiver.relationship}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: `Call ${caregiver.phone}`, 
            onPress: () => this.callCaregiver(caregiver.phone!) 
          },
        ]
      );
      return;
    }

    const buttons = caregiversWithPhone.slice(0, 3).map((caregiver) => ({
      text: `${caregiver.name} (${caregiver.relationship})`,
      onPress: () => this.callCaregiver(caregiver.phone!),
    }));
    buttons.push({ text: 'Cancel', onPress: () => {} });

    Alert.alert('Call Caregiver', 'Select who to call:', buttons as any);
  }

  /**
   * Send caregiver update notification
   */
  async sendCaregiverUpdate(message: string): Promise<void> {
    await this.sendLocalNotification({
      title: '📱 SpeakEasy Update',
      body: message,
      data: { type: 'update' },
      channelId: 'caregiver',
      priority: 'default',
    });
  }

  /**
   * Send local notification
   */
  async sendLocalNotification(options: {
    title: string;
    body: string;
    data?: Record<string, any>;
    channelId?: string;
    priority?: 'default' | 'high' | 'max';
  }): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: options.title,
          body: options.body,
          data: options.data,
          sound: true,
          priority:
            options.priority === 'max'
              ? Notifications.AndroidNotificationPriority.MAX
              : options.priority === 'high'
              ? Notifications.AndroidNotificationPriority.HIGH
              : Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: null, // Send immediately
      });

      return notificationId;
    } catch (error) {
      if (__DEV__) console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Set up notification response listener
   */
  setupNotificationListeners(
    onNotificationReceived?: (notification: Notifications.Notification) => void,
    onNotificationResponse?: (response: Notifications.NotificationResponse) => void
  ): () => void {
    const receivedSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        if (__DEV__) {
          console.log('Notification received:', notification.request.identifier);
        }
        onNotificationReceived?.(notification);
      }
    );

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        if (__DEV__) {
          console.log('Notification response:', response.notification.request.identifier);
        }
        onNotificationResponse?.(response);
      }
    );

    // Return cleanup function
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }

  /**
   * Get pending notifications
   */
  async getPendingNotifications(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
  }

  /**
   * Get notification badge count
   */
  async getBadgeCount(): Promise<number> {
    return Notifications.getBadgeCountAsync();
  }

  /**
   * Set notification badge count
   */
  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }
}

export const NotificationService = new NotificationServiceClass();
export default NotificationService;
