import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { BreathingTechnique } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';
import type { Json } from '@/integrations/supabase/types';
import { sanitizeFileName } from '@/lib/fileUtils';

export function useBreathingTechniques() {
  return useQuery({
    queryKey: ['breathing-techniques'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('breathing_techniques')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as BreathingTechnique[];
    },
  });
}

export function useBreathingTechnique(id: string | undefined) {
  return useQuery({
    queryKey: ['breathing-technique', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('breathing_techniques')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as BreathingTechnique;
    },
    enabled: !!id,
  });
}

export function useCreateBreathingTechnique() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (technique: Record<string, unknown>) => {
      const { data, error } = await supabase
        .from('breathing_techniques')
        .insert(technique as { emotion_id: string; label: string; description: string; pattern_name: string; special_config?: Json })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathing-techniques'] });
      toast({
        title: 'Técnica criada',
        description: 'A técnica de respiração foi criada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao criar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateBreathingTechnique() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const { data: result, error } = await supabase
        .from('breathing_techniques')
        .update(data as { special_config?: Json })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathing-techniques'] });
      toast({
        title: 'Técnica atualizada',
        description: 'A técnica de respiração foi atualizada com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao atualizar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteBreathingTechnique() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('breathing_techniques')
        .update({ deleted_at: new Date().toISOString(), is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['breathing-techniques'] });
      toast({
        title: 'Técnica removida',
        description: 'A técnica de respiração foi removida com sucesso.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro ao remover',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}

export function useUploadBreathingAudio() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ file, techniqueId }: { file: File; techniqueId: string }) => {
      const fileExt = file.name.split('.').pop();
      const sanitizedName = sanitizeFileName(file.name.replace(`.${fileExt}`, ''));
      const fileName = `${techniqueId}-${Date.now()}-${sanitizedName}.${fileExt}`;
      const filePath = `breathing/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meditation-audio')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('meditation-audio')
        .getPublicUrl(filePath);

      return publicUrl;
    },
    onError: (error) => {
      toast({
        title: 'Erro ao fazer upload',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
}
