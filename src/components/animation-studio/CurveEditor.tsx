import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AnimationEquation,
  breathEquations,
  generateCurvePoints,
} from '@/lib/math-animations';
import { WaveVisualizer } from './WaveVisualizer';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Waves,
  Zap,
  CircleDot,
  TrendingUp,
  Activity,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Save,
  Copy,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CurveEditorProps {
  onSave?: (config: BreathCurveConfig) => void;
  initialConfig?: BreathCurveConfig;
  className?: string;
}

export interface BreathCurveConfig {
  name: string;
  inhale: {
    equationId: string;
    params: Record<string, number>;
    duration: number;
  };
  holdIn: {
    duration: number;
  };
  exhale: {
    equationId: string;
    params: Record<string, number>;
    duration: number;
  };
  holdOut: {
    duration: number;
  };
  cycles: number;
}

const defaultConfig: BreathCurveConfig = {
  name: 'Padrão Personalizado',
  inhale: {
    equationId: 'smooth-sine',
    params: { amplitude: 1, frequency: 0.5, phase: 0 },
    duration: 4000,
  },
  holdIn: { duration: 0 },
  exhale: {
    equationId: 'ease-exponential',
    params: { exponent: 2 },
    duration: 4000,
  },
  holdOut: { duration: 0 },
  cycles: 4,
};

const equationIcons: Record<string, React.ReactNode> = {
  'smooth-sine': <Waves className="w-4 h-4" />,
  'ease-exponential': <TrendingUp className="w-4 h-4" />,
  'elastic-breath': <Zap className="w-4 h-4" />,
  'circular-flow': <CircleDot className="w-4 h-4" />,
  'gaussian-peak': <Activity className="w-4 h-4" />,
  'damped-oscillation': <Activity className="w-4 h-4" />,
  'bezier-smooth': <Sparkles className="w-4 h-4" />,
  'wave-triangle': <Waves className="w-4 h-4" />,
  'polynomial-custom': <TrendingUp className="w-4 h-4" />,
  'logarithmic-soft': <TrendingUp className="w-4 h-4" />,
};

