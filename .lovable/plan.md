# SniffBubble — Messenger-Style Overlay for Sniffies

## Overview

A Capacitor-wrapped Android APK named "Sniffies_Hax4Life" that can be disguised as "Tic-Tac-Toe" that keeps you logged into Sniffies in the background and surfaces messages via floating chat bubbles — just like FB Messenger chat heads.

---

## Phase 1: Core App (This Build)

### 1. Authentication & Session Management

- **Embedded WebView login** as default — user logs into Sniffies inside the app, session is persisted
- **Chrome session piggybacking** option — import cookies from Chrome
- **Sniffies app session** option — piggyback on installed Sniffies app session
- Session kept alive via background service that periodically pings Sniffies to maintain "online" status

### 2. Message Detection (Hybrid Approach)

- First attempt to intercept Sniffies WebSocket/API calls for real-time message data
- Fallback to DOM scraping of the WebView if direct API interception fails
- Message polling interval configurable by user

### 3. Floating Chat Bubble (Android Overlay)

- Uses Android `SYSTEM_ALERT_WINDOW` permission via a custom Capacitor plugin
- Small circular bubble floats over all apps (like Messenger chat heads)
- Tap to expand into a compact chat panel (NOT full app) showing:
  - Active conversations list
  - Message history per conversation
  - Quick reply input with send button
  - User avatar/profile pic thumbnails
- Drag bubble to reposition, drag to bottom to dismiss
- Swipe between conversations

### 4. Background Service

- Persistent Android foreground service keeps Sniffies session alive
- Monitors for new messages even when app is "closed"
- Keeps user appearing online on Sniffies
- Battery optimization: configurable polling frequency

### 5. Notifications

- Custom notification sounds for new messages
- Notification shows sender name/preview, tap opens chat bubble
- Unique notification sound setting per contact (optional)
- Silent mode / Do Not Disturb respect

### 6. Chat Features (Messenger-like)

- Message history with timestamps
- Read receipts display (if available from Sniffies)
- Typing indicators (if available)
- Quick reactions/emojis
- Image viewing in chat
- Search through message history
- Pin/star important conversations

### 7. Chat Backup & Export

- Local SQLite storage of all conversations
- Export chat history as text/JSON
- Auto-backup on configurable schedule

### 8. Incognito Mode

- App disguised as **"Smart Calculator"** with a calculator icon
- Functional calculator screen as decoy (enter a PIN code to access real app)
- App name in settings/recent apps shows "Smart Calculator"

### 9. Settings & Preferences

- Login method selection (WebView / Chrome / Sniffies app)
- Notification sound customization
- Bubble size and opacity
- Auto-online toggle
- Battery saver mode (reduced polling)
- PIN/biometric lock for app access

---

## Phase 2: AI Features (Future Build)

- Auto-reply suggestions using free/uncensored models (OpenRouter, HuggingFace, Ollama)
- AI message drafting that mimics your style (trained on your chat examples)
- AI auto-responder with per-chat on/off toggle
- AI-powered nearby user scanning based on your preferences
- AI hookup planning assistant
- Unique notification sound when AI needs your input
- Profile summarizer
- Preference learning from text/image examples you provide

---

## Technical Architecture

- **Frontend**: React + Tailwind (chat UI, settings, calculator decoy)
- **Native wrapper**: Capacitor for Android APK targeting Galaxy S8 (Snapdragon, Android 9+)
- **Native plugins**: Custom Capacitor plugins for overlay bubbles, foreground service, notification channels
- **Local storage**: SQLite via Capacitor for chat history & preferences
- **Target**: APK sideload (not Play Store)