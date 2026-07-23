import { supabase } from '@/lib/supabase';
import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  try {
    const { data: tasks } = await (supabase as any)
      .from('user_posted_tasks')
      .select('creator_id')
      .eq('type', 'STREAM_MUSIC')
      .eq('is_active', true);
    const ids = [...new Set((tasks || []).map((t: any) => t.creator_id))] as string[];
    if (ids.length > 0) return ids.map((id: string) => ({ artist: `user-${id}` }));
  } catch {}
  return [{ artist: 'placeholder' }];
}

export default function ArtistPage({ params }: { params: { artist: string } }) {
  const { artist } = params;
  return <ArtistProfileClient slug={artist} />;
}
