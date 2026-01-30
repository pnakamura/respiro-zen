import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  WaveVisualizer,
  FluidParticles,
  MandalaVisualizer,
  CurveEditor,
  BreathCurveConfig,
} from '@/components/animation-studio';
import {
  breathEquations,
  AnimationEquation,
  getEquationById,
} from '@/lib/math-animations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Waves,
  Sparkles,
  CircleDot,
  Palette,
  Settings2,
  Maximize2,
  Eye,
  Zap,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Flower2,
  Droplets,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type VisualizationType = 'particles' | 'mandala' | 'wave' | 'combined';
type ColorScheme = 'calm' | 'energy' | 'focus' | 'nature';
type BreathPhase = 'idle' | 'inhale' | 'holdIn' | 'exhale' | 'holdOut';

interface BreathConfig {
  inhaleDuration: number;
  holdInDuration: number;
  exhaleDuration: number;
  holdOutDuration: number;
  cycles: number;
}

const defaultBreathConfig: BreathConfig = {
  inhaleDuration: 4000,
  holdInDuration: 4000,
  exhaleDuration: 4000,
  holdOutDuration: 4000,
  cycles: 4,
};

const visualizationOptions = [
  { id: 'particles', label: 'Partículas', icon: Droplets },
  { id: 'mandala', label: 'Mandala', icon: Flower2 },
  { id: 'wave', label: 'Onda', icon: Waves },
  { id: 'combined', label: 'Combinado', icon: Sparkles },
];

const colorSchemeOptions = [
  { id: 'calm', label: 'Calmo', colors: ['#4ECDC4', '#45B7D1'] },
  { id: 'energy', label: 'Energia', colors: ['#FF6B6B', '#FFE66D'] },
  { id: 'focus', label: 'Foco', colors: ['#A78BFA', '#6366F1'] },
  { id: 'nature', label: 'Natureza', colors: ['#88D8B0', '#7CB342'] },
];

