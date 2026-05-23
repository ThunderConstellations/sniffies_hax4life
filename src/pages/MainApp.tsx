import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageCircle, Globe, Settings as SettingsIcon, Home as HomeIcon, Map as MapIcon, User } from 'lucide-react';
import ConversationList from '@/components/ConversationList';
import ChatView from '@/components/ChatView';
import BubbleOverlay from '@/components/BubbleOverlay';
import Browse from '@/pages/Browse';
import Settings from '@/pages/Settings';
import Home from '@/pages/Home';
import { useAutoPilot } from '@/lib/autopilot-service';
import { useNotificationBridge } from '@/lib/notification-service';
import { useProximityEngine } from '@/lib/proximity-service';
import ProfileViewer from '@/components/ProfileViewer';

type Tab = 'home' | 'chats' | 'browse' | 'settings';

const MainApp = () => {
  const [tab, setTab] = useState<Tab>('home');
  const { activeConversation, conversations, settings } = useAppStore();
  const { processIncomingMessage } = useAutoPilot();
  const { handlePlatformNotification } = useNotificationBridge();
  const { checkProximity } = useProximityEngine();

  // Phase 7: Global Monitor
  useEffect(() => {
    const monitorInterval = setInterval(() => {
      checkProximity();
    }, 30000); // Check every 30s
    return () => clearInterval(monitorInterval);
  }, [conversations, settings.proximityAlertRadius]);

  const tabs: { id: Tab; icon: typeof MessageCircle; label: string }[] = [
    { id: 'home', icon: HomeIcon, label: 'Hub' },
    { id: 'browse', icon: MapIcon, label: 'Map' },
    { id: 'chats', icon: MessageCircle, label: 'Inbox' },
    { id: 'settings', icon: SettingsIcon, label: 'Engine' },
  ];

  if (activeConversation) {
    return <ChatView />;
  }

  return (
    <div className="flex flex-col h-screen bg-background safe-top">
      <div className="flex-1 overflow-hidden relative">
        {tab === 'home' && <Home />}
        {tab === 'chats' && <ConversationList />}
        {tab === 'browse' && <Browse />}
        {tab === 'settings' && <Settings />}
      </div>

      <BubbleOverlay />

      <nav className="flex items-center border-t border-border/50 bg-muted/5 safe-bottom">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${
              tab === id ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${tab === id ? 'scale-110' : ''}`} />
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MainApp;
