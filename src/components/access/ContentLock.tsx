import { ReactNode, useState } from 'react';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useContentAccess, ContentAccessLevel } from '@/hooks/useFeatureAccess';
import { UpgradeModal } from './UpgradeModal';

interface ContentLockProps {
  contentType: 'breathing' | 'meditation' | 'journey';
  contentId: string;
  contentTitle?: string;
  contentDescription?: string;
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

const levelColors: Record<ContentAccessLevel, { badge: string; cta: string }> = {
  free: { badge: '', cta: '' },
  basic: { badge: 'bg-blue-500/10 text-blue-500', cta: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
  premium: { badge: 'bg-amber-500/10 text-amber-500', cta: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
  exclusive: { badge: 'bg-purple-500/10 text-purple-500', cta: 'bg-purple-500/10 border-purple-500/20 text-purple-500' },
};

export function ContentLock({
  contentType,
  contentId,
  contentTitle,
  contentDescription,
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

  const handleLockedClick = (e: React.MouseEvent) => {
    // Permitir cliques em elementos marcados como "permitidos" (ex: Saiba mais, Favorito)
    const allowedElement = (e.target as HTMLElement).closest('[data-contentlock-allow="true"]');
    if (allowedElement) {
      return;
    }
    
    // Não interceptar cliques dentro do UpgradeModal (renderizado via Portal)
    const upgradeModalElement = (e.target as HTMLElement).closest('[data-upgrade-modal="true"]');
    if (upgradeModalElement) {
      return;
    }
    
    // Não interceptar cliques dentro do ExpandableExplanation modal (renderizado via Portal)
    const expandableModalElement = (e.target as HTMLElement).closest('[data-expandable-modal="true"]');
    if (expandableModalElement) {
      return;
    }
    
    e.stopPropagation();
    e.preventDefault();
    setShowUpgradeModal(true);
  };

  return (
    <div 
      className={cn('relative', className)}
      onClickCapture={isLocked ? handleLockedClick : undefined}
    >
      {/* Conteúdo visível - sem pointer-events-none para permitir ações de preview */}
      <div>
        {children}
      </div>

      {/* Badge de nível de acesso */}
      {showBadge && isPremiumContent && (
        <div
          className={cn(
            'absolute z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
            badgePositionClasses[badgePosition],
            levelColors[contentLevel].badge
          )}
        >
          <Sparkles className="w-3 h-3" />
          <span>{levelLabels[contentLevel]}</span>
        </div>
      )}

      {/* CTA de desbloqueio na parte inferior - conteúdo permanece visível */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 inset-x-0 z-20 p-2 bg-gradient-to-t from-background via-background/95 to-transparent rounded-b-2xl"
        >
          <div 
            className={cn(
              'flex items-center justify-between gap-2 p-2.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02]',
              levelColors[contentLevel].cta
            )}
            onClick={handleLockedClick}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span className="text-xs font-medium">
                Conteúdo {levelLabels[contentLevel]}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold">
              <span>Desbloquear</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Modal de upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        featureTitle={contentTitle || `Conteúdo ${levelLabels[contentLevel]}`}
        featureDescription={contentDescription || `Este conteúdo requer um plano ${levelLabels[contentLevel].toLowerCase()} para acesso completo.`}
        contentType={contentType}
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
        levelColors[level].badge,
        className
      )}
    >
      <Sparkles className="w-3 h-3" />
      <span>{levelLabels[level]}</span>
    </span>
  );
}
