import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, format, startOfDay, parseISO, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { primaryEmotions, primaryDyads, secondaryDyads, tertiaryDyads } from '@/data/plutchik-emotions';

export type Period = '7d' | '30d' | '60d';

interface SelectedEmotion {
  id: string;
  intensity?: number;
}

export interface EmotionRadarData {
  emotion: string;
  label: string;
  value: number;
  color: string;
  icon: string;
}

export interface ChartDataPoint {
  day: string;
  date: string;
  positivo: number;
  negativo: number;
  intensidadeMedia: number;
}

export interface DyadOccurrence {
  dyad: string;
  label: string;
  count: number;
  date: string;
  description: string;
}

export interface Pattern {
  id: string;
  icon: string;
  title: string;
  description: string;
  type?: 'positive' | 'attention' | 'neutral';
}

export interface InsightsStats {
  emotionCheckins: number;
  breathingSessions: number;
  breathingMinutes: number;
  waterLiters: number;
  activeDays: number;
  dominantEmotion?: { id: string; label: string; icon: string; count: number };
  frequentDyad?: { label: string; count: number };
  moodVariation: 'stable' | 'variable' | 'highly_variable';
  checkinStreak: number;
}

export interface WeeklySummary {
  emoji: string;
  headline: string;
  score: number;
  comparison: 'up' | 'down' | 'stable';
  comparisonPercentage: number;
}

const POSITIVE_EMOTION_IDS = ['joy', 'trust', 'anticipation', 'surprise'];
const NEGATIVE_EMOTION_IDS = ['sadness', 'fear', 'disgust', 'anger'];

function getPeriodDays(period: Period): number {
  switch (period) {
    case '7d': return 7;
    case '30d': return 30;
    case '60d': return 60;
  }
}

function getEmotionCounts(entries: any[]): Record<string, { count: number; totalIntensity: number }> {
  const counts: Record<string, { count: number; totalIntensity: number }> = {};
  
  primaryEmotions.forEach(e => {
    counts[e.id] = { count: 0, totalIntensity: 0 };
  });

  entries.forEach(entry => {
    const emotions = (Array.isArray(entry.selected_emotions) ? entry.selected_emotions : []) as SelectedEmotion[];
    emotions.forEach(em => {
      const id = em.id.toLowerCase();
      const primary = primaryEmotions.find(p => 
        p.id === id || 
        p.lowIntensity.id === id || 
        p.midIntensity.id === id || 
        p.highIntensity.id === id
      );
      if (primary) {
        counts[primary.id].count++;
        counts[primary.id].totalIntensity += em.intensity || 3;
      }
    });
  });

  return counts;
}

function getDyadOccurrences(entries: any[]): DyadOccurrence[] {
  const allDyads = [...primaryDyads, ...secondaryDyads, ...tertiaryDyads];
  const dyadCounts: Record<string, { count: number; dates: string[]; label: string; description: string }> = {};

  entries.forEach(entry => {
    const emotions = (Array.isArray(entry.selected_emotions) ? entry.selected_emotions : []) as SelectedEmotion[];
    const emotionIds = emotions.map(e => {
      const id = e.id.toLowerCase();
      const primary = primaryEmotions.find(p => 
        p.id === id || p.lowIntensity.id === id || p.midIntensity.id === id || p.highIntensity.id === id
      );
      return primary?.id || id;
    });

    allDyads.forEach(dyad => {
      if (emotionIds.includes(dyad.emotions[0]) && emotionIds.includes(dyad.emotions[1])) {
        if (!dyadCounts[dyad.result]) {
          dyadCounts[dyad.result] = { count: 0, dates: [], label: dyad.label, description: dyad.description };
        }
        dyadCounts[dyad.result].count++;
        dyadCounts[dyad.result].dates.push(format(parseISO(entry.created_at), 'yyyy-MM-dd'));
      }
    });
  });

  return Object.entries(dyadCounts)
    .map(([dyad, data]) => ({
      dyad,
      label: data.label,
      count: data.count,
      date: data.dates[data.dates.length - 1] || '',
      description: data.description,
    }))
    .sort((a, b) => b.count - a.count);
}

function calculateMoodVariation(entries: any[]): 'stable' | 'variable' | 'highly_variable' {
  if (entries.length < 3) return 'stable';

  const intensities: number[] = [];
  entries.forEach(entry => {
    const emotions = (Array.isArray(entry.selected_emotions) ? entry.selected_emotions : []) as SelectedEmotion[];
    const avg = emotions.reduce((sum, e) => sum + (e.intensity || 3), 0) / (emotions.length || 1);
    intensities.push(avg);
  });

  if (intensities.length < 2) return 'stable';

  const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
  const variance = intensities.reduce((sum, i) => sum + Math.pow(i - mean, 2), 0) / intensities.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev > 1.5) return 'highly_variable';
  if (stdDev > 0.8) return 'variable';
  return 'stable';
}

