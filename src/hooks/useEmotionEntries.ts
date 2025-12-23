import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface EmotionEntry {
  id: string;
  user_id: string;
  selected_emotions: Array<{ id: string; intensity: number }>;
  detected_dyads: Array<{ result: string; label: string; description: string }>;
  recommended_treatment: Record<string, unknown> | null;
  free_text: string | null;
  created_at: string;
}

export interface CreateEmotionEntryData {
  selected_emotions: Array<{ id: string; intensity: number }>;
  detected_dyads?: Array<{ result: string; label: string; description: string }>;
  recommended_treatment?: Record<string, unknown> | null;
  free_text?: string;
}

export function useEmotionEntries() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['emotion-entries', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emotion_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as EmotionEntry[];
    },
    enabled: !!user,
  });
}

export function useCreateEmotionEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entryData: CreateEmotionEntryData) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('emotion_entries')
        .insert([{
          user_id: user.id,
          selected_emotions: entryData.selected_emotions as unknown as Record<string, unknown>,
          detected_dyads: (entryData.detected_dyads || []) as unknown as Record<string, unknown>,
          recommended_treatment: entryData.recommended_treatment || null,
          free_text: entryData.free_text || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as EmotionEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion-entries'] });
    },
    onError: (error) => {
      console.error('Error creating emotion entry:', error);
      toast.error('Erro ao salvar registro de emoções');
    },
  });
}

export function useRecentEmotionStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['emotion-stats', user?.id],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('emotion_entries')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as EmotionEntry[];
    },
    enabled: !!user,
  });
}
