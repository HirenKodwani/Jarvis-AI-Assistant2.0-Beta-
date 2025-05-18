import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceRecognitionProps {
  onResult?: (result: string) => void;
  continuous?: boolean;
  onError?: (error: string) => void;
}

export const useVoiceRecognition = ({
  onResult,
  continuous = false,
  onError,
}: UseVoiceRecognitionProps = {}) => {
  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isStoppingRef = useRef(false);
  const shouldRestartRef = useRef(false);
  const isMountedRef = useRef(true);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 3;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const initializeRecognition = useCallback(() => {
    if (!SpeechRecognition) return null;

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true; // Enable interim results for better wake word detection
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      if (isMountedRef.current) {
        setListening(true);
        isStoppingRef.current = false;
        retryCountRef.current = 0; // Reset retry count on successful start
      }
    };

    recognition.onend = () => {
      setListening(false);

      if (shouldRestartRef.current && !isStoppingRef.current && continuous && isMountedRef.current) {
        if (retryCountRef.current < MAX_RETRIES) {
          retryCountRef.current++;
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Error restarting speech recognition:', e);
              if (onError) onError('Failed to restart speech recognition');
            }
          }, 1000); // Add delay between retries
        } else {
          if (onError) onError('Maximum retry attempts reached');
          shouldRestartRef.current = false;
        }
      }
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript with both final and interim results
      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(currentTranscript);

      // Only trigger onResult for final results
      if (finalTranscript && onResult) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (onError) onError(event.error);

      if (isStoppingRef.current) return;

      switch (event.error) {
        case 'network':
          console.error('Network error occurred during speech recognition');
          break;
        case 'not-allowed':
          if (onError) onError('Microphone access denied');
          stopListening();
          break;
        case 'aborted':
          if (shouldRestartRef.current && isMountedRef.current) {
            setTimeout(() => {
              try {
                recognition.start();
              } catch (e) {
                console.error('Failed to recover from aborted error:', e);
              }
            }, 1000);
          }
          break;
        default:
          console.error('Speech recognition error:', event.error);
      }
    };

    return recognition;
  }, [continuous, onResult, onError]);

  useEffect(() => {
    recognitionRef.current = initializeRecognition();

    return () => {
      isMountedRef.current = false;
      shouldRestartRef.current = false;
      stopListening();
    };
  }, [initializeRecognition]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || listening || (recognitionRef.current as any).readyState === 'listening') return;

    try {
      shouldRestartRef.current = true;
      isStoppingRef.current = false;
      retryCountRef.current = 0;
      recognitionRef.current.start();
    } catch (e) {
      console.error('Failed to start recognition:', e);
      if (onError) onError('Failed to start speech recognition');
    }
  }, [listening, onError]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      shouldRestartRef.current = false;
      isStoppingRef.current = true;
      recognitionRef.current.stop();
    } catch (e) {
      console.error('Failed to stop recognition:', e);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    transcript,
    listening,
    startListening,
    stopListening,
    resetTranscript,
    supported: !!SpeechRecognition,
  };
};