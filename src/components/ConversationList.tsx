import { useAppStore, type Conversation } from '@/lib/store';
import { Pin, Star, Search, BellOff, Archive, Trash2, MoreHorizontal, User } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';

const ConversationItem = ({ convo, onSelect }: { convo: Conversation; onSelect: () => void }) => {
  const { togglePin, toggleStar, toggleMute, toggleArchive, deleteConversation, markAsRead } = useAppStore();
  const [showActions, setShowActions] = useState(false);
  const initials = convo.userName.slice(0, 2).toUpperCase();

  return (
    <div className="relative group px-1">
      <button
        onClick={onSelect}
        onContextMenu={(e) => { e.preventDefault(); setShowActions(!showActions); }}
        className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-muted/40 transition-all active:scale-[0.99] text-left border border-transparent hover:border-border/50"
      >
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
            <User className="w-5 h-5 opacity-40" />
          </div>
          {convo.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-bold text-foreground truncate text-[13px] uppercase tracking-tight">{convo.userName}</span>
            {convo.pinned && <Pin className="w-2.5 h-2.5 text-primary fill-current shrink-0" />}
            {convo.distance && (
              <span className="text-[9px] font-black text-primary ml-auto shrink-0 uppercase">{convo.distance}</span>
            )}
          </div>
          <p className={`text-[11px] truncate ${convo.unreadCount > 0 ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
            {convo.lastMessage}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0 ml-1">
          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">{formatTimeAgo(convo.lastMessageTime)}</span>
          {convo.unreadCount > 0 && (
            <span className="min-w-[16px] h-[16px] bg-primary text-primary-foreground text-[9px] font-black rounded flex items-center justify-center px-1 shadow-sm">
              {convo.unreadCount}
            </span>
          )}
        </div>
      </button>

      {showActions && (
        <div className="absolute right-4 top-2 bg-background border border-border rounded-lg shadow-2xl py-1 z-50 min-w-[140px] animate-in fade-in zoom-in-95">
          <button onClick={() => { togglePin(convo.id); setShowActions(false); }} className="flex items-center gap-2 px-3 py-1.5 w-full text-[10px] font-bold uppercase hover:bg-muted">
            <Pin className="w-3 h-3" /> {convo.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button onClick={() => { toggleStar(convo.id); setShowActions(false); }} className="flex items-center gap-2 px-3 py-1.5 w-full text-[10px] font-bold uppercase hover:bg-muted">
            <Star className="w-3 h-3" /> {convo.starred ? 'Unstar' : 'Star'}
          </button>
          <button onClick={() => { if (confirm(`Delete chat with ${convo.userName}?`)) deleteConversation(convo.id); setShowActions(false); }} className="flex items-center gap-2 px-3 py-1.5 w-full text-[10px] font-bold uppercase text-destructive hover:bg-muted">
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      )}
    </div>
  );
};

type FilterTab = 'all' | 'unread' | 'starred' | 'archived';

const ConversationList = () => {
  const { conversations, setActiveConversation } = useAppStore();
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');

  const filtered = conversations
    .filter((c) => {
      if (!c.userName.toLowerCase().includes(search.toLowerCase())) return false;
      switch (filterTab) {
        case 'unread': return (c.unreadCount || 0) > 0;
        case 'starred': return c.starred;
        case 'archived': return c.archived;
        default: return !c.archived;
      }
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.lastMessageTime - a.lastMessageTime;
    });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'New', count: totalUnread },
    { id: 'starred', label: 'Favs' },
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="p-4 pb-2 border-b border-border/50 bg-muted/10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-sm font-black text-foreground uppercase tracking-widest">Inbox</h1>
          {totalUnread > 0 && (
            <span className="bg-primary text-primary-foreground text-[10px] font-black rounded px-1.5 py-0.5">
              {totalUnread} NEW
            </span>
          )}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="FILTER CONTACTS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-muted/40 border border-border/50 rounded-lg text-[10px] font-bold uppercase tracking-wider focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="flex gap-2 mb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all ${
                filterTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label} {tab.count ? `(${tab.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-2 space-y-0.5">
        {filtered.map((c) => (
          <ConversationItem key={c.id} convo={c} onSelect={() => setActiveConversation(c.id)} />
        ))}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
             <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-3">
                <Search className="w-6 h-6 text-muted-foreground/20" />
             </div>
             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
               No Transmissions Found
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
