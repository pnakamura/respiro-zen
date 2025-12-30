import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { subDays, format, startOfDay, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Period = '7d' | '30d' | '90d';

interface ChartDataPoint {
  day: string;
  date: string;
  alegria: number;
  tristeza: number;
  calma: number;
}

interface Pattern {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface InsightsStats {
  emotionCheckins: number;
  breathingSessions: number;
  breathingMinutes: number;
  waterLiters: number;
  activeDays: number;
}

interface SelectedEmotion {
  id: string;
  intensity?: number;
}

const POSITIVE_EMOTIONS = ['joy', 'anticipation', 'love', 'optimism', 'ecstasy', 'serenity'];
const NEGATIVE_EMOTIONS = ['sadness', 'fear', 'disgust', 'anger', 'terror', 'grief', 'loathing', 'rage'];
const CALM_EMOTIONS = ['trust', 'acceptance', 'admiration', 'serenity'];

function getPeriodDays(period: Period): number {
  switch (period) {
    case '7d': return 7;
    case '30d': return 30;
    case '90d': return 90;
  }
}

function categorizeEmotions(emotions: SelectedEmotion[]): { alegria: number; tristeza: number; calma: number } {
  let alegria = 0, tristeza = 0, calma = 0;
  let alegriaCount = 0, tristezaCount = 0, calmaCount = 0;

  emotions.forEach(emotion => {
    const intensity = emotion.intensity || 3;
    const id = emotion.id.toLowerCase();

    if (POSITIVE_EMOTIONS.some(e => id.includes(e))) {
      alegria += intensity;
      alegriaCount++;
    }
    if (NEGATIVE_EMOTIONS.some(e => id.includes(e))) {
      tristeza += intensity;
      tristezaCount++;
    }
    if (CALM_EMOTIONS.some(e => id.includes(e))) {
      calma += intensity;
      calmaCount++;
    }
  });

  return {
    alegria: alegriaCount > 0 ? Math.round(alegria / alegriaCount) : 0,
    tristeza: tristezaCount > 0 ? Math.round(tristeza / tristezaCount) : 0,
    calma: calmaCount > 0 ? Math.round(calma / calmaCount) : 0,
  };
}

function generatePatterns(
  emotionEntries: any[],
  breathingSessions: any[],
  hydrationEntries: any[]
): Pattern[] {
  const patterns: Pattern[] = [];

  // Pattern: Breathing helps
  if (breathingSessions.length >= 3) {
    const totalMinutes = breathingSessions.reduce((acc, s) => acc + (s.duration_ms || 0), 0) / 60000;
    patterns.push({
      id: 'breathing_habit',
      icon: '🧘',
      title: 'Prática de respiração',
      description: `Você completou ${breathingSessions.length} sessões totalizando ${Math.round(totalMinutes)} minutos.`,
    });
  }

  // Pattern: Emotion tracking consistency
  if (emotionEntries.length >= 5) {
    const uniqueDays = new Set(emotionEntries.map(e => format(parseISO(e.created_at), 'yyyy-MM-dd'))).size;
    patterns.push({
      id: 'emotion_tracking',
      icon: '📈',
      title: 'Acompanhamento consistente',
      description: `Você registrou suas emoções em ${uniqueDays} dias diferentes.`,
    });
  }

  // Pattern: Hydration
  if (hydrationEntries.length > 0) {
    const totalLiters = hydrationEntries.reduce((acc, h) => acc + (h.quantidade_ml || 0), 0) / 1000;
    const uniqueDays = new Set(hydrationEntries.map(h => format(parseISO(h.horario), 'yyyy-MM-dd'))).size;
    if (uniqueDays >= 3) {
      patterns.push({
        id: 'hydration_habit',
        icon: '💧',
        title: 'Hidratação regular',
        description: `Você registrou ${totalLiters.toFixed(1)}L de água em ${uniqueDays} dias.`,
      });
    }
  }

  // Pattern: Morning vs Afternoon emotions
  if (emotionEntries.length >= 5) {
    const morningEntries = emotionEntries.filter(e => {
      const hour = parseISO(e.created_at).getHours();
      return hour >= 5 && hour < 12;
    });
    const afternoonEntries = emotionEntries.filter(e => {
      const hour = parseISO(e.created_at).getHours();
      return hour >= 12 && hour < 18;
    });

    if (morningEntries.length >= 2 && afternoonEntries.length >= 2) {
      const morningPositive = morningEntries.filter(e => {
        const emotions = (Array.isArray(e.selected_emotions) ? e.selected_emotions : []) as SelectedEmotion[];
        return emotions.some(em => POSITIVE_EMOTIONS.some(p => em.id.toLowerCase().includes(p)));
      }).length / morningEntries.length;

      const afternoonPositive = afternoonEntries.filter(e => {
        const emotions = (Array.isArray(e.selected_emotions) ? e.selected_emotions : []) as SelectedEmotion[];
        return emotions.some(em => POSITIVE_EMOTIONS.some(p => em.id.toLowerCase().includes(p)));
      }).length / afternoonEntries.length;

      if (morningPositive > afternoonPositive + 0.2) {
        patterns.push({
          id: 'morning_positive',
          icon: '🌅',
          title: 'Manhãs mais positivas',
          description: 'Você tende a registrar mais emoções positivas pela manhã.',
        });
      } else if (afternoonPositive > morningPositive + 0.2) {
        patterns.push({
          id: 'afternoon_positive',
          icon: '☀️',
          title: 'Tardes mais positivas',
          description: 'Você tende a registrar mais emoções positivas à tarde.',
        });
      }
    }
  }

  // If no patterns detected, show encouraging message
  if (patterns.length === 0) {
    patterns.push({
      id: 'keep_going',
      icon: '✨',
      title: 'Continue registrando',
      description: 'Mais dados nos ajudarão a identificar seus padrões emocionais.',
    });
  }

  return patterns.slice(0, 3);
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

  // Process chart data
  const chartData: ChartDataPoint[] = [];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  for (let i = periodDays - 1; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayEntries = emotionEntries.filter(e => 
      format(parseISO(e.created_at), 'yyyy-MM-dd') === dateStr
    );

    if (dayEntries.length > 0) {
      const allEmotions: SelectedEmotion[] = dayEntries.flatMap(e => 
        (Array.isArray(e.selected_emotions) ? e.selected_emotions : []) as unknown as SelectedEmotion[]
      );
      const categorized = categorizeEmotions(allEmotions);

      chartData.push({
        day: dayNames[date.getDay()],
        date: dateStr,
        ...categorized,
      });
    }
  }

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
  };

  // Generate patterns
  const patterns = generatePatterns(emotionEntries, breathingSessions, hydrationEntries);

  const isLoading = loadingEmotions || loadingBreathing || loadingHydration;
  const isEmpty = emotionEntries.length === 0 && breathingSessions.length === 0 && hydrationEntries.length === 0;

  return {
    chartData,
    patterns,
    stats,
    isLoading,
    isEmpty,
  };
}
