'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ArticleReader from '@/components/tasks/ArticleReader';

function ArticleContent() {
  const searchParams = useSearchParams();
  const slug = searchParams?.get('slug');

  if (!slug) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">article</span>
          <p className="font-h3 text-h3 text-primary mb-2">No article specified</p>
          <a href="/tasks" className="text-secondary underline font-body-md">Back to Earn Hub</a>
        </div>
      </div>
    );
  }

  return <ArticleReader slug={slug} />;
}

export default function TasksArticlePage() {
  return (
    <Suspense fallback={
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-secondary border-t-transparent" />
      </div>
    }>
      <ArticleContent />
    </Suspense>
  );
}
