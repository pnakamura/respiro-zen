import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: LucideIcon;
  emoji?: string;
  label: string;
  description?: string;
  color: 'primary' | 'secondary' | 'accent' | 'joy' | 'trust' | 'calm' | 'meditate' | 'nutrition';
  onClick: () => void;
  delay?: number;
}

const colorClasses = {
  primary: {
    bg: 'bg-primary/10 dark:bg-primary/20',
    text: 'text-primary',
    border: 'border-primary/20',
    shadow: 'hover:shadow-primary/20',
  },
  secondary: {
    bg: 'bg-secondary/10 dark:bg-secondary/20',
    text: 'text-secondary',
    border: 'border-secondary/20',
    shadow: 'hover:shadow-secondary/20',
  },
  accent: {
    bg: 'bg-accent/10 dark:bg-accent/20',
    text: 'text-accent',
    border: 'border-accent/20',
    shadow: 'hover:shadow-accent/20',
  },
  joy: {
    bg: 'bg-[hsl(48_95%_55%/0.15)]',
    text: 'text-[hsl(48_95%_45%)]',
    border: 'border-[hsl(48_95%_55%/0.3)]',
    shadow: 'hover:shadow-[hsl(48_95%_55%/0.2)]',
  },
  trust: {
    bg: 'bg-[hsl(145_50%_45%/0.15)]',
    text: 'text-[hsl(145_50%_40%)]',
    border: 'border-[hsl(145_50%_45%/0.3)]',
    shadow: 'hover:shadow-[hsl(145_50%_45%/0.2)]',
  },
  calm: {
    bg: 'bg-[hsl(168_65%_38%/0.15)]',
    text: 'text-[hsl(168_65%_38%)]',
    border: 'border-[hsl(168_65%_38%/0.3)]',
    shadow: 'hover:shadow-[hsl(168_65%_38%/0.2)]',
  },
  meditate: {
    bg: 'bg-[hsl(var(--meditate)/0.15)]',
    text: 'text-[hsl(var(--meditate))]',
    border: 'border-[hsl(var(--meditate)/0.3)]',
    shadow: 'hover:shadow-[hsl(var(--meditate)/0.2)]',
  },
  nutrition: {
    bg: 'bg-[hsl(var(--nutrition)/0.15)]',
    text: 'text-[hsl(var(--nutrition))]',
    border: 'border-[hsl(var(--nutrition)/0.3)]',
    shadow: 'hover:shadow-[hsl(var(--nutrition)/0.2)]',
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
      transition={{ delay, type: 'spring', stiffness: 400, damping: 25 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-4 rounded-2xl',
        'border transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'min-h-[90px] w-full active:bg-opacity-80',
        colors.bg,
        colors.border,
        'shadow-sm'
      )}
    >
      {/* Icon/Emoji - slightly smaller for compact design */}
      <div className="mb-1.5">
        {emoji ? (
          <span className="text-3xl">{emoji}</span>
        ) : (
          <Icon className={cn('w-7 h-7', colors.text)} strokeWidth={1.5} />
        )}
      </div>

      {/* Label - more prominent */}
      <span className="text-sm font-semibold text-foreground leading-tight text-center">{label}</span>

      {/* Description - optional, smaller */}
      {description && (
        <span className="text-[10px] text-muted-foreground mt-0.5 text-center line-clamp-1">{description}</span>
      )}
    </motion.button>
  );
}
