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
}

export interface Conversation {
  id: string;
  userName: string;
  userAvatar: string;
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  online: boolean;
  pinned: boolean;
  starred: boolean;
  messages: Message[];
  distance?: string;
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
  autoBackup: boolean;
  backupInterval: number;
}

interface AppState {
  unlocked: boolean;
  activeConversation: string | null;
  conversations: Conversation[];
  settings: AppSettings;
  setUnlocked: (val: boolean) => void;
  setActiveConversation: (id: string | null) => void;
  setConversations: (convos: Conversation[]) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  sendMessage: (conversationId: string, text: string) => void;
  togglePin: (conversationId: string) => void;
  toggleStar: (conversationId: string) => void;
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
    pinned: true,
    starred: false,
    distance: '0.3 mi',
    messages: [
      { id: 'm1', senderId: 'them', text: 'Hey there 👋', timestamp: Date.now() - 300000, read: true, type: 'text' },
      { id: 'm2', senderId: 'me', text: 'What\'s up?', timestamp: Date.now() - 240000, read: true, type: 'text' },
      { id: 'm3', senderId: 'them', text: 'Hey, are you nearby?', timestamp: Date.now() - 120000, read: false, type: 'text' },
      { id: 'm4', senderId: 'them', text: 'I\'m free rn', timestamp: Date.now() - 60000, read: false, type: 'text' },
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
    pinned: false,
    starred: true,
    distance: '1.2 mi',
    messages: [
      { id: 'm5', senderId: 'me', text: 'Wanna hang later?', timestamp: Date.now() - 900000, read: true, type: 'text' },
      { id: 'm6', senderId: 'them', text: 'Sounds good, lmk', timestamp: Date.now() - 600000, read: true, type: 'text' },
    ],
  },
  {
    id: '3',
    userName: 'Marcus',
    userAvatar: '',
    lastMessage: 'On my way',
    lastMessageTime: Date.now() - 3600000,
    unreadCount: 1,
    online: false,
    pinned: false,
    starred: false,
    distance: '4.7 mi',
    messages: [
      { id: 'm7', senderId: 'them', text: 'Where are you?', timestamp: Date.now() - 7200000, read: true, type: 'text' },
      { id: 'm8', senderId: 'me', text: 'Downtown', timestamp: Date.now() - 5400000, read: true, type: 'text' },
      { id: 'm9', senderId: 'them', text: 'On my way', timestamp: Date.now() - 3600000, read: false, type: 'text' },
    ],
  },
  {
    id: '4',
    userName: 'Tyler',
    userAvatar: '',
    lastMessage: '🔥🔥🔥',
    lastMessageTime: Date.now() - 86400000,
    unreadCount: 0,
    online: false,
    pinned: false,
    starred: false,
    distance: '8.1 mi',
    messages: [
      { id: 'm10', senderId: 'them', text: 'Nice pics', timestamp: Date.now() - 90000000, read: true, type: 'text' },
      { id: 'm11', senderId: 'me', text: 'Thanks 😏', timestamp: Date.now() - 89000000, read: true, type: 'text' },
      { id: 'm12', senderId: 'them', text: '🔥🔥🔥', timestamp: Date.now() - 86400000, read: true, type: 'text' },
    ],
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      unlocked: false,
      activeConversation: null,
      conversations: MOCK_CONVERSATIONS,
      settings: {
        loginMethod: 'webview',
        pollingInterval: 15,
        bubbleSize: 56,
        bubbleOpacity: 95,
        autoOnline: true,
        batterySaver: false,
        pin: '1234',
        incognitoEnabled: true,
        notificationSound: 'default',
        autoBackup: false,
        backupInterval: 24,
      },
      setUnlocked: (val) => set({ unlocked: val }),
      setActiveConversation: (id) => set({ activeConversation: id }),
      setConversations: (convos) => set({ conversations: convos }),
      updateSettings: (partial) =>
        set((state) => ({ settings: { ...state.settings, ...partial } })),
      sendMessage: (conversationId, text) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessage: text,
                  lastMessageTime: Date.now(),
                  messages: [
                    ...c.messages,
                    {
                      id: `m${Date.now()}`,
                      senderId: 'me',
                      text,
                      timestamp: Date.now(),
                      read: true,
                      type: 'text' as const,
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
    }),
    {
      name: 'sniffbubble-storage',
      partialize: (state) => ({
        settings: state.settings,
        conversations: state.conversations,
      }),
    }
  )
);
