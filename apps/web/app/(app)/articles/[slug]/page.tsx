export const dynamicParams = true;

import ArticleDetailClient from './ArticleDetailClient';

export async function generateStaticParams() {
  return [{ slug: 'placeholder' }];
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleDetailClient slug={slug} />;
}
