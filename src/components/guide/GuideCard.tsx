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
        'relative cursor-pointer rounded-2xl p-5 transition-all duration-300 backdrop-blur-sm',
        'bg-cream-50/80 border-2 shadow-[0_4px_16px_rgba(95,115,95,0.08)]',
        isSelected
          ? 'border-sage-500 shadow-[0_8px_24px_rgba(95,115,95,0.2)]'
          : 'border-sage-200/50 hover:border-sage-300/70 hover:shadow-[0_6px_20px_rgba(95,115,95,0.12)]'
      )}
    >
      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(95,115,95,0.3)]"
          style={{
            background: 'linear-gradient(135deg, #7d8f7d 0%, #5f735f 100%)',
          }}
        >
          <Check className="w-4 h-4 text-cream-50" />
        </motion.div>
      )}

      {/* Avatar */}
      <div className="text-4xl mb-3">{guide.avatar_emoji}</div>

      {/* Name and approach */}
      <h3 className="font-display font-medium text-lg text-sage-900 mb-1">{guide.name}</h3>
      <p className="text-sm text-sage-600 font-body font-medium mb-2">{guide.approach}</p>

      {/* Description */}
      <p className="text-sm font-body text-sage-700 mb-4 line-clamp-2 leading-relaxed">
        {guide.description}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5">
        {topics.slice(0, 3).map((topic, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-xs px-2 py-0.5 bg-sage-100/80 text-sage-700 border-sage-200/50 font-body"
          >
            {topic}
          </Badge>
        ))}
        {topics.length > 3 && (
          <Badge
            variant="outline"
            className="text-xs px-2 py-0.5 border-sage-300/50 text-sage-600 font-body"
          >
            +{topics.length - 3}
          </Badge>
        )}
      </div>
    </motion.div>
  );
}
