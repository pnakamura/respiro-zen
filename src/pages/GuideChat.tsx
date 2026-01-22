import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Send, RefreshCw, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageBubble } from '@/components/guide/MessageBubble';
import { TypingIndicator } from '@/components/guide/TypingIndicator';
import { SuggestedQuestions } from '@/components/guide/SuggestedQuestions';
import { useGuideChat } from '@/hooks/useGuideChat';
import { useGuide, useUserGuidePreference, useGuides } from '@/hooks/useGuides';
import { useAuth } from '@/contexts/AuthContext';
import { getRandomThinkingPhrase, detectMessageContext, hasEmotionalContent } from '@/hooks/useThinkingDelay';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavigation } from '@/components/BottomNavigation';

type ChatPhase = 'idle' | 'reading' | 'thinking' | 'transitioning' | 'responding';

export default function GuideChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [thinkingPhrase, setThinkingPhrase] = useState('');
  const [phase, setPhase] = useState<ChatPhase>('idle');
  const [canRevealAssistant, setCanRevealAssistant] = useState(true);
  const [lastUserMessageContext, setLastUserMessageContext] = useState<'default' | 'emotional' | 'question' | 'greeting'>('default');
  const phraseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get guide ID from location state or user preference
  const locationGuideId = location.state?.guideId;
  const { data: preferredGuideId, isLoading: loadingPreference } = useUserGuidePreference();
  const { data: guides } = useGuides();
  
  const guideId = locationGuideId || preferredGuideId || guides?.[0]?.id;
  const { data: guide, isLoading: loadingGuide } = useGuide(guideId || null);

  // Callback when stream starts - delay proportional to estimated response length
  const handleStreamStart = useCallback((estimatedLength: number = 0) => {
    // Base delay + proportional to estimated response size (up to 1200ms extra)
    const baseDelay = 600;
    const proportionalDelay = Math.min(estimatedLength * 1.5, 1200);
    const transitionDelay = baseDelay + proportionalDelay + Math.random() * 400;
    
    setTimeout(() => {
      setPhase('transitioning');
    }, transitionDelay);
  }, []);

  // Use stable guideId - never change from empty to non-empty (prevents hooks reorder)
  const stableGuideId = guideId || '';
  
  const {
    messages,
    isLoading: isSending,
    isStreaming,
    sendMessage,
    clearMessages,
    setMessages,
  } = useGuideChat({ 
    guideId: stableGuideId,
    onStreamStart: handleStreamStart,
  });

  // Redirect to guide selection if no guide selected and not loading
  useEffect(() => {
    if (!loadingPreference && !locationGuideId && !preferredGuideId && guides?.length) {
      navigate('/guide/select', { replace: true });
    }
  }, [loadingPreference, locationGuideId, preferredGuideId, guides, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, phase]);

  // Add welcome message when guide loads
  useEffect(() => {
    if (guide?.welcome_message && messages.length === 0) {
      // Longer delay for welcome message - guide is "preparing" (1000-1600ms)
      const timeout = setTimeout(() => {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: guide.welcome_message,
          createdAt: new Date(),
        }]);
      }, 1000 + Math.random() * 600);
      return () => clearTimeout(timeout);
    }
  }, [guide, messages.length, setMessages]);

  // Handle phase transitions
  useEffect(() => {
    // When user sends a message, start reading phase
    if (isSending && messages[messages.length - 1]?.role === 'user' && phase === 'idle') {
      const lastUserMessage = messages[messages.length - 1];
      const context = detectMessageContext(lastUserMessage.content);
      setLastUserMessageContext(context);
      setCanRevealAssistant(false);
      setPhase('reading');
      setThinkingPhrase(getRandomThinkingPhrase(context));
    }
  }, [isSending, messages, phase]);

  // Reading phase -> Thinking phase
  useEffect(() => {
    if (phase === 'reading') {
      // Reading delay based on user message length (1600-3500ms)
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const userMessageLength = lastUserMessage?.content.length || 0;
      const baseReading = 1600; // 1.6s minimum
      const perCharReading = 12; // 12ms per character
      const readingDelay = Math.min(
        baseReading + userMessageLength * perCharReading + Math.random() * 600,
        3500 // Max 3.5s reading
      );
      const timeout = setTimeout(() => {
        setPhase('thinking');
      }, readingDelay);
      return () => clearTimeout(timeout);
    }
  }, [phase, messages]);

  // Thinking phase - rotate phrases using context
  useEffect(() => {
    if (phase === 'thinking') {
      // Change phrase every 4 seconds, keeping context
      phraseIntervalRef.current = setInterval(() => {
        setThinkingPhrase(getRandomThinkingPhrase(lastUserMessageContext));
      }, 4000);
      
      return () => {
        if (phraseIntervalRef.current) {
          clearInterval(phraseIntervalRef.current);
          phraseIntervalRef.current = null;
        }
      };
    }
  }, [phase, lastUserMessageContext]);

  // Handle transitioning phase + safety timeout
  useEffect(() => {
    if (phase === 'transitioning') {
      // Clear phrase interval
      if (phraseIntervalRef.current) {
        clearInterval(phraseIntervalRef.current);
        phraseIntervalRef.current = null;
      }
      
      // Safety timeout - if transition takes too long, force reveal (2s max)
      const safetyTimeout = setTimeout(() => {
        console.warn('Safety timeout: forcing assistant reveal');
        setCanRevealAssistant(true);
        setPhase('responding');
      }, 2000);
      
      return () => clearTimeout(safetyTimeout);
    }
  }, [phase]);

  // Handle responding phase completion
  useEffect(() => {
    if (!isSending && !isStreaming && phase === 'responding') {
      setPhase('idle');
    }
  }, [isSending, isStreaming, phase]);

  // Handle typing indicator exit complete - add small buffer before reveal
  const handleTypingIndicatorExitComplete = useCallback(() => {
    // Small additional delay after exit animation completes for smooth transition
    setTimeout(() => {
      setCanRevealAssistant(true);
      if (phase === 'transitioning') {
        setPhase('responding');
      }
    }, 100); // 100ms buffer
  }, [phase]);

  const handleSend = () => {
    if (!inputValue.trim() || isSending || isStreaming) return;
    // Don't reset phase here - let the state machine flow naturally
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (isSending || isStreaming) return;
    // Don't reset phase here - let the state machine flow naturally
    sendMessage(question);
  };

  const handleNewConversation = () => {
    clearMessages();
    setPhase('idle');
    setCanRevealAssistant(true);
    if (phraseIntervalRef.current) {
      clearInterval(phraseIntervalRef.current);
      phraseIntervalRef.current = null;
    }
    
    if (guide?.welcome_message) {
      setTimeout(() => {
        setMessages([{
          id: 'welcome-new',
          role: 'assistant',
          content: guide.welcome_message,
          createdAt: new Date(),
        }]);
      }, 400);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  const isLoading = loadingPreference || loadingGuide;
  const suggestedQuestions = Array.isArray(guide?.suggested_questions) 
    ? guide.suggested_questions 
    : [];

  // Determine which messages to show - hide last assistant until canRevealAssistant is true
  const visibleMessages = messages.filter((msg, index) => {
    // Always show user messages
    if (msg.role === 'user') return true;
    
    // For the last assistant message, only show when canRevealAssistant is true
    // This ensures the message never appears before TypingIndicator exits
    if (msg.role === 'assistant' && index === messages.length - 1) {
      if (!canRevealAssistant) {
        return false;
      }
    }
    
    return true;
  });

  // Show typing indicator during reading, thinking, and transitioning phases
  // Show typing indicator only during reading and thinking - NOT transitioning (so it exits)
  const showTypingIndicator = phase === 'reading' || phase === 'thinking';

  // Get header status text
  const getStatusText = () => {
    switch (phase) {
      case 'reading':
        return 'lendo...';
      case 'thinking':
        return 'refletindo...';
      case 'transitioning':
      case 'responding':
        return 'digitando...';
      default:
        return guide?.approach || '';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      {/* Subtle animated background for emotional tone */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 glass border-b border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 safe-top">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          {isLoading ? (
            <div className="flex-1 flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ) : guide ? (
            <div className="flex-1 flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl"
                animate={phase !== 'idle' ? { 
                  scale: [1, 1.05, 1],
                  boxShadow: ['0 0 0 hsl(var(--primary)/0)', '0 0 15px hsl(var(--primary)/0.2)', '0 0 0 hsl(var(--primary)/0)'],
                } : {}}
                transition={{ duration: 2, repeat: phase !== 'idle' ? Infinity : 0 }}
              >
                {guide.avatar_emoji}
              </motion.div>
              <div>
                <h1 className="font-semibold text-foreground">{guide.name}</h1>
                <motion.p 
                  key={getStatusText()}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-muted-foreground"
                >
                  {getStatusText()}
                </motion.p>
              </div>
            </div>
          ) : null}

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNewConversation}
              className="rounded-full"
              title="Nova conversa"
            >
              <RefreshCw className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/guide/select')}
              className="rounded-full"
              title="Trocar guia"
            >
              <Users className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ paddingBottom: 'calc(var(--bottom-nav-height, 88px) + 144px)' }}>
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleMessages.map((message, index) => {
              // Determine if this assistant message should show empathic state
              const isLastAssistant = message.role === 'assistant' && index === visibleMessages.length - 1;
              const previousUserMessage = isLastAssistant 
                ? messages.filter(m => m.role === 'user').pop()
                : null;
              const isEmpathicResponse = previousUserMessage 
                ? hasEmotionalContent(previousUserMessage.content)
                : false;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  guideEmoji={guide?.avatar_emoji}
                  guideName={guide?.name}
                  isStreaming={isStreaming && isLastAssistant}
                  isEmpathic={isLastAssistant && isEmpathicResponse}
                />
              );
            })}
          </AnimatePresence>

          {/* Typing indicator with synchronized exit - mode="wait" ensures exit completes before new element */}
          <AnimatePresence mode="wait" onExitComplete={handleTypingIndicatorExitComplete}>
            {showTypingIndicator && (
              <TypingIndicator 
                guideEmoji={guide?.avatar_emoji} 
                thinkingPhrase={thinkingPhrase}
              />
            )}
          </AnimatePresence>

          {/* Suggested questions - only show if no user messages yet */}
          {messages.length <= 1 && phase === 'idle' && suggestedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="pt-4"
            >
              <SuggestedQuestions
                questions={suggestedQuestions}
                onSelect={handleSuggestedQuestion}
                maxQuestions={3}
              />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="fixed left-0 right-0 p-4 glass border-t border-border/50" style={{ bottom: 'calc(var(--bottom-nav-height, 88px) + 12px)' }}>
        <div className="max-w-2xl mx-auto flex gap-2">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[48px] max-h-32 resize-none rounded-xl bg-background"
            disabled={isSending || isStreaming || !guideId}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending || isStreaming || !guideId}
            size="icon"
            className="h-12 w-12 rounded-xl flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
