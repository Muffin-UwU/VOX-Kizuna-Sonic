# Remaining Tasks Plan

## 1. Sound Asset Generation (MiniMax Integration)
**Status:** ⚠️ Using fallback beeps.
**Goal:** Replace synthetic beeps with high-quality AI voice commands ("Tomare", "Oide", "Kiken") using the MiniMax API.

- [ ] **MiniMax Client Setup**: 
    - Create a server-side utility to call MiniMax TTS API (using `NEXT_MINIMAX_GROUP_ID` and API Key).
- [ ] **Generation UI**: 
    - Add a hidden/admin page (e.g., `/admin/sounds`) to trigger generation of the 3 static files.
    - Save files to `public/sounds/`.
- [ ] **Integration**: Ensure `useAudio` loads these new files.

## 2. Mobile Optimization & Polish
**Status:** 🟡 Basic responsive layout implemented.
**Goal:** Ensure the app works flawlessly on mobile browsers (permissions, touch targets).

- [ ] **Meta Viewport**: Verify `viewport` settings for mobile (prevent zooming on taps).
- [ ] **Touch Actions**: Ensure "Hold to Talk" or buttons don't trigger context menus.
- [ ] **Permission Recovery**: Handle cases where mobile Safari denies permissions initially.

## 3. Deployment Preparation
**Status:** 🔴 Not deployed.
**Goal:** Deploy the application to Vercel.

- [ ] **Build Check**: Ensure `pnpm build` passes with all environment variables (MediaPipe, Agora).
- [ ] **Environment Variables**: Document exactly which vars are needed for production (`NEXT_PUBLIC_AGORA_APP_ID`, `MINIMAX_API_KEY`, etc.).
- [ ] **Vercel Config**: Add `vercel.json` if custom headers (for SharedArrayBuffer/MediaPipe) are needed.

## 4. Documentation
- [ ] **README.md**: Update with setup instructions, env var guide, and feature usage.
