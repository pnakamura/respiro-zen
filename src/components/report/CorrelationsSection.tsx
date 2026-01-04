import { motion } from "framer-motion";
import { Lightbulb, Zap } from "lucide-react";
import type { Correlation } from "@/hooks/useWellnessReport";

interface CorrelationsSectionProps {
  correlations: Correlation[];
}

export function CorrelationsSection({ correlations }: CorrelationsSectionProps) {
  if (!correlations || correlations.length === 0) return null;

  const getConfidenceColor = (confidence: Correlation['confidence']) => {
    switch (confidence) {
      case 'alta':
        return 'bg-green-500';
      case 'média':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-3"
    >
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        Correlações Descobertas
      </h3>

      <div className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-xl border border-amber-500/20 p-4 space-y-3">
        {correlations.map((correlation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-start gap-3"
          >
            <Zap className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-foreground">{correlation.insight}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getConfidenceColor(correlation.confidence)}`} />
                <span className="text-xs text-muted-foreground capitalize">
                  Confiança {correlation.confidence}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
