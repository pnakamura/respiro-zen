import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface BreathingSession {
  id: string;
  user_id: string;
  technique_id: string | null;
  technique_name: string;
  emotion_entry_id: string | null;
  cycles_completed: number;
  duration_ms: number;
  completed_at: string;
}

export interface CreateBreathingSessionData {
  technique_id?: string;
  technique_name: string;
  emotion_entry_id?: string;
  cycles_completed: number;
  duration_ms: number;
}

export function useBreathingSessions() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['breathing-sessions', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breathing_sessions')
        .select('*')
        .order('completed_at', { ascending: false });

      if (error) throw error;
      return data as BreathingSession[];
    },
    enabled: !!user,
  });
}

export function useCreateBreathingSession() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (sessionData: CreateBreathingSessionData) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('breathing_sessions')
        .insert({
          user_id: user.id,
          technique_id: sessionData.technique_id || null,
          technique_name: sessionData.technique_name,
          emotion_entry_id: sessionData.emotion_entry_id || null,
          cycles_completed: sessionData.cycles_completed,
          duration_ms: sessionData.duration_ms,
        })
        .select()
        .single();

      if (error) throw error;
      return data as BreathingSession;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathing-sessions'] });
      toast.success('Sessão de respiração registrada!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar sessão de respiração');
      console.error('Error creating breathing session:', error);
    },
  });
}

export function useRecentBreathingStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['breathing-stats', user?.id],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('breathing_sessions')
        .select('*')
        .gte('completed_at', thirtyDaysAgo.toISOString())
        .order('completed_at', { ascending: false });

      if (error) throw error;
      
      const totalSessions = data.length;
      const totalDurationMs = data.reduce((sum, s) => sum + s.duration_ms, 0);
      const totalCycles = data.reduce((sum, s) => sum + s.cycles_completed, 0);

      return {
        sessions: data as BreathingSession[],
        totalSessions,
        totalDurationMs,
        totalCycles,
      };
    },
    enabled: !!user,
  });
}
