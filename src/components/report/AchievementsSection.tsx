import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Achievement } from "@/hooks/useWellnessReport";

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  if (!achievements || achievements.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="space-y-3"
    >
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        <Trophy className="w-4 h-4 text-amber-500" />
        Conquistas da Semana
      </h3>

      <div className="flex flex-wrap gap-2">
        {achievements.map((achievement, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.7 + index * 0.1,
              type: "spring",
              stiffness: 200 
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20"
          >
            <span className="text-lg">{achievement.emoji}</span>
            <span className="text-sm font-medium text-foreground">{achievement.title}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
