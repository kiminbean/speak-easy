# AGENTS.md - SpeakEasy

> Offline-first AAC mobile app | React Native 0.81 | Expo SDK 54 | TypeScript | Zustand | Reanimated 4

## Project Summary

SpeakEasy is a mobile AAC app for non-verbal users. The current app includes context-aware suggested phrases, custom phrases, favorites, phrase history, caregiver alerts, multilingual UI, and text-to-speech. The app is designed to work without a cloud backend.

Current release facts:
- App version: `1.1.0`
- Active UI style: `v2-liquid-glass`
- Native AI path: `react-native-executorch` when available in native/dev builds
- Fallback AI path: rule-based predictions in Expo Go and unsupported environments

## Commands

```bash
cd mobile
npm install
npm start
npm run ios
npm run android
npm run lint
npm test
npm test -- --runInBand
npm test -- src/__tests__/rtl.test.ts
npx tsc --noEmit
npm run prebuild:clean
npm run run:ios
npm run build:dev
npm run build:ios
npm run build:android
npx expo export --platform ios --output-dir dist-export
```

## Golden Rules

Immutable:
- No cloud dependency is required for core communication.
- No user data leaves the device.
- Do not use `as any`, `@ts-ignore`, or `@ts-expect-error`.
- Keep WCAG 2.1 AA accessibility goals in mind.

Do:
- Use `@/*` imports for `src/` paths where configured.
- Keep services as singletons.
- Use `react-native-reanimated` and `react-native-gesture-handler` for interactive motion.
- Centralize design values in `mobile/src/constants/index.ts`.
- Add accessibility roles/labels to interactive elements.
- Keep UI strings in `mobile/src/i18n/index.ts` or phrase data in `mobile/src/i18n/phrases.ts`.

Do not:
- Hardcode new UI copy in screens or components.
- Scatter visual tokens across screens when a shared constant should be used.
- Break fallback behavior when native AI or simulator-only APIs are unavailable.

## Architecture

```text
mobile/src/
├── app/          # Expo Router screens and flows
├── components/   # Reusable UI pieces
├── constants/    # Theme tokens, spacing, phrase metadata
├── i18n/         # UI translations and phrase sources
├── services/     # LLM, prediction, TTS, notifications, context, storage
├── stores/       # Zustand app state
├── types/        # Shared TypeScript models
├── utils/        # Hashing, RTL helpers, small utilities
└── __tests__/    # Jest test suites
```

Important runtime files:
- `mobile/src/app/index.tsx` - primary phrase suggestion screen
- `mobile/src/app/settings.tsx` - language, voice, AI mode, saved locations
- `mobile/src/services/PredictionService.ts` - rule-based phrase generation
- `mobile/src/services/LLMService.ts` - native vs fallback AI mode
- `mobile/src/services/TTSService.ts` - speech output handling
- `mobile/src/services/NotificationService.ts` - caregiver alerts and local notifications
- `mobile/src/constants/index.ts` - theme tokens and app version constants

## UI and Theme Notes

The app uses the `v2-liquid-glass` design system exclusively.

- All visual tokens are exported from `mobile/src/constants/index.ts`
- Shared glass-style surfaces are built from constants plus `ScreenBackground`

## AI Runtime Notes

There are two real runtime modes:

1. Native AI mode
- available only when the native executorch module loads successfully
- shown in the UI as On-Device AI

2. Rule-based fallback mode
- used in Expo Go and unsupported environments
- still uses context-aware prediction logic
- shown in the UI as Rule-based Mode

Do not describe fallback mode as native AI in docs or UI.

## Testing

Primary test files live in `mobile/src/__tests__/`.

Useful checks:

```bash
cd mobile
npm test -- --runInBand
npm test -- src/__tests__/prediction.test.ts --runInBand
npm test -- src/__tests__/llm.test.ts --runInBand
npm test -- src/__tests__/tts.test.ts --runInBand
npx tsc --noEmit
npm run lint
```

## Documentation Maintenance

When features change, keep these files aligned:
- `README.md`
- `mobile/README.md`
- `mobile/STORE_SUBMISSION_GUIDE.md`
- `PRIVACY_POLICY.md`
- `DEMO_GUIDE.md`
- `SESSION_LOG.md`

When in doubt, document the current observed behavior, not the intended future behavior.
