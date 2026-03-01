Kizuna Sonic – Design Document

Project: Kizuna Sonic (絆ソニック)
Date: March 1, 2026
Version: 1.0
Status: Design for Hackathon Implementation

---

1. Overview

This document describes the design of Kizuna Sonic, a web application that bridges communication between deaf owners and blind dogs. It covers system architecture, component design, state management, audio processing, gesture recognition (optional), UI/UX, and key interaction flows. The design aligns with the requirements and technology stack chosen for the 8‑hour hackathon.

---

2. System Architecture

High‑Level Architecture

Kizuna Sonic is a client‑side web application. All processing happens in the browser; no backend server is required for the MVP (except for static hosting and optional Agora signalling). This ensures low latency and privacy.

┌─────────────────────────────────────────────┐
│              Browser (Client)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   React  │  │  Audio   │  │  Camera  │  │
│  │    UI    │  │  Context │  │  Stream  │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │             │         │
│  ┌────▼─────────────▼─────────────▼─────┐  │
│  │         Core Application Logic        │  │
│  │  - Command handling                    │  │
│  │  - Bark detection                       │  │
│  │  - Gesture recognition (optional)       │  │
│  │  - State management                      │  │
│  └─────────────────────────────────────────┘  │
│  │                                           │
│  ┌─────────────────────────────────────────┐  │
│  │         External Services (optional)    │  │
│  │  - Agora RTC (for low‑latency audio)    │  │
│  └─────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

Key Design Principles

· Offline‑first: Core functionality (button commands, bark detection) works without internet after initial load.
· On‑device processing: All ML (MediaPipe) and audio analysis run locally; no data leaves the browser.
· Modularity: Features are encapsulated in separate modules for easy parallel development.
· Accessibility: High‑contrast UI, large touch targets, clear visual feedback.

---

3. Component Architecture

We use a monorepo structure with a Next.js application under apps/web. Components are organised as follows:

apps/web/
├── components/
│   ├── CommandPalette.tsx       # Buttons for commands
│   ├── VisualEar.tsx            # Waveform + alert display
│   ├── SonicLighthouse.tsx      # Toggle + ping control
│   ├── GestureCanvas.tsx        # (Optional) Camera preview + overlay
│   ├── PermissionRequest.tsx    # Handles mic/camera permissions
│   ├── Onboarding.tsx           # Instructions overlay
│   └── UI/
│       ├── Button.tsx            # Reusable high‑contrast button
│       ├── AlertBanner.tsx       # Bark alert component
│       └── Slider.tsx            # Threshold adjuster
├── hooks/
│   ├── useAudioContext.ts        # Initialises Web Audio
│   ├── useBarkDetection.ts       # Volume monitoring logic
│   ├── useGestureRecognition.ts  # MediaPipe integration
│   └── useAgora.ts               # (Optional) Agora client
├── utils/
│   ├── audio.ts                  # Play sound, create oscillator
│   ├── constants.ts              # Sound file paths, thresholds
│   └── gestures.ts               # Gesture mapping logic
├── pages/
│   └── index.tsx                 # Main app page
└── styles/
    └── globals.css               # Tailwind + custom styles

Component Responsibilities

· CommandPalette: Renders buttons; on click, calls playSound(command) from audio utils and updates UI state.
· VisualEar: Subscribes to audio analyser node; draws waveform via canvas; listens for bark events and shows alert.
· SonicLighthouse: Toggle switch; when on, uses setInterval to play a ping via oscillator.
· GestureCanvas: Displays camera feed, optionally draws hand landmarks; emits gesture events.
· PermissionRequest: Manages browser permissions; shows fallback UI if denied.

---

4. State Management

We use React Context for global state, supplemented by Zustand if complexity grows. The main state slices:

typescript
interface AppState {
  // Permissions
  micPermission: 'prompt' | 'granted' | 'denied';
  cameraPermission: 'prompt' | 'granted' | 'denied';
  
  // Audio
  isPlaying: boolean;               // true if any command/lighthouse sound active
  currentCommand: string | null;    // 'stop' | 'come' | 'danger' | 'lighthouse'
  barkDetected: boolean;            // triggers alert
  barkThreshold: number;            // 0-1 sensitivity
  
  // Gesture (optional)
  gestureEnabled: boolean;
  lastGesture: string | null;       // 'open_palm' | 'pointing' | 'hand_to_mouth'
  gestureConfidence: number;
  
  // UI
  showOnboarding: boolean;
  lighthouseActive: boolean;
}

Actions (via Context dispatch or Zustand) update these states. Components react accordingly.

---

5. Audio Pipeline

Web Audio Context

· A single AudioContext is created on user interaction (to comply with browser autoplay policies).
· An AnalyserNode is connected to the destination (for waveform) and to the microphone input (for bark detection).

Playback

· Command sounds: Pre‑generated MP3 files loaded via AudioBuffer or Howl (simpler). We use AudioBuffer for precise control.
· Sonic lighthouse: A periodic OscillatorNode (sine wave, high frequency) started/stopped via toggle.

Bark Detection

· Microphone stream → AnalyserNode → get volume (average of frequency data).
· If volume > barkThreshold for > 100ms, trigger barkDetected = true.
· After 1 second without exceeding threshold, reset barkDetected.

Agora Integration (Optional P2)

· Replace simple playback with Agora RTC streaming to demonstrate low‑latency and sponsor usage.
· Agora client publishes a custom audio track (from buffer/oscillator) to a channel; no need for real conversation.

---

6. Gesture Recognition Pipeline (Optional)

