import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useStreamingPacer } from './useStreamingPacer';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

interface UseGuideChatOptions {
  guideId: string;
  onMessageComplete?: (message: ChatMessage) => void;
  onStreamStart?: () => void;
}

export function useGuideChat({ guideId, onMessageComplete, onStreamStart }: UseGuideChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const assistantMessageIdRef = useRef<string | null>(null);
  const streamStartedRef = useRef(false);

  const pacer = useStreamingPacer();

  const sendMessage = useCallback(async (content: string) => {
    // Block if already loading OR streaming (prevents concurrent messages)
    if (!content.trim() || isLoading || isStreaming) return;

    // Stop any existing pacer before starting new message
    pacer.stop();

    setIsLoading(true);
    setIsStreaming(false);
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
            conversationId,
          }),
          signal: abortControllerRef.current.signal,
        }
      );

      // Get conversation ID from response header
      const newConversationId = response.headers.get('X-Conversation-Id');
      if (newConversationId && !conversationId) {
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

      // Initialize paced streaming
      pacer.start({
        onUpdate: (displayedText) => {
          setMessages(prev => {
            const hasAssistant = prev.some(m => m.id === assistantMessageId);
            if (!hasAssistant) {
              // First update - add the assistant message
              if (!streamStartedRef.current) {
                streamStartedRef.current = true;
                setIsStreaming(true);
                onStreamStart?.();
              }
              return [...prev, {
                id: assistantMessageId,
                role: 'assistant' as const,
                content: displayedText,
                createdAt: new Date(),
              }];
            }
            // Subsequent updates
            return prev.map(msg => 
              msg.id === assistantMessageId 
                ? { ...msg, content: displayedText }
                : msg
            );
          });
        },
        onComplete: () => {
          setIsStreaming(false);
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

      // Wait a bit for pacer to finish, then flush if needed
      await new Promise(resolve => setTimeout(resolve, 200));
      pacer.flush();

      // Final message
      const finalMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: fullContent,
        createdAt: new Date(),
      };

      // Ensure final content is set
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, content: fullContent }
          : msg
      ));

      onMessageComplete?.(finalMessage);

    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        console.log('Request aborted');
        pacer.stop();
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
      abortControllerRef.current = null;
    }
  }, [guideId, conversationId, isLoading, isStreaming, onMessageComplete, onStreamStart, pacer]);

  const cancelRequest = useCallback(() => {
    abortControllerRef.current?.abort();
    pacer.stop();
  }, [pacer]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    pacer.stop();
  }, [pacer]);

  return {
    messages,
    isLoading,
    isStreaming,
    conversationId,
    sendMessage,
    cancelRequest,
    clearMessages,
    setMessages,
  };
}
