import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface EmotionItem {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
}

const defaultEmotions: EmotionItem[] = [
  { id: 'alegria', label: 'Alegria', emoji: '😊', color: 'text-energy', bgColor: 'bg-energy/20' },
  { id: 'tristeza', label: 'Tristeza', emoji: '😢', color: 'text-meditate', bgColor: 'bg-meditate/20' },
  { id: 'raiva', label: 'Raiva', emoji: '😠', color: 'text-destructive', bgColor: 'bg-destructive/20' },
  { id: 'medo', label: 'Medo', emoji: '😨', color: 'text-panic', bgColor: 'bg-panic/20' },
  { id: 'surpresa', label: 'Surpresa', emoji: '😮', color: 'text-calm', bgColor: 'bg-calm/20' },
  { id: 'nojo', label: 'Nojo', emoji: '🤢', color: 'text-grounding', bgColor: 'bg-grounding/20' },
];

interface EmotionGridProps {
  emotions?: EmotionItem[];
  selectedEmotions: string[];
  onSelect: (emotionId: string) => void;
  multiSelect?: boolean;
}

export function EmotionGrid({ 
  emotions = defaultEmotions, 
  selectedEmotions, 
  onSelect,
  multiSelect = true 
}: EmotionGridProps) {
  const handleSelect = (emotionId: string) => {
    onSelect(emotionId);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {emotions.map((emotion, index) => {
        const isSelected = selectedEmotions.includes(emotion.id);
        
        return (
          <motion.button
            key={emotion.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => handleSelect(emotion.id)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-200',
              emotion.bgColor,
              isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
            )}
          >
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
            <span className="text-4xl">{emotion.emoji}</span>
            <span className={cn('text-sm font-medium', emotion.color)}>
              {emotion.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
