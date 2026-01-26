import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useStreamingPacer } from './useStreamingPacer';
import { processResponseIntoChunks, PauseType } from './useMessageChunker';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  /** Whether this message is a continuation chunk */
  isChunk?: boolean;
  /** Whether this is the first chunk in a series */
  isFirstChunk?: boolean;
}

interface UseGuideChatOptions {
  guideId: string;
  onMessageComplete?: (message: ChatMessage) => void;
  onStreamStart?: (estimatedLength: number) => void;
  /** Called when pausing between chunks - includes pauseType for indicator variant */
  onChunkPause?: (chunkIndex: number, totalChunks: number, pauseType: PauseType) => void;
  /** Called when a new chunk is displayed */
  onChunkDisplay?: (chunkIndex: number, totalChunks: number) => void;
}

// Persist conversation ID per guide in localStorage
const getStoredConversationId = (guideId: string): string | null => {
  try {
    return localStorage.getItem(`guide_conversation_${guideId}`);
  } catch {
    return null;
  }
};

const storeConversationId = (guideId: string, conversationId: string) => {
  try {
    localStorage.setItem(`guide_conversation_${guideId}`, conversationId);
  } catch {
    // Ignore storage errors
  }
};

const removeStoredConversationId = (guideId: string) => {
  try {
    localStorage.removeItem(`guide_conversation_${guideId}`);
  } catch {
    // Ignore storage errors
  }
};

