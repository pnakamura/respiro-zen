import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sparkles, Check, Play, Wind, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Journey, JourneyDay } from '@/hooks/useJourneys';

interface JourneyDetailsProps {
  journey: Journey;
  days: JourneyDay[];
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
  isStarting?: boolean;
  hasActiveJourney?: boolean;
}

const themeColors: Record<string, string> = {
  primary: 'from-primary to-primary/80',
  secondary: 'from-secondary to-secondary/80',
  accent: 'from-accent to-accent/80',
  calm: 'from-calm to-calm/80',
  energy: 'from-energy to-energy/80',
  trust: 'from-trust to-trust/80',
  joy: 'from-joy to-joy/80',
};

const difficultyLabels = {
  'iniciante': 'Iniciante',
  'intermediário': 'Intermediário',
  'avançado': 'Avançado',
};

const activityTypeLabels: Record<string, { label: string; icon: string }> = {
  'mental': { label: 'Mental', icon: '🧠' },
  'physical': { label: 'Físico', icon: '🏃' },
  'social': { label: 'Social', icon: '👥' },
  'creative': { label: 'Criativo', icon: '🎨' },
  'spiritual': { label: 'Espiritual', icon: '✨' },
};

export function JourneyDetails({
  journey,
  days,
  isOpen,
  onClose,
  onStart,
  isStarting,
  hasActiveJourney,
}: JourneyDetailsProps) {
  const gradientClass = themeColors[journey.theme_color] || themeColors.primary;

  // Calculate activity counts
  const activityCounts = days.reduce((acc, day) => {
    if (day.activity_type) {
      acc[day.activity_type] = (acc[day.activity_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  // Check for practices
  const hasBreathing = days.some(d => d.suggested_breathing_id);
  const hasMeditation = days.some(d => d.suggested_meditation_id);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 max-h-[90vh] bg-card rounded-t-3xl overflow-hidden"
          >
            {/* Header with gradient */}
            <div className={cn('relative h-[8rem] bg-gradient-to-br', gradientClass)}>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-[2rem] h-[2rem] rounded-full bg-background/20 backdrop-blur flex items-center justify-center"
              >
                <X className="w-5 h-5 text-primary-foreground" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                <span className="text-4xl">{journey.icon}</span>
                <div>
                  <h2 className="text-xl font-bold text-primary-foreground">{journey.title}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm text-primary-foreground/80">
                    <Clock className="w-4 h-4" />
                    <span>{journey.duration_days} dias</span>
                    <span>•</span>
                    <span>{difficultyLabels[journey.difficulty]}</span>
                    {journey.is_premium && (
                      <>
                        <span>•</span>
                        <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 pb-8 max-h-[calc(90vh-8rem)] overflow-y-auto space-y-6">
              {/* Description */}
              <div>
                <p className="text-muted-foreground leading-relaxed">{journey.description}</p>
              </div>

              {/* Benefits */}
              {journey.benefits.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">O que você vai conquistar</h3>
                  <ul className="space-y-2">
                    {journey.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-trust mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What this journey includes */}
              <div>
                <h3 className="font-semibold mb-3">O que esta jornada inclui</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(activityCounts).map(([type, count]) => {
                    const activity = activityTypeLabels[type];
                    if (!activity) return null;
                    return (
                      <span
                        key={type}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm"
                      >
                        <span>{activity.icon}</span>
                        <span>{count} {activity.label}</span>
                      </span>
                    );
                  })}
                  {hasBreathing && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-calm/20 text-calm text-sm">
                      <Wind className="w-4 h-4" />
                      <span>Respirações</span>
                    </span>
                  )}
                  {hasMeditation && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-trust/20 text-trust text-sm">
                      <Music className="w-4 h-4" />
                      <span>Meditações</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Preview of days */}
              <div>
                <h3 className="font-semibold mb-3">Prévia da jornada</h3>
                <div className="space-y-2">
                  {days.slice(0, 3).map((day) => {
                    const activityInfo = day.activity_type ? activityTypeLabels[day.activity_type] : null;
                    return (
                      <div
                        key={day.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/30"
                      >
                        <div className="w-[2rem] h-[2rem] rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                          {day.day_number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{day.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            {activityInfo && (
                              <span className="flex items-center gap-1">
                                <span>{activityInfo.icon}</span>
                                <span>{activityInfo.label}</span>
                              </span>
                            )}
                            {day.challenge_title && (
                              <>
                                <span>•</span>
                                <span className="truncate">{day.challenge_title}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          {day.suggested_breathing_id && (
                            <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-calm/20 flex items-center justify-center" title="Inclui respiração">
                              <Wind className="w-3.5 h-3.5 text-calm" />
                            </span>
                          )}
                          {day.suggested_meditation_id && (
                            <span className="w-[1.5rem] h-[1.5rem] rounded-full bg-trust/20 flex items-center justify-center" title="Inclui meditação">
                              <Music className="w-3.5 h-3.5 text-trust" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {days.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      + {days.length - 3} dias restantes
                    </p>
                  )}
                </div>
              </div>

              {/* Start button */}
              <Button
                onClick={onStart}
                disabled={isStarting}
                className="w-full h-14 text-lg font-semibold gap-2"
                size="lg"
              >
                <Play className="w-5 h-5" />
                {hasActiveJourney ? 'Trocar para esta Jornada' : 'Iniciar Jornada'}
              </Button>

              {hasActiveJourney && (
                <p className="text-xs text-muted-foreground text-center">
                  Iniciar esta jornada pausará sua jornada atual
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}