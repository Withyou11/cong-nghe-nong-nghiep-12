import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { createQuiz, updateQuiz, deleteQuiz } from '@/lib/api';

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
  created_at?: string;
  updated_at?: string;
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

export function useQuizzesByLesson(lessonId: number | null) {
  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizzes', lessonId],
    queryFn: async () => {
      if (!lessonId) return [];

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
        .eq('lesson_id', lessonId)
        .order('id');

      if (error) {
        throw error;
      }

      return data as Quiz[];
    },
    enabled: !!lessonId,
  });

  return { quizzes, isLoading };
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      title,
      questions,
    }: {
      lessonId: number;
      title: string;
      questions: {
        question: string;
        options: string[];
        correct_answer: number;
      }[];
    }) => createQuiz(lessonId, title, questions),
    onSuccess: (_, variables) => {
      // Invalidate and refetch quizzes for the specific lesson
      queryClient.invalidateQueries({
        queryKey: ['quizzes', variables.lessonId],
      });
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}

export function useUpdateQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      title,
      questions,
    }: {
      quizId: number;
      title: string;
      questions: {
        question: string;
        options: string[];
        correct_answer: number;
      }[];
    }) => updateQuiz(quizId, title, questions),
    onSuccess: () => {
      // Invalidate and refetch all quizzes
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => deleteQuiz(quizId),
    onSuccess: () => {
      // Invalidate and refetch all quizzes
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}
