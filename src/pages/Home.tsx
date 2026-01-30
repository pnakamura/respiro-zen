import { useState, useEffect } from 'react';
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
  LogOut,
  Settings,
  Leaf,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BottomNavigation } from '@/components/BottomNavigation';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { QuickActionCard } from '@/components/dashboard/QuickActionCard';
import { DailyGuidanceCard } from '@/components/dashboard/DailyGuidanceCard';
import { GardenWidget } from '@/components/dashboard/GardenWidget';
import { ContextualHelp } from '@/components/ui/ContextualHelp';
import { MoodCheckModal } from '@/components/dashboard/MoodCheckModal';
import { BreathingTechniqueSelector } from '@/components/dashboard/BreathingTechniqueSelector';
import { MealCheckModal } from '@/components/nutrition/MealCheckModal';
import { ActiveJourneyBanner } from '@/components/journeys/ActiveJourneyBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { useActiveUserJourney } from '@/hooks/useUserJourney';
import { useOnboarding } from '@/hooks/useOnboarding';
import { toast } from 'sonner';
import type { EmotionType } from '@/types/breathing';

// Type for breathing technique from DB
type BreathingTechnique = NonNullable<ReturnType<typeof useBreathingTechniques>['data']>[number];

export default function Home() {
  const navigate = useNavigate();
  const { usuario, loading: authLoading, signOut } = useAuth();
  const { data: activeJourney } = useActiveUserJourney();
  const { isComplete: onboardingComplete, isLoading: onboardingLoading } = useOnboarding();

  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showBreathingSelector, setShowBreathingSelector] = useState(false);
  const [showBreathPacer, setShowBreathPacer] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);

  // Redirect to onboarding if not logged in and not completed
  useEffect(() => {
    if (!authLoading && !onboardingLoading && !usuario && !onboardingComplete) {
      navigate('/onboarding', { replace: true });
    }
  }, [authLoading, onboardingLoading, usuario, onboardingComplete, navigate]);

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
      description: `Você praticou por ${timeStr}. Continue assim! 🌿`,
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
  const handleAnimationStudio = () => navigate('/animation-studio');

  return (
    <div className="min-h-[100dvh] flex flex-col pb-32 bg-gradient-to-br from-cream-50 via-sage-50/30 to-earth-50/20 relative overflow-hidden">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative organic background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(125, 143, 125, 0.12) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 -left-32 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 139, 108, 0.1) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 12, repeat: Infinity, delay: 2, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-1/4 right-0 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(95, 115, 95, 0.08) 0%, transparent 60%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 4, ease: 'easeInOut' }}
        />
      </div>

      {/* Header - improved for mobile */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative pt-6 px-5 pb-4 z-10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center border border-sage-300/30 shadow-[0_8px_24px_rgba(95,115,95,0.15)]"
              style={{
                background: 'linear-gradient(135deg, rgba(125, 143, 125, 0.15) 0%, rgba(95, 115, 95, 0.1) 100%)'
              }}
            >
              <Leaf className="w-7 h-7 text-sage-600" />
            </motion.div>
            <div>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-display font-medium text-sage-900"
              >
                {greeting}{firstName ? `, ${firstName}` : ''}!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="text-sm font-body text-sage-600"
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
                className="gap-2 h-11 px-4 text-sm font-body font-medium border-sage-300/50 hover:bg-sage-50/50 text-sage-700 rounded-2xl"
              >
                <LogIn className="w-5 h-5" />
                Entrar
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                {usuario.tipo_usuario === 'socio' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/admin')}
                    className="w-11 h-11 rounded-2xl bg-sage-50/50 border border-sage-200/50 shadow-sm hover:bg-sage-100/50"
                  >
                    <Settings className="w-5 h-5 text-sage-700" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  className="gap-2 h-11 px-4 text-sm font-body font-medium text-earth-700 border-earth-300/50 hover:bg-earth-50/50 rounded-2xl"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-5 space-y-5 relative z-10">
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

        {/* Garden Widget - Gamification */}
        <GardenWidget />

        {/* Quick Actions Grid - 2x3 with Journeys included */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-body font-semibold text-sage-600 flex items-center gap-2 uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
              Ações rápidas
            </h2>
            <ContextualHelp helpKey="quick-actions" size="sm" variant="subtle" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <QuickActionCard
              emoji="😊"
              icon={Smile}
              label="Emoções"
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
            <QuickActionCard
              emoji="📊"
              icon={BarChart3}
              label="Insights"
              color="secondary"
              onClick={handleInsights}
              delay={0.4}
            />
            <QuickActionCard
              emoji="✨"
              icon={Wand2}
              label="Studio"
              color="studio"
              onClick={handleAnimationStudio}
              delay={0.45}
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
          className="fixed bottom-28 right-5 w-14 h-14 rounded-2xl shadow-[0_8px_24px_rgba(95,115,95,0.25)] flex items-center justify-center z-40 active:shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #7d8f7d 0%, #5f735f 100%)'
          }}
        >
          <Plus className="w-6 h-6 text-cream-50" />
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
