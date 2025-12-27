import { motion } from 'framer-motion';
import { Flame, Apple, Wheat, Droplet } from 'lucide-react';
import { useTodayNutritionSummary } from '@/hooks/useNutrition';
import { Skeleton } from '@/components/ui/skeleton';

interface NutritionSummaryProps {
  calorieGoal?: number;
}

export function NutritionSummary({ calorieGoal = 2000 }: NutritionSummaryProps) {
  const { data: summary, isLoading } = useTodayNutritionSummary();

  if (isLoading) {
    return (
      <div className="bg-card border border-border/50 rounded-3xl p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const macros = [
    {
      label: 'Calorias',
      value: summary?.totalCalories ?? 0,
      unit: 'kcal',
      goal: calorieGoal,
      icon: Flame,
      color: 'hsl(var(--nutrition))',
    },
    {
      label: 'Proteínas',
      value: summary?.totalProteins ?? 0,
      unit: 'g',
      icon: Apple,
      color: 'hsl(145 60% 45%)',
    },
    {
      label: 'Carboidratos',
      value: summary?.totalCarbs ?? 0,
      unit: 'g',
      icon: Wheat,
      color: 'hsl(45 90% 50%)',
    },
    {
      label: 'Gorduras',
      value: summary?.totalFats ?? 0,
      unit: 'g',
      icon: Droplet,
      color: 'hsl(200 60% 50%)',
    },
  ];

  const caloriePercentage = Math.min(
    ((summary?.totalCalories ?? 0) / calorieGoal) * 100,
    100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-3xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-foreground">Resumo do dia</h3>
          <p className="text-sm text-muted-foreground">
            {summary?.mealsCount ?? 0} refeições registradas
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-nutrition/10 text-nutrition text-sm font-medium">
          {Math.round(caloriePercentage)}%
        </div>
      </div>

      {/* Calorie progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-3xl font-bold text-foreground">
            {summary?.totalCalories ?? 0}
          </span>
          <span className="text-sm text-muted-foreground">
            / {calorieGoal} kcal
          </span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${caloriePercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-nutrition rounded-full"
          />
        </div>
      </div>

      {/* Macros grid */}
      <div className="grid grid-cols-3 gap-3">
        {macros.slice(1).map((macro, index) => {
          const Icon = macro.icon;
          return (
            <motion.div
              key={macro.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/50 rounded-2xl p-4 text-center"
            >
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${macro.color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color: macro.color }} />
              </div>
              <p className="text-lg font-bold text-foreground">
                {Math.round(macro.value)}
                <span className="text-xs font-normal text-muted-foreground ml-0.5">
                  {macro.unit}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{macro.label}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
