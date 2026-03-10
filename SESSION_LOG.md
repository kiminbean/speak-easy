# SpeakEasy Session Log

Last updated: 2026-03-10

## Current Snapshot

SpeakEasy is currently maintained as an offline-first AAC mobile app under `mobile/`.

Current facts:
- App version: `1.1.0`
- Active UI style: `v2-liquid-glass`
- Legacy style retained in code: `v1-classic`
- Native AI path: supported native/dev builds when `react-native-executorch` is available
- Fallback AI path: rule-based mode in Expo Go and unsupported environments

## Recent Project Changes Reflected in the Repo

### UI and design system
- introduced a versioned theme system in `mobile/src/constants/index.ts`
- activated `v2-liquid-glass`
- added shared glass background support with `mobile/src/components/ScreenBackground.tsx`
- refreshed major screens and shared components to use the new visual language

### Prediction and runtime behavior
- improved context-aware prediction behavior across location, time, and weather
- clarified AI mode labels in the UI to distinguish native AI from fallback mode
- updated notification handler behavior for newer Expo notifications APIs
- added simulator-safe TTS fallback handling for iOS simulator voice enumeration issues

### Verification used during recent maintenance
- `npm run lint`
- `npm test -- --runInBand`
- `npx tsc --noEmit`
- `npx expo export --platform ios --output-dir dist-export`
- iOS simulator smoke testing via `xcrun simctl` and Metro session logs

## Current Code Layout

```text
mobile/src/
├── app/          # Expo Router screens
├── components/   # UI building blocks
├── constants/    # versioned theme tokens and phrase metadata
├── i18n/         # UI translations and phrase sources
├── services/     # prediction, LLM, TTS, notifications, storage, context
├── stores/       # Zustand stores
├── types/        # shared TypeScript types
├── utils/        # hashing and RTL helpers
└── __tests__/    # Jest suites
```

## Historical Note

Older documents in this repository previously described AWS competition or web/PWA-era ideas. The current product implementation in this repository is the mobile app under `mobile/`, and current docs should be interpreted from that source of truth first.
