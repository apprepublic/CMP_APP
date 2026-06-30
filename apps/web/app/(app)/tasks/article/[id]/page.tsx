import { supabase } from '@/lib/supabase';
import ArticleReader from '@/components/tasks/ArticleReader';

export async function generateStaticParams() {
  const { data: articles } = await (supabase as any)
    .from('articles')
    .select('slug')
    .eq('is_published', true);
  return (articles || []).map((a: { slug: string }) => ({ id: a.slug }));
}

export default function ArticleReaderPage({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ArticleReader slug={id} />;
}
