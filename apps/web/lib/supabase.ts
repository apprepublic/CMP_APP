import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

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
