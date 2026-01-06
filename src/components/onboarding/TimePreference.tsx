import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Coffee, Sunset, Moon, Clock } from 'lucide-react';
import type { PreferredTime } from '@/hooks/useOnboarding';

interface TimeOption {
  id: PreferredTime;
  label: string;
  icon: React.ReactNode;
}

const TIMES: TimeOption[] = [
  { id: 'morning', label: 'Ao acordar', icon: <Sun className="w-6 h-6" /> },
  { id: 'lunch', label: 'Durante o almoço', icon: <Coffee className="w-6 h-6" /> },
  { id: 'evening', label: 'Fim do dia', icon: <Sunset className="w-6 h-6" /> },
  { id: 'bedtime', label: 'Antes de dormir', icon: <Moon className="w-6 h-6" /> },
  { id: 'anytime', label: 'Quando precisar', icon: <Clock className="w-6 h-6" /> },
];

interface TimePreferenceProps {
  selected: PreferredTime | null;
  onChange: (time: PreferredTime) => void;
}

export function TimePreference({ selected, onChange }: TimePreferenceProps) {
  return (
    <div className="w-full grid grid-cols-2 gap-3">
      {TIMES.map((time, index) => {
        const isSelected = selected === time.id;
        const isFullWidth = index === TIMES.length - 1 && TIMES.length % 2 !== 0;

        return (
          <motion.button
            key={time.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onChange(time.id)}
            className={`
              p-4 rounded-2xl border-2 transition-all duration-200
              flex flex-col items-center gap-2 text-center
              ${isFullWidth ? 'col-span-2' : ''}
              ${isSelected 
                ? 'border-primary bg-primary/10 text-primary' 
                : 'border-border bg-card hover:border-primary/50'
              }
            `}
          >
            <div className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
              {time.icon}
            </div>
            <span className="text-sm font-medium">{time.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
