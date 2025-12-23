import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PrimaryEmotion, getIntensityLabel } from '@/data/plutchik-emotions';
import { Minus, Plus } from 'lucide-react';

interface EmotionIntensitySliderProps {
  emotion: PrimaryEmotion;
  value: number;
  onChange: (value: number) => void;
}

export function EmotionIntensitySlider({ emotion, value, onChange }: EmotionIntensitySliderProps) {
  const intensityLabel = getIntensityLabel(emotion, value);

  const decrease = () => {
    if (value > 1) onChange(value - 1);
  };

  const increase = () => {
    if (value < 5) onChange(value + 1);
  };

  // Get intensity zone (low, mid, high)
  const getZone = (v: number) => {
    if (v <= 2) return 'low';
    if (v <= 4) return 'mid';
    return 'high';
  };

  const zone = getZone(value);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border/50 overflow-hidden"
    >
      {/* Header */}
      <div 
        className="flex items-center gap-3 p-4 border-b"
        style={{ 
          backgroundColor: `${emotion.bgColor}`,
          borderColor: `${emotion.color}20`
        }}
      >
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${emotion.color}20` }}
        >
          <span className="text-2xl">{emotion.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{emotion.label}</p>
          <AnimatePresence mode="wait">
            <motion.p
              key={intensityLabel}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="text-sm font-medium"
              style={{ color: emotion.color }}
            >
              {intensityLabel}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Slider Control */}
      <div className="p-4 space-y-4">
        {/* Visual track */}
        <div className="relative">
          {/* Background track */}
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            {/* Filled portion */}
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: emotion.color }}
              initial={false}
              animate={{ width: `${(value / 5) * 100}%` }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          </div>

          {/* Step markers */}
          <div className="absolute inset-0 flex justify-between items-center px-[2px]">
            {[1, 2, 3, 4, 5].map((step) => (
              <button
                key={step}
                onClick={() => onChange(step)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-200",
                  step <= value 
                    ? "bg-white shadow-sm scale-100" 
                    : "bg-muted-foreground/20 scale-75 hover:scale-100"
                )}
              />
            ))}
          </div>
        </div>

        {/* Stepper controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Decrease button */}
          <motion.button
            onClick={decrease}
            disabled={value <= 1}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
              "border-2",
              value <= 1 
                ? "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed" 
                : "border-border bg-card hover:bg-muted text-foreground"
            )}
          >
            <Minus className="w-5 h-5" />
          </motion.button>

          {/* Value display */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((step) => (
                <motion.button
                  key={step}
                  onClick={() => onChange(step)}
                  className={cn(
                    "w-10 h-10 rounded-xl font-bold text-sm transition-all duration-200 border-2",
                    step === value 
                      ? "text-white shadow-lg scale-110 border-transparent" 
                      : step < value
                        ? "bg-transparent border-current opacity-60"
                        : "bg-muted/50 border-transparent text-muted-foreground hover:bg-muted"
                  )}
                  style={{
                    backgroundColor: step === value ? emotion.color : undefined,
                    color: step < value && step !== value ? emotion.color : undefined,
                    boxShadow: step === value ? `0 4px 16px ${emotion.color}50` : undefined
                  }}
                  whileHover={{ scale: step === value ? 1.1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {step}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Increase button */}
          <motion.button
            onClick={increase}
            disabled={value >= 5}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
              "border-2",
              value >= 5 
                ? "border-muted bg-muted/50 text-muted-foreground cursor-not-allowed" 
                : "border-border bg-card hover:bg-muted text-foreground"
            )}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span className={cn(zone === 'low' && 'font-medium', zone === 'low' && 'text-foreground')}>
            {emotion.lowIntensity.label}
          </span>
          <span className={cn(zone === 'mid' && 'font-medium', zone === 'mid' && 'text-foreground')}>
            {emotion.midIntensity.label}
          </span>
          <span className={cn(zone === 'high' && 'font-medium', zone === 'high' && 'text-foreground')}>
            {emotion.highIntensity.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
