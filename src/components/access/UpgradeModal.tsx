import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureTitle: string;
  featureDescription?: string;
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
}: UpgradeModalProps) {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    onClose();
    navigate('/settings'); // Navegar para página de configurações/planos
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="bg-card rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Header com gradiente */}
              <div className="relative bg-gradient-to-br from-amber-500/20 via-primary/10 to-purple-500/20 p-6 pb-8">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h2 className="text-xl font-bold text-center text-foreground">
                  Desbloqueie {featureTitle}
                </h2>
                {featureDescription && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    {featureDescription}
                  </p>
                )}
              </div>

              {/* Benefícios */}
              <div className="p-6 space-y-4">
                <p className="text-sm font-medium text-foreground">
                  Com o plano Premium você terá:
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit, idx) => (
                    <motion.li
                      key={benefit}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 text-sm text-muted-foreground"
                    >
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {benefit}
                    </motion.li>
                  ))}
                </ul>

                {/* Botões */}
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleUpgrade}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ver Planos Premium
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="w-full h-10 text-muted-foreground"
                  >
                    Talvez depois
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
