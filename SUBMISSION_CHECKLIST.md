# SpeakEasy Release and Submission Checklist

This checklist tracks the current mobile app release workflow for this repository.

## Product Snapshot

- App: SpeakEasy
- Platform: React Native mobile app
- Version: `1.1.0`
- Active UI style: `v2-liquid-glass`
- Native AI path: supported native/dev builds
- Fallback path: rule-based mode in Expo Go and unsupported environments

## Documentation
- [ ] `README.md` reflects the current mobile architecture
- [ ] `AGENTS.md` reflects current engineering rules and commands
- [ ] `mobile/README.md` matches current runtime modes
- [ ] `mobile/STORE_SUBMISSION_GUIDE.md` matches current EAS config and release metadata
- [ ] `PRIVACY_POLICY.md` matches current on-device storage and permission use
- [ ] `DEMO_GUIDE.md` matches the current demo flow
- [ ] `SESSION_LOG.md` contains the latest project snapshot

## Code Verification

Run from `mobile/`:

- [ ] `npm run lint`
- [ ] `npm test -- --runInBand`
- [ ] `npx tsc --noEmit`
- [ ] `npx expo export --platform ios --output-dir dist-export`

## Runtime Verification

- [ ] onboarding completes from a clean install
- [ ] suggested phrases change by location and time
- [ ] weather-aware phrases appear when weather context is available
- [ ] home/settings AI labels correctly show native vs fallback mode
- [ ] TTS works on target devices
- [ ] emergency notification flow does not crash

## Release Metadata

Source of truth:
- `mobile/package.json`
- `mobile/app.json`
- `mobile/src/constants/index.ts`

Checklist:
- [ ] marketing version updated
- [ ] iOS build number updated
- [ ] Android version code updated
- [ ] active UI style documented

## Build and Submission

### Development / simulator build

```bash
cd mobile
eas build --platform ios --profile development
eas build --platform android --profile development
```

### Preview build

```bash
cd mobile
eas build --platform all --profile preview
```

### Production build

```bash
cd mobile
eas build --platform all --profile production
```

### Submission

```bash
cd mobile
eas submit --platform ios --profile production
eas submit --platform android --profile production
```

## Distribution Assets

- [ ] current screenshots reflect `v2-liquid-glass`
- [ ] app icon and splash assets are final
- [ ] privacy policy URL is current
- [ ] review notes explain fallback AI behavior honestly
