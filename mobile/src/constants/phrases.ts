/**
 * SpeakEasy - Fallback Phrases
 * Rule-based phrase predictions for offline use
 */

import { Phrase, TimeOfDay, LocationType, EmotionType } from '../types';

// Helper to create phrase objects
const createPhrase = (
  text: string,
  category: Phrase['category'],
  emoji?: string,
  isEmergency = false
): Phrase => ({
  id: `phrase_${text.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z_]/g, '')}`,
  text,
  category,
  emoji,
  isEmergency,
  usageCount: 0,
});

// ============================================
// Location + Time Based Phrases
// ============================================

export const FALLBACK_PHRASES: Record<LocationType, Record<TimeOfDay, Phrase[]>> = {
  home: {
    morning: [
      createPhrase('Good morning', 'greeting', '🌅'),
      createPhrase("I'm hungry", 'need', '🍽️'),
      createPhrase('I want breakfast', 'want', '🥣'),
      createPhrase('Can I watch TV?', 'question', '📺'),
      createPhrase('I need to use the bathroom', 'need', '🚽'),
      createPhrase("I'm thirsty", 'need', '🥤'),
    ],
    afternoon: [
      createPhrase("I'm thirsty", 'need', '🥤'),
      createPhrase('Can I play?', 'question', '🎮'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase("I'm tired", 'feeling', '😴'),
      createPhrase('I want a snack', 'want', '🍎'),
      createPhrase('Can we go outside?', 'question', '🌳'),
    ],
    evening: [
      createPhrase("What's for dinner?", 'question', '🍽️'),
      createPhrase('I want to play', 'want', '🎲'),
      createPhrase("I'm bored", 'feeling', '😑'),
      createPhrase('Can we read a book?', 'question', '📚'),
      createPhrase("I'm hungry", 'need', '🍽️'),
      createPhrase('Can I have dessert?', 'question', '🍰'),
    ],
    night: [
      createPhrase("I'm sleepy", 'feeling', '😴'),
      createPhrase('Good night', 'greeting', '🌙'),
      createPhrase('I need water', 'need', '💧'),
      createPhrase("I can't sleep", 'feeling', '😫'),
      createPhrase('Can you stay with me?', 'question', '🤗'),
      createPhrase('I had a bad dream', 'feeling', '😰'),
    ],
  },
  school: {
    morning: [
      createPhrase('Good morning teacher', 'greeting', '👋'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase('Can I go to the bathroom?', 'question', '🚽'),
      createPhrase("I don't understand", 'response', '❓'),
      createPhrase("I'm ready to learn", 'response', '📖'),
      createPhrase('Present!', 'response', '✋'),
    ],
    afternoon: [
      createPhrase("I'm hungry", 'need', '🍽️'),
      createPhrase('Can I have a break?', 'question', '⏸️'),
      createPhrase('I finished my work', 'response', '✅'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase('Can I get water?', 'question', '💧'),
      createPhrase('I need to rest', 'need', '😴'),
    ],
    evening: [
      createPhrase('Can I go home?', 'question', '🏠'),
      createPhrase("I'm tired", 'feeling', '😴'),
      createPhrase('Is it time to leave?', 'question', '⏰'),
      createPhrase('Thank you teacher', 'social', '🙏'),
      createPhrase('See you tomorrow', 'greeting', '👋'),
      createPhrase('Goodbye', 'greeting', '👋'),
    ],
    night: [
      createPhrase('Good night', 'greeting', '🌙'),
      createPhrase('See you tomorrow', 'greeting', '👋'),
      createPhrase('Thank you', 'social', '🙏'),
      createPhrase('Goodbye', 'greeting', '👋'),
      createPhrase("I'm going home", 'response', '🏠'),
      createPhrase('Have a good night', 'greeting', '🌙'),
    ],
  },
  hospital: {
    morning: [
      createPhrase('Good morning doctor', 'greeting', '👨‍⚕️'),
      createPhrase('I feel sick', 'feeling', '🤒'),
      createPhrase('It hurts here', 'need', '😣'),
      createPhrase("I'm scared", 'feeling', '😨'),
      createPhrase('I need medicine', 'need', '💊'),
      createPhrase('Can I see my family?', 'question', '👨‍👩‍👧'),
    ],
    afternoon: [
      createPhrase('I need medicine', 'need', '💊'),
      createPhrase('I feel better', 'feeling', '😊'),
      createPhrase('Can I go home?', 'question', '🏠'),
      createPhrase("I'm thirsty", 'need', '🥤'),
      createPhrase('It still hurts', 'feeling', '😣'),
      createPhrase('I need to rest', 'need', '😴'),
    ],
    evening: [
      createPhrase('When can I leave?', 'question', '⏰'),
      createPhrase('I want to see my family', 'want', '👨‍👩‍👧'),
      createPhrase("I'm tired", 'feeling', '😴'),
      createPhrase('It hurts', 'feeling', '😣'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase("I'm feeling better", 'feeling', '😊'),
    ],
    night: [
      createPhrase("I can't sleep", 'feeling', '😫'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase("I'm in pain", 'feeling', '😣'),
      createPhrase('I want my mom', 'want', '👩'),
      createPhrase("I'm scared", 'feeling', '😨'),
      createPhrase('Can someone stay with me?', 'question', '🤗'),
    ],
  },
  outdoor: {
    morning: [
      createPhrase("It's nice outside", 'response', '☀️'),
      createPhrase('I want to play', 'want', '🎾'),
      createPhrase("I'm hot", 'feeling', '🥵'),
      createPhrase('I need water', 'need', '💧'),
      createPhrase('Can we explore?', 'question', '🧭'),
      createPhrase('Look at that!', 'social', '👀'),
    ],
    afternoon: [
      createPhrase("I'm tired", 'feeling', '😴'),
      createPhrase("I'm hungry", 'need', '🍽️'),
      createPhrase('Can we go home?', 'question', '🏠'),
      createPhrase("It's too hot", 'feeling', '🥵'),
      createPhrase('I need shade', 'need', '🌳'),
      createPhrase('I want to rest', 'want', '😴'),
    ],
    evening: [
      createPhrase("It's getting dark", 'response', '🌅'),
      createPhrase('Can we go home?', 'question', '🏠'),
      createPhrase("I'm cold", 'feeling', '🥶'),
      createPhrase("I'm tired", 'feeling', '😴'),
      createPhrase('That was fun!', 'response', '😄'),
      createPhrase('I want to come back', 'want', '🔄'),
    ],
    night: [
      createPhrase('Look at the stars', 'social', '⭐'),
      createPhrase("I'm cold", 'feeling', '🥶'),
      createPhrase('Can we go inside?', 'question', '🏠'),
      createPhrase("I'm tired", 'feeling', '😴'),
      createPhrase("It's dark", 'response', '🌙'),
      createPhrase('I want to go home', 'want', '🏠'),
    ],
  },
  restaurant: {
    morning: [
      createPhrase("I'm hungry", 'need', '🍽️'),
      createPhrase('Can I see the menu?', 'question', '📋'),
      createPhrase('I want pancakes', 'want', '🥞'),
      createPhrase('I need water', 'need', '💧'),
      createPhrase('Thank you', 'social', '🙏'),
      createPhrase('This looks good', 'response', '😋'),
    ],
    afternoon: [
      createPhrase("I'm hungry", 'need', '🍽️'),
      createPhrase('I want this', 'want', '👆'),
      createPhrase('Can I have more?', 'question', '🍽️'),
      createPhrase('I need to use the bathroom', 'need', '🚽'),
      createPhrase('This is delicious', 'response', '😋'),
      createPhrase("I'm full", 'feeling', '😊'),
    ],
    evening: [
      createPhrase("I'm hungry", 'need', '🍽️'),
      createPhrase('What do you recommend?', 'question', '🤔'),
      createPhrase('I want dessert', 'want', '🍰'),
      createPhrase('Can I have the check?', 'question', '💳'),
      createPhrase('Thank you for dinner', 'social', '🙏'),
      createPhrase('That was good', 'response', '😊'),
    ],
    night: [
      createPhrase("I'm tired", 'feeling', '😴'),
      createPhrase('Can we go home?', 'question', '🏠'),
      createPhrase('Thank you', 'social', '🙏'),
      createPhrase('Goodbye', 'greeting', '👋'),
      createPhrase("I'm full", 'feeling', '😊'),
      createPhrase('That was nice', 'response', '😊'),
    ],
  },
  unknown: {
    morning: [
      createPhrase('Good morning', 'greeting', '🌅'),
      createPhrase('Hello', 'greeting', '👋'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase("I'm okay", 'response', '👍'),
      createPhrase('Thank you', 'social', '🙏'),
      createPhrase('Where am I?', 'question', '📍'),
    ],
    afternoon: [
      createPhrase('Hello', 'greeting', '👋'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase("I'm okay", 'response', '👍'),
      createPhrase('Thank you', 'social', '🙏'),
      createPhrase("I'm lost", 'need', '📍'),
      createPhrase('Can you help me?', 'question', '🆘'),
    ],
    evening: [
      createPhrase('Hello', 'greeting', '👋'),
      createPhrase('Good evening', 'greeting', '🌆'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase("I'm okay", 'response', '👍'),
      createPhrase('Thank you', 'social', '🙏'),
      createPhrase('I want to go home', 'want', '🏠'),
    ],
    night: [
      createPhrase('Hello', 'greeting', '👋'),
      createPhrase('Good night', 'greeting', '🌙'),
      createPhrase('I need help', 'need', '🆘'),
      createPhrase("I'm okay", 'response', '👍'),
      createPhrase('Thank you', 'social', '🙏'),
      createPhrase('I want to go home', 'want', '🏠'),
    ],
  },
};

// ============================================
// Emotion-Based Additional Phrases
// ============================================

export const EMOTION_PHRASES: Record<EmotionType, Phrase[]> = {
  happy: [
    createPhrase("I'm happy!", 'feeling', '😊'),
    createPhrase('This is fun!', 'feeling', '🎉'),
    createPhrase('I love this!', 'feeling', '❤️'),
    createPhrase('Thank you!', 'social', '🙏'),
  ],
  sad: [
    createPhrase("I'm sad", 'feeling', '😢'),
    createPhrase("I don't feel good", 'feeling', '😞'),
    createPhrase('I need a hug', 'need', '🤗'),
    createPhrase('Can you help me?', 'question', '🆘'),
  ],
  anxious: [
    createPhrase("I'm worried", 'feeling', '😰'),
    createPhrase('I feel nervous', 'feeling', '😟'),
    createPhrase('Can you stay with me?', 'question', '🤗'),
    createPhrase('I need a break', 'need', '⏸️'),
  ],
  frustrated: [
    createPhrase("I'm frustrated", 'feeling', '😤'),
    createPhrase('This is hard', 'feeling', '😣'),
    createPhrase("I don't like this", 'feeling', '👎'),
    createPhrase('I need help now', 'need', '🆘'),
  ],
  scared: [
    createPhrase("I'm scared", 'feeling', '😨'),
    createPhrase("I don't feel safe", 'feeling', '😰'),
    createPhrase('Help me please', 'need', '🆘'),
    createPhrase('Something is wrong', 'need', '⚠️'),
  ],
  calm: [
    createPhrase("I'm okay", 'feeling', '😌'),
    createPhrase('I feel good', 'feeling', '😊'),
    createPhrase('Everything is fine', 'response', '👍'),
    createPhrase("I'm ready", 'response', '✅'),
  ],
  excited: [
    createPhrase("I'm so excited!", 'feeling', '🤩'),
    createPhrase("I can't wait!", 'feeling', '🎉'),
    createPhrase('This is amazing!', 'feeling', '✨'),
    createPhrase("Let's go!", 'response', '🚀'),
  ],
  tired: [
    createPhrase("I'm tired", 'feeling', '😴'),
    createPhrase('I need rest', 'need', '🛏️'),
    createPhrase('Can I take a nap?', 'question', '😴'),
    createPhrase("I'm sleepy", 'feeling', '💤'),
  ],
  unknown: [],
};

// ============================================
// Emergency Phrases (Always Available)
// ============================================

export const EMERGENCY_PHRASES: Phrase[] = [
  createPhrase('Help me!', 'emergency', '🆘', true),
  createPhrase('I need help now!', 'emergency', '🚨', true),
  createPhrase('Call my parent', 'emergency', '📞', true),
  createPhrase("I don't feel safe", 'emergency', '⚠️', true),
  createPhrase('Something is wrong', 'emergency', '❗', true),
  createPhrase('Emergency!', 'emergency', '🚨', true),
  createPhrase("I'm in danger", 'emergency', '🆘', true),
  createPhrase('Please help', 'emergency', '🙏', true),
];

// ============================================
// Quick Response Phrases
// ============================================

export const QUICK_RESPONSES: Phrase[] = [
  createPhrase('Yes', 'response', '✅'),
  createPhrase('No', 'response', '❌'),
  createPhrase('Maybe', 'response', '🤔'),
  createPhrase('I don\'t know', 'response', '❓'),
  createPhrase('Please', 'social', '🙏'),
  createPhrase('Thank you', 'social', '🙏'),
  createPhrase('Sorry', 'social', '😔'),
  createPhrase("You're welcome", 'social', '😊'),
];
