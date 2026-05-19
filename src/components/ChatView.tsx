import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import {
  ArrowLeft, Send, Image, MoreVertical, Search, X,
  Shield, Sparkles, Loader2, Pin, Star, BellOff, Bell,
  Trash2, Download, Volume2, User
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { formatTimeAgo } from '@/lib/utils';
import { generateChatResponse } from '@/lib/ai-service';
import { toast } from 'sonner';
import ProfileViewer from './ProfileViewer';

const QUICK_REACTIONS = ['🔥', '😏', '👋', '🍆', '😈', '🍑'];

const ChatView = () => {
  const {
    activeConversation,
    conversations,
    setActiveConversation,
    sendMessage,
    settings,
    togglePin,
    toggleStar,
    toggleMute,
    deleteMessage,
    addReaction,
    deleteConversation,
    setContactSound
  } = useAppStore();

  const [text, setText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const convo = conversations.find((c) => c.id === activeConversation);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [convo?.messages.length]);

  if (!convo) return null;

  if (showProfile) {
    return <ProfileViewer convo={convo} onClose={() => setShowProfile(false)} />;
  }

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(convo.id, text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleAiAssist = async () => {
    if (!settings.geminiKey && !settings.openRouterKey) {
      toast.error('Set API keys in settings first');
      return;
    }

    setAiLoading(true);
    try {
      const history = convo.messages.map(m => ({
        role: m.senderId === 'me' ? 'user' : 'assistant',
        content: m.text
      }));

      const response = await generateChatResponse(
        [...history, { role: 'user', content: 'Suggest a short, direct reply for me.' }],
        settings
      );
      setText(response);
    } catch (err) {
      toast.error('AI error occurred');
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`Delete chat with ${convo.userName}?`)) {
      deleteConversation(convo.id);
    }
  };

  const filteredMessages = convo.messages.filter(m =>
    m.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-border bg-muted/10">
        <button onClick={() => setActiveConversation(null)} className="p-1 hover:bg-muted rounded-full">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="relative shrink-0 cursor-pointer" onClick={() => setShowProfile(true)}>
          <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
            <User className="w-5 h-5 opacity-40" />
          </div>
          {convo.online && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
          )}
        </div>

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowProfile(true)}>
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-foreground text-[13px] uppercase tracking-tight">{convo.userName}</p>
            {convo.muted && <BellOff className="w-3 h-3 text-muted-foreground" />}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
            {convo.distance} · {convo.online ? 'Online Now' : 'Active Recently'}
          </p>
        </div>

        <div className="flex items-center gap-1">
           <button onClick={() => setSearchMode(!searchMode)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
             <Search className="w-4 h-4" />
           </button>
           <div className="relative">
             <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
               <MoreVertical className="w-4 h-4" />
             </button>
             {showMenu && (
               <div className="absolute right-0 top-10 bg-background border border-border rounded-xl shadow-2xl py-1 z-50 min-w-[180px] animate-in slide-in-from-top-2">
                 <button onClick={() => { togglePin(convo.id); setShowMenu(false); }} className="flex items-center gap-3 px-4 py-2 w-full text-[11px] font-bold uppercase hover:bg-muted transition-colors">
                   <Pin className="w-3.5 h-3.5" /> {convo.pinned ? 'Unpin Chat' : 'Pin Chat'}
                 </button>
                 <button onClick={() => { toggleStar(convo.id); setShowMenu(false); }} className="flex items-center gap-3 px-4 py-2 w-full text-[11px] font-bold uppercase hover:bg-muted transition-colors">
                   <Star className="w-3.5 h-3.5" /> {convo.starred ? 'Unfav' : 'Favorite'}
                 </button>
                 <button onClick={handleDelete} className="flex items-center gap-3 px-4 py-2 w-full text-[11px] font-bold uppercase text-destructive hover:bg-muted transition-colors">
                   <Trash2 className="w-3.5 h-3.5" /> Delete Transmission
                 </button>
               </div>
             )}
           </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
        {filteredMessages.map((msg) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%]">
                <div
                  onDoubleClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                  className={`px-3.5 py-2 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm ${
                    msg.deleted
                      ? 'bg-muted text-muted-foreground italic'
                      : isMe
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted/50 text-foreground rounded-bl-sm border border-border/50'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className={`flex items-center gap-1.5 mt-1 ${isMe ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                     <span className="text-[8px] font-bold uppercase tracking-tighter">{formatTimeAgo(msg.timestamp)}</span>
                     {isMe && <span className="text-[8px] font-black">{msg.read ? '● READ' : '○ SENT'}</span>}
                  </div>
                </div>

                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex gap-1 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {msg.reactions.map((r, i) => (
                      <span key={i} className="text-[10px] bg-muted border border-border px-1.5 rounded-full shadow-sm">{r}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-3 bg-muted/5 border-t border-border/50">
        <div className="flex items-center gap-2 bg-muted/30 border border-border rounded-2xl p-1.5 focus-within:border-primary/50 transition-colors">
          <button
            onClick={handleAiAssist}
            disabled={aiLoading}
            className="p-2 text-primary hover:bg-primary/10 rounded-xl transition-all"
          >
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="TRANSMIT MESSAGE..."
            className="flex-1 bg-transparent border-none text-[11px] font-bold uppercase tracking-widest outline-none px-2"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-2 bg-primary text-primary-foreground rounded-xl disabled:opacity-30 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
