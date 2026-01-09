import { motion } from 'framer-motion';
import { Check, Lock, Play, Brain, Dumbbell, Users, Palette, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { JourneyDay } from '@/hooks/useJourneys';

interface JourneyProgressProps {
  currentDay: number;
  totalDays: number;
  completedDays: number[];
  onDayClick: (day: number) => void;
  themeColor?: string;
  days?: JourneyDay[];
}

const activityIcons: Record<string, React.ElementType> = {
  mental: Brain,
  physical: Dumbbell,
  social: Users,
  creative: Palette,
  spiritual: Sparkles,
};

export function JourneyProgress({
  currentDay,
  totalDays,
  completedDays,
  onDayClick,
  themeColor = 'primary',
  days = [],
}: JourneyProgressProps) {
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      accent: 'bg-accent text-accent-foreground',
      calm: 'bg-calm text-primary-foreground',
      energy: 'bg-energy text-primary-foreground',
      trust: 'bg-trust text-primary-foreground',
      joy: 'bg-joy text-foreground',
    };
    return colors[color] || colors.primary;
  };

  const getBorderClass = (color: string) => {
    const colors: Record<string, string> = {
      primary: 'border-primary/30',
      secondary: 'border-secondary/30',
      accent: 'border-accent/30',
      calm: 'border-calm/30',
      energy: 'border-energy/30',
      trust: 'border-trust/30',
      joy: 'border-joy/30',
    };
    return colors[color] || colors.primary;
  };

  const progressPercent = (completedDays.length / totalDays) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progresso</span>
          <span className="font-medium">{completedDays.length}/{totalDays} dias</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn('h-full rounded-full', getColorClass(themeColor))}
          />
        </div>
      </div>

      {/* Days list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isCompleted = completedDays.includes(day);
          const isCurrent = day === currentDay;
          const isLocked = day > currentDay && !isCompleted;
          const dayData = days.find(d => d.day_number === day);
          const activityType = dayData?.activity_type || 'mental';
          const ActivityIcon = activityIcons[activityType] || Brain;
          const title = dayData?.title || `Dia ${day}`;

          return (
            <motion.button
              key={day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: day * 0.03 }}
              onClick={() => !isLocked && onDayClick(day)}
              disabled={isLocked}
              className={cn(
                'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                isCompleted && `${getColorClass(themeColor)} shadow-sm`,
                isCurrent && !isCompleted && `bg-primary/10 border-2 ${getBorderClass(themeColor)} animate-pulse`,
                isLocked && 'bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60',
                !isCompleted && !isCurrent && !isLocked && 'bg-muted/20 hover:bg-muted/40 border border-border/30'
              )}
            >
              {/* Day number */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold',
                isCompleted ? 'bg-white/20' : isCurrent ? 'bg-primary/20 text-primary' : 'bg-muted/50'
              )}>
                {day}
              </div>

              {/* Activity icon */}
              <div className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0',
                isCompleted ? 'bg-white/20' : isCurrent ? 'bg-primary/10' : 'bg-muted/30'
              )}>
                <ActivityIcon className={cn(
                  'w-4 h-4',
                  isCompleted ? '' : isCurrent ? 'text-primary' : 'text-muted-foreground'
                )} />
              </div>

              {/* Title */}
              <span className={cn(
                'flex-1 text-sm font-medium truncate',
                isCompleted ? '' : isCurrent ? 'text-foreground' : isLocked ? 'text-muted-foreground' : 'text-foreground/80'
              )}>
                {title}
              </span>

              {/* Status icon */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <Play className="w-4 h-4 text-primary" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4" />
                ) : null}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
