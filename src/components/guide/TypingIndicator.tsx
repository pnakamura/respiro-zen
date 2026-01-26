import { motion } from 'framer-motion';
import { GuideAvatar } from './GuideAvatar';

interface TypingIndicatorProps {
  guideEmoji?: string;
  thinkingPhrase?: string;
  /** 'thinking' shows phrase + dots, 'simple' shows only dots */
  variant?: 'thinking' | 'simple';
}

export function TypingIndicator({ 
  guideEmoji = '🧘', 
  thinkingPhrase = 'Refletindo...',
  variant = 'thinking',
}: TypingIndicatorProps) {
  const showPhrase = variant === 'thinking' && thinkingPhrase;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)', scale: 0.92 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, y: -10, filter: 'blur(8px)', scale: 0.94 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3 max-w-[85%] mr-auto"
    >
      <GuideAvatar emoji={guideEmoji} state="thinking" />
      
      <div className={`bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex flex-col ${showPhrase ? 'gap-2' : 'justify-center'}`}>
        {/* Thinking phrase - only show for 'thinking' variant */}
        {showPhrase && (
          <motion.span
            key={thinkingPhrase}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-xs text-muted-foreground italic"
          >
            {thinkingPhrase}
          </motion.span>
        )}
        
        {/* Animated dots - slower animation for more relaxed feel */}
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-2 h-2 bg-primary/60 rounded-full"
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [0.4, 1, 0.4] 
            }}
            transition={{ 
              duration: 2.0, 
              repeat: Infinity, 
              delay: 0,
              ease: 'easeInOut',
            }}
          />
          <motion.span
            className="w-2 h-2 bg-primary/60 rounded-full"
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [0.4, 1, 0.4] 
            }}
            transition={{ 
              duration: 2.0, 
              repeat: Infinity, 
              delay: 0.35,
              ease: 'easeInOut',
            }}
          />
          <motion.span
            className="w-2 h-2 bg-primary/60 rounded-full"
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [0.4, 1, 0.4] 
            }}
            transition={{ 
              duration: 2.0, 
              repeat: Infinity, 
              delay: 0.7,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
