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

## APK Packaging Instructions
1. Run `npm run build` to generate the `dist` folder.
2. Run `npx cap sync` to sync web assets with Android project.
3. Open Android Studio: `npx cap open android`.
4. Update `AndroidManifest.xml` to request necessary permissions (Internet, Background Service).
5. Build APK: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.
