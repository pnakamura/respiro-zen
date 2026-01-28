import { motion } from 'framer-motion';
import { Utensils, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, format, parseISO, getHours } from 'date-fns';
import { cn } from '@/lib/utils';

interface NutritionInsightsCardProps {
  periodDays: number;
}

interface HungerStats {
  physical: number;
  emotional: number;
  unknown: number;
  total: number;
}

interface TimePattern {
  period: string;
  label: string;
  emotionalCount: number;
  physicalCount: number;
}

export function NutritionInsightsCard({ periodDays }: NutritionInsightsCardProps) {
  const { user } = useAuth();
  const startDate = subDays(new Date(), periodDays);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['nutrition-insights', user?.id, periodDays],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('emotion_nutrition_context')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  if (isLoading || entries.length === 0) {
    return null;
  }

  // Calculate hunger type statistics
  const hungerStats: HungerStats = entries.reduce(
    (acc, entry) => {
      const type = entry.hunger_type as keyof HungerStats;
      if (type in acc) {
        acc[type]++;
      }
      acc.total++;
      return acc;
    },
    { physical: 0, emotional: 0, unknown: 0, total: 0 }
  );

  // Calculate time patterns
  const timePatterns: TimePattern[] = [
    { period: 'morning', label: 'Manhã (6h-12h)', emotionalCount: 0, physicalCount: 0 },
    { period: 'afternoon', label: 'Tarde (12h-18h)', emotionalCount: 0, physicalCount: 0 },
    { period: 'evening', label: 'Noite (18h-24h)', emotionalCount: 0, physicalCount: 0 },
  ];

  entries.forEach((entry) => {
    const hour = getHours(parseISO(entry.created_at));
    let periodIndex = 0;
    if (hour >= 12 && hour < 18) periodIndex = 1;
    else if (hour >= 18) periodIndex = 2;

    if (entry.hunger_type === 'emotional') {
      timePatterns[periodIndex].emotionalCount++;
    } else if (entry.hunger_type === 'physical') {
      timePatterns[periodIndex].physicalCount++;
    }
  });

  // Find peak emotional hunger period
  const peakEmotionalPeriod = timePatterns.reduce((peak, current) =>
    current.emotionalCount > peak.emotionalCount ? current : peak
  );

  // Calculate percentages
  const physicalPercentage = hungerStats.total > 0 
    ? Math.round((hungerStats.physical / hungerStats.total) * 100) 
    : 0;
  const emotionalPercentage = hungerStats.total > 0 
    ? Math.round((hungerStats.emotional / hungerStats.total) * 100) 
    : 0;

  // Energy after insights
  const energyStats = entries.reduce((acc, entry) => {
    if (entry.energy_after) {
      acc[entry.energy_after] = (acc[entry.energy_after] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const mostCommonEnergy = Object.entries(energyStats).sort((a, b) => b[1] - a[1])[0];

  const energyLabels: Record<string, { emoji: string; label: string }> = {
    sleepy: { emoji: '😴', label: 'sonolento' },
    satisfied: { emoji: '😌', label: 'satisfeito' },
    energized: { emoji: '⚡', label: 'energizado' },
    uncomfortable: { emoji: '🤢', label: 'desconfortável' },
    normal: { emoji: '😐', label: 'normal' },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Utensils className="w-4 h-4 text-nutrition" />
        <span className="text-sm font-semibold text-foreground">Alimentação Consciente</span>
      </div>

      {/* Hunger Type Distribution */}
      <div className="mb-5">
        <p className="text-xs text-muted-foreground mb-2">Tipo de fome ({entries.length} registros)</p>
        
        <div className="flex gap-2 mb-2">
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden flex">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${physicalPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full bg-emerald-500"
            />
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${emotionalPercentage}%` }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-full bg-orange-500"
            />
          </div>
        </div>

        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Física: {physicalPercentage}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">Emocional: {emotionalPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-3">
        {/* Emotional hunger pattern */}
        {peakEmotionalPeriod.emotionalCount >= 2 && (
          <div className={cn(
            'flex items-start gap-3 p-3 rounded-xl border-l-4',
            'border-l-orange-500 bg-orange-500/5'
          )}>
            <Clock className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Fome emocional mais comum à {peakEmotionalPeriod.label.split(' ')[0].toLowerCase()}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {peakEmotionalPeriod.emotionalCount} registros neste período
              </p>
            </div>
          </div>
        )}

        {/* Energy after insight */}
        {mostCommonEnergy && (
          <div className={cn(
            'flex items-start gap-3 p-3 rounded-xl border-l-4',
            mostCommonEnergy[0] === 'satisfied' || mostCommonEnergy[0] === 'energized'
              ? 'border-l-emerald-500 bg-emerald-500/5'
              : mostCommonEnergy[0] === 'uncomfortable' || mostCommonEnergy[0] === 'sleepy'
              ? 'border-l-orange-500 bg-orange-500/5'
              : 'border-l-primary bg-primary/5'
          )}>
            <TrendingUp className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Após comer, você geralmente se sente {energyLabels[mostCommonEnergy[0]]?.label || mostCommonEnergy[0]}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {mostCommonEnergy[1]} de {entries.filter(e => e.energy_after).length} refeições com este feedback
              </p>
            </div>
          </div>
        )}

        {/* High emotional hunger alert */}
        {emotionalPercentage >= 40 && hungerStats.total >= 5 && (
          <div className={cn(
            'flex items-start gap-3 p-3 rounded-xl border-l-4',
            'border-l-orange-500 bg-orange-500/5'
          )}>
            <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Atenção à fome emocional
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {emotionalPercentage}% das suas refeições foram por fome emocional. Considere praticar respiração antes de comer.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
