import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Wind, 
  Headphones, 
  Target, 
  Lightbulb,
  Check,
  Sparkles,
  Play,
  Clock,
  ZoomIn,
  ImageIcon,
  Lock,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { JourneyDay } from '@/hooks/useJourneys';

interface DayChecks {
  imageViewed: boolean;
  teachingRead: boolean;
  practicesDone: boolean;
  challengeDone: boolean;
}

interface JourneyDayContentProps {
  day: JourneyDay;
  dayNumber: number;
  totalDays: number;
  journeyTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (reflection?: string, checks?: { teachingRead: boolean; practiceDone: boolean; challengeDone: boolean }) => void;
  onOpenBreathing?: (breathingId: string) => void;
  onOpenMeditation?: (meditationId: string) => void;
  isCompleting?: boolean;
  practiceCompleted?: boolean;
  onPracticeReset?: () => void;
}

const activityIcons: Record<string, string> = {
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

// Componente de Checkbox visual
function SectionCheck({ 
  checked, 
  onClick, 
  disabled = false 
}: { 
  checked: boolean; 
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
        checked 
          ? "bg-primary border-primary text-primary-foreground scale-100" 
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {checked && <Check className="w-4 h-4" />}
    </button>
  );
}

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
  practiceCompleted,
  onPracticeReset,
}: JourneyDayContentProps) {
  const [reflection, setReflection] = useState('');
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  
  // Estado dos checks - inicializado baseado na disponibilidade de cada seção
  const hasPractices = !!day.suggested_breathing_id || !!day.suggested_meditation_id;
  const hasChallenge = !!day.challenge_description;
  const hasImage = !!day.image_url;
  
  const [checks, setChecks] = useState<DayChecks>({
    imageViewed: !hasImage, // true se não tem imagem
    teachingRead: false,
    practicesDone: !hasPractices, // true se não tem práticas
    challengeDone: !hasChallenge, // true se não tem desafio
  });

  // Atualizar check de práticas quando a prática for completada externamente
  useEffect(() => {
    if (practiceCompleted && !checks.practicesDone) {
      setChecks(prev => ({ ...prev, practicesDone: true }));
    }
  }, [practiceCompleted, checks.practicesDone]);

  // Reset quando fechar o modal
  useEffect(() => {
    if (!isOpen) {
      setChecks({
        imageViewed: !hasImage,
        teachingRead: false,
        practicesDone: !hasPractices,
        challengeDone: !hasChallenge,
      });
      setReflection('');
      onPracticeReset?.();
    }
  }, [isOpen, hasImage, hasPractices, hasChallenge, onPracticeReset]);

  // Calcular progresso e se pode concluir
  const activeChecks = [
    hasImage ? checks.imageViewed : null,
    checks.teachingRead,
    hasPractices ? checks.practicesDone : null,
    hasChallenge ? checks.challengeDone : null,
  ].filter(c => c !== null) as boolean[];
  
  const checkedCount = activeChecks.filter(Boolean).length;
  const totalChecks = activeChecks.length;
  const canComplete = activeChecks.every(Boolean);

  const handleComplete = () => {
    onComplete(reflection || undefined, {
      teachingRead: checks.teachingRead,
      practiceDone: checks.practicesDone,
      challengeDone: checks.challengeDone,
    });
  };

  const handleImageClick = () => {
    setIsImageExpanded(true);
    if (!checks.imageViewed) {
      setChecks(prev => ({ ...prev, imageViewed: true }));
    }
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
            <div className="flex flex-col p-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center justify-between">
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
              
              {/* Barra de Progresso */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {activeChecks.map((checked, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      className={cn(
                        "h-1.5 flex-1 rounded-full transition-colors duration-300",
                        checked ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {checkedCount}/{totalChecks}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
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

                {/* Imagem do Dia - Após o título */}
                {day.image_url && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-muted/30 border border-border/50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-3 bg-muted/20">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                        <span>Imagem do Dia</span>
                      </div>
                      <SectionCheck 
                        checked={checks.imageViewed} 
                        onClick={() => setChecks(prev => ({ ...prev, imageViewed: true }))}
                      />
                    </div>
                    <button
                      onClick={handleImageClick}
                      className="relative w-full overflow-hidden bg-muted cursor-zoom-in hover:ring-2 hover:ring-primary/50 transition-all group"
                    >
                      <img
                        src={day.image_url}
                        alt={day.title}
                        className="w-full max-h-[60vh] object-contain bg-black/5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4 text-foreground" />
                      </div>
                      <span className="absolute bottom-2 left-2 text-[10px] text-foreground/70 bg-background/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                        Toque para ampliar
                      </span>
                    </button>
                  </motion.div>
                )}

                {/* Modal de Imagem Expandida */}
                <AnimatePresence>
                  {isImageExpanded && day.image_url && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4"
                      onClick={() => setIsImageExpanded(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-full max-h-full flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setIsImageExpanded(false)}
                          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                        <img
                          src={day.image_url}
                          alt={day.title}
                          className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        />
                        <p className="text-center text-white/70 text-sm mt-3">{day.title}</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Teaching Card */}
                <motion.div
                  className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 overflow-hidden"
                >
                  <div className="flex items-center justify-between p-4 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold">Ensinamento do Dia</span>
                    </div>
                    <SectionCheck 
                      checked={checks.teachingRead} 
                      onClick={() => setChecks(prev => ({ ...prev, teachingRead: !prev.teachingRead }))}
                    />
                  </div>
                  <div className="px-4 pb-4">
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-line text-[15px]">
                      {day.teaching_text}
                    </p>
                    {!checks.teachingRead && (
                      <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                        <Circle className="w-3 h-3" />
                        Marque como lido após ler o ensinamento
                      </p>
                    )}
                  </div>
                </motion.div>

                {/* Practices */}
                {(day.suggested_breathing_id || day.suggested_meditation_id) && (
                  <div className="rounded-2xl border border-border/50 overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-calm/20 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-calm" />
                        </div>
                        <div>
                          <span className="font-semibold">Práticas Sugeridas</span>
                          <p className="text-xs text-muted-foreground">Complete ao menos uma prática</p>
                        </div>
                      </div>
                      <SectionCheck 
                        checked={checks.practicesDone} 
                        onClick={() => setChecks(prev => ({ ...prev, practicesDone: !prev.practicesDone }))}
                      />
                    </div>
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {day.suggested_breathing_id && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => onOpenBreathing?.(day.suggested_breathing_id!)}
                          className="p-4 rounded-xl bg-gradient-to-br from-calm/15 to-calm/5 border border-calm/30 text-left hover:shadow-lg hover:shadow-calm/10 transition-all group"
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
                          className="p-4 rounded-xl bg-gradient-to-br from-meditate/15 to-meditate/5 border border-meditate/30 text-left hover:shadow-lg hover:shadow-meditate/10 transition-all group"
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
                    {!checks.practicesDone && (
                      <p className="text-xs text-muted-foreground px-4 pb-4 flex items-center gap-1">
                        <Circle className="w-3 h-3" />
                        Realize ou marque como visualizado para continuar
                      </p>
                    )}
                  </div>
                )}

                {/* Challenge */}
                {day.challenge_description && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl border border-energy/30 overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-4 bg-energy/10">
                      <div className="flex items-center gap-3">
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
                      <SectionCheck 
                        checked={checks.challengeDone} 
                        onClick={() => setChecks(prev => ({ ...prev, challengeDone: !prev.challengeDone }))}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-foreground/80 leading-relaxed">{day.challenge_description}</p>
                      {!checks.challengeDone && (
                        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                          <Circle className="w-3 h-3" />
                          Marque como concluído após realizar o desafio
                        </p>
                      )}
                    </div>
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
                    <h3 className="text-sm font-semibold text-muted-foreground px-1 flex items-center gap-2">
                      ✍️ Reflexão Pessoal
                      <span className="text-xs font-normal">(opcional)</span>
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
                disabled={!canComplete || isCompleting}
                className={cn(
                  "w-full h-14 text-lg font-semibold gap-2 shadow-lg transition-all",
                  !canComplete && "opacity-60"
                )}
                size="lg"
              >
                {isCompleting ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Salvando...
                  </>
                ) : !canComplete ? (
                  <>
                    <Lock className="w-5 h-5" />
                    Complete todas as etapas ({checkedCount}/{totalChecks})
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Concluir Dia {dayNumber}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
