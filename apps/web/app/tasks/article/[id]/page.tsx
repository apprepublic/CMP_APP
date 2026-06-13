export const dynamicParams = true;

import ArticleReaderClient from './ArticleReaderClient';

export async function generateStaticParams() {
  return [{ id: 'beginners-guide-earning-coins-online' }];
}

export default function ArticleReaderPage({ params }: { params: Promise<{ id: string }> }) {
  return <ArticleReaderClient slug={(await params).id} />;
}
