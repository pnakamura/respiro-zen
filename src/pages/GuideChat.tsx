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
import { Skeleton } from '@/components/ui/skeleton';
import { BottomNavigation } from '@/components/BottomNavigation';

export default function GuideChat() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');

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

  // Redirect to guide selection if no guide selected and not loading
  useEffect(() => {
    if (!loadingPreference && !locationGuideId && !preferredGuideId && guides?.length) {
      navigate('/guide/select');
    }
  }, [loadingPreference, locationGuideId, preferredGuideId, guides, navigate]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Add welcome message when guide loads
  useEffect(() => {
    if (guide?.welcome_message && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: guide.welcome_message,
        createdAt: new Date(),
      }]);
    }
  }, [guide, messages.length, setMessages]);

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
    if (guide?.welcome_message) {
      setMessages([{
        id: 'welcome-new',
        role: 'assistant',
        content: guide.welcome_message,
        createdAt: new Date(),
      }]);
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                {guide.avatar_emoji}
              </div>
              <div>
                <h1 className="font-semibold text-foreground">{guide.name}</h1>
                <p className="text-xs text-muted-foreground">{guide.approach}</p>
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
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                guideEmoji={guide?.avatar_emoji}
                guideName={guide?.name}
              />
            ))}
          </AnimatePresence>

          {isSending && messages[messages.length - 1]?.role === 'user' && (
            <TypingIndicator guideEmoji={guide?.avatar_emoji} />
          )}

          {/* Suggested questions - only show if no user messages yet */}
          {messages.length <= 1 && !isSending && suggestedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <SuggestedQuestions
                questions={suggestedQuestions}
                onSelect={handleSuggestedQuestion}
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
