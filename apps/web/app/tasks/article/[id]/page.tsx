export const dynamicParams = true;

import ArticleReaderClient from './ArticleReaderClient';

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }];
}

export default function ArticleReaderPage() {
  return <ArticleReaderClient />;
}
