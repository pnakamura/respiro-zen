import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GamificationStats {
  usuario_id: string;
  nivel: number;
  total_pontos: number;
  sequencia_atual: number;
  melhor_sequencia: number;
  conquistas_desbloqueadas: number;
  total_conquistas: number;
  registros_agua_30_dias: number;
  registros_nutricao_30_dias: number;
  registros_peso_30_dias: number;
  atualizado_em: string;
}

export function useGamificationStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['gamification-stats', user?.id],
    queryFn: async (): Promise<GamificationStats | null> => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('gamification_user_stats')
        .select('*')
        .eq('usuario_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching gamification stats:', error);
        toast.error('Erro ao carregar estatísticas de gamificação');
        throw error;
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook to refresh gamification stats using the database function
export function useRefreshGamificationStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['gamification-refresh', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .rpc('refresh_user_gamification', { u_id: user.id });

      if (error) {
        console.error('Error refreshing gamification:', error);
        toast.error('Erro ao atualizar estatísticas');
        throw error;
      }

      return data;
    },
    enabled: false, // Only run manually
  });
}
