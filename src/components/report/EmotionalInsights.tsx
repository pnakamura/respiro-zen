import { motion } from "framer-motion";
import { Heart, AlertCircle, Info } from "lucide-react";
import type { EmotionalInsight } from "@/hooks/useWellnessReport";

interface EmotionalInsightsProps {
  insights: EmotionalInsight[];
}

export function EmotionalInsights({ insights }: EmotionalInsightsProps) {
  if (!insights || insights.length === 0) return null;

  const getTypeConfig = (type: EmotionalInsight['type']) => {
    switch (type) {
      case 'positive':
        return {
          icon: Heart,
          bgColor: 'bg-green-500/10',
          iconColor: 'text-green-500',
          borderColor: 'border-green-500/20',
        };
      case 'attention':
        return {
          icon: AlertCircle,
          bgColor: 'bg-amber-500/10',
          iconColor: 'text-amber-500',
          borderColor: 'border-amber-500/20',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-500/10',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-500/20',
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="space-y-3"
    >
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Heart className="w-4 h-4 text-primary" />
        Insights Emocionais
      </h3>

      <div className="space-y-2">
        {insights.map((insight, index) => {
          const config = getTypeConfig(insight.type);
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className={`flex gap-3 p-3 rounded-lg ${config.bgColor} border ${config.borderColor}`}
            >
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
