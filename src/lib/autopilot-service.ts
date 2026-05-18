import { useAppStore } from './store';
import { generateChatResponse } from './ai-service';

/**
 * AI Auto-Pilot Service
 * Handles automated conversation management by mimicking user patterns.
 */
export const useAutoPilot = () => {
  const { conversations, settings, sendMessage } = useAppStore();

  const processIncomingMessage = async (conversationId: string, messageText: string) => {
    if (!settings.autoPilotEnabled) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Mimicry logic: analyze user's previous messages for slang/brevity
    const userMessages = conversation.messages.filter(m => m.senderId === 'me');
    const systemPrompt = `
      You are an AI Auto-Pilot for a chat app.
      Your goal is to reply to the following message while mimicking the user's voice.
      User's typical style: ${userMessages.slice(-5).map(m => m.text).join(', ')}
      Keep it brief, use similar slang, and match their punctuation style.
    `;

    try {
      const response = await generateChatResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: messageText }
      ], settings);

      if (response && !response.includes('Please set API keys')) {
        // Random delay to simulate human typing (2-5 seconds)
        const delay = Math.floor(Math.random() * 3000) + 2000;
        setTimeout(() => {
          sendMessage(conversationId, response);
        }, delay);
      }
    } catch (error) {
      console.error('Auto-Pilot Error:', error);
    }
  };

  return { processIncomingMessage };
};
