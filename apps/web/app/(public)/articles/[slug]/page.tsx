import { supabase } from '@/lib/supabase';
import ArticleReader from '@/components/tasks/ArticleReader';

export async function generateStaticParams() {
  try {
    const { data: articles } = await (supabase as any)
      .from('articles')
      .select('slug')
      .eq('is_published', true);
    if (articles && articles.length > 0) return articles.map((a: { slug: string }) => ({ slug: a.slug }));
  } catch {}
  return [{ slug: 'placeholder' }];
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  return <ArticleReader slug={slug} />;
}
