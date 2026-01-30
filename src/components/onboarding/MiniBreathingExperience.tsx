import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Phase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'complete';

const PHASE_LABELS: Record<Phase, string> = {
  idle: 'Preparar',
  inhale: 'Inspire',
  holdIn: 'Segure',
  exhale: 'Expire',
  holdOut: 'Segure',
  complete: 'Concluído!',
};

// Box Breathing: 4-4-4-4 seconds
const PATTERN = {
  inhale: 4000,
  holdIn: 4000,
  exhale: 4000,
  holdOut: 4000,
};

const TOTAL_CYCLES = 3;

// Sage/Earth gradient colors
const PHASE_COLORS: Record<Phase, { from: string; to: string }> = {
  idle: { from: '#7d8f7d', to: '#5f735f' },
  inhale: { from: '#a3b0a3', to: '#7d8f7d' },
  holdIn: { from: '#7d8f7d', to: '#5f735f' },
  exhale: { from: '#5f735f', to: '#4a5b4a' },
  holdOut: { from: '#4a5b4a', to: '#3d4a3d' },
  complete: { from: '#5f735f', to: '#4a5b4a' },
};

interface MiniBreathingExperienceProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function MiniBreathingExperience({ onComplete, onSkip }: MiniBreathingExperienceProps) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [cycle, setCycle] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [countdown, setCountdown] = useState(4);

  const getPhaseScale = () => {
    switch (phase) {
      case 'inhale': return 1.35;
      case 'holdIn': return 1.35;
      case 'exhale': return 1;
      case 'holdOut': return 1;
      default: return 1.15;
    }
  };

  const runBreathingCycle = useCallback(() => {
    const phases: { phase: Phase; duration: number }[] = [
      { phase: 'inhale', duration: PATTERN.inhale },
      { phase: 'holdIn', duration: PATTERN.holdIn },
      { phase: 'exhale', duration: PATTERN.exhale },
      { phase: 'holdOut', duration: PATTERN.holdOut },
    ];

    let currentCycle = 0;
    let phaseIndex = 0;

    const runPhase = () => {
      if (currentCycle >= TOTAL_CYCLES) {
        setPhase('complete');
        setIsRunning(false);
        setTimeout(onComplete, 1500);
        return;
      }

      const { phase, duration } = phases[phaseIndex];
      setPhase(phase);
      setCountdown(duration / 1000);

      // Countdown timer
      let remaining = duration / 1000;
      const countdownInterval = setInterval(() => {
        remaining -= 1;
        if (remaining > 0) {
          setCountdown(remaining);
        }
      }, 1000);

      setTimeout(() => {
        clearInterval(countdownInterval);
        phaseIndex++;
        if (phaseIndex >= phases.length) {
          phaseIndex = 0;
          currentCycle++;
          setCycle(currentCycle);
        }
        runPhase();
      }, duration);
    };

    runPhase();
  }, [onComplete]);

  const startExperience = () => {
    setIsRunning(true);
    setCycle(0);
    runBreathingCycle();
  };

  const colors = PHASE_COLORS[phase];

  return (
    <div className="w-full flex flex-col items-center justify-center px-4">
      {/* Breathing Circle - Mobile optimized size */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.from}30 0%, transparent 70%)`,
          }}
          animate={{
            scale: isRunning ? [1, 1.2, 1] : 1,
            opacity: isRunning ? [0.4, 0.7, 0.4] : 0.4,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Main circle with gradient */}
        <motion.div
          className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
            boxShadow: `0 0 40px ${colors.from}50`,
          }}
          animate={{
            scale: getPhaseScale(),
          }}
          transition={{
            duration: phase === 'inhale' || phase === 'exhale' ? 4 : 0.3,
            ease: 'easeInOut',
          }}
        >
          {/* Inner content */}
          <div className="text-center text-white">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center"
              >
                {phase === 'complete' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Check className="w-12 h-12 mb-1" />
                  </motion.div>
                ) : isRunning ? (
                  <motion.span
                    key={countdown}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-5xl font-display font-light mb-1"
                  >
                    {countdown}
                  </motion.span>
                ) : null}
                <span className="text-xl font-body font-medium">
                  {PHASE_LABELS[phase]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Ripple rings with purple colors */}
        {isRunning && phase !== 'complete' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${colors.from}50` }}
              animate={{
                scale: [1, 1.6],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid ${colors.to}40` }}
              animate={{
                scale: [1, 1.9],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.6,
              }}
            />
          </>
        )}
      </div>

      {/* Progress */}
      {isRunning && phase !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 text-center"
        >
          <div className="flex items-center gap-2 justify-center mb-2">
            {Array.from({ length: TOTAL_CYCLES }).map((_, i) => (
              <motion.div
                key={i}
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: i <= cycle ? '#7d8f7d' : 'hsl(var(--muted))',
                }}
                animate={i === cycle ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
          <span className="text-sm font-body text-sage-600">
            Ciclo {cycle + 1} de {TOTAL_CYCLES}
          </span>
        </motion.div>
      )}

      {/* Actions - Large buttons for mobile */}
      {!isRunning && phase !== 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 w-full max-w-xs"
        >
          <Button
            onClick={startExperience}
            size="lg"
            className="h-16 text-lg font-body font-medium rounded-2xl gap-3 shadow-[0_8px_24px_rgba(95,115,95,0.25)]"
            style={{
              background: 'linear-gradient(135deg, #7d8f7d 0%, #5f735f 100%)',
            }}
          >
            <Play className="w-6 h-6" />
            Iniciar respiração
          </Button>
          <Button
            variant="outline"
            onClick={onSkip}
            className="h-12 text-base font-body border-sage-300/50 hover:bg-sage-50/50 text-sage-700 hover:text-sage-900"
          >
            Pular esta prática
          </Button>
        </motion.div>
      )}

      {phase === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-xl font-display font-medium text-sage-900 mb-1">
            Excelente! 🌿
          </p>
          <p className="font-body text-sage-600">
            Você completou a prática!
          </p>
        </motion.div>
      )}
    </div>
  );
}
