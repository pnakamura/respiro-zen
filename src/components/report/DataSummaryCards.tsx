import { motion } from "framer-motion";
import { Heart, Wind, BookOpen, Droplets } from "lucide-react";
import type { DataSummary } from "@/hooks/useWellnessReport";

interface DataSummaryCardsProps {
  summary: DataSummary;
}

export function DataSummaryCards({ summary }: DataSummaryCardsProps) {
  const cards = [
    {
      icon: Heart,
      label: 'Check-ins',
      value: summary.emotions.totalCheckins,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
    {
      icon: Wind,
      label: 'Min. Respiração',
      value: summary.breathing.totalMinutes,
      color: 'text-teal-500',
      bg: 'bg-teal-500/10',
    },
    {
      icon: BookOpen,
      label: 'Palavras',
      value: summary.journal.totalWords,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      icon: Droplets,
      label: 'Água (média)',
      value: `${(summary.hydration.avgDaily / 1000).toFixed(1)}L`,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="grid grid-cols-4 gap-2"
    >
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-card/50 border border-border/30"
          >
            <div className={`p-1.5 rounded-lg ${card.bg} mb-1`}>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <span className="text-lg font-bold text-foreground">{card.value}</span>
            <span className="text-[10px] text-muted-foreground text-center leading-tight">{card.label}</span>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
