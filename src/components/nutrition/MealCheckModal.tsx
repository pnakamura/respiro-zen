import { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { X, ChevronRight, Wind, Check, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotionNutritionContext, useMealCategories } from '@/hooks/useNutrition';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface MealCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggestBreathing?: () => void;
}

type Step = 'mood' | 'hunger' | 'category' | 'energy' | 'notes' | 'success';

const moods = [
  { id: 'good', emoji: '😊', label: 'Bem' },
  { id: 'neutral', emoji: '😐', label: 'Neutro' },
  { id: 'anxious', emoji: '😰', label: 'Ansioso' },
  { id: 'stressed', emoji: '😤', label: 'Estressado' },
  { id: 'tired', emoji: '😴', label: 'Cansado' },
  { id: 'sad', emoji: '😔', label: 'Triste' },
  { id: 'happy', emoji: '🥰', label: 'Feliz' },
];

const hungerTypes = [
  { id: 'physical', emoji: '🍎', label: 'Fome física', description: 'Meu corpo precisa de energia' },
  { id: 'emotional', emoji: '💭', label: 'Fome emocional', description: 'Estou buscando conforto' },
  { id: 'unknown', emoji: '🤷', label: 'Não sei', description: 'Preciso refletir' },
];

const energyLevels = [
  { id: 'sleepy', emoji: '😴', label: 'Sonolento', description: 'Com vontade de descansar' },
  { id: 'satisfied', emoji: '😌', label: 'Satisfeito', description: 'Bem e leve' },
  { id: 'energized', emoji: '⚡', label: 'Energizado', description: 'Pronto para ação' },
  { id: 'uncomfortable', emoji: '🤢', label: 'Desconfortável', description: 'Comi demais ou mal' },
  { id: 'normal', emoji: '😐', label: 'Normal', description: 'Sem mudanças significativas' },
];

