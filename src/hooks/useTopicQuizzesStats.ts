import { useQuery } from '@tanstack/react-query';
import { getTopicQuizzesStats } from '@/lib/api';

export interface TopicQuizzesStats {
  totalQuizzes: number;
  totalQuestions: number;
  estimatedTime: number;
  quizzes: {
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
  }[];
}

export function useTopicQuizzesStats(topicId: number) {
  const { data: stats, isLoading } = useQuery<TopicQuizzesStats>({
    queryKey: ['topic-quizzes-stats', topicId],
    queryFn: () => getTopicQuizzesStats(topicId),
    enabled: !!topicId,
  });

  return { stats, isLoading };
}
