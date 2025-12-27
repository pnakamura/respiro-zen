import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHydrationEntries } from '@/hooks/useNutrition';
import { toast } from 'sonner';

interface WaterTrackerProps {
  goal?: number; // in ml
  compact?: boolean;
}

const WATER_AMOUNTS = [150, 250, 350, 500];

export function WaterTracker({ goal = 2000, compact = false }: WaterTrackerProps) {
  const { totalToday, addWater, isAddingWater } = useHydrationEntries();
  const [selectedAmount, setSelectedAmount] = useState(250);

  const percentage = Math.min((totalToday / goal) * 100, 100);
  const glasses = Math.floor(totalToday / 250);

  const handleAddWater = async () => {
    try {
      await addWater(selectedAmount);
      toast.success(`+${selectedAmount}ml de água! 💧`);
    } catch (error) {
      toast.error('Erro ao registrar água');
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[hsl(var(--water)/0.1)] border border-[hsl(var(--water)/0.2)] rounded-2xl p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--water)/0.2)] flex items-center justify-center">
              <Droplets className="w-5 h-5 text-[hsl(var(--water))]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {totalToday}ml / {goal}ml
              </p>
              <p className="text-xs text-muted-foreground">
                {glasses} copos hoje
              </p>
            </div>
          </div>
          
          <button
            onClick={handleAddWater}
            disabled={isAddingWater}
            className="w-10 h-10 rounded-xl bg-[hsl(var(--water))] text-white flex items-center justify-center disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="h-full bg-[hsl(var(--water))] rounded-full"
          />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-3xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--water)/0.15)] flex items-center justify-center">
          <Droplets className="w-6 h-6 text-[hsl(var(--water))]" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Hidratação</h3>
          <p className="text-sm text-muted-foreground">{glasses} copos hoje</p>
        </div>
      </div>

      {/* Visual progress */}
      <div className="relative h-40 mb-6 flex items-end justify-center">
        <div className="relative w-24 h-32 border-4 border-[hsl(var(--water)/0.3)] rounded-b-3xl rounded-t-lg overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[hsl(var(--water))] to-[hsl(var(--water)/0.6)]"
          />
          
          {/* Water waves effect */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-0 right-0 h-full"
            style={{ 
              clipPath: 'ellipse(60% 8% at 50% 100%)',
              backgroundColor: 'hsl(var(--water) / 0.4)',
            }}
          />
        </div>
        
        {/* Percentage label */}
        <div className="absolute top-0 right-0 bg-[hsl(var(--water)/0.1)] px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-[hsl(var(--water))]">{Math.round(percentage)}%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="text-center mb-6">
        <p className="text-3xl font-bold text-foreground">{totalToday}ml</p>
        <p className="text-sm text-muted-foreground">de {goal}ml</p>
      </div>

      {/* Amount selector */}
      <div className="flex gap-2 mb-4">
        {WATER_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            className={cn(
              'flex-1 py-2 rounded-xl text-sm font-medium transition-all',
              selectedAmount === amount
                ? 'bg-[hsl(var(--water))] text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {amount}ml
          </button>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={handleAddWater}
        disabled={isAddingWater}
        className="w-full py-4 rounded-2xl bg-[hsl(var(--water))] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
      >
        <Plus className="w-5 h-5" />
        Adicionar {selectedAmount}ml
      </button>
    </motion.div>
  );
}
