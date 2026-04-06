import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MessageCircle, X } from 'lucide-react';

const BubbleOverlay = () => {
  const { conversations } = useAppStore();
  const [expanded, setExpanded] = useState(false);
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {/* Expanded preview */}
      {expanded && (
        <div className="mb-3 w-72 bg-card border border-border rounded-2xl shadow-2xl animate-slide-up overflow-hidden">
          <div className="p-3 border-b border-border flex items-center justify-between">
            <span className="font-semibold text-sm text-foreground">Quick Messages</span>
            <button onClick={() => setExpanded(false)}>
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {conversations
              .filter((c) => c.unreadCount > 0)
              .map((c) => (
                <div key={c.id} className="p-3 border-b border-border/50 last:border-none">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                      {c.userName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground">{c.userName}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    <span className="bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                      {c.unreadCount}
                    </span>
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
        className="relative w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 active:scale-90 transition-transform animate-pulse-bubble"
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
