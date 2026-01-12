# SpeakEasy Store Submission Guide

## Pre-Submission Checklist

### Assets Ready
- [x] App Icon (1024x1024 PNG) - `assets/icon.png`
- [x] Adaptive Icon for Android (1024x1024 PNG) - `assets/adaptive-icon.png`
- [x] Splash Screen (200x200 PNG) - `assets/splash-icon.png`
- [x] Feature Graphic for Play Store (1024x500 PNG) - `assets/feature-graphic.png`
- [x] Privacy Policy - `PRIVACY_POLICY.md`
- [x] Store Listings (EN/KO) - `store-assets/`

### Screenshots Needed
Create screenshots for each platform:

**Phone Screenshots (Required)**
- 6.5" display (iPhone 14 Pro Max): 1290 x 2796 px
- 5.5" display (iPhone 8 Plus): 1242 x 2208 px
- Android Phone: 1080 x 1920 px (minimum)

**Tablet Screenshots (Optional but Recommended)**
- 12.9" iPad Pro: 2048 x 2732 px
- Android Tablet: 1200 x 1920 px

---

## Google Play Store Submission

### Step 1: Setup Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Create a new app (if not exists)
   - App name: `SpeakEasy - AAC Communication`
   - Default language: English (US)
   - App type: App
   - Category: Medical
   - Free/Paid: Free

### Step 2: Setup Service Account for EAS Submit

1. In Google Cloud Console, create a Service Account
2. Grant "Service Account User" role
3. Create JSON key and save as `mobile/google-service-account.json`
4. In Play Console: Setup > API Access > Link the service account
5. Grant "Release manager" permission

### Step 3: Store Listing

Use content from `store-assets/store-listing-en.json`:

**Short Description (80 chars max)**
```
AI-powered communication app for non-verbal individuals. 100% offline, 100% free.
```

**Full Description**
See `store-assets/store-listing-en.json`

**Graphics**
- Feature Graphic: Upload `assets/feature-graphic.png`
- Phone Screenshots: At least 2 screenshots
- Icon: Automatically taken from app bundle

### Step 4: Content Rating

Answer the questionnaire. SpeakEasy should receive:
- ESRB: Everyone
- PEGI: 3

### Step 5: App Content

- Privacy Policy URL: `https://github.com/kiminbean/speak-easy/blob/main/PRIVACY_POLICY.md`
- Ads: No ads
- Data Safety:
  - Data collected: None
  - Data shared: None
  - Security practices: Data encrypted in transit (N/A - no network)

### Step 6: Build and Submit

```bash
# Build for production
cd mobile
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production
```

---

## Apple App Store Submission

### Step 1: Setup App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create a new app:
   - Name: `SpeakEasy - AAC Communication`
   - Primary Language: English (U.S.)
   - Bundle ID: `com.speakeasy.aac`
   - SKU: `com.speakeasy.aac`

### Step 2: Update eas.json

Edit `eas.json` with your Apple credentials:
```json
"ios": {
  "appleId": "YOUR_APPLE_ID@email.com",
  "ascAppId": "APP_STORE_CONNECT_APP_ID",
  "appleTeamId": "YOUR_TEAM_ID"
}
```

Find your `ascAppId`:
- App Store Connect > Your App > General > App Information > Apple ID

Find your `appleTeamId`:
- developer.apple.com > Membership > Team ID

### Step 3: App Store Listing

**App Name**: SpeakEasy - AAC Communication

**Subtitle (30 chars)**: AI Voice for Everyone

**Keywords (100 chars)**:
```
AAC,communication,speech,non-verbal,autism,accessibility,text-to-speech,assistive
```

**Promotional Text (170 chars)**:
```
Free AI-powered communication app. 100% offline, zero data collection. Helping 70 million non-verbal people find their voice.
```

**Description**: Use content from `store-assets/store-listing-en.json`

**What's New**: 
```
Initial release! SpeakEasy helps non-verbal individuals communicate with AI-powered phrase predictions. Works 100% offline.
```

### Step 4: App Privacy

In App Store Connect > App Privacy:

1. **Data Collection**: Select "No, we do not collect data"
2. All data is stored locally on device
3. No tracking, no analytics

### Step 5: Age Rating

Answer questionnaire for 4+ rating:
- No mature content
- No gambling
- Medical/Treatment: Yes (AAC is medical assistive technology)

### Step 6: Review Information

**Contact Information**:
- First Name: [Your name]
- Last Name: [Your name]  
- Phone: [Your phone]
- Email: kiminbean@gmail.com

**Notes for Review**:
```
SpeakEasy is an Augmentative and Alternative Communication (AAC) app designed to help non-verbal individuals communicate. 

Key features to test:
1. Tap any phrase card to hear it spoken aloud
2. Select an emotion to get supportive phrases
3. Use the Emergency button to trigger caregiver alerts
4. Add custom phrases via the "+" button

All data is stored locally. No account or internet required.
```

### Step 7: Build and Submit

```bash
# Build for production
cd mobile
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --profile production
```

---

## Quick Commands Reference

```bash
# Development build (Simulator)
eas build --platform ios --profile development
eas build --platform android --profile development

# Preview build (Internal testing)
eas build --platform all --profile preview

# Production build
eas build --platform all --profile production

# Submit to stores
eas submit --platform android --profile production
eas submit --platform ios --profile production

# Check build status
eas build:list

# Run locally
npx expo start
```

---

## Troubleshooting

### Android Build Issues

1. **Version Code Error**: Increment `versionCode` in app.json
2. **Signing Issues**: Run `eas credentials` to configure

### iOS Build Issues

1. **Provisioning Profile**: EAS handles this automatically
2. **Bundle ID Conflict**: Ensure bundle ID matches App Store Connect

### Submission Rejected?

Common reasons:
- Missing privacy policy
- Inadequate screenshot quality
- Guideline violations (check rejection email)

---

## Version History

| Version | Build | Date | Changes |
|---------|-------|------|---------|
| 1.0.0 | 19 | 2026-01-12 | Initial release |

---

## Support

- GitHub Issues: https://github.com/kiminbean/speak-easy/issues
- Email: kiminbean@gmail.com
