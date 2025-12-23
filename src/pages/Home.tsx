import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, PenLine } from 'lucide-react';
import { EmotionGrid } from '@/components/emotions/EmotionGrid';
import { IntensitySlider } from '@/components/emotions/IntensitySlider';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { toast } from 'sonner';
import type { EmotionType } from '@/types/breathing';

export default function Home() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { data: techniques } = useBreathingTechniques();
  
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(3);
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
  // Capitalize first letter
  const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

  const handleEmotionSelect = (emotionId: string) => {
    setSelectedEmotions(prev => {
      if (prev.includes(emotionId)) {
        return prev.filter(id => id !== emotionId);
      }
      return [...prev, emotionId];
    });
  };

  const handleContinue = () => {
    if (selectedEmotions.length === 0 && !freeText.trim()) {
      toast.error('Selecione pelo menos uma emoção ou escreva como se sente');
      return;
    }
    
    // Map emotions to a main emotion for recommendations
    const mainEmotion = selectedEmotions[0] || 'reflexivo';
    const emotionMap: Record<string, { emotion: string; emoji: string }> = {
      alegria: { emotion: 'Alegria', emoji: '😊' },
      tristeza: { emotion: 'Tristeza', emoji: '😢' },
      raiva: { emotion: 'Raiva', emoji: '😠' },
      medo: { emotion: 'Ansiedade', emoji: '😰' },
      surpresa: { emotion: 'Surpresa', emoji: '😮' },
      nojo: { emotion: 'Desconforto', emoji: '🤢' },
    };
    
    const result = emotionMap[mainEmotion] || { emotion: 'Reflexivo', emoji: '🤔' };
    
    navigate('/emotion-result', { 
      state: { 
        mainEmotion: result.emotion, 
        mainEmoji: result.emoji,
        selectedEmotions,
        intensity,
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

  // Get first technique for breathing demo
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
            Selecione as emoções que representam seu estado atual
          </p>
        </motion.div>

        {/* Emotion Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EmotionGrid
            selectedEmotions={selectedEmotions}
            onSelect={handleEmotionSelect}
          />
        </motion.div>

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

        {/* Intensity Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-4"
        >
          <IntensitySlider value={intensity} onChange={setIntensity} />
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={handleContinue}
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
