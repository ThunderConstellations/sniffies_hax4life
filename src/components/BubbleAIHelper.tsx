import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Sparkles, Loader2, X } from 'lucide-react';
import { generateChatResponse } from '@/lib/ai-service';
import { toast } from 'sonner';

interface BubbleAIHelperProps {
  conversationId: string;
  onSelect: (text: string) => void;
}

const BubbleAIHelper = ({ conversationId, onSelect }: BubbleAIHelperProps) => {
  const { conversations, settings } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const conversation = conversations.find((c) => c.id === conversationId);

  const getSuggestions = async () => {
    if (!conversation) return;
    if (!settings.geminiKey && !settings.openRouterKey) {
      toast.error('Set API keys in settings for AI replies');
      return;
    }

    setLoading(true);
    try {
      const history = conversation.messages.map((m) => ({
        role: m.senderId === 'me' ? 'user' : 'assistant',
        content: m.text,
      }));

      // In a real scenario, we'd prompt the AI to give us 3 short variations
      const response = await generateChatResponse(
        [...history, { role: 'user', content: 'Give me 3 very short, distinct reply suggestions for this conversation (Friendly, Flirty, Direct). Separate them with |' }],
        settings
      );

      const parts = response.split('|').map(p => p.trim().replace(/^["']|["']$/g, ''));
      setSuggestions(parts.slice(0, 3));
    } catch (error) {
      console.error('AI Suggestion Error:', error);
      // Fallback suggestions
      setSuggestions(['Hey!', 'How are you?', 'Wanna meet?']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      {suggestions.length === 0 ? (
        <button
          onClick={getSuggestions}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary text-[10px] font-black rounded-lg uppercase tracking-wider hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          {loading ? 'Analyzing...' : 'Generate AI Replies'}
        </button>
      ) : (
        <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1">
          {suggestions.map((text, i) => (
            <button
              key={i}
              onClick={() => onSelect(text)}
              className="flex-1 py-1.5 px-2 bg-primary/20 text-primary text-[9px] font-bold rounded-lg border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all truncate"
            >
              {text}
            </button>
          ))}
          <button
            onClick={() => setSuggestions([])}
            className="p-1.5 bg-secondary text-muted-foreground rounded-lg"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default BubbleAIHelper;
