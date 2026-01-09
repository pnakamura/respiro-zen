import { ReactNode, useState } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useContentAccess, ContentAccessLevel } from '@/hooks/useFeatureAccess';
import { UpgradeModal } from './UpgradeModal';

interface ContentLockProps {
  contentType: 'breathing' | 'meditation' | 'journey';
  contentId: string;
  contentTitle?: string;
  children: ReactNode;
  className?: string;
  showBadge?: boolean;
  badgePosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const levelLabels: Record<ContentAccessLevel, string> = {
  free: '',
  basic: 'Básico',
  premium: 'Premium',
  exclusive: 'Exclusivo',
};

const levelColors: Record<ContentAccessLevel, string> = {
  free: '',
  basic: 'bg-blue-500/10 text-blue-500',
  premium: 'bg-amber-500/10 text-amber-500',
  exclusive: 'bg-purple-500/10 text-purple-500',
};

export function ContentLock({
  contentType,
  contentId,
  contentTitle,
  children,
  className,
  showBadge = true,
  badgePosition = 'top-right',
}: ContentLockProps) {
  const { canAccess, contentLevel, isLoading } = useContentAccess(contentType, contentId);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (isLoading) {
    return <>{children}</>;
  }

  const isPremiumContent = contentLevel !== 'free';
  const isLocked = !canAccess && isPremiumContent;

  const badgePositionClasses = {
    'top-left': 'top-2 left-2',
    'top-right': 'top-2 right-2',
    'bottom-left': 'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
  };

  return (
    <div className={cn('relative', className)}>
      {children}

      {/* Badge de nível de acesso */}
      {showBadge && isPremiumContent && (
        <div
          className={cn(
            'absolute z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
            badgePositionClasses[badgePosition],
            levelColors[contentLevel]
          )}
        >
          <Sparkles className="w-3 h-3" />
          <span>{levelLabels[contentLevel]}</span>
        </div>
      )}

      {/* Overlay de bloqueio */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-background/80 backdrop-blur-sm cursor-pointer"
          onClick={() => setShowUpgradeModal(true)}
        >
          <div className="flex flex-col items-center gap-2 text-center p-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Conteúdo {levelLabels[contentLevel]}
            </p>
          </div>
        </motion.div>
      )}

      {/* Modal de upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureTitle={contentTitle || `Conteúdo ${levelLabels[contentLevel]}`}
        featureDescription={`Este conteúdo requer um plano ${levelLabels[contentLevel].toLowerCase()} para acesso completo.`}
      />
    </div>
  );
}

// Componente simplificado apenas para o badge (sem overlay de bloqueio)
export function PremiumBadge({
  level,
  className,
}: {
  level: ContentAccessLevel;
  className?: string;
}) {
  if (level === 'free') return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
        levelColors[level],
        className
      )}
    >
      <Sparkles className="w-3 h-3" />
      <span>{levelLabels[level]}</span>
    </span>
  );
}
