import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: LucideIcon;
  emoji?: string;
  label: string;
  description?: string;
  color: 'primary' | 'secondary' | 'accent' | 'joy' | 'trust' | 'calm' | 'meditate' | 'nutrition' | 'journey' | 'studio';
  onClick: () => void;
  delay?: number;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/12 dark:bg-primary/25',
    text: 'text-primary',
    border: 'border-primary/20 dark:border-primary/35',
    glow: 'shadow-[0_4px_20px_hsl(var(--primary)/0.15)] dark:shadow-[0_4px_30px_hsl(var(--primary)/0.35)]',
  },
  secondary: {
    bg: 'bg-secondary/12 dark:bg-secondary/25',
    text: 'text-secondary',
    border: 'border-secondary/20 dark:border-secondary/35',
    glow: 'shadow-[0_4px_20px_hsl(var(--secondary)/0.15)] dark:shadow-[0_4px_30px_hsl(var(--secondary)/0.35)]',
  },
  accent: {
    bg: 'bg-accent/12 dark:bg-accent/25',
    text: 'text-accent',
    border: 'border-accent/20 dark:border-accent/35',
    glow: 'shadow-[0_4px_20px_hsl(var(--accent)/0.15)] dark:shadow-[0_4px_30px_hsl(var(--accent)/0.35)]',
  },
  joy: {
    bg: 'bg-[hsl(var(--joy)/0.15)] dark:bg-[hsl(var(--joy)/0.2)]',
    text: 'text-[hsl(var(--joy))]',
    border: 'border-[hsl(var(--joy)/0.25)] dark:border-[hsl(var(--joy)/0.4)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--joy)/0.2)] dark:shadow-[0_4px_35px_hsl(var(--joy)/0.45)]',
  },
  trust: {
    bg: 'bg-[hsl(var(--trust)/0.15)] dark:bg-[hsl(var(--trust)/0.2)]',
    text: 'text-[hsl(var(--trust))]',
    border: 'border-[hsl(var(--trust)/0.25)] dark:border-[hsl(var(--trust)/0.4)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--trust)/0.2)] dark:shadow-[0_4px_35px_hsl(var(--trust)/0.45)]',
  },
  calm: {
    bg: 'bg-[hsl(var(--calm)/0.15)] dark:bg-[hsl(var(--calm)/0.2)]',
    text: 'text-[hsl(var(--calm))]',
    border: 'border-[hsl(var(--calm)/0.25)] dark:border-[hsl(var(--calm)/0.4)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--calm)/0.2)] dark:shadow-[0_4px_35px_hsl(var(--calm)/0.5)]',
  },
  meditate: {
    bg: 'bg-[hsl(var(--meditate)/0.15)] dark:bg-[hsl(var(--meditate)/0.2)]',
    text: 'text-[hsl(var(--meditate))]',
    border: 'border-[hsl(var(--meditate)/0.25)] dark:border-[hsl(var(--meditate)/0.4)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--meditate)/0.2)] dark:shadow-[0_4px_35px_hsl(var(--meditate)/0.5)]',
  },
  nutrition: {
    bg: 'bg-[hsl(var(--nutrition)/0.15)] dark:bg-[hsl(var(--nutrition)/0.2)]',
    text: 'text-[hsl(var(--nutrition))]',
    border: 'border-[hsl(var(--nutrition)/0.25)] dark:border-[hsl(var(--nutrition)/0.4)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--nutrition)/0.2)] dark:shadow-[0_4px_35px_hsl(var(--nutrition)/0.45)]',
  },
  journey: {
    bg: 'bg-[hsl(var(--surprise)/0.15)] dark:bg-[hsl(var(--surprise)/0.2)]',
    text: 'text-[hsl(var(--surprise))]',
    border: 'border-[hsl(var(--surprise)/0.25)] dark:border-[hsl(var(--surprise)/0.4)]',
    glow: 'shadow-[0_4px_20px_hsl(var(--surprise)/0.2)] dark:shadow-[0_4px_35px_hsl(var(--surprise)/0.45)]',
  },
  studio: {
    bg: 'bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 dark:from-violet-500/25 dark:to-fuchsia-500/25',
    text: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-400/30 dark:border-violet-400/50',
    glow: 'shadow-[0_4px_20px_rgba(139,92,246,0.25)] dark:shadow-[0_4px_35px_rgba(139,92,246,0.5)]',
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
