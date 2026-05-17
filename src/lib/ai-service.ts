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
        model: 'google/gemma-7b-it:free', // Default free model
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
  let promptPrefix = "";

  if (settings.autoPilotMimicry) {
    promptPrefix = `
      CONTEXT: You are acting as an AI autopilot for a user on a cruising/dating app.
      YOUR GOAL: Reply to the latest message in the user's EXACT voice, style, and persona.
      MIMICRY DATA: Analyze the user's previous messages for slang, punctuation style (or lack thereof), emoji usage, and brevity.
      STRICTION: Keep it natural, casual, and brief. Do not sound like an AI.
    `;
  } else {
    promptPrefix = "You are a helpful assistant for a cruising app. Reply casually.";
  }

  const history = messages.map(m => `${m.role === 'user' ? 'Me' : 'Them'}: ${m.content}`).join('\n');
  const finalPrompt = `${promptPrefix}\n\nRecent Conversation History:\n${history}\n\nSuggested Response:`;

  if (settings.geminiKey) {
    const res = await callGemini(finalPrompt, settings.geminiKey);
    return res.text;
  } else if (settings.openRouterKey) {
    const res = await callOpenRouter(finalPrompt, settings.openRouterKey);
    return res.text;
  }

  return 'Please set API keys in settings.';
};

/**
 * AI Vision Hunter: Scans a profile image against user preferences
 */
export const scanProfileVision = async (imageUrl: string, preferences: string, apiKey: string): Promise<{ match: boolean; reasoning: string }> => {
  if (!apiKey) return { match: false, reasoning: 'API key missing' };

  try {
    const prompt = `Analyze this profile picture. Does this person match these preferences: "${preferences}"?
    Reply with ONLY a JSON object: {"match": boolean, "reasoning": "brief explanation"}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: "image/jpeg", data: imageUrl.split(',')[1] || imageUrl } }
          ]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return JSON.parse(text.replace(/```json|```/g, ''));
  } catch (error) {
    console.error('Vision Error:', error);
    return { match: false, reasoning: 'Error scanning image' };
  }
};
