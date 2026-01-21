import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface UserJourney {
  id: string;
  user_id: string;
  journey_id: string;
  current_day: number;
  started_at: string;
  completed_at: string | null;
  last_activity_at: string;
  streak_count: number;
  is_active: boolean;
}

export interface DayCompletion {
  id: string;
  user_journey_id: string;
  day_number: number;
  teaching_read: boolean;
  practice_done: boolean;
  challenge_done: boolean;
  reflection_note: string | null;
  mood_before: string | null;
  mood_after: string | null;
  completed_at: string;
}

export function useActiveUserJourney() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['active-user-journey', user?.id],
    queryFn: async (): Promise<(UserJourney & { journey: { title: string; icon: string; duration_days: number; theme_color: string } }) | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('user_journeys')
        .select(`
          *,
          journey:journeys(title, icon, duration_days, theme_color)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .is('completed_at', null)
        .maybeSingle();

      if (error) {
        console.error('Error fetching active journey:', error);
        toast.error('Erro ao carregar jornada ativa');
        throw error;
      }

      if (!data) return null;

      return {
        ...data,
        journey: Array.isArray(data.journey) ? data.journey[0] : data.journey,
      };
    },
    enabled: !!user?.id,
  });
}

export function useUserJourneys() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-journeys', user?.id],
    queryFn: async (): Promise<UserJourney[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_journeys')
        .select('*')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false });

      if (error) {
        console.error('Error fetching user journeys:', error);
        toast.error('Erro ao carregar suas jornadas');
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
}

export function useJourneyCompletions(userJourneyId: string | undefined) {
  return useQuery({
    queryKey: ['journey-completions', userJourneyId],
    queryFn: async (): Promise<DayCompletion[]> => {
      if (!userJourneyId) return [];

      const { data, error } = await supabase
        .from('journey_day_completions')
        .select('*')
        .eq('user_journey_id', userJourneyId)
        .order('day_number', { ascending: true });

      if (error) {
        console.error('Error fetching completions:', error);
        toast.error('Erro ao carregar progresso da jornada');
        throw error;
      }

      return data || [];
    },
    enabled: !!userJourneyId,
  });
}

export function useStartJourney() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (journeyId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Deactivate any current active journey
      await supabase
        .from('user_journeys')
        .update({ is_active: false })
        .eq('user_id', user.id)
        .eq('is_active', true);

      // Start new journey
      const { data, error } = await supabase
        .from('user_journeys')
        .insert({
          user_id: user.id,
          journey_id: journeyId,
          current_day: 1,
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-user-journey'] });
      queryClient.invalidateQueries({ queryKey: ['user-journeys'] });
    },
    onError: (error) => {
      console.error('Error starting journey:', error);
      toast.error('Erro ao iniciar jornada');
    },
  });
}

export function useCompleteDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userJourneyId,
      dayNumber,
      reflectionNote,
      moodBefore,
      moodAfter,
      teachingRead = true,
      practiceDone = false,
      challengeDone = false,
    }: {
      userJourneyId: string;
      dayNumber: number;
      reflectionNote?: string;
      moodBefore?: string;
      moodAfter?: string;
      teachingRead?: boolean;
      practiceDone?: boolean;
      challengeDone?: boolean;
    }) => {
      // Upsert completion
      const { error: completionError } = await supabase
        .from('journey_day_completions')
        .upsert({
          user_journey_id: userJourneyId,
          day_number: dayNumber,
          teaching_read: teachingRead,
          practice_done: practiceDone,
          challenge_done: challengeDone,
          reflection_note: reflectionNote,
          mood_before: moodBefore,
          mood_after: moodAfter,
        }, {
          onConflict: 'user_journey_id,day_number',
        });

      if (completionError) throw completionError;

      // Update current day in user_journey
      const { error: updateError } = await supabase
        .from('user_journeys')
        .update({
          current_day: dayNumber + 1,
          last_activity_at: new Date().toISOString(),
        })
        .eq('id', userJourneyId);

      if (updateError) throw updateError;
    },
    onSuccess: (_, { userJourneyId }) => {
      queryClient.invalidateQueries({ queryKey: ['journey-completions', userJourneyId] });
      queryClient.invalidateQueries({ queryKey: ['active-user-journey'] });
    },
    onError: (error) => {
      console.error('Error completing day:', error);
      toast.error('Erro ao completar dia da jornada');
    },
  });
}

export function useCompleteJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userJourneyId: string) => {
      const { error } = await supabase
        .from('user_journeys')
        .update({
          completed_at: new Date().toISOString(),
          is_active: false,
        })
        .eq('id', userJourneyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-user-journey'] });
      queryClient.invalidateQueries({ queryKey: ['user-journeys'] });
    },
    onError: (error) => {
      console.error('Error completing journey:', error);
      toast.error('Erro ao finalizar jornada');
    },
  });
}