export function CurveEditor({
  onSave,
  initialConfig = defaultConfig,
  className,
}: CurveEditorProps) {
  const [config, setConfig] = useState<BreathCurveConfig>(initialConfig);
  const [activePhase, setActivePhase] = useState<'inhale' | 'exhale'>('inhale');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showFormula, setShowFormula] = useState(false);

  const inhaleEquation = useMemo(
    () => breathEquations.find((eq) => eq.id === config.inhale.equationId) || breathEquations[0],
    [config.inhale.equationId]
  );

  const exhaleEquation = useMemo(
    () => breathEquations.find((eq) => eq.id === config.exhale.equationId) || breathEquations[0],
    [config.exhale.equationId]
  );

  const currentEquation = activePhase === 'inhale' ? inhaleEquation : exhaleEquation;
  const currentParams =
    activePhase === 'inhale' ? config.inhale.params : config.exhale.params;

  const updateParam = useCallback(
    (paramName: string, value: number) => {
      setConfig((prev) => ({
        ...prev,
        [activePhase]: {
          ...prev[activePhase],
          params: {
            ...prev[activePhase].params,
            [paramName]: value,
          },
        },
      }));
    },
    [activePhase]
  );

  const updateEquation = useCallback(
    (equationId: string) => {
      const newEquation = breathEquations.find((eq) => eq.id === equationId);
      if (!newEquation) return;

      const defaultParams: Record<string, number> = {};
      newEquation.parameters.forEach((param) => {
        defaultParams[param.name] = param.default;
      });

      setConfig((prev) => ({
        ...prev,
        [activePhase]: {
          ...prev[activePhase],
          equationId,
          params: defaultParams,
        },
      }));
    },
    [activePhase]
  );

  const updateDuration = useCallback(
    (phase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut', duration: number) => {
      setConfig((prev) => ({
        ...prev,
        [phase]: {
          ...prev[phase],
          duration,
        },
      }));
    },
    []
  );

  // Animation loop
  const handlePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setCurrentTime(0);

    const totalCycleDuration =
      config.inhale.duration +
      config.holdIn.duration +
      config.exhale.duration +
      config.holdOut.duration;

    let startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const cycleTime = elapsed % totalCycleDuration;
      let normalizedTime = 0;

      if (cycleTime < config.inhale.duration) {
        normalizedTime = cycleTime / config.inhale.duration;
        if (activePhase !== 'inhale') setActivePhase('inhale');
      } else if (cycleTime < config.inhale.duration + config.holdIn.duration) {
        normalizedTime = 1;
      } else if (
        cycleTime <
        config.inhale.duration + config.holdIn.duration + config.exhale.duration
      ) {
        normalizedTime =
          (cycleTime - config.inhale.duration - config.holdIn.duration) /
          config.exhale.duration;
        if (activePhase !== 'exhale') setActivePhase('exhale');
      } else {
        normalizedTime = 0;
      }

      setCurrentTime(normalizedTime);

      if (elapsed < totalCycleDuration * config.cycles) {
        requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };

    requestAnimationFrame(animate);
  }, [isPlaying, config, activePhase]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setConfig(defaultConfig);
  }, []);

  const handleSave = useCallback(() => {
    onSave?.(config);
  }, [config, onSave]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
  }, [config]);

  const totalDuration =
    (config.inhale.duration +
      config.holdIn.duration +
      config.exhale.duration +
      config.holdOut.duration) /
    1000;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header with playback controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Editor de Curvas</h2>
          <p className="text-muted-foreground">
            Crie padrões de respiração personalizados com equações matemáticas
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="rounded-full"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant={isPlaying ? 'destructive' : 'default'}
            size="icon"
            onClick={handlePlay}
            className="rounded-full w-12 h-12"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </Button>
          <Button variant="outline" size="icon" onClick={copyToClipboard} className="rounded-full">
            <Copy className="w-4 h-4" />
          </Button>
          <Button onClick={handleSave} className="rounded-full px-6">
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Main visualization */}
      <Card className="border-0 bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        <CardContent className="p-6">
          <WaveVisualizer
            equation={currentEquation}
            params={currentParams}
            currentTime={currentTime}
            isPlaying={isPlaying}
            showGrid={true}
            showDerivative={false}
            colorScheme={activePhase === 'inhale' ? 'calm' : 'energy'}
            height={250}
          />

          {/* Timeline */}
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Ciclo: {totalDuration.toFixed(1)}s</span>
              <span>{config.cycles} ciclos</span>
            </div>
            <div className="flex h-8 rounded-lg overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center text-xs text-white font-medium"
                style={{
                  width: `${(config.inhale.duration / (totalDuration * 1000)) * 100}%`,
                }}
                whileHover={{ scale: 1.02 }}
              >
                Inspirar
              </motion.div>
              {config.holdIn.duration > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{
                    width: `${(config.holdIn.duration / (totalDuration * 1000)) * 100}%`,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  Segurar
                </motion.div>
              )}
              <motion.div
                className="bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-xs text-white font-medium"
                style={{
                  width: `${(config.exhale.duration / (totalDuration * 1000)) * 100}%`,
                }}
                whileHover={{ scale: 1.02 }}
              >
                Expirar
              </motion.div>
              {config.holdOut.duration > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-medium"
                  style={{
                    width: `${(config.holdOut.duration / (totalDuration * 1000)) * 100}%`,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  Pausar
                </motion.div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Editor panels */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Phase selection and equation */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Configurar Fase
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs
              value={activePhase}
              onValueChange={(v) => setActivePhase(v as 'inhale' | 'exhale')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="inhale" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Inspirar
                </TabsTrigger>
                <TabsTrigger value="exhale" className="gap-2">
                  <TrendingUp className="w-4 h-4 rotate-180" />
                  Expirar
                </TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                {/* Equation selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de Curva</label>
                  <Select
                    value={activePhase === 'inhale' ? config.inhale.equationId : config.exhale.equationId}
                    onValueChange={updateEquation}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {breathEquations.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          <div className="flex items-center gap-2">
                            {equationIcons[eq.id]}
                            <span>{eq.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {currentEquation.description}
                  </p>
                </div>

                {/* Formula toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFormula(!showFormula)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Ver Fórmula
                  </span>
                  {showFormula ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>

                <AnimatePresence>
                  {showFormula && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-muted rounded-lg">
                        <code className="text-sm font-mono text-primary">
                          {currentEquation.formula}
                        </code>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Duration */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">Duração</label>
                    <Badge variant="secondary">
                      {(activePhase === 'inhale'
                        ? config.inhale.duration
                        : config.exhale.duration) / 1000}
                      s
                    </Badge>
                  </div>
                  <Slider
                    value={[
                      activePhase === 'inhale'
                        ? config.inhale.duration
                        : config.exhale.duration,
                    ]}
                    onValueChange={([v]) =>
                      updateDuration(activePhase, v)
                    }
                    min={1000}
                    max={10000}
                    step={500}
                    className="w-full"
                  />
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Parameters */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Parâmetros da Equação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-6">
                {currentEquation.parameters.length > 0 ? (
                  currentEquation.parameters.map((param) => (
                    <div key={param.name} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">{param.label}</label>
                        <Badge variant="outline">
                          {(currentParams[param.name] ?? param.default).toFixed(2)}
                          {param.unit && ` ${param.unit}`}
                        </Badge>
                      </div>
                      <Slider
                        value={[currentParams[param.name] ?? param.default]}
                        onValueChange={([v]) => updateParam(param.name, v)}
                        min={param.min}
                        max={param.max}
                        step={param.step}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{param.min}</span>
                        <span>{param.max}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <CircleDot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Esta curva não possui parâmetros ajustáveis</p>
                  </div>
                )}

                {/* Hold times */}
                <div className="pt-4 border-t space-y-4">
                  <h4 className="font-medium text-sm">Tempos de Retenção</h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">Após Inspirar</label>
                      <Badge variant="secondary">{config.holdIn.duration / 1000}s</Badge>
                    </div>
                    <Slider
                      value={[config.holdIn.duration]}
                      onValueChange={([v]) => updateDuration('holdIn', v)}
                      min={0}
                      max={8000}
                      step={500}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">Após Expirar</label>
                      <Badge variant="secondary">{config.holdOut.duration / 1000}s</Badge>
                    </div>
                    <Slider
                      value={[config.holdOut.duration]}
                      onValueChange={([v]) => updateDuration('holdOut', v)}
                      min={0}
                      max={8000}
                      step={500}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">Ciclos</label>
                      <Badge variant="secondary">{config.cycles}</Badge>
                    </div>
                    <Slider
                      value={[config.cycles]}
                      onValueChange={([v]) =>
                        setConfig((prev) => ({ ...prev, cycles: v }))
                      }
                      min={1}
                      max={20}
                      step={1}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Presets */}
      <Card className="border-border/50">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Presets Populares</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: '4-7-8', inhale: 4000, holdIn: 7000, exhale: 8000, holdOut: 0 },
              { name: 'Box', inhale: 4000, holdIn: 4000, exhale: 4000, holdOut: 4000 },
              { name: 'Coerente', inhale: 5000, holdIn: 0, exhale: 5000, holdOut: 0 },
              { name: 'Energizante', inhale: 4000, holdIn: 0, exhale: 2000, holdOut: 0 },
            ].map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-auto py-4 flex-col gap-1"
                onClick={() =>
                  setConfig((prev) => ({
                    ...prev,
                    name: `Respiração ${preset.name}`,
                    inhale: { ...prev.inhale, duration: preset.inhale },
                    holdIn: { duration: preset.holdIn },
                    exhale: { ...prev.exhale, duration: preset.exhale },
                    holdOut: { duration: preset.holdOut },
                  }))
                }
              >
                <span className="font-semibold">{preset.name}</span>
                <span className="text-xs text-muted-foreground">
                  {preset.inhale / 1000}-{preset.holdIn / 1000}-{preset.exhale / 1000}-
                  {preset.holdOut / 1000}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
