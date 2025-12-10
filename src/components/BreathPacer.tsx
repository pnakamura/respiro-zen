import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { BreathPattern, BreathPhase, EmotionType } from '@/types/breathing';
import { cn } from '@/lib/utils';
import { X, Play, Pause, RotateCcw, Info, ArrowUp, ArrowDown, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface BreathPacerProps {
  pattern: BreathPattern;
  emotionType: EmotionType;
  explanation: string;
  onClose: () => void;
  onComplete: (durationSeconds: number) => void;
}

const phaseLabels: Record<BreathPhase, string> = {
  idle: 'Preparar',
  inhale: 'Inspire',
  holdIn: 'Segure',
  exhale: 'Expire',
  holdOut: 'Segure',
  complete: 'Concluído',
};

const phaseIcons: Record<BreathPhase, React.ReactNode> = {
  idle: <Circle className="w-8 h-8" />,
  inhale: <ArrowUp className="w-8 h-8" />,
  holdIn: <Circle className="w-8 h-8" />,
  exhale: <ArrowDown className="w-8 h-8" />,
  holdOut: <Circle className="w-8 h-8" />,
  complete: <Circle className="w-8 h-8" />,
};

const emotionGradients: Record<EmotionType, string> = {
  anxious: 'bg-gradient-to-br from-calm to-calm/70',
  angry: 'bg-gradient-to-br from-grounding to-grounding/70',
  tired: 'bg-gradient-to-br from-energy to-energy/70',
  panic: 'bg-gradient-to-br from-panic to-panic/70',
  meditate: 'bg-gradient-to-br from-meditate to-meditate/70',
  wimhof: 'bg-gradient-to-br from-energy to-energy/70',
  alternate: 'bg-gradient-to-br from-calm to-calm/70',
  coherent: 'bg-gradient-to-br from-grounding to-grounding/70',
};

const emotionShadows: Record<EmotionType, string> = {
  anxious: 'shadow-[0_0_80px_20px_hsl(var(--calm)/0.4)]',
  angry: 'shadow-[0_0_80px_20px_hsl(var(--grounding)/0.4)]',
  tired: 'shadow-[0_0_80px_20px_hsl(var(--energy)/0.4)]',
  panic: 'shadow-[0_0_80px_20px_hsl(var(--panic)/0.4)]',
  meditate: 'shadow-[0_0_80px_20px_hsl(var(--meditate)/0.4)]',
  wimhof: 'shadow-[0_0_80px_20px_hsl(var(--energy)/0.4)]',
  alternate: 'shadow-[0_0_80px_20px_hsl(var(--calm)/0.4)]',
  coherent: 'shadow-[0_0_80px_20px_hsl(var(--grounding)/0.4)]',
};

const emotionTextColors: Record<EmotionType, string> = {
  anxious: 'text-calm',
  angry: 'text-grounding',
  tired: 'text-energy',
  panic: 'text-panic',
  meditate: 'text-meditate',
  wimhof: 'text-energy',
  alternate: 'text-calm',
  coherent: 'text-grounding',
};

// Audio bell sound URL
const BELL_SOUND_URL = 'https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3';

export function BreathPacer({ pattern, emotionType, explanation, onClose, onComplete }: BreathPacerProps) {
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [phaseTime, setPhaseTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isPanic = emotionType === 'panic';

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(BELL_SOUND_URL);
    audioRef.current.volume = 0.3;
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playBell = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Audio play failed - browser policy
      });
    }
  }, []);

  const getPhaseVariants = useCallback((): Variants => {
    const baseScale = 1;
    const maxScale = 1.5;
    
    if (isPanic) {
      // Physiological Sigh: double inhale pattern
      return {
        idle: { scale: baseScale },
        inhale: { 
          scale: [baseScale, 1.25, 1.25, maxScale],
          transition: { 
            duration: pattern.inhale / 1000,
            times: [0, 0.4, 0.5, 1],
            ease: "easeInOut"
          }
        },
        holdIn: { 
          scale: maxScale,
          transition: { duration: pattern.holdIn / 1000 }
        },
        exhale: { 
          scale: baseScale,
          transition: { 
            duration: pattern.exhale / 1000,
            ease: "easeOut"
          }
        },
        holdOut: { 
          scale: baseScale,
          transition: { duration: pattern.holdOut / 1000 }
        },
        complete: { scale: baseScale },
      };
    }

    return {
      idle: { scale: baseScale },
      inhale: { 
        scale: maxScale,
        transition: { 
          duration: pattern.inhale / 1000,
          ease: "easeInOut"
        }
      },
      holdIn: { 
        scale: maxScale,
        transition: { 
          duration: pattern.holdIn / 1000,
          ease: "linear"
        }
      },
      exhale: { 
        scale: baseScale,
        transition: { 
          duration: pattern.exhale / 1000,
          ease: "easeInOut"
        }
      },
      holdOut: { 
        scale: baseScale,
        transition: { 
          duration: pattern.holdOut / 1000,
          ease: "linear"
        }
      },
      complete: { scale: baseScale },
    };
  }, [pattern, isPanic]);

  const runBreathCycle = useCallback(async () => {
    const phases: { phase: BreathPhase; duration: number }[] = [];
    
    if (pattern.inhale > 0) phases.push({ phase: 'inhale', duration: pattern.inhale });
    if (pattern.holdIn > 0) phases.push({ phase: 'holdIn', duration: pattern.holdIn });
    if (pattern.exhale > 0) phases.push({ phase: 'exhale', duration: pattern.exhale });
    if (pattern.holdOut > 0) phases.push({ phase: 'holdOut', duration: pattern.holdOut });

    for (const { phase, duration } of phases) {
      setPhase(phase);
      playBell();
      
      // Animate phase time countdown
      const startTime = Date.now();
      const totalDuration = duration;
      
      const updatePhaseTime = () => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, Math.ceil((totalDuration - elapsed) / 1000));
        setPhaseTime(remaining);
        
        if (elapsed < totalDuration) {
          requestAnimationFrame(updatePhaseTime);
        }
      };
      
      updatePhaseTime();
      await new Promise(resolve => setTimeout(resolve, duration));
    }
  }, [pattern, playBell]);

  const startBreathing = useCallback(async () => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
    
    // Countdown
    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    setCountdown(0);

    // Run cycles
    for (let cycle = 0; cycle < pattern.cycles; cycle++) {
      setCurrentCycle(cycle + 1);
      await runBreathCycle();
    }

    setPhase('complete');
    setIsRunning(false);
    
    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    onComplete(durationSeconds);
  }, [pattern.cycles, runBreathCycle, onComplete]);

  const handleStart = () => {
    if (!isRunning) {
      startBreathing();
    }
  };

  const handlePause = () => {
    setIsRunning(false);
    setPhase('idle');
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('idle');
    setCurrentCycle(0);
    setCountdown(3);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between p-4 safe-top"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {pattern.name}
            </h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle className={emotionTextColors[emotionType]}>
                    {pattern.name}
                  </DialogTitle>
                  <DialogDescription className="pt-3 text-base leading-relaxed">
                    {explanation}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-sm text-muted-foreground">
            {pattern.description}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </motion.header>

      {/* Main breathing area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 gap-6">
        {/* Countdown overlay */}
        <AnimatePresence>
          {countdown > 0 && isRunning && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10"
            >
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-8xl font-bold text-primary"
              >
                {countdown}
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase label - FIXED POSITION ABOVE CIRCLE */}
        <div className="h-24 flex flex-col items-center justify-end">
          <AnimatePresence mode="wait">
            {isRunning && countdown === 0 && phase !== 'complete' && (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-2"
              >
                <div className={cn("transition-colors duration-300", emotionTextColors[emotionType])}>
                  {phaseIcons[phase]}
                </div>
                <span className={cn(
                  "text-4xl font-bold tracking-wide transition-colors duration-300",
                  emotionTextColors[emotionType]
                )}>
                  {phaseLabels[phase]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle state message */}
          {!isRunning && phase === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-muted-foreground text-center"
            >
              Pressione iniciar e<br />acompanhe o ritmo
            </motion.p>
          )}
        </div>

        {/* Breathing circle - CLEAN, NO TEXT INSIDE */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <motion.div
            className={cn(
              'absolute w-56 h-56 rounded-full opacity-30',
              emotionGradients[emotionType]
            )}
            animate={{
              scale: phase === 'inhale' ? [1, 1.3] : phase === 'exhale' ? [1.3, 1] : 1.15,
            }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Main circle - NO TEXT INSIDE */}
          <motion.div
            className={cn(
              'w-44 h-44 rounded-full',
              emotionGradients[emotionType],
              emotionShadows[emotionType]
            )}
            variants={getPhaseVariants()}
            animate={phase}
            initial="idle"
          />
        </div>

        {/* Timer and cycle indicator - FIXED POSITION BELOW CIRCLE */}
        <div className="h-28 flex flex-col items-center justify-start gap-3">
          {/* Phase timer */}
          <AnimatePresence>
            {phaseTime > 0 && isRunning && countdown === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center justify-center"
              >
                <span className="text-5xl font-bold text-foreground tabular-nums">
                  {phaseTime}
                </span>
                <span className="text-xl text-muted-foreground ml-1">s</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cycle indicator */}
          {isRunning && countdown === 0 && phase !== 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground mb-2">
                Ciclo {currentCycle} de {pattern.cycles}
              </p>
              <div className="flex gap-1.5 justify-center">
                {Array.from({ length: pattern.cycles }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      i < currentCycle 
                        ? emotionGradients[emotionType] 
                        : 'bg-muted'
                    )}
                    animate={{ 
                      scale: i === currentCycle - 1 ? 1.4 : 1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Complete state */}
          <AnimatePresence>
            {phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className={cn("text-2xl font-bold", emotionTextColors[emotionType])}>
                  Parabéns!
                </p>
                <p className="text-muted-foreground mt-1">
                  Você completou a prática
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls - Thumb zone */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 safe-bottom"
      >
        <div className="flex justify-center gap-4">
          {!isRunning && phase !== 'complete' && (
            <Button
              onClick={handleStart}
              size="lg"
              className={cn(
                'rounded-full px-12 py-6 text-lg font-semibold',
                emotionGradients[emotionType],
                'text-primary-foreground border-0'
              )}
            >
              <Play className="w-5 h-5 mr-2" />
              Iniciar
            </Button>
          )}

          {isRunning && (
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="rounded-full px-8 py-6"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pausar
            </Button>
          )}

          {phase === 'complete' && (
            <>
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Repetir
              </Button>
              <Button
                onClick={onClose}
                size="lg"
                className={cn(
                  'rounded-full px-8 py-6',
                  emotionGradients[emotionType],
                  'text-primary-foreground'
                )}
              >
                Concluir
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
