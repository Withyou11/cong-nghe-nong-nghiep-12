import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface TopicStats {
  topic_id: number;
  lesson_id: number;
  lesson_title: string;
  quiz_count: number;
  question_count: number;
}

export interface TopicSummary {
  topic_id: number;
  total_lessons: number;
  total_quizzes: number;
  total_questions: number;
}

export function useTopicStats() {
  const { data: topicStats, isLoading } = useQuery({
    queryKey: ['topic-stats'],
    queryFn: async () => {
      // Lấy thống kê chi tiết theo lesson
      const { data: statsData, error: statsError } = await supabase
        .from('quizzes')
        .select(
          `
          lesson_id,
          lessons!inner(
            id,
            title,
            topic_id
          ),
          questions(count)
        `
        )
        .order('lesson_id');

      if (statsError) {
        throw statsError;
      }

      // Chuyển đổi dữ liệu để dễ sử dụng
      const stats: TopicStats[] = statsData.map((item: any) => ({
        topic_id: item.lessons.topic_id,
        lesson_id: item.lesson_id,
        lesson_title: item.lessons.title,
        quiz_count: 1, // Mỗi record là 1 quiz
        question_count: item.questions[0]?.count || 0,
      }));

      return stats;
    },
  });

  return { topicStats, isLoading };
}

export function useTopicSummary() {
  const { data: topicSummary, isLoading } = useQuery({
    queryKey: ['topic-summary'],
    queryFn: async () => {
      // Lấy tổng hợp theo topic
      const { data: summaryData, error: summaryError } = await supabase.from(
        'quizzes'
      ).select(`
          lessons!inner(
            topic_id
          ),
          questions(count)
        `);

      if (summaryError) {
        throw summaryError;
      }

      // Nhóm theo topic_id
      const topicMap = new Map<number, TopicSummary>();

      summaryData.forEach((item: any) => {
        const topicId = item.lessons.topic_id;
        const questionCount = item.questions[0]?.count || 0;

        if (topicMap.has(topicId)) {
          const existing = topicMap.get(topicId)!;
          existing.total_quizzes += 1;
          existing.total_questions += questionCount;
        } else {
          topicMap.set(topicId, {
            topic_id: topicId,
            total_lessons: 0, // Sẽ tính sau
            total_quizzes: 1,
            total_questions: questionCount,
          });
        }
      });

      // Lấy số lượng lessons cho mỗi topic
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('topic_id')
        .order('topic_id');

      if (lessonsError) {
        throw lessonsError;
      }

      // Cập nhật số lượng lessons
      lessonsData.forEach((lesson: any) => {
        const topicId = lesson.topic_id;
        if (topicMap.has(topicId)) {
          const existing = topicMap.get(topicId)!;
          existing.total_lessons += 1;
        }
      });

      return Array.from(topicMap.values());
    },
  });

  return { topicSummary, isLoading };
}

export function useTopicStatsByTopic(topicId: number) {
  const { data: topicStats, isLoading } = useQuery({
    queryKey: ['topic-stats', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select(
          `
          lesson_id,
          lessons!inner(
            id,
            title,
            topic_id
          ),
          questions(count)
        `
        )
        .eq('lessons.topic_id', topicId)
        .order('lesson_id');

      if (error) {
        throw error;
      }

      const stats: TopicStats[] = data.map((item: any) => ({
        topic_id: item.lessons.topic_id,
        lesson_id: item.lesson_id,
        lesson_title: item.lessons.title,
        quiz_count: 1,
        question_count: item.questions[0]?.count || 0,
      }));

      return stats;
    },
    enabled: !!topicId,
  });

  return { topicStats, isLoading };
}
