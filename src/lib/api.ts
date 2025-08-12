import { supabase } from './supabase';
import type { Database } from './supabase';

// Types
type Quiz = Database['public']['Tables']['quizzes']['Row'];
type Question = Database['public']['Tables']['questions']['Row'];
type Keyword = Database['public']['Tables']['keywords']['Row'];

// Exam files types
export interface ExamFileMeta {
  id: number;
  title: string;
  file_name: string;
  file_path: string;
  file_type: string; // mime type
  file_size: number;
  public_url: string;
  topic_id: number | null;
  uploaded_by: string | null;
  created_at: string;
}

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
    .order('id');

  if (error) throw error;
  return data as Quiz[];
}

export async function getQuizzesByLesson(lessonId: number) {
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

export async function createQuiz(
  lessonId: number,
  title: string,
  questions: {
    question: string;
    options: string[];
    correct_answer: number;
  }[]
) {
  try {
    console.log(
      'Attempting to create quiz with lessonId:',
      lessonId,
      'title:',
      title
    );

    // First, create the quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        lesson_id: lessonId,
        title: title,
      })
      .select()
      .single();

    if (quizError) {
      console.error('Error creating quiz:', quizError);

      // Check if it's an RLS error
      if (quizError.code === '42501') {
        console.error(
          'RLS Policy Error: The table has Row Level Security enabled and the current policy does not allow INSERT operations.'
        );
        console.error('You need to either:');
        console.error('1. Disable RLS on the quizzes table');
        console.error(
          '2. Create an RLS policy that allows INSERT for authenticated users'
        );
        console.error('3. Use service role key instead of anon key');
      }

      throw quizError;
    }

    console.log('Quiz created successfully:', quiz);

    // Then, create the questions for this quiz
    const questionsWithQuizId = questions.map((q) => ({
      quiz_id: quiz.id,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
    }));

    console.log('Creating questions:', questionsWithQuizId);

    const { error: questionsError } = await supabase
      .from('questions')
      .insert(questionsWithQuizId);

    if (questionsError) {
      console.error('Error creating questions:', questionsError);
      throw questionsError;
    }

    console.log('Questions created successfully');
    return quiz;
  } catch (error) {
    console.error('Error in createQuiz:', error);
    throw error;
  }
}

export async function updateQuiz(
  quizId: number,
  title: string,
  questions: {
    question: string;
    options: string[];
    correct_answer: number;
  }[]
) {
  // Update the quiz title
  const { error: quizError } = await supabase
    .from('quizzes')
    .update({ title })
    .eq('id', quizId);

  if (quizError) throw quizError;

  // Delete existing questions
  const { error: deleteError } = await supabase
    .from('questions')
    .delete()
    .eq('quiz_id', quizId);

  if (deleteError) throw deleteError;

  // Insert new questions
  const questionsWithQuizId = questions.map((q) => ({
    quiz_id: quizId,
    question: q.question,
    options: q.options,
    correct_answer: q.correct_answer,
  }));

  const { error: questionsError } = await supabase
    .from('questions')
    .insert(questionsWithQuizId);

  if (questionsError) throw questionsError;

  return { id: quizId };
}

