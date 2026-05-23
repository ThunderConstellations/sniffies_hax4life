import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  read: boolean;
  type: 'text' | 'image';
  imageUrl?: string;
  reactions?: string[];
  deleted?: boolean;
}

export interface ProfileStats {
  age?: number;
  height?: string;
  weight?: string;
  bodyType?: string;
  ethnicity?: string;
  position?: 'Top' | 'Bottom' | 'Vers' | 'Side' | 'Strict Top' | 'Strict Bottom';
  lookingFor?: string[];
}

export interface Conversation {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  online: boolean;
  lastSeen?: string;
  pinned: boolean;
  starred: boolean;
  messages: Message[];
  distance?: string;
  typing?: boolean;
  muted?: boolean;
  notificationSound?: string;
  archived?: boolean;
  stats?: ProfileStats;
}

export interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
}

export interface IdentityProfile {
  id: string;
  name: string;
  geminiKey: string;
  openRouterKey: string;
  activePlatform: 'sniffies' | 'nkp' | 'barebackrt' | 'grindr';
}

export interface AppSettings {
  loginMethod: 'webview' | 'chrome' | 'sniffies-app';
  pollingInterval: number;
  bubbleSize: number;
  bubbleOpacity: number;
  autoOnline: boolean;
  batterySaver: boolean;
  pin: string;
  incognitoEnabled: boolean;
  notificationSound: string;
  notificationVibrate: boolean;
  dndEnabled: boolean;
  dndStart: string;
  dndEnd: string;
  autoBackup: boolean;
  backupInterval: number;
  theme: 'dark' | 'midnight' | 'amoled';
  fontSize: number;
  showDistance: boolean;
  showReadReceipts: boolean;
  showTypingIndicator: boolean;
  mediaAutoDownload: boolean;
  geminiKey: string;
  openRouterKey: string;
  activePlatform: 'sniffies' | 'nkp' | 'barebackrt' | 'grindr';
  stayOnlineBackground: boolean;
  nativeBubblesEnabled: boolean;
  autoPilotEnabled: boolean;
  autoGreetEnabled: boolean;
  stealthMode: boolean;
  moodSyncEnabled: boolean;
  catfishGuardEnabled: boolean;
  visionHunterEnabled: boolean;
  hunterPreferences: { minAge: number; maxAge: number; bodyType: string[]; ethnicity: string[] };
  macros: string[];
  planGuardEnabled: boolean;
  safetyShieldEnabled: boolean;
  geoFencingEnabled: boolean;
  proximityAlertRadius: number;
  labCustomJS: string;
  labCustomCSS: string;
}