export function MealCheckModal({ isOpen, onClose, onSuggestBreathing }: MealCheckModalProps) {
  const [step, setStep] = useState<Step>('mood');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedHunger, setSelectedHunger] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEnergy, setSelectedEnergy] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showBreathingSuggestion, setShowBreathingSuggestion] = useState(false);

  const { createEntry, isCreating } = useEmotionNutritionContext();
  const { data: categories } = useMealCategories();

  const resetForm = () => {
    setStep('mood');
    setSelectedMood(null);
    setSelectedHunger(null);
    setSelectedCategory(null);
    setSelectedEnergy(null);
    setNotes('');
    setShowBreathingSuggestion(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    setStep('hunger');
  };

  const handleHungerSelect = async (hungerId: string) => {
    setSelectedHunger(hungerId);
    
    // If emotional hunger, suggest breathing first
    if (hungerId === 'emotional') {
      setShowBreathingSuggestion(true);
    } else {
      setStep('category');
    }
  };

  const handleCategorySelect = (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    setStep('energy');
  };

  const handleEnergySelect = (energyId: string) => {
    setSelectedEnergy(energyId);
    setStep('notes');
  };

  const handleSubmit = async () => {
    try {
      await createEntry({
        mood_before: selectedMood!,
        hunger_type: selectedHunger as 'physical' | 'emotional' | 'unknown',
        meal_category: selectedCategory,
        energy_after: selectedEnergy,
        mindful_eating_notes: notes.trim() || null,
      });
      
      setStep('success');
      toast.success('Registro de alimentação consciente salvo!');
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      toast.error('Erro ao salvar registro');
    }
  };

  const handleBreathingChoice = (wantsBreathing: boolean) => {
    if (wantsBreathing && onSuggestBreathing) {
      handleClose();
      onSuggestBreathing();
    } else {
      setShowBreathingSuggestion(false);
      setStep('category');
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'hunger':
        setStep('mood');
        break;
      case 'category':
        setStep('hunger');
        break;
      case 'energy':
        setStep('category');
        break;
      case 'notes':
        setStep('energy');
        break;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'mood':
        return 'Como você está se sentindo agora?';
      case 'hunger':
        return 'Que tipo de fome é essa?';
      case 'category':
        return 'Qual refeição você vai fazer?';
      case 'energy':
        return 'Como você se sente depois de comer?';
      case 'notes':
        return 'Quer anotar algo sobre essa experiência?';
      case 'success':
        return 'Registro salvo!';
    }
  };

  const getStepNumber = () => {
    const steps: Step[] = ['mood', 'hunger', 'category', 'energy', 'notes'];
    return steps.indexOf(step) + 1;
  };

  const canGoBack = step !== 'mood' && step !== 'success' && !showBreathingSuggestion;

  // Handle drag to dismiss
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 && info.velocity.y > 0) {
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-end justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal - Bottom Sheet style */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            onClick={(e) => e.stopPropagation()}
            // Android (browser normal) pode sobrepor a barra de navegação do sistema em conteúdo fixo no bottom.
            // Por isso elevamos levemente o sheet e usamos fallback vh/dvh para altura máxima.
            className={cn(
              "relative w-full max-w-lg flex flex-col overflow-hidden bg-card rounded-t-3xl shadow-xl border-t border-border/50",
              "max-h-[min(92dvh,92vh)]",
              "mb-[max(env(safe-area-inset-bottom,24px),24px)]"
            )}
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header - sticky */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-border/30 bg-card flex-shrink-0">
              <div className="flex items-center gap-2">
                {canGoBack && (
                  <button
                    onClick={handleBack}
                    className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors active:scale-95"
                  >
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
                <span className="text-xl">🍽️</span>
                <div>
                  <h2 className="text-base font-bold text-foreground">Alimentação Consciente</h2>
                  <p className="text-xs text-muted-foreground">
                    Passo {getStepNumber()} de 5
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 -mr-1 rounded-full hover:bg-muted transition-colors active:scale-95"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content - scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4">
              {/* Progress indicator */}
              <div className="flex gap-1.5 mb-4">
                {['mood', 'hunger', 'category', 'energy', 'notes'].map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      getStepNumber() > i
                        ? 'bg-nutrition'
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>

              <h3 className="text-lg font-bold text-foreground mb-4 text-center">
                {getStepTitle()}
              </h3>

              {/* Breathing suggestion overlay */}
              {showBreathingSuggestion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl p-5 text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wind className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="text-base font-semibold text-foreground mb-2">
                    Parece que você está buscando conforto
                  </h4>
                  <p className="text-sm text-muted-foreground mb-5">
                    Que tal fazer uma respiração consciente antes de comer? Isso pode ajudar você a entender melhor o que seu corpo realmente precisa.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBreathingChoice(true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    >
                      <Wind className="w-4 h-4" />
                      Sim, quero respirar
                    </button>
                    <button
                      onClick={() => handleBreathingChoice(false)}
                      className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-medium active:scale-95 transition-transform"
                    >
                      Continuar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Mood selection */}
              {step === 'mood' && !showBreathingSuggestion && (
                <div className="grid grid-cols-4 gap-2">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all active:scale-95',
                        selectedMood === mood.id
                          ? 'bg-nutrition/20 border-nutrition'
                          : 'bg-card border-border/50 hover:border-nutrition/50'
                      )}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs font-medium text-foreground">{mood.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Hunger type selection */}
              {step === 'hunger' && !showBreathingSuggestion && (
                <div className="space-y-2.5">
                  {hungerTypes.map((hunger) => (
                    <motion.button
                      key={hunger.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleHungerSelect(hunger.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left active:scale-[0.98]',
                        selectedHunger === hunger.id
                          ? 'bg-nutrition/20 border-nutrition'
                          : 'bg-card border-border/50 hover:border-nutrition/50'
                      )}
                    >
                      <span className="text-2xl">{hunger.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-foreground block text-sm">{hunger.label}</span>
                        <span className="text-xs text-muted-foreground">{hunger.description}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Category selection */}
              {step === 'category' && !showBreathingSuggestion && (
                <div className="space-y-2.5">
                  {categories?.map((category) => (
                    <motion.button
                      key={category.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCategorySelect(category.nome)}
                      disabled={isCreating}
                      className={cn(
                        'w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left active:scale-[0.98]',
                        'bg-card border-border/50 hover:border-nutrition/50 disabled:opacity-50'
                      )}
                    >
                      <span className="text-xl">
                        {category.nome === 'Café da manhã' ? '🌅' :
                         category.nome === 'Almoço' ? '🍽️' :
                         category.nome === 'Jantar' ? '🌙' :
                         category.nome === 'Lanche' ? '🥪' : '🍴'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-foreground block text-sm">{category.nome}</span>
                        {category.descricao && (
                          <span className="text-xs text-muted-foreground">{category.descricao}</span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                  
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategorySelect(null)}
                    disabled={isCreating}
                    className="w-full flex items-center gap-3 p-3.5 rounded-2xl border bg-muted/50 border-border/50 hover:border-nutrition/50 text-left disabled:opacity-50 active:scale-[0.98]"
                  >
                    <span className="text-xl">✨</span>
                    <span className="font-semibold text-foreground text-sm">Apenas registrar momento</span>
                  </motion.button>
                </div>
              )}

              {/* Energy level selection */}
              {step === 'energy' && !showBreathingSuggestion && (
                <div className="space-y-2.5">
                  <p className="text-xs text-muted-foreground text-center mb-3">
                    Como seu corpo está se sentindo após a refeição?
                  </p>
                  {energyLevels.map((energy) => (
                    <motion.button
                      key={energy.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleEnergySelect(energy.id)}
                      className={cn(
                        'w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all text-left active:scale-[0.98]',
                        selectedEnergy === energy.id
                          ? 'bg-nutrition/20 border-nutrition'
                          : 'bg-card border-border/50 hover:border-nutrition/50'
                      )}
                    >
                      <span className="text-2xl">{energy.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-foreground block text-sm">{energy.label}</span>
                        <span className="text-xs text-muted-foreground">{energy.description}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Notes step */}
              {step === 'notes' && !showBreathingSuggestion && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground text-center">
                    Reflexões sobre essa experiência alimentar (opcional)
                  </p>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Comi devagar e percebi que estava satisfeito antes de terminar o prato..."
                    className="w-full h-28 p-3.5 rounded-2xl bg-muted border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-nutrition resize-none text-sm"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {notes.length}/500
                  </p>
                </div>
              )}

              {/* Success state */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-nutrition/20 flex items-center justify-center">
                    <Check className="w-8 h-8 text-nutrition" />
                  </div>
                  <p className="text-base font-semibold text-foreground mb-1">
                    Excelente! 🎉
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Você praticou alimentação consciente. Continue assim!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer - sticky with safe area */}
            {step === 'notes' && !showBreathingSuggestion && (
              <div className="sticky bottom-0 px-5 pt-3 pb-5 border-t border-border/30 bg-card flex-shrink-0 safe-bottom">
                <Button
                  onClick={handleSubmit}
                  disabled={isCreating}
                  className="w-full h-12 rounded-xl bg-nutrition hover:bg-nutrition/90 text-white font-semibold text-base"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
