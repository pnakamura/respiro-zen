import { motion } from 'framer-motion';
import { Clock, Sparkles, ChevronRight, Check, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Journey } from '@/hooks/useJourneys';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ContentLock } from '@/components/access/ContentLock';

interface JourneyCardProps {
  journey: Journey;
  onClick: () => void;
  progress?: number; // 0-100
  isCompleted?: boolean;
  delay?: number;
}

const difficultyLabels = {
  'iniciante': 'Iniciante',
  'intermediário': 'Intermediário',
  'avançado': 'Avançado',
};

const themeColors: Record<string, string> = {
  primary: 'from-primary/20 to-primary/5 border-primary/30',
  secondary: 'from-secondary/20 to-secondary/5 border-secondary/30',
  accent: 'from-accent/20 to-accent/5 border-accent/30',
  calm: 'from-calm/20 to-calm/5 border-calm/30',
  energy: 'from-energy/20 to-energy/5 border-energy/30',
  trust: 'from-trust/20 to-trust/5 border-trust/30',
  joy: 'from-joy/20 to-joy/5 border-joy/30',
};

export function JourneyCard({ journey, onClick, progress, isCompleted, delay = 0 }: JourneyCardProps) {
  const colorClass = themeColors[journey.theme_color] || themeColors.primary;

  return (
    <ContentLock
      contentType="journey"
      contentId={journey.id}
      contentTitle={journey.title}
      showBadge={journey.is_premium}
      badgePosition="top-left"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        className={cn(
          'w-full p-4 rounded-2xl bg-gradient-to-br border text-left transition-shadow relative',
          colorClass,
          'hover:shadow-lg'
        )}
      >
        {/* Favorite button */}
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton type="journey" itemId={journey.id} size="sm" />
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClick}
          className="w-full text-left"
        >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="text-3xl flex-shrink-0">{journey.icon}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{journey.title}</h3>
              {journey.is_premium && (
                <Sparkles className="w-4 h-4 text-energy flex-shrink-0" />
              )}
              {isCompleted && (
                <div className="w-5 h-5 rounded-full bg-trust flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-trust-foreground" />
                </div>
              )}
            </div>

            {journey.subtitle && (
              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                {journey.subtitle}
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {journey.duration_days} dias
              </span>
              <span className="px-2 py-0.5 rounded-full bg-muted/50">
                {difficultyLabels[journey.difficulty]}
              </span>
            </div>

            {/* Progress bar */}
            {typeof progress === 'number' && progress > 0 && !isCompleted && (
              <div className="mt-3">
                <div className="h-1.5 rounded-full bg-muted/50 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, delay: delay + 0.2 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <p className="text-[0.625rem] text-muted-foreground mt-1">{Math.round(progress)}% concluído</p>
              </div>
            )}
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
        </motion.button>
      </motion.div>
    </ContentLock>
  );
}
