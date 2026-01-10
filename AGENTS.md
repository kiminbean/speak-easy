# AGENTS.md - SpeakEasy

> AI-Powered AAC App | React Native + Expo SDK 54 | TypeScript | Zustand | Reanimated v4

## Commands

```bash
cd mobile
npm install && npm start          # Dev server (i=iOS, a=Android)
npm run lint                      # ESLint check
npm test                          # Run all tests
npm test -- src/__tests__/rtl.test.ts     # Run single test file
npm test -- -t "should detect RTL"        # Run tests matching pattern
npm run prebuild:clean && npm run run:ios # Native build (required for LLM)
```

## Golden Rules

**Immutable**:
- NO cloud dependencies - 100% offline operation
- NO data leaves device - privacy first
- NO type coercion (`as any`, `@ts-ignore`, `@ts-expect-error`)
- WCAG 2.1 AA compliance - touch targets 48dp+, high contrast

**Do**:
- Path alias `@/*` for `src/` imports
- Singleton pattern for services
- `react-native-reanimated` for all animations
- `react-native-gesture-handler` for interactions
- Constants from `@/constants` (COLORS, SPACING, ANIMATION)
- Accessibility props on all interactive elements
- Mock native modules in `jest.setup.js`

**Don't**:
- Import RN modules directly in services (breaks tests)
- Inline styles - use `StyleSheet.create`
- Hardcode text - use `@/i18n`
- Skip haptic feedback on interactions

## Code Patterns

### Imports Order
```typescript
// 1. React/RN
import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// 2. Reanimated & Gesture Handler
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
// 3. Expo
import * as Haptics from 'expo-haptics';
// 4. Internal (@/*)
import { Phrase } from '@/types';
import { COLORS, ANIMATION } from '@/constants';
import { TTSService } from '@/services';
```

### Components (with Animations)
```typescript
export const PhraseCard = memo(function PhraseCard({ phrase, onPress }: Props) {
  const scale = useSharedValue(1);
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const tap = Gesture.Tap()
    .onBegin(() => { scale.value = withSpring(0.95, ANIMATION.spring); })
    .onFinalize(() => { scale.value = withSpring(1, ANIMATION.spring); })
    .onEnd(() => { runOnJS(onPress)(phrase); });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[styles.card, animatedStyle]} accessibilityRole="button">
        <Text>{phrase.text}</Text>
      </Animated.View>
    </GestureDetector>
  );
});
```

### Services (Singleton)
```typescript
class TTSServiceClass {
  private isInitialized = false;
  
  async speak(text: string): Promise<void> {
    if (!this.isInitialized) await this.initialize();
    // implementation
  }
}
export const TTSService = new TTSServiceClass();
```

### Zustand Stores
```typescript
export const useStore = create<State>((set, get) => ({
  data: DEFAULT,
  isLoading: false,
  loadData: async () => {
    set({ isLoading: true });
    const data = await StorageService.getData();
    set({ data, isLoading: false });
  },
}));
```

### Naming Conventions
- **Components**: `PascalCase` (PhraseCard, EmotionSelector)
- **Functions/Variables**: `camelCase` (handlePress, isLoading)
- **Constants**: `UPPER_SNAKE_CASE` (COLORS, ANIMATION)
- **Types/Interfaces**: `PascalCase` (Phrase, EmotionType)

## Testing

**Location**: `mobile/src/__tests__/*.test.ts`

```typescript
import { StorageService } from '@/services';

beforeEach(() => jest.clearAllMocks());

describe('StorageService', () => {
  it('should save and retrieve data', async () => {
    await StorageService.save('key', { value: 1 });
    const result = await StorageService.get('key');
    expect(result).toEqual({ value: 1 });
  });
});
```

**Mocks**: Native modules are mocked in `jest.setup.js` including:
- `react-native-reanimated`
- `react-native-gesture-handler`
- `expo-speech`, `expo-haptics`, `expo-notifications`

## Structure

```
mobile/src/
├── app/          # Expo Router pages (index, settings, favorites)
├── components/   # PhraseCard, PhraseGrid, EmotionSelector, EmergencyButton
├── services/     # Prediction, Emotion, TTS, Storage, LLM, Context
├── stores/       # Zustand: prediction, emotion, settings
├── constants/    # COLORS, SPACING, ANIMATION, SHADOWS, phrases
├── types/        # All TypeScript interfaces
├── i18n/         # 20 languages, RTL support
├── utils/        # hash, rtl helpers
└── __tests__/    # Jest tests
```

## RTL Support

```typescript
import { isRTLLanguage, getWritingDirection } from '@/utils/rtl';
const isRTL = isRTLLanguage(settings.language);
// Apply: style={[styles.row, isRTL && styles.rowReverse]}
```

## Error Handling

```typescript
try {
  return await service.method();
} catch (error) {
  console.error('[ServiceName] Failed:', error);
  return fallbackValue;  // Always provide fallback, never crash
}
```

## Adding Features

1. Types → `src/types/index.ts`
2. Service → `src/services/`
3. Store → `src/stores/`
4. Component → `src/components/` (with Reanimated animations)
5. i18n → `src/i18n/phrases.ts` (all 20 languages)
6. Tests → `src/__tests__/`
7. Verify → `npm run lint && npm test`
