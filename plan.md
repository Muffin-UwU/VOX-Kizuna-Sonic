# Remaining Tasks Plan

## 1. MiniMax TTS Integration
**Status:** ✅ Completed (Client-side with hardcoded fallbacks).
- Implemented `VoiceGenerator` component.
- Updated `useAudio` to support custom buffers.
- Verified API calls to MiniMax.

## 2. Mobile Optimization & Polish
**Status:** 🟡 Pending.
**Goal:** Ensure the app works flawlessly on mobile browsers (permissions, touch targets).

- [ ] **Meta Viewport**: Verify `viewport` settings for mobile (prevent zooming on taps).
- [ ] **Touch Actions**: Ensure "Hold to Talk" or buttons don't trigger context menus.
- [ ] **Permission Recovery**: Handle cases where mobile Safari denies permissions initially.
- [ ] **Responsive Design Check**: Ensure all components (VoiceGenerator, AgoraController, etc.) stack correctly on small screens.

## 3. Deployment Preparation
**Status:** 🔴 Not deployed.
**Goal:** Deploy the application to Vercel.

- [ ] **Build Check**: Ensure `pnpm build` passes with all environment variables (MediaPipe, Agora, MiniMax).
- [ ] **Environment Variables**: Document exactly which vars are needed for production (`NEXT_PUBLIC_AGORA_APP_ID`, `NEXT_PUBLIC_MINIMAX_API_KEY`, etc.).
- [ ] **Vercel Config**: Add `vercel.json` if custom headers (for SharedArrayBuffer/MediaPipe) are needed.

## 4. Documentation
- [ ] **README.md**: Update with setup instructions, env var guide, and feature usage.
