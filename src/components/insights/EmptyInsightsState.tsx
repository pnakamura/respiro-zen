import { motion } from 'framer-motion';
import { Heart, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DemoPreviewCard } from './DemoPreviewCard';

interface EmptyInsightsStateProps {
  onEnterDemo?: () => void;
}

export function EmptyInsightsState({ onEnterDemo }: EmptyInsightsStateProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-8 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-6">
        <Sparkles className="w-10 h-10 text-primary" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">
        Seus insights aparecerão aqui
      </h3>

      <p className="text-muted-foreground text-sm max-w-xs mb-6">
        Registre como você está se sentindo para começar a ver padrões e tendências do seu bem-estar emocional.
      </p>

      {/* Demo Preview Card */}
      {onEnterDemo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm mb-6 cursor-pointer"
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
            Ver Demonstração
          </Button>
        )}
      </div>
    </motion.div>
  );
}
