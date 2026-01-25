import { useRef, useCallback } from 'react';

interface PacerOptions {
  onUpdate: (displayedText: string) => void;
  onComplete: () => void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Hook to control the pacing of streamed text display
 * Creates a human-like typing rhythm with pauses at punctuation
 * and occasional "hesitation" moments
 */
export function useStreamingPacer() {
  const bufferRef = useRef('');
  const displayedRef = useRef('');
  const isRunningRef = useRef(false);
  const abortRef = useRef(false);
  const optionsRef = useRef<PacerOptions | null>(null);
  const totalCharsRef = useRef(0);
  const lastHesitationRef = useRef(0); // Track last hesitation position

  const getDelay = (char: string, displayedLength: number, chunk: string): number => {
    // Slower start - first 200 chars are slower for more deliberate, human feel
    const startSlowdown = displayedLength < 200 ? 1.8 : 1;
    
    // Progressive acceleration after 600 chars to avoid being too slow
    const accelerationFactor = displayedLength > 600 
      ? Math.max(0.4, 1 - (displayedLength - 600) / 1000)
      : 1;

    // Detect "tone" modifiers for speed variation
    const hasEmoji = /[\u{1F300}-\u{1F9FF}]/u.test(chunk);
    const hasExcitement = /!/.test(chunk);
    const hasReflection = /\.{2,}|…/.test(chunk);
    
    // Enthusiasm speeds up slightly, reflection slows down more
    let toneMultiplier = 1;
    if (hasEmoji || hasExcitement) {
      toneMultiplier = 0.9; // Slightly faster for enthusiastic content
    } else if (hasReflection) {
      toneMultiplier = 1.35; // Much slower for reflective content
    }

    let baseDelay = 0;

    // End of sentence - longer pause (pausa real entre pensamentos)
    if (char === '.' || char === '!' || char === '?') {
      baseDelay = 350 + Math.random() * 250; // 350-600ms
    }
    // Paragraph break - longest pause (mudança de assunto mais lenta)
    else if (char === '\n') {
      // Check if it's a double newline (paragraph)
      const recentText = displayedRef.current.slice(-3);
      if (recentText.endsWith('\n')) {
        baseDelay = 800 + Math.random() * 600; // 800-1400ms for paragraph
      } else {
        baseDelay = 400 + Math.random() * 250; // 400-650ms for line break
      }
    }
    // Comma, semicolon - medium pause (pausas maiores para respirar)
    else if (char === ',' || char === ';' || char === ':') {
      baseDelay = 150 + Math.random() * 130; // 150-280ms
    }
    // Ellipsis indicator (hesitação mais perceptível)
    else if (char === '…' || (char === '.' && displayedRef.current.endsWith('..'))) {
      baseDelay = 500 + Math.random() * 400; // 500-900ms for "..."
    }
    // Regular character - natural typing speed (digitação mais lenta e natural)
    else {
      baseDelay = 25 + Math.random() * 25; // 25-50ms
    }

    return baseDelay * accelerationFactor * startSlowdown * toneMultiplier;
  };

  // Random micro-hesitation to simulate "thinking while typing"
  // Pausas mais longas e frequentes para parecer mais humano
  const shouldHesitate = (displayedLength: number): number => {
    // Only hesitate in responses longer than 80 chars
    if (displayedLength < 80) return 0;
    
    // Don't hesitate too close to last hesitation (min 60-120 chars apart - mais próximas)
    const minDistance = 60 + Math.random() * 60;
    if (displayedLength - lastHesitationRef.current < minDistance) return 0;
    
    // 8% chance of hesitation - mais frequente
    if (Math.random() < 0.08) {
      lastHesitationRef.current = displayedLength;
      return 600 + Math.random() * 600; // 600-1200ms hesitation - pausas mais longas
    }
    
    return 0;
  };

  const processBuffer = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    while (bufferRef.current.length > displayedRef.current.length && !abortRef.current) {
      const nextIndex = displayedRef.current.length;
      const nextChar = bufferRef.current[nextIndex];
      
      // Process in small chunks - smaller at start for more deliberate feel
      let chunkSize = 1;
      if (nextChar && !/[.!?,;:\n…]/.test(nextChar)) {
        // Look ahead for non-punctuation chars
        const remaining = bufferRef.current.slice(nextIndex);
        const punctuationMatch = remaining.match(/[.!?,;:\n…]/);
        const charsUntilPunctuation = punctuationMatch?.index || remaining.length;
        
        // Smaller chunks at the start (1-2), larger later (1-5)
        const maxChunk = displayedRef.current.length < 100 ? 2 : 5;
        chunkSize = Math.min(
          Math.floor(1 + Math.random() * (maxChunk - 1)),
          charsUntilPunctuation
        );
      }

      const chunk = bufferRef.current.slice(nextIndex, nextIndex + chunkSize);
      displayedRef.current += chunk;
      
      optionsRef.current?.onUpdate(displayedRef.current);

      // Get delay based on last char of chunk
      const lastChar = chunk[chunk.length - 1];
      const delay = getDelay(lastChar, displayedRef.current.length, chunk);
      
      // Check for random hesitation
      const hesitationDelay = shouldHesitate(displayedRef.current.length);
      
      const totalDelay = delay + hesitationDelay;
      
      if (totalDelay > 0) {
        await sleep(totalDelay);
      }
    }

    isRunningRef.current = false;

    // Check if we're done and buffer is complete
    if (bufferRef.current.length > 0 && 
        displayedRef.current.length >= bufferRef.current.length && 
        !abortRef.current) {
      optionsRef.current?.onComplete();
    }
  }, []);

  const addToBuffer = useCallback((text: string) => {
    bufferRef.current += text;
    totalCharsRef.current += text.length;
    processBuffer();
  }, [processBuffer]);

  const start = useCallback((options: PacerOptions) => {
    bufferRef.current = '';
    displayedRef.current = '';
    isRunningRef.current = false;
    abortRef.current = false;
    totalCharsRef.current = 0;
    lastHesitationRef.current = 0;
    optionsRef.current = options;
  }, []);

  const stop = useCallback(() => {
    abortRef.current = true;
    isRunningRef.current = false;
  }, []);

  const flush = useCallback(() => {
    // Immediately show all remaining buffered content
    if (bufferRef.current.length > displayedRef.current.length) {
      displayedRef.current = bufferRef.current;
      optionsRef.current?.onUpdate(displayedRef.current);
    }
  }, []);

  const getDisplayedText = useCallback(() => displayedRef.current, []);
  const getBufferedText = useCallback(() => bufferRef.current, []);

  return {
    start,
    stop,
    flush,
    addToBuffer,
    getDisplayedText,
    getBufferedText,
  };
}