export async function deleteQuiz(quizId: number) {
  try {
    console.log('Attempting to delete quiz with ID:', quizId);

    // Delete questions first
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .eq('quiz_id', quizId);

    if (questionsError) {
      console.error('Error deleting questions:', questionsError);
      throw questionsError;
    }

    console.log('Questions deleted successfully');

    // Then delete the quiz
    const { error: quizError } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (quizError) {
      console.error('Error deleting quiz:', quizError);
      throw quizError;
    }

    console.log('Quiz deleted successfully');
  } catch (error) {
    console.error('Error in deleteQuiz:', error);
    throw error;
  }
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

    const { data: quizzes, error: quizzesError } = await supabase.from(
      'quizzes'
    ).select(`
        id,
        questions(count)
      `);

    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('id');

    if (lessonsError || quizzesError || keywordsError) {
      throw new Error('Failed to fetch statistics');
    }

    // Tính tổng số câu hỏi
    const totalQuestions =
      quizzes?.reduce((sum, quiz: { questions: { count: number }[] }) => {
        return sum + (quiz.questions[0]?.count || 0);
      }, 0) || 0;

    return {
      totalLessons: lessons?.length || 0,
      totalQuizzes: quizzes?.length || 0,
      totalQuestions: totalQuestions,
      totalKeywords: keywords?.length || 0,
    };
  },

  getTopicStats: async () => {
    // Lấy thông tin topics và lessons
    const { data: topicsData, error: topicsError } = await supabase.from(
      'topics'
    ).select(`
        id,
        title,
        lessons:lessons(id),
        keywords:keywords(id)
      `);

    if (topicsError) throw topicsError;

    // Lấy thông tin quizzes theo topic
    const { data: quizzesData, error: quizzesError } = await supabase.from(
      'quizzes'
    ).select(`
        lesson_id,
        lessons!inner(
          topic_id
        )
      `);

    if (quizzesError) throw quizzesError;

    // Nhóm quizzes theo topic_id
    const quizzesByTopic = new Map<number, number>();
    quizzesData?.forEach((quiz: { lessons: { topic_id: number }[] }) => {
      const topicId = quiz.lessons[0]?.topic_id;
      if (topicId) {
        quizzesByTopic.set(topicId, (quizzesByTopic.get(topicId) || 0) + 1);
      }
    });

    return (
      topicsData?.map((topic) => ({
        id: topic.id,
        title: topic.title,
        lessons: topic.lessons?.length || 0,
        quizzes: quizzesByTopic.get(topic.id) || 0,
        keywords: topic.keywords?.length || 0,
      })) || []
    );
  },

  getRecentActivity: async () => {
    // Lấy bài học mới nhất
    const { data: recentLessons, error: lessonsError } = await supabase
      .from('lessons')
      .select(
        `
        id,
        title,
        created_at,
        topics!inner(title)
      `
      )
      .order('created_at', { ascending: false })
      .limit(3);

    if (lessonsError) throw lessonsError;

    // Lấy bài tập mới nhất
    const { data: recentQuizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select(
        `
        id,
        title,
        created_at,
        lessons!inner(
          title,
          topics!inner(title)
        )
      `
      )
      .order('created_at', { ascending: false })
      .limit(3);

    if (quizzesError) throw quizzesError;

    // Lấy từ khóa mới nhất
    const { data: recentKeywords, error: keywordsError } = await supabase
      .from('keywords')
      .select(
        `
        id,
        term,
        created_at,
        topics!inner(title)
      `
      )
      .order('created_at', { ascending: false })
      .limit(3);

    if (keywordsError) throw keywordsError;

    // Lấy file thi mới nhất
    const { data: recentFiles, error: filesError } = await supabase
      .from('exam_files')
      .select(
        `
        id,
        title,
        created_at
      `
      )
      .order('created_at', { ascending: false })
      .limit(3);

    if (filesError) throw filesError;

    // Kết hợp tất cả hoạt động và sắp xếp theo thời gian
    const activities = [
      ...recentLessons.map((lesson: any) => ({
        id: lesson.id,
        type: 'lesson',
        title: `Bài học mới: ${lesson.title}`,
        subtitle: `Chủ đề: ${lesson.topics.title}`,
        timestamp: lesson.created_at,
        icon: 'BookOpen',
        color: 'green',
      })),
      ...recentQuizzes.map((quiz: any) => ({
        id: quiz.id,
        type: 'quiz',
        title: `Bài tập mới: ${quiz.title}`,
        subtitle: `Bài học: ${quiz.lessons.title}`,
        timestamp: quiz.created_at,
        icon: 'Brain',
        color: 'blue',
      })),
      ...recentKeywords.map((keyword: any) => ({
        id: keyword.id,
        type: 'keyword',
        title: `Từ khóa mới: ${keyword.term}`,
        subtitle: `Chủ đề: ${keyword.topics.title}`,
        timestamp: keyword.created_at,
        icon: 'Search',
        color: 'purple',
      })),
      ...recentFiles.map((file: any) => ({
        id: file.id,
        type: 'file',
        title: `File thi mới: ${file.title}`,
        subtitle: 'Đề thi THPTQG',
        timestamp: file.created_at,
        icon: 'FileIcon',
        color: 'orange',
      })),
    ].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return activities.slice(0, 5); // Trả về 5 hoạt động gần nhất
  },
};

// Topic Quizzes API
export async function getTopicQuizzesStats(topicId: number) {
  try {
    // Get quizzes with questions count for the topic
    const { data: quizzes, error: quizzesError } = await supabase
      .from('quizzes')
      .select(
        `
        id,
        title,
        lesson_id,
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

    if (quizzesError) throw quizzesError;

    // Calculate stats
    const totalQuizzes = quizzes?.length || 0;
    const totalQuestions = quizzes?.reduce((total, quiz) => {
      return total + (quiz.questions?.length || 0);
    }, 0);
    const estimatedTime = Math.round(totalQuestions * 1.5); // 1.5phút mỗi câu hỏi

    return {
      totalQuizzes,
      totalQuestions,
      estimatedTime,
      quizzes: quizzes || [],
    };
  } catch (error) {
    console.error('Error fetching topic quizzes stats:', error);
    throw error;
  }
}

// Exam files API
export const examFilesApi = {
  // Upload a file to storage and save metadata
  upload: async (params: {
    file: File;
    title: string;
    topicId?: number | null;
  }): Promise<ExamFileMeta> => {
    const { file, title, topicId = null } = params;

    const ext = file.name.split('.').pop()?.toLowerCase() || 'bin';
    const safeName = `${Date.now()}_${file.name.replace(
      /[^a-zA-Z0-9_.-]/g,
      '_'
    )}`;
    const path = `${new Date().getFullYear()}/${safeName}`;

    // 1) Upload to storage bucket 'exam-papers'
    const { data: storageUpload, error: storageError } = await supabase.storage
      .from('exam-papers')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (storageError) throw storageError;

    // 2) Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('exam-papers').getPublicUrl(path);

    // 3) Save DB row
    const { data, error } = await supabase
      .from('exam_files')
      .insert({
        title,
        file_name: file.name,
        file_path: storageUpload?.path || path,
        file_type: file.type || `application/${ext}`,
        file_size: file.size,
        public_url: publicUrl,
        topic_id: topicId,
      })
      .select('*')
      .single();

    if (error) throw error;
    return data as ExamFileMeta;
  },

  // List files (optionally filter by topic)
  list: async (params?: { topicId?: number | null }) => {
    let query = supabase
      .from('exam_files')
      .select('*')
      .order('created_at', { ascending: false });

    if (params?.topicId) {
      query = query.eq('topic_id', params.topicId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as ExamFileMeta[];
  },

  // Delete a file (storage + DB)
  delete: async (id: number) => {
    const { data, error } = await supabase
      .from('exam_files')
      .select('file_path')
      .eq('id', id)
      .single();
    if (error) throw error;

    const filePath = (data as { file_path: string }).file_path;
    // delete from storage
    await supabase.storage.from('exam-papers').remove([filePath]);
    // delete row
    const { error: delError } = await supabase
      .from('exam_files')
      .delete()
      .eq('id', id);
    if (delError) throw delError;
  },
};
