import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { EmotionCard } from './EmotionCard';
import { BreathPacer } from './BreathPacer';
import { MeditationPlayer } from './MeditationPlayer';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { Emotion, EmotionType } from '@/types/breathing';
import type { BreathingTechnique } from '@/types/admin';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Wind, Sparkles, User, LogOut, Settings } from 'lucide-react';

// Mapeia técnica do banco para o formato Emotion usado pelos componentes
function mapTechniqueToEmotion(technique: BreathingTechnique): Emotion {
  return {
    id: technique.emotion_id as EmotionType,
    label: technique.label,
    description: technique.description || '',
    explanation: technique.explanation || '',
    icon: technique.icon || '💨',
    colorClass: technique.color_class || 'text-primary',
    bgClass: technique.bg_class || 'bg-primary/10',
    pattern: {
      inhale: technique.inhale_ms,
      holdIn: technique.hold_in_ms,
      exhale: technique.exhale_ms,
      holdOut: technique.hold_out_ms,
      name: technique.pattern_name,
      description: technique.pattern_description || '',
      cycles: technique.cycles,
    },
  };
}

// Item de meditação estático (não é uma técnica de respiração)
const meditateEmotion: Emotion = {
  id: 'meditate',
  label: 'Quero Meditar',
  description: 'Meditações guiadas para paz interior',
  explanation: 'A meditação é uma prática milenar que promove calma e clareza mental.',
  icon: '🧘',
  colorClass: 'text-meditate',
  bgClass: 'bg-meditate-light',
  pattern: { inhale: 0, holdIn: 0, exhale: 0, holdOut: 0, name: 'Meditação', description: '', cycles: 0 },
};

interface HomeScreenProps {
  onSessionComplete: (technique: string, duration: number) => void;
}

export function HomeScreen({ onSessionComplete }: HomeScreenProps) {
  const navigate = useNavigate();
  const { user, usuario, signOut } = useAuth();
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [showMeditation, setShowMeditation] = useState(false);
  
  // Busca técnicas do banco de dados
  const { data: techniques, isLoading: loadingTechniques } = useBreathingTechniques();
  
  // Transforma técnicas em emotions e adiciona meditação
  const emotions = useMemo(() => {
    if (!techniques) return [];
    const activeEmotions = techniques
      .filter(t => t.is_active && !t.deleted_at)
      .map(mapTechniqueToEmotion);
    return [...activeEmotions, meditateEmotion];
  }, [techniques]);

  const handleEmotionSelect = (emotion: Emotion) => {
    if (emotion.id === 'meditate') {
      setShowMeditation(true);
    } else {
      setSelectedEmotion(emotion);
    }
  };

  const handleBreathComplete = (durationSeconds: number) => {
    if (selectedEmotion) {
      onSessionComplete(selectedEmotion.pattern.name, durationSeconds);
    }
  };

  const handleMeditationComplete = (durationSeconds: number) => {
    onSessionComplete('Meditação', durationSeconds);
  };

  const handleClose = () => {
    setSelectedEmotion(null);
    setShowMeditation(false);
  };

  // Get first name from nome_completo
  const firstName = usuario?.nome_completo?.split(' ')[0];

  return (
    <div className="min-h-[100dvh] flex flex-col">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="pt-8 px-6 pb-4"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-calm to-calm/70 flex items-center justify-center shadow-lg"
              style={{ boxShadow: '0 0 30px hsl(var(--calm) / 0.4)' }}
            >
              <Wind className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-xl font-bold text-foreground">Respira</h1>
              <p className="text-lg md:text-sm text-muted-foreground">Seu momento de paz</p>
            </div>
          </div>
          
          {/* Auth button */}
          {user ? (
            <div className="flex items-center gap-2">
              {firstName && (
                <span className="text-sm text-muted-foreground hidden sm:block">
                  Olá, {firstName}
                </span>
              )}
              {/* Admin link for socios */}
              {usuario?.tipo_usuario === 'socio' && (
                <Link to="/admin">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    title="Administração"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                className="rounded-full"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/auth')}
              className="rounded-full"
              title="Entrar"
            >
              <User className="w-5 h-5" />
            </Button>
          )}
        </div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 px-6 pb-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-calm" />
            <span className="text-lg md:text-sm font-medium text-calm">
              {firstName ? `Olá, ${firstName}!` : 'Olá!'}
            </span>
          </div>
          <h2 className="text-4xl md:text-2xl font-bold text-foreground leading-tight">
            Como você está se sentindo agora?
          </h2>
          <p className="text-xl md:text-base text-muted-foreground mt-3">
            Escolha o que mais representa seu estado atual
          </p>
        </motion.div>

        {/* Emotion cards */}
        <div className="space-y-4">
          {loadingTechniques ? (
            // Loading state
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))
          ) : (
            emotions.map((emotion, index) => (
              <EmotionCard
                key={emotion.id}
                emotion={emotion}
                onClick={() => handleEmotionSelect(emotion)}
                index={index}
              />
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="px-6 py-4 text-center safe-bottom"
      >
        <p className="text-base md:text-xs text-muted-foreground">
          Respire. Relaxe. Renove.
        </p>
      </motion.footer>

      {/* Overlays */}
      <AnimatePresence>
        {selectedEmotion && (
          <BreathPacer
            key="breath-pacer"
            pattern={selectedEmotion.pattern}
            emotionType={selectedEmotion.id as EmotionType}
            explanation={selectedEmotion.explanation}
            onClose={handleClose}
            onComplete={handleBreathComplete}
          />
        )}
        
        {showMeditation && (
          <MeditationPlayer
            key="meditation-player"
            onClose={handleClose}
            onComplete={handleMeditationComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
