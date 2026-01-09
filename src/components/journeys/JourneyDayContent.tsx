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
  Sparkles
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
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div>
                <p className="text-xs text-muted-foreground">{journeyTitle}</p>
                <h1 className="font-bold text-lg">Dia {dayNumber} de {totalDays}</h1>
              </div>
              <button
                onClick={onClose}
                className="w-[2.5rem] h-[2.5rem] rounded-full bg-muted/50 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {/* Day Title */}
              <div className="text-center py-4">
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

              {/* Practices */}
              {(day.suggested_breathing_id || day.suggested_meditation_id) && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground px-1">Práticas Sugeridas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {day.suggested_breathing_id && (
                      <button
                        onClick={() => onOpenBreathing?.(day.suggested_breathing_id!)}
                        className="p-4 rounded-xl bg-calm/10 border border-calm/20 text-left hover:bg-calm/20 transition-colors"
                      >
                        <Wind className="w-6 h-6 text-calm mb-2" />
                        <p className="font-medium text-sm">Respiração</p>
                        <p className="text-xs text-muted-foreground">Prática guiada</p>
                      </button>
                    )}
                    {day.suggested_meditation_id && (
                      <button
                        onClick={() => onOpenMeditation?.(day.suggested_meditation_id!)}
                        className="p-4 rounded-xl bg-meditate/10 border border-meditate/20 text-left hover:bg-meditate/20 transition-colors"
                      >
                        <Headphones className="w-6 h-6 text-meditate mb-2" />
                        <p className="font-medium text-sm">Meditação</p>
                        <p className="text-xs text-muted-foreground">Sessão guiada</p>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Challenge */}
              {day.challenge_description && (
                <div className="rounded-2xl bg-gradient-to-br from-energy/10 to-energy/5 border border-energy/20 p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-energy/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-energy" />
                    </div>
                    <div>
                      <p className="font-semibold">{day.challenge_title || 'Desafio do Dia'}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {activityIcons[day.activity_type]} {day.activity_type}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80">{day.challenge_description}</p>
                </div>
              )}

              {/* Bonus Tip */}
              {day.bonus_tip && (
                <div className="rounded-xl bg-muted/30 p-4 flex gap-3">
                  <Lightbulb className="w-5 h-5 text-joy flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm mb-1">Dica Bônus</p>
                    <p className="text-xs text-muted-foreground">{day.bonus_tip}</p>
                  </div>
                </div>
              )}

              {/* Reflection */}
              {day.reflection_prompt && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground px-1">
                    Reflexão Pessoal
                  </h3>
                  <p className="text-sm text-muted-foreground italic px-1">
                    "{day.reflection_prompt}"
                  </p>
                  <Textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    placeholder="Escreva sua reflexão..."
                    className="min-h-[6.25rem] resize-none"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/50 bg-background">
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className="w-full h-14 text-lg font-semibold gap-2"
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
