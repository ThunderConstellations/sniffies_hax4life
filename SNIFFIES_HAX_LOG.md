# Sniffies Hax Development Log

## Project Goal
Transform the current React/Capacitor app into a comprehensive Android APK for Sniffies and similar platforms, with AI integration, multi-platform tabs, and advanced chat features (Messenger-style bubbles).

## Key Features to Implement
- [ ] Multi-platform instances (Sniffies, NKP, BarebackRT, Grindr) in tabs.
- [ ] AI Integration: Google Gemini and OpenRouter API keys input in settings.
- [ ] FB Messenger-style minimize/maximize chat bubbles.
- [ ] Background persistence to keep user "online".
- [ ] Home Screen with quick actions.
- [ ] "Hax": Make paid features free (via script injection/UI modifications).
- [ ] Logo and branding integration.

## Research & Plans
- **AI Integration**: Add fields to `AppSettings` in `store.ts`. Create a utility for AI chat assistance.
- **Multi-platform Tabs**: Update `Browse.tsx` to handle multiple URLs and state.
- **Background Tasks**: Look into `@capacitor/background-runner` or similar for keeping session active.
- **Messenger Bubbles**: Improve `BubbleOverlay.tsx` to be more draggable and floating.
- **APK Packaging**: Ensure `capacitor.config.ts` is ready for production build.

## Hax Research (Potential Strategies)
- **Feature Unlocking**: Many features are gated by client-side checks. We can inject a script into the WebView to set `localStorage` flags or override global app state objects (e.g., `window.app.user.isPremium = true`).
- **Paywall Removal**: Use CSS injection to set `display: none !important` on premium prompts, overlays, and "upgrade now" banners.
- **Enhanced Map**: Sniffies uses a map. We might be able to hook into the map initialization to show more details or bypass zoom limits.
- **Persistence**: To stay "online", the app needs to periodically ping the server. A background script can heartbeat the `online` status even when the app is minimized.
- **Grindr/NKP/BarebackRT**: Similar strategies apply. Intercepting the WebSocket or XHR requests to extract data that is normally hidden in the UI.

## Change Log
- Initial assessment of the codebase.
- Created `SNIFFIES_HAX_LOG.md`.
- Added Hax research strategies.
- Configured Capacitor for production APK build:
  - App ID: `com.thunderconstellations.sniffieshax`
  - App Name: `Sniffies Hax4Life`
- Added Home Screen, Multi-Browse, and AI Integration.
- Enhanced Bubble Overlay with draggability.
- Created professional branding assets (`public/logo.svg`).
- Implemented "Hax Toolbox" for managing site-specific injections.
- Added GPS Spoofing mock for location teleportation.
- Corrected Capacitor dependencies to stable v6.
- Switched to free web-based heartbeat for session persistence (Enterprise Background Runner removed).

## APK Packaging Instructions
1. Run `npm run build` to generate the `dist` folder.
2. Run `npx cap sync` to sync web assets with Android project.
3. Open Android Studio: `npx cap open android`.
4. Update `AndroidManifest.xml` to request necessary permissions:
   - `android.permission.INTERNET`
   - `android.permission.SYSTEM_ALERT_WINDOW` (For FB Messenger-style bubbles)
   - `android.permission.FOREGROUND_SERVICE`
5. **Implement Native Bubbles**: To have bubbles work outside the app, you must implement an Android `Service` that uses `WindowManager` to add a view to the screen.
   - Recommended Plugin: `capacitor-floating-bubble` (Community).
   - Alternatively, use the Android "Bubbles" API for Android 11+.
6. Build APK: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

## Native Bubble Research
- **System Alert Window**: Required for drawing over other apps.
- **Background Service**: Required to keep the bubble alive when the main app is closed.
- **Communication**: Use Capacitor's `addListener` or a custom bridge to send data from the background service to the React UI when the bubble is clicked.

## 🛠️ Code Review & Refinement (v1.1)
- **Dependency Fix**: Added `zustand` to `package.json` to fix build failures.
- **Iframe Bypass**: Noted that standard browsers block framing (SOP). The HUD now includes a reminder that the final APK utilizes the Capacitor WebView which allows for proxying/header manipulation to bypass `X-Frame-Options`.
- **Native Implementation**: Added Kotlin snippets for `WindowManager` and `evaluateJavascript` for true system-level bubbles and site injection in the log instructions.

## Phase 2: Advanced AI & Graphical Bubbles (In Progress)
Goal: Implement 10+ advanced features in the bubble overlay, focusing on AI automation, style mimicry, and stealth.

### 10 Proposed Bubble Features:
1.  **AI Auto-Pilot (Style Mimicry)**: Analyzes past messages to reply in the user's exact "voice" (slang, punctuation).
2.  **AI Vision Hunter**: Users input a "Target Type" (e.g., "muscle guys"). AI scans nearby profile thumbnails via Gemini Vision and pings if a match is found.
3.  **Ghost Heatmap**: A miniaturized, high-contrast map in the bubble showing active "hotspots".
4.  **Decoy Swap (Stealth)**: Quick-gesture that changes the bubble icon to a system-style icon (e.g., Weather).
5.  **Rapid Response Macros**: One-tap buttons for common interactions: "Location sent", "Looking?".
6.  **Distance Proximity Alert**: Bubble ring pulses faster as a "Starred" user moves closer.
7.  **Auto-Greet (Cruising)**: Automatically sends a customized intro to users who "Viewed You".
8.  **Catfish Guard**: AI analysis of profile images to detect fakes or stock photos.
9.  **Quick-Media Drawer**: Horizontal scroll of user's "Top Pics" for instant sending.
10. **Mood Sync**: Bubble's glow color changes based on "Looking for" status (Red=RN, Blue=Chatting).
11. **Auto-Pilot Preference Filtering**: AI filters incoming chats based on physical preferences and block-lists "red flags".
