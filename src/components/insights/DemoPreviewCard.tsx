import { motion } from 'framer-motion';
import { TrendingUp, Sparkles } from 'lucide-react';

export function DemoPreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-secondary/10 border border-border/50 p-4"
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-gradient-to-t from-background/60 to-transparent z-10" />
      
      {/* Preview content */}
      <div className="space-y-3">
        {/* Mini stats row */}
        <div className="flex gap-2">
          {[
            { label: 'Check-ins', value: '12' },
            { label: 'Respiração', value: '45min' },
            { label: 'Água', value: '1.8L' },
          ].map((stat, i) => (
            <div key={i} className="flex-1 bg-muted/50 rounded-xl p-2 text-center">
              <div className="text-sm font-bold text-foreground">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mini chart preview */}
        <div className="h-16 flex items-end justify-between gap-1 px-2">
          {[3, 4, 2, 5, 3, 4, 5].map((height, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${height * 12}px` }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="flex-1 bg-gradient-to-t from-primary/40 to-primary/20 rounded-t-md"
            />
          ))}
        </div>

        {/* Mini pattern */}
        <div className="flex items-center gap-2 bg-muted/30 rounded-xl p-2">
          <span className="text-base">🌅</span>
          <div className="flex-1">
            <div className="h-2 w-24 bg-muted rounded" />
            <div className="h-1.5 w-16 bg-muted/50 rounded mt-1" />
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full shadow-lg"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span className="text-xs font-semibold">Ver prévia completa</span>
      </motion.div>
    </motion.div>
  );
}
