import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageCircle, X, Send, Maximize2, Minimize2, Globe, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';

const BubbleOverlay = () => {
  const { conversations, settings, sendMessage, setActiveConversation } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [quickReplyId, setQuickReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const handleQuickSend = (convoId: string) => {
    if (!replyText.trim()) return;
    sendMessage(convoId, replyText.trim());
    setReplyText('');
    setQuickReplyId(null);
  };

  const bubbleStyle = {
    width: `${settings.bubbleSize}px`,
    height: `${settings.bubbleSize}px`,
    opacity: settings.bubbleOpacity / 100,
    transform: `translate(${position.x}px, ${position.y}px)`,
  };

  const handleTouchStart = () => setIsDragging(true);
  const handleTouchEnd = () => setIsDragging(false);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];

    // Smooth bounds-aware dragging
    const x = Math.min(Math.max(touch.clientX - window.innerWidth + 28, -window.innerWidth + 56), 0);
    const y = Math.min(Math.max(touch.clientY - window.innerHeight + 120, -window.innerHeight + 150), 0);

    setPosition({ x, y });
  };

  return (
    <div
      className="fixed bottom-24 right-6 z-50 select-none"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {expanded && (
        <div className="mb-3 w-80 bg-card border border-border rounded-2xl shadow-2xl animate-slide-up overflow-hidden transform"
          style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
        >
          <div className="p-3 bg-primary/5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="font-bold text-xs text-foreground uppercase tracking-tight">Hax Quick Panel</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setExpanded(false)} className="p-1 hover:bg-secondary rounded-full">
                <Minimize2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button onClick={() => setExpanded(false)} className="p-1 hover:bg-secondary rounded-full">
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {conversations
              .filter((c) => c.unreadCount > 0)
              .map((c) => (
                <div key={c.id} className="border-b border-border/50 last:border-none">
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                        {c.userName.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground">{c.userName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{c.lastMessage}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {c.unreadCount}
                        </span>
                      </div>
                    </div>

                    {/* Quick reply buttons */}
                    <div className="mt-2 flex gap-1.5">
                      <button
                        onClick={() => setQuickReplyId(quickReplyId === c.id ? null : c.id)}
                        className="text-[10px] px-2 py-1 bg-primary/20 text-primary rounded-full"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => { setExpanded(false); setActiveConversation(c.id); }}
                        className="text-[10px] px-2 py-1 bg-secondary text-muted-foreground rounded-full"
                      >
                        Open
                      </button>
                      <span className="text-[9px] text-muted-foreground self-center ml-auto">
                        {formatTimeAgo(c.lastMessageTime)}
                      </span>
                    </div>

                    {/* Inline quick reply */}
                    {quickReplyId === c.id && (
                      <div className="mt-2 flex gap-1.5">
                        <Input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleQuickSend(c.id); }}
                          placeholder="Quick reply..."
                          className="flex-1 bg-secondary border-none h-7 text-xs rounded-lg"
                          autoFocus
                        />
                        <button
                          onClick={() => handleQuickSend(c.id)}
                          disabled={!replyText.trim()}
                          className="p-1.5 text-primary disabled:text-muted-foreground"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {conversations.filter((c) => c.unreadCount > 0).length === 0 && (
              <p className="text-center text-muted-foreground text-xs py-6">No unread messages</p>
            )}
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setExpanded(!expanded)}
        onTouchStart={handleTouchStart}
        style={bubbleStyle}
        className={`relative bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/40 active:scale-95 transition-all ${isDragging ? 'scale-110 opacity-70' : 'animate-pulse-bubble'}`}
      >
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
        <MessageCircle className="w-6 h-6 text-primary-foreground relative z-10" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {totalUnread}
          </span>
        )}
      </button>
    </div>
  );
};

export default BubbleOverlay;
