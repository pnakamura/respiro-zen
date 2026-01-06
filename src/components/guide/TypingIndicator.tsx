import { motion } from 'framer-motion';
import { GuideAvatar } from './GuideAvatar';

interface TypingIndicatorProps {
  guideEmoji?: string;
  thinkingPhrase?: string;
}

export function TypingIndicator({ 
  guideEmoji = '🧘', 
  thinkingPhrase = 'Refletindo...' 
}: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex gap-3 max-w-[85%] mr-auto"
    >
      <GuideAvatar emoji={guideEmoji} state="thinking" />
      
      <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3 flex flex-col gap-2">
        {/* Thinking phrase */}
        <motion.span
          key={thinkingPhrase}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="text-xs text-muted-foreground italic"
        >
          {thinkingPhrase}
        </motion.span>
        
        {/* Animated dots - slower animation */}
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-2 h-2 bg-primary/60 rounded-full"
            animate={{ 
              scale: [1, 1.4, 1], 
              opacity: [0.4, 1, 0.4] 
            }}
            transition={{ 
              duration: 1.8, 
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
              duration: 1.8, 
              repeat: Infinity, 
              delay: 0.3,
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
              duration: 1.8, 
              repeat: Infinity, 
              delay: 0.6,
              ease: 'easeInOut',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
