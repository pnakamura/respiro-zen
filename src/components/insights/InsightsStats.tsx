import { motion } from 'framer-motion';
import { Heart, Wind, Droplets, CalendarCheck, Flame, Sparkles } from 'lucide-react';
import { InsightsStats as InsightsStatsType } from '@/hooks/useInsightsData';

interface InsightsStatsProps {
  stats: InsightsStatsType;
}

export function InsightsStats({ stats }: InsightsStatsProps) {
  const mainStats = [
    {
      icon: Heart,
      value: stats.emotionCheckins,
      label: 'Check-ins',
      color: 'text-energy',
      bg: 'bg-energy/10',
    },
    {
      icon: Wind,
      value: stats.breathingMinutes,
      label: 'min respirando',
      color: 'text-calm',
      bg: 'bg-calm/10',
    },
    {
      icon: Droplets,
      value: `${stats.waterLiters}L`,
      label: 'água',
      color: 'text-meditate',
      bg: 'bg-meditate/10',
    },
    {
      icon: CalendarCheck,
      value: stats.activeDays,
      label: 'dias ativos',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
  ];

  const moodVariationLabel = {
    stable: { label: 'Estável', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    variable: { label: 'Variável', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    highly_variable: { label: 'Intenso', color: 'text-orange-500', bg: 'bg-orange-500/10' },
  };

  const moodInfo = moodVariationLabel[stats.moodVariation];

  return (
    <div className="space-y-3">
      {/* Main stats grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-2"
      >
        {mainStats.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="card-elevated p-3 flex flex-col items-center text-center"
          >
            <div className={`w-8 h-8 rounded-xl ${item.bg} flex items-center justify-center mb-2`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <span className="text-lg font-bold text-foreground">{item.value}</span>
            <span className="text-[10px] text-muted-foreground leading-tight">{item.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Secondary stats row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-2"
      >
        {/* Dominant Emotion */}
        {stats.dominantEmotion && (
          <div className="card-elevated p-3 flex items-center gap-2">
            <span className="text-xl">{stats.dominantEmotion.icon}</span>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">Dominante</p>
              <p className="text-xs font-semibold text-foreground truncate">{stats.dominantEmotion.label}</p>
            </div>
          </div>
        )}

        {/* Frequent Dyad */}
        {stats.frequentDyad && (
          <div className="card-elevated p-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">Díade</p>
              <p className="text-xs font-semibold text-foreground truncate">{stats.frequentDyad.label}</p>
            </div>
          </div>
        )}

        {/* Streak */}
        {stats.checkinStreak > 0 && (
          <div className="card-elevated p-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Flame className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">Sequência</p>
              <p className="text-xs font-semibold text-foreground">{stats.checkinStreak} dias</p>
            </div>
          </div>
        )}

        {/* Mood Variation - show if no streak */}
        {stats.checkinStreak === 0 && (
          <div className="card-elevated p-3 flex items-center gap-2">
            <div className={`w-7 h-7 rounded-lg ${moodInfo.bg} flex items-center justify-center`}>
              <span className="text-xs">📊</span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">Humor</p>
              <p className={`text-xs font-semibold ${moodInfo.color}`}>{moodInfo.label}</p>
            </div>
          </div>
        )}

        {/* Fill empty slots */}
        {!stats.dominantEmotion && <div />}
        {!stats.frequentDyad && <div />}
      </motion.div>
    </div>
  );
}
