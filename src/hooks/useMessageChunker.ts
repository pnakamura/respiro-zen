/**
 * Utility functions for splitting AI responses into natural message chunks
 * for a more conversational chat experience.
 */

// Emotional content indicators for extended pauses
const emotionalPatterns = [
  'entendo', 'compreendo', 'sinto', 'difícil', 'doloroso', 'triste',
  'angústia', 'medo', 'ansiedade', 'preocup', 'sofr', 'dor ',
  'perdão', 'aceitar', 'curar', 'paz', 'amor', 'coração',
  'alma', 'espírito', 'respirar', 'acalm', 'tranquil',
];

/**
 * Check if a text segment has emotional content
 */
export function hasEmotionalContent(text: string): boolean {
  const lowerText = text.toLowerCase();
  return emotionalPatterns.some(pattern => lowerText.includes(pattern));
}

/**
 * Split a response into natural chunks for progressive display
 * Priority:
 * 1. Paragraph breaks (\n\n)
 * 2. Sentence endings (. ! ?) after 150+ chars
 * 3. Ellipsis (...) as natural pause point
 * 4. Comma or semicolon after 200+ chars
 */
export function splitIntoChunks(text: string, maxChunkLength: number = 250): string[] {
  // First, split by paragraphs
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
  
  const chunks: string[] = [];
  
  for (const para of paragraphs) {
    const trimmedPara = para.trim();
    
    // If paragraph is short enough, add as single chunk
    if (trimmedPara.length <= maxChunkLength) {
      chunks.push(trimmedPara);
      continue;
    }
    
    // For longer paragraphs, split by sentences
    // Regex matches sentences ending with . ! ? (including sequences like "..." or "!?")
    const sentencePattern = /[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g;
    const sentences = trimmedPara.match(sentencePattern) || [trimmedPara];
    
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) continue;
      
      // Check if adding this sentence would exceed the limit
      const wouldExceed = currentChunk.length + trimmedSentence.length > maxChunkLength;
      const hasEnoughContent = currentChunk.length >= 150;
      
      if (wouldExceed && currentChunk && hasEnoughContent) {
        // Save current chunk and start new one
        chunks.push(currentChunk.trim());
        currentChunk = trimmedSentence;
      } else if (wouldExceed && currentChunk && !hasEnoughContent) {
        // Current chunk too short, add sentence anyway then split
        currentChunk += ' ' + trimmedSentence;
        chunks.push(currentChunk.trim());
        currentChunk = '';
      } else {
        // Add sentence to current chunk
        currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
      }
    }
    
    // Don't forget the last chunk
    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }
  }
  
  // Filter empty chunks and return
  return chunks.filter(c => c.length > 0);
}

/**
 * Calculate delay before showing the next chunk
 * Based on chunk content and position
 */
export function getChunkDelay(chunk: string, index: number, prevChunk?: string): number {
  // Base delay - longer for first chunk transition
  const baseDelay = index === 0 ? 1500 : 2500;
  
  // Length bonus - longer chunks need more "reading" time
  const lengthBonus = Math.min(chunk.length * 6, 1800);
  
  // Emotional content bonus
  const emotionalBonus = hasEmotionalContent(chunk) ? 1200 : 0;
  
  // If previous chunk ended with ellipsis, add extra pause (thought continuation)
  const ellipsisBonus = prevChunk?.endsWith('...') ? 800 : 0;
  
  // Paragraph transition bonus (if chunks look like different topics)
  const transitionBonus = index > 0 ? 500 : 0;
  
  // Random variation for natural feel
  const randomVariation = Math.random() * 1000;
  
  return baseDelay + lengthBonus + emotionalBonus + ellipsisBonus + transitionBonus + randomVariation;
}

export interface ChunkInfo {
  id: string;
  content: string;
  delay: number;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Process full response into chunks with delays
 */
export function processResponseIntoChunks(
  fullContent: string,
  baseMessageId: string
): ChunkInfo[] {
  const chunks = splitIntoChunks(fullContent);
  
  // If only 1 chunk, no need for special handling
  if (chunks.length <= 1) {
    return [{
      id: baseMessageId,
      content: fullContent.trim(),
      delay: 0,
      isFirst: true,
      isLast: true,
    }];
  }
  
  return chunks.map((content, index) => ({
    id: index === 0 ? baseMessageId : `${baseMessageId}-chunk-${index}`,
    content,
    delay: getChunkDelay(content, index, chunks[index - 1]),
    isFirst: index === 0,
    isLast: index === chunks.length - 1,
  }));
}
