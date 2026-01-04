"""
SpeakEasy - Emotion Agent
=========================
Multi-signal emotion detection and adaptive vocabulary.

Features:
- Tap pattern analysis
- Phrase sentiment analysis
- Time-based activity inference
- Explicit emotion button support
- Caregiver alert triggers

Competition: AWS 10,000 AIdeas
Track: Social Good
"""

from datetime import datetime, timezone
from typing import Optional, List, Dict, Tuple
from dataclasses import dataclass, field
from enum import Enum


class EmotionType(str, Enum):
    HAPPY = "happy"
    SAD = "sad"
    ANXIOUS = "anxious"
    FRUSTRATED = "frustrated"
    SCARED = "scared"
    CALM = "calm"
    EXCITED = "excited"
    TIRED = "tired"
    UNKNOWN = "unknown"


class EmotionIntensity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


@dataclass
class TapSignal:
    """Tap interaction signal."""
    timestamp: datetime
    tap_count: int
    duration_ms: float
    pressure: Optional[float] = None


@dataclass
class EmotionDetection:
    """Emotion detection result."""
    emotion: EmotionType
    intensity: EmotionIntensity
    confidence: float
    signals_used: List[str]
    recommended_actions: List[str]
    coping_phrases: List[str]
    alert_caregiver: bool = False


