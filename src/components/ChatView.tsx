import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, Send, Pin, Star, MoreVertical, Image, Smile, Trash2, BellOff, Bell, Download, Search, X, Volume2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const QUICK_REACTIONS = ['❤️', '🔥', '😏', '👀', '😈', '💦'];

const ChatView = () => {
  const { conversations, activeConversation, setActiveConversation, sendMessage, togglePin, toggleStar, toggleMute, deleteMessage, addReaction, exportConversation, deleteConversation, setContactSound, settings } = useAppStore();
  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSoundPicker, setShowSoundPicker] = useState(false);
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

  const handleExport = () => {
    const data = exportConversation(convo.id);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${convo.userName}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm(`Delete entire conversation with ${convo.userName}?`)) {
      deleteConversation(convo.id);
    }
    setShowMenu(false);
  };

  const filteredMessages = convo.messages.filter((msg) =>
    !searchQuery || msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-foreground text-sm">{convo.userName}</p>
            {convo.muted && <BellOff className="w-3 h-3 text-muted-foreground" />}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {convo.typing && settings.showTypingIndicator
              ? 'typing...'
              : convo.online
                ? 'Online now'
                : `Last seen ${formatTimeAgo(convo.lastMessageTime)}`}
            {convo.distance && settings.showDistance && ` · ${convo.distance}`}
          </p>
        </div>

        <button onClick={() => setSearchMode(!searchMode)} className="p-1">
          <Search className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="relative">
          <button onClick={() => setShowMenu(!showMenu)} className="p-1">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-8 bg-popover border border-border rounded-lg shadow-lg py-1 z-50 min-w-[160px]">
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
              <button
                onClick={() => { toggleMute(convo.id); setShowMenu(false); }}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-foreground hover:bg-secondary"
              >
                {convo.muted ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                {convo.muted ? 'Unmute' : 'Mute'}
              </button>
              <button
                onClick={() => { setShowSoundPicker(!showSoundPicker); }}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-foreground hover:bg-secondary"
              >
                <Volume2 className="w-4 h-4" /> Notification Sound
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-foreground hover:bg-secondary"
              >
                <Download className="w-4 h-4" /> Export Chat
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 w-full text-sm text-destructive hover:bg-secondary"
              >
                <Trash2 className="w-4 h-4" /> Delete Chat
              </button>
              {showSoundPicker && (
                <div className="px-3 py-2 border-t border-border">
                  <Select
                    value={convo.notificationSound || 'default'}
                    onValueChange={(v) => { setContactSound(convo.id, v); setShowSoundPicker(false); setShowMenu(false); }}
                  >
                    <SelectTrigger className="bg-secondary border-none h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="chime">Chime</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="silent">Silent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search bar */}
      {searchMode && (
        <div className="flex items-center gap-2 p-2 bg-card border-b border-border">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in chat..."
            className="flex-1 bg-secondary border-none h-8 text-sm rounded-lg"
            autoFocus
          />
          <button onClick={() => { setSearchMode(false); setSearchQuery(''); }}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[78%]">
                <div
                  onDoubleClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                  className={`px-3.5 py-2 rounded-2xl text-sm ${
                    msg.deleted
                      ? 'bg-muted text-muted-foreground italic'
                      : isMe
                        ? 'bg-bubble text-bubble-foreground rounded-br-md'
                        : 'bg-bubble-received text-bubble-received-foreground rounded-bl-md'
                  }`}
                  style={{ fontSize: `${settings.fontSize}px` }}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[9px] mt-0.5 ${isMe ? 'text-bubble-foreground/60' : 'text-muted-foreground'}`}>
                    {formatTimeAgo(msg.timestamp)}
                    {isMe && settings.showReadReceipts && (msg.read ? ' ✓✓' : ' ✓')}
                  </p>
                </div>

                {/* Reactions display */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex gap-0.5 mt-0.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {msg.reactions.map((r, i) => (
                      <span key={i} className="text-xs bg-secondary rounded-full px-1.5 py-0.5 cursor-pointer"
                        onClick={() => addReaction(convo.id, msg.id, r)}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                )}

                {/* Reaction picker */}
                {showReactions === msg.id && !msg.deleted && (
                  <div className={`flex gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className="bg-popover border border-border rounded-full px-2 py-1 flex gap-1.5 shadow-lg">
                      {QUICK_REACTIONS.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => { addReaction(convo.id, msg.id, emoji); setShowReactions(null); }}
                          className="text-sm hover:scale-125 transition-transform active:scale-90"
                        >
                          {emoji}
                        </button>
                      ))}
                      {isMe && (
                        <button
                          onClick={() => { deleteMessage(convo.id, msg.id); setShowReactions(null); }}
                          className="text-destructive ml-1 pl-1.5 border-l border-border"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {convo.typing && settings.showTypingIndicator && (
          <div className="flex justify-start">
            <div className="bg-bubble-received rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
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
