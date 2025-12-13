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
  const [panicSubPhase, setPanicSubPhase] = useState<'inhale1' | 'pause1' | 'inhale2' | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
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
    const midScale = 1.25; // Scale after first inhale in physiological sigh
    
    if (isPanic) {
      // Physiological Sigh: 2s inhale, 1s pause, 2s inhale, 1s pause (holdIn), 6s exhale
      // Total inhale phase: 5s (2s + 1s pause + 2s)
      // times: 0=start, 0.4=end first inhale (2s), 0.6=end pause (1s), 1.0=end second inhale (2s)
      return {
        idle: { scale: baseScale },
        inhale: { 
          scale: [baseScale, midScale, midScale, maxScale],
          transition: { 
            duration: pattern.inhale / 1000, // 5 seconds total
            times: [0, 0.4, 0.6, 1], // 2s up, 1s hold, 2s up
            ease: ["easeOut", "linear", "easeOut"]
          }
        },
        holdIn: { 
          scale: maxScale,
          transition: { duration: pattern.holdIn / 1000 } // 1s pause
        },
        exhale: { 
          scale: baseScale,
          transition: { 
            duration: pattern.exhale / 1000, // 6 seconds
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

  // Utility to create a cancellable delay
  const delay = useCallback((ms: number, signal: AbortSignal): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(resolve, ms);
      signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    });
  }, []);

  const runBreathCycle = useCallback(async (signal: AbortSignal) => {
    const phases: { phase: BreathPhase; duration: number }[] = [];
    
    if (pattern.inhale > 0) phases.push({ phase: 'inhale', duration: pattern.inhale });
    if (pattern.holdIn > 0) phases.push({ phase: 'holdIn', duration: pattern.holdIn });
    if (pattern.exhale > 0) phases.push({ phase: 'exhale', duration: pattern.exhale });
    if (pattern.holdOut > 0) phases.push({ phase: 'holdOut', duration: pattern.holdOut });

    for (const { phase, duration } of phases) {
      if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
      
      setPhase(phase);
      playBell();
      
      // For panic mode inhale phase, track sub-phases (2s inhale1, 1s pause, 2s inhale2)
      if (isPanic && phase === 'inhale') {
        setPanicSubPhase('inhale1');
        
        const startTime = Date.now();
        setPhaseTime(1);
        
        const updatePanicPhase = () => {
          if (signal.aborted) return;
          const elapsed = Date.now() - startTime;
          
          // Sub-phase transitions: 0-2s = inhale1, 2-3s = pause1, 3-5s = inhale2
          if (elapsed < 2000) {
            setPanicSubPhase('inhale1');
            setPhaseTime(Math.ceil(elapsed / 1000) || 1);
          } else if (elapsed < 3000) {
            setPanicSubPhase('pause1');
            setPhaseTime(1);
          } else {
            setPanicSubPhase('inhale2');
            setPhaseTime(Math.ceil((elapsed - 3000) / 1000) || 1);
          }
          
          if (elapsed < duration && !signal.aborted) {
            requestAnimationFrame(updatePanicPhase);
          }
        };
        
        updatePanicPhase();
        await delay(duration, signal);
        setPanicSubPhase(null);
      } else {
        // Normal phase time tracking
        const startTime = Date.now();
        const totalDuration = duration;
        setPhaseTime(1);
        
        const updatePhaseTime = () => {
          if (signal.aborted) return;
          const elapsed = Date.now() - startTime;
          const currentSecond = Math.min(Math.ceil(elapsed / 1000), Math.ceil(totalDuration / 1000));
          setPhaseTime(currentSecond);
          
          if (elapsed < totalDuration && !signal.aborted) {
            requestAnimationFrame(updatePhaseTime);
          }
        };
        
        updatePhaseTime();
        await delay(duration, signal);
      }
    }
  }, [pattern, playBell, delay, isPanic]);

  const startBreathing = useCallback(async () => {
    // Cancel any previous session
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;
    
    startTimeRef.current = Date.now();
    setIsRunning(true);
    
    try {
      // Countdown
      for (let i = 3; i > 0; i--) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        setCountdown(i);
        await delay(1000, signal);
      }
      setCountdown(0);

      // Run cycles
      for (let cycle = 0; cycle < pattern.cycles; cycle++) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        setCurrentCycle(cycle + 1);
        await runBreathCycle(signal);
      }

      setPhase('complete');
      setIsRunning(false);
      
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      onComplete(durationSeconds);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        // Session was cancelled - do nothing
        return;
      }
      throw error;
    }
  }, [pattern.cycles, runBreathCycle, onComplete, delay]);

  const handleStart = () => {
    if (!isRunning) {
      startBreathing();
    }
  };

  const handlePause = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
    setPhase('idle');
    setPhaseTime(0);
    setCountdown(3);
    setPanicSubPhase(null);
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsRunning(false);
    setPhase('idle');
    setCurrentCycle(0);
    setCountdown(3);
    setPhaseTime(0);
    setPanicSubPhase(null);
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
          <h2 className="text-xl md:text-lg font-semibold text-foreground">
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
          <p className="text-base md:text-sm text-muted-foreground">
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

      {/* Main breathing area - GRID LAYOUT for fixed separation */}
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] items-center px-6 py-4 overflow-hidden">

        {/* TOP SECTION: Phase label - COMPLETELY SEPARATE from circle */}
        <div className="min-h-[100px] flex flex-col items-center justify-end pb-6 z-10">
          <AnimatePresence mode="wait">
            {isRunning && countdown === 0 && phase !== 'complete' && (
              <motion.div
                key={isPanic && phase === 'inhale' ? `panic-${panicSubPhase}` : phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  {isPanic && phase === 'inhale' && panicSubPhase === 'pause1' ? (
                    <Circle className="w-8 h-8" />
                  ) : (
                    phaseIcons[phase]
                  )}
                </div>
                <span className="text-5xl font-bold tracking-wide text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                  {isPanic && phase === 'inhale' ? (
                    panicSubPhase === 'inhale1' ? 'Inspire 1' :
                    panicSubPhase === 'pause1' ? 'Segure' :
                    panicSubPhase === 'inhale2' ? 'Inspire 2' :
                    phaseLabels[phase]
                  ) : (
                    phaseLabels[phase]
                  )}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Idle state message */}
          {!isRunning && phase === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl md:text-lg text-muted-foreground text-center"
            >
              Pressione iniciar e<br />acompanhe o ritmo
            </motion.p>
          )}
        </div>

        {/* MIDDLE SECTION: Breathing circle container with padding for expansion */}
        <div className="flex items-center justify-center min-h-[280px]">
          <div className="relative flex items-center justify-center w-72 h-72">
            {/* Outer glow ring */}
            <motion.div
              className={cn(
                'absolute w-48 h-48 rounded-full opacity-30',
                emotionGradients[emotionType]
              )}
              animate={{
                scale: phase === 'inhale' ? [1, 1.4] : phase === 'exhale' ? [1.4, 1] : 1.2,
              }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Main circle - PURE VISUAL, NO TEXT */}
            <motion.div
              className={cn(
                'w-40 h-40 rounded-full',
                emotionGradients[emotionType],
                emotionShadows[emotionType]
              )}
              variants={getPhaseVariants()}
              animate={phase}
              initial="idle"
            />

            {/* Countdown - CENTERED ON CIRCLE */}
            {/* Countdown before start */}
            <AnimatePresence>
              {countdown > 0 && isRunning && (
                <motion.span
                  key={countdown}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  className="absolute text-7xl font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]"
                >
                  {countdown}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Phase timer - CENTERED ON CIRCLE, PROGRESSIVE */}
            <AnimatePresence>
              {phaseTime > 0 && isRunning && countdown === 0 && phase !== 'complete' && (
                <motion.div
                  key={`phase-${phase}-${phaseTime}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute flex items-center justify-center"
                >
                  <span className="text-6xl font-bold text-white tabular-nums drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
                    {phaseTime}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* BOTTOM SECTION: Cycle indicator only */}
        <div className="min-h-[100px] flex flex-col items-center justify-start pt-6 z-10">

          {/* Cycle indicator */}
          {isRunning && countdown === 0 && phase !== 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-3"
            >
              <p className="text-base md:text-sm text-muted-foreground mb-2">
                Ciclo {currentCycle} de {pattern.cycles}
              </p>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: pattern.cycles }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all duration-300',
                      i < currentCycle 
                        ? emotionGradients[emotionType] 
                        : 'bg-muted'
                    )}
                    animate={{ 
                      scale: i === currentCycle - 1 ? 1.5 : 1,
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
                <p className={cn("text-4xl md:text-3xl font-bold", emotionTextColors[emotionType])}>
                  Parabéns!
                </p>
                <p className="text-lg md:text-base text-muted-foreground mt-2">
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
