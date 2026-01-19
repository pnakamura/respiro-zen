import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Journey {
  id: string;
  title: string;
  subtitle: string | null;
  description: string;
  explanation: string | null;
  icon: string;
  theme_color: string;
  cover_image_url: string | null;
  duration_days: number;
  difficulty: 'iniciante' | 'intermediário' | 'avançado';
  category: string;
  benefits: string[];
  is_premium: boolean;
  is_active: boolean;
  display_order: number;
}

export interface JourneyDay {
  id: string;
  journey_id: string;
  day_number: number;
  title: string;
  teaching_text: string;
  teaching_author: string | null;
  reflection_prompt: string | null;
  challenge_title: string | null;
  challenge_description: string | null;
  bonus_tip: string | null;
  suggested_breathing_id: string | null;
  suggested_meditation_id: string | null;
  activity_type: 'mental' | 'physical' | 'social' | 'creative' | 'spiritual';
  activity_description: string | null;
  image_url: string | null;
  // Dados enriquecidos via JOIN
  breathing_technique?: {
    id: string;
    label: string;
    icon: string | null;
    pattern_name: string;
  } | null;
  meditation_track?: {
    id: string;
    title: string;
    duration_display: string;
  } | null;
}

export function useJourneys() {
  return useQuery({
    queryKey: ['journeys'],
    queryFn: async (): Promise<Journey[]> => {
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching journeys:', error);
        throw error;
      }

      return (data || []).map(j => ({
        ...j,
        benefits: Array.isArray(j.benefits) ? j.benefits.map(b => String(b)) : [],
        difficulty: j.difficulty as Journey['difficulty'],
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useJourney(journeyId: string | undefined) {
  return useQuery({
    queryKey: ['journey', journeyId],
    queryFn: async (): Promise<Journey | null> => {
      if (!journeyId) return null;

      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('id', journeyId)
        .single();

      if (error) {
        console.error('Error fetching journey:', error);
        throw error;
      }

      return data ? {
        ...data,
        benefits: Array.isArray(data.benefits) ? data.benefits.map(b => String(b)) : [],
        difficulty: data.difficulty as Journey['difficulty'],
      } : null;
    },
    enabled: !!journeyId,
  });
}

export function useJourneyDays(journeyId: string | undefined) {
  return useQuery({
    queryKey: ['journey-days', journeyId],
    queryFn: async (): Promise<JourneyDay[]> => {
      if (!journeyId) return [];

      const { data, error } = await supabase
        .from('journey_days')
        .select(`
          *,
          breathing_technique:breathing_techniques(id, label, icon, pattern_name),
          meditation_track:meditation_tracks(id, title, duration_display)
        `)
        .eq('journey_id', journeyId)
        .order('day_number', { ascending: true });

      if (error) {
        console.error('Error fetching journey days:', error);
        throw error;
      }

      return (data || []).map(d => ({
        ...d,
        activity_type: d.activity_type as JourneyDay['activity_type'],
        breathing_technique: d.breathing_technique || null,
        meditation_track: d.meditation_track || null,
      }));
    },
    enabled: !!journeyId,
  });
}
