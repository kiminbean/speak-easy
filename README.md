# SpeakEasy

SpeakEasy is an offline-first AAC (Augmentative and Alternative Communication) mobile app built with React Native, Expo SDK 54, and TypeScript. It helps non-verbal users communicate with context-aware suggested phrases, text-to-speech output, caregiver alerts, and customizable vocabulary while keeping all user data on device.

## Current Status

- App version: `1.1.0`
- Active UI style: `v2-liquid-glass`
- Platforms: iOS and Android
- Runtime modes:
  - Native AI mode in development/native builds when `react-native-executorch` is available
  - Rule-based fallback mode in Expo Go and unsupported environments
- Offline behavior: core communication, local storage, fallback predictions, TTS, and local notifications remain available without a network connection

## What the App Does

- Suggests phrases based on:
  - saved or selected location (`home`, `school`, `hospital`, `outdoor`, `restaurant`)
  - time of day (`morning`, `afternoon`, `evening`, `night`)
  - weather context when available
  - recent phrase history
  - selected emotion
- Speaks phrases aloud with native TTS
- Supports emergency help flows and caregiver notifications
- Supports custom phrases, favorites, history, onboarding, and saved locations
- Supports 20 interface languages, including RTL-aware behavior for Arabic and Urdu

## Repository Layout

```text
speak-easy/
├── README.md
├── AGENTS.md
├── DEMO_GUIDE.md
├── PRIVACY_POLICY.md
├── SESSION_LOG.md
├── SESSION_LOG_20250105.md
├── SUBMISSION_CHECKLIST.md
├── SUBMISSION_FINAL.md
└── mobile/
    ├── README.md
    ├── STORE_SUBMISSION_GUIDE.md
    ├── app.json
    ├── eas.json
    ├── package.json
    └── src/
        ├── app/
        ├── components/
        ├── constants/
        ├── i18n/
        ├── services/
        ├── stores/
        ├── types/
        └── utils/
```

## Quick Start

```bash
cd mobile
npm install
npm start
```

Common commands:

```bash
npm run ios
npm run android
npm run lint
npm test
npx tsc --noEmit
```

## Native AI vs Fallback Mode

SpeakEasy does not assume that native on-device LLM support is always available.

- `npm start`
  - Fastest development loop
  - Uses Expo Go-compatible fallback behavior
  - UI should show rule-based mode rather than native AI
- `npm run ios` / `npm run android`
  - Runs a native development build
  - Enables native module loading when supported by the local build environment

The app is intentionally designed so communication features continue working even when native AI is unavailable.

## Design System

The app uses the `v2-liquid-glass` design system, with all visual tokens defined in `mobile/src/constants/index.ts`.

## Key Source Files

- `mobile/src/app/index.tsx` - main communication screen
- `mobile/src/app/settings.tsx` - language, voice, AI mode, and saved-location controls
- `mobile/src/services/PredictionService.ts` - rule-based prediction engine
- `mobile/src/services/LLMService.ts` - native/fallback AI mode handling
- `mobile/src/services/TTSService.ts` - text-to-speech integration
- `mobile/src/services/NotificationService.ts` - caregiver and emergency notifications
- `mobile/src/stores/predictionStore.ts` - app prediction flow orchestration
- `mobile/src/i18n/index.ts` and `mobile/src/i18n/phrases.ts` - translations and phrase sources

## Verification Commands

```bash
cd mobile
npm run lint
npm test -- --runInBand
npx tsc --noEmit
npx expo export --platform ios --output-dir dist-export
```

## Related Docs

- `AGENTS.md` - engineering guidance for contributors and coding agents
- `mobile/README.md` - mobile app setup and runtime notes
- `mobile/STORE_SUBMISSION_GUIDE.md` - app-store build and release workflow
- `DEMO_GUIDE.md` - suggested demo flows for the current mobile app
- `PRIVACY_POLICY.md` - privacy commitments and local-data handling
- `SESSION_LOG.md` - current project snapshot and historical notes

## License

MIT
