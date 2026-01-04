import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, PenLine, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PlutchikWheel } from '@/components/emotions/PlutchikWheel';
import { EmotionIntensitySlider } from '@/components/emotions/EmotionIntensitySlider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateEmotionEntry } from '@/hooks/useEmotionEntries';
import { primaryEmotions, detectDyads } from '@/data/plutchik-emotions';
import { useTreatmentCategories } from '@/hooks/useTreatmentCategories';
import { toast } from 'sonner';

interface SelectedEmotion {
  id: string;
  intensity: number;
}

interface MoodCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MoodCheckModal({ isOpen, onClose }: MoodCheckModalProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const createEmotionEntry = useCreateEmotionEntry();
  const { getRecommendedTreatment } = useTreatmentCategories();

  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [freeText, setFreeText] = useState('');
  const [step, setStep] = useState<'select' | 'intensity'>('select');

  // Detect dyads based on selected emotions
  const detectedDyads = useMemo(() => {
    const emotionIds = selectedEmotions.map(e => e.id);
    return detectDyads(emotionIds);
  }, [selectedEmotions]);

  // Get recommended treatment from database
  const recommendedTreatment = useMemo(() => {
    if (selectedEmotions.length === 0) return null;
    const emotionIds = selectedEmotions.map(e => e.id);
    const dyadIds = detectedDyads.map(d => d.result);
    return getRecommendedTreatment(emotionIds, dyadIds);
  }, [selectedEmotions, detectedDyads, getRecommendedTreatment]);

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotions(prev => {
      const exists = prev.find(e => e.id === emotionId);
      if (exists) {
        return prev.filter(e => e.id !== emotionId);
      }
      if (prev.length >= 3) {
        toast.info('Você pode selecionar até 3 emoções');
        return prev;
      }
      return [...prev, { id: emotionId, intensity: 3 }];
    });
  };

  const handleIntensityChange = (emotionId: string, intensity: number) => {
    setSelectedEmotions(prev =>
      prev.map(e => (e.id === emotionId ? { ...e, intensity } : e))
    );
  };

  const handleContinue = async () => {
    if (step === 'select' && selectedEmotions.length > 0) {
      setStep('intensity');
      return;
    }

    if (selectedEmotions.length === 0 && !freeText.trim()) {
      toast.error('Selecione pelo menos uma emoção ou escreva como se sente');
      return;
    }

    // Save emotion entry if user is authenticated
    if (user && selectedEmotions.length > 0) {
      try {
        const entry = await createEmotionEntry.mutateAsync({
          selected_emotions: selectedEmotions,
          detected_dyads: detectedDyads,
          recommended_treatment: recommendedTreatment,
          free_text: freeText || undefined,
        });

        onClose();
        navigate('/emotion-result', {
          state: {
            selectedEmotions,
            detectedDyads,
            recommendedTreatment,
            freeText,
            emotionEntryId: entry.id,
          },
        });
      } catch (error) {
        onClose();
        navigate('/emotion-result', {
          state: {
            selectedEmotions,
            detectedDyads,
            recommendedTreatment,
            freeText,
          },
        });
      }
    } else {
      onClose();
      navigate('/emotion-result', {
        state: {
          selectedEmotions,
          detectedDyads,
          recommendedTreatment,
          freeText,
        },
      });
    }
  };

  const handleBack = () => {
    if (step === 'intensity') {
      setStep('select');
    } else {
      onClose();
    }
  };

  const resetAndClose = () => {
    setSelectedEmotions([]);
    setFreeText('');
    setStep('select');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetAndClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal - Bottom Sheet style for mobile */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="relative w-full max-h-[92vh] overflow-hidden bg-card rounded-t-3xl shadow-xl border-t border-border/50"
          >
            {/* Drag indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Header - more compact */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b border-border/30 bg-card">
              <div>
                <h2 className="text-base font-bold text-foreground">
                  {step === 'select' ? 'Como você está?' : 'Ajuste a intensidade'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {step === 'select'
                    ? 'Selecione até 3 emoções'
                    : 'Defina o quanto você sente cada emoção'}
                </p>
              </div>
              <button
                onClick={resetAndClose}
                className="p-2 -mr-1 rounded-full hover:bg-muted transition-colors active:scale-95"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content - scrollable */}
            <div className="overflow-y-auto max-h-[calc(92vh-180px)] px-5 py-4 space-y-4">
              {step === 'select' ? (
                <>
                  <PlutchikWheel
                    selectedEmotions={selectedEmotions}
                    onSelect={handleEmotionSelect}
                  />

                  {/* Free Text Input */}
                  <div className="relative">
                    <PenLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={freeText}
                      onChange={e => setFreeText(e.target.value)}
                      placeholder="Ou descreva como você se sente..."
                      className="pl-11 h-11 rounded-xl bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Intensity Sliders */}
                  <div className="space-y-3">
                    {selectedEmotions.map(selected => {
                      const emotion = primaryEmotions.find(e => e.id === selected.id);
                      if (!emotion) return null;
                      return (
                        <EmotionIntensitySlider
                          key={selected.id}
                          emotion={emotion}
                          value={selected.intensity}
                          onChange={value => handleIntensityChange(selected.id, value)}
                        />
                      );
                    })}
                  </div>

                  {/* Detected Dyads */}
                  {detectedDyads.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        Emoções combinadas detectadas
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {detectedDyads.map(dyad => (
                          <span
                            key={dyad.result}
                            className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                          >
                            {dyad.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Treatment Preview */}
                  {recommendedTreatment && (
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                            Recomendação
                          </p>
                          <p className="text-sm font-semibold text-foreground truncate">
                            {recommendedTreatment.techniques[0]?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer - safe area aware */}
            <div className="sticky bottom-0 px-5 pt-3 pb-5 border-t border-border/30 bg-card safe-bottom space-y-2">
              <Button
                onClick={handleContinue}
                disabled={selectedEmotions.length === 0 && !freeText.trim()}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
              >
                <span>
                  {step === 'select'
                    ? selectedEmotions.length > 0
                      ? 'Ajustar intensidade'
                      : 'Continuar'
                    : 'Ver recomendações'}
                </span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              {step === 'intensity' && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="w-full h-10 text-muted-foreground"
                >
                  Voltar
                </Button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
