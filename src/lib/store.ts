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
  hunterPreferences: {
    minAge: number;
    maxAge: number;
    bodyType: string[];
    ethnicity: string[];
  };
  macros: string[];
  planGuardEnabled: boolean;
}

interface AppState {
  unlocked: boolean;
  activeConversation: string | null;
  conversations: Conversation[];
  savedProfiles: string[]; // List of conversation IDs or profile IDs
  photoVault: { id: string; url: string; category: string; timestamp: number }[];
  settings: AppSettings;
  setUnlocked: (val: boolean) => void;
  setActiveConversation: (id: string | null) => void;
  setConversations: (convos: Conversation[]) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  sendMessage: (conversationId: string, text: string, type?: 'text' | 'image', imageUrl?: string) => void;
  togglePin: (conversationId: string) => void;
  toggleStar: (conversationId: string) => void;
  toggleMute: (conversationId: string) => void;
  toggleArchive: (conversationId: string) => void;
  deleteMessage: (conversationId: string, messageId: string) => void;
  addReaction: (conversationId: string, messageId: string, emoji: string) => void;
  markAsRead: (conversationId: string) => void;
  deleteConversation: (conversationId: string) => void;
  exportConversation: (conversationId: string) => string;
  exportAllConversations: () => string;
  setContactSound: (conversationId: string, sound: string) => void;
  saveProfile: (id: string) => void;
  unsaveProfile: (id: string) => void;
  addToVault: (url: string, category: string) => void;
  removeFromVault: (id: string) => void;
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
    typing: false,
    stats: {
      age: 28,
      position: 'Vers',
      bodyType: 'Athletic',
      lookingFor: ['Right Now', 'Friends']
    },
    messages: [
      { id: 'm1', senderId: 'them', text: 'Hey there 👋', timestamp: Date.now() - 300000, read: true, type: 'text' },
      { id: 'm2', senderId: 'me', text: "What's up?", timestamp: Date.now() - 240000, read: true, type: 'text' },
      { id: 'm3', senderId: 'them', text: 'Hey, are you nearby?', timestamp: Date.now() - 120000, read: false, type: 'text' },
      { id: 'm4', senderId: 'them', text: "I'm free rn", timestamp: Date.now() - 60000, read: false, type: 'text' },
    ],
  },
  {
    id: '2',
    userName: 'Jordan',
    userAvatar: '',
    lastMessage: 'Sounds good, lmk',
    lastMessageTime: Date.now() - 600000,
    unreadCount: 0,
    online: true,
    lastSeen: 'Online Now',
    pinned: false,
    starred: true,
    distance: '1.2 mi',
    stats: {
      age: 31,
      position: 'Top',
      bodyType: 'Toned',
      lookingFor: ['Dates']
    },
    messages: [
      { id: 'm5', senderId: 'me', text: 'Wanna hang later?', timestamp: Date.now() - 900000, read: true, type: 'text' },
      { id: 'm6', senderId: 'them', text: 'Sounds good, lmk', timestamp: Date.now() - 600000, read: true, type: 'text' },
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
        hunterPreferences: {
          minAge: 18,
          maxAge: 50,
          bodyType: [],
          ethnicity: [],
        },
        macros: ['Looking?', 'Location?', 'Snap?', 'Pics?', 'Hosting?'],
        planGuardEnabled: true,
      },
      setUnlocked: (val) => set({ unlocked: val }),
      setActiveConversation: (id) => {
        set({ activeConversation: id });
        if (id) {
          const state = get();
          const convo = state.conversations.find(c => c.id === id);
          if (convo && convo.unreadCount > 0) {
            set({
              conversations: state.conversations.map(c =>
                c.id === id
                  ? {
                      ...c,
                      unreadCount: 0,
                      messages: c.messages.map(m => ({ ...m, read: true })),
                    }
                  : c
              ),
            });
          }
        }
      },
      setConversations: (convos) => set({ conversations: convos }),
      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      sendMessage: (conversationId, text, type = 'text', imageUrl) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: type === 'image' ? '📷 Photo' : text,
                  lastMessageTime: Date.now(),
                  messages: [
                    ...c.messages,
                    {
                      id: `m${Date.now()}`,
                      senderId: 'me',
                      text,
                      timestamp: Date.now(),
                      read: false,
                      type,
                      imageUrl,
                    },
                  ],
                }
              : c
          ),
        })),
      togglePin: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, pinned: !c.pinned } : c
          ),
        })),
      toggleStar: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, starred: !c.starred } : c
          ),
        })),
      toggleMute: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, muted: !c.muted } : c
          ),
        })),
      toggleArchive: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, archived: !c.archived } : c
          ),
        })),
      deleteMessage: (conversationId, messageId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId ? { ...m, deleted: true, text: 'Message deleted' } : m
                  ),
                }
              : c
          ),
        })),
      addReaction: (conversationId, messageId, emoji) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === messageId
                      ? {
                          ...m,
                          reactions: m.reactions?.includes(emoji)
                            ? m.reactions.filter((r) => r !== emoji)
                            : [...(m.reactions || []), emoji],
                        }
                      : m
                  ),
                }
              : c
          ),
        })),
      markAsRead: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  unreadCount: 0,
                  messages: c.messages.map((m) => ({ ...m, read: true })),
                }
              : c
          ),
        })),
      deleteConversation: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== conversationId),
          activeConversation:
            state.activeConversation === conversationId ? null : state.activeConversation,
        })),
      exportConversation: (conversationId) => {
        const convo = get().conversations.find((c) => c.id === conversationId);
        if (!convo) return '';
        return JSON.stringify(
          {
            userName: convo.userName,
            exportedAt: new Date().toISOString(),
            messageCount: convo.messages.length,
            messages: convo.messages.map((m) => ({
              sender: m.senderId === 'me' ? 'You' : convo.userName,
              text: m.text,
              time: new Date(m.timestamp).toISOString(),
              type: m.type,
            })),
          },
          null,
          2
        );
      },
      exportAllConversations: () => {
        const state = get();
        return JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            totalConversations: state.conversations.length,
            conversations: state.conversations.map((c) => ({
              userName: c.userName,
              messageCount: c.messages.length,
              messages: c.messages.map((m) => ({
                sender: m.senderId === 'me' ? 'You' : c.userName,
                text: m.text,
                time: new Date(m.timestamp).toISOString(),
              })),
            })),
          },
          null,
          2
        );
      },
      setContactSound: (conversationId, sound) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId ? { ...c, notificationSound: sound } : c
          ),
        })),
      saveProfile: (id) => set((state) => ({
        savedProfiles: [...new Set([...state.savedProfiles, id])]
      })),
      unsaveProfile: (id) => set((state) => ({
        savedProfiles: state.savedProfiles.filter(p => p !== id)
      })),
      addToVault: (url, category) => set((state) => ({
        photoVault: [...state.photoVault, { id: `p${Date.now()}`, url, category, timestamp: Date.now() }]
      })),
      removeFromVault: (id) => set((state) => ({
        photoVault: state.photoVault.filter(p => p.id !== id)
      })),
    }),
    {
      name: 'sniffbubble-storage',
      partialize: (state) => ({
        settings: state.settings,
        conversations: state.conversations,
        savedProfiles: state.savedProfiles,
        photoVault: state.photoVault,
      }),
    }
  )
);