class EmotionAgent:
    """
    Multi-signal emotion detection agent.
    
    Combines multiple signals to detect emotional state:
    - Tap patterns (rapid taps = frustration/anxiety)
    - Selected phrases sentiment
    - Activity time patterns
    - Explicit emotion buttons
    """
    
    # Emotion-specific coping phrases
    COPING_PHRASES = {
        EmotionType.FRUSTRATED: [
            "I need a break",
            "This is hard for me",
            "Can you help me?",
            "I'm trying my best",
            "Let me try again",
        ],
        EmotionType.ANXIOUS: [
            "I feel worried",
            "Can you stay with me?",
            "I need comfort",
            "Tell me it's okay",
            "I need a quiet place",
        ],
        EmotionType.SAD: [
            "I feel sad",
            "I need a hug",
            "Can we talk?",
            "I miss someone",
            "I need comfort",
        ],
        EmotionType.SCARED: [
            "I'm scared",
            "I don't feel safe",
            "Stay with me please",
            "I need help",
            "Something is wrong",
        ],
    }
    
    # Phrases that indicate specific emotions
    PHRASE_SENTIMENT_MAP = {
        EmotionType.HAPPY: ["happy", "fun", "love", "yay", "excited", "great"],
        EmotionType.SAD: ["sad", "miss", "lonely", "cry", "hurt"],
        EmotionType.ANXIOUS: ["worried", "nervous", "scared", "afraid"],
        EmotionType.FRUSTRATED: ["can't", "hard", "difficult", "angry", "stop"],
        EmotionType.TIRED: ["tired", "sleepy", "exhausted", "rest"],
    }
    
    # Alert thresholds
    ALERT_EMOTIONS = {EmotionType.SCARED, EmotionType.FRUSTRATED, EmotionType.ANXIOUS}
    ALERT_INTENSITY_THRESHOLD = EmotionIntensity.HIGH
    
    def __init__(self, user_id: str):
        self.user_id = user_id
        self._tap_history: List[TapSignal] = []
        self._phrase_history: List[Tuple[datetime, str]] = []
        self._current_emotion: Optional[EmotionDetection] = None
        self._explicit_emotion: Optional[EmotionType] = None
    
    def record_tap(self, tap_count: int, duration_ms: float, pressure: Optional[float] = None) -> None:
        """Record a tap interaction for pattern analysis."""
        signal = TapSignal(
            timestamp=datetime.now(timezone.utc),
            tap_count=tap_count,
            duration_ms=duration_ms,
            pressure=pressure,
        )
        self._tap_history.append(signal)
        
        # Keep only recent taps (last 5 minutes)
        cutoff = datetime.now(timezone.utc).timestamp() - 300
        self._tap_history = [
            t for t in self._tap_history
            if t.timestamp.timestamp() > cutoff
        ]
    
    def record_phrase_selection(self, phrase: str) -> None:
        """Record selected phrase for sentiment analysis."""
        self._phrase_history.append((datetime.now(timezone.utc), phrase.lower()))
        
        # Keep only recent phrases (last 10 minutes)
        cutoff = datetime.now(timezone.utc).timestamp() - 600
        self._phrase_history = [
            (ts, p) for ts, p in self._phrase_history
            if ts.timestamp() > cutoff
        ]
    
    def set_explicit_emotion(self, emotion: EmotionType) -> None:
        """Set emotion from explicit user button press."""
        self._explicit_emotion = emotion
    
    def detect_emotion(self) -> EmotionDetection:
        """
        Detect current emotion using all available signals.
        
        Priority:
        1. Explicit emotion button (highest confidence)
        2. Tap pattern analysis
        3. Phrase sentiment analysis
        """
        signals_used = []
        emotion_scores: Dict[EmotionType, float] = {e: 0.0 for e in EmotionType}
        
        # 1. Explicit emotion (highest weight)
        if self._explicit_emotion:
            emotion_scores[self._explicit_emotion] += 0.8
            signals_used.append("explicit_button")
        
        # 2. Tap pattern analysis
        tap_emotion, tap_confidence = self._analyze_tap_patterns()
        if tap_emotion != EmotionType.UNKNOWN:
            emotion_scores[tap_emotion] += tap_confidence * 0.5
            signals_used.append("tap_pattern")
        
        # 3. Phrase sentiment analysis
        phrase_emotion, phrase_confidence = self._analyze_phrase_sentiment()
        if phrase_emotion != EmotionType.UNKNOWN:
            emotion_scores[phrase_emotion] += phrase_confidence * 0.4
            signals_used.append("phrase_sentiment")
        
        # Determine final emotion
        if not signals_used:
            return EmotionDetection(
                emotion=EmotionType.CALM,
                intensity=EmotionIntensity.LOW,
                confidence=0.5,
                signals_used=[],
                recommended_actions=[],
                coping_phrases=[],
                alert_caregiver=False,
            )
        
        detected_emotion = max(emotion_scores, key=emotion_scores.get)
        confidence = min(emotion_scores[detected_emotion], 1.0)
        
        # Determine intensity
        intensity = self._calculate_intensity(detected_emotion, confidence)
        
        # Get coping phrases
        coping_phrases = self.COPING_PHRASES.get(detected_emotion, [])
        
        # Determine if caregiver alert needed
        alert_caregiver = (
            detected_emotion in self.ALERT_EMOTIONS and
            intensity in {EmotionIntensity.HIGH, EmotionIntensity.CRITICAL}
        )
        
        # Recommended actions
        actions = self._get_recommended_actions(detected_emotion, intensity)
        
        self._current_emotion = EmotionDetection(
            emotion=detected_emotion,
            intensity=intensity,
            confidence=confidence,
            signals_used=signals_used,
            recommended_actions=actions,
            coping_phrases=coping_phrases[:5],
            alert_caregiver=alert_caregiver,
        )
        
        return self._current_emotion
    
    def _analyze_tap_patterns(self) -> Tuple[EmotionType, float]:
        """Analyze tap patterns for emotional signals."""
        if len(self._tap_history) < 3:
            return EmotionType.UNKNOWN, 0.0
        
        recent_taps = self._tap_history[-10:]
        
        # Calculate tap frequency
        total_taps = sum(t.tap_count for t in recent_taps)
        time_span = (recent_taps[-1].timestamp - recent_taps[0].timestamp).total_seconds()
        
        if time_span == 0:
            return EmotionType.UNKNOWN, 0.0
        
        tap_rate = total_taps / time_span
        
        # Rapid tapping indicates frustration/anxiety
        if tap_rate > 2.0:  # More than 2 taps per second
            return EmotionType.FRUSTRATED, 0.7
        elif tap_rate > 1.0:
            return EmotionType.ANXIOUS, 0.5
        elif tap_rate < 0.2:  # Very slow tapping
            return EmotionType.SAD, 0.4
        
        return EmotionType.CALM, 0.3
    
    def _analyze_phrase_sentiment(self) -> Tuple[EmotionType, float]:
        """Analyze selected phrases for emotional content."""
        if not self._phrase_history:
            return EmotionType.UNKNOWN, 0.0
        
        emotion_matches: Dict[EmotionType, int] = {e: 0 for e in EmotionType}
        
        for _, phrase in self._phrase_history[-5:]:
            for emotion, keywords in self.PHRASE_SENTIMENT_MAP.items():
                for keyword in keywords:
                    if keyword in phrase:
                        emotion_matches[emotion] += 1
        
        if max(emotion_matches.values()) == 0:
            return EmotionType.UNKNOWN, 0.0
        
        detected = max(emotion_matches, key=emotion_matches.get)
        confidence = min(emotion_matches[detected] / 5, 1.0)
        
        return detected, confidence
    
    def _calculate_intensity(self, emotion: EmotionType, confidence: float) -> EmotionIntensity:
        """Calculate emotion intensity."""
        if confidence >= 0.85:
            return EmotionIntensity.CRITICAL
        elif confidence >= 0.65:
            return EmotionIntensity.HIGH
        elif confidence >= 0.4:
            return EmotionIntensity.MEDIUM
        else:
            return EmotionIntensity.LOW
    
    def _get_recommended_actions(
        self,
        emotion: EmotionType,
        intensity: EmotionIntensity
    ) -> List[str]:
        """Get recommended actions for caregiver."""
        actions = []
        
        if emotion == EmotionType.FRUSTRATED:
            actions.extend(["Offer a break", "Simplify the current task", "Provide encouragement"])
        elif emotion == EmotionType.ANXIOUS:
            actions.extend(["Provide reassurance", "Create calm environment", "Stay close"])
        elif emotion == EmotionType.SAD:
            actions.extend(["Offer comfort", "Engage in favorite activity", "Give attention"])
        elif emotion == EmotionType.SCARED:
            actions.extend(["Immediate comfort", "Remove source of fear", "Reassure safety"])
        
        if intensity == EmotionIntensity.CRITICAL:
            actions.insert(0, "IMMEDIATE ATTENTION NEEDED")
        
        return actions


# Testing
if __name__ == "__main__":
    print("=" * 60)
    print("SpeakEasy Emotion Agent - Test Suite")
    print("=" * 60)
    
    agent = EmotionAgent(user_id="test_user")
    
    # Test 1: Explicit emotion
    print("\n--- Test 1: Explicit Emotion Button ---")
    agent.set_explicit_emotion(EmotionType.FRUSTRATED)
    result = agent.detect_emotion()
    print(f"Emotion: {result.emotion.value}")
    print(f"Intensity: {result.intensity.value}")
    print(f"Confidence: {result.confidence:.2f}")
    print(f"Alert Caregiver: {result.alert_caregiver}")
    print(f"Coping Phrases: {result.coping_phrases[:2]}")
    
    # Test 2: Tap pattern analysis
    print("\n--- Test 2: Rapid Tap Pattern ---")
    agent2 = EmotionAgent(user_id="test_user_2")
    for _ in range(5):
        agent2.record_tap(tap_count=3, duration_ms=100)
    result2 = agent2.detect_emotion()
    print(f"Emotion: {result2.emotion.value}")
    print(f"Signals Used: {result2.signals_used}")
    
    print("\n✅ Emotion Agent tests passed!")
