import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Flower2, TreePine } from 'lucide-react';
import type { ExperienceLevel as ExperienceLevelType } from '@/hooks/useOnboarding';

interface ExperienceOption {
  id: ExperienceLevelType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const EXPERIENCES: ExperienceOption[] = [
  { 
    id: 'beginner', 
    label: 'Iniciante', 
    description: 'Nunca pratiquei meditação',
    icon: <Sprout className="w-8 h-8" />
  },
  { 
    id: 'intermediate', 
    label: 'Intermediário', 
    description: 'Já experimentei algumas vezes',
    icon: <Flower2 className="w-8 h-8" />
  },
  { 
    id: 'advanced', 
    label: 'Experiente', 
    description: 'Pratico regularmente',
    icon: <TreePine className="w-8 h-8" />
  },
];

interface ExperienceLevelProps {
  selected: ExperienceLevelType | null;
  onChange: (level: ExperienceLevelType) => void;
}

export function ExperienceLevelSelector({ selected, onChange }: ExperienceLevelProps) {
  return (
    <div className="w-full space-y-3">
      {EXPERIENCES.map((exp, index) => {
        const isSelected = selected === exp.id;

        return (
          <motion.button
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onChange(exp.id)}
            className={`
              w-full p-5 rounded-2xl border-2 transition-all duration-200
              flex items-center gap-4 text-left
              ${isSelected 
                ? 'border-primary bg-primary/10' 
                : 'border-border bg-card hover:border-primary/50'
              }
            `}
          >
            <div className={`
              w-14 h-14 rounded-xl flex items-center justify-center
              ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {exp.icon}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                {exp.label}
              </h3>
              <p className="text-sm text-muted-foreground">{exp.description}</p>
            </div>
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'}
            `}>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 rounded-full bg-primary-foreground"
                />
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
