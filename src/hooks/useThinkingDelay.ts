import { useState, useCallback, useRef, useEffect } from 'react';

// Thinking phrases organized by context for more natural selection
export const thinkingPhrasesByContext = {
  default: [
    'Refletindo sobre isso...',
    'Deixe-me pensar...',
    'Hmm, interessante...',
    'Um momento...',
    'Pensando com cuidado...',
    'Considerando suas palavras...',
  ],
  emotional: [
    'Entendo... deixe-me responder com carinho...',
    'Isso é importante... refletindo...',
    'Sinto que preciso pensar bem nisso...',
    'Acolhendo suas palavras...',
    'Com cuidado e atenção...',
    'Preparando uma resposta com carinho...',
  ],
  question: [
    'Boa pergunta...',
    'Deixe-me considerar isso...',
    'Hmm, vamos ver...',
    'Pensando na melhor resposta...',
    'Interessante pergunta...',
  ],
  greeting: [
    'Que bom te ver por aqui...',
    'Olá! Deixe-me me preparar...',
    'Bem-vindo de volta...',
    'Preparando-me para conversar...',
  ],
};

// All phrases combined for backward compatibility
export const thinkingPhrases = Object.values(thinkingPhrasesByContext).flat();

// Emotional indicators to detect message context
const emotionalIndicators = [
  'sinto', 'ansioso', 'triste', 'medo', 'ajuda', 'difícil', 
  'angústia', 'sozinho', 'perdido', 'sentido', 'vida', 'morte',
  'propósito', 'amor', 'relacionamento', 'dor', 'sofrimento',
  'depressão', 'ansiedade', 'pânico', 'desespero', 'esperança',
  'chorar', 'chorando', 'preocupado', 'nervoso', 'estresse',
  'cansado', 'exausto', 'frustrado', 'irritado', 'raiva',
  'feliz', 'alegre', 'gratidão', 'paz', 'calmo', 'tranquilo'
];

const greetingIndicators = [
  'olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'hey',
  'e aí', 'tudo bem', 'como vai'
];

const questionIndicators = ['?', 'como', 'por que', 'o que', 'qual', 'quando', 'onde'];

export type MessageContext = 'default' | 'emotional' | 'question' | 'greeting';

/**
 * Detects the context of a message based on its content
 */
export function detectMessageContext(message: string): MessageContext {
  const lowerMessage = message.toLowerCase();
  
  // Check greeting first (usually short messages at start)
  if (message.length < 50 && greetingIndicators.some(g => lowerMessage.includes(g))) {
    return 'greeting';
  }
  
  // Check emotional content
  if (emotionalIndicators.some(e => lowerMessage.includes(e))) {
    return 'emotional';
  }
  
  // Check if it's a question
  if (questionIndicators.some(q => lowerMessage.includes(q))) {
    return 'question';
  }
  
  return 'default';
}

/**
 * Checks if a message has emotional content
 */
export function hasEmotionalContent(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return emotionalIndicators.some(e => lowerMessage.includes(e));
}

export function getRandomThinkingPhrase(context: MessageContext = 'default'): string {
  const phrases = thinkingPhrasesByContext[context] || thinkingPhrasesByContext.default;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Calculates a human-like thinking time based on message complexity
 */
export function calculateThinkingTime(userMessage: string): number {
  const baseTime = 2500; // 2.5 seconds minimum - more time to "process"
  const perCharTime = 30; // 30ms per character - slower, more thoughtful
  const maxTime = 10000; // 10 seconds maximum - allows for deep reflection
  const randomVariation = Math.random() * 1000 - 500; // +/- 500ms
  
  const messageLength = userMessage.length;
  
  // Shorter messages = quicker responses
  // Longer/deeper messages = more "thinking" time
  let calculatedTime = baseTime + messageLength * perCharTime + randomVariation;
  
  // Add extra time for emotional content
  if (hasEmotionalContent(userMessage)) {
    calculatedTime += 1500; // Extra reflection time for emotional content
  }
  
  // First messages get extra time (guide is "getting to know" the user)
  if (messageLength < 50) {
    calculatedTime += 800;
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
    const context = detectMessageContext(userMessage);
    
    // Initial delay before showing typing indicator (300-600ms)
    const initialDelay = 300 + Math.random() * 300;
    
    setThinkingPhrase(getRandomThinkingPhrase(context));
    
    // Start thinking after initial delay
    timeoutRef.current = setTimeout(() => {
      setIsThinking(true);
      
      // Change phrase periodically if thinking takes long
      if (thinkingTime > 2500) {
        phraseIntervalRef.current = setInterval(() => {
          setThinkingPhrase(getRandomThinkingPhrase(context));
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
