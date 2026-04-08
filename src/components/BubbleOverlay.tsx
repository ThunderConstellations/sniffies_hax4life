import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageCircle, X, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';

const BubbleOverlay = () => {
  const { conversations, settings, sendMessage, setActiveConversation } = useAppStore();
  const [expanded, setExpanded] = useState(false);
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
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {expanded && (
        <div className="mb-3 w-72 bg-card border border-border rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">Quick Messages</span>
            <button onClick={() => setExpanded(false)}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
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
        style={bubbleStyle}
        className="relative bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform animate-pulse-bubble"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground" />
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
