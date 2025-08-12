import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface QuizWithQuestions {
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
  created_at?: string;
  updated_at?: string;
}

export function useTopicQuizzes(topicId: number) {
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['topic-quizzes', topicId],
    queryFn: async () => {
      if (!topicId) return [];

      const { data, error } = await supabase
        .from('quizzes')
        .select(
          `
          *,
          lessons!inner(
            id,
            topic_id
          ),
          questions (
            id,
            question,
            options,
            correct_answer
          )
        `
        )
        .eq('lessons.topic_id', topicId)
        .order('id');

      if (error) {
        throw error;
      }

      return data as QuizWithQuestions[];
    },
    enabled: !!topicId,
  });

  return { quizzes, isLoading };
}
