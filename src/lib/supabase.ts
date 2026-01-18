import { createClient } from '@supabase/supabase-js';

// Supabase URL và API Key từ environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Tạo Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions cho database của bạn
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string | null;
          role: 'admin' | 'moderator' | 'user';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username?: string | null;
          role?: 'admin' | 'moderator' | 'user';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string | null;
          role?: 'admin' | 'moderator' | 'user';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
