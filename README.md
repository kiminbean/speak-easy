<div align="center">

# 🗣️ SpeakEasy

### AI-Powered Communication Bridge for Non-Verbal Individuals

[![React Native](https://img.shields.io/badge/React_Native-0.81-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?style=for-the-badge&logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**70 million people worldwide cannot speak. Traditional AAC devices cost $8,000-$15,000.**

**SpeakEasy is free and works 100% offline.**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Tech Stack](#-tech-stack)

</div>

---

## 🎯 The Problem

**70+ million people** worldwide live with conditions that affect their ability to speak:
- Autism Spectrum Disorder
- Cerebral Palsy
- ALS / Motor Neuron Disease
- Stroke survivors
- Developmental disabilities

Traditional AAC (Augmentative and Alternative Communication) devices:
- 💰 Cost **$8,000 - $15,000**
- 📚 Require **extensive training**
- 🌐 Often require **internet connection**
- ⏰ Take **months** to customize

---

## 💡 Our Solution

SpeakEasy is a **React Native app** with **on-device AI** that predicts what users want to say:

| Signal | How It's Used |
|--------|---------------|
| 🕐 **Time of Day** | Breakfast phrases in morning, bedtime phrases at night |
| 📍 **Location** | Medical vocabulary at hospital, social phrases at school |
| 💭 **Recent History** | Learns frequently used phrases |
| ❤️ **Emotional State** | Adapts to frustration, anxiety, happiness |

### ✨ Key Features

- **🤖 On-Device AI** - Qwen3-0.6B runs locally, no cloud required
- **🎯 Context Awareness** - Automatic vocabulary switching
- **😊 Emotion Detection** - Multi-signal emotion recognition
- **🔊 Natural Speech** - Native TTS for instant voice output
- **🚨 Emergency Alerts** - Quick help with caregiver notifications
- **📱 100% Offline** - Works without internet connection
- **♿ Fully Accessible** - WCAG 2.1 AA compliant

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/speakeasy.git
cd speakeasy/mobile

# Install dependencies
npm install

# Start the app
npm start

# Press 'i' for iOS or 'a' for Android
```

### For Full LLM Support

```bash
# Create development build (required for native LLM modules)
npx expo prebuild
npx expo run:ios   # or run:android
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SPEAKEASY ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React Native App                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │   Phrase    │  │   Emotion   │  │     Emergency       │  │   │
│  │  │   Grid      │  │   Selector  │  │     Button          │  │   │
│  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │   │
│  │         │                │                     │             │   │
│  │         └────────────────┼─────────────────────┘             │   │
│  │                          │                                   │   │
│  │  ┌───────────────────────▼───────────────────────────────┐  │   │
│  │  │                  Zustand Stores                        │  │   │
│  │  │   (predictionStore, emotionStore, settingsStore)       │  │   │
│  │  └───────────────────────┬───────────────────────────────┘  │   │
│  └──────────────────────────┼──────────────────────────────────┘   │
│                             │                                       │
│  ┌──────────────────────────▼──────────────────────────────────┐   │
│  │                      Services Layer                          │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │   │
│  │  │ Prediction  │  │   Emotion   │  │    Notification     │  │   │
│  │  │  Service    │  │   Service   │  │      Service        │  │   │
│  │  └──────┬──────┘  └─────────────┘  └─────────────────────┘  │   │
│  │         │         ┌─────────────┐  ┌─────────────────────┐  │   │
│  │         │         │    TTS      │  │      Storage        │  │   │
│  │         │         │   Service   │  │      Service        │  │   │
│  │         │         └──────┬──────┘  └─────────────────────┘  │   │
│  │         │                │                                   │   │
│  └─────────┼────────────────┼───────────────────────────────────┘   │
│            │                │                                       │
│  ┌─────────▼────────┐  ┌────▼─────────────────────────────────┐    │
│  │   On-Device LLM  │  │        Native APIs                   │    │
│  │   (Qwen3-0.6B)   │  │  (TTS, Notifications, AsyncStorage) │    │
│  │                  │  │                                      │    │
│  │  react-native-   │  │  expo-speech, expo-notifications,   │    │
│  │  executorch      │  │  @react-native-async-storage        │    │
│  └──────────────────┘  └──────────────────────────────────────┘    │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     📱 iOS / Android                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | React Native + Expo | Cross-platform, fast development |
| **AI/LLM** | Qwen3-0.6B (on-device) | Privacy, offline, no cloud costs |
| **Voice** | expo-speech | Native TTS, works offline |
| **State** | Zustand | Lightweight, TypeScript-friendly |
| **Storage** | AsyncStorage | Local persistence |
| **Notifications** | expo-notifications | Local caregiver alerts |

### 100% Offline Capable
- ✅ Rule-based predictions (always available)
- ✅ On-device LLM (after download)
- ✅ Native TTS engine
- ✅ Local storage
- ✅ Local push notifications

---

## 📁 Project Structure

```
speakeasy/
├── mobile/                    # React Native App
│   ├── src/
│   │   ├── app/              # Expo Router pages
│   │   ├── components/       # UI components
│   │   ├── services/         # Business logic
│   │   ├── stores/           # Zustand state
│   │   ├── constants/        # Phrases, emotions
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Utilities
│   ├── assets/               # Images, fonts
│   └── package.json
│
├── emotion_agent.py          # Original Python (reference)
├── prediction_agent.py       # Original Python (reference)
└── README.md
```

---

## 📊 Impact Metrics

| Metric | Value |
|--------|-------|
| **Target Users** | 70+ million non-verbal individuals |
| **Cost Savings** | $8,000-$15,000 per user |
| **Response Time** | <200ms (on-device) |
| **Offline Support** | 100% |
| **Platforms** | iOS + Android |

---

## 🔮 Future Roadmap

- [ ] Custom phrase training
- [x] Multi-language support (20 languages)
- [ ] Symbol/image-based phrases
- [ ] Eye tracking input
- [ ] Switch control support
- [ ] Cloud sync (optional)

---

## 📋 Development History

### v1.0.0 - Store Release Ready (January 2026)

#### Completed Features
| Category | Feature | Status |
|----------|---------|--------|
| **Core App** | React Native + Expo SDK 54 | ✅ |
| **AI/LLM** | On-device SmolLM2-360M with ExecuTorch | ✅ |
| **Voice** | Multi-language TTS (20 languages) | ✅ |
| **i18n** | 20 language support with RTL | ✅ |
| **Accessibility** | WCAG 2.1 AA compliant | ✅ |
| **Notifications** | Local caregiver alerts | ✅ |
| **Storage** | Offline-first with AsyncStorage | ✅ |

#### Bug Fixes & Quality Improvements
- Fixed `EmotionSelector.tsx`: `lang` prop destructuring, `withSequence` import
- Fixed `_layout.tsx`: Added `__DEV__` guard for production console.log
- Fixed `index.tsx`: useEffect dependency array completeness
- Enhanced `ErrorBoundary.tsx`: i18n support, accessibility improvements
- Added comprehensive i18n fallback logic

#### Store Submission Preparation
| Item | Status |
|------|--------|
| app.json metadata (iOS/Android) | ✅ |
| eas.json (EAS Build/Submit) | ✅ |
| Privacy manifests (iOS) | ✅ |
| Permission localization (4 languages) | ✅ |
| Store listing metadata | ✅ |
| STORE_SUBMISSION_GUIDE.md | ✅ |
| expo-doctor validation | ✅ 17/17 passed |
| Test suite | ✅ 155 tests passed |
| ESLint | ✅ 0 errors |

#### Project Structure
```
mobile/
├── src/
│   ├── app/           # Expo Router pages
│   ├── components/    # PhraseCard, EmotionSelector, ErrorBoundary
│   ├── services/      # LLM, TTS, Prediction, Emotion, Storage
│   ├── stores/        # Zustand state management
│   ├── constants/     # COLORS, SPACING, ANIMATION, phrases
│   ├── types/         # TypeScript interfaces
│   ├── i18n/          # 20 languages, RTL support
│   └── __tests__/     # Jest test suites
├── locales/           # iOS permission localization
├── store-assets/      # Store listing metadata
├── assets/            # Icons, splash, feature graphic
└── STORE_SUBMISSION_GUIDE.md
```

#### Next Steps (Manual)
1. Prepare store screenshots (iPhone 6.5", 5.5" / Android 1080x1920)
2. Configure Google Play Service Account
3. Configure App Store Connect credentials in eas.json
4. Run production build: `eas build --platform all --profile production`
5. Submit to stores: `eas submit --platform all --profile production`

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT License - See [LICENSE](LICENSE) for details.

---

<div align="center">

### *"70 million people deserve a voice. SpeakEasy makes it possible."*

**Made with ❤️ for accessibility**

</div>
