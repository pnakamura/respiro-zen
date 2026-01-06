import { WellnessReport } from './useWellnessReport';
import { 
  Period, 
  ChartDataPoint, 
  Pattern, 
  InsightsStats, 
  WeeklySummary, 
  EmotionRadarData, 
  DyadOccurrence 
} from './useInsightsData';

export interface DemoInsightsData {
  chartData: ChartDataPoint[];
  radarData: EmotionRadarData[];
  dyadOccurrences: DyadOccurrence[];
  patterns: Pattern[];
  stats: InsightsStats;
  weeklySummary: WeeklySummary;
  isLoading: boolean;
  isEmpty: boolean;
}

function getDemoChartData(): ChartDataPoint[] {
  return [
    { day: 'Seg', date: '2024-01-01', positivo: 3.5, negativo: 1.2, intensidadeMedia: 3.2 },
    { day: 'Ter', date: '2024-01-02', positivo: 4.0, negativo: 0.8, intensidadeMedia: 3.5 },
    { day: 'Qua', date: '2024-01-03', positivo: 2.5, negativo: 2.0, intensidadeMedia: 3.0 },
    { day: 'Qui', date: '2024-01-04', positivo: 4.5, negativo: 0.5, intensidadeMedia: 3.8 },
    { day: 'Sex', date: '2024-01-05', positivo: 3.8, negativo: 1.0, intensidadeMedia: 3.4 },
    { day: 'Sáb', date: '2024-01-06', positivo: 4.2, negativo: 0.6, intensidadeMedia: 3.6 },
    { day: 'Dom', date: '2024-01-07', positivo: 4.8, negativo: 0.4, intensidadeMedia: 4.0 },
  ];
}

function getDemoRadarData(): EmotionRadarData[] {
  return [
    { emotion: 'joy', label: 'Alegria', value: 4.2, color: 'hsl(48, 95%, 55%)', icon: '😊' },
    { emotion: 'trust', label: 'Confiança', value: 3.5, color: 'hsl(145, 50%, 45%)', icon: '🤝' },
    { emotion: 'fear', label: 'Medo', value: 1.2, color: 'hsl(155, 60%, 30%)', icon: '😨' },
    { emotion: 'surprise', label: 'Surpresa', value: 2.8, color: 'hsl(185, 70%, 50%)', icon: '😲' },
    { emotion: 'sadness', label: 'Tristeza', value: 1.5, color: 'hsl(225, 65%, 55%)', icon: '😢' },
    { emotion: 'disgust', label: 'Aversão', value: 0.8, color: 'hsl(280, 50%, 55%)', icon: '🤢' },
    { emotion: 'anger', label: 'Raiva', value: 0.5, color: 'hsl(15, 85%, 55%)', icon: '😠' },
    { emotion: 'anticipation', label: 'Antecipação', value: 3.8, color: 'hsl(28, 90%, 55%)', icon: '🔮' },
  ];
}

function getDemoDyadOccurrences(): DyadOccurrence[] {
  return [
    { dyad: 'love', label: 'Amor', count: 5, date: '2024-01-07', description: 'União de alegria e confiança' },
    { dyad: 'optimism', label: 'Otimismo', count: 4, date: '2024-01-06', description: 'Expectativa positiva' },
    { dyad: 'hope', label: 'Esperança', count: 3, date: '2024-01-05', description: 'Expectativa confiante' },
    { dyad: 'curiosity', label: 'Curiosidade', count: 2, date: '2024-01-04', description: 'Abertura ao inesperado' },
  ];
}

function getDemoPatterns(): Pattern[] {
  return [
    {
      id: 'breathing_correlation',
      icon: '🧘',
      title: 'Respiração melhora seu humor',
      description: '45 min de prática em 8 sessões. Dias com respiração mostram emoções mais equilibradas.',
      type: 'positive',
    },
    {
      id: 'dominant_emotion',
      icon: '😊',
      title: 'Alegria predominante',
      description: 'Alegria foi sua emoção mais registrada com 8 ocorrências.',
      type: 'positive',
    },
    {
      id: 'weekday_pattern',
      icon: '📅',
      title: 'Domingo é seu melhor dia',
      description: 'Seus melhores registros são Domingo, enquanto Quarta tende a ser mais desafiador.',
      type: 'neutral',
    },
    {
      id: 'hydration_habit',
      icon: '💧',
      title: 'Hidratação excelente',
      description: 'Média de 1.8L/dia em 7 dias registrados.',
      type: 'positive',
    },
  ];
}

function getDemoStats(): InsightsStats {
  return {
    emotionCheckins: 12,
    breathingSessions: 8,
    breathingMinutes: 45,
    waterLiters: 12.6,
    activeDays: 7,
    dominantEmotion: { id: 'joy', label: 'Alegria', icon: '😊', count: 8 },
    frequentDyad: { label: 'Amor', count: 5 },
    moodVariation: 'stable',
    checkinStreak: 5,
  };
}

