import { useAppStore } from '@/lib/store';
import { generateChatResponse } from '@/lib/ai-service';
import { toast } from 'sonner';

/**
 * Advanced Auto-Pilot Service
 * Handles: Auto-Greet and Auto-Reply with Mimicry
 */
export const useAutoPilot = () => {
  const { settings, conversations, sendMessage } = useAppStore();

  // Effect to watch for new messages and auto-reply
  useEffect(() => {
    if (!settings.autoPilotEnabled) return;

    const lastMessages = conversations.map(c => ({
      convoId: c.id,
      lastMsg: c.messages[c.messages.length - 1]
    }));

    lastMessages.forEach(async ({ convoId, lastMsg }) => {
      if (lastMsg && lastMsg.senderId === 'them' && !lastMsg.read) {
        // AI Logic to reply
        const convo = conversations.find(c => c.id === convoId);
        if (!convo) return;

        console.log(`Auto-Pilot: Analyzing chat with ${convo.userName}...`);

        const response = await generateChatResponse(
          convo.messages.map(m => ({ role: m.senderId === 'me' ? 'user' : 'assistant', content: m.text })),
          settings
        );

        if (response && !response.includes('API keys')) {
          // Add a small delay to look natural
          setTimeout(() => {
            sendMessage(convoId, response);
            toast(`Auto-Pilot replied to ${convo.userName}`, {
              description: response,
              icon: '🤖'
            });
          }, 3000 + Math.random() * 5000);
        }
      }
    });
  }, [conversations, settings.autoPilotEnabled]);

  // Logic for Auto-Greet
  const processAutoGreet = (userId: string, userName: string) => {
    if (!settings.autoGreetEnabled) return;

    // Check if we already have a conversation
    const existing = conversations.find(c => c.userName === userName);
    if (!existing) {
      console.log(`Auto-Greet: Sending message to ${userName}...`);
      // sendMessage('new', settings.autoGreetMessage); // Simplified
    }
  };

  return { processAutoGreet };
};

// Hook-like wrapper for the background worker
import { useEffect } from 'react';
