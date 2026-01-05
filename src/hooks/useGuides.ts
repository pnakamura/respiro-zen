import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface SpiritualGuide {
  id: string;
  name: string;
  avatar_emoji: string;
  description: string;
  approach: string;
  system_prompt: string;
  personality_traits: string[];
  topics: string[];
  welcome_message: string | null;
  suggested_questions: string[];
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useGuides() {
  return useQuery({
    queryKey: ['spiritual-guides'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spiritual_guides')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      return data as SpiritualGuide[];
    },
  });
}

export function useAllGuides() {
  return useQuery({
    queryKey: ['spiritual-guides-all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spiritual_guides')
        .select('*')
        .order('display_order');

      if (error) throw error;
      return data as SpiritualGuide[];
    },
  });
}

export function useGuide(guideId: string | null) {
  return useQuery({
    queryKey: ['spiritual-guide', guideId],
    queryFn: async () => {
      if (!guideId) return null;
      
      const { data, error } = await supabase
        .from('spiritual_guides')
        .select('*')
        .eq('id', guideId)
        .single();

      if (error) throw error;
      return data as SpiritualGuide;
    },
    enabled: !!guideId,
  });
}

export function useUserGuidePreference() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['user-guide-preference', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_guide_preferences')
        .select('preferred_guide_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.preferred_guide_id || null;
    },
    enabled: !!user,
  });
}

export function useSetPreferredGuide() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guideId: string) => {
      if (!user) throw new Error('User not authenticated');

      const { data: existing } = await supabase
        .from('user_guide_preferences')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_guide_preferences')
          .update({ preferred_guide_id: guideId })
          .eq('user_id', user.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_guide_preferences')
          .insert({ user_id: user.id, preferred_guide_id: guideId });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-guide-preference'] });
      toast({
        title: 'Guia selecionado',
        description: 'Sua preferência foi salva com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error setting preferred guide:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar sua preferência.',
        variant: 'destructive',
      });
    },
  });
}

export function useCreateGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guide: Omit<Partial<SpiritualGuide>, 'id' | 'created_at' | 'updated_at'> & { name: string; description: string; approach: string; system_prompt: string }) => {
      const { data, error } = await supabase
        .from('spiritual_guides')
        .insert([guide])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spiritual-guides'] });
      queryClient.invalidateQueries({ queryKey: ['spiritual-guides-all'] });
      toast({
        title: 'Guia criado',
        description: 'O guia espiritual foi criado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating guide:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o guia.',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SpiritualGuide> & { id: string }) => {
      const { data, error } = await supabase
        .from('spiritual_guides')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spiritual-guides'] });
      queryClient.invalidateQueries({ queryKey: ['spiritual-guides-all'] });
      toast({
        title: 'Guia atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error updating guide:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o guia.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteGuide() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guideId: string) => {
      const { error } = await supabase
        .from('spiritual_guides')
        .update({ is_active: false })
        .eq('id', guideId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spiritual-guides'] });
      queryClient.invalidateQueries({ queryKey: ['spiritual-guides-all'] });
      toast({
        title: 'Guia desativado',
        description: 'O guia foi desativado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error deleting guide:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível desativar o guia.',
        variant: 'destructive',
      });
    },
  });
}
