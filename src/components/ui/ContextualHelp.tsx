import { HelpCircle, Lightbulb, Sparkles } from 'lucide-react';
import { helpContent } from '@/data/help-content';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { useState } from 'react';

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
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={cn(
          'rounded-full flex items-center justify-center transition-all active:scale-95',
          buttonSizes[size],
          variant === 'default' 
            ? 'bg-primary/10 hover:bg-primary/20 text-primary' 
            : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground',
          className
        )}
        aria-label={`Ajuda sobre ${content.title}`}
      >
        <HelpCircle className={iconSizes[size]} />
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm mx-4 p-0 gap-0 rounded-2xl border-border overflow-hidden max-h-[80dvh] flex flex-col">
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-primary/15 to-secondary/15 p-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="font-bold text-lg text-foreground">
                {content.title}
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1">
            <p className="text-foreground leading-relaxed">
              {content.description}
            </p>

            {content.example && (
              <div className="bg-muted/40 border border-border/50 rounded-xl p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Exemplo:</p>
                <p className="text-sm text-foreground">{content.example}</p>
              </div>
            )}

            {content.tip && (
              <div className="flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-xl p-3">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Dica:</span> {content.tip}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 pt-2 flex-shrink-0 pb-[calc(16px+env(safe-area-inset-bottom))]">
            <DialogClose asChild>
              <button
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm active:scale-[0.98] transition-transform"
              >
                Entendi!
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
