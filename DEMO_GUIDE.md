# 🎬 SpeakEasy Demo Guide

## For AWS 10,000 AIdeas Competition Judges

---

## Quick Start (2 minutes)

### Option 1: Live Demo
Visit: **[speakeasy-demo.aws.dev](https://speakeasy-demo.aws.dev)**

### Option 2: Local Setup
```bash
git clone https://github.com/speakeasy-aac/speakeasy.git
cd speakeasy/frontend
npm install && npm start
```

---

## Demo Scenarios

### 🌅 Scenario 1: Morning Routine (30 seconds)

**Setup**: User wakes up at home

**What to do**:
1. Notice the app detects "Morning" + "Home" context
2. See breakfast-related phrases appear automatically
3. Tap "I'm hungry" → Hear it spoken aloud
4. Observe the phrase added to recent history

**What to observe**:
- Context detection in header
- Relevant predictions (breakfast, morning activities)
- Natural voice synthesis

---

### 🏥 Scenario 2: Hospital Visit (45 seconds)

**Setup**: Change location to "Hospital"

**What to do**:
1. Tap location selector → Choose "Hospital"
2. Watch vocabulary change instantly
3. See medical phrases appear: "It hurts here", "I feel sick", "I'm scared"
4. Tap the emotion button "😰 Worried"
5. Notice additional coping phrases appear

**What to observe**:
- Instant vocabulary switching
- Medical-specific phrases
- Emotion-aware adaptations
- Caregiver alert indicator (hospital triggers monitoring)

---

### 🚨 Scenario 3: Emergency (30 seconds)

**Setup**: User is in distress

**What to do**:
1. Tap the red "HELP / EMERGENCY" button
2. See "I need help now!" spoken immediately
3. Observe simulated caregiver notification

**What to observe**:
- Immediate response (no loading)
- Voice output priority
- Alert system activation

---

### 😊 Scenario 4: Emotion Detection (45 seconds)

**Setup**: User selects frustrated emotion

**What to do**:
1. Tap rapidly on several phrase tiles (simulating frustration)
2. OR tap the "😤 Frustrated" emotion button
3. Watch coping phrases appear:
   - "I need a break"
   - "This is hard for me"
   - "Can you help me?"
4. Notice voice tone changes to softer, slower

**What to observe**:
- Multi-signal emotion detection
- Adaptive vocabulary
- Voice modulation based on emotion

---

### 📴 Scenario 5: Offline Mode (30 seconds)

**Setup**: Disable network (browser dev tools → Network → Offline)

**What to do**:
1. Enable offline mode in browser
2. Continue tapping phrases
3. Observe they still speak (Web Speech API fallback)
4. See "Offline Mode" indicator

**What to observe**:
- Full functionality without internet
- Local phrase storage
- Background sync queue for when back online

---

## Technical Deep Dive

### API Endpoints

```bash
# Get predictions
POST /predict
{
  "userId": "demo_user",
  "context": {
    "timeOfDay": "morning",
    "location": "home",
    "emotion": "calm"
  }
}

# Response
{
  "phrases": ["Good morning", "I'm hungry", ...],
  "confidence": [0.95, 0.92, ...],
  "categories": ["greeting", "need", ...],
  "reasoning": "Morning at home context..."
}
```

### Agent Orchestration

```
User Tap → Context Agent (analyze environment)
              ↓
         Emotion Agent (assess emotional state)
              ↓
         Prediction Agent (Bedrock Claude 3 Haiku)
              ↓
         Speech Agent (Polly synthesis)
              ↓
         [If emergency] → Notification Agent (SNS alert)
```

---

## Key Differentiators to Highlight

| Feature | Traditional AAC | SpeakEasy |
|---------|-----------------|-----------|
| Cost | $8,000-$15,000 | $0 |
| Setup Time | Weeks | Minutes |
| Context Awareness | None | AI-powered |
| Emotion Detection | None | Multi-signal |
| Offline Support | Limited | Full PWA |
| Voice Quality | Robotic | Neural/Natural |
| Caregiver Alerts | Manual | Automatic |

---

## AWS Services in Action

During the demo, these AWS services are invoked:

1. **Amazon Bedrock** → When predictions are generated
2. **Amazon Polly** → When phrases are spoken
3. **Amazon DynamoDB** → When user profile is loaded
4. **Amazon SNS** → When emergency is triggered
5. **AWS Lambda** → For all backend processing

---

## Questions Judges Might Ask

### Q: How does it learn individual patterns?
**A**: The system tracks phrase frequency, time-of-use patterns, and successful communications to personalize predictions over time.

### Q: What about privacy?
**A**: No conversation content is stored permanently. User controls all data retention. Architecture is HIPAA-ready.

### Q: How does it scale?
**A**: Fully serverless. From 1 user to 1 million users with no architecture changes.

### Q: What's the cost per user?
**A**: Approximately $0.01-0.05/month for active users within Free Tier.

### Q: Can it work without Bedrock?
**A**: Yes! Rule-based fallback ensures 100% uptime even if AI is unavailable.

---

## Contact

For demo support or technical questions:
- Email: demo@speakeasy.dev
- GitHub Issues: github.com/speakeasy-aac/speakeasy/issues

---

*Thank you for evaluating SpeakEasy for the AWS 10,000 AIdeas Competition!*
