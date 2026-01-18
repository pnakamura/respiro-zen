import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ExpandableExplanationProps {
  explanation: string | null | undefined;
  triggerType?: 'icon' | 'button' | 'accordion';
  title?: string;
  className?: string;
}

export function ExpandableExplanation({ 
  explanation, 
  triggerType = 'icon',
  title = 'Saiba mais',
  className,
}: ExpandableExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!explanation) return null;

  // Icon trigger - shows modal on click using Portal
  if (triggerType === 'icon') {
    return (
      <>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={cn(
            'w-5 h-5 rounded-full bg-muted/50 flex items-center justify-center shrink-0',
            'hover:bg-primary/10 transition-colors',
            className
          )}
          aria-label="Ver explicação científica"
        >
          <Info className="w-3 h-3 text-muted-foreground hover:text-primary transition-colors" />
        </button>

        {/* Modal overlay using Portal */}
        <AnimatePresence>
          {isOpen && createPortal(
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-md w-full bg-card border border-border rounded-2xl shadow-xl max-h-[85vh] flex flex-col overflow-hidden"
              >
                {/* Fixed header */}
                <div className="flex items-center justify-between gap-2 p-5 pb-3 border-b border-border/50 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Info className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Fundamentação Científica</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors shrink-0"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-5 pt-4 min-h-0">
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {explanation}
                  </p>
                </div>
                
                {/* Fixed footer with button */}
                <div className="p-5 pt-3 border-t border-border/50 shrink-0">
                  <Button
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                    variant="outline"
                  >
                    Entendi
                  </Button>
                </div>
              </motion.div>
            </motion.div>,
            document.body
          )}
        </AnimatePresence>
      </>
    );
  }

  // Button trigger - shows inline expansion
  if (triggerType === 'button') {
    return (
      <div className={cn('mt-2', className)}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          {title}
          <ChevronDown className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Fundamentação Científica</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Accordion trigger - collapsible section
  return (
    <div className={cn('border-t border-border/50 mt-4 pt-4', className)}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-foreground flex items-center gap-2">
          <Info className="w-4 h-4 text-primary" />
          {title}
        </span>
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
