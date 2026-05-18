import { useState, useRef, useEffect, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import {
  MessageCircle, X, Send, Maximize2, Minimize2,
  Globe, ShieldCheck, Sparkles, Map as MapIcon,
  Settings as SettingsIcon, LayoutGrid, Trash2,
  Zap, Target, Ghost, Battery, CloudSun, Flame
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';
import BubbleRadar from './BubbleRadar';
import BubbleAIHelper from './BubbleAIHelper';
import BubbleHunter from './BubbleHunter';
import BubbleHeatmap from './BubbleHeatmap';
import MediaDrawer from './MediaDrawer';

const BubbleOverlay = () => {
  const { conversations, settings, sendMessage, setActiveConversation, updateSettings } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'radar' | 'hunter' | 'heatmap' | 'settings'>('chats');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showPlatformSwitcher, setShowPlatformSwitcher] = useState(false);
  const [isOverExit, setIsOverExit] = useState(false);
  const [quickReplyId, setQuickReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  // Stealth Decoy Mode - Dynamic Icon
  const BubbleIcon = useMemo(() => {
    if (!settings.stealthMode) return MessageCircle;
    return Math.random() > 0.5 ? Battery : CloudSun;
  }, [settings.stealthMode]);

  const handleQuickSend = (convoId: string) => {
    if (!replyText.trim()) return;
    sendMessage(convoId, replyText.trim());
    setReplyText('');
    setQuickReplyId(null);
  };

  const handleTouchStart = () => setIsDragging(true);

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = (e as React.TouchEvent).touches[0].clientX;
      clientY = (e as React.TouchEvent).touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - window.innerWidth + (settings.bubbleSize / 2);
    const y = clientY - window.innerHeight + (settings.bubbleSize / 2);

    const exitZoneX = window.innerWidth / 2;
    const exitZoneY = window.innerHeight - 80;
    const distanceToExit = Math.sqrt(Math.pow(clientX - exitZoneX, 2) + Math.pow(clientY - exitZoneY, 2));
    setIsOverExit(distanceToExit < 60);

    setPosition({ x, y });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (isOverExit) {
      setExpanded(false);
    }
  };

  const bubbleStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    width: `${settings.bubbleSize}px`,
    height: `${settings.bubbleSize}px`,
    opacity: settings.bubbleOpacity / 100,
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Maximized View (Mini-App) */}
      {expanded && (
        <div className="absolute bottom-24 right-6 w-[320px] bg-background border border-border shadow-xl rounded-2xl overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200 origin-bottom-right flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setShowPlatformSwitcher(!showPlatformSwitcher)}
              >
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                  <Globe className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-wider text-foreground flex items-center gap-1">
                    {settings.activePlatform}
                    <ShieldCheck className="w-2.5 h-2.5 text-primary" />
                  </h2>
                  <p className="text-[9px] font-medium text-muted-foreground uppercase">Hax Engine v2.1</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`p-1.5 rounded-md transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-muted-foreground'}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setExpanded(false)} className="p-1.5 hover:bg-muted rounded-md transition-colors">
                  <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>

            {showPlatformSwitcher && (
              <div className="grid grid-cols-4 gap-1 mt-3 animate-in slide-in-from-top-1 duration-150">
                {(['sniffies', 'nkp', 'barebackrt', 'grindr'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      updateSettings({ activePlatform: p });
                      setShowPlatformSwitcher(false);
                    }}
                    className={`py-1.5 rounded-md text-[8px] font-bold uppercase transition-all border ${settings.activePlatform === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary/50'}`}
                  >
                    {p === 'barebackrt' ? 'BRT' : p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 bg-muted/20 mx-3 mt-3 rounded-lg border border-border/50">
            {[
              { id: 'chats', icon: MessageCircle, label: 'Chats' },
              { id: 'hunter', icon: Target, label: 'Hunter' },
              { id: 'heatmap', icon: Ghost, label: 'Ghosts' },
              { id: 'radar', icon: MapIcon, label: 'Radar' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex flex-col items-center py-1 rounded-md text-[8px] font-bold uppercase transition-all ${activeTab === tab.id ? 'bg-background text-primary border border-border/50' : 'text-muted-foreground'}`}
              >
                <tab.icon className="w-3 h-3 mb-0.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 max-h-[340px] overflow-y-auto">
            {activeTab === 'chats' && (
              <div className="divide-y divide-border/30">
                {conversations.map((c) => (
                  <div key={c.id} className="p-3 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-foreground text-[10px] font-bold border border-border">
                          {c.userName.slice(0, 2).toUpperCase()}
                        </div>
                        {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-[11px] font-semibold text-foreground truncate">{c.userName}</p>
                          <span className="text-[9px] font-medium text-muted-foreground">{formatTimeAgo(c.lastMessageTime)}</span>
                        </div>
                        <p className={`text-[10px] truncate ${c.unreadCount > 0 ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                          {c.lastMessage}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setQuickReplyId(quickReplyId === c.id ? null : c.id)}
                        className="flex-1 py-1.5 bg-primary/5 text-primary text-[9px] font-bold rounded-md uppercase tracking-tight border border-primary/10 hover:bg-primary/10 transition-all"
                      >
                        Quick Reply
                      </button>
                      <button
                        onClick={() => { setExpanded(false); setActiveConversation(c.id); }}
                        className="px-2 py-1.5 bg-muted text-muted-foreground text-[9px] font-bold rounded-md hover:text-foreground transition-colors"
                      >
                        Open
                      </button>
                    </div>

                    {quickReplyId === c.id && (
                      <div className="mt-3 space-y-2.5 animate-in slide-in-from-top-1 duration-150">
                        <MediaDrawer />
                        <div className="flex flex-wrap gap-1">
                          {settings.macros.map(macro => (
                            <button
                              key={macro}
                              onClick={() => setReplyText(macro)}
                              className="px-2 py-1 bg-muted/50 text-[8px] font-bold rounded border border-border/50 hover:border-primary/50 transition-colors uppercase"
                            >
                              {macro}
                            </button>
                          ))}
                        </div>
                        <BubbleAIHelper
                          conversationId={c.id}
                          onSelect={(text) => setReplyText(text)}
                        />
                        <div className="flex gap-1.5">
                          <Input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleQuickSend(c.id); }}
                            placeholder="Type reply..."
                            className="flex-1 bg-muted/50 border-border h-8 text-[10px] rounded-lg focus-visible:ring-1 focus-visible:ring-primary"
                            autoFocus
                          />
                          <button
                            onClick={() => handleQuickSend(c.id)}
                            disabled={!replyText.trim()}
                            className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 transition-transform active:scale-95"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'radar' && <BubbleRadar />}
            {activeTab === 'hunter' && <BubbleHunter />}
            {activeTab === 'heatmap' && <BubbleHeatmap />}

            {activeTab === 'settings' && (
              <div className="p-3 space-y-3">
                <div className="p-3 bg-muted/30 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-bold text-foreground uppercase tracking-wider">Engine Configuration</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Stealth Decoy', key: 'stealthMode' },
                      { label: 'AI Auto-Pilot', key: 'autoPilotEnabled' },
                      { label: 'Mood Sync', key: 'moodSyncEnabled' },
                      { label: 'Auto-Greet', key: 'autoGreetEnabled' }
                    ].map(item => (
                      <button
                        key={item.key}
                        onClick={() => updateSettings({ [item.key]: !(settings as any)[item.key] })}
                        className={`w-full flex items-center justify-between p-2 rounded-lg border text-[9px] font-bold uppercase transition-all ${(settings as any)[item.key] ? 'bg-primary/5 border-primary/20 text-primary' : 'bg-background border-border text-muted-foreground'}`}
                      >
                        <span>{item.label}</span>
                        <span>{(settings as any)[item.key] ? 'Enabled' : 'Disabled'}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-2 bg-muted/30 border-t border-border flex items-center justify-center">
             <div className="w-6 h-0.5 bg-muted-foreground/30 rounded-full" />
          </div>
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        onMouseDown={handleTouchStart}
        onTouchStart={handleTouchStart}
        style={bubbleStyle}
        className={`absolute bottom-24 right-6 pointer-events-auto rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group border ${isDragging ? 'scale-95 cursor-grabbing' : 'cursor-pointer'} ${expanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} ${isOverExit ? 'bg-destructive border-destructive text-white' : 'bg-primary border-primary/20 text-primary-foreground'}`}
      >
        <BubbleIcon className={`w-5 h-5 relative z-10 transition-transform ${isDragging ? 'scale-90' : ''}`} />

        {totalUnread > 0 && !isDragging && !settings.stealthMode && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-destructive text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-background shadow-sm">
            {totalUnread}
          </span>
        )}
      </button>

      {/* Exit Zone */}
      {isDragging && (
        <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full border flex items-center justify-center transition-all ${isOverExit ? 'scale-110 bg-destructive/10 border-destructive text-destructive' : 'bg-muted/20 border-border text-muted-foreground'}`}>
          <X className="w-6 h-6" />
        </div>
      )}
    </div>
  );
};

export default BubbleOverlay;
