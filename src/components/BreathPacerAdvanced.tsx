import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BreathPattern, BreathPhase, EmotionType } from '@/types/breathing';
import {
  breathEquations,
  AnimationEquation,
  getEquationById,
} from '@/lib/math-animations';
import { FluidParticles } from '@/components/animation-studio/FluidParticles';
import { MandalaVisualizer } from '@/components/animation-studio/MandalaVisualizer';
import { cn } from '@/lib/utils';
import { X, Play, Pause, RotateCcw, Info, ArrowUp, ArrowDown, Circle, Settings2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BreathPacerAdvancedProps {
  pattern: BreathPattern;
  emotionType: EmotionType;
  explanation: string;
  colorClass?: string;
  bgClass?: string;
  backgroundAudioUrl?: string | null;
  onClose: () => void;
  onComplete: (durationSeconds: number) => void;
}

type VisualizationType = 'classic' | 'particles' | 'mandala' | 'combined';

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

const emotionToColorScheme: Record<EmotionType, 'calm' | 'energy' | 'focus' | 'nature'> = {
  anxious: 'calm',
  angry: 'nature',
  tired: 'energy',
  panic: 'energy',
  meditate: 'focus',
  wimhof: 'energy',
  alternate: 'calm',
  coherent: 'nature',
};

const emotionToMandalaScheme: Record<EmotionType, 'lotus' | 'ocean' | 'sunset' | 'forest' | 'cosmic'> = {
  anxious: 'ocean',
  angry: 'forest',
  tired: 'sunset',
  panic: 'sunset',
  meditate: 'cosmic',
  wimhof: 'sunset',
  alternate: 'ocean',
  coherent: 'forest',
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

const BELL_SOUND_URL = 'https://cdn.freesound.org/previews/411/411089_5121236-lq.mp3';

export function BreathPacerAdvanced({
  pattern,
  emotionType,
  explanation,
  colorClass,
  bgClass,
  backgroundAudioUrl,
  onClose,
  onComplete,
}: BreathPacerAdvancedProps) {
  // Visualization settings
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('combined');
  const [selectedEquationId, setSelectedEquationId] = useState('smooth-sine');
  const [equationParams, setEquationParams] = useState<Record<string, number>>({});
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Breath state
  const [phase, setPhase] = useState<BreathPhase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [phaseTime, setPhaseTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [panicSubPhase, setPanicSubPhase] = useState<'inhale1' | 'pause1' | 'inhale2' | null>(null);

  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isPanic = emotionType === 'panic';

  const selectedEquation = useMemo(
    () => getEquationById(selectedEquationId) || breathEquations[0],
    [selectedEquationId]
  );

  // Initialize equation params
  useEffect(() => {
    const params: Record<string, number> = {};
    selectedEquation.parameters.forEach((param) => {
      params[param.name] = param.default;
    });
    setEquationParams(params);
  }, [selectedEquation]);

  // Color handling
  const getColorVariable = (textClass: string): string => {
    const colorMap: Record<string, string> = {
      'text-calm': '--calm',
      'text-energy': '--energy',
      'text-grounding': '--grounding',
      'text-panic': '--panic',
      'text-meditate': '--meditate',
      'text-primary': '--calm',
    };
    return colorMap[textClass] || '--calm';
  };

  const dynamicTextColor = colorClass || `text-${emotionType === 'anxious' ? 'calm' : emotionType}`;
  const colorVar = getColorVariable(dynamicTextColor);

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

  useEffect(() => {
    if (backgroundAudioUrl) {
      backgroundAudioRef.current = new Audio(backgroundAudioUrl);
      backgroundAudioRef.current.volume = 0.4;
      backgroundAudioRef.current.loop = true;
    }
    return () => {
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current = null;
      }
    };
  }, [backgroundAudioUrl]);

  const playBell = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, []);

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

      const startTime = Date.now();
      setPhaseTime(1);
      setProgress(0);

      const updatePhase = () => {
        if (signal.aborted) return;
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(elapsed / duration, 1);
        setProgress(currentProgress);
        setPhaseTime(Math.ceil(elapsed / 1000) || 1);

        if (elapsed < duration && !signal.aborted) {
          requestAnimationFrame(updatePhase);
        }
      };

      updatePhase();
      await delay(duration, signal);
    }
  }, [pattern, playBell, delay]);

  const startBreathing = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    startTimeRef.current = Date.now();
    setIsRunning(true);

    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.currentTime = 0;
      backgroundAudioRef.current.play().catch(() => {});
    }

    try {
      for (let i = 3; i > 0; i--) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        setCountdown(i);
        await delay(1000, signal);
      }
      setCountdown(0);

      for (let cycle = 0; cycle < pattern.cycles; cycle++) {
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        setCurrentCycle(cycle + 1);
        await runBreathCycle(signal);
      }

      setPhase('complete');
      setIsRunning(false);

      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
      }

      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      onComplete(durationSeconds);
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        if (backgroundAudioRef.current) {
          backgroundAudioRef.current.pause();
        }
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
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
    }
    setIsRunning(false);
    setPhase('idle');
    setPhaseTime(0);
    setCountdown(3);
    setProgress(0);
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (backgroundAudioRef.current) {
      backgroundAudioRef.current.pause();
      backgroundAudioRef.current.currentTime = 0;
    }
    setIsRunning(false);
    setPhase('idle');
    setCurrentCycle(0);
    setCountdown(3);
    setPhaseTime(0);
    setProgress(0);
  };

  // Calculate animated scale based on equation
  const animatedScale = useMemo(() => {
    if (phase === 'idle' || phase === 'complete') return 1;
    if (phase === 'holdIn') return 1.5;
    if (phase === 'holdOut') return 1;

    const equationValue = selectedEquation.evaluate(progress, equationParams);

    if (phase === 'inhale') {
      return 1 + equationValue * 0.5;
    } else if (phase === 'exhale') {
      return 1.5 - equationValue * 0.5;
    }
    return 1;
  }, [phase, progress, selectedEquation, equationParams]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col bg-background overflow-hidden"
    >
      {/* Background visualization */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {(visualizationType === 'particles' || visualizationType === 'combined') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: visualizationType === 'combined' ? 0.5 : 0.8 }}
            className="absolute inset-0"
          >
            <FluidParticles
              breathPhase={phase}
              progress={progress}
              colorScheme={emotionToColorScheme[emotionType]}
              particleCount={80}
            />
          </motion.div>
        )}

        {(visualizationType === 'mandala' || visualizationType === 'combined') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: visualizationType === 'combined' ? 0.4 : 0.7 }}
            className="absolute inset-0"
          >
            <MandalaVisualizer
              breathPhase={phase}
              progress={progress}
              equation={selectedEquation}
              equationParams={equationParams}
              colorScheme={emotionToMandalaScheme[emotionType]}
              layers={4}
              petalsPerLayer={6}
              rotationSpeed={0.3}
            />
          </motion.div>
        )}

        {/* Gradient overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            background:
              phase === 'inhale'
                ? `radial-gradient(circle at center, hsl(var(${colorVar}) / 0.2) 0%, transparent 70%)`
                : phase === 'exhale'
                ? `radial-gradient(circle at center, hsl(var(${colorVar}) / 0.1) 0%, transparent 70%)`
                : `radial-gradient(circle at center, hsl(var(${colorVar}) / 0.15) 0%, transparent 70%)`,
          }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between p-4 safe-top relative z-10"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-lg font-semibold text-foreground">{pattern.name}</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
                  <Info className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm mx-4">
                <DialogHeader>
                  <DialogTitle className={dynamicTextColor}>{pattern.name}</DialogTitle>
                  <DialogDescription className="pt-3 text-base leading-relaxed">
                    {explanation}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <p className="text-lg md:text-sm text-muted-foreground">{pattern.description}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Settings sheet */}
          <Sheet open={showAdvancedSettings} onOpenChange={setShowAdvancedSettings}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Settings2 className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Configurações Avançadas
                </SheetTitle>
                <SheetDescription>
                  Personalize a visualização da sua respiração
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Visualization type */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tipo de Visualização</label>
                  <Select
                    value={visualizationType}
                    onValueChange={(v) => setVisualizationType(v as VisualizationType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Clássico</SelectItem>
                      <SelectItem value="particles">Partículas</SelectItem>
                      <SelectItem value="mandala">Mandala</SelectItem>
                      <SelectItem value="combined">Combinado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Equation selector */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Curva da Animação</label>
                  <Select
                    value={selectedEquationId}
                    onValueChange={setSelectedEquationId}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {breathEquations.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          {eq.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">{selectedEquation.description}</p>
                </div>

                {/* Equation parameters */}
                {selectedEquation.parameters.length > 0 && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium">Parâmetros</h4>
                    {selectedEquation.parameters.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{param.label}</span>
                          <Badge variant="outline">
                            {(equationParams[param.name] ?? param.default).toFixed(2)}
                          </Badge>
                        </div>
                        <Slider
                          value={[equationParams[param.name] ?? param.default]}
                          onValueChange={([v]) =>
                            setEquationParams((prev) => ({ ...prev, [param.name]: v }))
                          }
                          min={param.min}
                          max={param.max}
                          step={param.step}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Formula display */}
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Fórmula:</p>
                  <code className="text-sm font-mono text-primary">{selectedEquation.formula}</code>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </motion.header>

      {/* Main breathing area */}
      <div className="flex-1 grid grid-rows-[auto_1fr_auto] items-center px-6 py-4 overflow-hidden relative z-10">
        {/* Phase label */}
        <div className="min-h-[100px] flex flex-col items-center justify-end pb-6">
          <AnimatePresence mode="wait">
            {isRunning && countdown === 0 && phase !== 'complete' && (
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {phaseIcons[phase]}
                </motion.div>
                <span className="text-5xl font-bold tracking-wide text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]">
                  {phaseLabels[phase]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {!isRunning && phase === 'idle' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl md:text-lg text-muted-foreground text-center"
            >
              Pressione iniciar e<br />acompanhe o ritmo
            </motion.p>
          )}
        </div>

        {/* Breathing circle */}
        <div className="flex items-center justify-center min-h-[280px]">
          <div className="relative flex items-center justify-center w-72 h-72">
            {/* Ripple rings */}
            {isRunning &&
              countdown === 0 &&
              visualizationType === 'classic' &&
              [1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute rounded-full border-2 opacity-20"
                  style={{
                    width: 160 + ring * 50,
                    height: 160 + ring * 50,
                    borderColor: `hsl(var(${colorVar}) / 0.3)`,
                  }}
                  animate={{
                    scale: animatedScale,
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    delay: ring * 0.15,
                    ease: 'easeInOut',
                  }}
                />
              ))}

            {/* Main circle */}
            <motion.div
              className="w-40 h-40 rounded-full"
              style={{
                background: `linear-gradient(to bottom right, hsl(var(${colorVar})), hsl(var(${colorVar}) / 0.7))`,
                boxShadow:
                  phase !== 'idle'
                    ? `0 0 100px 30px hsl(var(${colorVar}) / 0.4)`
                    : `0 0 60px 15px hsl(var(${colorVar}) / 0.3)`,
              }}
              animate={{ scale: animatedScale }}
              transition={{
                duration: 0.1,
                ease: 'linear',
              }}
            />

            {/* Countdown */}
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

            {/* Phase timer */}
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

        {/* Cycle indicator */}
        <div className="min-h-[100px] flex flex-col items-center justify-start pt-6">
          {isRunning && countdown === 0 && phase !== 'complete' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-3"
            >
              <p className="text-lg md:text-sm text-muted-foreground mb-2">
                Ciclo {currentCycle} de {pattern.cycles}
              </p>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: pattern.cycles }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={cn(
                      'w-2.5 h-2.5 rounded-full transition-all duration-300',
                      i < currentCycle ? emotionGradients[emotionType] : 'bg-muted'
                    )}
                    animate={{
                      scale: i === currentCycle - 1 ? 1.5 : 1,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {phase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <p className={cn('text-5xl md:text-3xl font-bold', dynamicTextColor)}>Parabéns!</p>
                <p className="text-xl md:text-base text-muted-foreground mt-3">
                  Você completou a prática
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom controls */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-6 safe-bottom relative z-10"
      >
        <div className="flex justify-center gap-4">
          {!isRunning && phase !== 'complete' && (
            <Button
              onClick={handleStart}
              size="lg"
              className={cn(
                'rounded-full px-14 py-7 text-xl md:text-lg font-semibold',
                emotionGradients[emotionType],
                'text-primary-foreground border-0'
              )}
            >
              <Play className="w-6 h-6 md:w-5 md:h-5 mr-2" />
              Iniciar
            </Button>
          )}

          {isRunning && (
            <Button
              onClick={handlePause}
              size="lg"
              variant="outline"
              className="rounded-full px-10 py-7 text-lg md:text-base"
            >
              <Pause className="w-6 h-6 md:w-5 md:h-5 mr-2" />
              Pausar
            </Button>
          )}

          {phase === 'complete' && (
            <>
              <Button
                onClick={handleReset}
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-7 text-lg md:text-base"
              >
                <RotateCcw className="w-6 h-6 md:w-5 md:h-5 mr-2" />
                Repetir
              </Button>
              <Button
                onClick={onClose}
                size="lg"
                className={cn(
                  'rounded-full px-10 py-7 text-lg md:text-base',
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
