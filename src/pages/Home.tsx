import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PenLine, ArrowRight, Heart } from 'lucide-react';
import { PlutchikWheel } from '@/components/emotions/PlutchikWheel';
import { EmotionIntensitySlider } from '@/components/emotions/EmotionIntensitySlider';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { useCreateEmotionEntry } from '@/hooks/useEmotionEntries';
import { primaryEmotions, detectDyads } from '@/data/plutchik-emotions';
import { getRecommendedTreatment } from '@/data/emotion-treatments';
import { toast } from 'sonner';
import type { EmotionType } from '@/types/breathing';

interface SelectedEmotion {
  id: string;
  intensity: number;
}

export default function Home() {
  const navigate = useNavigate();
  const { usuario, user } = useAuth();
  const { data: techniques } = useBreathingTechniques();
  const createEmotionEntry = useCreateEmotionEntry();
  
  const [selectedEmotions, setSelectedEmotions] = useState<SelectedEmotion[]>([]);
  const [freeText, setFreeText] = useState('');
  const [showBreathPacer, setShowBreathPacer] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  
  const firstName = usuario?.nome_completo?.split(' ')[0];
  
  // Get current date in Portuguese
  const today = new Date();
  const dateString = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  // Greeting based on time
  const hour = today.getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  // Detectar díades baseado nas emoções selecionadas
  const detectedDyads = useMemo(() => {
    const emotionIds = selectedEmotions.map(e => e.id);
    return detectDyads(emotionIds);
  }, [selectedEmotions]);

  // Obter tratamento recomendado
  const recommendedTreatment = useMemo(() => {
    if (selectedEmotions.length === 0) return null;
    const emotionIds = selectedEmotions.map(e => e.id);
    const dyadIds = detectedDyads.map(d => d.result);
    return getRecommendedTreatment(emotionIds, dyadIds);
  }, [selectedEmotions, detectedDyads]);

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
          recommended_treatment: recommendedTreatment as unknown as Record<string, unknown> | null,
          free_text: freeText || undefined,
        });
        
        navigate('/emotion-result', { 
          state: { 
            selectedEmotions,
            detectedDyads,
            recommendedTreatment,
            freeText,
            emotionEntryId: entry.id,
          } 
        });
      } catch (error) {
        // Navigate anyway even if save fails
        navigate('/emotion-result', { 
          state: { 
            selectedEmotions,
            detectedDyads,
            recommendedTreatment,
            freeText 
          } 
        });
      }
    } else {
      navigate('/emotion-result', { 
        state: { 
          selectedEmotions,
          detectedDyads,
          recommendedTreatment,
          freeText 
        } 
      });
    }
  };

  const handleSessionComplete = (technique: string, duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeStr = minutes > 0 ? `${minutes}min ${seconds}s` : `${seconds}s`;

    toast.success(`${technique} concluída!`, {
      description: `Você praticou por ${timeStr}. Continue assim! 🌟`,
      duration: 5000,
    });
    
    setShowBreathPacer(false);
    setShowMeditation(false);
  };

  const firstTechnique = techniques?.[0];

  return (
    <div className="min-h-[100dvh] flex flex-col pb-28">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative pt-8 px-6 pb-4"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"
            >
              <Heart className="w-5 h-5 text-primary" fill="currentColor" />
            </motion.div>
            <div>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-base font-semibold text-foreground"
              >
                {greeting}{firstName ? `, ${firstName}` : ''}!
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-xs text-muted-foreground"
              >
                {formattedDate}
              </motion.p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="w-10 h-10 rounded-full glass-card flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-6 relative">
        {/* Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-elevated p-5"
        >
          <h1 className="text-xl font-bold text-foreground leading-snug">
            Como você está se sentindo agora?
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Selecione as emoções que representam seu estado atual
          </p>
        </motion.div>

        {/* Plutchik Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <PlutchikWheel
            selectedEmotions={selectedEmotions}
            onSelect={handleEmotionSelect}
          />
        </motion.div>

        {/* Intensity Sliders for Selected Emotions */}
        <AnimatePresence mode="popLayout">
          {selectedEmotions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card-elevated p-5 space-y-4"
            >
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                Ajuste a intensidade
              </h3>
              {selectedEmotions.map(selected => {
                const emotion = primaryEmotions.find(e => e.id === selected.id);
                if (!emotion) return null;
                return (
                  <EmotionIntensitySlider
                    key={selected.id}
                    emotion={emotion}
                    value={selected.intensity}
                    onChange={(value) => handleIntensityChange(selected.id, value)}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Díades Detectadas */}
        <AnimatePresence>
          {detectedDyads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-elevated p-4 border-l-4 border-l-primary"
            >
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Emoções combinadas detectadas
              </p>
              <div className="flex flex-wrap gap-2">
                {detectedDyads.map(dyad => (
                  <motion.span
                    key={dyad.result}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold"
                  >
                    {dyad.label}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Free Text Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <PenLine className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Ou descreva como você se sente..."
            className="pl-11 h-14 rounded-2xl bg-card border-border/50 text-foreground placeholder:text-muted-foreground input-premium text-sm"
          />
        </motion.div>

        {/* Tratamento Recomendado Preview */}
        <AnimatePresence>
          {recommendedTreatment && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="card-elevated p-4 bg-gradient-to-r from-primary/5 to-secondary/5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">
                    Recomendação para você
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {recommendedTreatment.techniques[0]?.name}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-2 pb-4"
        >
          <Button
            onClick={handleContinue}
            disabled={selectedEmotions.length === 0 && !freeText.trim()}
            className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base shadow-lg shadow-primary/20 btn-glow group transition-all duration-300 disabled:opacity-50 disabled:shadow-none"
          >
            <span>Continuar</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </main>

      <BottomNavigation />

      {/* Overlays */}
      <AnimatePresence>
        {showBreathPacer && firstTechnique && (
          <BreathPacer
            key="breath-pacer"
            pattern={{
              inhale: firstTechnique.inhale_ms,
              holdIn: firstTechnique.hold_in_ms,
              exhale: firstTechnique.exhale_ms,
              holdOut: firstTechnique.hold_out_ms,
              name: firstTechnique.pattern_name,
              description: firstTechnique.pattern_description || '',
              cycles: firstTechnique.cycles,
            }}
            emotionType={firstTechnique.emotion_id as EmotionType}
            explanation={firstTechnique.explanation || ''}
            colorClass={firstTechnique.color_class || 'text-primary'}
            bgClass={firstTechnique.bg_class || 'bg-primary/10'}
            backgroundAudioUrl={firstTechnique.background_audio_url}
            onClose={() => setShowBreathPacer(false)}
            onComplete={(duration) => handleSessionComplete(firstTechnique.pattern_name, duration)}
          />
        )}
        
        {showMeditation && (
          <MeditationPlayer
            key="meditation-player"
            onClose={() => setShowMeditation(false)}
            onComplete={(duration) => handleSessionComplete('Meditação', duration)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
