import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuideAvatar } from './GuideAvatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatRelativeTime, formatFullDateTime } from '@/lib/formatTime';
import type { ChatMessage } from '@/hooks/useGuideChat';

interface MessageBubbleProps {
  message: ChatMessage;
  guideEmoji?: string;
  guideName?: string;
  isStreaming?: boolean;
  isEmpathic?: boolean;
  /** Whether this is a continuation chunk (hides guide name) */
  isChunk?: boolean;
  /** Whether this is the first chunk in a series (shows guide name) */
  isFirstChunk?: boolean;
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

export const MessageBubble = forwardRef<HTMLDivElement, MessageBubbleProps>(
  function MessageBubble(
    {
      message,
      guideEmoji = '🧘',
      guideName = 'Guia',
      isStreaming = false,
      isEmpathic = false,
      isChunk = false,
      isFirstChunk = true,
    },
    ref
  ) {
    const isUser = message.role === 'user';
    const relativeTime = formatRelativeTime(message.createdAt);
    const fullDateTime = formatFullDateTime(message.createdAt);
    const showMemoryIndicator = !isUser && hasMemoryReference(message.content);

    // Hide guide name and avatar for continuation chunks
    const showGuideHeader = !isUser && (!isChunk || isFirstChunk);

    return (
      <motion.div
        ref={ref}
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
      {/* Avatar - only for assistant, hidden on continuation chunks */}
      {!isUser && showGuideHeader && (
        <GuideAvatar
          emoji={guideEmoji}
          state={isStreaming ? 'speaking' : isEmpathic ? 'empathic' : 'idle'}
        />
      )}
      {/* Spacer for continuation chunks to maintain alignment */}
      {!isUser && !showGuideHeader && (
        <div className="w-10 flex-shrink-0" />
      )}

      {/* Message content */}
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed font-body backdrop-blur-sm',
            isUser
              ? 'rounded-br-md shadow-[0_4px_16px_rgba(95,115,95,0.15)] text-cream-50'
              : 'bg-cream-50/90 text-sage-900 rounded-bl-md shadow-[0_2px_12px_rgba(95,115,95,0.08)] border border-sage-200/30',
            isEmpathic && !isUser && 'ring-1 ring-sage-400/30'
          )}
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #7d8f7d 0%, #5f735f 100%)',
                }
              : undefined
          }
        >
          {showGuideHeader && (
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-xs font-medium text-sage-600 font-body">
                {guideName}
              </span>
              {showMemoryIndicator && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  title="Seu guia lembrou de algo que você disse antes"
                  className="text-sage-500"
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
              className="inline-block w-1.5 h-4 ml-0.5 rounded-sm"
              style={{ background: 'rgba(95, 115, 95, 0.5)' }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>

        {/* Timestamp with tooltip */}
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <span
              className={cn(
                'text-xs font-body cursor-default select-none transition-opacity duration-200 hover:opacity-100',
                isUser
                  ? 'text-sage-500 opacity-70 text-right'
                  : 'text-sage-500 opacity-70 text-left'
              )}
            >
              {relativeTime}
            </span>
          </TooltipTrigger>
          <TooltipContent
            side={isUser ? 'left' : 'right'}
            className="bg-sage-900 border-sage-700 text-cream-50 font-body text-xs"
          >
            {fullDateTime}
          </TooltipContent>
        </Tooltip>
      </div>
    </motion.div>
  );
});

MessageBubble.displayName = 'MessageBubble';
