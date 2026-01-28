import { motion } from 'framer-motion';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import type { EmotionNutritionContext } from '@/hooks/useNutrition';
import { cn } from '@/lib/utils';

interface MealCardProps {
  entry: EmotionNutritionContext;
  index?: number;
}

const moodEmojis: Record<string, string> = {
  good: '😊',
  neutral: '😐',
  anxious: '😰',
  stressed: '😤',
  tired: '😴',
  sad: '😔',
  happy: '🥰',
};

const moodLabels: Record<string, string> = {
  good: 'Bem',
  neutral: 'Neutro',
  anxious: 'Ansioso',
  stressed: 'Estressado',
  tired: 'Cansado',
  sad: 'Triste',
  happy: 'Feliz',
};

const hungerLabels: Record<string, { emoji: string; label: string }> = {
  physical: { emoji: '🍎', label: 'Fome física' },
  emotional: { emoji: '💭', label: 'Fome emocional' },
  unknown: { emoji: '🤷', label: 'Não identificada' },
};

const energyLabels: Record<string, { emoji: string; label: string }> = {
  sleepy: { emoji: '😴', label: 'Sonolento' },
  satisfied: { emoji: '😌', label: 'Satisfeito' },
  energized: { emoji: '⚡', label: 'Energizado' },
  uncomfortable: { emoji: '🤢', label: 'Desconfortável' },
  normal: { emoji: '😐', label: 'Normal' },
};

const categoryEmojis: Record<string, string> = {
  'Café da manhã': '🌅',
  'Almoço': '🍽️',
  'Jantar': '🌙',
  'Lanche': '🥪',
};

export function MealCard({ entry, index = 0 }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const time = format(new Date(entry.created_at), 'HH:mm', { locale: ptBR });
  const moodEmoji = moodEmojis[entry.mood_before] || '😐';
  const moodLabel = moodLabels[entry.mood_before] || 'Neutro';
  const hunger = hungerLabels[entry.hunger_type] || hungerLabels.unknown;
  const energy = entry.energy_after ? energyLabels[entry.energy_after] : null;
  const categoryEmoji = entry.meal_category 
    ? categoryEmojis[entry.meal_category] || '🍴'
    : '✨';

  const hasDetails = entry.energy_after || entry.mindful_eating_notes;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border/50 rounded-2xl overflow-hidden"
    >
      <div 
        className={cn(
          "p-4 flex gap-4",
          hasDetails && "cursor-pointer"
        )}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        {/* Time indicator */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-nutrition/10 flex items-center justify-center text-2xl">
            {categoryEmoji}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {time}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-semibold text-foreground truncate">
              {entry.meal_category || 'Momento de reflexão'}
            </h4>
            {hasDetails && (
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {/* Mood badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
              <span>{moodEmoji}</span>
              <span>{moodLabel}</span>
            </span>

            {/* Hunger type badge */}
            <span className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
              entry.hunger_type === 'emotional' 
                ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
                : 'bg-muted text-foreground'
            )}>
              <span>{hunger.emoji}</span>
              <span>{hunger.label}</span>
            </span>

            {/* Energy badge (if available) */}
            {energy && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-nutrition/10 text-xs font-medium text-nutrition">
                <span>{energy.emoji}</span>
                <span>{energy.label}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {hasDetails && expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border/50"
        >
          <div className="p-4 space-y-3">
            {/* Before vs After comparison */}
            {energy && (
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-xl">
                <div className="flex-1 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Antes</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xl">{moodEmoji}</span>
                    <span className="text-sm font-medium">{moodLabel}</span>
                  </div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex-1 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Depois</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xl">{energy.emoji}</span>
                    <span className="text-sm font-medium">{energy.label}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {entry.mindful_eating_notes && (
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="text-xs text-muted-foreground mb-1">💭 Reflexão</p>
                <p className="text-sm text-foreground">
                  {entry.mindful_eating_notes}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
