import { WellnessReport } from './useWellnessReport';

export interface DemoChartDataPoint {
  day: string;
  date: string;
  alegria: number;
  tristeza: number;
  calma: number;
}

export interface DemoPattern {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface DemoInsightsStats {
  emotionCheckins: number;
  breathingSessions: number;
  breathingMinutes: number;
  waterLiters: number;
  activeDays: number;
}

export interface DemoInsightsData {
  chartData: DemoChartDataPoint[];
  patterns: DemoPattern[];
  stats: DemoInsightsStats;
  isLoading: boolean;
  isEmpty: boolean;
}

function getDemoChartData(): DemoChartDataPoint[] {
  return [
    { day: 'Seg', date: '2024-01-01', alegria: 3, tristeza: 2, calma: 4 },
    { day: 'Ter', date: '2024-01-02', alegria: 4, tristeza: 1, calma: 4 },
    { day: 'Qua', date: '2024-01-03', alegria: 2, tristeza: 3, calma: 3 },
    { day: 'Qui', date: '2024-01-04', alegria: 5, tristeza: 1, calma: 4 },
    { day: 'Sex', date: '2024-01-05', alegria: 3, tristeza: 2, calma: 3 },
    { day: 'Sáb', date: '2024-01-06', alegria: 4, tristeza: 1, calma: 5 },
    { day: 'Dom', date: '2024-01-07', alegria: 5, tristeza: 1, calma: 4 },
  ];
}

function getDemoPatterns(): DemoPattern[] {
  return [
    {
      id: 'morning_positive',
      icon: '🌅',
      title: 'Manhãs mais positivas',
      description: 'Seus registros mostram 60% mais emoções positivas no período da manhã.',
    },
    {
      id: 'breathing_helps',
      icon: '🧘',
      title: 'Respiração ajuda seu humor',
      description: 'Após sessões de respiração, seu humor melhora em média 2 pontos.',
    },
    {
      id: 'hydration_consistent',
      icon: '💧',
      title: 'Hidratação consistente',
      description: 'Você manteve uma média de 1.8L de água por dia esta semana.',
    },
  ];
}

function getDemoStats(): DemoInsightsStats {
  return {
    emotionCheckins: 12,
    breathingSessions: 8,
    breathingMinutes: 45,
    waterLiters: 12.6,
    activeDays: 7,
  };
}

export function useDemoInsightsData(): DemoInsightsData {
  return {
    chartData: getDemoChartData(),
    patterns: getDemoPatterns(),
    stats: getDemoStats(),
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
