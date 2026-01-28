import { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Plus, Coffee, Leaf, GlassWater } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useHydrationEntries } from '@/hooks/useNutrition';
import { toast } from 'sonner';

interface WaterTrackerProps {
  goal?: number; // in ml
  compact?: boolean;
}

type LiquidType = 'água' | 'café' | 'chá' | 'suco' | 'outro';

const WATER_AMOUNTS = [150, 250, 350, 500];

const liquidTypeConfig: Record<LiquidType, { icon: React.ReactNode; label: string; color: string }> = {
  'água': { 
    icon: <Droplets className="w-4 h-4" />, 
    label: 'Água', 
    color: 'hsl(var(--water))' 
  },
  'café': { 
    icon: <Coffee className="w-4 h-4" />, 
    label: 'Café', 
    color: 'hsl(25, 60%, 45%)' 
  },
  'chá': { 
    icon: <Leaf className="w-4 h-4" />, 
    label: 'Chá', 
    color: 'hsl(120, 40%, 45%)' 
  },
  'suco': { 
    icon: <GlassWater className="w-4 h-4" />, 
    label: 'Suco', 
    color: 'hsl(35, 80%, 50%)' 
  },
  'outro': { 
    icon: <Droplets className="w-4 h-4" />, 
    label: 'Outro', 
    color: 'hsl(var(--muted-foreground))' 
  },
};

export function WaterTracker({ goal = 2000, compact = false }: WaterTrackerProps) {
  const { totalToday, waterToday, otherLiquidsToday, addWater, isAddingWater } = useHydrationEntries();
  const [selectedAmount, setSelectedAmount] = useState(250);
  const [selectedLiquid, setSelectedLiquid] = useState<LiquidType>('água');
  const [showLiquidSelector, setShowLiquidSelector] = useState(false);

  // Water percentage is based on water only (health recommendation)
  const waterPercentage = Math.min((waterToday / goal) * 100, 100);
  const glasses = Math.floor(waterToday / 250);

  const handleAddWater = async () => {
    try {
      await addWater(selectedAmount, selectedLiquid);
      const liquidLabel = liquidTypeConfig[selectedLiquid].label;
      toast.success(`+${selectedAmount}ml de ${liquidLabel}! 💧`);
      setShowLiquidSelector(false);
    } catch (error) {
      toast.error('Erro ao registrar');
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
                {waterToday}ml / {goal}ml
              </p>
              <p className="text-xs text-muted-foreground">
                {glasses} copos de água hoje
                {otherLiquidsToday > 0 && ` • +${otherLiquidsToday}ml outros`}
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
            animate={{ width: `${waterPercentage}%` }}
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
          <p className="text-sm text-muted-foreground">
            {glasses} copos de água
            {otherLiquidsToday > 0 && ` • +${otherLiquidsToday}ml outros`}
          </p>
        </div>
      </div>

      {/* Visual progress */}
      <div className="relative h-40 mb-6 flex items-end justify-center">
        <div className="relative w-24 h-32 border-4 border-[hsl(var(--water)/0.3)] rounded-b-3xl rounded-t-lg overflow-hidden">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${waterPercentage}%` }}
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
          <span className="text-sm font-bold text-[hsl(var(--water))]">{Math.round(waterPercentage)}%</span>
        </div>
      </div>

      {/* Stats */}
      <div className="text-center mb-6">
        <p className="text-3xl font-bold text-foreground">{waterToday}ml</p>
        <p className="text-sm text-muted-foreground">de água / {goal}ml</p>
        {otherLiquidsToday > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            + {otherLiquidsToday}ml de outros líquidos
          </p>
        )}
      </div>

      {/* Liquid type selector */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Tipo de líquido</p>
        <div className="flex gap-2">
          {(Object.keys(liquidTypeConfig) as LiquidType[]).map((liquid) => {
            const config = liquidTypeConfig[liquid];
            return (
              <button
                key={liquid}
                onClick={() => setSelectedLiquid(liquid)}
                className={cn(
                  'flex-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-1',
                  selectedLiquid === liquid
                    ? 'text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
                style={selectedLiquid === liquid ? { backgroundColor: config.color } : {}}
              >
                {config.icon}
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
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
                ? 'text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
            style={selectedAmount === amount ? { backgroundColor: liquidTypeConfig[selectedLiquid].color } : {}}
          >
            {amount}ml
          </button>
        ))}
      </div>

      {/* Add button */}
      <button
        onClick={handleAddWater}
        disabled={isAddingWater}
        className="w-full py-4 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all hover:opacity-90"
        style={{ backgroundColor: liquidTypeConfig[selectedLiquid].color }}
      >
        <Plus className="w-5 h-5" />
        Adicionar {selectedAmount}ml de {liquidTypeConfig[selectedLiquid].label}
      </button>
    </motion.div>
  );
}
