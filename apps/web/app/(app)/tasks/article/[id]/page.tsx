import { supabase } from '@/lib/supabase';
import ArticleReaderClient from './ArticleReaderClient';

export async function generateStaticParams() {
  const { data: articles } = await (supabase as any)
    .from('articles')
    .select('slug')
    .eq('is_published', true);
  return (articles || []).map((a: { slug: string }) => ({ id: a.slug }));
}

export default async function ArticleReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleReaderClient slug={id} />;
}
