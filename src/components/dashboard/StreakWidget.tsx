import { motion } from 'framer-motion';
import { Flame, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakWidgetProps {
  currentStreak: number;
  bestStreak: number;
  level: number;
  totalPoints: number;
  isLoading?: boolean;
}

export function StreakWidget({
  currentStreak,
  bestStreak,
  level,
  totalPoints,
  isLoading = false,
}: StreakWidgetProps) {
  // Determine plant growth stage based on streak
  const getPlantStage = (streak: number) => {
    if (streak === 0) return { emoji: '🌱', label: 'Plante sua semente' };
    if (streak <= 3) return { emoji: '🌿', label: 'Crescendo' };
    if (streak <= 7) return { emoji: '🌻', label: 'Florescendo' };
    if (streak <= 14) return { emoji: '🌳', label: 'Fortalecendo' };
    if (streak <= 30) return { emoji: '🌲', label: 'Enraizado' };
    return { emoji: '🏆', label: 'Mestre' };
  };

  const plantStage = getPlantStage(currentStreak);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-card border border-border/50 p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-muted rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-24" />
            <div className="h-3 bg-muted rounded w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 25 }}
      className="rounded-2xl bg-card border border-border/50 p-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* Plant/Streak Visual */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.25, type: 'spring' }}
          className={cn(
            'w-16 h-16 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br from-primary/20 to-secondary/10'
          )}
        >
          <motion.span
            className="text-4xl"
            animate={{ 
              y: [0, -4, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            {plantStage.emoji}
          </motion.span>
        </motion.div>

        {/* Stats */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Flame className={cn(
              'w-5 h-5',
              currentStreak > 0 ? 'text-secondary' : 'text-muted-foreground'
            )} />
            <span className="text-2xl font-bold text-foreground">
              {currentStreak} {currentStreak === 1 ? 'dia' : 'dias'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {plantStage.label}
          </p>
        </div>

        {/* Mini Stats */}
        <div className="flex flex-col gap-1 items-end">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Award className="w-3.5 h-3.5" />
            <span>Nível {level}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Recorde: {bestStreak}</span>
          </div>
        </div>
      </div>

      {/* Progress to next level */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-muted-foreground">Progresso do nível</span>
          <span className="font-medium text-primary">{totalPoints} pts</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((totalPoints % 100), 100)}%` }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );
}
