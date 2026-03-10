# SpeakEasy Demo Guide

This guide reflects the current mobile app, not the older AWS/web competition prototype.

## Recommended Demo Goal

Show that SpeakEasy can:
- switch suggested phrases by real context
- speak phrases aloud immediately
- support emergency communication
- work in fallback mode without native AI
- present a modern liquid-glass mobile interface

## Setup

### Fastest path

```bash
cd mobile
npm install
npm start
```

This is useful for fallback-mode demos.

### Native feature demo

```bash
cd mobile
npm run ios
```

Use this when you want to show the native build path or test runtime differences outside Expo Go.

## Demo Flow

### 1. Onboarding and entry
- launch from a clean install if possible
- confirm onboarding completes successfully
- point out the `v2-liquid-glass` UI treatment

### 2. Home screen suggestions
- open the main screen
- change location between `Home`, `School`, `Hospital`, `Outdoor`, and `Restaurant`
- refresh suggestions if needed
- show that suggested phrases change by context rather than staying static

Good examples to call out:
- home -> snack, play, thirsty, routine phrases
- school -> lunch, help, break, work-related phrases
- hospital -> medicine, pain, recovery, reassurance phrases
- restaurant -> ordering, water, napkins, meal phrases
- outdoor -> tired, thirsty, rest, weather-exposed phrases

### 3. AI mode label
- open Settings
- show the current AI mode label
- explain the difference between:
  - `On-Device AI` in supported native environments
  - `Rule-based Mode` in Expo Go or unsupported environments

### 4. Emotion-aware suggestions
- choose an emotion such as frustrated or scared
- show the coping/support phrases that appear with that context

### 5. TTS output
- tap several phrases to speak them aloud
- demonstrate that communication still works without a cloud dependency

### 6. Emergency flow
- trigger the emergency button
- show local alert behavior and caregiver-related options where available
- note that full push/device behavior must be verified on a physical device

### 7. Localization
- change the UI language in Settings
- optionally demonstrate an RTL language such as Arabic or Urdu

## What to Explain During the Demo

- The app is mobile-first and offline-first.
- It stores user data on device.
- Native AI is optional; fallback mode still gives context-aware suggestions.
- The UI uses the `v2-liquid-glass` design system.

## Key Files to Reference if Needed

- `mobile/src/app/index.tsx`
- `mobile/src/app/settings.tsx`
- `mobile/src/services/PredictionService.ts`
- `mobile/src/services/LLMService.ts`
- `mobile/src/services/TTSService.ts`
- `mobile/src/constants/index.ts`

## Validation Checklist Before a Demo

```bash
cd mobile
npm run lint
npm test -- --runInBand
npx tsc --noEmit
```
