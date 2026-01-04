# SpeakEasy 개발 세션 로그

> 마지막 업데이트: 2026-01-04

---

## 프로젝트 개요

**SpeakEasy**는 비언어 장애인을 위한 **100% 오프라인** AAC(보조 대체 의사소통) React Native 앱입니다.

- **경로**: `/Users/ibkim/Projects/speak-easy/mobile`
- **목표**: AWS 기반 AAC 시스템을 온디바이스 sLLM(Qwen3-0.6B)을 사용하는 모바일 앱으로 전환

---

## 기술 스택

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Expo | 54.0.30 |
| React Native | - | 0.81.5 |
| Language | TypeScript | 5.9.2 |
| State | Zustand | 5.0.3 |
| LLM | react-native-executorch | 0.6.0 |
| TTS | expo-speech | 14.0.8 |
| Navigation | expo-router | 6.0.21 |

---

## 완료된 작업

### 세션 1: 핵심 앱 구조
- Expo 54 + React Native 0.81 + TypeScript 프로젝트 설정
- 온디바이스 LLM 서비스 (Mock 구현)
- TTS, 알림, 예측, 감정 분석 서비스
- Zustand 상태 관리 (prediction, emotion, settings stores)
- 기본 UI 컴포넌트 (PhraseCard, PhraseGrid, EmotionSelector, EmergencyButton)

### 세션 2: 상용화 기능 5개
| 기능 | 파일 | 상태 |
|------|------|------|
| 1. 사용자 정의 구문 | `add-phrase.tsx` | ✅ |
| 2. 즐겨찾기 관리 | `favorites.tsx`, `PhraseCard.tsx` | ✅ |
| 3. 보호자 연락처 | `caregivers.tsx` | ✅ |
| 4. 온보딩 튜토리얼 | `onboarding.tsx`, `_layout.tsx` | ✅ |
| 5. 다국어 지원 (20개 언어) | `i18n/index.ts`, `settings.tsx` | ✅ |

### 세션 3: 온디바이스 LLM 연동 (2026-01-04)
| 작업 | 상태 |
|------|------|
| react-native-executorch 연구 및 설치 | ✅ |
| LLMService.ts 실제 LLM 연동 구현 | ✅ |
| 이중 모드 (네이티브/폴백) 아키텍처 | ✅ |
| 모델 다운로드 진행률 UI | ✅ |
| Development Build 설정 (eas.json) | ✅ |
| 패키지 버전 호환성 수정 | ✅ |

---

## 현재 파일 구조

```
mobile/
├── src/
│   ├── app/
│   │   ├── _layout.tsx        # 앱 레이아웃, 온보딩 라우팅, LLM 초기화
│   │   ├── index.tsx          # 메인 AAC 화면
│   │   ├── settings.tsx       # 설정 (20개 언어 선택)
│   │   ├── add-phrase.tsx     # 구문 추가/편집
│   │   ├── favorites.tsx      # 즐겨찾기 관리
│   │   ├── caregivers.tsx     # 보호자 관리
│   │   └── onboarding.tsx     # 온보딩 튜토리얼
│   ├── components/
│   │   ├── PhraseCard.tsx     # 롱프레스 즐겨찾기 토글
│   │   ├── PhraseGrid.tsx
│   │   ├── EmotionSelector.tsx
│   │   ├── EmergencyButton.tsx
│   │   └── index.ts
│   ├── i18n/
│   │   └── index.ts           # 20개 언어 번역 (~1500줄)
│   ├── services/
│   │   ├── LLMService.ts      # ⭐ Qwen3-0.6B 연동 (핵심)
│   │   ├── PredictionService.ts
│   │   ├── EmotionService.ts
│   │   ├── TTSService.ts
│   │   ├── ContextService.ts
│   │   ├── StorageService.ts
│   │   ├── NotificationService.ts
│   │   └── index.ts
│   ├── stores/
│   │   ├── predictionStore.ts
│   │   ├── emotionStore.ts
│   │   ├── settingsStore.ts
│   │   └── index.ts
│   ├── constants/
│   │   ├── emotions.ts
│   │   ├── phrases.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts           # SupportedLanguage (20개)
│   └── utils/
│       └── hash.ts
├── assets/
├── app.json                   # newArchEnabled: true
├── eas.json                   # EAS Build 설정
├── package.json
└── tsconfig.json
```

---

## 지원 언어 (20개)