function getDemoWeeklySummary(): WeeklySummary {
  return {
    emoji: '🌟',
    headline: 'Semana excelente!',
    score: 78,
    comparison: 'up',
    comparisonPercentage: 12,
  };
}

export function useDemoInsightsData(): DemoInsightsData {
  return {
    chartData: getDemoChartData(),
    radarData: getDemoRadarData(),
    dyadOccurrences: getDemoDyadOccurrences(),
    patterns: getDemoPatterns(),
    stats: getDemoStats(),
    weeklySummary: getDemoWeeklySummary(),
    isLoading: false,
    isEmpty: false,
  };
}

export function getDemoWellnessReport(): WellnessReport {
  return {
    wellnessScore: 72,
    weekEmoji: '🌟',
    headline: 'Uma semana de progresso constante',
    narrative: `Esta foi uma semana de crescimento emocional significativo. Você demonstrou consistência admirável nos seus check-ins emocionais, registrando como se sentiu em 7 dias diferentes. 

Suas manhãs tendem a ser mais positivas, com picos de alegria especialmente após as sessões de respiração. A prática de respiração Box que você completou 8 vezes parece estar criando um impacto positivo no seu bem-estar geral.

A gratidão apareceu com mais frequência nos finais de semana, sugerindo que você encontra mais momentos de apreciação quando tem tempo livre. Continue cultivando esses momentos.

Sua hidratação também merece destaque - manter 1.8L de média diária é um excelente hábito que contribui para seu equilíbrio emocional.`,
    emotionalInsights: [
      {
        title: 'Alegria predominante',
        description: 'A alegria foi sua emoção mais registrada esta semana, aparecendo em 65% dos seus check-ins.',
        type: 'positive',
      },
      {
        title: 'Padrão de calma crescente',
        description: 'Sua sensação de calma aumentou progressivamente ao longo da semana.',
        type: 'positive',
      },
      {
        title: 'Quarta-feira desafiadora',
        description: 'Quarta-feira mostrou mais emoções desafiadoras. Considere adicionar uma pausa de respiração no meio da semana.',
        type: 'attention',
      },
    ],
    correlations: [
      {
        insight: 'Quando você pratica respiração Box, sua calma aumenta 35% nas próximas horas.',
        confidence: 'alta',
      },
      {
        insight: 'Quartas-feiras tendem a ser emocionalmente mais desafiadoras para você.',
        confidence: 'média',
      },
      {
        insight: 'Sua hidratação consistente correlaciona com melhores níveis de energia.',
        confidence: 'alta',
      },
      {
        insight: 'Gratidão aparece 80% mais nos finais de semana.',
        confidence: 'média',
      },
    ],
    recommendations: [
      {
        action: 'Experimente a respiração 4-7-8 antes de dormir',
        reason: 'Pode ajudar a melhorar a qualidade do sono e preparar para manhãs mais positivas.',
        category: 'respiração',
      },
      {
        action: 'Adicione uma pausa de respiração às quartas-feiras',
        reason: 'Ajudará a equilibrar o dia que tende a ser mais desafiador.',
        category: 'respiração',
      },
      {
        action: 'Escreva 3 gratidões pela manhã',
        reason: 'Pode estender o padrão positivo dos finais de semana para os dias úteis.',
        category: 'diário',
      },
      {
        action: 'Aumente a hidratação para 2L diários',
        reason: 'Um pequeno aumento pode potencializar ainda mais seus níveis de energia.',
        category: 'hidratação',
      },
      {
        action: 'Explore a Jornada de 7 dias de Autocuidado',
        reason: 'Combina perfeitamente com seu ritmo atual de progresso.',
        category: 'jornada',
      },
    ],
    achievements: [
      {
        title: 'Semana Completa',
        emoji: '🏆',
      },
      {
        title: 'Mestre da Respiração',
        emoji: '🧘',
      },
    ],
    weekdayPatterns: {
      bestDay: 'Domingo',
      challengingDay: 'Quarta-feira',
      insight: 'Seus domingos são significativamente mais positivos, enquanto quartas-feiras pedem mais atenção.',
    },
    dataSummary: {
      emotions: {
        totalCheckins: 12,
        topEmotions: ['Alegria', 'Calma', 'Gratidão'],
        avgIntensity: 3.8,
        dyads: ['Amor', 'Otimismo'],
        byWeekday: {
          'Segunda': 2,
          'Terça': 2,
          'Quarta': 1,
          'Quinta': 2,
          'Sexta': 2,
          'Sábado': 2,
          'Domingo': 1,
        },
      },
      breathing: {
        totalSessions: 8,
        totalMinutes: 45,
        techniques: ['Box Breathing', 'Respiração 4-7-8'],
        totalCycles: 64,
      },
      journal: {
        totalEntries: 5,
        totalWords: 850,
        excerpts: [
          'Hoje me senti grato por...',
          'A sessão de respiração me ajudou a...',
        ],
      },
      hydration: {
        totalRecords: 28,
        avgDaily: 1.8,
        daysWithRecord: 7,
      },
    },
    generatedAt: new Date().toISOString(),
    period: '7 dias',
    userName: 'Visitante',
  };
}
