import { supabase } from './supabase';
import type { Database } from './supabase';

// Types
type Quiz = Database['public']['Tables']['quizzes']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Keyword = Database['public']['Tables']['keywords']['Row'];

export interface Topic {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  topic_id: number;
  duration: string;
  created_at: string;
  updated_at: string;
  topics?: Topic;
}

// Topics API
export async function getTopics() {
  const { data, error } = await supabase.from('topics').select('*').order('id');

  if (error) throw error;
  return data as Topic[];
}

export async function getTopic(id: number) {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Topic;
}

// Lessons API
export async function getLessons(topicId: number) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('topic_id', topicId)
    .order('id');

  if (error) throw error;
  return data as Lesson[];
}

export async function getLesson(id: number) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Lesson;
}

// Quizzes API
export async function getQuizzes(topicId: number) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('topic_id', topicId)
    .order('id');

  if (error) throw error;
  return data as Quiz[];
}

export async function getQuiz(id: number) {
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Quiz;
}

// Questions API
export async function getQuestions(quizId: number) {
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('quiz_id', quizId)
    .order('id');

  if (error) throw error;
  return data as Question[];
}

// Keywords API
export async function getKeywords(topicId: number) {
  const { data, error } = await supabase
    .from('keywords')
    .select('*')
    .eq('topic_id', topicId)
    .order('id');

  if (error) throw error;
  return data as Keyword[];
}

// Admin API functions (chỉ sử dụng ở server-side)
export async function createTopic(
  topic: Database['public']['Tables']['topics']['Insert']
) {
  const { data, error } = await supabase
    .from('topics')
    .insert(topic)
    .select()
    .single();

  if (error) throw error;
  return data as Topic;
}

export async function updateTopic(
  id: number,
  topic: Database['public']['Tables']['topics']['Update']
) {
  const { data, error } = await supabase
    .from('topics')
    .update(topic)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Topic;
}

export async function deleteTopic(id: number) {
  const { error } = await supabase.from('topics').delete().eq('id', id);

  if (error) throw error;
  return true;
}

export const lessonsApi = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select(
        `
        *,
        topics (
          id,
          title
        )
      `
      )
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (
    lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'topics'>
  ) => {
    const { data, error } = await supabase
      .from('lessons')
      .insert(lesson)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (
    id: string,
    lesson: Partial<Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'topics'>>
  ) => {
    const { data, error } = await supabase
      .from('lessons')
      .update(lesson)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('lessons').delete().eq('id', id);

    if (error) throw error;
  },
};

export const statsApi = {
  getStats: async () => {
    const { data: lessons, error: lessonsError } = await supabase
      .from('lessons')
      .select('id');

    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select('id');

    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('id');

    if (lessonsError || quizzesError || keywordsError) {
      throw new Error('Failed to fetch statistics');
    }

    return {
      totalLessons: lessons?.length || 0,
      totalQuizzes: quizzes?.length || 0,
      totalKeywords: keywords?.length || 0,
    };
  },

  getTopicStats: async () => {
    const { data, error } = await supabase.from('topics').select(`
        id,
        title,
        lessons:lessons(id),
        quizzes:quizzes(id),
        keywords:keywords(id)
      `);

    if (error) throw error;

    return (
      data?.map((topic) => ({
        id: topic.id,
        title: topic.title,
        lessons: topic.lessons?.length || 0,
        quizzes: topic.quizzes?.length || 0,
        keywords: topic.keywords?.length || 0,
      })) || []
    );
  },
};
