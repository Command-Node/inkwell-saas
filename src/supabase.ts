import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://fhnlcotdnrajmslfomue.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZobmxjb3RkbnJham1zbGZvbXVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNjQ4NzYsImV4cCI6MjA2OTc0MDg3Nn0.IfbdGR9IyK2IM0r5a-DqGfoFAGd4Sn0nd7tkiYRS14E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript interfaces for our data
export interface User {
  id: string;
  email: string;
  subscription_plan: string;
  subscription_status: string;
  usage_books: number;
  usage_revisions: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  status: string;
  writing_style?: string;
  file_url?: string;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  plan_id: string;
  status: string;
  created_at: string;
  updated_at: string;
} 