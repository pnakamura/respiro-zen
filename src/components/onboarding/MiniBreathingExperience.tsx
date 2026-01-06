import React, { useState, useEffect, useCallback } from 'react';
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
      case 'inhale': return 1.3;
      case 'holdIn': return 1.3;
      case 'exhale': return 1;
      case 'holdOut': return 1;
      default: return 1.1;
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

  return (
    <div className="w-full flex flex-col items-center">
      {/* Breathing Circle */}
      <div className="relative w-56 h-56 flex items-center justify-center mb-8">
        {/* Outer glow ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5"
          animate={{
            scale: isRunning ? [1, 1.1, 1] : 1,
            opacity: isRunning ? [0.5, 0.8, 0.5] : 0.5,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Main circle */}
        <motion.div
          className="relative w-44 h-44 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg"
          animate={{
            scale: getPhaseScale(),
          }}
          transition={{
            duration: phase === 'inhale' || phase === 'exhale' ? 4 : 0.3,
            ease: 'easeInOut',
          }}
        >
          {/* Inner content */}
          <div className="text-center text-primary-foreground">
            <AnimatePresence mode="wait">
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center"
              >
                {phase === 'complete' ? (
                  <Check className="w-12 h-12 mb-2" />
                ) : isRunning ? (
                  <span className="text-4xl font-bold mb-1">{countdown}</span>
                ) : null}
                <span className="text-lg font-semibold">
                  {PHASE_LABELS[phase]}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Ripple rings */}
        {isRunning && phase !== 'complete' && (
          <>
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              animate={{
                scale: [1, 1.5],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/20"
              animate={{
                scale: [1, 1.8],
                opacity: [0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeOut',
                delay: 0.5,
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
          <span className="text-sm text-muted-foreground">
            Ciclo {cycle + 1} de {TOTAL_CYCLES}
          </span>
        </motion.div>
      )}

      {/* Actions */}
      {!isRunning && phase !== 'complete' && (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            onClick={startExperience}
            size="lg"
            className="h-14 text-lg font-semibold rounded-2xl gap-2"
          >
            <Play className="w-5 h-5" />
            Iniciar respiração
          </Button>
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Pular esta etapa
          </Button>
        </div>
      )}

      {phase === 'complete' && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-muted-foreground"
        >
          Você completou a prática!
        </motion.p>
      )}
    </div>
  );
}
