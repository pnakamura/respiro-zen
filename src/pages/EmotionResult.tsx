import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Wind, Brain, Sparkles, Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { primaryEmotions, getIntensityLabel, EmotionDyad } from '@/data/plutchik-emotions';
import { TreatmentCategory, techniqueToBreathPattern, BreathingTechnique } from '@/data/emotion-treatments';
import type { EmotionType } from '@/types/breathing';

interface SelectedEmotion {
  id: string;
  intensity: number;
}

interface LocationState {
  selectedEmotions: SelectedEmotion[];
  detectedDyads: EmotionDyad[];
  recommendedTreatment: TreatmentCategory | null;
  freeText: string;
}

export default function EmotionResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  
  const [showBreathPacer, setShowBreathPacer] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);

  // Fallback if no state
  if (!state || state.selectedEmotions.length === 0) {
    return (
      <div className="min-h-[100dvh] flex flex-col bg-background">
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Resultado</h1>
            <div className="w-9" />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Nenhuma emoção selecionada</p>
            <Button onClick={() => navigate('/')}>Voltar ao Início</Button>
          </div>
        </main>
      </div>
    );
  }

  const { selectedEmotions, detectedDyads, recommendedTreatment } = state;

  // Emoção principal (maior intensidade)
  const mainEmotion = [...selectedEmotions].sort((a, b) => b.intensity - a.intensity)[0];
  const mainEmotionData = primaryEmotions.find(e => e.id === mainEmotion.id);

  const handleStartBreathing = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setShowBreathPacer(true);
  };

  const handleStartMeditation = () => {
    setShowMeditation(true);
  };

  const handleSessionComplete = (name: string, duration: number) => {
    setShowBreathPacer(false);
    setShowMeditation(false);
  };

  return (
    <>
      <div className="min-h-[100dvh] flex flex-col bg-background pb-24">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Resultado da Análise</h1>
            <div className="w-9" />
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 px-6 py-6 space-y-8">
          {/* Main Emotion Circle */}
          {mainEmotionData && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-32 h-32 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: mainEmotionData.color }}
              >
                <span className="text-6xl">{mainEmotionData.icon}</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 text-2xl font-bold text-foreground"
              >
                {getIntensityLabel(mainEmotionData, mainEmotion.intensity)}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-sm text-muted-foreground text-center max-w-xs"
              >
                {mainEmotionData.survivalFunction}
              </motion.p>
            </motion.div>
          )}

          {/* Emotion Bars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-medium text-foreground">Emoções Detectadas</h3>
            {selectedEmotions.map((selected, index) => {
              const emotion = primaryEmotions.find(e => e.id === selected.id);
              if (!emotion) return null;
              const percentage = (selected.intensity / 5) * 100;

              return (
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{emotion.icon}</span>
                      <span className="text-foreground">
                        {getIntensityLabel(emotion, selected.intensity)}
                      </span>
                    </div>
                    <span className="text-muted-foreground">{selected.intensity}/5</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                      className="h-full rounded-full"
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
              transition={{ delay: 0.5 }}
              className="p-4 rounded-xl bg-primary/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Emoções Combinadas
                </h3>
              </div>
              <div className="space-y-2">
                {detectedDyads.map(dyad => (
                  <div key={dyad.result} className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{dyad.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {dyad.description}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommendations */}
          {recommendedTreatment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Recomendações para você
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {recommendedTreatment.description}
                </p>
              </div>

              {/* Breathing Techniques */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  Respiração
                </h4>
                {recommendedTreatment.techniques.slice(0, 2).map((technique, index) => (
                  <motion.div
                    key={technique.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="bg-card rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">🌬️</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-foreground">{technique.name}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">{technique.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{technique.cycles} ciclos</span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90"
                      onClick={() => handleStartBreathing(technique)}
                    >
                      <Play className="w-4 h-4 text-primary-foreground" />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Meditations */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Meditação
                </h4>
                {recommendedTreatment.meditations.slice(0, 2).map((meditation, index) => (
                  <motion.div
                    key={meditation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-card rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl">🧘</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-foreground">{meditation.name}</h5>
                      <p className="text-xs text-muted-foreground mt-0.5">{meditation.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{meditation.duration}</span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      className="w-10 h-10 rounded-full bg-primary hover:bg-primary/90"
                      onClick={handleStartMeditation}
                    >
                      <Play className="w-4 h-4 text-primary-foreground" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
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
            onComplete={(duration) => handleSessionComplete(selectedTechnique.name, duration)}
          />
        )}
      </AnimatePresence>

      {/* Meditation Player Overlay */}
      <AnimatePresence>
        {showMeditation && (
          <MeditationPlayer
            key="meditation-player"
            onClose={() => setShowMeditation(false)}
            onComplete={(duration) => handleSessionComplete('Meditação', duration)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