interface AppState {
  unlocked: boolean;
  activeConversation: string | null;
  conversations: Conversation[];
  savedProfiles: string[];
  photoVault: { id: string; url: string; category: string; timestamp: number }[];
  safeZones: SafeZone[];
  identities: IdentityProfile[];
  activeIdentityId: string;
  settings: AppSettings;
  setUnlocked: (val: boolean) => void;
  setActiveConversation: (id: string | null) => void;
  setConversations: (convos: Conversation[]) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  sendMessage: (conversationId: string, text: string, type?: 'text' | 'image', imageUrl?: string) => void;
  togglePin: (id: string) => void;
  toggleStar: (id: string) => void;
  toggleMute: (id: string) => void;
  toggleArchive: (id: string) => void;
  deleteMessage: (cid: string, mid: string) => void;
  addReaction: (cid: string, mid: string, e: string) => void;
  markAsRead: (id: string) => void;
  deleteConversation: (id: string) => void;
  exportConversation: (id: string) => string;
  exportAllConversations: () => string;
  setContactSound: (id: string, s: string) => void;
  saveProfile: (id: string) => void;
  unsaveProfile: (id: string) => void;
  addToVault: (u: string, c: string) => void;
  removeFromVault: (id: string) => void;
  addSafeZone: (z: SafeZone) => void;
  removeSafeZone: (id: string) => void;
  switchIdentity: (id: string) => void;
  addIdentity: (i: IdentityProfile) => void;
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    userName: 'Alex',
    userAvatar: '',
    lastMessage: 'Hey, are you nearby?',
    lastMessageTime: Date.now() - 120000,
    unreadCount: 2,
    online: true,
    lastSeen: 'Online Now',
    pinned: true,
    starred: false,
    distance: '350 ft',
    stats: { age: 28, position: 'Vers', bodyType: 'Athletic', lookingFor: ['Right Now', 'Friends'] },
    messages: [
      { id: 'm1', senderId: 'them', text: 'Hey there 👋', timestamp: Date.now() - 300000, read: true, type: 'text' },
      { id: 'm2', senderId: 'me', text: "What's up?", timestamp: Date.now() - 240000, read: true, type: 'text' },
      { id: 'm3', senderId: 'them', text: 'Hey, are you nearby?', timestamp: Date.now() - 120000, read: false, type: 'text' },
    ],
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      unlocked: false,
      activeConversation: null,
      conversations: MOCK_CONVERSATIONS,
      savedProfiles: [],
      photoVault: [],
      safeZones: [],
      identities: [{ id: 'default', name: 'Primary Hax', geminiKey: '', openRouterKey: '', activePlatform: 'sniffies' }],
      activeIdentityId: 'default',
      settings: {
        loginMethod: 'chrome',
        pollingInterval: 15,
        bubbleSize: 56,
        bubbleOpacity: 95,
        autoOnline: true,
        batterySaver: false,
        pin: '1234',
        incognitoEnabled: true,
        notificationSound: 'default',
        notificationVibrate: true,
        dndEnabled: false,
        dndStart: '23:00',
        dndEnd: '07:00',
        autoBackup: false,
        backupInterval: 24,
        theme: 'dark',
        fontSize: 14,
        showDistance: true,
        showReadReceipts: true,
        showTypingIndicator: true,
        mediaAutoDownload: true,
        geminiKey: '',
        openRouterKey: '',
        activePlatform: 'sniffies',
        stayOnlineBackground: true,
        nativeBubblesEnabled: false,
        autoPilotEnabled: false,
        autoGreetEnabled: false,
        stealthMode: false,
        moodSyncEnabled: true,
        catfishGuardEnabled: true,
        visionHunterEnabled: false,
        hunterPreferences: { minAge: 18, maxAge: 50, bodyType: [], ethnicity: [] },
        macros: ['Looking?', 'Location?', 'Snap?', 'Pics?', 'Hosting?'],
        planGuardEnabled: true,
        safetyShieldEnabled: true,
        geoFencingEnabled: false,
        proximityAlertRadius: 500,
        labCustomJS: '',
        labCustomCSS: '',
      },
      setUnlocked: (val) => set({ unlocked: val }),
      setActiveConversation: (id) => set({ activeConversation: id }),
      setConversations: (convos) => set({ conversations: convos }),
      updateSettings: (partial) => set((state) => ({ settings: { ...state.settings, ...partial } })),
      sendMessage: (cid, t, ty = 'text', img) => set((state) => ({
          conversations: state.conversations.map((c) => c.id === cid ? {
            ...c, lastMessage: ty === 'image' ? '📷 Photo' : t, lastMessageTime: Date.now(),
            messages: [...c.messages, { id: `m${Date.now()}`, senderId: 'me', text: t, timestamp: Date.now(), read: false, type: ty, imageUrl: img }]
          } : c)
      })),
      togglePin: (id) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c) })),
      toggleStar: (id) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, starred: !c.starred } : c) })),
      toggleMute: (id) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, muted: !c.muted } : c) })),
      toggleArchive: (id) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, archived: !c.archived } : c) })),
      deleteMessage: (cid, mid) => set((state) => ({ conversations: state.conversations.map(c => c.id === cid ? { ...c, messages: c.messages.map(m => m.id === mid ? { ...m, deleted: true, text: 'Deleted' } : m) } : c) })),
      addReaction: (cid, mid, e) => set((state) => ({ conversations: state.conversations.map(c => c.id === cid ? { ...c, messages: c.messages.map(m => m.id === mid ? { ...m, reactions: m.reactions?.includes(e) ? m.reactions.filter(r => r !== e) : [...(m.reactions || []), e] } : m) } : c) })),
      markAsRead: (id) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, read: true })) } : c) })),
      deleteConversation: (id) => set((state) => ({ conversations: state.conversations.filter(c => c.id !== id), activeConversation: state.activeConversation === id ? null : state.activeIdentityId })),
      exportConversation: (id) => JSON.stringify(get().conversations.find(c => c.id === id), null, 2),
      exportAllConversations: () => JSON.stringify(get().conversations, null, 2),
      setContactSound: (id, s) => set((state) => ({ conversations: state.conversations.map(c => c.id === id ? { ...c, notificationSound: s } : c) })),
      saveProfile: (id) => set((state) => ({ savedProfiles: [...new Set([...state.savedProfiles, id])] })),
      unsaveProfile: (id) => set((state) => ({ savedProfiles: state.savedProfiles.filter(p => p !== id) })),
      addToVault: (u, c) => set((state) => ({ photoVault: [...state.photoVault, { id: `p${Date.now()}`, url: u, category: c, timestamp: Date.now() }] })),
      removeFromVault: (id) => set((state) => ({ photoVault: state.photoVault.filter(p => p.id !== id) })),
      addSafeZone: (z) => set((state) => ({ safeZones: [...state.safeZones, z] })),
      removeSafeZone: (id) => set((state) => ({ safeZones: state.safeZones.filter(z => z.id !== id) })),
      switchIdentity: (id) => {
         const identity = get().identities.find(i => i.id === id);
         if (identity) {
            set({ activeIdentityId: id });
            set((state) => ({ settings: { ...state.settings, geminiKey: identity.geminiKey, openRouterKey: identity.openRouterKey, activePlatform: identity.activePlatform } }));
         }
      },
      addIdentity: (i) => set((state) => ({ identities: [...state.identities, i] })),
    }),
    {
      name: 'sniffbubble-storage-v7',
      partialize: (state) => ({
        settings: state.settings,
        conversations: state.conversations,
        savedProfiles: state.savedProfiles,
        photoVault: state.photoVault,
        safeZones: state.safeZones,
        identities: state.identities,
        activeIdentityId: state.activeIdentityId,
      }),
    }
  )
);
