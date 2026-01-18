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
  title = 'Ver fundamentação científica',
  className,
}: ExpandableExplanationProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!explanation) return null;

  // Icon trigger - uses span to avoid nested button issues, shows modal on click using Portal
  if (triggerType === 'icon') {
    const handleOpen = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleOpen(e);
      }
    };

    return (
      <>
        <span
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          data-contentlock-allow="true"
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full cursor-pointer select-none',
            'bg-primary/10 hover:bg-primary/20 active:scale-95 transition-all',
            'text-xs font-medium text-primary',
            className
          )}
          aria-label="Ver explicação científica"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Saiba mais</span>
        </span>

        {/* Portal sempre renderiza, AnimatePresence controla o conteúdo */}
        {typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {isOpen && (
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
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={() => setIsOpen(false)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsOpen(false); }}
                      className="w-7 h-7 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors shrink-0 cursor-pointer"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </span>
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
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </>
    );
  }

  // Button trigger - more visible with label and icon
  if (triggerType === 'button') {
    return (
      <div className={cn('mt-2', className)}>
        <button
          type="button"
          data-contentlock-allow="true"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl',
            'bg-primary/10 hover:bg-primary/15 active:scale-[0.98] transition-all',
            'text-sm font-medium text-primary'
          )}
        >
          <Info className="w-4 h-4" />
          <span>{title}</span>
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
                  <span className="text-sm font-medium text-foreground">Fundamentação Científica</span>
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

  // Accordion trigger - collapsible section with highlighted style
  return (
    <div className={cn('rounded-xl border border-border/50 bg-muted/30 overflow-hidden', className)}>
      <button
        type="button"
        data-contentlock-allow="true"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
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
            <div className="px-4 pb-4 border-t border-border/30">
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
