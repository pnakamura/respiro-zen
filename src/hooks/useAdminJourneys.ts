import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Journey, JourneyDay } from './useJourneys';

// ============ JOURNEY HOOKS ============

export function useAllJourneys() {
  return useQuery({
    queryKey: ['admin-journeys'],
    queryFn: async (): Promise<Journey[]> => {
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      return (data || []).map(j => ({
        ...j,
        benefits: Array.isArray(j.benefits) ? j.benefits.map(b => String(b)) : [],
        difficulty: j.difficulty as Journey['difficulty'],
      }));
    },
  });
}

export function useAdminJourney(journeyId: string | undefined) {
  return useQuery({
    queryKey: ['admin-journey', journeyId],
    queryFn: async (): Promise<Journey | null> => {
      if (!journeyId) return null;

      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .eq('id', journeyId)
        .single();

      if (error) throw error;

      return data ? {
        ...data,
        benefits: Array.isArray(data.benefits) ? data.benefits.map(b => String(b)) : [],
        difficulty: data.difficulty as Journey['difficulty'],
      } : null;
    },
    enabled: !!journeyId,
  });
}

interface JourneyPayload {
  title: string;
  subtitle?: string | null;
  description: string;
  icon?: string;
  theme_color?: string;
  cover_image_url?: string | null;
  duration_days: number;
  difficulty: string;
  category?: string;
  benefits?: string[];
  is_premium?: boolean;
  is_active?: boolean;
  display_order?: number;
}

export function useCreateJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JourneyPayload) => {
      const { data: result, error } = await supabase
        .from('journeys')
        .insert({
          ...data,
          benefits: data.benefits || [],
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-journeys'] });
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      toast.success('Jornada criada com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating journey:', error);
      toast.error('Erro ao criar jornada');
    },
  });
}

export function useUpdateJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JourneyPayload }) => {
      const { data: result, error } = await supabase
        .from('journeys')
        .update({
          ...data,
          benefits: data.benefits || [],
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-journeys'] });
      queryClient.invalidateQueries({ queryKey: ['admin-journey', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      toast.success('Jornada atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating journey:', error);
      toast.error('Erro ao atualizar jornada');
    },
  });
}

export function useDeleteJourney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('journeys')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-journeys'] });
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      toast.success('Jornada removida com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting journey:', error);
      toast.error('Erro ao remover jornada');
    },
  });
}

// ============ JOURNEY DAY HOOKS ============

export function useAdminJourneyDays(journeyId: string | undefined) {
  return useQuery({
    queryKey: ['admin-journey-days', journeyId],
    queryFn: async (): Promise<JourneyDay[]> => {
      if (!journeyId) return [];

      const { data, error } = await supabase
        .from('journey_days')
        .select('*')
        .eq('journey_id', journeyId)
        .order('day_number', { ascending: true });

      if (error) throw error;

      return (data || []).map(d => ({
        ...d,
        activity_type: d.activity_type as JourneyDay['activity_type'],
      }));
    },
    enabled: !!journeyId,
  });
}

export function useAdminJourneyDay(dayId: string | undefined) {
  return useQuery({
    queryKey: ['admin-journey-day', dayId],
    queryFn: async (): Promise<JourneyDay | null> => {
      if (!dayId) return null;

      const { data, error } = await supabase
        .from('journey_days')
        .select('*')
        .eq('id', dayId)
        .single();

      if (error) throw error;

      return data ? {
        ...data,
        activity_type: data.activity_type as JourneyDay['activity_type'],
      } : null;
    },
    enabled: !!dayId,
  });
}

interface JourneyDayPayload {
  journey_id: string;
  day_number: number;
  title: string;
  teaching_text: string;
  teaching_author?: string | null;
  reflection_prompt?: string | null;
  challenge_title?: string | null;
  challenge_description?: string | null;
  bonus_tip?: string | null;
  suggested_breathing_id?: string | null;
  suggested_meditation_id?: string | null;
  activity_type?: string;
  activity_description?: string | null;
  image_url?: string | null;
}

export function useCreateJourneyDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: JourneyDayPayload) => {
      const { data: result, error } = await supabase
        .from('journey_days')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-journey-days', variables.journey_id] });
      queryClient.invalidateQueries({ queryKey: ['journey-days', variables.journey_id] });
      toast.success('Dia criado com sucesso!');
    },
    onError: (error) => {
      console.error('Error creating journey day:', error);
      toast.error('Erro ao criar dia');
    },
  });
}

export function useUpdateJourneyDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<JourneyDayPayload> }) => {
      const { data: result, error } = await supabase
        .from('journey_days')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['admin-journey-days', result.journey_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-journey-day', result.id] });
      queryClient.invalidateQueries({ queryKey: ['journey-days', result.journey_id] });
      toast.success('Dia atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Error updating journey day:', error);
      toast.error('Erro ao atualizar dia');
    },
  });
}

export function useDeleteJourneyDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, journeyId }: { id: string; journeyId: string }) => {
      const { error } = await supabase
        .from('journey_days')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return journeyId;
    },
    onSuccess: (journeyId) => {
      queryClient.invalidateQueries({ queryKey: ['admin-journey-days', journeyId] });
      queryClient.invalidateQueries({ queryKey: ['journey-days', journeyId] });
      toast.success('Dia removido com sucesso!');
    },
    onError: (error) => {
      console.error('Error deleting journey day:', error);
      toast.error('Erro ao remover dia');
    },
  });
}
