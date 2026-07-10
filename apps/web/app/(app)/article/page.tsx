'use client';

import { useSearchParams } from 'next/navigation';
import ArticleReader from '@/components/tasks/ArticleReader';

export default function ArticlePage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  if (!slug) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <p className="font-h3 text-h3 text-primary mb-2">No article specified</p>
          <a href="/articles" className="text-secondary underline font-body-md">Browse Articles</a>
        </div>
      </div>
    );
  }

  return <ArticleReader slug={slug} />;
}
