import { motion } from 'framer-motion';
import { DyadOccurrence } from '@/hooks/useInsightsData';

interface DyadTimelineProps {
  dyads: DyadOccurrence[];
}

const DYAD_COLORS: Record<string, string> = {
  love: 'bg-pink-500',
  optimism: 'bg-amber-500',
  hope: 'bg-emerald-500',
  submission: 'bg-slate-500',
  awe: 'bg-violet-500',
  disapproval: 'bg-blue-500',
  remorse: 'bg-indigo-500',
  contempt: 'bg-red-500',
  aggressiveness: 'bg-orange-500',
  guilt: 'bg-rose-500',
  curiosity: 'bg-cyan-500',
  despair: 'bg-gray-600',
  unbelief: 'bg-purple-500',
  envy: 'bg-lime-600',
  cynicism: 'bg-stone-500',
  pride: 'bg-yellow-500',
  delight: 'bg-teal-500',
  sentimentality: 'bg-fuchsia-500',
  shame: 'bg-rose-600',
  outrage: 'bg-red-600',
  pessimism: 'bg-slate-600',
  morbidness: 'bg-zinc-600',
  dominance: 'bg-amber-600',
  anxiety: 'bg-orange-600',
};

export function DyadTimeline({ dyads }: DyadTimelineProps) {
  if (dyads.length === 0) {
    return null;
  }

  const topDyads = dyads.slice(0, 6);
  const maxCount = Math.max(...topDyads.map(d => d.count));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">💫</span>
        <span className="text-sm font-semibold text-foreground">Combinações Emocionais</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {topDyads.map((dyad, index) => {
          const size = 40 + (dyad.count / maxCount) * 40;
          const colorClass = DYAD_COLORS[dyad.dyad] || 'bg-primary';

          return (
            <motion.div
              key={dyad.dyad}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.08, type: 'spring', stiffness: 200 }}
              className="group relative"
            >
              <div
                className={`rounded-full ${colorClass} flex items-center justify-center text-white font-bold text-xs shadow-md cursor-pointer transition-transform hover:scale-110`}
                style={{ width: size, height: size }}
              >
                {dyad.count}
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-card border border-border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 min-w-[140px]">
                <p className="font-semibold text-xs text-foreground text-center">{dyad.label}</p>
                <p className="text-[10px] text-muted-foreground text-center mt-1">{dyad.description}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                  <div className="w-2 h-2 bg-card border-r border-b border-border rotate-45" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {dyads.length > 6 && (
        <p className="text-xs text-muted-foreground mt-3">
          +{dyads.length - 6} outras combinações detectadas
        </p>
      )}
    </motion.div>
  );
}
