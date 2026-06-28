'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useArticle, useClaimArticle } from '@/lib/hooks';

function createConfetti() {
  for (let i = 0; i < 60; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '100vh';
    confetti.style.backgroundColor = i % 2 === 0 ? '#B8860B' : '#FDC34D';
    confetti.style.animation = `float-up ${1.5 + Math.random() * 2}s linear forwards`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

export default function ArticleReaderClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: resp, isLoading } = useArticle(slug);
  const article = resp?.article;
  const claimArticle = useClaimArticle();

  const [readingProgress, setReadingProgress] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const unlocked = readingProgress >= 95;

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;
      setReadingProgress(Math.min(scrolledPercentage, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClaim = useCallback(async () => {
    if (!article || claimed || claiming) return;
    setClaiming(true);
    setClaimError(null);
    try {
      await claimArticle.mutateAsync({ articleId: article.id });
      setClaimed(true);
      setShowSuccessModal(true);
      createConfetti();
    } catch (err: any) {
      const msg = err.message || 'Failed to claim coins';
      setClaimError(msg);
      setTimeout(() => setClaimError(null), 4000);
    } finally {
      setClaiming(false);
    }
  }, [article, claimed, claiming, claimArticle]);

  const coinReward: number = (article as any)?.coin_reward ?? (article as any)?.coinReward ?? 50;

  // Circular progress for floating widget (circumference = 2*pi*20 ≈ 126)
  const circumference = 126;
  const strokeOffset = circumference - (readingProgress / 100) * circumference;

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <header className="fixed top-0 left-0 w-full z-50 h-20 bg-primary shadow-md flex items-center px-6">
          <div className="h-6 w-32 bg-primary-fixed-dim/20 rounded animate-pulse" />
        </header>
        <main className="pt-20 max-w-4xl mx-auto px-6 py-12 space-y-6">
          <div className="h-10 w-3/4 bg-surface-container rounded-lg animate-pulse" />
          <div className="h-64 w-full bg-surface-container rounded-xl animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-surface-container rounded animate-pulse" style={{ width: `${80 + Math.random() * 20}%` }} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="text-center p-10">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4 block">article</span>
          <p className="font-h3 text-h3 text-primary mb-2">Article Not Found</p>
          <Link href="/articles" className="text-secondary underline font-body-md">Browse Articles</Link>
        </div>
      </div>
    );
  }

  const paragraphs = article.content?.split('\n\n') ?? [];

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">

      {/* ── STICKY HEADER with progress bar ─────────────── */}
      <header
        className="fixed top-0 w-full z-50 shadow-md h-20 flex justify-between items-center px-6 lg:px-[40px]"
        style={{ backdropFilter: 'blur(12px)', background: 'rgba(13, 27, 53, 0.95)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-white hover:text-[#ffdea6] transition-colors"
            title="Go Back"
          >
            <span className="material-symbols-outlined text-[32px]">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <span className="font-h3 text-[20px] font-bold text-white">CMPapp</span>
            <span className="text-[10px] text-[#fdc34d] tracking-widest uppercase font-bold">
              {article.category || 'Article'}
            </span>
          </div>
        </div>

        {/* Desktop progress tracker */}
        <div className="hidden md:flex flex-1 mx-12 flex-col gap-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7784a3]">Reading Progress</span>
            <span className="font-data-md text-data-md text-[#ffdea6]">{Math.round(readingProgress)}%</span>
          </div>
          <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${readingProgress}%`,
                background: '#ffdea6',
                boxShadow: '0 0 8px rgba(253,195,77,0.5)',
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 border border-[#7b5800] rounded-lg bg-white/5">
            <span className="material-symbols-outlined text-[#7b5800] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-[#ffdea6]">{coinReward} CMP</span>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] md:hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ width: `${readingProgress}%`, background: '#ffdea6' }}
          />
        </div>
      </header>

      {/* ── MAIN ARTICLE CONTENT ────────────────────────── */}
      <main className="pt-20 pb-48 max-w-4xl mx-auto px-6 lg:px-0">

        {/* Hero */}
        <section className="mt-12 mb-16">
          <div className="mb-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-secondary text-on-secondary px-3 py-1 rounded-lg font-label-caps text-[10px]">
                {article.category?.toUpperCase() || 'ARTICLE'}
              </span>
              <span className="text-on-surface-variant font-body-sm">• {article.readTimeMinutes ?? article.read_time_minutes ?? '5'} Min Read</span>
            </div>
            <h1 className="font-h1 text-h1-mobile md:text-h1 text-primary leading-tight">{article.title}</h1>
            {article.excerpt && (
              <p className="font-body-lg text-body-lg text-on-surface-variant">{article.excerpt}</p>
            )}
          </div>

          {(article as any).coverImageUrl || (article as any).cover_image_url ? (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={(article as any).coverImageUrl || (article as any).cover_image_url}
                alt={article.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : null}
        </section>

        {/* Article body */}
        <article className="max-w-3xl mx-auto space-y-6">
          {paragraphs.map((p: string, i: number) => (
            <p
              key={i}
              className={`font-body-lg text-body-lg text-on-surface leading-relaxed ${i === 0 ? 'drop-cap' : ''}`}
            >
              {p}
            </p>
          ))}

          {/* Reward Claim Section — shown always, glows when unlocked */}
          <div
            className={`mt-20 relative p-8 md:p-12 rounded-2xl overflow-hidden text-center border-2 transition-all duration-700 ${
              unlocked
                ? 'border-[#fdc34d] shadow-[0_0_40px_rgba(253,195,77,0.2)]'
                : 'border-outline-variant'
            }`}
            style={{ background: '#F0EDE8' }}
          >
            {/* Shimmer overlay */}
            {unlocked && (
              <div className="absolute inset-0 coin-shimmer opacity-30 pointer-events-none" />
            )}

            {/* Completed badge */}
            {unlocked && (
              <div
                className="absolute top-3 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
              >
                Completed ✓
              </div>
            )}

            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-20 h-20 bg-secondary-container rounded-full mb-6 ${unlocked ? 'glow-gold' : 'opacity-50'}`}>
                <span
                  className="material-symbols-outlined text-on-secondary-container text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >monetization_on</span>
              </div>

              <h3 className="font-h2 text-h2 text-primary mb-2">Knowledge is Profitable</h3>
              <p className="font-body-lg text-on-surface-variant mb-8 max-w-md mx-auto">
                {claimed
                  ? 'Coins have been added to your wallet. Keep learning to earn more!'
                  : unlocked
                    ? "You've successfully completed the article. Claim your reward below."
                    : 'Keep reading to unlock your coin reward at the end of the article.'}
              </p>

              {claimError && (
                <div className="mb-4 px-4 py-2 bg-error-container text-error rounded-lg text-sm font-body-sm max-w-sm mx-auto">
                  {claimError}
                </div>
              )}

              <button
                onClick={handleClaim}
                disabled={!unlocked || claimed || claiming}
                className={`group relative px-10 py-5 rounded-xl font-h3 text-h3 transition-all duration-300 active:scale-95 shadow-xl overflow-hidden ${
                  claimed
                    ? 'bg-[#2E7D32] text-white cursor-default'
                    : unlocked && !claiming
                      ? 'bg-secondary hover:bg-on-secondary-fixed-variant text-on-primary cursor-pointer'
                      : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-60'
                }`}
              >
                <span className="relative z-10">
                  {claimed
                    ? `✓ Claimed ${coinReward} CMP Coins`
                    : claiming
                      ? 'Claiming...'
                      : unlocked
                        ? `Claim Your ${coinReward} CMP Coins`
                        : `Read ${Math.round(100 - readingProgress)}% more to unlock`}
                </span>
                {unlocked && !claimed && !claiming && (
                  <>
                    <div className="absolute inset-0 bg-secondary-container scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-xl opacity-20" />
                    <span className="absolute right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all material-symbols-outlined">celebration</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </article>
      </main>

      {/* ── FLOATING EARNINGS WIDGET ────────────────────── */}
      <div className="fixed bottom-24 right-6 lg:bottom-12 lg:right-10 z-40 earnings-float">
        <div
          className="bg-primary-container text-on-primary p-4 rounded-xl shadow-xl flex items-center gap-4 cursor-pointer transition-all hover:scale-105"
          style={{ border: `1.5px solid rgba(123,88,0,${unlocked ? '1' : '0.3'})` }}
          onClick={unlocked && !claimed ? handleClaim : undefined}
          title={unlocked ? 'Click to claim your reward' : 'Keep reading to unlock'}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="24" cy="24" fill="transparent" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="24" cy="24" fill="transparent" r="20"
                stroke="#fdc34d"
                strokeDasharray="126"
                strokeDashoffset={strokeOffset}
                strokeWidth="4"
                style={{ transition: 'stroke-dashoffset 0.3s ease-out' }}
              />
            </svg>
            <span
              className={`material-symbols-outlined text-[18px] transition-colors ${unlocked ? 'text-[#2E7D32]' : 'text-[#ffdea6]'}`}
              style={{ fontVariationSettings: unlocked ? "'FILL' 1" : "'FILL' 0" }}
            >
              {unlocked ? 'lock_open' : 'lock'}
            </span>
          </div>
          <div>
            <div className="font-label-caps text-[10px] text-on-primary-container uppercase tracking-wider">
              {claimed ? 'Earned' : 'Reward'}
            </div>
            <div className="font-data-lg text-[#ffdea6] flex items-center gap-1">
              {coinReward} <span className="text-sm font-label-caps">CMP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SUCCESS MODAL ───────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(13,27,53,0.85)', backdropFilter: 'blur(12px)' }}
            onClick={() => setShowSuccessModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: '#2E7D32' }}>
              <span className="text-white material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h2 className="font-h1 text-h2 text-primary mb-4">Claimed!</h2>
            <div className="inline-flex items-center gap-2 border-[1.5px] border-secondary px-6 py-3 rounded-full mb-8">
              <span
                className="material-symbols-outlined text-secondary text-3xl"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >monetization_on</span>
              <span className="font-data-lg text-data-lg text-secondary">{coinReward}.00</span>
            </div>
            <p className="font-body-md text-on-surface-variant mb-8">
              Your CMP Coins have been added to your creative wallet. Keep learning to earn more!
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-h3 text-h3 hover:opacity-90 transition-opacity"
            >
              Continue Reading
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
