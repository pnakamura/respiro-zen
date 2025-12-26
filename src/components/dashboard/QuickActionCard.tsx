import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  icon: LucideIcon;
  emoji?: string;
  label: string;
  description?: string;
  color: 'primary' | 'secondary' | 'accent' | 'joy' | 'trust' | 'calm';
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
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={cn(
        'relative flex flex-col items-center justify-center p-5 rounded-2xl',
        'border transition-all duration-300',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        'min-h-[120px] w-full',
        colors.bg,
        colors.border,
        'hover:shadow-lg',
        colors.shadow
      )}
    >
      {/* Icon/Emoji */}
      <div className="mb-2">
        {emoji ? (
          <span className="text-4xl">{emoji}</span>
        ) : (
          <Icon className={cn('w-8 h-8', colors.text)} strokeWidth={1.5} />
        )}
      </div>

      {/* Label */}
      <span className="text-sm font-semibold text-foreground">{label}</span>

      {/* Description */}
      {description && (
        <span className="text-xs text-muted-foreground mt-1">{description}</span>
      )}

      {/* Subtle glow effect */}
      <div
        className={cn(
          'absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300',
          'group-hover:opacity-100',
          colors.bg
        )}
        style={{ filter: 'blur(20px)', zIndex: -1 }}
      />
    </motion.button>
  );
}
