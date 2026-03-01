Kizuna Sonic – Requirements Document

Project: Kizuna Sonic (絆ソニック)
Date: March 1, 2026
Version: 1.0
Status: Draft for Hackathon Development

---

1. Overview

Kizuna Sonic is a real‑time web application that bridges the communication gap between deaf owners and their blind dogs. It uses voice AI to translate owner intent into consistent sonic commands (understandable by the dog) and dog vocalizations into visual alerts (perceivable by the owner). The project is developed for the VOX TOKYO Voice AI Hackathon for Social Impact.

---

2. Problem Statement

· Deaf owners cannot hear their dog’s barks, whimpers, or the sounds produced by their own commands. This leaves them unaware of their dog’s needs or emotional state.
· Blind dogs rely heavily on sound for navigation and communication. They struggle with the inconsistency of human voice (pitch, volume, emotional variation), which causes anxiety and confusion. They also cannot see visual cues from their owner.
· The result is a breakdown in the bond between owner and dog, leading to safety risks, stress, and isolation for both.

---

3. Target Users

· Primary: Deaf or hard‑of‑hearing individuals who own dogs (especially blind or visually impaired dogs).
· Secondary: Blind dogs (through their owners/caregivers).
· Tertiary: Shelters, trainers, and caregivers working with deaf owners or blind dogs.

---

4. Goals and Objectives

· Primary Goal: Create a functional prototype that demonstrates a two‑way communication bridge using voice and visual interfaces.
· Secondary Goals:
  · Showcase the unique value of “voice” in solving this problem.
  · Deliver an intuitive, accessible user experience.
  · Implement core features within 8 hours, with optional extensions if time permits.
  · Align with hackathon judging criteria: Social Impact, Voice UX, Technical Implementation, and Presentation.

---

5. Functional Requirements

Priority Key

Priority Meaning
P0 Must‑have for MVP; without these the product fails its core purpose.
P1 Important but can be demoed in a basic form; adds significant value.
P2 Nice‑to‑have; implement only if time permits after P0/P1 are solid.
P3 Future enhancement; not part of the 8‑hour build.

---

P0 – Must-Have

ID Requirement Description
F‑P0‑01 Command Palette The app shall display at least three large, high‑contrast buttons labelled in Japanese: 「止まれ」(Stop), 「おいで」(Come), 「危険」(Danger).
F‑P0‑02 Sound Playback Pressing a button shall play a corresponding pre‑generated sound. Sounds must be identical each time (frequency‑stable).
F‑P0‑03 Sound Assets All command sounds shall be generated before the event using MiniMax to ensure consistency and avoid API latency.
F‑P0‑04 Microphone Access The app shall request microphone access with a clear explanation of why it’s needed (to detect dog barks).
F‑P0‑05 Visual Ear – Waveform While a sound is playing, a real‑time waveform visualizer shall be displayed to give visual feedback of the emitted sound.
F‑P0‑06 Bark Detection The app shall continuously monitor microphone input. When a loud sound (exceeding a threshold for a short duration) is detected, it shall trigger a prominent visual alert (e.g., flashing red banner with “🐕 BARK DETECTED”).
F‑P0‑07 State Indication The app shall indicate its current state: “Listening” (idle, monitoring mic) or “Playing command”.

---

P1 – Should-Have

ID Requirement Description
F‑P1‑01 Sonic Lighthouse A toggle switch shall enable a steady high‑frequency ping (e.g., 15kHz) emitted at regular intervals (every 2 seconds) to help the blind dog navigate the room.
F‑P1‑02 Adjustable Bark Threshold A simple slider or preset shall allow the user to adjust the sensitivity of bark detection (to reduce false positives).
F‑P1‑03 Interruption Handling – Commands If a new command is issued while a previous sound is still playing, the current sound shall stop immediately and the new sound shall play.
F‑P1‑04 Interruption Handling – Bark Alert If a bark is detected while a command sound is playing, the visual alert shall still appear (override). The waveform may continue, but the alert must be clearly visible.
F‑P1‑05 Permission Handling If microphone or camera permissions are denied, the app shall display a helpful error message and degrade gracefully (e.g., disable features that depend on that permission).
F‑P1‑06 Onboarding Screen The first time the app is loaded, a simple screen shall explain the purpose and how to use the app (icons + Japanese text).
F‑P1‑07 Visual Feedback on Button Press Buttons shall change appearance (e.g., highlight) when pressed and while the associated sound is playing.

---

P2 – Nice-to-Have (Optional / Time-Permitting)

