import { useCallback, useState } from 'react';

export const useSpeechSynthesis = () => {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  
  // Get all available voices
  const getVoices = useCallback(() => {
    const availableVoices = window.speechSynthesis.getVoices();
    setVoices(availableVoices);
    return availableVoices;
  }, []);
  
  // Initialize voices
  useState(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      // Chrome needs a delay to get voices
      setTimeout(() => {
        getVoices();
      }, 100);
      
      // Firefox and other browsers get voices immediately
      window.speechSynthesis.onvoiceschanged = getVoices;
    }
  });
  
  const speak = useCallback((text: string, voiceName?: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if specified, otherwise use the first available voice
    if (voiceName) {
      const voice = voices.find(v => v.name === voiceName);
      if (voice) {
        utterance.voice = voice;
      }
    } else {
      // Try to find a good default voice (preferably male)
      const defaultVoice = voices.find(v => 
        v.name.includes('Daniel') || 
        v.name.includes('Alex') || 
        v.name.includes('Male')
      ) || voices[0];
      
      if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
    }
    
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [voices]);
  
  return {
    speak,
    speaking,
    voices,
    supported: typeof window !== 'undefined' && !!window.speechSynthesis,
  };
};