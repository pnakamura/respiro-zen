import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuideAvatar } from './GuideAvatar';
import type { ChatMessage } from '@/hooks/useGuideChat';

interface MessageBubbleProps {
  message: ChatMessage;
  guideEmoji?: string;
  guideName?: string;
  isStreaming?: boolean;
  isEmpathic?: boolean;
}

// Patterns that indicate the guide is recalling conversation history
const memoryPatterns = [
  'como você mencionou',
  'como voce mencionou',
  'você disse',
  'voce disse',
  'lembro que',
  'anteriormente',
  'você comentou',
  'voce comentou',
  'na nossa conversa',
  'você falou',
  'voce falou',
  'como conversamos',
];

function hasMemoryReference(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return memoryPatterns.some(pattern => lowerContent.includes(pattern));
}

export function MessageBubble({ 
  message, 
  guideEmoji = '🧘', 
  guideName = 'Guia',
  isStreaming = false,
  isEmpathic = false,
}: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const showMemoryIndicator = !isUser && hasMemoryReference(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.92, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ 
        duration: 0.65, 
        ease: [0.22, 1, 0.36, 1],
        delay: isUser ? 0 : 0.15,
      }}
      className={cn(
        'flex gap-3 max-w-[85%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar - only for assistant */}
      {!isUser && (
        <GuideAvatar 
          emoji={guideEmoji} 
          state={isStreaming ? 'speaking' : isEmpathic ? 'empathic' : 'idle'} 
        />
      )}

      {/* Message content */}
      <div
        className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser 
            ? 'bg-primary text-primary-foreground rounded-br-md' 
            : 'bg-muted text-foreground rounded-bl-md',
          isEmpathic && !isUser && 'ring-1 ring-primary/20'
        )}
      >
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs font-medium text-muted-foreground">
              {guideName}
            </span>
            {showMemoryIndicator && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                title="Seu guia lembrou de algo que você disse antes"
                className="text-primary/60"
              >
                <Sparkles className="w-3 h-3" />
              </motion.div>
            )}
          </div>
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
