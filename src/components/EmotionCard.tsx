import { motion } from 'framer-motion';
import { Emotion } from '@/types/breathing';
import { cn } from '@/lib/utils';

interface EmotionCardProps {
  emotion: Emotion;
  onClick: () => void;
  index: number;
}

export function EmotionCard({ emotion, onClick, index }: EmotionCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: index * 0.1, 
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'emotion-card glass w-full text-left',
        'flex items-center gap-4',
        'hover:shadow-lg active:shadow-md',
        'transition-shadow duration-300'
      )}
    >
      <motion.div 
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center text-3xl',
          emotion.bgClass
        )}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.4 }}
      >
        {emotion.icon}
      </motion.div>
      
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          'text-lg font-semibold',
          emotion.colorClass
        )}>
          {emotion.label}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {emotion.description}
        </p>
      </div>
      
      <motion.div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center',
          emotion.bgClass
        )}
        whileHover={{ x: 3 }}
      >
        <svg 
          className={cn('w-4 h-4', emotion.colorClass)} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}
