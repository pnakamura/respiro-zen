/**
 * Mathematical Animation System
 * Sistema de equações matemáticas para animações de respiração
 */

// Tipos de curvas matemáticas
export type CurveType =
  | 'sine'
  | 'cosine'
  | 'bezier'
  | 'exponential'
  | 'logarithmic'
  | 'elastic'
  | 'bounce'
  | 'circular'
  | 'polynomial'
  | 'gaussian'
  | 'damped-sine'
  | 'sawtooth'
  | 'square'
  | 'triangle'
  | 'custom';

export interface AnimationEquation {
  id: string;
  name: string;
  description: string;
  type: CurveType;
  formula: string; // LaTeX ou descrição da fórmula
  parameters: EquationParameter[];
  evaluate: (t: number, params: Record<string, number>) => number;
}

export interface EquationParameter {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
}

export interface BreathAnimationConfig {
  inhaleEquation: AnimationEquation;
  inhaleParams: Record<string, number>;
  exhaleEquation: AnimationEquation;
  exhaleParams: Record<string, number>;
  holdInEquation?: AnimationEquation;
  holdOutEquation?: AnimationEquation;
  visualStyle: VisualizationStyle;
}

export type VisualizationStyle =
  | 'circle'
  | 'wave'
  | 'particles'
  | 'morphing'
  | 'flow'
  | 'mandala'
  | 'organic';

