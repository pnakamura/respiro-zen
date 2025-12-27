import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wind, Loader2, Clock, Repeat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBreathingTechniques } from '@/hooks/useBreathingTechniques';
import { cn } from '@/lib/utils';

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

type FilterType = 'all' | 'calming' | 'energizing' | 'balancing';

export function BreathingTechniqueSelector({ isOpen, onClose, onSelect }: BreathingTechniqueSelectorProps) {
  const { data: techniques, isLoading } = useBreathingTechniques();
  const [filter, setFilter] = useState<FilterType>('all');

  if (!isOpen) return null;

  const filteredTechniques = techniques?.filter(t => {
    if (filter === 'all') return true;
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
        {/* Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between p-4 border-b border-border/50"
        >
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Técnicas de Respiração
            </h2>
            <p className="text-sm text-muted-foreground">
              Escolha como deseja se sentir
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </motion.header>

        {/* Filters */}
        <div className="px-4 py-3 flex gap-2 overflow-x-auto">
          {(['all', 'calming', 'energizing', 'balancing'] as FilterType[]).map((filterType) => {
            const isActive = filter === filterType;
            const label = filterType === 'all' ? 'Todas' : arousalLabels[filterType].label;
            const emoji = filterType === 'all' ? '✨' : arousalLabels[filterType].emoji;
            
            return (
              <motion.button
                key={filterType}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(filterType)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-all',
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                )}
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Technique List */}
        <div className="flex-1 overflow-auto px-4 pb-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-calm" />
              <p className="text-muted-foreground">Carregando técnicas...</p>
            </div>
          ) : filteredTechniques.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <Wind className="w-16 h-16 text-muted-foreground/50" />
              <p className="text-muted-foreground">Nenhuma técnica disponível</p>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              {filteredTechniques.map((technique, index) => {
                const arousal = getArousalState(technique);
                const { emoji, color, bg } = arousalLabels[arousal];
                
                return (
                  <motion.button
                    key={technique.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSelect(technique)}
                    className={cn(
                      'w-full p-4 rounded-2xl text-left',
                      'bg-card border border-border/50',
                      'hover:shadow-lg hover:border-border transition-all duration-300',
                      'active:scale-[0.98]'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={cn(
                        'w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0',
                        bg
                      )}>
                        {technique.icon || emoji}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {technique.label}
                          </h3>
                          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', bg, color)}>
                            {arousalLabels[arousal].label}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {technique.description}
                        </p>
                        
                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Wind className="w-3 h-3" />
                            {getPatternDisplay(technique)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Repeat className="w-3 h-3" />
                            {technique.cycles} ciclos
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {getEstimatedDuration(technique)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 safe-bottom border-t border-border/50"
        >
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            className="w-full rounded-full"
          >
            Voltar
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
