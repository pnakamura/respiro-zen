import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription?: string;
  contentType?: 'breathing' | 'meditation' | 'journey';
}

const benefits = [
  'Acesso a todas as técnicas de respiração',
  'Meditações guiadas exclusivas',
  'Jornadas de transformação premium',
  'Relatórios semanais personalizados por IA',
  'Guias espirituais ilimitados',
];

export function UpgradeModal({
  isOpen,
  onClose,
  featureTitle,
  featureDescription,
  contentType,
}: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/plans');
  };

  // Portal sempre renderiza, AnimatePresence controla o conteúdo animado
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Container centralizado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div 
              className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden max-w-md w-full max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header com gradiente */}
              <div className="relative bg-gradient-to-br from-amber-500/20 via-primary/10 to-purple-500/20 p-5 pb-6 flex-shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/50 hover:bg-background/80 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <Crown className="w-7 h-7 text-white" />
                  </div>
                </div>

                <h2 className="text-lg font-bold text-center text-foreground">
                  Desbloqueie {featureTitle}
                </h2>
                {featureDescription && (
                  <p className="text-sm text-muted-foreground text-center mt-1.5 line-clamp-2">
                    {featureDescription}
                  </p>
                )}
              </div>

              {/* Benefícios */}
              <div className="p-5 pt-4 space-y-3 overflow-y-auto flex-1 min-h-0">
                <p className="text-sm font-medium text-foreground">
                  Com o plano Premium você terá:
                </p>
                <ul className="space-y-2.5">
                  {benefits.map((benefit, idx) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="flex items-center gap-2.5 text-sm text-muted-foreground"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Botões */}
              <div className="p-5 pt-3 space-y-2.5 flex-shrink-0 border-t border-border/30 bg-card">
                <Button
                  onClick={handleUpgrade}
                  className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold shadow-lg shadow-amber-500/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ver Planos Premium
                </Button>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="w-full h-9 text-muted-foreground hover:text-foreground"
                >
                  Talvez depois
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
