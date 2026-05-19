export interface AIResponse {
  text: string;
  error?: string;
}

export const callGemini = async (prompt: string, apiKey: string, imageBase64?: string): Promise<AIResponse> => {
  if (!apiKey) return { text: '', error: 'Gemini API key missing' };

  try {
    const contents = imageBase64
      ? [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: imageBase64 } }
          ]
        }]
      : [{ parts: [{ text: prompt }] }];

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();
    return { text: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini' };
  } catch (error) {
    return { text: '', error: error instanceof Error ? error.message : 'Unknown Gemini error' };
  }
};

export const callOpenRouter = async (prompt: string, apiKey: string): Promise<AIResponse> => {
  if (!apiKey) return { text: '', error: 'OpenRouter API key missing' };

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-7b-it:free',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || 'No response from OpenRouter' };
  } catch (error) {
    return { text: '', error: error instanceof Error ? error.message : 'Unknown OpenRouter error' };
  }
};

export const generateChatResponse = async (messages: { role: string; content: string }[], settings: any): Promise<string> => {
  const prompt = messages.map(m => `${m.role === 'user' ? 'User' : m.role === 'system' ? 'System' : 'Assistant'}: ${m.content}`).join('\n');

  if (settings.geminiKey) {
    const res = await callGemini(prompt, settings.geminiKey);
    return res.text;
  } else if (settings.openRouterKey) {
    const res = await callOpenRouter(prompt, settings.openRouterKey);
    return res.text;
  }

  return 'Please set API keys in settings.';
};

/**
 * AI Plan Detector (Phase 5)
 * Analyzes text for plan-making intent.
 */
export const detectPlanIntent = (text: string): boolean => {
  const keywords = ['meet', 'where', 'when', 'time', 'location', 'place', 'come over', 'host', 'address', 'parking', 'plans'];
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
};

/**
 * AI Vision Hunter / Catfish Guard
 */
export const scanProfileVision = async (imageBase64: string, prompt: string, settings: any): Promise<AIResponse> => {
  if (!settings.geminiKey) return { text: '', error: 'Gemini 1.5 Flash required' };
  return await callGemini(prompt, settings.geminiKey, imageBase64);
};
