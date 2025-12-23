import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';
import { primaryEmotions, getIntensityLabel } from '@/data/plutchik-emotions';
import { useState, useCallback } from 'react';

interface SelectedEmotion {
  id: string;
  intensity: number;
}

interface PlutchikWheelProps {
  selectedEmotions: SelectedEmotion[];
  onSelect: (emotionId: string) => void;
  onIntensityChange?: (emotionId: string, intensity: number) => void;
}

export function PlutchikWheel({ 
  selectedEmotions, 
  onSelect,
}: PlutchikWheelProps) {
  const [recentlySelected, setRecentlySelected] = useState<string | null>(null);

  const isSelected = (id: string) => 
    selectedEmotions.some(e => e.id === id);

  const handleSelect = useCallback((emotionId: string) => {
    setRecentlySelected(emotionId);
    onSelect(emotionId);
    setTimeout(() => setRecentlySelected(null), 500);
  }, [onSelect]);

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Progress indicator */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-2 mb-5"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i < selectedEmotions.length 
                ? "w-8 bg-primary" 
                : "w-4 bg-muted-foreground/20"
            )}
            layout
          />
        ))}
        <span className="ml-2 text-xs text-muted-foreground font-medium">
          {selectedEmotions.length}/3
        </span>
      </motion.div>

      {/* Emotion Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {primaryEmotions.map((emotion, index) => {
          const selected = isSelected(emotion.id);
          const isRecent = recentlySelected === emotion.id;
          const isDisabled = selectedEmotions.length >= 3 && !selected;

          return (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.04,
                type: 'spring',
                stiffness: 400,
                damping: 25
              }}
              onClick={() => !isDisabled && handleSelect(emotion.id)}
              disabled={isDisabled}
              className={cn(
                "relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-2xl",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
              whileHover={!isDisabled ? { y: -4 } : {}}
              whileTap={!isDisabled ? { scale: 0.97 } : {}}
            >
              {/* Card */}
              <div
                className={cn(
                  'relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl transition-all duration-300',
                  'border-2 min-h-[120px]',
                  selected 
                    ? 'border-transparent shadow-xl' 
                    : 'border-transparent bg-card shadow-sm hover:shadow-lg'
                )}
                style={{
                  backgroundColor: selected ? emotion.color : undefined,
                  boxShadow: selected 
                    ? `0 12px 32px -8px ${emotion.color}60`
                    : undefined
                }}
              >
                {/* Selection ripple */}
                <AnimatePresence>
                  {isRecent && selected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0.6 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="absolute inset-0 rounded-2xl"
                      style={{ backgroundColor: emotion.color }}
                    />
                  )}
                </AnimatePresence>

                {/* Check badge */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md"
                    >
                      <Check className="w-3 h-3 text-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Emoji */}
                <motion.div
                  className={cn(
                    "text-4xl sm:text-5xl mb-2 transition-transform duration-300",
                    !selected && "group-hover:scale-110"
                  )}
                  animate={isRecent && selected ? { 
                    scale: [1, 1.2, 1],
                    rotate: [0, -8, 8, 0]
                  } : {}}
                  transition={{ duration: 0.4 }}
                >
                  {emotion.icon}
                </motion.div>

                {/* Label */}
                <span 
                  className={cn(
                    'text-sm font-semibold text-center transition-colors duration-300',
                    selected ? 'text-white' : 'text-foreground'
                  )}
                >
                  {emotion.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Pills */}
      <AnimatePresence>
        {selectedEmotions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedEmotions.map((selected, index) => {
                const emotion = primaryEmotions.find(e => e.id === selected.id);
                if (!emotion) return null;
                
                return (
                  <motion.div
                    key={selected.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-full border shadow-sm"
                    style={{ 
                      backgroundColor: `${emotion.color}15`,
                      borderColor: `${emotion.color}30`,
                    }}
                  >
                    <span className="text-base">{emotion.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {getIntensityLabel(emotion, selected.intensity)}
                    </span>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(emotion.id);
                      }}
                      className="p-1 rounded-full hover:bg-destructive/20 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
