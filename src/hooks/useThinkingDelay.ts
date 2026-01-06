import { useState, useCallback, useRef, useEffect } from 'react';

// Thinking phrases that the guide "says" while processing
export const thinkingPhrases = [
  'Refletindo sobre isso...',
  'Deixe-me pensar...',
  'Hmm, interessante...',
  'Preparando uma resposta com carinho...',
  'Considerando suas palavras...',
  'Pensando em como ajudar...',
];

export function getRandomThinkingPhrase(): string {
  return thinkingPhrases[Math.floor(Math.random() * thinkingPhrases.length)];
}

/**
 * Calculates a human-like thinking time based on message complexity
 */
export function calculateThinkingTime(userMessage: string): number {
  const baseTime = 1200; // 1.2 seconds minimum
  const perCharTime = 15; // ms per character
  const maxTime = 4500; // 4.5 seconds maximum
  const randomVariation = Math.random() * 600 - 300; // +/- 300ms
  
  const messageLength = userMessage.length;
  
  // Shorter messages = quicker responses
  // Longer/deeper messages = more "thinking" time
  let calculatedTime = baseTime + messageLength * perCharTime + randomVariation;
  
  // Add extra time for questions that seem deep/emotional
  const deepIndicators = [
    'sinto', 'ansioso', 'triste', 'medo', 'ajuda', 'difícil', 
    'angústia', 'sozinho', 'perdido', 'sentido', 'vida', 'morte',
    'propósito', 'amor', 'relacionamento', 'dor'
  ];
  
  const hasDeepContent = deepIndicators.some(
    indicator => userMessage.toLowerCase().includes(indicator)
  );
  
  if (hasDeepContent) {
    calculatedTime += 800; // Extra reflection time for emotional content
  }
  
  return Math.min(Math.max(calculatedTime, baseTime), maxTime);
}

interface UseThinkingDelayOptions {
  onDelayComplete?: () => void;
}

export function useThinkingDelay({ onDelayComplete }: UseThinkingDelayOptions = {}) {
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhrase, setThinkingPhrase] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const phraseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startThinking = useCallback((userMessage: string) => {
    const thinkingTime = calculateThinkingTime(userMessage);
    
    // Initial delay before showing typing indicator (300-600ms)
    const initialDelay = 300 + Math.random() * 300;
    
    setThinkingPhrase(getRandomThinkingPhrase());
    
    // Start thinking after initial delay
    timeoutRef.current = setTimeout(() => {
      setIsThinking(true);
      
      // Change phrase periodically if thinking takes long
      if (thinkingTime > 2500) {
        phraseIntervalRef.current = setInterval(() => {
          setThinkingPhrase(getRandomThinkingPhrase());
        }, 2000);
      }
    }, initialDelay);
    
    return thinkingTime + initialDelay;
  }, []);

  const stopThinking = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (phraseIntervalRef.current) {
      clearInterval(phraseIntervalRef.current);
      phraseIntervalRef.current = null;
    }
    setIsThinking(false);
    setThinkingPhrase('');
    onDelayComplete?.();
  }, [onDelayComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (phraseIntervalRef.current) clearInterval(phraseIntervalRef.current);
    };
  }, []);

  return {
    isThinking,
    thinkingPhrase,
    startThinking,
    stopThinking,
  };
}
