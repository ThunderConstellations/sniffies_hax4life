import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  MessageCircle, X, Send, Maximize2, Minimize2,
  Globe, ShieldCheck, Sparkles, Map as MapIcon,
  Settings as SettingsIcon, LayoutGrid, Trash2,
  Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';
import BubbleRadar from './BubbleRadar';
import BubbleAIHelper from './BubbleAIHelper';

const BubbleOverlay = () => {
  const { conversations, settings, sendMessage, setActiveConversation, updateSettings } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'radar' | 'settings'>('chats');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showPlatformSwitcher, setShowPlatformSwitcher] = useState(false);
  const [isOverExit, setIsOverExit] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [quickReplyId, setQuickReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

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
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Calculate position relative to bottom-right origin
    const x = clientX - window.innerWidth + (settings.bubbleSize / 2);
    const y = clientY - window.innerHeight + (settings.bubbleSize / 2);

    // Check for exit zone (bottom center)
    const exitZoneX = window.innerWidth / 2;
    const exitZoneY = window.innerHeight - 80;
    const distToExit = Math.sqrt(Math.pow(clientX - exitZoneX, 2) + Math.pow(clientY - exitZoneY, 2));

    setIsOverExit(distToExit < 60);
    setPosition({ x, y });
  };

  const handleTouchEnd = () => {
    if (isOverExit) {
      setIsVisible(false);
    }
    setIsDragging(false);
  };

  if (!isVisible) return null;

  const bubbleStyle = {
    width: `${settings.bubbleSize}px`,
    height: `${settings.bubbleSize}px`,
    opacity: settings.bubbleOpacity / 100,
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Exit Zone */}
      {isDragging && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all">
          <div className={`p-4 rounded-full border-2 transition-all ${isOverExit ? 'bg-destructive/20 border-destructive scale-125' : 'bg-secondary/20 border-muted-foreground/20'}`}>
            <Trash2 className={`w-6 h-6 ${isOverExit ? 'text-destructive animate-bounce' : 'text-muted-foreground'}`} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${isOverExit ? 'text-destructive' : 'text-muted-foreground opacity-50'}`}>
            {isOverExit ? 'Release to Close' : 'Exit'}
          </span>
        </div>
      )}

      {/* Mini-App Window */}
      {expanded && (
        <div className="absolute bottom-24 right-6 pointer-events-auto w-[320px] bg-card border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-200 overflow-hidden flex flex-col"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
          {/* Header */}
          <div className="p-4 bg-primary/5 border-b border-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Globe className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-black text-[10px] text-primary uppercase tracking-wider leading-none">Hax Pro Bubble</p>
                  <p className="text-[12px] font-bold text-foreground capitalize">{settings.activePlatform}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPlatformSwitcher(!showPlatformSwitcher)}
                  className={`p-2 rounded-xl transition-colors ${showPlatformSwitcher ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setExpanded(false)} className="p-2 hover:bg-secondary rounded-xl transition-colors">
                  <Minimize2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            {showPlatformSwitcher && (
              <div className="grid grid-cols-4 gap-1.5 animate-in slide-in-from-top-2 duration-200">
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
            <button
              onClick={() => setActiveTab('chats')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'chats' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Chats
            </button>
            <button
              onClick={() => setActiveTab('radar')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'radar' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              Radar
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'settings' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              Hax
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 max-h-[360px] overflow-y-auto">
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
                      {c.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-primary text-primary-foreground text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                          {c.unreadCount}
                        </div>
                      )}
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
                      <div className="mt-3 space-y-2 animate-in slide-in-from-top-2">
                        <BubbleAIHelper
                          conversationId={c.id}
                          onSelect={(text) => {
                            setReplyText(text);
                          }}
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

            {activeTab === 'settings' && (
              <div className="p-4 space-y-4">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <span className="text-sm font-black text-foreground uppercase tracking-tight">AI Wingman</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                    Enable AI-powered suggested replies in the chat view.
                  </p>
                  <button className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-lg shadow-primary/20">
                    Configure AI Keys
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Ghost Mode</p>
                    <p className="text-xs font-bold text-foreground">Active</p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-xl">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Hax Active</p>
                    <p className="text-xs font-bold text-foreground">12/12</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
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
        className={`absolute bottom-24 right-6 pointer-events-auto rounded-full flex items-center justify-center shadow-xl transition-all duration-200 group ${isDragging ? 'scale-90 cursor-grabbing' : 'animate-pulse-bubble cursor-pointer'} ${expanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} ${isOverExit ? 'bg-destructive shadow-destructive/40' : 'bg-primary shadow-primary/40'}`}
      >
        <div className={`absolute inset-0 rounded-full bg-inherit animate-ping opacity-20 ${expanded ? 'hidden' : ''}`} />
        <MessageCircle className={`w-6 h-6 text-primary-foreground relative z-10 transition-transform ${isDragging ? 'scale-75' : 'group-hover:scale-110'}`} />

        {totalUnread > 0 && !isDragging && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-black rounded-full flex items-center justify-center px-1.5 shadow-lg animate-bounce">
            {totalUnread}
          </span>
        )}
      </button>
    </div>
  );
};

export default BubbleOverlay;
