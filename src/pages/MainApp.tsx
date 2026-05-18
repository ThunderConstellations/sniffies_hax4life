import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageCircle, Globe, Settings as SettingsIcon, Home as HomeIcon } from 'lucide-react';
import ConversationList from '@/components/ConversationList';
import ChatView from '@/components/ChatView';
import BubbleOverlay from '@/components/BubbleOverlay';
import Browse from '@/pages/Browse';
import Settings from '@/pages/Settings';
import Home from '@/pages/Home';
import { useAutoPilot } from '@/lib/autopilot-service';
import { useNotificationBridge } from '@/lib/notification-service';

type Tab = 'home' | 'chats' | 'browse' | 'settings';

const MainApp = () => {
  const [tab, setTab] = useState<Tab>('home');
  const { activeConversation, conversations, settings } = useAppStore();
  const { processIncomingMessage } = useAutoPilot();
  const { handlePlatformNotification } = useNotificationBridge();

  // Initialize background AI and Notification listeners (Phase 3)
  useEffect(() => {
    // Simulated Background Monitoring
    const checkInterval = setInterval(() => {
      // Logic for background alerts
    }, 10000);

    return () => clearInterval(checkInterval);
  }, [settings.autoPilotEnabled]);

  const tabs: { id: Tab; icon: typeof MessageCircle; label: string }[] = [
    { id: 'home', icon: HomeIcon, label: 'Home' },
    { id: 'chats', icon: MessageCircle, label: 'Chats' },
    { id: 'browse', icon: Globe, label: 'Browse' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  if (activeConversation) {
    return <ChatView />;
  }

  return (
    <div className="flex flex-col h-screen bg-background safe-top">
      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {tab === 'home' && <Home />}
        {tab === 'chats' && <ConversationList />}
        {tab === 'browse' && <Browse />}
        {tab === 'settings' && <Settings />}
      </div>

      {/* Persistent Bubble Overlay */}
      <BubbleOverlay />

      {/* Professional Bottom Nav */}
      <nav className="flex items-center border-t border-border bg-background safe-bottom">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-all ${
              tab === id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${tab === id ? 'scale-110' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-tight">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MainApp;
