import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind, Loader2, Clock, Repeat, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { cn } from '@/lib/utils';
import { FavoriteButton } from '@/components/FavoriteButton';
import { useFavoriteBreathings } from '@/hooks/useFavorites';
import { ContentLock } from '@/components/access/ContentLock';
// Use the return type from the hook instead of Tables
type BreathingTechnique = NonNullable<ReturnType<typeof useBreathingTechniques>['data']>[number];

interface BreathingTechniqueSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (technique: BreathingTechnique) => void;
}

// Categorize techniques by their purpose/effect
const getArousalState = (technique: BreathingTechnique): 'calming' | 'energizing' | 'balancing' => {
  const emotionId = technique.emotion_id?.toLowerCase() || '';
  const patternName = technique.pattern_name?.toLowerCase() || '';
  
  // Calming techniques (longer exhale, for anxiety/panic)
  if (emotionId.includes('anxious') || emotionId.includes('panic') || 
      patternName.includes('4-7-8') || patternName.includes('calm') ||
      patternName.includes('relaxa')) {
    return 'calming';
  }
  
  // Energizing techniques (for tiredness, anger release)
  if (emotionId.includes('tired') || emotionId.includes('wimhof') ||
      patternName.includes('wim') || patternName.includes('energy') ||
      patternName.includes('kapal')) {
    return 'energizing';
  }
  
  // Balancing (coherent breathing, alternate nostril, meditation)
  return 'balancing';
};

const arousalLabels = {
  calming: { label: 'Acalmar', emoji: '🌙', color: 'text-calm', bg: 'bg-calm/10' },
  energizing: { label: 'Energizar', emoji: '⚡', color: 'text-energy', bg: 'bg-energy/10' },
  balancing: { label: 'Equilibrar', emoji: '☯️', color: 'text-grounding', bg: 'bg-grounding/10' },
};

type FilterType = 'all' | 'calming' | 'energizing' | 'balancing' | 'favorites';

export function BreathingTechniqueSelector({ isOpen, onClose, onSelect }: BreathingTechniqueSelectorProps) {
  const { data: techniques, isLoading } = useBreathingTechniques();
  const { data: favorites } = useFavoriteBreathings();
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isOpen) return null;

  const favoriteIds = favorites?.map(f => f.breathing_id) || [];

  const filteredTechniques = techniques?.filter(t => {
    if (filter === 'all') return true;
    if (filter === 'favorites') return favoriteIds.includes(t.id);
    return getArousalState(t) === filter;
  }) || [];

  const getPatternDisplay = (technique: BreathingTechnique) => {
    const inhale = technique.inhale_ms / 1000;
    const holdIn = technique.hold_in_ms / 1000;
    const exhale = technique.exhale_ms / 1000;
    const holdOut = technique.hold_out_ms / 1000;

    const parts = [];
    if (inhale > 0) parts.push(inhale);
    if (holdIn > 0) parts.push(holdIn);
    if (exhale > 0) parts.push(exhale);
    if (holdOut > 0) parts.push(holdOut);
    
    return parts.join('-');
  };

  const getEstimatedDuration = (technique: BreathingTechnique) => {
    const cycleMs = technique.inhale_ms + technique.hold_in_ms + technique.exhale_ms + technique.hold_out_ms;
    const totalMs = cycleMs * technique.cycles;
    const totalMinutes = Math.ceil(totalMs / 60000);
    return `${totalMinutes} min`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-background"
      >
        {/* Header - more compact */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between px-5 py-3 border-b border-border/30 safe-top"
        >
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Técnicas de Respiração
            </h2>
            <p className="text-xs text-muted-foreground">
              Escolha como deseja se sentir
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full w-9 h-9"
          >
            <X className="w-5 h-5" />
          </Button>
        </motion.header>

        {/* Filters - horizontal scroll */}
        <div className="px-5 py-2.5 flex gap-2 overflow-x-auto scrollbar-none">
          {(['all', 'favorites', 'calming', 'energizing', 'balancing'] as FilterType[]).map((filterType) => {
            const isActive = filter === filterType;
            const getLabel = () => {
              if (filterType === 'all') return 'Todas';
              if (filterType === 'favorites') return 'Favoritas';
              return arousalLabels[filterType].label;
            };
            const getEmoji = () => {
              if (filterType === 'all') return '✨';
              if (filterType === 'favorites') return '❤️';
              return arousalLabels[filterType].emoji;
            };
            
            return (
              <motion.button
                key={filterType}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterType)}
                className={cn(
                  'px-3.5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 whitespace-nowrap transition-all shrink-0',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'bg-muted/50 text-muted-foreground active:bg-muted'
                )}
              >
                <span className="text-sm">{getEmoji()}</span>
                <span>{getLabel()}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Technique List */}
        <div className="flex-1 overflow-auto px-5 pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-calm" />
              <p className="text-muted-foreground text-sm">Carregando técnicas...</p>
            </div>
          ) : filteredTechniques.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
              <Wind className="w-14 h-14 text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">Nenhuma técnica disponível</p>
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              {filteredTechniques.map((technique, index) => {
                const arousal = getArousalState(technique);
                const { emoji, color, bg } = arousalLabels[arousal];
                
                return (
                  <ContentLock
                    key={technique.id}
                    contentType="breathing"
                    contentId={technique.id}
                    contentTitle={technique.label}
                    badgePosition="top-left"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className={cn(
                        'w-full p-3.5 rounded-2xl text-left relative',
                        'bg-card border border-border/40',
                        'active:scale-[0.98] transition-transform duration-150'
                      )}
                    >
                      {/* Favorite button */}
                      <div className="absolute top-2 right-2 z-10">
                        <FavoriteButton type="breathing" itemId={technique.id} size="sm" />
                      </div>
                      <button
                        onClick={() => onSelect(technique)}
                        className="w-full text-left"
                      >
                      <div className="flex items-start gap-3">
                        {/* Icon - slightly smaller */}
                        <div className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0',
                          bg
                        )}>
                          {technique.icon || emoji}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-sm text-foreground truncate">
                              {technique.label}
                            </h3>
                            <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0', bg, color)}>
                              {arousalLabels[arousal].label}
                            </span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">
                            {technique.description}
                          </p>
                          
                          {/* Meta info */}
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Wind className="w-3 h-3" />
                              {getPatternDisplay(technique)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Repeat className="w-3 h-3" />
                              {technique.cycles}x
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {getEstimatedDuration(technique)}
                            </span>
                          </div>
                        </div>
                      </div>
                      </button>
                    </motion.div>
                  </ContentLock>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom - safe area */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="px-5 py-3 safe-bottom border-t border-border/30"
        >
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full h-11 rounded-xl"
          >
            Voltar
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
