import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, ChevronLeft, Sparkles, ArrowRight, BookOpen, Target, CheckCircle2, HelpCircle } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { JourneyCard } from '@/components/journeys/JourneyCard';
import { JourneyDetails } from '@/components/journeys/JourneyDetails';
import { JourneyDayContent } from '@/components/journeys/JourneyDayContent';
import { JourneyProgress } from '@/components/journeys/JourneyProgress';
import { JourneyCompletionCelebration } from '@/components/journeys/JourneyCompletionCelebration';
import { BreathPacer } from '@/components/BreathPacer';
import { MeditationPlayer } from '@/components/MeditationPlayer';
import { ContextualHelp } from '@/components/ui/ContextualHelp';
import { useJourneys, useJourneyDays, type Journey } from '@/hooks/useJourneys';
import { 
  useActiveUserJourney, 
  useUserJourneys, 
  useJourneyCompletions,
  useStartJourney, 
  useCompleteDay,
  useCompleteJourney,
} from '@/hooks/useUserJourney';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { useCreateBreathingSession } from '@/hooks/useBreathingSessions';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { BreathingTechnique } from '@/types/admin';

export default function Journeys() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: journeys, isLoading: isLoadingJourneys } = useJourneys();
  const { data: activeJourney } = useActiveUserJourney();
  const { data: userJourneys } = useUserJourneys();
  const { data: activeJourneyDays } = useJourneyDays(activeJourney?.journey_id);
  const { data: completions } = useJourneyCompletions(activeJourney?.id);
  
  const startJourneyMutation = useStartJourney();
  const completeDayMutation = useCompleteDay();
  const completeJourneyMutation = useCompleteJourney();

  const { data: breathingTechniques } = useBreathingTechniques();
  const createBreathingSession = useCreateBreathingSession();

  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDayContent, setShowDayContent] = useState(false);
  const [currentViewingDay, setCurrentViewingDay] = useState<number>(1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showBreathPacer, setShowBreathPacer] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique | null>(null);
  const [breathingStartTime, setBreathingStartTime] = useState<number>(0);
  const [selectedMeditationId, setSelectedMeditationId] = useState<string | null>(null);

  const { data: selectedJourneyDays } = useJourneyDays(selectedJourney?.id);

  const completedDayNumbers = completions?.map(c => c.day_number) || [];

  const handleJourneyClick = (journey: Journey) => {
    setSelectedJourney(journey);
    setShowDetails(true);
  };

  const handleStartJourney = async () => {
    if (!selectedJourney || !user) {
      toast.error('Faça login para iniciar uma jornada');
      return;
    }

    try {
      await startJourneyMutation.mutateAsync(selectedJourney.id);
      toast.success(`Jornada "${selectedJourney.title}" iniciada!`);
      setShowDetails(false);
      setSelectedJourney(null);
    } catch (error) {
      toast.error('Erro ao iniciar jornada');
    }
  };

  const handleDayClick = (day: number) => {
    setCurrentViewingDay(day);
    setShowDayContent(true);
  };

  const handleCompleteDay = async (reflection?: string) => {
    if (!activeJourney || !activeJourneyDays) return;

    try {
      await completeDayMutation.mutateAsync({
        userJourneyId: activeJourney.id,
        dayNumber: currentViewingDay,
        reflectionNote: reflection,
        teachingRead: true,
      });

      // Check if journey is complete
      if (currentViewingDay >= activeJourney.journey.duration_days) {
        await completeJourneyMutation.mutateAsync(activeJourney.id);
        setShowDayContent(false);
        setShowCelebration(true);
      } else {
        toast.success(`Dia ${currentViewingDay} concluído! 🌟`);
        setShowDayContent(false);
      }
    } catch (error) {
      toast.error('Erro ao salvar progresso');
    }
  };

  const handleOpenBreathing = (breathingId: string) => {
    const technique = breathingTechniques?.find(t => t.id === breathingId);
    if (technique) {
      setSelectedTechnique(technique);
      setBreathingStartTime(Date.now());
      setShowDayContent(false);
      setShowBreathPacer(true);
    } else {
      toast.error('Técnica de respiração não encontrada');
    }
  };

  const handleOpenMeditation = (meditationId: string) => {
    setSelectedMeditationId(meditationId);
    setShowDayContent(false);
    setShowMeditation(true);
  };

  const handleBreathingComplete = () => {
    if (selectedTechnique) {
      const durationMs = Date.now() - breathingStartTime;
      createBreathingSession.mutate({
        technique_name: selectedTechnique.pattern_name,
        technique_id: selectedTechnique.id,
        duration_ms: durationMs,
        cycles_completed: selectedTechnique.cycles,
      });
    }
    setShowBreathPacer(false);
    setSelectedTechnique(null);
  };

  const handleMeditationComplete = () => {
    setShowMeditation(false);
    setSelectedMeditationId(null);
    toast.success('Meditação concluída!');
  };

  const currentDay = activeJourneyDays?.find(d => d.day_number === currentViewingDay);

  // Get recommended journeys for users without active journey
  const recommendedJourneys = journeys?.slice(0, 3) || [];

  // Redirect first-time users to explore page
  useEffect(() => {
    const hasExplored = localStorage.getItem('ethra-journeys-explored');
    if (!activeJourney && (!userJourneys || userJourneys.length === 0) && !hasExplored && !isLoadingJourneys) {
      localStorage.setItem('ethra-journeys-explored', 'true');
      navigate('/journeys/explore', { replace: true });
    }
  }, [activeJourney, userJourneys, isLoadingJourneys, navigate]);

  return (
    <div className="min-h-[100dvh] flex flex-col pb-28">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-secondary/8 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative pt-8 px-6 pb-4"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Compass className="w-6 h-6 text-primary" />
              Jornadas Interiores
            </h1>
            <p className="text-sm text-muted-foreground">Trilhas de transformação pessoal</p>
          </div>
          <ContextualHelp helpKey="journeys-how-it-works" size="md" />
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 px-6 space-y-6 relative">
        {/* Active Journey Section */}
        {activeJourney && activeJourneyDays ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* How it works hint */}
            <div className="rounded-xl bg-primary/5 border border-primary/10 p-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground font-medium">Toque no dia atual</p>
                <p className="text-xs text-muted-foreground">Leia o ensinamento, faça a prática e conclua o dia</p>
              </div>
            </div>

            {/* Active Journey Card */}
            <div className="rounded-2xl bg-card border border-border/50 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeJourney.journey.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{activeJourney.journey.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Dia {activeJourney.current_day} de {activeJourney.journey.duration_days}
                  </p>
                </div>
                <ContextualHelp helpKey="journey-progress" size="sm" variant="subtle" />
              </div>

              <JourneyProgress
                currentDay={activeJourney.current_day}
                totalDays={activeJourney.journey.duration_days}
                completedDays={completedDayNumbers}
                onDayClick={handleDayClick}
                themeColor={activeJourney.journey.theme_color}
                days={activeJourneyDays}
              />
            </div>

            {/* Explore other journeys link */}
            <Link
              to="/journeys/explore"
              className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Compass className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Explorar outras jornadas</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
            </Link>
          </motion.section>
        ) : (
          /* No Active Journey - Show Onboarding */
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* How it works */}
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/5 border border-primary/10 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Como funciona</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">1</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Escolha uma jornada</p>
                    <p className="text-xs text-muted-foreground">Explore trilhas de autoconhecimento e bem-estar</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">2</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Complete um dia por vez</p>
                    <p className="text-xs text-muted-foreground">Cada dia tem ensinamentos e práticas guiadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">3</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Transforme-se gradualmente</p>
                    <p className="text-xs text-muted-foreground">Pequenas práticas diárias geram grandes mudanças</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Journeys */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Recomendadas para você
                </h2>
              </div>

              {isLoadingJourneys ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-24 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedJourneys.map((journey, idx) => (
                    <JourneyCard
                      key={journey.id}
                      journey={journey}
                      onClick={() => handleJourneyClick(journey)}
                      delay={idx * 0.05}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* View all button */}
            <Link to="/journeys/explore" className="block">
              <Button variant="outline" className="w-full gap-2">
                <Compass className="w-4 h-4" />
                Ver todas as jornadas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.section>
        )}
      </main>

      <BottomNavigation />

      {/* Journey Details Modal */}
      {selectedJourney && (
        <JourneyDetails
          journey={selectedJourney}
          days={selectedJourneyDays || []}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedJourney(null);
          }}
          onStart={handleStartJourney}
          isStarting={startJourneyMutation.isPending}
          hasActiveJourney={!!activeJourney}
        />
      )}

      {/* Day Content Modal */}
      {currentDay && activeJourney && (
        <JourneyDayContent
          day={currentDay}
          dayNumber={currentViewingDay}
          totalDays={activeJourney.journey.duration_days}
          journeyTitle={activeJourney.journey.title}
          isOpen={showDayContent}
          onClose={() => setShowDayContent(false)}
          onComplete={handleCompleteDay}
          onOpenBreathing={handleOpenBreathing}
          onOpenMeditation={handleOpenMeditation}
          isCompleting={completeDayMutation.isPending}
        />
      )}

      {/* Breathing Pacer Overlay */}
      <AnimatePresence>
        {showBreathPacer && selectedTechnique && (
          <BreathPacer
            pattern={{
              inhale: selectedTechnique.inhale_ms,
              holdIn: selectedTechnique.hold_in_ms,
              exhale: selectedTechnique.exhale_ms,
              holdOut: selectedTechnique.hold_out_ms,
              name: selectedTechnique.pattern_name,
              description: selectedTechnique.description,
              cycles: selectedTechnique.cycles,
            }}
            emotionType="meditate"
            colorClass={selectedTechnique.color_class || undefined}
            bgClass={selectedTechnique.bg_class || undefined}
            backgroundAudioUrl={selectedTechnique.background_audio_url || undefined}
            explanation={selectedTechnique.explanation || undefined}
            onClose={() => {
              setShowBreathPacer(false);
              setSelectedTechnique(null);
            }}
            onComplete={handleBreathingComplete}
          />
        )}
      </AnimatePresence>

      {/* Meditation Player Overlay */}
      <AnimatePresence>
        {showMeditation && (
          <MeditationPlayer
            onClose={() => {
              setShowMeditation(false);
              setSelectedMeditationId(null);
            }}
            onComplete={handleMeditationComplete}
            initialTrackId={selectedMeditationId || undefined}
          />
        )}
      </AnimatePresence>

      {/* Celebration Modal */}
      {activeJourney && (
        <JourneyCompletionCelebration
          journeyTitle={activeJourney.journey.title}
          journeyIcon={activeJourney.journey.icon}
          totalDays={activeJourney.journey.duration_days}
          isOpen={showCelebration}
          onClose={() => {
            setShowCelebration(false);
            navigate('/');
          }}
        />
      )}
    </div>
  );
}
