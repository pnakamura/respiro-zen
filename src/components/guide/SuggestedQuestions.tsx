import { motion } from 'framer-motion';
import { MessageCircle, Leaf } from 'lucide-react';

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
      <div className="flex items-center justify-center gap-2 text-xs font-body text-sage-600">
        <Leaf className="w-3 h-3" />
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
            className="flex items-start gap-3 px-4 py-3 text-left text-sm rounded-2xl bg-cream-50/80 backdrop-blur-sm hover:bg-cream-50 border border-sage-200/50 hover:border-sage-300/70 transition-all duration-200 group shadow-[0_2px_12px_rgba(95,115,95,0.05)] hover:shadow-[0_4px_16px_rgba(95,115,95,0.1)]"
          >
            <MessageCircle className="w-4 h-4 text-sage-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sage-700 font-body group-hover:text-sage-900 transition-colors duration-200 leading-relaxed">
              {question}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
