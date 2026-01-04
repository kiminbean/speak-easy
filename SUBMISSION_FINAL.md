# SpeakEasy: Breaking the $12,000 Barrier to Communication

## AWS 10,000 AIdeas Competition | Social Good Track

---

## Executive Summary

**70 million people worldwide cannot speak.** They live with autism, cerebral palsy, ALS, or stroke-related conditions that affect their ability to communicate verbally.

Traditional AAC (Augmentative and Alternative Communication) devices cost **$8,000-$15,000**, require months of training, and offer limited adaptability.

**SpeakEasy is different.** Using Amazon Bedrock's Claude 3 Haiku and AWS serverless technologies, we've created an AI-powered communication system that:

- Costs **$0** for users (Free Tier optimized)
- Predicts what users want to say based on **context**
- Works **offline** when connectivity fails
- Alerts caregivers during **emergencies**

This isn't incremental improvement. It's a fundamental reimagining of how technology can give voice to the voiceless.

---

## The Problem We're Solving

### The Communication Divide

Imagine being unable to say "I'm hungry" when you're hungry. Or "It hurts" when something hurts. Or "Help" when you're scared.

This is the reality for:
- **5.4 million** Americans with autism
- **764,000** people with cerebral palsy in the US alone
- **30,000** Americans living with ALS
- **795,000** stroke survivors annually who experience communication impairment

### The Economic Barrier

The AAC device market is dominated by expensive, proprietary solutions:

| Device | Cost | Update Cycle |
|--------|------|--------------|
| Tobii Dynavox | $8,000 - $15,000 | New device required |
| Prentke Romich | $6,000 - $12,000 | Annual subscription |
| iPad + Apps | $1,000 - $2,000 | Limited AI capability |

**For a family earning median income, a $12,000 device represents over 4 months of pre-tax earnings.**

### Why Current Solutions Fall Short

1. **Static vocabularies** - Users must manually navigate through hundreds of pre-programmed phrases
2. **No context awareness** - The same phrases are offered whether at home or in a hospital
3. **No learning** - Devices don't adapt to individual communication patterns
4. **No emotional intelligence** - Cannot recognize or respond to distress

---

## Our Solution: SpeakEasy

### Core Innovation: Context-Aware AI Prediction

SpeakEasy uses Amazon Bedrock's Claude 3 Haiku to predict what users want to say based on multiple contextual signals:

```
┌─────────────────────────────────────────────────────┐
│               CONTEXTUAL PREDICTION                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│   [Time: 7:30 AM] + [Location: Home] + [Mood: Calm] │
│                        ↓                             │
│              Amazon Bedrock (Claude 3)               │
│                        ↓                             │
│   Predictions:                                       │
│   ├── "Good morning" (95% confidence)               │
│   ├── "I'm hungry" (92% confidence)                 │
│   ├── "Can I have breakfast?" (88% confidence)      │
│   └── "I need to go bathroom" (85% confidence)      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Key Features

#### 1. Multi-Agent Architecture
We use **Strands Agents SDK** to orchestrate specialized AI agents:

| Agent | Responsibility |
|-------|----------------|
| **Prediction Agent** | Core phrase prediction using Bedrock |
| **Context Agent** | Environment and time detection |
| **Emotion Agent** | Multi-signal emotional state analysis |
| **Speech Agent** | Natural voice synthesis with Polly |
| **Notification Agent** | Caregiver emergency alerts |

#### 2. Emotion-Aware Communication
SpeakEasy detects emotional states through:
- Tap pattern analysis (rapid taps = frustration)
- Phrase sentiment tracking
- Explicit emotion buttons

When distress is detected:
```
Frustration Detected (High Intensity)
         ↓
Actions:
├── Load coping phrases ("I need a break", "This is hard")
├── Modify voice (slower, softer)
└── Alert caregiver if critical
```

#### 3. Progressive Web App (PWA)
Full offline functionality ensures communication is never interrupted:
- Service Worker caches essential phrases
- Background sync when connectivity returns
- Installable on any device

#### 4. Accessibility First
Built to WCAG 2.1 AA standards:
- Minimum 44x44px touch targets
- High contrast color options
- Full keyboard navigation
- Screen reader compatible

---

## Technical Implementation

### AWS Services Used

| Service | Purpose | Free Tier Usage |
|---------|---------|-----------------|
| **Amazon Bedrock** | Claude 3 Haiku for predictions | ~$0.001/prediction |
| **AWS Lambda** | Serverless compute | 1M requests free |
| **Amazon DynamoDB** | User profiles, conversation history | 25GB free |
| **Amazon Polly** | Neural voice synthesis | 5M chars free |
| **Amazon S3** | Audio caching, frontend hosting | 5GB free |
| **Amazon SNS** | Push notifications | 1M free |
| **Amazon SES** | Email alerts | 62K free |

### Architecture Highlights

1. **Hybrid Prediction System**
   - AI predictions when available
   - Rule-based fallback for offline/low-latency needs
   - <200ms response time target

2. **Caching Strategy**
   - Context-based cache keys
   - Audio pre-generation for common phrases
   - 7-day TTL for audio files

3. **Privacy by Design**
   - No conversation content stored permanently
   - User-controlled data retention
   - HIPAA-ready architecture

---

## Impact & Scalability

### Immediate Impact
- **Zero cost barrier** for families
- **Instant deployment** (no device shipping)
- **Works on existing devices** (smartphones, tablets)

### Scaling Potential

| Scale | Users | Monthly Cost |
|-------|-------|--------------|
| Pilot | 100 | ~$10 |
| Regional | 10,000 | ~$500 |
| National | 1,000,000 | ~$25,000 |

### Social Return on Investment
For every $1 spent on SpeakEasy infrastructure:
- **$120 saved** in traditional AAC costs
- **Immeasurable value** in human dignity and independence

---

## What Makes This Different

### Novel Use of AWS AI

**This is the first AAC system to combine:**
1. Amazon Bedrock's Claude 3 for contextual understanding
2. Strands Agents for multi-agent orchestration
3. Amazon Polly Neural for emotional voice modulation
4. Real-time caregiver notifications via SNS

### Why It Will Work

| Challenge | Our Solution |
|-----------|--------------|
| Cost | Free Tier optimized, pay-per-use model |
| Latency | Hybrid AI + rules, <200ms |
| Offline | Full PWA with Service Worker |
| Adoption | No training needed, intuitive interface |
| Trust | Transparent AI, caregiver oversight |

---

## Conclusion

**The voice is a human right, not a luxury.**

SpeakEasy proves that AWS AI tools can do more than optimize business processes—they can restore fundamental human capabilities to those who've lost them.

Traditional AAC costs $12,000. SpeakEasy costs $0.

**That's not a feature. That's a revolution.**

---

## Resources

- **GitHub Repository**: [github.com/speakeasy-aac/speakeasy](https://github.com)
- **Live Demo**: [speakeasy-demo.aws.dev](https://speakeasy-demo.aws.dev)
- **Technical Documentation**: [docs.speakeasy.dev](https://docs.speakeasy.dev)

---

*Built with ❤️ for the AWS 10,000 AIdeas Competition*

**#AWS10000AIdeas #SocialGood #Accessibility #AI4Good #AACRevolution**
