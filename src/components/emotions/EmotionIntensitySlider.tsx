import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { PrimaryEmotion, getIntensityLabel } from '@/data/plutchik-emotions';

interface EmotionIntensitySliderProps {
  emotion: PrimaryEmotion;
  value: number;
  onChange: (value: number) => void;
}

export function EmotionIntensitySlider({ emotion, value, onChange }: EmotionIntensitySliderProps) {
  const steps = [1, 2, 3, 4, 5];
  const intensityLabel = getIntensityLabel(emotion, value);

  // Gradiente de cores baseado na intensidade
  const getStepColor = (step: number) => {
    if (step <= value) {
      // Intensificar a cor conforme o valor
      const opacity = 0.3 + (step / 5) * 0.7;
      return emotion.color.replace(')', `, ${opacity})`).replace('hsl', 'hsla');
    }
    return 'hsl(var(--muted))';
  };

  return (
    <div className="space-y-3 p-4 rounded-xl" style={{ backgroundColor: emotion.bgColor }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emotion.icon}</span>
          <span className="font-medium text-foreground">{emotion.label}</span>
        </div>
        <span 
          className="text-sm font-semibold px-3 py-1 rounded-full"
          style={{ backgroundColor: emotion.color, color: 'white' }}
        >
          {intensityLabel}
        </span>
      </div>

      {/* Track */}
      <div className="relative">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: emotion.color }}
            initial={false}
            animate={{ width: `${(value / 5) * 100}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between mt-3">
          {steps.map((step) => (
            <button
              key={step}
              onClick={() => onChange(step)}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                step === value && 'scale-110 shadow-lg'
              )}
              style={{
                backgroundColor: getStepColor(step),
                color: step <= value ? 'white' : 'hsl(var(--muted-foreground))',
              }}
            >
              {step}
            </button>
          ))}
        </div>

        {/* Labels de intensidade */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>{emotion.lowIntensity.label}</span>
          <span>{emotion.highIntensity.label}</span>
        </div>
      </div>
    </div>
  );
}
