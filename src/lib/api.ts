import { supabase } from './supabase';
import type { Database } from './supabase';

// Types
type Topic = Database['public']['Tables']['topics']['Row'];
type Lesson = Database['public']['Tables']['lessons']['Row'];
type Quiz = Database['public']['Tables']['quizzes']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Keyword = Database['public']['Tables']['keywords']['Row'];

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
