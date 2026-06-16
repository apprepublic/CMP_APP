export const dynamicParams = true;

import ArticleReaderClient from './ArticleReaderClient';

export async function generateStaticParams() {
  return [{ id: 'beginners-guide-earning-coins-online' }];
}

export default async function ArticleReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArticleReaderClient slug={id} />;
}