· Use MediaPipe Gesture Recognizer task (via @mediapipe/tasks-vision).
· Camera stream → passed to recognizer every N frames (e.g., every 3rd frame) to reduce CPU load.
· On recognition result, map gesture category to command and trigger sound if confidence > threshold.
· Overlay hand landmarks on video canvas for visual feedback.

Gesture Mapping

MediaPipe Gesture Our Command Sound
Open_Palm Stop high tone
Pointing_Up Come “Oide” voice
(custom) HandToMouth Eat bell sound

Custom logic for HandToMouth: check if thumb tip landmark y‑coordinate is near mouth region (normalised).

---

7. UI/UX Design

Visual Style

· High contrast: Dark background (#0A0A0A) with bright accents (#FFD700, #4CAF50, #F44336). White text.
· Large, tappable buttons: Minimum 64x64px, clear labels in Japanese.
· Clear visual feedback: Button highlight on press, waveform animation, flashing red banner on bark.

Layout (Desktop First)

┌─────────────────────────────────────────┐
│  Kizuna Sonic                 [Lighthouse] │
├─────────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐                │
│  │ 止まれ│ │ おいで│ │ 危険 │                │
│  └─────┘ └─────┘ └─────┘                │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │          Waveform Display          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  [Bark Threshold: ●──────○]  (slider)   │
│                                         │
│  🐕 BARK DETECTED! (flashing banner)    │
└─────────────────────────────────────────┘

Onboarding Flow

1. App loads → shows overlay explaining purpose and requesting permissions.
2. User grants mic (and optionally camera) → UI appears.
3. If camera granted, gesture toggle appears; otherwise gesture section hidden.

Accessibility

· All interactive elements focusable via keyboard (tabindex).
· ARIA labels for buttons.
· Visual alerts also accompanied by subtle vibration? (Not possible on web, but we can use screen reader announcements).

---

8. Data Flow

Command Button Press

User clicks "止まれ"
    │
    ▼
Dispatch action: { type: 'PLAY_COMMAND', command: 'stop' }
    │
    ▼
AudioUtils.playSound('stop.mp3')
    │
    ▼
AnalyserNode connected → waveform updates via requestAnimationFrame
    │
    ▼
State: isPlaying = true, currentCommand = 'stop'
    │
    ▼
When sound ends → isPlaying = false

Bark Detection Loop

Microphone stream → AnalyserNode (every frame)
    │
    ▼
Get volume average
    │
    ▼
If volume > threshold for > 100ms
    │
    ▼
Set barkDetected = true
    │
    ▼
VisualEar shows flashing banner
    │
    ▼
After 1s silence, reset barkDetected = false

Gesture Recognition Loop (Optional)

Camera frame (every 3rd frame) → MediaPipe recognizer
    │
    ▼
Recognizer returns gesture candidates
    │
    ▼
If confidence > 0.7 and gesture matches mapping
    │
    ▼
Dispatch action to play corresponding command sound
    │
    ▼
Update UI with gesture feedback

---

9. Sequence Diagrams

Button Press with Bark Interruption

User          UI          AudioUtils    BarkDetector
  │            │              │              │
  │ Click Stop │              │              │
  ├───────────>│              │              │
  │            │ play('stop') │              │
  │            ├─────────────>│              │
  │            │              │ start playing│
  │            │              ├─────────────>│ (waveform)
  │            │              │              │
  │            │              │   (bark occurs)
  │            │              │<─────────────│
  │            │              │              │ detect volume spike
  │            │              │              ├───┐
  │            │              │              │   │ set barkDetected=true
  │            │              │              │<──┘
  │            │ showAlert()   │              │
  │            │<──────────────│              │
  │            │              │              │
  │            │ continue playing            │
  │            │              │              │

Gesture Trigger

User        Camera     MediaPipe    AudioUtils    UI
  │           │            │            │          │
  │ show palm │            │            │          │
  ├──────────>│            │            │          │
  │           │ frame      │            │          │
  │           ├───────────>│            │          │
  │           │            │ recognize  │          │
  │           │            ├───┐        │          │
  │           │            │   │ "Open_Palm" 0.85 │
  │           │            │<──┘        │          │
  │           │            │ play('stop')│          │
  │           │            ├───────────>│          │
  │           │            │            │ play sound│
  │           │            │            ├─────────>│ waveform
  │           │            │            │          │

---

10. Design Decisions

Why No Backend?

· Simplicity and speed for hackathon.
· Privacy (no audio leaves device).
· Low latency.

Why Pre‑generate Sounds?

· Avoid TTS latency and API dependency.
· Ensure perfect consistency for dog training.
· Use MiniMax for high‑quality Japanese voice.

Why MediaPipe for Gestures?

· On‑device, free, well‑documented.
· Pre‑trained models for common gestures.
· Can run at reasonable speed on modern laptops.

Why High Contrast?

· Primary users may have low vision themselves (deaf owners can also have visual impairments).
· Aligns with accessibility best practices.

Why Agora (Optional)?

· Demonstrates use of sponsor technology.
· Ultra‑low latency streaming could be used for future multi‑device features.
· Simple integration with their SDK.

---

11. Appendix

Technology Versions

· Next.js latest stable
· React latest
· Tailwind CSS 3
· MediaPipe Tasks Vision 0.10.8 (use stable version if possible)
· Agora RTC SDK 4.x (if used)

Environment Variables (if any)

NEXT_PUBLIC_AGORA_APP_ID=xxx   (optional)

Build & Run Commands

bash
npm install
npm run dev

---

End of Design Document

---


