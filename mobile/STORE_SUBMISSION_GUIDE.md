# SpeakEasy Store Submission Guide

This guide tracks the current mobile release packaging flow for SpeakEasy.

## Current Release Metadata

- Marketing version: `1.1.0`
- iOS build number: `1.1.0`
- Android version code: `21`
- Bundle/package ID: `com.speakeasy.aac`
- Active UI style: `v2-liquid-glass`

Source of truth:
- `mobile/app.json`
- `mobile/package.json`
- `mobile/src/constants/index.ts`

## Build Profiles

Defined in `mobile/eas.json`:

- `development`
  - internal distribution
  - iOS simulator enabled
  - Android debug APK
- `preview`
  - internal distribution
  - device build for testing
- `production`
  - iOS App Store build settings
  - Android AAB build settings
  - auto increment enabled

## Pre-Submission Checklist

### Metadata
- [ ] `mobile/package.json` version matches release target
- [ ] `mobile/app.json` version, build number, and version code are correct
- [ ] privacy text and permissions are still accurate
- [ ] `uiStyleVersion` in `mobile/app.json` matches the active theme in `mobile/src/constants/index.ts`

### Quality checks
- [ ] `cd mobile && npm run lint`
- [ ] `cd mobile && npm test -- --runInBand`
- [ ] `cd mobile && npx tsc --noEmit`
- [ ] `cd mobile && npx expo export --platform ios --output-dir dist-export`

### App review readiness
- [ ] onboarding flow works from a clean install
- [ ] suggested phrases change by location/time/weather in fallback mode
- [ ] AI status labels correctly show `On-Device AI` vs `Rule-based Mode`
- [ ] emergency alert flow works without crashing
- [ ] TTS works on target release devices

## Android Submission

### Build

```bash
cd mobile
eas build --platform android --profile production
```

### Submit

```bash
cd mobile
eas submit --platform android --profile production
```

Current `submit.production.android` expects:
- `google-service-account.json` at `mobile/google-service-account.json`
- Play track: `internal`
- Release status: `draft`

## iOS Submission

### Build

```bash
cd mobile
eas build --platform ios --profile production
```

### Submit

```bash
cd mobile
eas submit --platform ios --profile production
```

Current `submit.production.ios` is configured in `mobile/eas.json` with App Store Connect values for the existing app.

## Screenshots and Review Notes

Use the current mobile UI when generating screenshots:
- home screen with `v2-liquid-glass`
- settings screen showing AI mode and language support
- onboarding flow
- emergency flow
- custom phrase management

Recommended reviewer notes:
- SpeakEasy is an offline-first AAC app.
- In Expo Go or unsupported environments, phrase prediction falls back to rule-based mode.
- No cloud backend is required for core communication.
- User data remains on device.

## Release Notes Template

```text
SpeakEasy 1.1.0 refreshes the mobile UI with the new Liquid Glass design system, improves context-aware suggested phrases, clarifies AI runtime status, and keeps offline AAC workflows available on device.
```

## Troubleshooting

### Push notification warnings on simulator

Local notifications cannot be fully validated on the iOS simulator because `expo-device` reports `isDevice = false`. Use a physical device for end-to-end push validation.

### Native AI not available

If the app shows `Rule-based Mode`, that is expected in Expo Go and any environment where `react-native-executorch` is unavailable.

### TTS voice selection differences

iOS simulator and physical devices may enumerate voices differently. Simulator-safe fallback behavior is expected; final speech-quality validation should happen on a real device.
