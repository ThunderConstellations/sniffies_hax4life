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
    // Swap icon based on a hypothetical battery/weather "decoy"
    return Math.random() > 0.5 ? Battery : CloudSun;
  }, [settings.stealthMode]);

  // Mood Sync Glow Colors
  const glowColor = useMemo(() => {
    if (!settings.moodSyncEnabled) return 'shadow-primary/40';
    // Map status to colors (Mock implementation)
    const platform = settings.activePlatform;
    if (platform === 'sniffies') return 'shadow-primary/60 border-primary/50';
    if (platform === 'grindr') return 'shadow-orange-500/60 border-orange-500/50';
    return 'shadow-green-500/60 border-green-500/50';
  }, [settings.moodSyncEnabled, settings.activePlatform]);

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

    // Detect if over exit zone (bottom center)
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
      // In a real app, this would hide the bubble globally
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
        <div className="absolute bottom-24 right-6 w-[320px] bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-[32px] overflow-hidden pointer-events-auto animate-in zoom-in-95 fade-in duration-200 origin-bottom-right flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border bg-secondary/10">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setShowPlatformSwitcher(!showPlatformSwitcher)}
              >
                <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                  <Globe className="w-4 h-4 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                    {settings.activePlatform}
                    <ShieldCheck className="w-3 h-3 text-primary" />
                  </h2>
                  <p className="text-[10px] font-bold text-muted-foreground">Hax Mode Active</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`p-2 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-primary/20 text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setExpanded(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                  <Minimize2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {showPlatformSwitcher && (
              <div className="grid grid-cols-4 gap-1.5 mt-3 animate-in slide-in-from-top-2 duration-200">
                {(['sniffies', 'nkp', 'barebackrt', 'grindr'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      updateSettings({ activePlatform: p });
                      setShowPlatformSwitcher(false);
                    }}
                    className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all border ${settings.activePlatform === p ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/50'}`}
                  >
                    {p === 'barebackrt' ? 'BRT' : p}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 bg-secondary/30 mx-4 mt-4 rounded-xl">
            <button onClick={() => setActiveTab('chats')} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === 'chats' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>
              <MessageCircle className="w-3.5 h-3.5 mb-0.5" />
              Chats
            </button>
            <button onClick={() => setActiveTab('hunter')} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === 'hunter' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>
              <Target className="w-3.5 h-3.5 mb-0.5" />
              Hunter
            </button>
            <button onClick={() => setActiveTab('heatmap')} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === 'heatmap' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>
              <Ghost className="w-3.5 h-3.5 mb-0.5" />
              Ghosts
            </button>
            <button onClick={() => setActiveTab('radar')} className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === 'radar' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}>
              <MapIcon className="w-3.5 h-3.5 mb-0.5" />
              Radar
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 max-h-[360px] overflow-y-auto custom-scrollbar">
            {activeTab === 'chats' && (
              <div className="divide-y divide-border/40">
                {conversations.map((c) => (
                  <div key={c.id} className="p-4 hover:bg-secondary/20 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary text-xs font-black">
                          {c.userName.slice(0, 2).toUpperCase()}
                        </div>
                        {c.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-bold text-foreground truncate">{c.userName}</p>
                          <span className="text-[10px] font-medium text-muted-foreground">{formatTimeAgo(c.lastMessageTime)}</span>
                        </div>
                        <p className={`text-xs truncate ${c.unreadCount > 0 ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {c.lastMessage}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setQuickReplyId(quickReplyId === c.id ? null : c.id)}
                        className="flex-1 py-1.5 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-tight hover:bg-primary hover:text-primary-foreground transition-all"
                      >
                        Quick Reply
                      </button>
                      <button
                        onClick={() => { setExpanded(false); setActiveConversation(c.id); }}
                        className="px-3 py-1.5 bg-secondary text-muted-foreground text-[10px] font-bold rounded-lg hover:bg-secondary/80"
                      >
                        Open App
                      </button>
                    </div>

                    {quickReplyId === c.id && (
                      <div className="mt-3 space-y-3 animate-in slide-in-from-top-2">
                        <MediaDrawer />
                        <div className="flex flex-wrap gap-1.5">
                          {settings.macros.map(macro => (
                            <button
                              key={macro}
                              onClick={() => setReplyText(macro)}
                              className="px-2 py-1 bg-secondary text-[9px] font-bold rounded-md border border-border/50 hover:border-primary transition-colors"
                            >
                              {macro}
                            </button>
                          ))}
                        </div>
                        <BubbleAIHelper
                          conversationId={c.id}
                          onSelect={(text) => setReplyText(text)}
                        />
                        <div className="flex gap-2">
                          <Input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleQuickSend(c.id); }}
                            placeholder="Type response..."
                            className="flex-1 bg-secondary border-none h-9 text-xs rounded-xl"
                            autoFocus
                          />
                          <button
                            onClick={() => handleQuickSend(c.id)}
                            disabled={!replyText.trim()}
                            className="p-2.5 bg-primary text-primary-foreground rounded-xl disabled:opacity-50"
                          >
                            <Send className="w-4 h-4" />
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
              <div className="p-4 space-y-4">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-sm font-black text-foreground uppercase tracking-tight">Phase 2 Hax</span>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => updateSettings({ stealthMode: !settings.stealthMode })}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border ${settings.stealthMode ? 'bg-primary/20 border-primary text-primary' : 'bg-card border-border text-muted-foreground'}`}
                    >
                      <span className="text-[10px] font-black uppercase">Stealth Decoy</span>
                      <span className="text-[10px] font-bold">{settings.stealthMode ? 'ON' : 'OFF'}</span>
                    </button>
                    <button
                      onClick={() => updateSettings({ autoPilotEnabled: !settings.autoPilotEnabled })}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border ${settings.autoPilotEnabled ? 'bg-primary/20 border-primary text-primary' : 'bg-card border-border text-muted-foreground'}`}
                    >
                      <span className="text-[10px] font-black uppercase">AI Auto-Pilot</span>
                      <span className="text-[10px] font-bold">{settings.autoPilotEnabled ? 'ON' : 'OFF'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-secondary/10 border-t border-border flex items-center justify-center">
             <div className="w-8 h-1 bg-muted-foreground/20 rounded-full" />
          </div>
        </div>
      )}

      {/* Bubble Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        onMouseDown={handleTouchStart}
        onTouchStart={handleTouchStart}
        style={bubbleStyle}
        className={`absolute bottom-24 right-6 pointer-events-auto rounded-full flex items-center justify-center shadow-xl transition-all duration-200 group border-2 ${isDragging ? 'scale-90 cursor-grabbing' : 'animate-pulse-bubble cursor-pointer'} ${expanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} ${isOverExit ? 'bg-destructive shadow-destructive/40 border-destructive' : `bg-primary ${glowColor}`}`}
      >
        <div className={`absolute inset-0 rounded-full bg-inherit animate-ping opacity-20 ${expanded ? 'hidden' : ''}`} />
        <BubbleIcon className={`w-6 h-6 text-primary-foreground relative z-10 transition-transform ${isDragging ? 'scale-75' : 'group-hover:scale-110'}`} />

        {totalUnread > 0 && !isDragging && !settings.stealthMode && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg animate-bounce">
            {totalUnread}
          </span>
        )}
      </button>

      {/* Exit Zone */}
      {isDragging && (
        <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all ${isOverExit ? 'scale-125 bg-destructive/20 border-destructive text-destructive' : 'bg-black/20 border-white/20 text-white/40'}`}>
          <X className="w-8 h-8" />
        </div>
      )}
    </div>
  );
};

export default BubbleOverlay;
