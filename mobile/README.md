# SpeakEasy Mobile

SpeakEasy Mobile is the React Native application inside this repository. It is the product source of truth for runtime behavior, release metadata, and UI implementation.

## Current App State

- Version: `1.1.0`
- Expo SDK: `54`
- React Native: `0.81.5`
- Active UI style: `v2-liquid-glass`
- Bundle ID / package: `com.speakeasy.aac`

## Runtime Modes

### Native AI mode

Available only when the native `react-native-executorch` module loads in a native development build.

- UI label: `On-Device AI`
- Environment: `npm run ios`, `npm run android`, or EAS/native builds
- Behavior: native model loading plus context-aware phrase generation

### Fallback mode

Used in Expo Go and unsupported environments.

- UI label: `Rule-based Mode`
- Environment: `npm start`
- Behavior: context-aware phrase suggestions powered by local rules and fallback generation logic

## Core Features

- Context-aware suggested phrases
- Custom phrases and favorites
- Phrase history
- Saved locations and automatic location detection
- Emotion-aware supportive phrases
- Text-to-speech output
- Local caregiver and emergency notifications
- 20-language interface with RTL handling for Arabic and Urdu
- Offline-first behavior with no cloud dependency for core communication

## Main Commands

```bash
cd mobile
npm install
npm start
npm run ios
npm run android
npm run lint
npm test
npm test -- --runInBand
npx tsc --noEmit
npm run prebuild:clean
npm run build:dev
npm run build:ios
npm run build:android
npx expo export --platform ios --output-dir dist-export
```

## Recommended Local Workflows

### Fast development loop

```bash
cd mobile
npm start
```

Use this when you want quick UI iteration in Expo Go with fallback AI behavior.

### Native feature verification

```bash
cd mobile
npm run ios
```

Use this when you need to verify native modules, native AI loading, or simulator/device-specific behavior.

## Project Structure

```text
mobile/
├── app.json
├── eas.json
├── package.json
├── README.md
└── src/
    ├── app/          # Expo Router screens
    ├── components/   # Reusable UI pieces
    ├── constants/    # App version, theme tokens, phrase metadata
    ├── i18n/         # UI translations and phrase sources
    ├── services/     # Prediction, LLM, TTS, notifications, storage, context
    ├── stores/       # Zustand stores
    ├── types/        # Shared TypeScript types
    └── utils/        # Hashing and RTL helpers
```

## Key Source Files

- `src/app/index.tsx` - main AAC experience
- `src/app/settings.tsx` - language, voice, AI, and saved-location controls
- `src/app/onboarding.tsx` - onboarding flow
- `src/services/PredictionService.ts` - rule-based phrase engine
- `src/services/LLMService.ts` - native/fallback AI behavior
- `src/services/TTSService.ts` - TTS integration
- `src/services/NotificationService.ts` - local notifications and caregiver flows
- `src/constants/index.ts` - theme tokens and app version constants

## Validation

Before finishing changes in `mobile/`, use the checks below whenever they are relevant:

```bash
cd mobile
npm run lint
npm test -- --runInBand
npx tsc --noEmit
npx expo export --platform ios --output-dir dist-export
```

## Notes for Documentation and Release Work

- Keep `app.json`, `package.json`, and `src/constants/index.ts` aligned on version changes.
- Do not describe fallback mode as native AI.
