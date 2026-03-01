# Implementation Plan: 3rd Party API Integrations

This plan outlines the steps to integrate **MediaPipe** (for Gesture Recognition) and **Agora** (for Real-time Audio) into the Kizuna Sonic application.

## 1. MediaPipe Hands Integration (Sign-to-Sonic)
**Goal:** Enable users to trigger commands ("Stop", "Come", "Danger") using hand gestures via the webcam.

- [ ] **Install Dependencies**: Add `@mediapipe/tasks-vision` to `apps/web`.
- [ ] **Asset Setup**: 
    - Configure the `gesture_recognizer.task` model file (download or reference URL).
    - Ensure it is accessible in `apps/web/public/models/`.
- [ ] **Hook Implementation (`useGestureRecognition`)**:
    - Initialize `GestureRecognizer`.
    - Process video frames from `navigator.mediaDevices.getUserMedia`.
    - Map detected gestures to commands:
        - `Open_Palm` -> **Stop**
        - `Pointing_Up` -> **Come**
        - `Closed_Fist` (or custom) -> **Danger**
- [ ] **Component Implementation (`GestureCanvas`)**:
    - Render video feed and overlay hand landmarks.
    - Provide visual feedback for detected gestures.
- [ ] **Integration**: Connect `useGestureRecognition` to `AppContext` to trigger `playCommand`.

## 2. Agora RTC Integration (Live Audio Bridge)
**Goal:** Enable low-latency audio streaming for remote monitoring/commanding (Sponsor Requirement).

- [ ] **Install Dependencies**: Add `agora-rtc-sdk-ng` to `apps/web`.
- [ ] **Environment Setup**:
    - Create `.env.local` for `NEXT_PUBLIC_AGORA_APP_ID`.
- [ ] **Hook Implementation (`useAgora`)**:
    - Initialize Agora Client.
    - Implement `joinChannel`, `publishAudio`, and `leaveChannel`.
    - Create a custom audio track from the `AudioEngine` destination node (Web Audio API -> Agora).
- [ ] **UI Integration**:
    - Add a "Connect Remote" toggle in the header or settings.
    - Show connection status (Connected/Disconnected).

## 3. Verification & Testing
- [ ] **Gesture Test**: Verify that showing a hand gesture triggers the correct sound and updates the UI.
- [ ] **Agora Test**: Verify that audio played locally is streamed to the Agora channel (requires a second device/tab to listen).

## 4. MiniMax (Voice Synthesis)
*Note: As per requirements, sounds are pre-generated. No runtime API integration is planned unless dynamic synthesis is requested.*
