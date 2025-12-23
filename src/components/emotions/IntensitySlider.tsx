import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IntensitySliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function IntensitySlider({ value, onChange, min = 1, max = 5 }: IntensitySliderProps) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);
  const labels = ['Muito leve', 'Leve', 'Moderado', 'Intenso', 'Muito intenso'];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Intensidade</span>
        <span className="text-sm text-muted-foreground">
          {labels[value - 1]}
        </span>
      </div>
      
      <div className="relative">
        {/* Track */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-calm via-primary to-panic rounded-full"
            initial={false}
            animate={{ width: `${((value - min) / (max - min)) * 100}%` }}
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
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                step === value
                  ? 'bg-primary text-primary-foreground scale-110 shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              )}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
