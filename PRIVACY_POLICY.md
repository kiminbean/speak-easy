# Privacy Policy for SpeakEasy

Last updated: March 10, 2026

## Overview

SpeakEasy is an offline-first AAC mobile application for non-verbal users. Privacy is a core product requirement. The app is designed so that core communication features work without a cloud backend and without requiring user accounts.

## What We Collect

SpeakEasy does not require account creation and does not intentionally collect, sell, or share personal data with a cloud service for core app operation.

The repository and app do not include analytics, advertising SDKs, or user-tracking services as part of the current mobile implementation.

## What Is Stored on Device

SpeakEasy stores user data locally on the device to support AAC workflows. Depending on feature usage, local data may include:

- app settings such as language, voice preferences, accessibility settings, and onboarding completion
- favorites and custom phrases
- phrase history and recent phrase context
- saved locations used for context-aware suggestions
- caregiver contact information for local emergency flows
- cached context values used for prediction fallback behavior

This information is intended to remain on the device.

## Permissions Used by the App

The app may request the following permissions:

- Location
  - used to help determine context such as home, school, hospital, outdoor, or restaurant
  - processed for local phrase suggestion behavior
- Microphone
  - reserved for current or future voice-input related features
- Speech recognition
  - reserved for current or future voice-input related features
- Notifications
  - used for local caregiver and emergency notification flows

These permission descriptions are defined in `mobile/app.json`.

## Offline and AI Runtime Behavior

SpeakEasy is designed so that communication features remain available offline.

Current runtime behavior:
- native AI mode is available only in supported native/dev builds when `react-native-executorch` loads successfully
- rule-based fallback mode is used in Expo Go or unsupported environments
- core AAC behavior does not depend on a cloud AI service

## Data Sharing

SpeakEasy does not intentionally share local AAC content with a remote backend for the current mobile implementation.

However, users should understand that emergency and caregiver-related actions can involve device-level integrations such as notifications, SMS, or phone flows, depending on platform capabilities and user choices.

## Children and Accessibility Use Cases

SpeakEasy is intended to support accessibility scenarios, including use by children and assisted users. Since the app is designed around local-only storage and no account requirement, the privacy model is intentionally conservative.

## Security

SpeakEasy relies on the device's operating system protections for local data storage. Users should secure their devices with passcodes, biometrics, and standard OS protections when appropriate.

## Changes to This Policy

This policy may be updated when the app's runtime behavior, permissions, or storage behavior changes. The date at the top of this document reflects the latest repository update to this policy.

## Contact

For questions about this policy or the project:
- GitHub: https://github.com/kiminbean/speak-easy
- Email: kiminbean@gmail.com
