import { motion } from 'framer-motion';
import { Heart, Sparkles, Eye, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DemoPreviewCard } from './DemoPreviewCard';

interface EmptyInsightsStateProps {
  onEnterDemo?: () => void;
}

export function EmptyInsightsState({ onEnterDemo }: EmptyInsightsStateProps) {
  const navigate = useNavigate();

  const steps = [
    { icon: '❤️', text: 'Fazer check-in emocional', done: false },
    { icon: '🧘', text: 'Praticar respiração', done: false },
    { icon: '💧', text: 'Registrar hidratação', done: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-6 px-4 text-center"
    >
      {/* Animated icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        className="relative w-24 h-24 mb-6"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-primary animate-bounce-subtle" />
        </div>
        {/* Floating elements */}
        <motion.div
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-energy/20 flex items-center justify-center text-sm"
        >
          ✨
        </motion.div>
        <motion.div
          animate={{ y: [3, -3, 3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full bg-calm/20 flex items-center justify-center text-xs"
        >
          💫
        </motion.div>
      </motion.div>

      <h3 className="text-xl font-bold text-foreground mb-2">
        Seus insights aparecerão aqui
      </h3>

      <p className="text-muted-foreground text-sm max-w-xs mb-5">
        Complete atividades para desbloquear análises personalizadas do seu bem-estar.
      </p>

      {/* Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-xs bg-muted/30 rounded-2xl p-4 mb-5"
      >
        <p className="text-xs font-semibold text-muted-foreground mb-3 text-left">
          Para desbloquear insights:
        </p>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="flex items-center gap-3 text-left"
            >
              <span className="text-lg">{step.icon}</span>
              <span className="text-sm text-foreground flex-1">{step.text}</span>
              <CheckCircle2 className="w-4 h-4 text-muted-foreground/30" />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Demo Preview Card */}
      {onEnterDemo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-sm mb-5 cursor-pointer"
          onClick={onEnterDemo}
        >
          <DemoPreviewCard />
        </motion.div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Button
          onClick={() => navigate('/')}
          className="flex-1 rounded-2xl px-6 h-12 font-semibold"
        >
          <Heart className="w-4 h-4 mr-2" />
          Fazer Check-in
        </Button>
        
        {onEnterDemo && (
          <Button
            variant="outline"
            onClick={onEnterDemo}
            className="flex-1 rounded-2xl px-6 h-12 font-semibold"
          >
            <Eye className="w-4 h-4 mr-2" />
            Ver Demo
          </Button>
        )}
      </div>
    </motion.div>
  );
}
