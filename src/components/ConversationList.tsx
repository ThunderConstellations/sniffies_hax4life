import { useAppStore, type Conversation } from '@/lib/store';
import { Pin, Star, Search, BellOff, Archive, Trash2, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';

const ConversationItem = ({ convo, onSelect }: { convo: Conversation; onSelect: () => void }) => {
  const { togglePin, toggleStar, toggleMute, toggleArchive, deleteConversation, markAsRead } = useAppStore();
  const [showActions, setShowActions] = useState(false);
  const initials = convo.userName.slice(0, 2).toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={onSelect}
        onContextMenu={(e) => { e.preventDefault(); setShowActions(!showActions); }}
        className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-secondary/60 transition-colors active:scale-[0.98] text-left"
      >
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
            {initials}
          </div>
          {convo.online && (
            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-online rounded-full border-2 border-background" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground truncate text-sm">{convo.userName}</span>
            {convo.pinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
            {convo.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
            {convo.muted && <BellOff className="w-3 h-3 text-muted-foreground shrink-0" />}
            {convo.distance && (
              <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{convo.distance}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-[10px] text-muted-foreground">{formatTimeAgo(convo.lastMessageTime)}</span>
          {convo.unreadCount > 0 && (
            <span className="min-w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
              {convo.unreadCount}
            </span>
          )}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setShowActions(!showActions); }}
          className="p-1 text-muted-foreground shrink-0"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </button>

      {/* Quick actions popup */}
      {showActions && (
        <div className="absolute right-12 top-2 bg-popover border border-border rounded-lg shadow-xl py-1 z-50 min-w-[140px] animate-scale-in">
          <button
            onClick={() => { togglePin(convo.id); setShowActions(false); }}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-foreground hover:bg-secondary"
          >
            <Pin className="w-3.5 h-3.5" /> {convo.pinned ? 'Unpin' : 'Pin'}
          </button>
          <button
            onClick={() => { toggleStar(convo.id); setShowActions(false); }}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-foreground hover:bg-secondary"
          >
            <Star className="w-3.5 h-3.5" /> {convo.starred ? 'Unstar' : 'Star'}
          </button>
          <button
            onClick={() => { toggleMute(convo.id); setShowActions(false); }}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-foreground hover:bg-secondary"
          >
            <BellOff className="w-3.5 h-3.5" /> {convo.muted ? 'Unmute' : 'Mute'}
          </button>
          {convo.unreadCount > 0 && (
            <button
              onClick={() => { markAsRead(convo.id); setShowActions(false); }}
              className="flex items-center gap-2 px-3 py-2 w-full text-xs text-foreground hover:bg-secondary"
            >
              ✓ Mark Read
            </button>
          )}
          <button
            onClick={() => { toggleArchive(convo.id); setShowActions(false); }}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-foreground hover:bg-secondary"
          >
            <Archive className="w-3.5 h-3.5" /> {convo.archived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={() => { if (confirm(`Delete chat with ${convo.userName}?`)) deleteConversation(convo.id); setShowActions(false); }}
            className="flex items-center gap-2 px-3 py-2 w-full text-xs text-destructive hover:bg-secondary"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
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
        case 'unread': return c.unreadCount > 0;
        case 'starred': return c.starred;
        case 'archived': return c.archived;
        default: return !c.archived;
      }
    })
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.lastMessageTime - a.lastMessageTime;
    });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  const tabs: { id: FilterTab; label: string; count?: number }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: 'Unread', count: totalUnread },
    { id: 'starred', label: '⭐' },
    { id: 'archived', label: '📦' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
          {totalUnread > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-none h-9 text-sm rounded-xl"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filterTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {tab.label}
              {tab.count ? ` (${tab.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Online now */}
      {filterTab === 'all' && (
        <div className="px-4 py-2">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {conversations.filter(c => c.online && !c.archived).map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveConversation(c.id)}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs border-2 border-primary/40">
                    {c.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-online rounded-full border-2 border-background" />
                </div>
                <span className="text-[10px] text-muted-foreground">{c.userName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((c) => (
          <ConversationItem key={c.id} convo={c} onSelect={() => setActiveConversation(c.id)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">
            {filterTab === 'archived' ? 'No archived chats' : filterTab === 'unread' ? 'All caught up! 🎉' : 'No conversations found'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
