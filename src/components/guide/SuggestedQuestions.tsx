import { motion } from 'framer-motion';
import { MessageCircle, Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  maxQuestions?: number;
}

export function SuggestedQuestions({ 
  questions, 
  onSelect,
  maxQuestions = 3,
}: SuggestedQuestionsProps) {
  if (!questions?.length) return null;

  // Limit to maxQuestions for cleaner UI
  const displayedQuestions = questions.slice(0, maxQuestions);

  return (
    <motion.div 
      className="space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3" />
        <span>Sugestões para começar</span>
      </div>
      
      <div className="flex flex-col gap-2">
        {displayedQuestions.map((question, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.4 + index * 0.1,
              duration: 0.3,
              ease: 'easeOut',
            }}
            onClick={() => onSelect(question)}
            className="flex items-start gap-3 px-4 py-3 text-left text-sm rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all duration-200 group"
          >
            <MessageCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-200 leading-relaxed">
              {question}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
