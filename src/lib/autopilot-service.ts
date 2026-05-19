import { useAppStore } from './store';
import { generateChatResponse, detectPlanIntent } from './ai-service';
import { toast } from 'sonner';

/**
 * AI Auto-Pilot Service (Phase 5)
 * Handles automated replies with mimicry and Plan Guard protection.
 */
export const useAutoPilot = () => {
  const { conversations, settings, sendMessage } = useAppStore();

  const processIncomingMessage = async (conversationId: string, messageText: string) => {
    if (!settings.autoPilotEnabled) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;

    // Plan Guard (Phase 5)
    if (settings.planGuardEnabled && detectPlanIntent(messageText)) {
      // Play special notification sound (mock)
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});

      toast.warning(`Plan Alert: ${conversation.userName}`, {
        description: "AI detected a potential plan being made. Review before confirming.",
        duration: 5000,
      });
    }

    const userMessages = conversation.messages.filter(m => m.senderId === 'me');
    const systemPrompt = `
      You are an AI Auto-Pilot for Sniffies Hax.
      Mimic the user's voice: ${userMessages.slice(-5).map(m => m.text).join(', ')}
      Sniffies style: Brutally honest, direct, minimal punctuation, lowercase.
    `;

    try {
      const response = await generateChatResponse([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: messageText }
      ], settings);

      if (response && !response.includes('Please set API keys')) {
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
