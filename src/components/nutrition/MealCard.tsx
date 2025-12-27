import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { EmotionNutritionContext } from '@/hooks/useNutrition';

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

const hungerLabels: Record<string, { emoji: string; label: string }> = {
  physical: { emoji: '🍎', label: 'Fome física' },
  emotional: { emoji: '💭', label: 'Fome emocional' },
  unknown: { emoji: '🤷', label: 'Não identificada' },
};

const categoryEmojis: Record<string, string> = {
  'Café da manhã': '🌅',
  'Almoço': '🍽️',
  'Jantar': '🌙',
  'Lanche': '🥪',
};

export function MealCard({ entry, index = 0 }: MealCardProps) {
  const time = format(new Date(entry.created_at), 'HH:mm', { locale: ptBR });
  const moodEmoji = moodEmojis[entry.mood_before] || '😐';
  const hunger = hungerLabels[entry.hunger_type] || hungerLabels.unknown;
  const categoryEmoji = entry.meal_category 
    ? categoryEmojis[entry.meal_category] || '🍴'
    : '✨';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card border border-border/50 rounded-2xl p-4 flex gap-4"
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
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-foreground truncate">
            {entry.meal_category || 'Momento de reflexão'}
          </h4>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {/* Mood badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
            <span>{moodEmoji}</span>
            <span>Humor</span>
          </span>

          {/* Hunger type badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-foreground">
            <span>{hunger.emoji}</span>
            <span>{hunger.label}</span>
          </span>
        </div>

        {/* Notes if any */}
        {entry.mindful_eating_notes && (
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
            {entry.mindful_eating_notes}
          </p>
        )}
      </div>
    </motion.div>
  );
}
