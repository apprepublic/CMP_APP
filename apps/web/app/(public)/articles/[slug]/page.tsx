import { supabase } from '@/lib/supabase';
import { getArticleBySlug } from '@/lib/queries';
import ArticleReader from '@/components/tasks/ArticleReader';
import type { Metadata } from 'next';

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return { title: 'Article Not Found — CMPapp' };
  }

  return {
    title: `${article.title} — CMPapp`,
    description: article.excerpt || `Read ${article.title} on CMPapp`,
    keywords: article.tags ?? undefined,
    authors: article.author ? [{ name: article.author.display_name }] : undefined,
    alternates: {
      canonical: `/articles/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt || `Read ${article.title} on CMPapp`,
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: article.author ? [article.author.display_name] : undefined,
      images: article.cover_image_url ? [{ url: article.cover_image_url }] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const article = await getArticleBySlug(slug);

  const jsonLd = article ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image_url,
    datePublished: article.published_at || article.created_at,
    dateModified: article.published_at || article.created_at,
    author: article.author
      ? { '@type': 'Person', name: article.author.display_name }
      : { '@type': 'Organization', name: 'CMPapp' },
    publisher: {
      '@type': 'Organization',
      name: 'CMPapp',
      logo: { '@type': 'ImageObject', url: 'https://cmpapp.ng/logo.png' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://cmpapp.ng/articles/${slug}`,
    },
  } : null;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://cmpapp.ng/' },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: 'https://cmpapp.ng/articles' },
      ...(article
        ? [{ '@type': 'ListItem', position: 3, name: article.title, item: `https://cmpapp.ng/articles/${slug}` }]
        : []),
    ],
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticleReader slug={slug} />
    </>
  );
}
