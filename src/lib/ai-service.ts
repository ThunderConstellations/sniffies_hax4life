export interface AIResponse {
  text: string;
  error?: string;
}

export const callGemini = async (prompt: string, apiKey: string): Promise<AIResponse> => {
  if (!apiKey) return { text: '', error: 'Gemini API key missing' };

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
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
        model: 'openai/gpt-3.5-turbo', // Default free/cheap model
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    return { text: data.choices?.[0]?.message?.content || 'No response from OpenRouter' };
  } catch (error) {
    return { text: '', error: error instanceof Error ? error.message : 'Unknown OpenRouter error' };
  }
};
