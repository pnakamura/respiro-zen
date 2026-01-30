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
      initial={{ opacity: 0, y: 16, filter: 'blur(8px)', scale: 0.92 }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, y: -10, filter: 'blur(8px)', scale: 0.94 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-3 max-w-[85%] mr-auto"
    >
      <GuideAvatar emoji={guideEmoji} state="thinking" />

      <div className="bg-cream-50/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-4 py-3 flex flex-col gap-2 border border-sage-200/30 shadow-[0_2px_12px_rgba(95,115,95,0.08)]">
        {/* Thinking phrase */}
        <motion.span
          key={thinkingPhrase}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-xs text-sage-600 italic font-body"
        >
          {thinkingPhrase}
        </motion.span>

        {/* Animated dots - slower animation for more relaxed feel */}
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-2 h-2 rounded-full"
            style={{ background: 'rgba(95, 115, 95, 0.6)' }}
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
            className="w-2 h-2 rounded-full"
            style={{ background: 'rgba(95, 115, 95, 0.6)' }}
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
            className="w-2 h-2 rounded-full"
            style={{ background: 'rgba(95, 115, 95, 0.6)' }}
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