export default function AnimationStudio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'preview' | 'editor'>('preview');
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('combined');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('calm');
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>('idle');
  const [progress, setProgress] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [breathConfig, setBreathConfig] = useState<BreathConfig>(defaultBreathConfig);
  const [selectedEquation, setSelectedEquation] = useState<AnimationEquation>(breathEquations[0]);
  const [equationParams, setEquationParams] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize equation params
  useEffect(() => {
    const params: Record<string, number> = {};
    selectedEquation.parameters.forEach((param) => {
      params[param.name] = param.default;
    });
    setEquationParams(params);
  }, [selectedEquation]);

  // Breathing animation loop
  const runBreathingAnimation = useCallback(() => {
    if (!isPlaying) return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const cycleDuration =
      breathConfig.inhaleDuration +
      breathConfig.holdInDuration +
      breathConfig.exhaleDuration +
      breathConfig.holdOutDuration;

    const currentCycleTime = elapsed % cycleDuration;
    const cycleNumber = Math.floor(elapsed / cycleDuration);

    if (cycleNumber >= breathConfig.cycles) {
      setIsPlaying(false);
      setBreathPhase('idle');
      setProgress(0);
      setCurrentCycle(0);
      return;
    }

    setCurrentCycle(cycleNumber + 1);

    let newPhase: BreathPhase = 'idle';
    let newProgress = 0;

    if (currentCycleTime < breathConfig.inhaleDuration) {
      newPhase = 'inhale';
      newProgress = currentCycleTime / breathConfig.inhaleDuration;
    } else if (currentCycleTime < breathConfig.inhaleDuration + breathConfig.holdInDuration) {
      newPhase = 'holdIn';
      newProgress = (currentCycleTime - breathConfig.inhaleDuration) / breathConfig.holdInDuration;
    } else if (
      currentCycleTime <
      breathConfig.inhaleDuration + breathConfig.holdInDuration + breathConfig.exhaleDuration
    ) {
      newPhase = 'exhale';
      newProgress =
        (currentCycleTime - breathConfig.inhaleDuration - breathConfig.holdInDuration) /
        breathConfig.exhaleDuration;
    } else {
      newPhase = 'holdOut';
      newProgress =
        (currentCycleTime -
          breathConfig.inhaleDuration -
          breathConfig.holdInDuration -
          breathConfig.exhaleDuration) /
        breathConfig.holdOutDuration;
    }

    setBreathPhase(newPhase);
    setProgress(newProgress);

    animationRef.current = requestAnimationFrame(runBreathingAnimation);
  }, [isPlaying, breathConfig]);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(runBreathingAnimation);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, runBreathingAnimation]);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    } else {
      setIsPlaying(true);
      setBreathPhase('inhale');
      setProgress(0);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setBreathPhase('idle');
    setProgress(0);
    setCurrentCycle(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSaveCurve = (config: BreathCurveConfig) => {
    setBreathConfig({
      inhaleDuration: config.inhale.duration,
      holdInDuration: config.holdIn.duration,
      exhaleDuration: config.exhale.duration,
      holdOutDuration: config.holdOut.duration,
      cycles: config.cycles,
    });
    const equation = getEquationById(config.inhale.equationId);
    if (equation) {
      setSelectedEquation(equation);
      setEquationParams(config.inhale.params);
    }
  };

  const totalCycleDuration =
    (breathConfig.inhaleDuration +
      breathConfig.holdInDuration +
      breathConfig.exhaleDuration +
      breathConfig.holdOutDuration) /
    1000;

  const phaseLabels: Record<BreathPhase, string> = {
    idle: 'Preparar',
    inhale: 'Inspire',
    holdIn: 'Segure',
    exhale: 'Expire',
    holdOut: 'Pausar',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-cyan-300 bg-clip-text text-transparent">
                Animation Studio
              </h1>
              <p className="text-xs text-muted-foreground">
                Crie e visualize animações de respiração
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'preview' | 'editor')}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="w-4 h-4" />
              Visualizar
            </TabsTrigger>
            <TabsTrigger value="editor" className="gap-2">
              <Settings2 className="w-4 h-4" />
              Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            {/* Main visualization area */}
            <div ref={containerRef} className="relative">
              <Card className="border-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 overflow-hidden backdrop-blur-xl">
                <CardContent className="p-0">
                  {/* Visualization */}
                  <div className="relative aspect-square max-h-[60vh] w-full">
                    <AnimatePresence mode="wait">
                      {(visualizationType === 'particles' || visualizationType === 'combined') && (
                        <motion.div
                          key="particles"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: visualizationType === 'combined' ? 0.7 : 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                        >
                          <FluidParticles
                            breathPhase={breathPhase}
                            progress={progress}
                            colorScheme={colorScheme}
                            particleCount={100}
                          />
                        </motion.div>
                      )}

                      {(visualizationType === 'mandala' || visualizationType === 'combined') && (
                        <motion.div
                          key="mandala"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: visualizationType === 'combined' ? 0.8 : 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0"
                        >
                          <MandalaVisualizer
                            breathPhase={breathPhase}
                            progress={progress}
                            equation={selectedEquation}
                            equationParams={equationParams}
                            colorScheme={
                              colorScheme === 'calm'
                                ? 'ocean'
                                : colorScheme === 'energy'
                                ? 'sunset'
                                : colorScheme === 'focus'
                                ? 'cosmic'
                                : 'forest'
                            }
                            layers={5}
                            petalsPerLayer={8}
                          />
                        </motion.div>
                      )}

                      {visualizationType === 'wave' && (
                        <motion.div
                          key="wave"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center p-8"
                        >
                          <WaveVisualizer
                            equation={selectedEquation}
                            params={equationParams}
                            currentTime={progress}
                            isPlaying={isPlaying}
                            showGrid={showGrid}
                            colorScheme={colorScheme}
                            height={300}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Phase indicator overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="text-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={breathPhase}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-2"
                          >
                            <p className="text-4xl font-bold text-white drop-shadow-lg">
                              {phaseLabels[breathPhase]}
                            </p>
                            {isPlaying && (
                              <p className="text-lg text-white/80">
                                Ciclo {currentCycle} de {breathConfig.cycles}
                              </p>
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controls */}
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-6">
                {/* Playback controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleReset}
                    className="rounded-full w-12 h-12"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </Button>

                  <Button
                    variant={isPlaying ? 'destructive' : 'default'}
                    size="lg"
                    onClick={handlePlayPause}
                    className="rounded-full w-20 h-20 text-2xl"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                  </Button>

                  <Button variant="outline" size="icon" className="rounded-full w-12 h-12">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>

                {/* Timeline */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duração do ciclo</span>
                    <Badge variant="secondary">{totalCycleDuration.toFixed(1)}s</Badge>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-500 transition-all"
                      style={{
                        width: `${(breathConfig.inhaleDuration / (totalCycleDuration * 1000)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                      style={{
                        width: `${(breathConfig.holdInDuration / (totalCycleDuration * 1000)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-500 transition-all"
                      style={{
                        width: `${(breathConfig.exhaleDuration / (totalCycleDuration * 1000)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                      style={{
                        width: `${(breathConfig.holdOutDuration / (totalCycleDuration * 1000)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Inspirar</span>
                    <span>Segurar</span>
                    <span>Expirar</span>
                    <span>Pausar</span>
                  </div>
                </div>

                {/* Quick settings */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Visualization type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Visualização</label>
                    <Select
                      value={visualizationType}
                      onValueChange={(v) => setVisualizationType(v as VisualizationType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {visualizationOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            <div className="flex items-center gap-2">
                              <opt.icon className="w-4 h-4" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color scheme */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cores</label>
                    <Select
                      value={colorScheme}
                      onValueChange={(v) => setColorScheme(v as ColorScheme)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {colorSchemeOptions.map((opt) => (
                          <SelectItem key={opt.id} value={opt.id}>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {opt.colors.map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-3 h-3 rounded-full -ml-1 first:ml-0 border border-background"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Equation selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Equação da Animação</label>
                  <Select
                    value={selectedEquation.id}
                    onValueChange={(v) => {
                      const eq = breathEquations.find((e) => e.id === v);
                      if (eq) setSelectedEquation(eq);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {breathEquations.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          <div className="flex flex-col">
                            <span>{eq.name}</span>
                            <span className="text-xs text-muted-foreground">{eq.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

                {/* Breath timing sliders */}
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium">Tempos de Respiração</h4>

                  {[
                    { key: 'inhaleDuration', label: 'Inspirar', icon: Wind },
                    { key: 'holdInDuration', label: 'Segurar (entrada)', icon: CircleDot },
                    { key: 'exhaleDuration', label: 'Expirar', icon: Wind },
                    { key: 'holdOutDuration', label: 'Segurar (saída)', icon: CircleDot },
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                          {label}
                        </span>
                        <Badge variant="secondary">
                          {(breathConfig[key as keyof BreathConfig] as number) / 1000}s
                        </Badge>
                      </div>
                      <Slider
                        value={[breathConfig[key as keyof BreathConfig] as number]}
                        onValueChange={([v]) =>
                          setBreathConfig((prev) => ({ ...prev, [key]: v }))
                        }
                        min={0}
                        max={10000}
                        step={500}
                      />
                    </div>
                  ))}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Ciclos</span>
                      <Badge variant="secondary">{breathConfig.cycles}</Badge>
                    </div>
                    <Slider
                      value={[breathConfig.cycles]}
                      onValueChange={([v]) =>
                        setBreathConfig((prev) => ({ ...prev, cycles: v }))
                      }
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Presets */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Padrões Prontos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    {
                      name: 'Box Breathing',
                      config: { inhaleDuration: 4000, holdInDuration: 4000, exhaleDuration: 4000, holdOutDuration: 4000, cycles: 4 },
                    },
                    {
                      name: '4-7-8',
                      config: { inhaleDuration: 4000, holdInDuration: 7000, exhaleDuration: 8000, holdOutDuration: 0, cycles: 4 },
                    },
                    {
                      name: 'Coerência',
                      config: { inhaleDuration: 5000, holdInDuration: 0, exhaleDuration: 5000, holdOutDuration: 0, cycles: 10 },
                    },
                    {
                      name: 'Energizante',
                      config: { inhaleDuration: 4000, holdInDuration: 0, exhaleDuration: 2000, holdOutDuration: 0, cycles: 6 },
                    },
                  ].map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto py-3 flex-col gap-1"
                      onClick={() => setBreathConfig(preset.config)}
                    >
                      <span className="font-medium">{preset.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {preset.config.inhaleDuration / 1000}-{preset.config.holdInDuration / 1000}-
                        {preset.config.exhaleDuration / 1000}-{preset.config.holdOutDuration / 1000}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="editor">
            <CurveEditor onSave={handleSaveCurve} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
