import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GuideAvatar } from './GuideAvatar';
import type { ChatMessage } from '@/hooks/useGuideChat';

interface MessageBubbleProps {
  message: ChatMessage;
  guideEmoji?: string;
  guideName?: string;
  isStreaming?: boolean;
}

export function MessageBubble({ 
  message, 
  guideEmoji = '🧘', 
  guideName = 'Guia',
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95, filter: 'blur(2px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={cn(
        'flex gap-3 max-w-[85%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar - only for assistant */}
      {!isUser && (
        <GuideAvatar 
          emoji={guideEmoji} 
          state={isStreaming ? 'speaking' : 'idle'} 
        />
      )}

      {/* Message content */}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted text-foreground rounded-bl-md'
        )}
      >
        {!isUser && (
          <span className="block text-xs font-medium text-muted-foreground mb-1">
            {guideName}
          </span>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
        
        {/* Streaming indicator */}
        {isStreaming && !isUser && (
          <motion.span
            className="inline-block w-1.5 h-4 bg-primary/50 ml-0.5 rounded-sm"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
}
