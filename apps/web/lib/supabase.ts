import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper type for Supabase query results
export type SupabaseQueryResult<T> = {
  data: T[] | null;
  error: Error | null;
  count: number | null;
};

// Real-time subscription helper
export function subscribeToChannel<T>(
  channelName: string,
  table: string,
  callback: (payload: T) => void
) {
  return supabase
    .channel(channelName)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
      },
      (payload) => callback(payload.new as T)
    )
    .subscribe();
}