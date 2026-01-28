import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Types for emotion nutrition context
export interface EmotionNutritionContext {
  id: string;
  user_id: string;
  nutrition_entry_id: string | null;
  mood_before: string;
  hunger_type: 'physical' | 'emotional' | 'unknown';
  energy_after: string | null;
  mindful_eating_notes: string | null;
  meal_category: string | null;
  created_at: string;
}

export interface CreateEmotionNutritionContext {
  mood_before: string;
  hunger_type: 'physical' | 'emotional' | 'unknown';
  energy_after?: string | null;
  mindful_eating_notes?: string | null;
  meal_category?: string | null;
  nutrition_entry_id?: string | null;
}

// Types for existing nutrition data (read-only)
export interface NutritionEntry {
  id: string;
  usuario_id: string;
  calorias: number | null;
  carboidratos: number | null;
  proteinas: number | null;
  gorduras: number | null;
  descricao_ia: string | null;
  data_registro: string | null;
  categoria_refeicao_id: string | null;
}

export interface HydrationEntry {
  id: string;
  usuario_id: string;
  quantidade_ml: number;
  tipo_liquido: string | null;
  horario: string | null;
}

export interface MealCategory {
  id: string;
  nome: string;
  descricao: string | null;
  ordem: number | null;
}

// Hook for emotion nutrition context (new isolated table)
export function useEmotionNutritionContext() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['emotion-nutrition-context', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('emotion_nutrition_context')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as EmotionNutritionContext[];
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (entry: CreateEmotionNutritionContext) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('emotion_nutrition_context')
        .insert({
          user_id: user.id,
          ...entry,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emotion-nutrition-context'] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    createEntry: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
  };
}

// Hook for existing nutrition data (read-only)
export function useNutritionEntries() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['nutrition-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('informacoes_nutricionais')
        .select('*')
        .is('deletado_em', null)
        .order('data_registro', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data as NutritionEntry[];
    },
    enabled: !!user?.id,
  });
}

// Hook for hydration data
export function useHydrationEntries() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['hydration-entries', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('registro_hidratacao')
        .select('*')
        .is('deletado_em', null)
        .gte('horario', today.toISOString())
        .order('horario', { ascending: false });
      
      if (error) throw error;
      return data as HydrationEntry[];
    },
    enabled: !!user?.id,
  });

  const addWaterMutation = useMutation({
    mutationFn: async ({ quantidade_ml, tipo_liquido }: { quantidade_ml: number; tipo_liquido: string }) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('registro_hidratacao')
        .insert([{
          usuario_id: user.id,
          quantidade_ml,
          tipo_liquido: tipo_liquido as 'água' | 'café' | 'chá' | 'suco' | 'outro',
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hydration-entries'] });
      queryClient.invalidateQueries({ queryKey: ['insights-hydration'] });
    },
  });

  // Calculate totals
  const entries = query.data ?? [];
  const waterToday = entries
    .filter(e => e.tipo_liquido === 'água')
    .reduce((sum, entry) => sum + entry.quantidade_ml, 0);
  
  const otherLiquidsToday = entries
    .filter(e => e.tipo_liquido !== 'água')
    .reduce((sum, entry) => sum + entry.quantidade_ml, 0);
  
  const totalToday = waterToday + otherLiquidsToday;

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    totalToday,
    waterToday,
    otherLiquidsToday,
    addWater: (quantidade_ml: number, tipo_liquido: string = 'água') => 
      addWaterMutation.mutateAsync({ quantidade_ml, tipo_liquido }),
    isAddingWater: addWaterMutation.isPending,
  };
}

// Hook for meal categories (read-only)
export function useMealCategories() {
  return useQuery({
    queryKey: ['meal-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categorias_refeicao')
        .select('*')
        .order('ordem', { ascending: true });
      
      if (error) throw error;
      return data as MealCategory[];
    },
  });
}

// Hook for today's nutrition summary
export function useTodayNutritionSummary() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['today-nutrition-summary', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('informacoes_nutricionais')
        .select('calorias, carboidratos, proteinas, gorduras')
        .is('deletado_em', null)
        .gte('data_registro', today.toISOString());
      
      if (error) throw error;
      
      return {
        totalCalories: data.reduce((sum, e) => sum + (e.calorias ?? 0), 0),
        totalCarbs: data.reduce((sum, e) => sum + (e.carboidratos ?? 0), 0),
        totalProteins: data.reduce((sum, e) => sum + (e.proteinas ?? 0), 0),
        totalFats: data.reduce((sum, e) => sum + (e.gorduras ?? 0), 0),
        mealsCount: data.length,
      };
    },
    enabled: !!user?.id,
  });
}
