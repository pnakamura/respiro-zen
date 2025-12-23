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
    <div className="w-full max-w-md mx-auto">
      {/* Wheel Container */}
      <div className="relative aspect-square">
        {/* Decorative background gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent rounded-full" />
        
        {/* Animated decorative rings */}
        <motion.div 
          className="absolute inset-2 rounded-full"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)/0.1), transparent, hsl(var(--accent)/0.1))',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute inset-6 rounded-full border border-dashed border-primary/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div 
          className="absolute inset-10 rounded-full border border-dotted border-muted-foreground/10"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />
        
        {/* Pulse ring on selection */}
        <AnimatePresence>
          {recentlySelected && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-primary"
            />
          )}
        </AnimatePresence>

        {/* Center hub with breathing animation */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="relative">
            {/* Multi-layer glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 rounded-full blur-2xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              }}
            />
            <motion.div 
              className="absolute -inset-2 bg-primary/10 rounded-full blur-xl"
              animate={{ 
                scale: [1.1, 1, 1.1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: 'easeInOut',
                delay: 0.5
              }}
            />
            
            {/* Hub container with glass effect */}
            <motion.div 
              className="relative w-28 h-28 rounded-full glass-card-premium flex flex-col items-center justify-center p-3 overflow-hidden"
              animate={{ 
                boxShadow: [
                  '0 0 20px hsl(var(--primary)/0.2)',
                  '0 0 40px hsl(var(--primary)/0.3)',
                  '0 0 20px hsl(var(--primary)/0.2)'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Animated gradient background */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              
              {/* Pulsing heart icon */}
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
                <Heart className="w-6 h-6 text-primary fill-primary/30" />
              </motion.div>
              
              <span className="relative text-[11px] font-medium text-center text-muted-foreground leading-tight mt-1">
                Como você<br />se sente?
              </span>
              
              {/* Selection counter */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedEmotions.length}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-colors duration-300",
                        i < selectedEmotions.length 
                          ? "bg-primary" 
                          : "bg-muted-foreground/30"
                      )}
                      animate={i < selectedEmotions.length ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Emotion Petals */}
        {primaryEmotions.map((emotion, index) => {
          const angle = (index * 360) / 8 - 90;
          const radius = 38;
          const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
          const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
          const selected = isSelected(emotion.id);
          const selectedData = getSelectedEmotion(emotion.id);
          const isRecent = recentlySelected === emotion.id;

          return (
            <motion.button
              key={emotion.id}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.1 + index * 0.08,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              onClick={() => handleSelect(emotion.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group focus:outline-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Multi-layer glow for selected state */}
              <AnimatePresence>
                {selected && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0.3, 0.6]
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{ backgroundColor: emotion.color }}
                    />
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -inset-1 rounded-full blur-md opacity-40"
                      style={{ backgroundColor: emotion.color }}
                    />
                  </>
                )}
              </AnimatePresence>
              
              {/* Hover glow preview */}
              <motion.div
                className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"
                style={{ backgroundColor: emotion.color }}
              />
              
              {/* Selection burst effect */}
              <AnimatePresence>
                {isRecent && selected && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ 
                          scale: 2,
                          opacity: 0,
                          x: Math.cos((i * 60 * Math.PI) / 180) * 30,
                          y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                        style={{ backgroundColor: emotion.color }}
                      />
                    ))}
                  </>
                )}
              </AnimatePresence>
              
              {/* Main petal circle */}
              <motion.div
                className={cn(
                  'relative flex flex-col items-center justify-center w-[5rem] h-[5rem] rounded-full transition-all duration-300',
                  selected 
                    ? 'shadow-2xl' 
                    : 'shadow-lg hover:shadow-xl group-hover:ring-2 group-hover:ring-white/20'
                )}
                style={{
                  backgroundColor: selected ? emotion.color : emotion.bgColor,
                  boxShadow: selected 
                    ? `0 10px 40px -10px ${emotion.color}80, 0 0 20px ${emotion.color}40`
                    : undefined
                }}
                animate={selected ? {
                  boxShadow: [
                    `0 10px 40px -10px ${emotion.color}80, 0 0 20px ${emotion.color}40`,
                    `0 10px 50px -10px ${emotion.color}90, 0 0 30px ${emotion.color}50`,
                    `0 10px 40px -10px ${emotion.color}80, 0 0 20px ${emotion.color}40`,
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Inner gradient overlay */}
                <div 
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: `linear-gradient(135deg, white 0%, transparent 50%, ${emotion.color}40 100%)`
                  }}
                />
                
                {/* Selection ring */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      className="absolute -inset-1 rounded-full border-2 border-white/50"
                    />
                  )}
                </AnimatePresence>

                {/* Selection check badge */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -180, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      exit={{ scale: 0, rotate: 180, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg z-20"
                      style={{
                        boxShadow: `0 4px 15px hsl(var(--primary)/0.5)`
                      }}
                    >
                      <motion.div
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <Check className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Emoji with animation */}
                <motion.span 
                  className="text-3xl relative z-10 drop-shadow-sm"
                  animate={selected ? { 
                    scale: [1, 1.15, 1],
                    rotate: [0, -5, 5, 0]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {emotion.icon}
                </motion.span>
              </motion.div>
              
              {/* Label with improved styling */}
              <motion.div 
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.08 }}
              >
                <span 
                  className={cn(
                    'text-[11px] font-semibold whitespace-nowrap transition-all duration-300 px-2 py-0.5 rounded-full',
                    selected 
                      ? 'text-foreground bg-background/80 shadow-sm' 
                      : 'text-muted-foreground group-hover:text-foreground'
                  )}
                >
                  {selectedData 
                    ? getIntensityLabel(emotion, selectedData.intensity)
                    : emotion.label
                  }
                </span>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Emotions Pills */}
      <AnimatePresence mode="popLayout">
        {selectedEmotions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 20, height: 0 }}
            className="mt-10 flex flex-wrap gap-3 justify-center"
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
                  exit={{ opacity: 0, scale: 0.5, y: -20 }}
                  transition={{ 
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.05 
                  }}
                  className="group relative"
                >
                  {/* Pill glow */}
                  <div 
                    className="absolute inset-0 rounded-full blur-md opacity-30"
                    style={{ backgroundColor: emotion.color }}
                  />
                  
                  <div 
                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-full text-sm shadow-lg backdrop-blur-sm border transition-all duration-300 group-hover:shadow-xl"
                    style={{ 
                      backgroundColor: `${emotion.color}20`,
                      borderColor: `${emotion.color}40`,
                    }}
                  >
                    <motion.span 
                      className="text-xl"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {emotion.icon}
                    </motion.span>
                    <span className="font-medium text-foreground">
                      {getIntensityLabel(emotion, selected.intensity)}
                    </span>
                    
                    {/* Remove button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(emotion.id);
                      }}
                      className="ml-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/20"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic helper text */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedEmotions.length}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1.5">
            {selectedEmotions.length === 3 && (
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
            )}
            {getHelperText()}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}