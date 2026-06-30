import { supabase } from '@/lib/supabase';
import ArtistProfileClient from './ArtistProfileClient';

export async function generateStaticParams() {
  const { data: tasks } = await (supabase as any)
    .from('user_posted_tasks')
    .select('creator_id')
    .eq('type', 'STREAM_MUSIC')
    .eq('is_active', true);
  const ids = [...new Set((tasks || []).map((t: any) => t.creator_id))];
  return ids.map((id: string) => ({ artist: `user-${id}` }));
}

export default function ArtistPage({ params }: { params: { artist: string } }) {
  const { artist } = params;
  return <ArtistProfileClient slug={artist} />;
}
