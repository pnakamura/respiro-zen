import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles, Wind, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEmotionNutritionContext, useMealCategories } from '@/hooks/useNutrition';
import { toast } from 'sonner';

interface MealCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuggestBreathing?: () => void;
}

type Step = 'mood' | 'hunger' | 'category' | 'success';

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

export function MealCheckModal({ isOpen, onClose, onSuggestBreathing }: MealCheckModalProps) {
  const [step, setStep] = useState<Step>('mood');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedHunger, setSelectedHunger] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showBreathingSuggestion, setShowBreathingSuggestion] = useState(false);

  const { createEntry, isCreating } = useEmotionNutritionContext();
  const { data: categories } = useMealCategories();

  const resetForm = () => {
    setStep('mood');
    setSelectedMood(null);
    setSelectedHunger(null);
    setSelectedCategory(null);
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

  const handleCategorySelect = async (categoryName: string | null) => {
    setSelectedCategory(categoryName);
    
    try {
      await createEntry({
        mood_before: selectedMood!,
        hunger_type: selectedHunger as 'physical' | 'emotional' | 'unknown',
        meal_category: categoryName,
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

  const getStepTitle = () => {
    switch (step) {
      case 'mood':
        return 'Como você está se sentindo agora?';
      case 'hunger':
        return 'Que tipo de fome é essa?';
      case 'category':
        return 'Qual refeição você vai fazer?';
      case 'success':
        return 'Registro salvo!';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-card rounded-t-3xl shadow-2xl overflow-hidden max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <h2 className="text-lg font-semibold text-foreground">Alimentação Consciente</h2>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">
              {/* Progress indicator */}
              <div className="flex gap-2 mb-6">
                {['mood', 'hunger', 'category'].map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      step === s || ['mood', 'hunger', 'category'].indexOf(step) > i
                        ? 'bg-nutrition'
                        : 'bg-muted'
                    )}
                  />
                ))}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-6 text-center">
                {getStepTitle()}
              </h3>

              {/* Breathing suggestion overlay */}
              {showBreathingSuggestion && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Wind className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-lg font-semibold text-foreground mb-2">
                    Parece que você está buscando conforto
                  </h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Que tal fazer uma respiração consciente antes de comer? Isso pode ajudar você a entender melhor o que seu corpo realmente precisa.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleBreathingChoice(true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
                    >
                      <Wind className="w-4 h-4" />
                      Sim, quero respirar
                    </button>
                    <button
                      onClick={() => handleBreathingChoice(false)}
                      className="flex-1 py-3 px-4 rounded-xl bg-muted text-foreground font-medium"
                    >
                      Continuar
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Mood selection */}
              {step === 'mood' && !showBreathingSuggestion && (
                <div className="grid grid-cols-4 gap-3">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all',
                        selectedMood === mood.id
                          ? 'bg-nutrition/20 border-nutrition'
                          : 'bg-card border-border/50 hover:border-nutrition/50'
                      )}
                    >
                      <span className="text-3xl">{mood.emoji}</span>
                      <span className="text-xs font-medium text-foreground">{mood.label}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Hunger type selection */}
              {step === 'hunger' && !showBreathingSuggestion && (
                <div className="space-y-3">
                  {hungerTypes.map((hunger) => (
                    <motion.button
                      key={hunger.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleHungerSelect(hunger.id)}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left',
                        selectedHunger === hunger.id
                          ? 'bg-nutrition/20 border-nutrition'
                          : 'bg-card border-border/50 hover:border-nutrition/50'
                      )}
                    >
                      <span className="text-3xl">{hunger.emoji}</span>
                      <div className="flex-1">
                        <span className="font-semibold text-foreground block">{hunger.label}</span>
                        <span className="text-sm text-muted-foreground">{hunger.description}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Category selection */}
              {step === 'category' && !showBreathingSuggestion && (
                <div className="space-y-3">
                  {categories?.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCategorySelect(category.nome)}
                      disabled={isCreating}
                      className={cn(
                        'w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left',
                        'bg-card border-border/50 hover:border-nutrition/50 disabled:opacity-50'
                      )}
                    >
                      <span className="text-2xl">
                        {category.nome === 'Café da manhã' ? '🌅' :
                         category.nome === 'Almoço' ? '🍽️' :
                         category.nome === 'Jantar' ? '🌙' :
                         category.nome === 'Lanche' ? '🥪' : '🍴'}
                      </span>
                      <div className="flex-1">
                        <span className="font-semibold text-foreground block">{category.nome}</span>
                        {category.descricao && (
                          <span className="text-sm text-muted-foreground">{category.descricao}</span>
                        )}
                      </div>
                    </motion.button>
                  ))}
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategorySelect(null)}
                    disabled={isCreating}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl border bg-muted/50 border-border/50 hover:border-nutrition/50 text-left disabled:opacity-50"
                  >
                    <span className="text-2xl">✨</span>
                    <span className="font-semibold text-foreground">Apenas registrar momento</span>
                  </motion.button>
                </div>
              )}

              {/* Success state */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-nutrition/20 flex items-center justify-center">
                    <Check className="w-10 h-10 text-nutrition" />
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-2">
                    Excelente! 🎉
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Você praticou alimentação consciente. Continue assim!
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