function calculateCheckinStreak(entries: any[]): number {
  if (entries.length === 0) return 0;

  const dates = [...new Set(entries.map(e => format(parseISO(e.created_at), 'yyyy-MM-dd')))].sort().reverse();
  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

  if (dates[0] !== today && dates[0] !== yesterday) return 0;

  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const expected = format(subDays(parseISO(dates[0]), i), 'yyyy-MM-dd');
    if (dates[i] === expected) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function generatePatterns(
  emotionEntries: any[],
  breathingSessions: any[],
  hydrationEntries: any[],
  emotionCounts: Record<string, { count: number; totalIntensity: number }>,
  dyadOccurrences: DyadOccurrence[]
): Pattern[] {
  const patterns: Pattern[] = [];

  // Pattern: Breathing correlation
  if (breathingSessions.length >= 3 && emotionEntries.length >= 3) {
    const sessionsWithEmotions = breathingSessions.filter(session => {
      const sessionDate = format(parseISO(session.completed_at), 'yyyy-MM-dd');
      return emotionEntries.some(e => format(parseISO(e.created_at), 'yyyy-MM-dd') === sessionDate);
    });

    if (sessionsWithEmotions.length >= 2) {
      const totalMinutes = breathingSessions.reduce((acc, s) => acc + (s.duration_ms || 0), 0) / 60000;
      patterns.push({
        id: 'breathing_correlation',
        icon: '🧘',
        title: 'Respiração melhora seu humor',
        description: `${Math.round(totalMinutes)} min de prática em ${breathingSessions.length} sessões. Dias com respiração mostram emoções mais equilibradas.`,
        type: 'positive',
      });
    }
  }

  // Pattern: Recurrent dyad
  if (dyadOccurrences.length > 0 && dyadOccurrences[0].count >= 2) {
    const topDyad = dyadOccurrences[0];
    const isNegativeDyad = ['despair', 'anxiety', 'envy', 'contempt', 'remorse'].includes(topDyad.dyad);
    patterns.push({
      id: 'recurrent_dyad',
      icon: isNegativeDyad ? '⚠️' : '💫',
      title: `${topDyad.label} frequente`,
      description: `Essa combinação emocional apareceu ${topDyad.count}x. ${topDyad.description}.`,
      type: isNegativeDyad ? 'attention' : 'neutral',
    });
  }

  // Pattern: Dominant emotion
  const sortedEmotions = Object.entries(emotionCounts).sort((a, b) => b[1].count - a[1].count);
  if (sortedEmotions[0][1].count >= 3) {
    const [emotionId, data] = sortedEmotions[0];
    const emotion = primaryEmotions.find(e => e.id === emotionId);
    if (emotion) {
      const isPositive = POSITIVE_EMOTION_IDS.includes(emotionId);
      patterns.push({
        id: 'dominant_emotion',
        icon: emotion.icon,
        title: `${emotion.label} predominante`,
        description: `${emotion.label} foi sua emoção mais registrada com ${data.count} ocorrências.`,
        type: isPositive ? 'positive' : 'attention',
      });
    }
  }

  // Pattern: Weekday analysis
  if (emotionEntries.length >= 7) {
    const dayOfWeekNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const byDay: Record<number, { positive: number; total: number }> = {};
    
    for (let i = 0; i < 7; i++) {
      byDay[i] = { positive: 0, total: 0 };
    }

    emotionEntries.forEach(entry => {
      const dow = getDay(parseISO(entry.created_at));
      byDay[dow].total++;
      
      const emotions = (Array.isArray(entry.selected_emotions) ? entry.selected_emotions : []) as SelectedEmotion[];
      const hasPositive = emotions.some(em => {
        const primary = primaryEmotions.find(p => 
          p.id === em.id.toLowerCase() || 
          p.lowIntensity.id === em.id.toLowerCase() ||
          p.midIntensity.id === em.id.toLowerCase() ||
          p.highIntensity.id === em.id.toLowerCase()
        );
        return primary && POSITIVE_EMOTION_IDS.includes(primary.id);
      });
      if (hasPositive) byDay[dow].positive++;
    });

    const daysWithData = Object.entries(byDay).filter(([_, d]) => d.total >= 2);
    if (daysWithData.length >= 3) {
      const bestDay = daysWithData.reduce((best, [day, data]) => {
        const ratio = data.positive / data.total;
        return ratio > (best.ratio || 0) ? { day: parseInt(day), ratio } : best;
      }, { day: 0, ratio: 0 });

      const worstDay = daysWithData.reduce((worst, [day, data]) => {
        const ratio = data.positive / data.total;
        return ratio < (worst.ratio || 1) ? { day: parseInt(day), ratio } : worst;
      }, { day: 0, ratio: 1 });

      if (bestDay.ratio - worstDay.ratio > 0.2) {
        patterns.push({
          id: 'weekday_pattern',
          icon: '📅',
          title: `${dayOfWeekNames[bestDay.day]} é seu melhor dia`,
          description: `Seus melhores registros são ${dayOfWeekNames[bestDay.day]}, enquanto ${dayOfWeekNames[worstDay.day]} tende a ser mais desafiador.`,
          type: 'neutral',
        });
      }
    }
  }

  // Pattern: Hydration
  if (hydrationEntries.length > 0) {
    const totalLiters = hydrationEntries.reduce((acc, h) => acc + (h.quantidade_ml || 0), 0) / 1000;
    const uniqueDays = new Set(hydrationEntries.map(h => format(parseISO(h.horario), 'yyyy-MM-dd'))).size;
    if (uniqueDays >= 3) {
      const avgDaily = totalLiters / uniqueDays;
      patterns.push({
        id: 'hydration_habit',
        icon: '💧',
        title: avgDaily >= 1.5 ? 'Hidratação excelente' : 'Atenção à hidratação',
        description: `Média de ${avgDaily.toFixed(1)}L/dia em ${uniqueDays} dias registrados.`,
        type: avgDaily >= 1.5 ? 'positive' : 'attention',
      });
    }
  }

  if (patterns.length === 0) {
    patterns.push({
      id: 'keep_going',
      icon: '✨',
      title: 'Continue registrando',
      description: 'Mais dados nos ajudarão a identificar seus padrões emocionais únicos.',
      type: 'neutral',
    });
  }

  return patterns.slice(0, 4);
}

function calculateWeeklySummary(
  emotionCounts: Record<string, { count: number; totalIntensity: number }>,
  stats: InsightsStats,
  moodVariation: 'stable' | 'variable' | 'highly_variable'
): WeeklySummary {
  const positiveCount = POSITIVE_EMOTION_IDS.reduce((sum, id) => sum + emotionCounts[id]?.count || 0, 0);
  const negativeCount = NEGATIVE_EMOTION_IDS.reduce((sum, id) => sum + emotionCounts[id]?.count || 0, 0);
  const totalCount = positiveCount + negativeCount;

  const positiveRatio = totalCount > 0 ? positiveCount / totalCount : 0.5;
  const activityScore = Math.min((stats.activeDays / 7) * 100, 100);
  const breathingScore = Math.min((stats.breathingMinutes / 30) * 100, 100);
  const hydrationScore = Math.min((stats.waterLiters / 14) * 100, 100);

  const score = Math.round(
    positiveRatio * 40 +
    activityScore * 0.25 +
    breathingScore * 0.2 +
    hydrationScore * 0.15
  );

  let emoji = '😊';
  let headline = 'Uma semana equilibrada';

  if (score >= 80) {
    emoji = '🌟';
    headline = 'Semana excelente!';
  } else if (score >= 60) {
    emoji = '😊';
    headline = 'Bom progresso';
  } else if (score >= 40) {
    emoji = '🌱';
    headline = 'Em crescimento';
  } else {
    emoji = '💪';
    headline = 'Siga em frente';
  }

  if (moodVariation === 'highly_variable') {
    emoji = '🎢';
    headline = 'Semana intensa';
  } else if (moodVariation === 'stable' && positiveRatio > 0.6) {
    emoji = '☀️';
    headline = 'Estabilidade positiva';
  }

  return {
    emoji,
    headline,
    score,
    comparison: score >= 60 ? 'up' : score >= 40 ? 'stable' : 'down',
    comparisonPercentage: Math.abs(score - 60),
  };
}

export function useInsightsData(period: Period) {
  const { user } = useAuth();
  const periodDays = getPeriodDays(period);
  const startDate = startOfDay(subDays(new Date(), periodDays));

  const { data: emotionEntries = [], isLoading: loadingEmotions } = useQuery({
    queryKey: ['insights-emotions', user?.id, period],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('emotion_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: breathingSessions = [], isLoading: loadingBreathing } = useQuery({
    queryKey: ['insights-breathing', user?.id, period],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('breathing_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('completed_at', startDate.toISOString())
        .order('completed_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const { data: hydrationEntries = [], isLoading: loadingHydration } = useQuery({
    queryKey: ['insights-hydration', user?.id, period],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('registro_hidratacao')
        .select('*')
        .eq('usuario_id', user.id)
        .is('deletado_em', null)
        .gte('horario', startDate.toISOString())
        .order('horario', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Process emotion counts per primary emotion
  const emotionCounts = getEmotionCounts(emotionEntries);
  
  // Get dyad occurrences
  const dyadOccurrences = getDyadOccurrences(emotionEntries);

  // Radar chart data - 8 Plutchik emotions
  const radarData: EmotionRadarData[] = primaryEmotions.map(emotion => ({
    emotion: emotion.id,
    label: emotion.label,
    value: emotionCounts[emotion.id]?.count > 0 
      ? emotionCounts[emotion.id].totalIntensity / emotionCounts[emotion.id].count 
      : 0,
    color: emotion.color,
    icon: emotion.icon,
  }));

  // Process chart data - positivo vs negativo
  const chartData: ChartDataPoint[] = [];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  for (let i = periodDays - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEntries = emotionEntries.filter(e => 
      format(parseISO(e.created_at), 'yyyy-MM-dd') === dateStr
    );

    if (dayEntries.length > 0) {
      let positivo = 0, negativo = 0, totalIntensity = 0, count = 0;

    dayEntries.forEach(entry => {
        const emotions = (Array.isArray(entry.selected_emotions) ? entry.selected_emotions : []) as unknown as SelectedEmotion[];
        emotions.forEach(em => {
          const id = em.id.toLowerCase();
          const intensity = em.intensity || 3;
          totalIntensity += intensity;
          count++;

          const primary = primaryEmotions.find(p => 
            p.id === id || p.lowIntensity.id === id || p.midIntensity.id === id || p.highIntensity.id === id
          );
          
          if (primary) {
            if (POSITIVE_EMOTION_IDS.includes(primary.id)) {
              positivo += intensity;
            } else if (NEGATIVE_EMOTION_IDS.includes(primary.id)) {
              negativo += intensity;
            }
          }
        });
      });

      chartData.push({
        day: period === '7d' ? dayNames[date.getDay()] : format(date, 'dd/MM'),
        date: dateStr,
        positivo: Math.round(positivo / (count || 1) * 20) / 10,
        negativo: Math.round(negativo / (count || 1) * 20) / 10,
        intensidadeMedia: Math.round(totalIntensity / (count || 1) * 10) / 10,
      });
    }
  }

  // Calculate mood variation
  const moodVariation = calculateMoodVariation(emotionEntries);

  // Calculate streak
  const checkinStreak = calculateCheckinStreak(emotionEntries);

  // Find dominant emotion
  const sortedEmotions = Object.entries(emotionCounts).sort((a, b) => b[1].count - a[1].count);
  const dominantEmotionId = sortedEmotions[0]?.[1].count > 0 ? sortedEmotions[0][0] : null;
  const dominantEmotion = dominantEmotionId 
    ? (() => {
        const emotion = primaryEmotions.find(e => e.id === dominantEmotionId);
        return emotion ? {
          id: emotion.id,
          label: emotion.label,
          icon: emotion.icon,
          count: sortedEmotions[0][1].count,
        } : undefined;
      })()
    : undefined;

  // Find frequent dyad
  const frequentDyad = dyadOccurrences[0]?.count >= 1 
    ? { label: dyadOccurrences[0].label, count: dyadOccurrences[0].count }
    : undefined;

  // Calculate stats
  const stats: InsightsStats = {
    emotionCheckins: emotionEntries.length,
    breathingSessions: breathingSessions.length,
    breathingMinutes: Math.round(breathingSessions.reduce((acc, s) => acc + (s.duration_ms || 0), 0) / 60000),
    waterLiters: Math.round(hydrationEntries.reduce((acc, h) => acc + (h.quantidade_ml || 0), 0) / 100) / 10,
    activeDays: new Set([
      ...emotionEntries.map(e => format(parseISO(e.created_at), 'yyyy-MM-dd')),
      ...breathingSessions.map(s => format(parseISO(s.completed_at), 'yyyy-MM-dd')),
      ...hydrationEntries.map(h => format(parseISO(h.horario), 'yyyy-MM-dd')),
    ]).size,
    dominantEmotion,
    frequentDyad,
    moodVariation,
    checkinStreak,
  };

  // Generate patterns
  const patterns = generatePatterns(emotionEntries, breathingSessions, hydrationEntries, emotionCounts, dyadOccurrences);

  // Weekly summary
  const weeklySummary = calculateWeeklySummary(emotionCounts, stats, moodVariation);

  const isLoading = loadingEmotions || loadingBreathing || loadingHydration;
  const isEmpty = emotionEntries.length === 0 && breathingSessions.length === 0 && hydrationEntries.length === 0;

  return {
    chartData,
    radarData,
    dyadOccurrences,
    patterns,
    stats,
    weeklySummary,
    isLoading,
    isEmpty,
  };
}
