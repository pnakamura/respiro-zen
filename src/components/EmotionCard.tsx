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
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: index * 0.12, 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'emotion-card glass w-full text-left relative overflow-hidden',
        'flex items-center gap-4',
        'hover:shadow-xl active:shadow-lg',
        'transition-all duration-300'
      )}
    >
      {/* Shimmer effect on tap */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -z-0"
        initial={{ x: "-100%", opacity: 0 }}
        whileTap={{ x: "100%", opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      
      <motion.div 
        className={cn(
          'w-20 h-20 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-5xl md:text-3xl relative z-10',
          emotion.bgClass
        )}
        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {emotion.icon}
      </motion.div>
      
      <div className="flex-1 min-w-0 relative z-10">
        <h3 className={cn(
          'text-2xl md:text-lg font-bold',
          emotion.colorClass
        )}>
          {emotion.label}
        </h3>
        <p className="text-lg md:text-sm text-muted-foreground line-clamp-2">
          {emotion.description}
        </p>
      </div>
      
      <motion.div
        className={cn(
          'w-12 h-12 md:w-8 md:h-8 rounded-full flex items-center justify-center relative z-10',
          emotion.bgClass
        )}
        whileHover={{ x: 5, scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <svg 
          className={cn('w-6 h-6 md:w-4 md:h-4', emotion.colorClass)} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </motion.div>
    </motion.button>
  );
}
