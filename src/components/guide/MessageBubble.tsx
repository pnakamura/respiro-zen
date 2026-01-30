import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { GuideAvatar } from './GuideAvatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatRelativeTime, formatFullDateTime } from '@/lib/formatTime';
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
  const relativeTime = formatRelativeTime(message.createdAt);
  const fullDateTime = formatFullDateTime(message.createdAt);

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
          state={isStreaming ? 'speaking' : 'idle'}
        />
      )}

      {/* Message content */}
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'rounded-2xl px-4 py-3 text-sm leading-relaxed font-body backdrop-blur-sm',
            isUser
              ? 'rounded-br-md shadow-[0_4px_16px_rgba(95,115,95,0.15)] text-cream-50'
              : 'bg-cream-50/90 text-sage-900 rounded-bl-md shadow-[0_2px_12px_rgba(95,115,95,0.08)] border border-sage-200/30'
          )}
          style={
            isUser
              ? {
                  background: 'linear-gradient(135deg, #7d8f7d 0%, #5f735f 100%)',
                }
              : undefined
          }
        >
          {!isUser && (
            <span className="block text-xs font-medium text-sage-600 mb-1 font-body">
              {guideName}
            </span>
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
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                className={cn(
                  'text-xs font-body cursor-default select-none transition-opacity duration-200 hover:opacity-100',
                  isUser
                    ? 'text-sage-500 opacity-60 text-right'
                    : 'text-sage-500 opacity-60 text-left'
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
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