// Funções matemáticas base
export const mathFunctions = {
  // Função seno com amplitude, frequência e fase
  sine: (t: number, amplitude = 1, frequency = 1, phase = 0): number => {
    return amplitude * Math.sin(2 * Math.PI * frequency * t + phase);
  },

  // Cosseno
  cosine: (t: number, amplitude = 1, frequency = 1, phase = 0): number => {
    return amplitude * Math.cos(2 * Math.PI * frequency * t + phase);
  },

  // Curva de Bezier cúbica
  bezier: (t: number, p0: number, p1: number, p2: number, p3: number): number => {
    const u = 1 - t;
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
  },

  // Exponencial suave (easeIn/easeOut)
  exponential: (t: number, exponent = 2, direction: 'in' | 'out' | 'inOut' = 'inOut'): number => {
    if (direction === 'in') return Math.pow(t, exponent);
    if (direction === 'out') return 1 - Math.pow(1 - t, exponent);
    // inOut
    if (t < 0.5) return Math.pow(2, exponent - 1) * Math.pow(t, exponent);
    return 1 - Math.pow(-2 * t + 2, exponent) / 2;
  },

  // Logarítmica
  logarithmic: (t: number, base = Math.E, scale = 1): number => {
    if (t <= 0) return 0;
    return scale * Math.log(1 + t * (base - 1)) / Math.log(base);
  },

  // Elástica
  elastic: (t: number, amplitude = 1, period = 0.3): number => {
    if (t === 0 || t === 1) return t;
    const s = period / (2 * Math.PI) * Math.asin(1 / amplitude);
    return amplitude * Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / period) + 1;
  },

  // Bounce
  bounce: (t: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },

  // Circular
  circular: (t: number, direction: 'in' | 'out' | 'inOut' = 'inOut'): number => {
    if (direction === 'in') return 1 - Math.sqrt(1 - t * t);
    if (direction === 'out') return Math.sqrt(1 - Math.pow(t - 1, 2));
    if (t < 0.5) return (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2;
    return (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
  },

  // Polinomial de grau n
  polynomial: (t: number, coefficients: number[]): number => {
    return coefficients.reduce((sum, coef, i) => sum + coef * Math.pow(t, i), 0);
  },

  // Gaussiana
  gaussian: (t: number, mean = 0.5, sigma = 0.15): number => {
    return Math.exp(-Math.pow(t - mean, 2) / (2 * sigma * sigma));
  },

  // Seno amortecido
  dampedSine: (t: number, amplitude = 1, frequency = 4, decay = 3): number => {
    return amplitude * Math.exp(-decay * t) * Math.sin(2 * Math.PI * frequency * t);
  },

  // Onda dente de serra
  sawtooth: (t: number, period = 1): number => {
    return 2 * ((t / period) - Math.floor(0.5 + t / period));
  },

  // Onda quadrada
  square: (t: number, period = 1, dutyCycle = 0.5): number => {
    const phase = (t / period) % 1;
    return phase < dutyCycle ? 1 : -1;
  },

  // Onda triangular
  triangle: (t: number, period = 1): number => {
    const phase = (t / period) % 1;
    return 4 * Math.abs(phase - 0.5) - 1;
  },

  // Spline cúbica natural (interpolação suave)
  cubicSpline: (t: number, points: number[]): number => {
    const n = points.length - 1;
    const segment = Math.min(Math.floor(t * n), n - 1);
    const localT = t * n - segment;

    const p0 = points[Math.max(segment - 1, 0)];
    const p1 = points[segment];
    const p2 = points[Math.min(segment + 1, n)];
    const p3 = points[Math.min(segment + 2, n)];

    // Catmull-Rom spline
    return 0.5 * (
      2 * p1 +
      (-p0 + p2) * localT +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * localT * localT +
      (-p0 + 3 * p1 - 3 * p2 + p3) * localT * localT * localT
    );
  },

  // Lissajous (para padrões complexos)
  lissajous: (t: number, a = 3, b = 2, delta = Math.PI / 2): { x: number; y: number } => {
    return {
      x: Math.sin(a * t + delta),
      y: Math.sin(b * t)
    };
  },

  // Espiral logarítmica
  logarithmicSpiral: (t: number, a = 1, b = 0.2): { x: number; y: number } => {
    const r = a * Math.exp(b * t);
    return {
      x: r * Math.cos(t),
      y: r * Math.sin(t)
    };
  }
};

// Biblioteca de equações pré-definidas para respiração
export const breathEquations: AnimationEquation[] = [
  {
    id: 'smooth-sine',
    name: 'Seno Suave',
    description: 'Transição fluida e natural inspirada em ondas',
    type: 'sine',
    formula: 'y = A · sin(2πft + φ)',
    parameters: [
      { name: 'amplitude', label: 'Amplitude', min: 0.5, max: 2, step: 0.1, default: 1 },
      { name: 'frequency', label: 'Frequência', min: 0.25, max: 2, step: 0.25, default: 0.5 },
      { name: 'phase', label: 'Fase', min: 0, max: Math.PI * 2, step: 0.1, default: 0 }
    ],
    evaluate: (t, params) => {
      const { amplitude = 1, frequency = 0.5, phase = 0 } = params;
      return (mathFunctions.sine(t, amplitude, frequency, phase) + 1) / 2;
    }
  },
  {
    id: 'ease-exponential',
    name: 'Exponencial Suave',
    description: 'Início lento com aceleração gradual',
    type: 'exponential',
    formula: 'y = t^n (easeIn) ou 1-(1-t)^n (easeOut)',
    parameters: [
      { name: 'exponent', label: 'Expoente', min: 1, max: 5, step: 0.5, default: 2 }
    ],
    evaluate: (t, params) => {
      const { exponent = 2 } = params;
      return mathFunctions.exponential(t, exponent, 'inOut');
    }
  },
  {
    id: 'elastic-breath',
    name: 'Respiração Elástica',
    description: 'Oscilação orgânica como movimento natural',
    type: 'elastic',
    formula: 'y = A · 2^(-10t) · sin((t-s)·2π/p) + 1',
    parameters: [
      { name: 'amplitude', label: 'Amplitude', min: 0.5, max: 1.5, step: 0.1, default: 1 },
      { name: 'period', label: 'Período', min: 0.2, max: 0.8, step: 0.1, default: 0.4 }
    ],
    evaluate: (t, params) => {
      const { amplitude = 1, period = 0.4 } = params;
      return mathFunctions.elastic(t, amplitude, period);
    }
  },
  {
    id: 'circular-flow',
    name: 'Fluxo Circular',
    description: 'Movimento baseado em arco circular',
    type: 'circular',
    formula: 'y = √(1 - (t-1)²)',
    parameters: [],
    evaluate: (t) => mathFunctions.circular(t, 'inOut')
  },
  {
    id: 'gaussian-peak',
    name: 'Pico Gaussiano',
    description: 'Concentração no centro, ideal para retenção',
    type: 'gaussian',
    formula: 'y = e^(-(t-μ)²/2σ²)',
    parameters: [
      { name: 'mean', label: 'Centro (μ)', min: 0.2, max: 0.8, step: 0.05, default: 0.5 },
      { name: 'sigma', label: 'Largura (σ)', min: 0.05, max: 0.4, step: 0.05, default: 0.15 }
    ],
    evaluate: (t, params) => {
      const { mean = 0.5, sigma = 0.15 } = params;
      return mathFunctions.gaussian(t, mean, sigma);
    }
  },
  {
    id: 'damped-oscillation',
    name: 'Oscilação Amortecida',
    description: 'Vibração que diminui gradualmente',
    type: 'damped-sine',
    formula: 'y = A · e^(-dt) · sin(2πft)',
    parameters: [
      { name: 'frequency', label: 'Frequência', min: 1, max: 8, step: 1, default: 4 },
      { name: 'decay', label: 'Decaimento', min: 1, max: 6, step: 0.5, default: 3 }
    ],
    evaluate: (t, params) => {
      const { frequency = 4, decay = 3 } = params;
      return (mathFunctions.dampedSine(t, 1, frequency, decay) + 1) / 2;
    }
  },
  {
    id: 'bezier-smooth',
    name: 'Bezier Controlada',
    description: 'Curva personalizável com pontos de controle',
    type: 'bezier',
    formula: 'B(t) = (1-t)³P₀ + 3(1-t)²tP₁ + 3(1-t)t²P₂ + t³P₃',
    parameters: [
      { name: 'p1', label: 'Controle 1', min: 0, max: 1, step: 0.05, default: 0.42 },
      { name: 'p2', label: 'Controle 2', min: 0, max: 1, step: 0.05, default: 0.58 }
    ],
    evaluate: (t, params) => {
      const { p1 = 0.42, p2 = 0.58 } = params;
      return mathFunctions.bezier(t, 0, p1, p2, 1);
    }
  },
  {
    id: 'wave-triangle',
    name: 'Onda Triangular',
    description: 'Transições lineares em forma de triângulo',
    type: 'triangle',
    formula: 'y = 4|t - 0.5| - 1',
    parameters: [],
    evaluate: (t) => (mathFunctions.triangle(t, 1) + 1) / 2
  },
  {
    id: 'polynomial-custom',
    name: 'Polinomial Personalizada',
    description: 'Curva definida por coeficientes polinomiais',
    type: 'polynomial',
    formula: 'y = Σ aₙ·tⁿ',
    parameters: [
      { name: 'a0', label: 'a₀', min: -1, max: 1, step: 0.1, default: 0 },
      { name: 'a1', label: 'a₁', min: -2, max: 2, step: 0.1, default: 0 },
      { name: 'a2', label: 'a²', min: -4, max: 4, step: 0.1, default: 3 },
      { name: 'a3', label: 'a³', min: -4, max: 4, step: 0.1, default: -2 }
    ],
    evaluate: (t, params) => {
      const { a0 = 0, a1 = 0, a2 = 3, a3 = -2 } = params;
      const value = mathFunctions.polynomial(t, [a0, a1, a2, a3]);
      return Math.max(0, Math.min(1, value));
    }
  },
  {
    id: 'logarithmic-soft',
    name: 'Logarítmica Suave',
    description: 'Início rápido com desaceleração gradual',
    type: 'logarithmic',
    formula: 'y = log(1 + t(b-1)) / log(b)',
    parameters: [
      { name: 'base', label: 'Base', min: 2, max: 20, step: 1, default: 10 }
    ],
    evaluate: (t, params) => {
      const { base = 10 } = params;
      return mathFunctions.logarithmic(t, base, 1);
    }
  }
];

// Combinar múltiplas equações
export const combineEquations = (
  equations: { equation: AnimationEquation; params: Record<string, number>; weight: number }[],
  t: number
): number => {
  const totalWeight = equations.reduce((sum, eq) => sum + eq.weight, 0);
  return equations.reduce(
    (sum, { equation, params, weight }) =>
      sum + (weight / totalWeight) * equation.evaluate(t, params),
    0
  );
};

// Gerar pontos para visualização
export const generateCurvePoints = (
  equation: AnimationEquation,
  params: Record<string, number>,
  resolution = 100
): { t: number; value: number }[] => {
  const points: { t: number; value: number }[] = [];
  for (let i = 0; i <= resolution; i++) {
    const t = i / resolution;
    points.push({ t, value: equation.evaluate(t, params) });
  }
  return points;
};

// Derivada numérica para velocidade da animação
export const calculateDerivative = (
  equation: AnimationEquation,
  params: Record<string, number>,
  t: number,
  h = 0.001
): number => {
  return (equation.evaluate(t + h, params) - equation.evaluate(t - h, params)) / (2 * h);
};

// Integral numérica para área sob a curva
export const calculateIntegral = (
  equation: AnimationEquation,
  params: Record<string, number>,
  start = 0,
  end = 1,
  steps = 100
): number => {
  const h = (end - start) / steps;
  let sum = 0;
  for (let i = 0; i < steps; i++) {
    const t = start + i * h;
    sum += (equation.evaluate(t, params) + equation.evaluate(t + h, params)) / 2 * h;
  }
  return sum;
};

export const getEquationById = (id: string): AnimationEquation | undefined => {
  return breathEquations.find(eq => eq.id === id);
};