export function useGuideChat({ 
  guideId, 
  onMessageComplete, 
  onStreamStart,
  onChunkPause,
  onChunkDisplay,
}: UseGuideChatOptions) {
  // All hooks must be called unconditionally and in same order
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPausing, setIsPausing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  
  // All refs - call unconditionally
  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const streamStartedRef = useRef(false);
  const historyLoadedRef = useRef(false);
  const conversationIdRef = useRef<string | null>(null);
  const initializedGuideIdRef = useRef<string | null>(null);
  const chunkAbortRef = useRef(false);
  
  // Custom hook - must be called unconditionally
  const pacer = useStreamingPacer();

  // Load stored conversationId when guideId becomes available
  // Using a separate effect for initialization to avoid race conditions
  useEffect(() => {
    // Skip if no guideId or already initialized for this guide
    if (!guideId || guideId === initializedGuideIdRef.current) {
      return;
    }
    
    initializedGuideIdRef.current = guideId;
    const storedId = getStoredConversationId(guideId);
    
    if (storedId) {
      conversationIdRef.current = storedId;
      setConversationId(storedId);
    }
    
    setIsInitialized(true);
  }, [guideId]);

  // Keep ref in sync with state
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // Persist conversationId to localStorage when it changes
  useEffect(() => {
    if (conversationId && guideId) {
      storeConversationId(guideId, conversationId);
    }
  }, [conversationId, guideId]);

  // Load conversation history when hook initializes with existing conversationId
  useEffect(() => {
    const loadHistory = async () => {
      if (!conversationId || historyLoadedRef.current || messages.length > 0) return;
      
      historyLoadedRef.current = true;
      
      const { data, error } = await supabase
        .from('guide_messages')
        .select('id, role, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Failed to load conversation history:', error);
        return;
      }
      
      if (data && data.length > 0) {
        setMessages(data.map(msg => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          createdAt: new Date(msg.created_at || Date.now()),
        })));
      }
    };
    
    loadHistory();
  }, [conversationId, messages.length]);

  /**
   * Display chunks with pauses between them
   */
  const displayChunksWithPauses = useCallback(async (
    fullContent: string,
    baseMessageId: string,
    isAfterQuestion: boolean
  ) => {
    const chunks = processResponseIntoChunks(fullContent, baseMessageId, { isAfterQuestion });
    
    // If only 1 chunk, display directly without chunking UI
    if (chunks.length === 1) {
      setMessages(prev => {
        const hasMessage = prev.some(m => m.id === baseMessageId);
        if (hasMessage) {
          return prev.map(msg => 
            msg.id === baseMessageId 
              ? { ...msg, content: fullContent }
              : msg
          );
        }
        return [...prev, {
          id: baseMessageId,
          role: 'assistant' as const,
          content: fullContent,
          createdAt: new Date(),
          isChunk: false,
          isFirstChunk: true,
        }];
      });
      return;
    }

    // Multiple chunks - display with pauses
    for (let i = 0; i < chunks.length; i++) {
      if (chunkAbortRef.current) break;
      
      const chunk = chunks[i];
      const isFirst = i === 0;
      
      // Notify about new chunk
      onChunkDisplay?.(i, chunks.length);
      
      // Add chunk message
      setMessages(prev => {
        // For first chunk, might already exist from streaming
        if (isFirst) {
          const hasMessage = prev.some(m => m.id === chunk.id);
          if (hasMessage) {
            return prev.map(msg => 
              msg.id === chunk.id 
                ? { ...msg, content: chunk.content, isChunk: true, isFirstChunk: true }
                : msg
            );
          }
        }
        
        return [...prev, {
          id: chunk.id,
          role: 'assistant' as const,
          content: chunk.content,
          createdAt: new Date(),
          isChunk: true,
          isFirstChunk: isFirst,
        }];
      });
      
      // Wait before showing next chunk (if not last)
      if (!chunk.isLast && !chunkAbortRef.current) {
        // Set pausing state BEFORE the delay
        setIsPausing(true);
        onChunkPause?.(i, chunks.length, chunk.pauseType);
        
        await new Promise(resolve => setTimeout(resolve, chunk.delay));
        
        // Clear pausing state AFTER the delay
        setIsPausing(false);
      }
    }
  }, [onChunkPause, onChunkDisplay]);

  const sendMessage = useCallback(async (content: string) => {
    // Block if not initialized, already loading OR streaming (prevents concurrent messages)
    if (!content.trim() || !isInitialized || isLoading || isStreaming) return;

    // Reset abort flag
    chunkAbortRef.current = false;

    // Stop any existing pacer before starting new message
    pacer.stop();

    setIsLoading(true);
    setIsStreaming(false);
    setIsPausing(false);
    streamStartedRef.current = false;

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      abortControllerRef.current = new AbortController();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/guide-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            guideId,
            message: content.trim(),
            conversationId: conversationIdRef.current, // Use ref for sync access
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      // Get conversation ID from response header
      const newConversationId = response.headers.get('X-Conversation-Id');
      if (newConversationId && !conversationIdRef.current) {
        conversationIdRef.current = newConversationId;
        setConversationId(newConversationId);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 429) {
          throw new Error('Limite de requisições excedido. Aguarde um momento e tente novamente.');
        }
        if (response.status === 402) {
          throw new Error('Créditos de IA esgotados. Entre em contato com o suporte.');
        }
        
        throw new Error(errorData.error || 'Erro ao enviar mensagem');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Create assistant message placeholder (but don't add to messages yet)
      const assistantMessageId = crypto.randomUUID();
      assistantMessageIdRef.current = assistantMessageId;

      // Initialize paced streaming for first chunk only
      pacer.start({
        onUpdate: (displayedText) => {
          setMessages(prev => {
            const hasAssistant = prev.some(m => m.id === assistantMessageId);
            if (!hasAssistant) {
              // First update - add the assistant message
              if (!streamStartedRef.current) {
                streamStartedRef.current = true;
                setIsStreaming(true);
                // Estimate total length as 5x the first chunk for proportional delay
                const estimatedLength = displayedText.length * 5;
                onStreamStart?.(estimatedLength);
              }
              return [...prev, {
                id: assistantMessageId,
                role: 'assistant' as const,
                content: displayedText,
                createdAt: new Date(),
                isChunk: true,
                isFirstChunk: true,
              }];
            }
            // Subsequent updates - only update first chunk during streaming
            return prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: displayedText }
                : msg
            );
          });
        },
        onComplete: () => {
          // Don't set isStreaming false here - we handle it after chunk processing
        },
      });

      // Stream the response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines
        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const deltaContent = parsed.choices?.[0]?.delta?.content;
            
            if (deltaContent) {
              fullContent += deltaContent;
              // Feed to pacer instead of updating directly
              pacer.addToBuffer(deltaContent);
            }
          } catch {
            // Incomplete JSON, put back in buffer
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Wait for pacer to finish streaming first chunk
      await new Promise(resolve => setTimeout(resolve, 300));
      pacer.flush();
      pacer.stop();

      // Determine if user message was a question
      const isAfterQuestion = userMessage.content.trim().endsWith('?');
      
      // Now display all chunks with pauses
      // Remove the streaming message first and replace with chunks
      setMessages(prev => prev.filter(m => m.id !== assistantMessageId));
      
      // Small delay before starting chunk display
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await displayChunksWithPauses(fullContent, assistantMessageId, isAfterQuestion);

      // Final message callback
      const finalMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: fullContent,
        createdAt: new Date(),
      };

      onMessageComplete?.(finalMessage);

    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Request aborted');
        pacer.stop();
        chunkAbortRef.current = true;
        return;
      }

      console.error('Chat error:', error);
      toast({
        title: 'Erro no chat',
        description: (error as Error).message || 'Não foi possível enviar a mensagem.',
        variant: 'destructive',
      });

      // Remove the failed message
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setIsPausing(false);
      abortControllerRef.current = null;
    }
  }, [guideId, isInitialized, isLoading, isStreaming, onMessageComplete, onStreamStart, pacer, displayChunksWithPauses]);

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    pacer.stop();
    chunkAbortRef.current = true;
  }, [pacer]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = null;
    setConversationId(null);
    historyLoadedRef.current = false;
    pacer.stop();
    chunkAbortRef.current = true;
    // Clear from localStorage too
    if (guideId) {
      removeStoredConversationId(guideId);
    }
  }, [pacer, guideId]);

  return {
    messages,
    isLoading,
    isStreaming,
    isPausing,
    isInitialized,
    conversationId,
    sendMessage,
    cancelRequest,
    clearMessages,
    setMessages,
  };
}