```
🇺🇸 English (en)     🇰🇷 한국어 (ko)      🇯🇵 日本語 (ja)
🇪🇸 Español (es)     🇷🇺 Русский (ru)     🇮🇩 Bahasa (id)
🇧🇷 Português (pt)   🇫🇷 Français (fr)    🇩🇪 Deutsch (de)
🇧🇩 বাংলা (bn)        🇸🇦 العربية (ar)      🇵🇰 اردو (ur)
🇮🇳 हिन्दी (hi)        🇮🇹 Italiano (it)     🇵🇱 Polski (pl)
🇺🇦 Українська (uk)  🇷🇴 Română (ro)      🇳🇱 Nederlands (nl)
🇻🇳 Tiếng Việt (vi)  🇹🇷 Türkçe (tr)
```

---

## LLM 아키텍처

### 이중 모드 설계

| 모드 | 환경 | LLM | 품질 |
|------|------|-----|------|
| **Native** | Development Build | Qwen3-0.6B-Quantized | 고품질 AI 예측 |
| **Fallback** | Expo Go | 규칙 기반 | 컨텍스트 인식 폴백 |

### 핵심 코드 (LLMService.ts)

```typescript
// Lazy import로 Expo Go 크래시 방지
let LLMModule: any = null;
let QWEN3_0_6B_QUANTIZED: any = null;

try {
  const executorch = require('react-native-executorch');
  LLMModule = executorch.LLMModule;
  QWEN3_0_6B_QUANTIZED = executorch.QWEN3_0_6B_QUANTIZED;
} catch {
  console.log('react-native-executorch not available (Expo Go mode)');
}

// 네이티브 모듈 사용 가능 시 실제 LLM, 아니면 규칙 기반 폴백
if (LLMModule && QWEN3_0_6B_QUANTIZED) {
  await this.initializeNativeModule();
} else {
  await this.simulateModelDownload();
}
```

---

## 실행 방법

```bash
# 1. 의존성 설치
cd mobile && npm install

# 2. Expo Go (폴백 모드 - 빠른 테스트)
npm start

# 3. Development Build (네이티브 LLM)
npm run prebuild:clean
npm run run:ios     # 또는 run:android

# 4. EAS Cloud Build
npm run build:dev
```

---

## 제약사항

- ❌ AWS 서비스 사용 금지 (100% 오프라인)
- ❌ FlatList를 ScrollView 안에 중첩 금지
- ❌ Expo Go에서 네이티브 LLM 모듈 사용 불가 (Development Build 필요)

---

## 다음 세션을 위한 프롬프트

```
프로젝트 경로: /Users/ibkim/Projects/speak-easy/mobile

## 프로젝트 현황
SpeakEasy는 비언어 장애인을 위한 100% 오프라인 AAC(보조 대체 의사소통) React Native 앱입니다.

### 기술 스택
- Expo 54, React Native 0.81, TypeScript
- react-native-executorch (Qwen3-0.6B-Quantized)
- Zustand 상태 관리
- expo-router 네비게이션

### 완료된 기능
1. 핵심 앱 구조 및 UI 컴포넌트
2. 온디바이스 LLM 연동 (이중 모드: 네이티브/폴백)
3. 사용자 정의 구문 추가/편집
4. 즐겨찾기 관리 (롱프레스)
5. 보호자 연락처 관리
6. 온보딩 튜토리얼
7. 20개 언어 지원

### 주요 파일
- src/services/LLMService.ts: Qwen3-0.6B 연동 (핵심)
- src/app/_layout.tsx: 앱 초기화, LLM 로딩
- src/i18n/index.ts: 20개 언어 번역

### 실행 방법
- Expo Go: npm start (폴백 모드)
- Native LLM: npm run prebuild:clean && npm run run:ios

### 가능한 다음 작업
1. RTL 언어(아랍어, 우르두어) UI 레이아웃 최적화
2. 접근성(WCAG 2.1 AA) 검증 및 개선
3. 앱 성능 최적화 (메모이제이션, 렌더링)
4. 앱 아이콘 및 스플래시 스크린 디자인
5. 단위/통합 테스트 작성
6. 앱 스토어 배포 준비

무엇을 도와드릴까요?
```

---

## 변경 이력

| 날짜 | 작업 | 커밋 메시지 |
|------|------|-------------|
| 2026-01-04 | 온디바이스 LLM 연동 | 🧠 온디바이스 LLM 연동 (react-native-executorch, Qwen3-0.6B) |
