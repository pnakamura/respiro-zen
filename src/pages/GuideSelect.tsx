import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Leaf, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GuideCard } from '@/components/guide/GuideCard';
import { useGuides, useSetPreferredGuide, type SpiritualGuide } from '@/hooks/useGuides';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';

export default function GuideSelect() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: guides, isLoading } = useGuides();
  const setPreferredGuide = useSetPreferredGuide();
  const [selectedGuide, setSelectedGuide] = useState<SpiritualGuide | null>(null);

  const isAuthenticated = !!user;

  const handleContinue = async () => {
    if (!selectedGuide || !isAuthenticated) return;

    await setPreferredGuide.mutateAsync(selectedGuide.id);
    navigate('/guide', { state: { guideId: selectedGuide.id } });
  };

  const handleBack = () => {
    navigate('/');
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50/30 to-earth-50/20 flex items-center justify-center">
        <div className="animate-pulse font-body text-sage-600">Carregando...</div>
      </div>
    );
  }

  // Show login required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50/30 to-earth-50/20">
        {/* Noise texture overlay */}
        <div
          className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Organic floating orbs */}
        <motion.div
          className="fixed top-20 right-10 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(125, 143, 125, 0.12) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-cream-50/80 border-b border-sage-300/30">
          <div className="flex items-center gap-3 px-4 py-4 safe-top">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="rounded-full hover:bg-sage-50/50 text-sage-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-display font-medium text-sage-900">Escolha seu Guia</h1>
            </div>
          </div>
        </div>

        {/* Login Required Message */}
        <div className="px-4 py-12 flex flex-col items-center justify-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-sm"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sage-100/80 to-earth-100/60 border border-sage-200/50 flex items-center justify-center shadow-[0_8px_24px_rgba(95,115,95,0.15)]">
              <LogIn className="w-10 h-10 text-sage-600" />
            </div>
            <h2 className="text-xl font-display font-medium text-sage-900 mb-3">Login Necessário</h2>
            <p className="font-body text-sage-600 mb-8 leading-relaxed">
              Para escolher um guia espiritual e iniciar sua jornada de autoconhecimento,
              é necessário estar conectado à sua conta.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate('/auth')}
                className="w-full h-12 text-base font-body font-medium rounded-2xl gap-2 shadow-[0_8px_24px_rgba(95,115,95,0.25)]"
                style={{
                  background: 'linear-gradient(135deg, #7d8f7d 0%, #5f735f 100%)',
                  color: '#f6f7f6',
                }}
              >
                <LogIn className="w-5 h-5" />
                Fazer Login
              </Button>
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-full h-12 text-base font-body rounded-2xl border-sage-300/50 hover:bg-sage-50/50 text-sage-700"
              >
                Voltar para Início
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-sage-50/30 to-earth-50/20">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Organic floating orbs */}
      <motion.div
        className="fixed top-20 right-10 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(125, 143, 125, 0.12) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="fixed bottom-32 left-8 w-56 h-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 115, 95, 0.1) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-cream-50/80 border-b border-sage-300/30">
        <div className="flex items-center gap-3 px-4 py-4 safe-top">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="rounded-full hover:bg-sage-50/50 text-sage-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-display font-medium text-sage-900">Escolha seu Guia</h1>
            <p className="text-xs font-body text-sage-600">Selecione a abordagem que mais ressoa com você</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 pb-32 relative z-10">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl border border-sage-300/30 flex items-center justify-center shadow-[0_8px_24px_rgba(95,115,95,0.15)]"
            style={{
              background: 'linear-gradient(135deg, rgba(125, 143, 125, 0.15) 0%, rgba(95, 115, 95, 0.1) 100%)',
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Leaf className="w-8 h-8 text-sage-600" />
          </motion.div>
          <h2 className="text-xl font-display font-medium text-sage-900 mb-2">Seu Guia Interior</h2>
          <p className="text-sm font-body text-sage-600 max-w-sm mx-auto leading-relaxed">
            Cada guia possui uma perspectiva única. Escolha aquele cuja sabedoria
            ressoa com sua jornada de autoconhecimento.
          </p>
        </motion.div>

        {/* Guides Grid */}
        {isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl bg-sage-100/50" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid gap-4"
          >
            <AnimatePresence>
              {guides?.map((guide, index) => (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GuideCard
                    guide={guide}
                    isSelected={selectedGuide?.id === guide.id}
                    onSelect={setSelectedGuide}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <AnimatePresence>
        {selectedGuide && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 p-4 pb-20 backdrop-blur-xl bg-cream-50/80 border-t border-sage-300/30 z-40"
          >
            <Button
              onClick={handleContinue}
              disabled={setPreferredGuide.isPending}
              className="w-full h-14 text-base font-body font-medium rounded-2xl gap-2 shadow-[0_8px_24px_rgba(95,115,95,0.25)]"
              style={{
                background: 'linear-gradient(135deg, #7d8f7d 0%, #5f735f 100%)',
                color: '#f6f7f6',
              }}
            >
              {setPreferredGuide.isPending ? (
                'Salvando...'
              ) : (
                <>
                  Continuar com {selectedGuide.name}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
