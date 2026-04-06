import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Send, Pin, Star, MoreVertical, Image, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';

const ChatView = () => {
  const { conversations, activeConversation, setActiveConversation, sendMessage, togglePin, toggleStar } = useAppStore();
  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const convo = conversations.find((c) => c.id === activeConversation);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [convo?.messages.length]);

  if (!convo) return null;

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(convo.id, text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 bg-card border-b border-border">
        <button onClick={() => setActiveConversation(null)} className="p-1 active:scale-90">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold text-xs">
            {convo.userName.slice(0, 2).toUpperCase()}
          </div>
          {convo.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-online rounded-full border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm">{convo.userName}</p>
          <p className="text-[10px] text-muted-foreground">
            {convo.online ? 'Online now' : `Last seen ${formatTimeAgo(convo.lastMessageTime)}`}
            {convo.distance && ` · ${convo.distance}`}
          </p>
        </div>
        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-popover border border-border rounded-lg shadow-lg py-1 z-50 min-w-[140px]">
              <button
                onClick={() => { togglePin(convo.id); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-foreground hover:bg-secondary"
              >
                <Pin className="w-4 h-4" /> {convo.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button
                onClick={() => { toggleStar(convo.id); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-foreground hover:bg-secondary"
              >
                <Star className="w-4 h-4" /> {convo.starred ? 'Unstar' : 'Star'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {convo.messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-bubble text-bubble-foreground rounded-br-md'
                    : 'bg-bubble-received text-bubble-received-foreground rounded-bl-md'
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-[9px] mt-0.5 ${isMe ? 'text-bubble-foreground/60' : 'text-muted-foreground'}`}>
                  {formatTimeAgo(msg.timestamp)}
                  {isMe && msg.read && ' ✓✓'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3 bg-card border-t border-border">
        <button className="p-2 text-muted-foreground active:scale-90">
          <Image className="w-5 h-5" />
        </button>
        <button className="p-2 text-muted-foreground active:scale-90">
          <Smile className="w-5 h-5" />
        </button>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message..."
          className="flex-1 bg-secondary border-none rounded-full h-9 text-sm"
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="p-2 text-primary disabled:text-muted-foreground active:scale-90 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatView;
