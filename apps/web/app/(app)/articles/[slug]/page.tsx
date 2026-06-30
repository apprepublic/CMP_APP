import { supabase } from '@/lib/supabase';
import ArticleDetailClient from './ArticleDetailClient';

export async function generateStaticParams() {
  const { data: articles } = await (supabase as any)
    .from('articles')
    .select('slug')
    .eq('is_published', true);
  return (articles || []).map((a: { slug: string }) => ({ slug: a.slug }));
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailClient slug={slug} />;
}
