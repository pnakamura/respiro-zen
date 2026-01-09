import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, Share2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface JourneyCompletionCelebrationProps {
  journeyTitle: string;
  journeyIcon: string;
  totalDays: number;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export function JourneyCompletionCelebration({
  journeyTitle,
  journeyIcon,
  totalDays,
  isOpen,
  onClose,
  onShare,
}: JourneyCompletionCelebrationProps) {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="text-center max-w-sm"
          >
            {/* Trophy animation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative inline-block mb-6"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-6xl"
              >
                {journeyIcon}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: 'spring' }}
                className="absolute -top-2 -right-2 w-[2.5rem] h-[2.5rem] rounded-full bg-energy flex items-center justify-center"
              >
                <Trophy className="w-5 h-5 text-primary-foreground" />
              </motion.div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold mb-2"
            >
              Parabéns! 🎉
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-2"
            >
              Você completou a jornada
            </motion.p>

            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl font-semibold text-primary mb-6"
            >
              {journeyTitle}
            </motion.h2>

            {/* Stats */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex justify-center gap-6 mb-8"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalDays}</div>
                <div className="text-sm text-muted-foreground">dias</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-energy flex items-center justify-center gap-1">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-sm text-muted-foreground">conquista</div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-3"
            >
              {onShare && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={onShare}
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar Conquista
                </Button>
              )}
              <Button
                className="w-full gap-2"
                onClick={onClose}
              >
                <Home className="w-4 h-4" />
                Voltar ao Início
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
