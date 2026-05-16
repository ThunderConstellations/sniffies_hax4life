# Advanced Sniffies Hax & Native Bubbles Research

This document tracks the research and implementation plan for deep integration of Sniffies/Grindr features into a "Messenger-style" floating system.

## 🎯 The Vision
A system-level overlay (Chat Head) that allows full interaction with Sniffies, Grindr, NKP, and BarebackRT without switching apps. It feels like a native part of the OS.

## 🚀 Feature List & Requirements

### 1. The "Hax Bubble" (Floating UI)
- **Minimized State**: A small, draggable circle (56px) with the platform's logo.
- **Badge Notifications**: Pulsing red dot with unread count.
- **Maximized State (Mini-App)**:
    - **Header**: Active platform icon + Platform name + Close/Minimize buttons.
    - **Tab Bar**: Switch between [Chats], [Radar], [Settings].
    - **Chat View**:
        - Compact list of active threads.
        - AI Suggested Replies (3 chips at the bottom: "Friendly", "Flirty", "Direct").
    - **Radar View**:
        - High-contrast mini-map showing "pings".
        - "Teleport" button for quick GPS spoofing.
- **Exit Action**: A 100px "Exit Zone" at the bottom center. When bubble overlaps, it turns red and vibrates. Releasing there closes the bubble.

### 2. Deep Platform Integration (The "Hax")
- **Auto-Unblur (Bubbles)**: When a chat notification appears in the bubble, the sender's photo is automatically unblurred using the `hax-service` logic.
- **AI Wingman**: Gemini/OpenRouter analyzes the last 5 messages and suggests 3 replies directly in the bubble.
- **Ghost Mode**: Keep the session active in the background (via Heartbeat) while the user is in other apps.
- **Location Spoofing Hub**: Change GPS location from the bubble's "Quick Panel".

### 3. Native Messenger-Style Behavior
- **Overlay Permission**: Requires `SYSTEM_ALERT_WINDOW` on Android.
- **Background Service**: A Sticky Service that keeps the "Head" alive.
- **Multi-Tab Heads**: Separate bubbles for Sniffies and Grindr that can be grouped.

## 🛠️ Implementation Plan (Phase 2)

### 1. UI Refactoring
- [x] Create `src/pages/BubbleView.tsx`: A dedicated, lightweight route for the overlay. (Planned)
- [ ] Add `BubbleRadar.tsx`: A lightweight Canvas-based radar component.
- [ ] Add `BubbleAIHelper.tsx`: Logic for fetching Gemini/OpenRouter suggestions for the active bubble chat.
- [ ] Implement "Quick Switcher" in `BubbleOverlay.tsx` header.

### 2. Logic Enhancement
- [ ] `src/lib/bubble-service.ts`: Manage state between the main app and the overlay.
- [ ] `src/lib/hax-service.ts`: Add "Auto-Reply" templates.
- [ ] Integrate AI into the BubbleView for "One-Tap Replies".

### 3. Native Bridge (Scaffolding)
- [ ] Update `AndroidManifest.xml` with overlay and service permissions.
- [ ] Create Java/Kotlin stubs for `FloatingBubbleService`.
- [ ] Map Capacitor `addListener` to native bubble click events.

## 📈 Seamless Features to Merge
| Feature | Sniffies Base | Messenger-Style Integration |
| :--- | :--- | :--- |
| **Chat** | Full-screen app | Floating overlay with quick-keyboard |
| **Map** | Interactive Mapbox | Mini-radar bubble with proximity alerts |
| **Photos** | Blurred (Free) | Auto-unblurred preview in bubble |
| **Status** | App must be open | Heartbeat keeps you "Recently Active" |
| **AI** | External window | Integrated "Reply Suggestions" in bubble |
| **Platform** | Single App | Tabbed hub (Sniffies/NKP/etc) in one bubble |
