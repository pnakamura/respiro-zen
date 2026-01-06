import { useRef, useCallback } from 'react';

interface PacerOptions {
  onUpdate: (displayedText: string) => void;
  onComplete: () => void;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Hook to control the pacing of streamed text display
 * Creates a human-like typing rhythm with pauses at punctuation
 */
export function useStreamingPacer() {
  const bufferRef = useRef('');
  const displayedRef = useRef('');
  const isRunningRef = useRef(false);
  const abortRef = useRef(false);
  const optionsRef = useRef<PacerOptions | null>(null);
  const totalCharsRef = useRef(0);

  const getDelay = (char: string, displayedLength: number): number => {
    // Progressive acceleration after 400 chars to avoid being too slow
    const accelerationFactor = displayedLength > 400 
      ? Math.max(0.4, 1 - (displayedLength - 400) / 1000)
      : 1;

    let baseDelay = 0;

    // End of sentence - longer pause
    if (char === '.' || char === '!' || char === '?') {
      baseDelay = 140 + Math.random() * 120; // 140-260ms
    }
    // Paragraph break - longest pause
    else if (char === '\n') {
      // Check if it's a double newline (paragraph)
      const recentText = displayedRef.current.slice(-3);
      if (recentText.endsWith('\n')) {
        baseDelay = 350 + Math.random() * 200; // 350-550ms for paragraph
      } else {
        baseDelay = 180 + Math.random() * 100; // 180-280ms for line break
      }
    }
    // Comma, semicolon - medium pause
    else if (char === ',' || char === ';' || char === ':') {
      baseDelay = 60 + Math.random() * 50; // 60-110ms
    }
    // Ellipsis indicator
    else if (char === '…' || (char === '.' && displayedRef.current.endsWith('..'))) {
      baseDelay = 200 + Math.random() * 150; // 200-350ms for "..."
    }
    // Regular character - fast
    else {
      baseDelay = 8 + Math.random() * 12; // 8-20ms
    }

    return baseDelay * accelerationFactor;
  };

  const processBuffer = useCallback(async () => {
    if (isRunningRef.current) return;
    isRunningRef.current = true;

    while (bufferRef.current.length > displayedRef.current.length && !abortRef.current) {
      const nextIndex = displayedRef.current.length;
      const nextChar = bufferRef.current[nextIndex];
      
      // Process in small chunks (1-4 chars) for efficiency, but respect punctuation
      let chunkSize = 1;
      if (nextChar && !/[.!?,;:\n…]/.test(nextChar)) {
        // Look ahead for non-punctuation chars
        const remaining = bufferRef.current.slice(nextIndex);
        const punctuationMatch = remaining.match(/[.!?,;:\n…]/);
        const charsUntilPunctuation = punctuationMatch?.index || remaining.length;
        chunkSize = Math.min(
          Math.floor(1 + Math.random() * 3), // 1-4 chars
          charsUntilPunctuation
        );
      }

      const chunk = bufferRef.current.slice(nextIndex, nextIndex + chunkSize);
      displayedRef.current += chunk;
      
      optionsRef.current?.onUpdate(displayedRef.current);

      // Get delay based on last char of chunk
      const lastChar = chunk[chunk.length - 1];
      const delay = getDelay(lastChar, displayedRef.current.length);
      
      if (delay > 0) {
        await sleep(delay);
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
