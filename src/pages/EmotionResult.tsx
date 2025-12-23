import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wind, Brain, Sparkles, Play, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateBreathingSession } from '@/hooks/useBreathingSessions';
import { primaryEmotions, getIntensityLabel, EmotionDyad } from '@/data/plutchik-emotions';
import { TreatmentCategory, techniqueToBreathPattern, BreathingTechnique } from '@/data/emotion-treatments';
import type { EmotionType } from '@/types/breathing';
import { toast } from 'sonner';

interface SelectedEmotion {
  id: string;
  intensity: number;
}

interface LocationState {
  selectedEmotions: SelectedEmotion[];
  detectedDyads: EmotionDyad[];
  recommendedTreatment: TreatmentCategory | null;
  freeText: string;
  emotionEntryId?: string;
}

export default function EmotionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const createBreathingSession = useCreateBreathingSession();
  const state = location.state as LocationState | null;
  
  const [showBreathPacer, setShowBreathPacer] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);

  // Fallback if no state
  if (!state || state.selectedEmotions.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col">
        <header className="sticky top-0 z-40 glass">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Resultado</h1>
            <div className="w-9" />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Nenhuma emoção selecionada</p>
            <Button onClick={() => navigate('/')} className="rounded-xl">
              Voltar ao Início
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const { selectedEmotions, detectedDyads, recommendedTreatment, emotionEntryId } = state;

  // Emoção principal (maior intensidade)
  const mainEmotion = [...selectedEmotions].sort((a, b) => b.intensity - a.intensity)[0];
  const mainEmotionData = primaryEmotions.find(e => e.id === mainEmotion.id);

  const handleStartBreathing = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setSessionStartTime(Date.now());
    setShowBreathPacer(true);
  };

  const handleStartMeditation = () => {
    setSessionStartTime(Date.now());
    setShowMeditation(true);
  };

  const handleBreathingComplete = async (cycles: number) => {
    const durationMs = Date.now() - sessionStartTime;
    
    if (user && selectedTechnique) {
      try {
        await createBreathingSession.mutateAsync({
          technique_name: selectedTechnique.name,
          emotion_entry_id: emotionEntryId,
          cycles_completed: cycles,
          duration_ms: durationMs,
        });
      } catch (error) {
        console.error('Failed to save breathing session:', error);
      }
    }
    
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const timeStr = minutes > 0 ? `${minutes}min ${seconds}s` : `${seconds}s`;
    
    toast.success(`${selectedTechnique?.name} concluída!`, {
      description: `Você praticou ${cycles} ciclos em ${timeStr}. Continue assim! 🌟`,
      duration: 5000,
    });
    
    setShowBreathPacer(false);
  };

  const handleMeditationComplete = async () => {
    const durationMs = Date.now() - sessionStartTime;
    
    if (user) {
      try {
        await createBreathingSession.mutateAsync({
          technique_name: 'Meditação Guiada',
          emotion_entry_id: emotionEntryId,
          cycles_completed: 1,
          duration_ms: durationMs,
        });
      } catch (error) {
        console.error('Failed to save meditation session:', error);
      }
    }
    
    toast.success('Meditação concluída!', {
      description: 'Momento de paz registrado. 🧘',
      duration: 5000,
    });
    
    setShowMeditation(false);
  };

  const handleSaveToDiary = () => {
    navigate('/journal');
  };

  return (
    <>
      <div className="min-h-[100dvh] flex flex-col pb-28">
        {/* Decorative background */}
        {mainEmotionData && (
          <div 
            className="fixed inset-0 pointer-events-none opacity-30"
            style={{
              background: `radial-gradient(ellipse at 50% 0%, ${mainEmotionData.color}20 0%, transparent 50%)`
            }}
          />
        )}

        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 glass"
        >
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Sua Análise</h1>
            <div className="w-9" />
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-6 space-y-6">
          {/* Main Emotion Hero */}
          {mainEmotionData && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center text-center"
            >
              {/* Animated circle */}
              <div className="relative">
                <motion.div
                  className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{ backgroundColor: mainEmotionData.color }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative w-28 h-28 rounded-full flex items-center justify-center shadow-xl"
                  style={{ backgroundColor: mainEmotionData.color }}
                >
                  <span className="text-5xl">{mainEmotionData.icon}</span>
                </motion.div>
              </div>
              
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-5 text-2xl font-bold text-foreground"
              >
                {getIntensityLabel(mainEmotionData, mainEmotion.intensity)}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-2 text-sm text-muted-foreground max-w-xs"
              >
                {mainEmotionData.survivalFunction}
              </motion.p>
            </motion.div>
          )}

          {/* Emotion Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card-elevated p-5 space-y-4"
          >
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Emoções Detectadas
            </h3>
            {selectedEmotions.map((selected, index) => {
              const emotion = primaryEmotions.find(e => e.id === selected.id);
              if (!emotion) return null;
              const percentage = (selected.intensity / 5) * 100;

              return (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.08 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emotion.icon}</span>
                      <span className="font-medium text-foreground">
                        {getIntensityLabel(emotion, selected.intensity)}
                      </span>
                    </div>
                    <span className="text-muted-foreground font-medium">{selected.intensity}/5</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.45 + index * 0.08, duration: 0.6, ease: "easeOut" }}
                      className="progress-fill"
                      style={{ backgroundColor: emotion.color }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Díades Detectadas */}
          {detectedDyads && detectedDyads.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card-elevated p-5 border-l-4 border-l-secondary"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Emoções Combinadas
                </h3>
              </div>
              <div className="space-y-3">
                {detectedDyads.map((dyad, index) => (
                  <motion.div 
                    key={dyad.result} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    className="flex justify-between items-center py-2 border-b border-border/50 last:border-0"
                  >
                    <span className="font-semibold text-foreground">{dyad.label}</span>
                    <span className="text-xs text-muted-foreground max-w-[60%] text-right">
                      {dyad.description}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {recommendedTreatment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Recomendações
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {recommendedTreatment.description}
                  </p>
                </div>
              </div>

              {/* Breathing Techniques */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wind className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">Respiração</h4>
                </div>
                {recommendedTreatment.techniques.slice(0, 2).map((technique, index) => (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.08 }}
                    onClick={() => handleStartBreathing(technique)}
                    className="card-elevated p-4 flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-3xl">🌬️</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-foreground">{technique.name}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {technique.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{technique.cycles} ciclos</span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      className="w-12 h-12 rounded-2xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform"
                    >
                      <Play className="w-5 h-5 text-primary-foreground" fill="currentColor" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Meditations */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-meditate/10 flex items-center justify-center">
                    <Brain className="w-4 h-4 text-meditate" />
                  </div>
                  <h4 className="text-sm font-semibold text-foreground">Meditação</h4>
                </div>
                {recommendedTreatment.meditations.slice(0, 2).map((meditation, index) => (
                  <motion.div
                    key={meditation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.08 }}
                    onClick={handleStartMeditation}
                    className="card-elevated p-4 flex items-center gap-4 cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-meditate/20 to-meditate/5 flex items-center justify-center">
                      <span className="text-3xl">🧘</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-foreground">{meditation.name}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {meditation.description}
                      </p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{meditation.duration}</span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      className="w-12 h-12 rounded-2xl bg-meditate hover:bg-meditate/90 shadow-md shadow-meditate/20 group-hover:scale-105 transition-transform"
                    >
                      <Play className="w-5 h-5 text-primary-foreground" fill="currentColor" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Save Entry CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-2"
          >
            <Button
              variant="outline"
              onClick={handleSaveToDiary}
              className="w-full h-12 rounded-2xl border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              Salvar no Diário
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </main>

        <BottomNavigation />
      </div>

      {/* Breath Pacer Overlay */}
      <AnimatePresence>
        {showBreathPacer && selectedTechnique && mainEmotionData && (
          <BreathPacer
            key="breath-pacer"
            pattern={techniqueToBreathPattern(selectedTechnique)}
            emotionType={mainEmotion.id as EmotionType}
            explanation={selectedTechnique.evidence}
            colorClass="text-primary"
            bgClass="bg-primary/10"
            onClose={() => setShowBreathPacer(false)}
            onComplete={(duration) => handleBreathingComplete(selectedTechnique.cycles)}
          />
        )}
      </AnimatePresence>

      {/* Meditation Player Overlay */}
      <AnimatePresence>
        {showMeditation && (
          <MeditationPlayer
            key="meditation-player"
            onClose={() => setShowMeditation(false)}
            onComplete={() => handleMeditationComplete()}
          />
        )}
      </AnimatePresence>
    </>
  );
}
