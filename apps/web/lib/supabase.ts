import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type SupabaseQueryResult<T> = {
  data: T[] | null;
  error: Error | null;
  count: number | null;
};

export function subscribeToChannel<T>(
  channelName: string,
  table: string,
  callback: (payload: T) => void
) {
  return supabase
    .channel(channelName)
    .on(
      'postgres_changes' as any,
      {
        event: '*',
        schema: 'public',
        table,
      },
      (payload: any) => callback(payload?.new as T)
    )
    .subscribe();
}