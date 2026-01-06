import { motion, type Transition, type TargetAndTransition } from 'framer-motion';
import { cn } from '@/lib/utils';

export type AvatarState = 'idle' | 'thinking' | 'speaking' | 'empathic';

interface GuideAvatarProps {
  emoji: string;
  state?: AvatarState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-9 h-9 text-lg',
  md: 'w-10 h-10 text-xl',
  lg: 'w-12 h-12 text-2xl',
};

const glowStyles = {
  idle: '',
  thinking: 'shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
  speaking: 'shadow-[0_0_15px_hsl(var(--primary)/0.25)]',
  empathic: 'shadow-[0_0_25px_hsl(var(--primary)/0.4)]',
};

export function GuideAvatar({ 
  emoji, 
  state = 'idle', 
  size = 'sm',
  className,
}: GuideAvatarProps) {
  const getAnimation = (): TargetAndTransition => {
    switch (state) {
      case 'thinking':
        return {
          scale: [1, 1.08, 1],
          transition: { 
            duration: 2, 
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        };
      case 'speaking':
        return {
          scale: [1, 1.03, 1],
          transition: { 
            duration: 0.6, 
            repeat: Infinity,
            ease: 'easeInOut' as const,
          },
        };
      case 'empathic':
        return {
          scale: 1.05,
          transition: { duration: 0.4 },
        };
      default:
        return {
          scale: 1,
          transition: { duration: 0.3 },
        };
    }
  };

  return (
    <motion.div
      className={cn(
        'flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center transition-shadow duration-300',
        sizeClasses[size],
        glowStyles[state],
        className
      )}
      animate={getAnimation()}
    >
      <motion.span
        animate={state === 'thinking' ? { 
          opacity: [1, 0.7, 1],
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {emoji}
      </motion.span>
    </motion.div>
  );
}
