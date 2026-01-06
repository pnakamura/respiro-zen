import { useEffect, useRef, useState } from 'react';
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
import { useThinkingDelay, getRandomThinkingPhrase } from '@/hooks/useThinkingDelay';
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function GuideChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [thinkingPhrase, setThinkingPhrase] = useState('');
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  // Get guide ID from location state or user preference
  const locationGuideId = location.state?.guideId;
  const { data: preferredGuideId, isLoading: loadingPreference } = useUserGuidePreference();
  const { data: guides } = useGuides();
  
  const guideId = locationGuideId || preferredGuideId || guides?.[0]?.id;
  const { data: guide, isLoading: loadingGuide } = useGuide(guideId || null);

  const {
    messages,
    isLoading: isSending,
    sendMessage,
    clearMessages,
    setMessages,
  } = useGuideChat({ guideId: guideId || '' });

  const { startThinking, stopThinking } = useThinkingDelay();

  // Redirect to guide selection if no guide selected and not loading
  useEffect(() => {
    if (!loadingPreference && !locationGuideId && !preferredGuideId && guides?.length) {
      navigate('/guide/select', { replace: true });
    }
  }, [loadingPreference, locationGuideId, preferredGuideId, guides, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTypingIndicator]);

  // Add welcome message when guide loads
  useEffect(() => {
    if (guide?.welcome_message && messages.length === 0) {
      // Delay welcome message slightly for natural feel
      const timeout = setTimeout(() => {
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: guide.welcome_message,
          createdAt: new Date(),
        }]);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [guide, messages.length, setMessages]);

  // Handle thinking indicator with human-like delay
  useEffect(() => {
    if (isSending && messages[messages.length - 1]?.role === 'user') {
      const userMessage = messages[messages.length - 1].content;
      
      // Initial phrase
      setThinkingPhrase(getRandomThinkingPhrase());
      
      // Show typing indicator after brief delay
      const showDelay = 300 + Math.random() * 400;
      const showTimeout = setTimeout(() => {
        setShowTypingIndicator(true);
      }, showDelay);
      
      // Change phrase periodically
      const phraseInterval = setInterval(() => {
        setThinkingPhrase(getRandomThinkingPhrase());
      }, 2500);
      
      return () => {
        clearTimeout(showTimeout);
        clearInterval(phraseInterval);
      };
    } else {
      setShowTypingIndicator(false);
    }
  }, [isSending, messages]);

  const handleSend = () => {
    if (!inputValue.trim() || isSending) return;
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
    sendMessage(question);
  };

  const handleNewConversation = () => {
    clearMessages();
    stopThinking();
    setShowTypingIndicator(false);
    
    if (guide?.welcome_message) {
      setTimeout(() => {
        setMessages([{
          id: 'welcome-new',
          role: 'assistant',
          content: guide.welcome_message,
          createdAt: new Date(),
        }]);
      }, 300);
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

  // Check if the last assistant message is currently streaming
  const lastMessage = messages[messages.length - 1];
  const isStreaming = isSending && lastMessage?.role === 'assistant';

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
                animate={isSending ? { 
                  scale: [1, 1.05, 1],
                  boxShadow: ['0 0 0 hsl(var(--primary)/0)', '0 0 15px hsl(var(--primary)/0.2)', '0 0 0 hsl(var(--primary)/0)'],
                } : {}}
                transition={{ duration: 2, repeat: isSending ? Infinity : 0 }}
              >
                {guide.avatar_emoji}
              </motion.div>
              <div>
                <h1 className="font-semibold text-foreground">{guide.name}</h1>
                <p className="text-xs text-muted-foreground">
                  {isSending ? 'digitando...' : guide.approach}
                </p>
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
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-48">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                guideEmoji={guide?.avatar_emoji}
                guideName={guide?.name}
                isStreaming={isStreaming && index === messages.length - 1}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator with thinking phrase */}
          <AnimatePresence>
            {showTypingIndicator && (
              <TypingIndicator 
                guideEmoji={guide?.avatar_emoji} 
                thinkingPhrase={thinkingPhrase}
              />
            )}
          </AnimatePresence>

          {/* Suggested questions - only show if no user messages yet */}
          {messages.length <= 1 && !isSending && suggestedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
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
      <div className="fixed bottom-20 left-0 right-0 p-4 glass border-t border-border/50">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite sua mensagem..."
            className="min-h-[48px] max-h-32 resize-none rounded-xl bg-background"
            disabled={isSending || !guideId}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending || !guideId}
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
