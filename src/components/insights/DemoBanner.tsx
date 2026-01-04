import { motion } from 'framer-motion';
import { Eye, X, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface DemoBannerProps {
  onExitDemo: () => void;
}

export function DemoBanner({ onExitDemo }: DemoBannerProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative bg-gradient-to-r from-secondary/20 via-primary/10 to-secondary/20 border border-dashed border-primary/30 rounded-2xl p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
          <Eye className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">
            Modo Demonstração
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Veja como seus insights ficarão quando você registrar dados reais
          </p>
          
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={() => {
                onExitDemo();
                navigate('/');
              }}
              className="h-8 px-3 rounded-xl text-xs font-semibold"
            >
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              Começar a Registrar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onExitDemo}
              className="h-8 px-3 rounded-xl text-xs font-semibold text-muted-foreground"
            >
              Sair da Demo
            </Button>
          </div>
        </div>

        <button
          onClick={onExitDemo}
          className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </motion.div>
  );
}
