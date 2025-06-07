import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Quiz {
  id: number;
  title: string;
  topic_id: number;
  lesson_id: number;
  questions: {
    id: number;
    question: string;
    options: string[];
    correct_answer: number;
  }[];
  created_at: string;
  updated_at: string;
}

export function useQuizzes() {
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(
          `
          *,
          questions (
            id,
            question,
            options,
            correct_answer
          )
        `
        )
        .order('id');

      if (error) {
        throw error;
      }

      return data as Quiz[];
    },
  });

  return { quizzes, isLoading };
}
