'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useArticle, useClaimArticle } from '@/lib/hooks';
import { useWallet } from '@/lib/useWallet';
import { supabase } from '@/lib/supabase';

export default function ArticleDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: articleData, isLoading } = useArticle(slug);
  const article = (articleData as any)?.article;
  const claimArticle = useClaimArticle();
  const { wallet } = useWallet();
  const [hasClaimed, setHasClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  const handleClaim = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/articles/${slug}`);
      return;
    }

    setIsClaiming(true);
    try {
      await claimArticle.mutateAsync({ articleId: article!.id });
      setHasClaimed(true);
    } catch (error) {
      console.error('Failed to claim article:', error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-variant rounded w-3/4"></div>
          <div className="h-4 bg-surface-variant rounded w-1/4"></div>
          <div className="aspect-video bg-surface-variant rounded-2xl"></div>
          <div className="space-y-3">
            <div className="h-4 bg-surface-variant rounded"></div>
            <div className="h-4 bg-surface-variant rounded"></div>
            <div className="h-4 bg-surface-variant rounded w-5/6"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-12 w-full">
        <div className="text-center py-16 bg-surface-alt rounded-2xl border border-outline-variant/30">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">article</span>
          <h4 className="font-h3 text-h3 text-on-surface mb-2">Article Not Found</h4>
          <Link href="/articles" className="text-secondary font-body-md hover:underline">
            Back to Articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-8 w-full pb-24">
      <Link href="/articles" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary mb-6">
        <span className="material-symbols-outlined">arrow_back</span>
        <span className="font-body-md text-body-md">Back to Articles</span>
      </Link>

      <article className="bg-surface-alt rounded-2xl p-6 md:p-10 border border-outline-variant/30 shadow-sm">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-full">
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {article.read_time_minutes} min read
            </span>
          </div>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-background mb-4">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
              {article.excerpt}
            </p>
          )}
          <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">person</span>
              {article.author?.display_name || 'Admin'}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </header>

        {article.cover_image_url && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={article.cover_image_url} 
              alt={article.title}
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none prose-headings:text-on-background prose-p:text-on-surface prose-a:text-secondary prose-strong:text-on-background">
          {article.content.split('\n\n').map((paragraph: string, index: number) => (
            <p key={index} className="font-body-lg text-body-lg text-on-surface mb-6 leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-outline-variant/20">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 p-6 bg-[#B8860B]/10 border border-[#B8860B]/30 rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#B8860B] flex items-center justify-center">
                <span className="material-symbols-outlined text-[32px] text-primary">account_balance_wallet</span>
              </div>
              <div>
                <p className="font-h3 text-h3 text-on-background">Earn {article.coin_reward} Coins</p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Read this article and claim your reward
                </p>
              </div>
            </div>
            <button
              onClick={handleClaim}
              disabled={hasClaimed || isClaiming}
              className={`px-6 py-3 rounded-xl font-body-md text-body-md transition-all ${
                hasClaimed
                  ? 'bg-success-verified text-white cursor-default'
                  : isClaiming
                  ? 'bg-[#B8860B]/50 text-primary cursor-wait'
                  : 'bg-[#B8860B] text-primary hover:bg-[#8B6914]'
              }`}
            >
              {hasClaimed ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">check_circle</span>
                  Claimed
                </span>
              ) : isClaiming ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                  Claiming...
                </span>
              ) : (
                'Claim Now'
              )}
            </button>
          </div>
        </div>
      </article>
    </main>
  );
}
