import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ questions, onSelect }: SuggestedQuestionsProps) {
  if (!questions?.length) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center">
        Sugestões para começar:
      </p>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(question)}
            className="flex items-center gap-2 px-4 py-3 text-left text-sm rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
          >
            <MessageCircle className="w-4 h-4 text-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span className="text-foreground/80 group-hover:text-foreground transition-colors">
              {question}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
