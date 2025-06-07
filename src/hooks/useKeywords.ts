import { useQuery } from '@tanstack/react-query';
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
