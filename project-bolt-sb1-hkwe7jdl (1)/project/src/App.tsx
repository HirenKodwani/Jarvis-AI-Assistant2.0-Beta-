import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { VoiceVisualizer } from './components/VoiceVisualizer';
import { ChatMessages } from './components/ChatMessages';
import { ActionButton } from './components/ActionButton';
import { ThemeToggle } from './components/ThemeToggle';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useAiProcessor } from './hooks/useAiProcessor';
import { CommandProcessor } from './services/CommandProcessor';
import { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello, I am Jarviz, your AI assistant. How may I help you?' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordMode, setIsWakeWordMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { speak } = useSpeechSynthesis();
  const { processAiRequest } = useAiProcessor();
  const commandProcessor = new CommandProcessor();

  const handleSpeechResult = useCallback(async (result: string) => {
    if (!result || (isWakeWordMode && !result.toLowerCase().includes('jarvis'))) return;
    
    if (isWakeWordMode && result.toLowerCase().includes('jarvis')) {
      handleWakeWord();
      return;
    }
    
    setIsListening(false);
    stopListening();
    addMessage('user', result);
    
    // Process command
    const commandHandled = await commandProcessor.processCommand(result, 
      (response) => {
        addMessage('assistant', response);
        speak(response);
      }
    );
    
    // If not a known command, use AI processing
    if (!commandHandled) {
      try {
        const aiResponse = await processAiRequest(result);
        addMessage('assistant', aiResponse);
        speak(aiResponse);
      } catch (error) {
        const errorMsg = "Sorry sir, I encountered an error processing your request.";
        addMessage('assistant', errorMsg);
        speak(errorMsg);
      }
    }
    
    // Reset back to wake word mode
    resetTranscript();
    setIsWakeWordMode(true);
    setTimeout(() => {
      startListening();
    }, 1000);
  }, [isWakeWordMode]);

  const handleError = useCallback((error: string) => {
    setError(error);
    if (error === 'not-allowed') {
      addMessage('assistant', 'I need microphone access to help you. Please enable it in your browser settings.');
      speak('I need microphone access to help you. Please enable it in your browser settings.');
    }
  }, []);
  
  const {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    supported
  } = useVoiceRecognition({
    onResult: handleSpeechResult,
    continuous: isWakeWordMode,
    onError: handleError
  });

  const handleWakeWord = useCallback(() => {
    resetTranscript();
    stopListening();
    setIsWakeWordMode(false);
    
    addMessage('assistant', 'Yes sir,');
    speak('Yes sir,');
    
    setTimeout(() => {
      setIsListening(true);
      startListening();
    }, 1000);
  }, []);

  useEffect(() => {
    // Speak the initial greeting
    speak(messages[0].content);
    
    // Apply theme
    document.documentElement.classList.toggle('dark', isDarkMode);

    // Start listening for wake word
    if (supported) {
      startListening();
    }

    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleMicClick = () => {
    if (isListening) {
      setIsListening(false);
      stopListening();
      setIsWakeWordMode(true);
    } else {
      setIsListening(true);
      startListening();
      setIsWakeWordMode(false);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!supported) {
    return (
      <Layout isDarkMode={isDarkMode}>
        <div className="flex flex-col items-center justify-center h-full p-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Speech Recognition Not Supported</h1>
          <p className="text-center">
            Your browser doesn't support speech recognition. Please try using a modern browser like Chrome.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout isDarkMode={isDarkMode}>
      <div className="flex flex-col h-full">
        <header className="flex justify-between items-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
            <span className="text-blue-600 dark:text-blue-400 mr-2">J</span>
            <span>arviz</span>
          </h1>
          <ThemeToggle isDark={isDarkMode} onToggle={toggleTheme} />
        </header>
        
        <main className="flex-1 overflow-hidden flex flex-col">
          <ChatMessages messages={messages} />
          
          <div className="p-4 relative">
            {isListening && (
              <VoiceVisualizer />
            )}
            <div className="flex justify-center my-2">
              <div className={`px-4 py-2 rounded-full text-sm ${
                error ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                isListening ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' : 
                'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
              }`}>
                {error ? error :
                  isWakeWordMode 
                    ? "Say 'Jarvis' to activate" 
                    : isListening 
                      ? "Listening..."
                      : "Click the microphone to speak"}
              </div>
            </div>
          </div>
        </main>
        
        <ActionButton isListening={isListening} onClick={handleMicClick} />
      </div>
    </Layout>
  );
}

export default App;