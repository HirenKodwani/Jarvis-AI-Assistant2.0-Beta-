import { useState } from 'react';

interface UseAiProcessorOptions {
  apiKey?: string;
}

export const useAiProcessor = (options: UseAiProcessorOptions = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use the provided API key or a default one (not recommended for production)
  const apiKey = options.apiKey || "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";
  
  const processAiRequest = async (prompt: string): Promise<string> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are Jarvis, an intelligent assistant." },
            { role: "user", content: prompt }
          ]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to process AI request');
      }
      
      const data = await response.json();
      const reply = data.choices[0].message.content;
      
      return reply;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('AI processing error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    processAiRequest,
    loading,
    error
  };
};