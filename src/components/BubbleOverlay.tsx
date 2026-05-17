import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  MessageCircle, X, Send, Maximize2, Minimize2,
  Globe, ShieldCheck, Sparkles, Map as MapIcon,
  Settings as SettingsIcon, LayoutGrid, Trash2,
  Zap, Target, Battery, Sun, Ghost, Flame,
  Image as ImageIcon
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';
import BubbleRadar from './BubbleRadar';
import BubbleAIHelper from './BubbleAIHelper';
import BubbleHunter from './BubbleHunter';

const BubbleOverlay = () => {
  const { conversations, settings, sendMessage, setActiveConversation, updateSettings } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'chats' | 'radar' | 'hunter' | 'media' | 'settings'>('chats');
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

  const getBubbleIcon = () => {
    switch (settings.decoyMode) {
      case 'battery': return <Battery className="w-6 h-6 text-green-500" />;
      case 'weather': return <Sun className="w-6 h-6 text-yellow-500" />;
      default: return <MessageCircle className={`w-6 h-6 text-primary-foreground relative z-10 transition-transform ${isDragging ? 'scale-75' : 'group-hover:scale-110'}`} />;
    }
  };

  const getMoodColor = () => {
    switch (settings.moodStatus) {
      case 'rightnow': return 'shadow-red-500/40 bg-red-600';
      case 'chatting': return 'shadow-blue-500/40 bg-blue-600';
      case 'browsing': return 'shadow-orange-500/40 bg-orange-600';
      default: return 'shadow-primary/40 bg-primary';
    }
  };

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
              onClick={() => setActiveTab('hunter')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'hunter' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              <Target className="w-3.5 h-3.5" />
              Hunter
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all ${activeTab === 'media' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground'}`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              Pics
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
                        <div className="flex flex-wrap gap-1 mb-2">
                          {['Looking?', 'Location?', 'Pic?', 'Wassup', '🔥'].map((macro) => (
                            <button
                              key={macro}
                              onClick={() => {
                                sendMessage(c.id, macro);
                                setQuickReplyId(null);
                              }}
                              className="px-2 py-1 bg-primary/5 border border-primary/10 rounded-md text-[9px] font-bold text-primary hover:bg-primary hover:text-white transition-all"
                            >
                              {macro}
                            </button>
                          ))}
                        </div>
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
            {activeTab === 'hunter' && <BubbleHunter />}
            {activeTab === 'media' && (
              <div className="p-4 space-y-4">
                <p className="text-[10px] font-bold text-muted-foreground uppercase ml-1">Quick Send Media</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex-shrink-0 w-24 h-32 bg-secondary rounded-xl overflow-hidden relative group cursor-pointer border border-transparent hover:border-primary transition-all">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-[9px] text-white font-bold">Send Now</p>
                      </div>
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                         <ImageIcon className="w-6 h-6 opacity-20" />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full py-2.5 bg-secondary text-foreground text-[10px] font-bold rounded-xl border border-dashed border-border">
                  Upload to Quick Drawer
                </button>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSettings({ decoyMode: settings.decoyMode === 'chat' ? 'battery' : 'chat' })}
                    className={`p-3 rounded-xl border flex flex-col items-start gap-2 transition-all ${settings.decoyMode !== 'chat' ? 'bg-primary/10 border-primary' : 'bg-secondary/50 border-transparent'}`}
                  >
                    <Shield className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-[10px] font-bold uppercase">Stealth</p>
                      <p className="text-[9px] text-muted-foreground">Decoy Mode</p>
                    </div>
                  </button>
                  <button
                    onClick={() => updateSettings({ moodStatus: settings.moodStatus === 'active' ? 'rightnow' : 'active' })}
                    className={`p-3 rounded-xl border flex flex-col items-start gap-2 transition-all ${settings.moodStatus === 'rightnow' ? 'bg-red-500/10 border-red-500' : 'bg-secondary/50 border-transparent'}`}
                  >
                    <Flame className="w-4 h-4 text-red-500" />
                    <div>
                      <p className="text-[10px] font-bold uppercase">Mood</p>
                      <p className="text-[9px] text-muted-foreground">{settings.moodStatus}</p>
                    </div>
                  </button>
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Zap className="w-5 h-5 text-primary" />
                      <span className="text-sm font-black text-foreground uppercase tracking-tight">AI Autopilot</span>
                    </div>
                    <button
                      onClick={() => updateSettings({ autoPilotEnabled: !settings.autoPilotEnabled })}
                      className={`w-10 h-5 rounded-full transition-colors relative ${settings.autoPilotEnabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.autoPilotEnabled ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                    Replies automatically to incoming chats using your voice and style.
                  </p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-secondary text-foreground text-[10px] font-bold rounded-lg">
                      Train Mimicry
                    </button>
                    <button className="flex-1 py-2 bg-secondary text-foreground text-[10px] font-bold rounded-lg">
                      Block-list
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-secondary/30 rounded-2xl border border-border">
                   <div className="flex items-center gap-3 mb-3">
                    <Ghost className="w-5 h-5 text-muted-foreground" />
                    <span className="text-sm font-bold text-foreground">Ghost Presence</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">Pulse online every 5m</p>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
        className={`absolute bottom-24 right-6 pointer-events-auto rounded-full flex items-center justify-center shadow-xl transition-all duration-200 group ${isDragging ? 'scale-90 cursor-grabbing' : 'animate-pulse-bubble cursor-pointer'} ${expanded ? 'scale-0 opacity-0' : 'scale-100 opacity-100'} ${isOverExit ? 'bg-destructive shadow-destructive/40' : getMoodColor()}`}
      >
        <div className={`absolute inset-0 rounded-full bg-inherit animate-ping opacity-20 ${expanded ? 'hidden' : ''}`} />
        {getBubbleIcon()}

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
