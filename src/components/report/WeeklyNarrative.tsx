import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface WeeklyNarrativeProps {
  narrative: string;
}

export function WeeklyNarrative({ narrative }: WeeklyNarrativeProps) {
  // Split into paragraphs
  const paragraphs = narrative.split('\n').filter(p => p.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Análise da Semana</h3>
      </div>

      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="text-muted-foreground text-sm leading-relaxed"
          >
            {paragraph}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}
