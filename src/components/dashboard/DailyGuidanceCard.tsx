import { motion } from 'framer-motion';
import { Sparkles, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { usePreferredGuide } from '@/hooks/useGuides';
import { useAuth } from '@/contexts/AuthContext';

interface DailyGuidanceCardProps {
  onGuideClick?: () => void;
}

const dailyMessages = [
  {
    title: 'Respire fundo',
    message: 'Cada respiração é uma oportunidade de recomeçar. Que tal uma pausa consciente agora?',
    emoji: '🌬️',
  },
  {
    title: 'Você é incrível',
    message: 'Lembre-se: seus sentimentos são válidos. Está tudo bem não estar bem às vezes.',
    emoji: '💫',
  },
  {
    title: 'Momento presente',
    message: 'O agora é o único momento real. Permita-se estar aqui, inteiro.',
    emoji: '🧘',
  },
  {
    title: 'Pequenos passos',
    message: 'Grandes mudanças começam com pequenas ações. O que você pode fazer hoje por você?',
    emoji: '🌱',
  },
  {
    title: 'Gratidão',
    message: 'Encontre uma coisa pela qual ser grato hoje. Isso transforma perspectivas.',
    emoji: '🙏',
  },
  {
    title: 'Autocuidado',
    message: 'Cuidar de si não é egoísmo, é necessidade. Você merece esse tempo.',
    emoji: '💚',
  },
  {
    title: 'Força interior',
    message: 'Você já superou 100% dos seus dias difíceis. Sua força é maior do que imagina.',
    emoji: '🦋',
  },
];

export function DailyGuidanceCard({ onGuideClick }: DailyGuidanceCardProps) {
  const { user } = useAuth();
  const { data: preferredGuide } = usePreferredGuide();
  
  // Get message based on day of week
  const todayMessage = useMemo(() => {
    const dayOfWeek = new Date().getDay();
    return dailyMessages[dayOfWeek];
  }, []);

  // Use preferred guide's emoji if available
  const displayEmoji = preferredGuide?.avatar_emoji || todayMessage.emoji;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 border border-primary/20 p-5"
    >
      {/* Decorative background */}
      <div className="absolute -right-6 -top-6 w-28 h-28 bg-primary/10 rounded-full blur-2xl" />
      <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 shadow-lg shadow-primary/10"
          >
            <span className="text-2xl">{displayEmoji}</span>
          </motion.div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Guia do dia
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground truncate">
              {todayMessage.title}
            </h3>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {todayMessage.message}
        </p>

        {/* CTA Button */}
        {onGuideClick && (
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGuideClick}
            className="flex items-center gap-1.5 text-sm font-semibold text-primary"
          >
            {preferredGuide ? `Falar com ${preferredGuide.name}` : 'Falar com seu guia'}
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
