import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, Lightbulb, Sparkles } from 'lucide-react';
import { helpContent, HelpContent } from '@/data/help-content';
import { cn } from '@/lib/utils';

interface ContextualHelpProps {
  helpKey: string;
  className?: string;
  size?: 'sm' | 'md';
  variant?: 'default' | 'subtle';
}

export function ContextualHelp({ 
  helpKey, 
  className,
  size = 'sm',
  variant = 'default'
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const content = helpContent[helpKey];

  if (!content) {
    console.warn(`Help content not found for key: ${helpKey}`);
    return null;
  }

  const buttonSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={cn(
          'rounded-full flex items-center justify-center transition-colors',
          buttonSizes[size],
          variant === 'default' 
            ? 'bg-primary/10 hover:bg-primary/20 text-primary' 
            : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground',
          className
        )}
        aria-label={`Ajuda sobre ${content.title}`}
      >
        <HelpCircle className={iconSizes[size]} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            />
            
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-[60] max-w-sm mx-auto"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">{content.title}</h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full bg-background/50 flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    {content.description}
                  </p>

                  {content.example && (
                    <div className="bg-muted/50 rounded-xl p-3">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Exemplo:</p>
                      <p className="text-sm text-foreground">{content.example}</p>
                    </div>
                  )}

                  {content.tip && (
                    <div className="flex items-start gap-2 bg-secondary/10 rounded-xl p-3">
                      <Sparkles className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                      <p className="text-sm text-secondary-foreground">
                        <span className="font-medium">Dica:</span> {content.tip}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 pb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm"
                  >
                    Entendi!
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
