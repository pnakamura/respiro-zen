import { motion } from 'framer-motion';
import { Heart, Wind, Droplets, CalendarCheck } from 'lucide-react';

interface InsightsStatsProps {
  stats: {
    emotionCheckins: number;
    breathingSessions: number;
    breathingMinutes: number;
    waterLiters: number;
    activeDays: number;
  };
}

export function InsightsStats({ stats }: InsightsStatsProps) {
  const statItems = [
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="grid grid-cols-4 gap-2"
    >
      {statItems.map((item, index) => (
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
  );
}
