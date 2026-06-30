import { supabase } from '@/lib/supabase';
import ArticleReader from '@/components/tasks/ArticleReader';

export async function generateStaticParams() {
  const { data: articles } = await (supabase as any)
    .from('articles')
    .select('slug')
    .eq('is_published', true);
  return (articles || []).map((a: { slug: string }) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <ArticleReader slug={slug} />;
}
