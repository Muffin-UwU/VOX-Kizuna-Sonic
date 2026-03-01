# Kizuna Sonic – Project Context

## 1. Project Overview
**Kizuna Sonic (絆ソニック)** is a real‑time web application that bridges the communication gap between deaf owners and their blind dogs. It translates owner intent into consistent sonic commands (understandable by the dog) and dog vocalizations into visual alerts (perceivable by the owner). The project is being built for the VOX TOKYO Voice AI Hackathon for Social Impact.

**Tagline:** Bridging the silence between deaf owners and blind dogs.

---

## 2. Core Features (MVP)
- **Command Palette:** Three large buttons labelled in Japanese: 「止まれ」(Stop), 「おいで」(Come), 「危険」(Danger). Each plays a pre‑generated, identical sound (high tone, Japanese voice “Oide”, bell sound).
- **Visual Ear:** Real‑time waveform display when a sound plays; loud sound detection (bark) triggers a flashing visual alert.
- **Sonic Lighthouse:** A toggle that emits a steady high‑frequency ping at regular intervals to help the blind dog navigate the room.
- **Optional (if time permits): Sign‑to‑Sonic** – Camera‑based hand gesture recognition (MediaPipe) to trigger commands.

---

## 3. Technology Stack
| Component          | Technology                                      |
|--------------------|-------------------------------------------------|
| IDE                | TRAE (SOLO mode) / Cursor                       |
| Frontend Framework | Next.js latest stable with TypeScript and Tailwind CSS     |
| Monorepo           | npm workspaces                                  |
| Audio Playback     | Web Audio API (primary); Agora SDK (optional)   |
| Voice Synthesis    | MiniMax (pre‑generated sounds)                  |
| Bark Detection     | Web Audio API (AnalyserNode + volume threshold) |
| Gesture Recognition| MediaPipe Hands (`@mediapipe/tasks-vision`)     |
| State Management   | React Context + Zustand (if needed)             |
| Deployment         | Vercel (static hosting)                          |

---

## 4. Monorepo Structure
```

kizuna-sonic/
├── apps/
│   └── web/                 # Next.js frontend
│       ├── components/       # UI and feature components
│       ├── hooks/            # Custom React hooks
│       ├── pages/            # Next.js pages (index.tsx)
│       ├── public/           # Static assets (including pre‑generated sounds)
│       ├── styles/           # Global CSS (Tailwind)
│       ├── utils/            # Helper functions (audio, etc.)
│       └── context/          # React context providers
├── packages/
│   ├── audio-utils/          # Shared audio utilities (playback, oscillator, etc.)
│   └── types/                # Shared TypeScript types
├── package.json              # Root: defines workspaces
└── README.md

```

---

## 5. Key Components and Responsibilities
| Component            | File                             | Responsibility                                                                 |
|----------------------|----------------------------------|--------------------------------------------------------------------------------|
| CommandPalette       | `components/CommandPalette.tsx` | Renders three command buttons; triggers sound playback via callback.          |
| VisualEar            | `components/VisualEar.tsx`      | Draws waveform; displays bark alert; receives analyser and bark state.        |
| SonicLighthouse      | `components/SonicLighthouse.tsx`| Toggle switch; starts/stops periodic ping via oscillator.                     |
| GestureCanvas        | `components/GestureCanvas.tsx`  | (Optional) Shows camera feed, processes frames, emits gesture events.         |
| AppContext           | `context/AppContext.tsx`        | Global state (permissions, current command, bark flag, etc.).                 |
| useAudioContext      | `hooks/useAudioContext.ts`      | Initialises and returns a memoised AudioContext (created on user interaction).|
| useBarkDetection     | `hooks/useBarkDetection.ts`     | Monitors volume via AnalyserNode; returns boolean when bark threshold exceeded.|
| useGestureRecognition| `hooks/useGestureRecognition.ts`| (Optional) MediaPipe setup and frame processing; returns gesture events.      |
| audioUtils           | `packages/audio-utils/index.ts` | Core audio functions: load sound, play, create oscillator, start ping, etc.   |
| types                | `packages/types/index.ts`       | Shared TypeScript interfaces (Command, AppState, etc.).                       |

---

## 6. Important Constraints & Assumptions
- **8‑hour hackathon:** Only core features (P0) must be solid; optional features (P2) are nice‑to‑have.
- **Pre‑generated sounds:** All command sounds will be generated **before** the event using MiniMax and placed in `apps/web/public/sounds/` as `stop.mp3`, `come.mp3`, `danger.mp3`.
- **Permissions:** App must request microphone (and camera for gestures) with clear explanations.
- **Interruption handling:** If a new command is issued while a sound is playing, the current sound stops immediately and the new one plays. Bark alerts override any current playback.
- **Browser support:** Modern desktop browsers (Chrome, Edge, Safari). No Internet Explorer.
- **On‑device processing:** All audio and ML processing stays in the browser; no backend required.

---

## 7. Judging Criteria Alignment
| Criteria                | How Kizuna Sonic Addresses It                                                |
|-------------------------|------------------------------------------------------------------------------|
| Social Impact & Why Voice | Clear problem (deaf owner + blind dog); voice is the only shared channel.   |
| Voice UX                | Natural interaction via buttons; handles interruptions; compelling feedback. |
| Technical Implementation| Clean architecture; on‑device processing; optional Agora integration.        |
| Demo & Presentation     | Strong narrative; core features functional even if optional features not done.|

---

## 8. Getting Started
1. Install dependencies: `npm install` (from root).
2. Run the dev server: `npm run dev` (from `apps/web`).
3. Access the app at `http://localhost:3000`.
4. Place pre‑generated sound files in `apps/web/public/sounds/` before building.

---