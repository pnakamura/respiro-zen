import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { SpiritualGuide } from '@/hooks/useGuides';

interface GuideCardProps {
  guide: SpiritualGuide;
  isSelected?: boolean;
  onSelect: (guide: SpiritualGuide) => void;
}

export function GuideCard({ guide, isSelected, onSelect }: GuideCardProps) {
  const topics = Array.isArray(guide.topics) ? guide.topics : [];

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(guide)}
      className={cn(
        'relative cursor-pointer rounded-2xl p-5 transition-all duration-300',
        'bg-card border-2',
        isSelected 
          ? 'border-primary shadow-lg shadow-primary/10' 
          : 'border-border/50 hover:border-primary/30'
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-primary-foreground" />
        </motion.div>
      )}

      {/* Avatar */}
      <div className="text-4xl mb-3">{guide.avatar_emoji}</div>

      {/* Name and approach */}
      <h3 className="font-semibold text-lg text-foreground mb-1">{guide.name}</h3>
      <p className="text-sm text-primary font-medium mb-2">{guide.approach}</p>

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {guide.description}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5">
        {topics.slice(0, 3).map((topic, index) => (
          <Badge 
            key={index} 
            variant="secondary" 
            className="text-xs px-2 py-0.5"
          >
            {topic}
          </Badge>
        ))}
        {topics.length > 3 && (
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            +{topics.length - 3}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
