import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PenLine } from 'lucide-react';
import { PlutchikWheel } from '@/components/emotions/PlutchikWheel';
import { EmotionIntensitySlider } from '@/components/emotions/EmotionIntensitySlider';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
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
  const { usuario } = useAuth();
  const { data: techniques } = useBreathingTechniques();
  
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

  const handleContinue = () => {
    if (selectedEmotions.length === 0 && !freeText.trim()) {
      toast.error('Selecione pelo menos uma emoção ou escreva como se sente');
      return;
    }
    
    navigate('/emotion-result', { 
      state: { 
        selectedEmotions,
        detectedDyads,
        recommendedTreatment,
        freeText 
      } 
    });
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
    <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-base font-medium text-primary">
            {firstName ? `Olá, ${firstName}!` : 'Olá!'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-6">
        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Como você está se sentindo agora?
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Selecione até 3 emoções que representam seu estado atual
          </p>
        </motion.div>

        {/* Plutchik Wheel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              className="space-y-3"
            >
              <h3 className="text-sm font-medium text-muted-foreground">
                Ajuste a intensidade:
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
              className="p-4 rounded-xl bg-primary/10 border border-primary/20"
            >
              <p className="text-sm text-muted-foreground mb-2">
                Emoções combinadas detectadas:
              </p>
              <div className="flex flex-wrap gap-2">
                {detectedDyads.map(dyad => (
                  <span
                    key={dyad.result}
                    className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium"
                  >
                    {dyad.label}
                  </span>
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
            placeholder="Ou escreva como você se sente..."
            className="pl-10 h-12 rounded-xl bg-card border-border text-foreground placeholder:text-muted-foreground"
          />
        </motion.div>

        {/* Tratamento Recomendado Preview */}
        <AnimatePresence>
          {recommendedTreatment && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl bg-muted/50"
            >
              <p className="text-xs text-muted-foreground mb-1">
                Recomendação baseada no seu estado:
              </p>
              <p className="text-sm font-medium text-foreground">
                {recommendedTreatment.label}: {recommendedTreatment.techniques[0]?.name}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleContinue}
            disabled={selectedEmotions.length === 0 && !freeText.trim()}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base"
          >
            Continuar
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
