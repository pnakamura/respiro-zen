import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface EmotionalInsight {
  title: string;
  description: string;
  type: 'positive' | 'neutral' | 'attention';
}

export interface Correlation {
  insight: string;
  confidence: 'alta' | 'média' | 'baixa';
}

export interface Recommendation {
  action: string;
  reason: string;
  category: 'respiração' | 'meditação' | 'diário' | 'hidratação' | 'jornada' | 'emocional';
}

export interface Achievement {
  title: string;
  emoji: string;
}

export interface WeekdayPattern {
  bestDay: string;
  challengingDay: string;
  insight: string;
}

export interface DataSummary {
  emotions: {
    totalCheckins: number;
    topEmotions: string[];
    avgIntensity: number;
    dyads: string[];
    byWeekday: Record<string, number>;
  };
  breathing: {
    totalSessions: number;
    totalMinutes: number;
    techniques: string[];
    totalCycles: number;
  };
  journal: {
    totalEntries: number;
    totalWords: number;
    excerpts: string[];
  };
  hydration: {
    totalRecords: number;
    avgDaily: number;
    daysWithRecord: number;
  };
}

export interface WellnessReport {
  wellnessScore: number;
  weekEmoji: string;
  headline: string;
  narrative: string;
  emotionalInsights: EmotionalInsight[];
  correlations: Correlation[];
  recommendations: Recommendation[];
  achievements: Achievement[];
  weekdayPatterns: WeekdayPattern | null;
  dataSummary: DataSummary;
  generatedAt: string;
  period: string;
  userName: string;
}

export type Period = '7d' | '30d' | '90d';

export function useWellnessReport(period: Period = '7d') {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['wellness-report', period, user?.id],
    queryFn: async (): Promise<WellnessReport> => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-wellness-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ period }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to generate report: ${response.status}`);
      }

      return response.json();
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 1,
  });
}
