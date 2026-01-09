import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, ChevronLeft, Search, Filter } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { JourneyCard } from '@/components/journeys/JourneyCard';
import { JourneyDetails } from '@/components/journeys/JourneyDetails';
import { useJourneys, useJourneyDays, type Journey } from '@/hooks/useJourneys';
import { 
  useActiveUserJourney, 
  useUserJourneys, 
  useStartJourney, 
} from '@/hooks/useUserJourney';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function JourneysExplore() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { data: journeys, isLoading: isLoadingJourneys } = useJourneys();
  const { data: activeJourney } = useActiveUserJourney();
  const { data: userJourneys } = useUserJourneys();
  
  const startJourneyMutation = useStartJourney();

  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const { data: selectedJourneyDays } = useJourneyDays(selectedJourney?.id);

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
      navigate('/journeys');
    } catch (error) {
      toast.error('Erro ao iniciar jornada');
    }
  };

  const getJourneyProgress = (journeyId: string) => {
    const userJourney = userJourneys?.find(uj => uj.journey_id === journeyId);
    if (!userJourney) return undefined;
    const journey = journeys?.find(j => j.id === journeyId);
    if (!journey) return undefined;
    return ((userJourney.current_day - 1) / journey.duration_days) * 100;
  };

  const isJourneyCompleted = (journeyId: string) => {
    const userJourney = userJourneys?.find(uj => uj.journey_id === journeyId);
    return !!userJourney?.completed_at;
  };

  // Filter journeys
  const filteredJourneys = journeys?.filter(journey => {
    const matchesSearch = !searchQuery || 
      journey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      journey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || journey.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(journeys?.map(j => j.category).filter(Boolean))) as string[];

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
            onClick={() => navigate('/journeys')}
            className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Compass className="w-6 h-6 text-primary" />
              Explorar Jornadas
            </h1>
            <p className="text-sm text-muted-foreground">Encontre sua trilha de transformação</p>
          </div>
        </div>
      </motion.header>

      {/* Search and Filters */}
      <div className="px-6 space-y-3 relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar jornadas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border/50"
          />
        </div>

        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !filterCategory 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted/50 text-muted-foreground'
              }`}
            >
              Todas
            </button>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors capitalize ${
                  filterCategory === category 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50 text-muted-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 px-6 py-4 space-y-3 relative">
        {isLoadingJourneys ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
        ) : filteredJourneys && filteredJourneys.length > 0 ? (
          <div className="space-y-3">
            {filteredJourneys.map((journey, idx) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                onClick={() => handleJourneyClick(journey)}
                progress={getJourneyProgress(journey.id)}
                isCompleted={isJourneyCompleted(journey.id)}
                delay={idx * 0.05}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Compass className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhuma jornada encontrada' : 'Nenhuma jornada disponível'}
            </p>
          </div>
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
    </div>
  );
}
