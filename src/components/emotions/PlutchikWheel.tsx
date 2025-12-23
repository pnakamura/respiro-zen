import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Check, Heart, X, Sparkles } from 'lucide-react';
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

  const getSelectedEmotion = (id: string) => 
    selectedEmotions.find(e => e.id === id);

  const isSelected = (id: string) => 
    selectedEmotions.some(e => e.id === id);

  const handleSelect = useCallback((emotionId: string) => {
    setRecentlySelected(emotionId);
    onSelect(emotionId);
    setTimeout(() => setRecentlySelected(null), 600);
  }, [onSelect]);

  const getHelperText = () => {
    const count = selectedEmotions.length;
    if (count === 0) return "Toque para selecionar • Até 3 emoções";
    if (count === 1) return "Ótimo! Você pode adicionar mais 2";
    if (count === 2) return "Quase lá! Mais 1 disponível";
    return "Máximo atingido ✨";
  };

  return (
    <div className="w-full max-w-md mx-auto px-2">
      {/* Header com título e contador */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 backdrop-blur-sm border border-primary/20">
          <motion.div
            animate={{ 
              scale: [1, 1.15, 1],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            <Heart className="w-5 h-5 text-primary fill-primary/30" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">
            Como você se sente?
          </span>
          
          {/* Selection dots */}
          <div className="flex gap-1 ml-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i < selectedEmotions.length 
                    ? "bg-primary scale-110" 
                    : "bg-muted-foreground/30"
                )}
                animate={i < selectedEmotions.length ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Emotion Grid - 2 columns, 4 rows */}
      <div className="grid grid-cols-2 gap-3">
        {primaryEmotions.map((emotion, index) => {
          const selected = isSelected(emotion.id);
          const selectedData = getSelectedEmotion(emotion.id);
          const isRecent = recentlySelected === emotion.id;

          return (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: index * 0.05,
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              onClick={() => handleSelect(emotion.id)}
              className="relative group focus:outline-none"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Glow effect for selected state */}
              <AnimatePresence>
                {selected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: [0.4, 0.6, 0.4],
                      scale: 1
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ 
                      opacity: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                      scale: { duration: 0.3 }
                    }}
                    className="absolute -inset-1 rounded-2xl blur-lg"
                    style={{ backgroundColor: emotion.color }}
                  />
                )}
              </AnimatePresence>

              {/* Selection burst particles */}
              <AnimatePresence>
                {isRecent && selected && (
                  <>
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                        animate={{ 
                          scale: [0, 1, 0.5],
                          opacity: [1, 0.8, 0],
                          x: Math.cos((i * 45 * Math.PI) / 180) * 40,
                          y: Math.sin((i * 45 * Math.PI) / 180) * 40,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full z-20"
                        style={{ backgroundColor: emotion.color }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>

              {/* Main Card */}
              <motion.div
                className={cn(
                  'relative flex items-center gap-3 p-4 rounded-2xl transition-all duration-300 overflow-hidden',
                  'border backdrop-blur-sm',
                  selected 
                    ? 'shadow-xl border-white/30' 
                    : 'shadow-md hover:shadow-lg border-white/10 hover:border-white/20'
                )}
                style={{
                  backgroundColor: selected ? emotion.color : emotion.bgColor,
                  boxShadow: selected 
                    ? `0 10px 40px -10px ${emotion.color}80, 0 0 20px ${emotion.color}30`
                    : undefined
                }}
                animate={selected ? {
                  boxShadow: [
                    `0 10px 40px -10px ${emotion.color}80, 0 0 20px ${emotion.color}30`,
                    `0 10px 50px -10px ${emotion.color}90, 0 0 30px ${emotion.color}40`,
                    `0 10px 40px -10px ${emotion.color}80, 0 0 20px ${emotion.color}30`,
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Gradient overlay */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: `linear-gradient(135deg, white 0%, transparent 50%, ${emotion.color}30 100%)`
                  }}
                />

                {/* Subtle pattern */}
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Emoji Container */}
                <div className="relative flex-shrink-0">
                  <motion.div 
                    className={cn(
                      "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
                      selected 
                        ? "bg-white/30 shadow-inner" 
                        : "bg-white/50 group-hover:bg-white/60"
                    )}
                    animate={selected ? { 
                      scale: [1, 1.05, 1],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.span 
                      className="text-3xl drop-shadow-sm"
                      animate={isRecent && selected ? { 
                        scale: [1, 1.3, 1],
                        rotate: [0, -10, 10, 0]
                      } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      {emotion.icon}
                    </motion.span>
                  </motion.div>

                  {/* Check badge */}
                  <AnimatePresence>
                    {selected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 180, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg z-10"
                        style={{
                          boxShadow: `0 4px 12px hsl(var(--primary)/0.4)`
                        }}
                      >
                        <Check className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Text Content */}
                <div className="relative flex-1 text-left min-w-0">
                  <motion.span 
                    className={cn(
                      'block text-base font-semibold truncate transition-colors duration-300',
                      selected ? 'text-white drop-shadow-sm' : 'text-foreground'
                    )}
                    layout
                  >
                    {selectedData 
                      ? getIntensityLabel(emotion, selectedData.intensity)
                      : emotion.label
                    }
                  </motion.span>
                  <span 
                    className={cn(
                      'text-xs transition-colors duration-300 truncate block',
                      selected ? 'text-white/80' : 'text-muted-foreground'
                    )}
                  >
                    {emotion.survivalFunction.split(' ')[0]}
                  </span>
                </div>

                {/* Hover indicator */}
                <motion.div
                  className={cn(
                    "absolute right-3 w-2 h-2 rounded-full transition-all duration-300",
                    selected 
                      ? "bg-white/50" 
                      : "bg-primary/0 group-hover:bg-primary/50"
                  )}
                />
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Helper Text */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={selectedEmotions.length}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground"
          >
            {getHelperText()}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Selected Emotions Pills */}
      <AnimatePresence mode="popLayout">
        {selectedEmotions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mt-6 flex flex-wrap gap-2 justify-center"
          >
            {selectedEmotions.map((selected, index) => {
              const emotion = primaryEmotions.find(e => e.id === selected.id);
              if (!emotion) return null;
              
              return (
                <motion.div
                  key={selected.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, x: -20 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.03 
                  }}
                  className="group relative"
                >
                  {/* Pill glow */}
                  <motion.div 
                    className="absolute inset-0 rounded-full blur-md opacity-30"
                    style={{ backgroundColor: emotion.color }}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <div 
                    className="relative flex items-center gap-2 pl-3 pr-2 py-2 rounded-full text-sm shadow-lg backdrop-blur-sm border transition-all duration-300 group-hover:shadow-xl"
                    style={{ 
                      backgroundColor: `${emotion.color}25`,
                      borderColor: `${emotion.color}50`,
                    }}
                  >
                    <motion.span 
                      className="text-lg"
                      animate={{ rotate: [0, -5, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {emotion.icon}
                    </motion.span>
                    <span className="font-medium text-foreground text-sm">
                      {getIntensityLabel(emotion, selected.intensity)}
                    </span>
                    
                    {/* Remove button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(emotion.id);
                      }}
                      className="ml-1 p-1 rounded-full bg-foreground/10 hover:bg-destructive/80 transition-colors duration-200 group/btn"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3 h-3 text-muted-foreground group-hover/btn:text-white transition-colors" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sparkle decoration when max reached */}
      <AnimatePresence>
        {selectedEmotions.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="flex justify-center mt-4"
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 3, repeat: Infinity, ease: 'linear' },
                scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
