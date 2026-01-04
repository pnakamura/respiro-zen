import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface WellnessScoreCardProps {
  score: number;
  emoji: string;
  headline: string;
}

export function WellnessScoreCard({ score, emoji, headline }: WellnessScoreCardProps) {
  const getScoreColor = () => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-orange-500';
  };

  const getScoreLabel = () => {
    if (score >= 80) return 'Excelente';
    if (score >= 65) return 'Muito Bom';
    if (score >= 50) return 'Bom';
    if (score >= 35) return 'Em Progresso';
    return 'Iniciando';
  };

  const getGradient = () => {
    if (score >= 75) return 'from-green-500/20 to-emerald-500/10';
    if (score >= 50) return 'from-yellow-500/20 to-amber-500/10';
    return 'from-orange-500/20 to-red-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getGradient()} border border-border/50 p-5`}
    >
      {/* Background emoji */}
      <div className="absolute -right-4 -top-4 text-8xl opacity-20 select-none">
        {emoji}
      </div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="text-5xl"
            >
              {emoji}
            </motion.div>
            <div>
              <div className="flex items-baseline gap-2">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className={`text-4xl font-bold ${getScoreColor()}`}
                >
                  {score}
                </motion.span>
                <span className="text-muted-foreground text-sm">/100</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {getScoreLabel()}
              </p>
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-foreground font-medium text-base leading-relaxed max-w-[280px]"
          >
            "{headline}"
          </motion.p>
        </div>

        {/* Score ring */}
        <div className="relative w-16 h-16">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-secondary/50"
            />
            <motion.circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={getScoreColor()}
              strokeDasharray={`${score} 100`}
              initial={{ strokeDasharray: "0 100" }}
              animate={{ strokeDasharray: `${score} 100` }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
