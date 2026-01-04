import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: LucideIcon;
  emoji?: string;
  label: string;
  description?: string;
  color: 'primary' | 'secondary' | 'accent' | 'joy' | 'trust' | 'calm' | 'meditate' | 'nutrition' | 'journey';
  onClick: () => void;
  delay?: number;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/12 dark:bg-primary/20',
    text: 'text-primary',
    border: 'border-primary/20',
    glow: 'shadow-[0_4px_20px_hsl(var(--primary)/0.15)]',
  },
  secondary: {
    bg: 'bg-secondary/12 dark:bg-secondary/20',
    text: 'text-secondary',
    border: 'border-secondary/20',
    glow: 'shadow-[0_4px_20px_hsl(var(--secondary)/0.15)]',
  },
  accent: {
    bg: 'bg-accent/12 dark:bg-accent/20',
    text: 'text-accent',
    border: 'border-accent/20',
    glow: 'shadow-[0_4px_20px_hsl(var(--accent)/0.15)]',
  },
  joy: {
    bg: 'bg-[hsl(var(--joy)/0.15)]',
    text: 'text-[hsl(var(--joy))]',
    border: 'border-[hsl(var(--joy)/0.25)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--joy)/0.2)]',
  },
  trust: {
    bg: 'bg-[hsl(var(--trust)/0.15)]',
    text: 'text-[hsl(var(--trust))]',
    border: 'border-[hsl(var(--trust)/0.25)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--trust)/0.2)]',
  },
  calm: {
    bg: 'bg-[hsl(var(--calm)/0.15)]',
    text: 'text-[hsl(var(--calm))]',
    border: 'border-[hsl(var(--calm)/0.25)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--calm)/0.2)]',
  },
  meditate: {
    bg: 'bg-[hsl(var(--meditate)/0.15)]',
    text: 'text-[hsl(var(--meditate))]',
    border: 'border-[hsl(var(--meditate)/0.25)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--meditate)/0.2)]',
  },
  nutrition: {
    bg: 'bg-[hsl(var(--nutrition)/0.15)]',
    text: 'text-[hsl(var(--nutrition))]',
    border: 'border-[hsl(var(--nutrition)/0.25)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--nutrition)/0.2)]',
  },
  journey: {
    bg: 'bg-[hsl(var(--surprise)/0.15)]',
    text: 'text-[hsl(var(--surprise))]',
    border: 'border-[hsl(var(--surprise)/0.25)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--surprise)/0.2)]',
  },
};

export function QuickActionCard({
  icon: Icon,
  emoji,
  label,
  description,
  color,
  onClick,
  delay = 0,
}: QuickActionCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.button
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 20 }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-5 rounded-2xl',
        'border transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'min-h-[110px] w-full',
        colors.bg,
        colors.border,
        colors.glow
      )}
    >
      {/* Icon/Emoji - larger for mobile */}
      <motion.div 
        className="mb-2"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji ? (
          <span className="text-4xl">{emoji}</span>
        ) : (
          <Icon className={cn('w-8 h-8', colors.text)} strokeWidth={1.5} />
        )}
      </motion.div>

      {/* Label - larger and bolder */}
      <span className="text-base font-semibold text-foreground leading-tight text-center">{label}</span>

      {/* Description - optional */}
      {description && (
        <span className="text-xs text-muted-foreground mt-1 text-center line-clamp-1">{description}</span>
      )}
    </motion.button>
  );
}
