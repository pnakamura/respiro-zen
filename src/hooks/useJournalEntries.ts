import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  word_count: number;
  detected_emotions: string[];
  emotion_entry_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateJournalEntryData {
  content: string;
  word_count: number;
  detected_emotions?: string[];
  emotion_entry_id?: string;
}

export interface UpdateJournalEntryData {
  id: string;
  content: string;
  word_count: number;
  detected_emotions?: string[];
}

export function useJournalEntries() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['journal-entries', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as JournalEntry[];
    },
    enabled: !!user,
  });
}

export function useJournalEntry(id: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['journal-entry', id],
    queryFn: async () => {
      if (!id) throw new Error('ID não fornecido');

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as unknown as JournalEntry | null;
    },
    enabled: !!user && !!id,
  });
}

export function useCreateJournalEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (entryData: CreateJournalEntryData) => {
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          content: entryData.content,
          word_count: entryData.word_count,
          detected_emotions: entryData.detected_emotions || [],
          emotion_entry_id: entryData.emotion_entry_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as unknown as JournalEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast.success('Entrada do diário salva!');
    },
    onError: (error) => {
      console.error('Error creating journal entry:', error);
      toast.error('Erro ao salvar entrada do diário');
    },
  });
}

export function useUpdateJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryData: UpdateJournalEntryData) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          content: entryData.content,
          word_count: entryData.word_count,
          detected_emotions: entryData.detected_emotions || [],
        })
        .eq('id', entryData.id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as JournalEntry;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      queryClient.invalidateQueries({ queryKey: ['journal-entry', data.id] });
      toast.success('Entrada atualizada!');
    },
    onError: (error) => {
      console.error('Error updating journal entry:', error);
      toast.error('Erro ao atualizar entrada');
    },
  });
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      toast.success('Entrada removida');
    },
    onError: (error) => {
      console.error('Error deleting journal entry:', error);
      toast.error('Erro ao remover entrada');
    },
  });
}

export function useRecentJournalStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['journal-stats', user?.id],
    queryFn: async () => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      const entries = data as unknown as JournalEntry[];
      const totalEntries = entries.length;
      const totalWords = entries.reduce((sum, e) => sum + e.word_count, 0);

      return {
        entries,
        totalEntries,
        totalWords,
      };
    },
    enabled: !!user,
  });
}
