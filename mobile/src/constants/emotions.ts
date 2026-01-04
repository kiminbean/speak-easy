/**
 * SpeakEasy - Emotion Constants
 * Emotion definitions and coping phrases
 */

import { EmotionType } from '../types';

export interface EmotionInfo {
  id: EmotionType;
  label: string;
  labelKo: string;
  emoji: string;
  color: string;
  copingPhrases: string[];
  copingPhrasesKo: string[];
  isAlertTrigger: boolean;
}

export const EMOTIONS: Record<EmotionType, EmotionInfo> = {
  happy: {
    id: 'happy',
    label: 'Happy',
    labelKo: '행복해요',
    emoji: '😊',
    color: '#FFD700',
    copingPhrases: [
      "I'm happy!",
      'This is fun!',
      'I love this!',
      'Thank you!',
      "I'm having a great time!",
    ],
    copingPhrasesKo: [
      '행복해요!',
      '재미있어요!',
      '좋아요!',
      '감사해요!',
      '즐거워요!',
    ],
    isAlertTrigger: false,
  },
  sad: {
    id: 'sad',
    label: 'Sad',
    labelKo: '슬퍼요',
    emoji: '😢',
    color: '#6B8E9B',
    copingPhrases: [
      'I feel sad',
      'I need a hug',
      'Can we talk?',
      'I miss someone',
      'I need comfort',
    ],
    copingPhrasesKo: [
      '슬퍼요',
      '안아주세요',
      '얘기하고 싶어요',
      '보고 싶어요',
      '위로해주세요',
    ],
    isAlertTrigger: false,
  },
  anxious: {
    id: 'anxious',
    label: 'Anxious',
    labelKo: '불안해요',
    emoji: '😰',
    color: '#9B59B6',
    copingPhrases: [
      'I feel worried',
      'Can you stay with me?',
      'I need comfort',
      "Tell me it's okay",
      'I need a quiet place',
    ],
    copingPhrasesKo: [
      '걱정돼요',
      '같이 있어주세요',
      '위로해주세요',
      '괜찮다고 말해주세요',
      '조용한 곳이 필요해요',
    ],
    isAlertTrigger: true,
  },
  frustrated: {
    id: 'frustrated',
    label: 'Frustrated',
    labelKo: '답답해요',
    emoji: '😤',
    color: '#E74C3C',
    copingPhrases: [
      'I need a break',
      'This is hard for me',
      'Can you help me?',
      "I'm trying my best",
      'Let me try again',
    ],
    copingPhrasesKo: [
      '쉬고 싶어요',
      '이거 어려워요',
      '도와주세요',
      '노력하고 있어요',
      '다시 해볼게요',
    ],
    isAlertTrigger: true,
  },
  scared: {
    id: 'scared',
    label: 'Scared',
    labelKo: '무서워요',
    emoji: '😨',
    color: '#8E44AD',
    copingPhrases: [
      "I'm scared",
      "I don't feel safe",
      'Stay with me please',
      'I need help',
      'Something is wrong',
    ],
    copingPhrasesKo: [
      '무서워요',
      '불안해요',
      '같이 있어주세요',
      '도와주세요',
      '뭔가 이상해요',
    ],
    isAlertTrigger: true,
  },
  calm: {
    id: 'calm',
    label: 'Calm',
    labelKo: '편안해요',
    emoji: '😌',
    color: '#3498DB',
    copingPhrases: [
      "I'm okay",
      'I feel good',
      'Everything is fine',
      "I'm ready",
      'I feel peaceful',
    ],
    copingPhrasesKo: [
      '괜찮아요',
      '기분 좋아요',
      '다 괜찮아요',
      '준비됐어요',
      '평화로워요',
    ],
    isAlertTrigger: false,
  },
  excited: {
    id: 'excited',
    label: 'Excited',
    labelKo: '신나요',
    emoji: '🤩',
    color: '#F39C12',
    copingPhrases: [
      "I'm so excited!",
      "I can't wait!",
      'This is amazing!',
      "Let's go!",
      "I'm ready!",
    ],
    copingPhrasesKo: [
      '너무 신나요!',
      '기다릴 수 없어요!',
      '대단해요!',
      '가요!',
      '준비됐어요!',
    ],
    isAlertTrigger: false,
  },
  tired: {
    id: 'tired',
    label: 'Tired',
    labelKo: '피곤해요',
    emoji: '😴',
    color: '#95A5A6',
    copingPhrases: [
      "I'm tired",
      'I need rest',
      'Can I take a nap?',
      "I'm sleepy",
      'I need a break',
    ],
    copingPhrasesKo: [
      '피곤해요',
      '쉬고 싶어요',
      '낮잠 자도 될까요?',
      '졸려요',
      '휴식이 필요해요',
    ],
    isAlertTrigger: false,
  },
  unknown: {
    id: 'unknown',
    label: 'Unknown',
    labelKo: '모르겠어요',
    emoji: '😐',
    color: '#BDC3C7',
    copingPhrases: [],
    copingPhrasesKo: [],
    isAlertTrigger: false,
  },
};

// Phrase keywords that indicate specific emotions
export const PHRASE_SENTIMENT_MAP: Record<EmotionType, string[]> = {
  happy: ['happy', 'fun', 'love', 'yay', 'excited', 'great', 'awesome'],
  sad: ['sad', 'miss', 'lonely', 'cry', 'hurt', 'sorry'],
  anxious: ['worried', 'nervous', 'scared', 'afraid', 'panic'],
  frustrated: ["can't", 'hard', 'difficult', 'angry', 'stop', 'no'],
  tired: ['tired', 'sleepy', 'exhausted', 'rest', 'nap'],
  scared: ['scared', 'afraid', 'fear', 'help', 'danger'],
  calm: ['okay', 'fine', 'good', 'peaceful', 'relaxed'],
  excited: ['excited', 'wow', 'amazing', 'awesome', 'yay'],
  unknown: [],
};

export const ALERT_EMOTIONS: EmotionType[] = ['scared', 'frustrated', 'anxious'];
