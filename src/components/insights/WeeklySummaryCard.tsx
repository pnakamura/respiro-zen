import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { WeeklySummary } from '@/hooks/useInsightsData';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
}

export function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const { emoji, headline, score, comparison, comparisonPercentage } = summary;

  const getComparisonIcon = () => {
    switch (comparison) {
      case 'up': return <ArrowUp className="w-4 h-4" />;
      case 'down': return <ArrowDown className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getComparisonColor = () => {
    switch (comparison) {
      case 'up': return 'text-emerald-500 bg-emerald-500/10';
      case 'down': return 'text-orange-500 bg-orange-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getScoreColor = () => {
    if (score >= 70) return 'from-emerald-400 to-emerald-600';
    if (score >= 50) return 'from-primary to-primary/80';
    if (score >= 30) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-elevated p-6 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="relative flex items-center gap-5">
        {/* Emoji and Score Ring */}
        <div className="relative">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="6"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={213.6}
              initial={{ strokeDashoffset: 213.6 }}
              animate={{ strokeDashoffset: 213.6 - (213.6 * score / 100) }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            />
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" className={getScoreColor().split(' ')[0].replace('from-', 'text-')} stopColor="currentColor" />
                <stop offset="100%" className={getScoreColor().split(' ')[1].replace('to-', 'text-')} stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="text-3xl"
            >
              {emoji}
            </motion.span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <motion.h2
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg font-bold text-foreground truncate"
          >
            {headline}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mt-2"
          >
            <span className="text-2xl font-bold text-foreground">
              {score}
            </span>
            <span className="text-sm text-muted-foreground">pontos</span>
            
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getComparisonColor()}`}>
              {getComparisonIcon()}
              <span>{comparisonPercentage}%</span>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xs text-muted-foreground mt-2"
          >
            Baseado nos seus check-ins, práticas e hidratação
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
