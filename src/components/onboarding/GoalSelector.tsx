import React from 'react';
import { motion } from 'framer-motion';
import { Check, Brain, Moon, Target, Sparkles, Heart, Leaf } from 'lucide-react';
import type { UserGoal } from '@/hooks/useOnboarding';

interface GoalOption {
  id: UserGoal;
  label: string;
  icon: React.ReactNode;
}

const GOALS: GoalOption[] = [
  { id: 'reduce_stress', label: 'Reduzir estresse', icon: <Brain className="w-6 h-6" /> },
  { id: 'sleep_better', label: 'Dormir melhor', icon: <Moon className="w-6 h-6" /> },
  { id: 'focus', label: 'Foco e clareza', icon: <Target className="w-6 h-6" /> },
  { id: 'self_knowledge', label: 'Autoconhecimento', icon: <Sparkles className="w-6 h-6" /> },
  { id: 'emotional_balance', label: 'Equilíbrio emocional', icon: <Heart className="w-6 h-6" /> },
  { id: 'mindfulness', label: 'Mindfulness', icon: <Leaf className="w-6 h-6" /> },
];

interface GoalSelectorProps {
  selected: UserGoal[];
  onChange: (goals: UserGoal[]) => void;
  maxSelections?: number;
}

export function GoalSelector({ selected, onChange, maxSelections = 3 }: GoalSelectorProps) {
  const toggleGoal = (goalId: UserGoal) => {
    if (selected.includes(goalId)) {
      onChange(selected.filter(g => g !== goalId));
    } else if (selected.length < maxSelections) {
      onChange([...selected, goalId]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        Selecione até {maxSelections} objetivos
      </p>
      <div className="grid grid-cols-2 gap-3">
        {GOALS.map((goal, index) => {
          const isSelected = selected.includes(goal.id);
          const isDisabled = !isSelected && selected.length >= maxSelections;

          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleGoal(goal.id)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-2xl border-2 transition-all duration-200
                flex flex-col items-center gap-2 text-center
                ${isSelected 
                  ? 'border-primary bg-primary/10 text-primary' 
                  : 'border-border bg-card hover:border-primary/50'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
              <div className={isSelected ? 'text-primary' : 'text-muted-foreground'}>
                {goal.icon}
              </div>
              <span className="text-sm font-medium">{goal.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
