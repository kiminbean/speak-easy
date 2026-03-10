# SpeakEasy Project Brief

This file summarizes the current state of the repository and can be reused as a short submission, partnership, or release brief.

## Summary

SpeakEasy is an offline-first AAC mobile app for non-verbal users. It is built with React Native, Expo SDK 54, and TypeScript, and is designed to keep communication workflows available on device without requiring a cloud backend.

The app combines:
- context-aware suggested phrases
- text-to-speech output
- favorites, history, and custom phrases
- caregiver and emergency support flows
- multilingual UI with RTL-aware behavior
- optional native AI acceleration in supported native builds

## Current Product State

- Version: `1.1.0`
- Current design system: `v2-liquid-glass`
- Legacy design retained in code: `v1-classic`
- Package / bundle identifier: `com.speakeasy.aac`

## Why It Matters

Traditional AAC tools can be expensive, slow to customize, or dependent on network connectivity. SpeakEasy focuses on a simpler mobile-first approach:

- local-first phrase generation
- low-friction touch interaction
- immediate voice output
- privacy by default
- resilient fallback behavior when native AI is unavailable

## Runtime Model

SpeakEasy has two operational AI paths:

1. On-Device AI
- available only in supported native/dev builds
- uses `react-native-executorch` when present
- shown in the UI as `On-Device AI`

2. Rule-based Mode
- used in Expo Go and unsupported environments
- still provides context-aware phrase suggestions
- shown in the UI as `Rule-based Mode`

## Major User Flows

- Home screen suggestion browsing
- context switching by location and time of day
- emotion-assisted phrase support
- TTS playback of phrases
- custom phrase creation and editing
- favorite phrase management
- phrase history review
- caregiver contact management
- emergency alert flow
- onboarding and accessibility/language setup

## Technical Snapshot

- React Native `0.81.5`
- Expo `~54.0.31`
- TypeScript `~5.9.2`
- Zustand state management
- expo-router navigation
- expo-speech, expo-notifications, expo-location, expo-sms
- react-native-reanimated and gesture-handler for interaction/motion

## Source of Truth Files

- `mobile/package.json`
- `mobile/app.json`
- `mobile/eas.json`
- `mobile/src/constants/index.ts`
- `mobile/src/services/PredictionService.ts`
- `mobile/src/services/LLMService.ts`
- `mobile/src/services/TTSService.ts`
- `mobile/src/app/index.tsx`
- `mobile/src/app/settings.tsx`

## Verification

Recommended verification commands:

```bash
cd mobile
npm run lint
npm test -- --runInBand
npx tsc --noEmit
npx expo export --platform ios --output-dir dist-export
```
