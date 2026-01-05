import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Smile, 
  Wind, 
  BookOpen, 
  BarChart3, 
  Heart,
  Plus,
  Sparkles,
  Headphones,
  Utensils,
  Compass,
  LogIn,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { DailyGuidanceCard } from '@/components/dashboard/DailyGuidanceCard';
import { StreakWidget } from '@/components/dashboard/StreakWidget';
import { MoodCheckModal } from '@/components/dashboard/MoodCheckModal';
import { BreathingTechniqueSelector } from '@/components/dashboard/BreathingTechniqueSelector';
import { MealCheckModal } from '@/components/nutrition/MealCheckModal';
import { ActiveJourneyBanner } from '@/components/journeys/ActiveJourneyBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { useGamificationStats } from '@/hooks/useGamificationStats';
import { useActiveUserJourney } from '@/hooks/useUserJourney';
import { toast } from 'sonner';
import type { EmotionType } from '@/types/breathing';

// Type for breathing technique from DB
type BreathingTechnique = NonNullable<ReturnType<typeof useBreathingTechniques>['data']>[number];

export default function Home() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const { data: gamificationStats, isLoading: isLoadingStats } = useGamificationStats();
  const { data: activeJourney } = useActiveUserJourney();
  
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showBreathingSelector, setShowBreathingSelector] = useState(false);
  const [showBreathPacer, setShowBreathPacer] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  
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
    setSelectedTechnique(null);
  };

  const handleTechniqueSelect = (technique: BreathingTechnique) => {
    setSelectedTechnique(technique);
    setShowBreathingSelector(false);
    setShowBreathPacer(true);
  };

  // Quick Actions handlers
  const handleMoodCheck = () => setShowMoodModal(true);
  const handleBreathing = () => setShowBreathingSelector(true);
  const handleMeditation = () => setShowMeditation(true);
  const handleNutrition = () => setShowMealModal(true);
  const handleJournal = () => navigate('/journal');
  const handleInsights = () => navigate('/insights');
  const handleJourneys = () => navigate('/journeys');

  return (
    <div className="min-h-[100dvh] flex flex-col pb-32">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header - improved for mobile */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative pt-6 px-5 pb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10"
            >
              <Heart className="w-7 h-7 text-primary" fill="currentColor" />
            </motion.div>
            <div>
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-foreground"
              >
                {greeting}{firstName ? `, ${firstName}` : ''}!
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-sm text-muted-foreground"
              >
                {formattedDate}
              </motion.p>
            </div>
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="flex items-center gap-2"
          >
            {!usuario ? (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/auth')}
                className="gap-2 h-11 px-4 text-sm font-semibold"
              >
                <LogIn className="w-5 h-5" />
                Entrar
              </Button>
            ) : usuario.tipo_usuario === 'socio' && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/admin')}
                className="w-11 h-11 rounded-xl bg-card border border-border/50 shadow-md"
              >
                <Settings className="w-5 h-5 text-primary" />
              </Button>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-5 space-y-5 relative">
        {/* Active Journey Banner */}
        {activeJourney && (
          <ActiveJourneyBanner
            journeyTitle={activeJourney.journey.title}
            journeyIcon={activeJourney.journey.icon}
            currentDay={activeJourney.current_day}
            totalDays={activeJourney.journey.duration_days}
            streak={activeJourney.streak_count}
            themeColor={activeJourney.journey.theme_color}
            onClick={handleJourneys}
          />
        )}

        {/* Streak Widget */}
        <StreakWidget
          currentStreak={gamificationStats?.sequencia_atual ?? 0}
          bestStreak={gamificationStats?.melhor_sequencia ?? 0}
          level={gamificationStats?.nivel ?? 1}
          totalPoints={gamificationStats?.total_pontos ?? 0}
          isLoading={isLoadingStats}
        />

        {/* Quick Actions Grid - 2x3 with Journeys included */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Ações rápidas
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <QuickActionCard
              emoji="😊"
              icon={Smile}
              label="Humor"
              color="joy"
              onClick={handleMoodCheck}
              delay={0.1}
            />
            <QuickActionCard
              emoji="🧘"
              icon={Wind}
              label="Respirar"
              color="calm"
              onClick={handleBreathing}
              delay={0.15}
            />
            <QuickActionCard
              emoji="🎧"
              icon={Headphones}
              label="Meditar"
              color="meditate"
              onClick={handleMeditation}
              delay={0.2}
            />
            <QuickActionCard
              emoji="🧭"
              icon={Compass}
              label="Jornadas"
              color="journey"
              onClick={handleJourneys}
              delay={0.25}
            />
            <QuickActionCard
              emoji="📔"
              icon={BookOpen}
              label="Diário"
              color="trust"
              onClick={handleJournal}
              delay={0.3}
            />
            <QuickActionCard
              emoji="🍽️"
              icon={Utensils}
              label="Nutrição"
              color="nutrition"
              onClick={handleNutrition}
              delay={0.35}
            />
          </div>
        </motion.div>

        {/* Daily Guidance Card */}
        <DailyGuidanceCard 
          onGuideClick={() => navigate('/guide')}
        />

        {/* Floating Action Button - repositioned for thumb zone */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleMoodCheck}
          className="fixed bottom-28 right-5 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl shadow-primary/25 flex items-center justify-center z-40 active:shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </main>

      <BottomNavigation />

      {/* Mood Check Modal */}
      <MoodCheckModal 
        isOpen={showMoodModal} 
        onClose={() => setShowMoodModal(false)} 
      />

      {/* Meal Check Modal */}
      <MealCheckModal
        isOpen={showMealModal}
        onClose={() => setShowMealModal(false)}
        onSuggestBreathing={() => {
          setShowMealModal(false);
          setShowBreathingSelector(true);
        }}
      />

      {/* Breathing Technique Selector */}
      <BreathingTechniqueSelector
        isOpen={showBreathingSelector}
        onClose={() => setShowBreathingSelector(false)}
        onSelect={handleTechniqueSelect}
      />

      {/* Overlays */}
      <AnimatePresence>
        {showBreathPacer && selectedTechnique && (
          <BreathPacer
            key="breath-pacer"
            pattern={{
              inhale: selectedTechnique.inhale_ms,
              holdIn: selectedTechnique.hold_in_ms,
              exhale: selectedTechnique.exhale_ms,
              holdOut: selectedTechnique.hold_out_ms,
              name: selectedTechnique.pattern_name,
              description: selectedTechnique.pattern_description || '',
              cycles: selectedTechnique.cycles,
            }}
            emotionType={selectedTechnique.emotion_id as EmotionType}
            explanation={selectedTechnique.explanation || ''}
            colorClass={selectedTechnique.color_class || 'text-primary'}
            bgClass={selectedTechnique.bg_class || 'bg-primary/10'}
            backgroundAudioUrl={selectedTechnique.background_audio_url}
            onClose={() => setShowBreathPacer(false)}
            onComplete={(duration) => handleSessionComplete(selectedTechnique.pattern_name, duration)}
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
