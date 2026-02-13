import { createClient } from '@supabase/supabase-js';

// Kiểm tra môi trường
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Tạo Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions cho database
export type Database = {
  public: {
    Tables: {
      topics: {
        Row: {
          id: number;
          title: string;
          description: string;
          lessons_count: number;
          quizzes_count: number;
          keywords_count: number;
          color: string;
          background_image_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['topics']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['topics']['Insert']>;
      };
      lessons: {
        Row: {
          id: number;
          topic_id: number;
          title: string;
          content: string;
          duration: string;
          summary_diagram_url: string | null;
          powerpoint_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['lessons']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>;
      };
      quizzes: {
        Row: {
          id: number;
          topic_id: number;
          lesson_id: number | null;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['quizzes']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['quizzes']['Insert']>;
      };
      questions: {
        Row: {
          id: number;
          quiz_id: number;
          question: string;
          options: string[];
          correct_answer: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['questions']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['questions']['Insert']>;
      };
      keywords: {
        Row: {
          id: number;
          topic_id: number;
          term: string;
          definition: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['keywords']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<Database['public']['Tables']['keywords']['Insert']>;
      };
    };
  };
};

// Helper functions để kiểm tra kết nối
export async function testConnection() {
  try {
    const { data, error } = await supabase.from('topics').select('count');
    if (error) throw error;
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

// Helper function để xử lý lỗi
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
}

// Helper function để format date
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