ID Requirement Description
F‑P2‑01 Sign‑to‑Sonic (Gesture Commands) Using the camera and MediaPipe Hands, the app shall detect predefined hand gestures and trigger corresponding sounds.
F‑P2‑02 Supported Gestures Open palm → Stop (high tone); Pointing → Come (Japanese voice “Oide”); Hand to mouth → Eat (bell sound).
F‑P2‑03 Gesture Confidence Display The app shall show the confidence level of detected gestures (for debugging/demo transparency).
F‑P2‑04 Low‑Performance Fallback If gesture recognition cannot run at an acceptable framerate (e.g., <5 fps), the feature shall disable itself automatically with a notification.
F‑P2‑05 Agora Integration Use Agora’s real‑time audio streaming for command playback instead of simple Web Audio, to demonstrate low‑latency infrastructure and sponsor usage.
F‑P2‑06 Sound Classification (Optional) Attempt to distinguish between bark, whimper, and growl using a simple ML model (if feasible and time allows).

---

P3 – Future Enhancements (Not in MVP)

ID Requirement Description
F‑P3‑01 Vector Database Storage Store sound frequency profiles in Zilliz/Milvus to enable personalised sound adaptation for each dog.
F‑P3‑02 Mobile App Native iOS/Android version with improved camera and microphone access.
F‑P3‑03 IoT Integration Connect to wearable devices (e.g., vibrating collar for deaf owner, GPS for dog).
F‑P3‑04 Multi‑dog Support Manage profiles for multiple dogs with different sound preferences.

---

6. Non‑Functional Requirements

ID Requirement Target / Constraint
NFR‑01 Performance UI remains responsive (<100ms delay) during audio playback. Gesture detection (if enabled) should not block the main thread (use Web Workers or frame skipping).
NFR‑02 Compatibility Works on latest Chrome, Edge, Safari (desktop). Camera and microphone required for full functionality.
NFR‑03 Usability High‑contrast UI (e.g., dark background with bright text/icons). Buttons large enough for easy touch/click.
NFR‑04 Latency Sound playback starts within 50ms of button press. Bark alert appears within 200ms of sound onset.
NFR‑05 Reliability App should not crash on permission denial; provide clear error messages and fallback UI.
NFR‑06 Accessibility UI should be navigable by keyboard? (Nice but not required for MVP). Use semantic HTML where possible.
NFR‑07 Local Processing All audio processing (bark detection, gesture recognition) stays on‑device; no cloud upload of raw audio (except Agora streaming if used).
NFR‑08 Browser Permissions App must request permissions only when needed and explain why.

---

7. Technical Stack

Component Technology Justification
IDE Cursor (primary) + TRAE (secondary) Fast AI‑assisted coding; TRAE available for complex refactoring if needed.
Frontend Framework Next.js (React) Rapid development, easy routing, component‑based.
Audio Playback Web Audio API + Agora SDK Web Audio for simple playback; Agora for low‑latency streaming (optional P2).
Voice Synthesis MiniMax (pre‑generated) Consistent, emotionally expressive Japanese voice.
Bark Detection Web Audio API (AnalyserNode) + volume threshold Simple, fast, on‑device.
Gesture Recognition MediaPipe Hands (via @mediapipe/tasks-vision) On‑device, pre‑built gesture models.
State Management React Context + Zustand (if needed) Lightweight, sufficient.
Styling Tailwind CSS Rapid UI development.
Monorepo Structure npm/yarn workspaces Organises code for AI generation and team collaboration.
Deployment Vercel (or similar) Quick hosting for demo.

---

8. Constraints and Assumptions

· Time: 8 hours of active development on March 1, 2026.
· Team: 2 developers (one more may join).
· Pre‑generation: All command sounds will be generated using MiniMax before the event to avoid API delays/limits.
· Sponsor tools: We aim to integrate Agora (for audio streaming) to showcase sponsor usage; if time is short, a simpler Web Audio implementation suffices.
· Gesture recognition: Assumes a laptop with a decent camera and sufficient processing power. If performance is poor, we will simulate gestures in the demo.
· Internet: Required for loading MediaPipe libraries and Agora SDK (if used), but core functionality can work offline once loaded.
· Browser support: Modern browsers only (Chrome, Edge, Safari). No Internet Explorer.

---

9. Success Criteria for the Demo

· The app loads and requests permissions.
· User can press any of the three command buttons and hear the corresponding sound.
· The waveform visualiser animates while the sound plays.
· A loud noise (clap or simulated bark) triggers a flashing visual alert.
· The Sonic Lighthouse can be toggled on/off and emits a periodic ping.
· (Optional) If gesture recognition is implemented, showing a hand gesture triggers the correct sound.
· The 3‑minute pitch clearly communicates the problem, the solution, and the impact.

---

10. Appendix

Glossary

· Kizuna (絆): Japanese for “bond” or “connection.”
· Sonic Lighthouse: A periodic high‑frequency ping to aid dog navigation.
· Visual Ear: The waveform + alert component that lets the owner “see” sound.
· Sign‑to‑Sonic: Gesture recognition feature (optional).

---

End of Requirements Document

---

