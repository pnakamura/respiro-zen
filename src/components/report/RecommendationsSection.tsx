import { motion } from "framer-motion";
import { Target, Wind, Brain, BookOpen, Droplets, Compass, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Recommendation } from "@/hooks/useWellnessReport";

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  const getCategoryConfig = (category: Recommendation['category']) => {
    switch (category) {
      case 'respiração':
        return { icon: Wind, color: 'text-teal-500', bg: 'bg-teal-500/10', route: '/' };
      case 'meditação':
        return { icon: Brain, color: 'text-indigo-500', bg: 'bg-indigo-500/10', route: '/' };
      case 'diário':
        return { icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-500/10', route: '/journal' };
      case 'hidratação':
        return { icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10', route: '/nutrition' };
      case 'jornada':
        return { icon: Compass, color: 'text-purple-500', bg: 'bg-purple-500/10', route: '/journeys' };
      default:
        return { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', route: '/' };
    }
  };

  const handleRecommendationClick = (route: string) => {
    navigate(route);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="space-y-3"
    >
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Target className="w-4 h-4 text-primary" />
        Recomendações para Você
      </h3>

      <div className="space-y-2">
        {recommendations.map((rec, index) => {
          const config = getCategoryConfig(rec.category);
          const Icon = config.icon;

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleRecommendationClick(config.route)}
              className="w-full flex items-start gap-3 p-4 rounded-xl bg-card/80 border border-border/50 hover:border-primary/30 transition-all text-left group"
            >
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`w-5 h-5 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {rec.action}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{rec.reason}</p>
              </div>
              <div className="text-muted-foreground group-hover:text-primary transition-colors">
                →
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
