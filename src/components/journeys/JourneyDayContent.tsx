import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Wind, 
  Headphones, 
  Target, 
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Play,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { JourneyDay } from '@/hooks/useJourneys';

interface JourneyDayContentProps {
  day: JourneyDay;
  dayNumber: number;
  totalDays: number;
  journeyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reflection?: string) => void;
  onOpenBreathing?: (breathingId: string) => void;
  onOpenMeditation?: (meditationId: string) => void;
  isCompleting?: boolean;
}

const activityIcons = {
  mental: '🧠',
  physical: '💪',
  social: '👥',
  creative: '🎨',
  spiritual: '✨',
};

const activityLabels: Record<string, string> = {
  mental: 'Mental',
  physical: 'Físico',
  social: 'Social',
  creative: 'Criativo',
  spiritual: 'Espiritual',
};

export function JourneyDayContent({
  day,
  dayNumber,
  totalDays,
  journeyTitle,
  isOpen,
  onClose,
  onComplete,
  onOpenBreathing,
  onOpenMeditation,
  isCompleting,
}: JourneyDayContentProps) {
  const [reflection, setReflection] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('teaching');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleComplete = () => {
    onComplete(reflection || undefined);
  };

  // Obter nomes reais das práticas do JOIN
  const breathingName = day.breathing_technique?.label || 'Respiração';
  const breathingPattern = day.breathing_technique?.pattern_name;
  const breathingIcon = day.breathing_technique?.icon || '🌬️';
  
  const meditationName = day.meditation_track?.title || 'Meditação';
  const meditationDuration = day.meditation_track?.duration_display;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-background"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="h-full flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <div>
                <p className="text-xs text-muted-foreground font-medium">{journeyTitle}</p>
                <h1 className="font-bold text-lg">Dia {dayNumber} de {totalDays}</h1>
              </div>
              <button
                onClick={onClose}
                className="w-[2.5rem] h-[2.5rem] rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Hero Image */}
              {day.image_url && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-48 md:h-64 overflow-hidden"
                >
                  <img
                    src={day.image_url}
                    alt={day.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </motion.div>
              )}

              <div className="px-4 py-4 space-y-4">
                {/* Day Title with Activity Badge */}
                <div className="text-center py-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                    <span>{activityIcons[day.activity_type]}</span>
                    <span>{activityLabels[day.activity_type]}</span>
                  </div>
                  <h2 className="text-xl font-bold text-foreground">{day.title}</h2>
                  {day.teaching_author && (
                    <p className="text-sm text-muted-foreground mt-1">— {day.teaching_author}</p>
                  )}
                </div>

                {/* Teaching Card */}
                <motion.div
                  className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 overflow-hidden"
                >
                  <button
                    onClick={() => toggleSection('teaching')}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold">Ensinamento do Dia</span>
                    </div>
                    {expandedSection === 'teaching' ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSection === 'teaching' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-[15px]">
                          {day.teaching_text}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Practices - Enhanced Cards */}
                {(day.suggested_breathing_id || day.suggested_meditation_id) && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground px-1 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Práticas Sugeridas
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {day.suggested_breathing_id && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onOpenBreathing?.(day.suggested_breathing_id!)}
                          className="p-4 rounded-2xl bg-gradient-to-br from-calm/15 to-calm/5 border border-calm/30 text-left hover:shadow-lg hover:shadow-calm/10 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl bg-calm/20 flex items-center justify-center text-2xl">
                              {breathingIcon}
                            </div>
                            <div className="w-8 h-8 rounded-full bg-calm/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4 text-calm fill-calm" />
                            </div>
                          </div>
                          <p className="font-semibold text-foreground">{breathingName}</p>
                          {breathingPattern && (
                            <p className="text-xs text-muted-foreground mt-1">{breathingPattern}</p>
                          )}
                          <div className="mt-3 flex items-center gap-2 text-calm text-sm font-medium">
                            <Wind className="w-4 h-4" />
                            <span>Iniciar prática</span>
                          </div>
                        </motion.button>
                      )}
                      {day.suggested_meditation_id && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onOpenMeditation?.(day.suggested_meditation_id!)}
                          className="p-4 rounded-2xl bg-gradient-to-br from-meditate/15 to-meditate/5 border border-meditate/30 text-left hover:shadow-lg hover:shadow-meditate/10 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="w-12 h-12 rounded-xl bg-meditate/20 flex items-center justify-center">
                              <Headphones className="w-6 h-6 text-meditate" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-meditate/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4 text-meditate fill-meditate" />
                            </div>
                          </div>
                          <p className="font-semibold text-foreground">{meditationName}</p>
                          {meditationDuration && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {meditationDuration}
                            </p>
                          )}
                          <div className="mt-3 flex items-center gap-2 text-meditate text-sm font-medium">
                            <Headphones className="w-4 h-4" />
                            <span>Iniciar meditação</span>
                          </div>
                        </motion.button>
                      )}
                    </div>
                  </div>
                )}

                {/* Challenge */}
                {day.challenge_description && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-gradient-to-br from-energy/10 to-energy/5 border border-energy/20 p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-energy/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-energy" />
                      </div>
                      <div>
                        <p className="font-semibold">{day.challenge_title || 'Desafio do Dia'}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          {activityIcons[day.activity_type]} {activityLabels[day.activity_type]}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">{day.challenge_description}</p>
                  </motion.div>
                )}

                {/* Bonus Tip */}
                {day.bonus_tip && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-xl bg-gradient-to-r from-joy/10 to-transparent border border-joy/20 p-4 flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-joy/20 flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-joy" />
                    </div>
                    <div>
                      <p className="font-medium text-sm mb-1">Dica Bônus</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{day.bonus_tip}</p>
                    </div>
                  </motion.div>
                )}

                {/* Reflection */}
                {day.reflection_prompt && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-semibold text-muted-foreground px-1">
                      ✍️ Reflexão Pessoal
                    </h3>
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-sm text-muted-foreground italic mb-3">
                        "{day.reflection_prompt}"
                      </p>
                      <Textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="Escreva sua reflexão..."
                        className="min-h-[6.25rem] resize-none bg-background/50"
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 bg-gradient-to-t from-background to-transparent">
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="w-full h-14 text-lg font-semibold gap-2 shadow-lg"
                size="lg"
              >
                {isCompleting ? (
                  <Sparkles className="w-5 h-5 animate-pulse" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
                Concluir Dia {dayNumber}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}