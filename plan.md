# Implementation Plan: MiniMax Custom Voice Integration

## 1. Goal
Replace the default fallback beeps with AI-generated voice commands ("Stop!", "Come!", "Danger!") and ensure they are used by both:
1.  **Manual Button Clicks** (CommandPalette)
2.  **Gesture Recognition** (MediaPipe)

## 2. Current State
- `VoiceGenerator` can generate audio and save it to `useAudio`'s buffer cache.
- `useAudio` already prioritizes `buffers.current[command]` over fallback beeps.
- `GestureRecognition` calls `onGestureDetected`, which likely calls `playCommand`.

## 3. Tasks

### Task A: Pre-generate Default Voice Assets (Optional but Recommended)
Instead of relying on the user to generate sounds every time, we should:
1.  Generate "Stop", "Come", "Danger" MP3s using MiniMax.
2.  Save them to `public/sounds/`.
3.  **Action**: Since I cannot "hear" or "download" from the browser to disk easily in this environment, I will create a script or instructions for you to do this, OR we can stick to the dynamic generation flow.
    *   *Decision*: For now, we rely on the `VoiceGenerator` to override the defaults. The app already tries to load from `/sounds/stop.mp3`. If those files exist, they are used.

### Task B: Ensure Gesture Triggers use Custom Sounds
- **Verify**: Check `apps/web/src/components/GestureCanvas.tsx` to ensure it passes the command to `playCommand`.
- **Logic**: `GestureCanvas` -> `onGestureDetected` -> `playCommand('stop')` -> `useAudio` checks `buffers.current['stop']`.
- **Result**: If the user has "Saved" a voice from `VoiceGenerator`, `buffers.current['stop']` will be populated. The gesture will automatically use it.

### Task C: Persist Generated Sounds (Enhancement)
- Currently, if you refresh the page, the custom sounds are lost (because `buffers.current` is in memory).
- **Todo**: Implement `IndexedDB` or `localStorage` (base64) to persist these custom sounds across reloads?
    *   *Decision*: For MVP/Hackathon, in-memory is acceptable. We can add a "Quick Generate Defaults" button that generates all 3 prompts at once.

## 4. Execution Steps
1.  **Verify Gesture Wiring**: Ensure `GestureCanvas` is correctly connected to `playCommand`.
2.  **Add "Generate All Defaults" Button**: A convenience button in `VoiceGenerator` to auto-generate "Stop", "Come here", "Danger" in one click.

Let's start by verifying the `GestureCanvas` wiring.
