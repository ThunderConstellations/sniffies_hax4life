import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageCircle, Globe, Settings as SettingsIcon } from 'lucide-react';
import ConversationList from '@/components/ConversationList';
import ChatView from '@/components/ChatView';
import BubbleOverlay from '@/components/BubbleOverlay';
import Browse from '@/pages/Browse';
import Settings from '@/pages/Settings';

type Tab = 'chats' | 'browse' | 'settings';

const MainApp = () => {
  const [tab, setTab] = useState<Tab>('chats');
  const { activeConversation } = useAppStore();

  const tabs: { id: Tab; icon: typeof MessageCircle; label: string }[] = [
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'browse', icon: Globe, label: 'Browse' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  // If viewing a conversation, show chat view full screen
  if (activeConversation) {
    return <ChatView />;
  }

  return (
    <div className="flex flex-col h-screen bg-background safe-top">
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'chats' && <ConversationList />}
        {tab === 'browse' && <Browse />}
        {tab === 'settings' && <Settings />}
      </div>

      {/* Bubble overlay (only on chats tab) */}
      {tab === 'chats' && <BubbleOverlay />}

      {/* Bottom nav */}
      <nav className="flex items-center border-t border-border bg-card safe-bottom">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
              tab === id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MainApp;
