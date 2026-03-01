# Test Plan: Kizuna Sonic Full Integration

## 1. Environment Setup
- **Restart Server**: Run `pnpm dev` to load the new Agora App ID (`a516...`).
- **Open App**: Navigate to `http://localhost:2000`.

## 2. Test MediaPipe (Gesture Control)
- Click **"Enable Gestures"**.
- Allow camera access.
- **Action**: Hold up an open palm ✋.
- **Expected**: "Stop" sound plays (beep or your custom AI voice).
- **Action**: Point up ☝️.
- **Expected**: "Come" sound plays.

## 3. Test MiniMax (AI Voice Generation)
- Scroll to **"Custom Voice Generator"**.
- Type "Good Boy!".
- Click **"Generate Voice"**.
- Click **"Preview"** -> You should hear the AI voice.
- Click **"STOP"** (Save to).
- **Verify**: Trigger the "Stop" gesture (Open Palm). It should now play "Good Boy!" instead of the default sound.

## 4. Test Agora (Remote Monitoring)
- **Step A**: Open a second browser tab (Incognito) or use your phone on the same Wi-Fi (`http://YOUR_IP:2000`).
- **Step B**: Click **"CONNECT REMOTE"** on BOTH devices.
    - Status should change to green "Streaming Audio...".
- **Step C**: Trigger a sound on Device 1 (Gesture or Button).
- **Expected**: You should hear the sound play on **Device 2**.

## Troubleshooting
- If Agora fails with `CAN_NOT_GET_GATEWAY_SERVER`, it means App ID `a516...` also needs a token (Secure Mode is on). You must generate a temp token in Agora Console and add it to `.env.local`.
