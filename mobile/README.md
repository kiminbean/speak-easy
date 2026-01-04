# 🗣️ SpeakEasy Mobile

> AI-Powered AAC (Augmentative and Alternative Communication) App for Non-Verbal Individuals

## Overview

SpeakEasy is a **100% offline-capable** React Native app that helps non-verbal individuals communicate using AI-powered phrase predictions. Unlike traditional cloud-based AAC solutions, SpeakEasy runs entirely on-device, ensuring:

- 🔒 **Privacy**: No data leaves the device
- ⚡ **Speed**: Instant responses without network latency
- 🌐 **Offline**: Works anywhere, anytime
- 💰 **Free**: No subscription or cloud costs

## Features

### Core Features
- 🤖 **AI-Powered Predictions**: On-device sLLM (Qwen3-0.6B) predicts contextually relevant phrases
- 📍 **Context Awareness**: Adapts to time of day and location
- 😊 **Emotion Detection**: Recognizes emotional state through tap patterns and phrase sentiment
- 🔊 **Text-to-Speech**: Native TTS for natural voice output
- 🚨 **Emergency Alerts**: Quick emergency button with caregiver notifications

### Accessibility
- ♿ WCAG 2.1 AA Compliant
- 📏 Adjustable text sizes
- 🎯 High contrast mode
- 📳 Haptic feedback
- 🔤 Screen reader support

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React Native + Expo |
| AI/LLM | On-device sLLM (Qwen3-0.6B via react-native-executorch) |
| TTS | expo-speech (native TTS engine) |
| Storage | AsyncStorage |
| State | Zustand |
| Notifications | expo-notifications (local) |

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- For actual LLM: Expo Development Build (not Expo Go)

### Installation

```bash
# 1. Navigate to mobile directory
cd mobile

# 2. Install dependencies
npm install

# 3. Start development server
npm start

# 4. Run on simulator
# Press 'i' for iOS or 'a' for Android
```

### Development Build (for full LLM support)

> ⚠️ Expo Go does not support native LLM modules. Use a Development Build for full AI features.

```bash
# Option A: Local Build (requires Xcode/Android Studio)
npm run prebuild:clean
npm run run:ios     # iOS Simulator
npm run run:android # Android Emulator

# Option B: EAS Cloud Build (recommended)
npm run build:dev

# Then download and install the .apk/.app from EAS dashboard
```

### Running Modes

| Command | LLM Mode | Use Case |
|---------|----------|----------|
| `npm start` | Fallback | Quick testing in Expo Go |
| `npm run run:ios` | Native | Full features on iOS |
| `npm run run:android` | Native | Full features on Android |

## Project Structure

```
mobile/
├── src/
│   ├── app/              # Expo Router pages
│   │   ├── _layout.tsx   # Root layout
│   │   ├── index.tsx     # Main AAC screen
│   │   └── settings.tsx  # Settings screen
│   │
│   ├── components/       # UI Components
│   │   ├── PhraseCard.tsx
│   │   ├── PhraseGrid.tsx
│   │   ├── EmotionSelector.tsx
│   │   └── EmergencyButton.tsx
│   │
│   ├── services/         # Business Logic
│   │   ├── PredictionService.ts  # Phrase prediction
│   │   ├── EmotionService.ts     # Emotion detection
│   │   ├── TTSService.ts         # Text-to-speech
│   │   ├── LLMService.ts         # On-device LLM
│   │   ├── ContextService.ts     # Context management
│   │   ├── StorageService.ts     # Local storage
│   │   └── NotificationService.ts # Caregiver alerts
│   │
│   ├── stores/           # Zustand stores
│   │   ├── predictionStore.ts
│   │   ├── emotionStore.ts
│   │   └── settingsStore.ts
│   │
│   ├── constants/        # App constants
│   │   ├── emotions.ts   # Emotion definitions
│   │   ├── phrases.ts    # Fallback phrases
│   │   └── index.ts      # Colors, spacing
│   │
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   │
│   └── utils/            # Utilities
│       └── hash.ts
│
├── assets/               # Images, icons
├── app.json              # Expo config
├── package.json
└── tsconfig.json
```

## On-Device LLM Integration

The app uses **react-native-executorch** for on-device LLM inference with **Qwen3-0.6B-Quantized**.

### Two Modes

| Mode | Environment | LLM | Quality |
|------|-------------|-----|---------|
| **Native** | Development Build | Qwen3-0.6B | High-quality AI predictions |
| **Fallback** | Expo Go | Rule-based | Context-aware fallback |

### Building with LLM Support

```bash
# Method 1: Local Build (requires Xcode/Android Studio)
npm run prebuild:clean
npm run run:ios   # or run:android

# Method 2: EAS Cloud Build
npm run build:dev
```

### Model Details

- **Model**: Qwen3-0.6B-Quantized (~300MB)
- **RAM**: ~1.2GB during inference
- **Download**: Automatic on first launch
- **Storage**: Cached locally after download

See `src/services/LLMService.ts` for integration details.

## Supported LLM Models

| Model | Size | RAM Required | Best For |
|-------|------|--------------|----------|
| Qwen3-0.6B | ~500MB | 2GB | High quality predictions |
| SmolLM2-135M | ~100MB | 1GB | Faster, lighter |
| Llama 3.2 1B | ~1GB | 3GB | Most capable |

## Offline Capabilities

The app works 100% offline:

- ✅ Rule-based phrase predictions (always available)
- ✅ Native TTS (no internet required)
- ✅ Local storage for settings and history
- ✅ Local push notifications
- ✅ Pre-downloaded LLM model

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

MIT License - See LICENSE for details

---

<div align="center">

### *"70 million people deserve a voice. SpeakEasy makes it possible."*

Built with ❤️ for accessibility

</div>
