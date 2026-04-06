import { useAppStore, type Conversation } from '@/lib/store';
import { Pin, Star, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';

const ConversationItem = ({ convo, onSelect }: { convo: Conversation; onSelect: () => void }) => {
  const initials = convo.userName.slice(0, 2).toUpperCase();

  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-secondary/60 transition-colors active:scale-[0.98] text-left"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
          {initials}
        </div>
        {convo.online ? (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-online rounded-full border-2 border-background" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-foreground truncate text-sm">{convo.userName}</span>
          {convo.pinned && <Pin className="w-3 h-3 text-primary shrink-0" />}
          {convo.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />}
          {convo.distance && (
            <span className="text-[10px] text-muted-foreground ml-auto shrink-0">{convo.distance}</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{convo.lastMessage}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[10px] text-muted-foreground">{formatTimeAgo(convo.lastMessageTime)}</span>
        {convo.unreadCount > 0 && (
          <span className="min-w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {convo.unreadCount}
          </span>
        )}
      </div>
    </button>
  );
};

const ConversationList = () => {
  const { conversations, setActiveConversation } = useAppStore();
  const [search, setSearch] = useState('');

  const filtered = conversations
    .filter((c) => c.userName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.lastMessageTime - a.lastMessageTime;
    });

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-foreground">Chats</h1>
          {totalUnread > 0 && (
            <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5">
              {totalUnread}
            </span>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-none h-9 text-sm rounded-xl"
          />
        </div>
      </div>

      {/* Online now */}
      <div className="px-4 py-2">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {conversations.filter(c => c.online).map((c) => (
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

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2">
        {filtered.map((c) => (
          <ConversationItem key={c.id} convo={c} onSelect={() => setActiveConversation(c.id)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground text-sm py-8">No conversations found</p>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
