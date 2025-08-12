import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Keyword {
  id: number;
  term: string;
  definition: string;
  topic_id: number;
  created_at: string;
  updated_at: string;
}

export function useKeywords() {
  const { data: keywords, isLoading } = useQuery({
    queryKey: ['keywords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .order('id');

      if (error) {
        throw error;
      }

      return data as Keyword[];
    },
  });

  return { keywords, isLoading };
}

export function useKeywordsByTopic(topicId: number | null) {
  const { data: keywords, isLoading } = useQuery({
    queryKey: ['keywords', topicId],
    queryFn: async () => {
      if (!topicId) return [] as Keyword[];
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('topic_id', topicId)
        .order('id');

      if (error) throw error;
      return data as Keyword[];
    },
    enabled: !!topicId,
  });
  return { keywords: keywords || [], isLoading };
}

export function useCreateKeyword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      topic_id: number;
      term: string;
      definition: string;
    }) => {
      const { data, error } = await supabase
        .from('keywords')
        .insert(payload)
        .select('*')
        .single();
      if (error) throw error;
      return data as Keyword;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['keywords'] });
      qc.invalidateQueries({ queryKey: ['keywords', data.topic_id] });
    },
  });
}

export function useUpdateKeyword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id: number;
      term: string;
      definition: string;
      topic_id: number;
    }) => {
      const { data, error } = await supabase
        .from('keywords')
        .update({ term: payload.term, definition: payload.definition })
        .eq('id', payload.id)
        .select('*')
        .single();
      if (error) throw error;
      return data as Keyword;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['keywords'] });
      qc.invalidateQueries({ queryKey: ['keywords', data.topic_id] });
    },
  });
}

export function useDeleteKeyword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { id: number; topic_id: number }) => {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', payload.id);
      if (error) throw error;
      return payload;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['keywords'] });
      qc.invalidateQueries({ queryKey: ['keywords', data.topic_id] });
    },
  });
}
