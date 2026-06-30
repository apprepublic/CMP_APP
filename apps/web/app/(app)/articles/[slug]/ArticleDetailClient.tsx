'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useArticle, useClaimArticle } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';

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

function renderArticleContent(content: string) {
  const paragraphs = content.split('\n\n');
  return paragraphs.map((paragraph: string, index: number) => {
    const imgMatch = paragraph.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const [, alt, src] = imgMatch;
      return (
        <div key={`img-${index}`} className="my-8">
          <img src={src} alt={alt || 'Article image'} className="w-full max-w-3xl mx-auto rounded-xl object-cover shadow-md" />
          {alt && <p className="text-center text-on-surface-variant text-sm mt-2 font-body-sm">{alt}</p>}
        </div>
      );
    }
    const htmlImgMatch = paragraph.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (htmlImgMatch) {
      const src = htmlImgMatch[1];
      return (
        <div key={`img-${index}`} className="my-8">
          <img src={src} alt="Article image" className="w-full max-w-3xl mx-auto rounded-xl object-cover shadow-md" />
        </div>
      );
    }
    return (
      <p key={index} className="font-body-lg text-body-lg text-on-surface mb-6 leading-relaxed">{paragraph}</p>
    );
  });
}

export default function ArticleDetailClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { data: article, isLoading } = useArticle(slug);
  const claimArticle = useClaimArticle();

  const [readingProgress, setReadingProgress] = useState(0);
  const [claimed, setClaimed] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAdGate, setShowAdGate] = useState(false);
  const [adGateDone, setAdGateDone] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const unlocked = readingProgress >= 95;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setIsAuthenticated(!!user));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      setReadingProgress(Math.min((window.scrollY / scrollableHeight) * 100, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (unlocked && !adGateDone && !claimed) {
      setShowAdGate(true);
    }
  }, [unlocked, adGateDone, claimed]);

  useEffect(() => {
    if (!showAdGate || adGateDone) return;
    if (adTimer > 0) {
      const t = setTimeout(() => setAdTimer(p => p - 1), 1000);
      return () => clearTimeout(t);
    } else {
      setAdGateDone(true);
      setShowAdGate(false);
    }
  }, [showAdGate, adGateDone, adTimer]);

  const handleClaim = useCallback(async () => {
    if (!article || claimed || claiming || !isAuthenticated) return;
    setClaiming(true);
    setClaimError(null);
    try {
      await claimArticle.mutateAsync({ articleId: article.id });
      setClaimed(true);
      setShowSuccessModal(true);
      createConfetti();
    } catch (err: any) {
      setClaimError(err.message || 'Failed to claim coins');
      setTimeout(() => setClaimError(null), 4000);
    } finally {
      setClaiming(false);
    }
  }, [article, claimed, claiming, isAuthenticated, claimArticle]);

  const coinReward: number = (article as any)?.coin_reward ?? 50;

  const circumference = 126;
  const strokeOffset = circumference - (readingProgress / 100) * circumference;

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
          <Link href="/articles" className="text-secondary font-body-md hover:underline">Back to Articles</Link>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* ── STICKY HEADER with progress bar ─────────────── */}
      <header className="fixed top-0 left-0 w-full z-50 shadow-md h-20 flex items-center px-6 lg:px-margin-desktop" style={{ backdropFilter: 'blur(12px)', background: 'rgba(13, 27, 53, 0.95)' }}>
        <div className="flex items-center gap-4 w-full max-w-6xl mx-auto">
          <Link href="/articles" className="text-white hover:text-[#ffdea6] transition-colors flex-shrink-0">
            <span className="material-symbols-outlined text-[28px]">arrow_back</span>
          </Link>
          <div className="flex-1 mx-4 flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7784a3]">Reading Progress</span>
              <span className="font-data-md text-data-md text-[#ffdea6]">{Math.round(readingProgress)}%</span>
            </div>
            <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${readingProgress}%`, background: '#ffdea6', boxShadow: '0 0 8px rgba(253,195,77,0.5)' }} />
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-[#7b5800] rounded-lg bg-white/5 flex-shrink-0">
            <span className="material-symbols-outlined text-[#7b5800] text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            <span className="font-data-md text-data-md text-[#ffdea6]">{coinReward} CMP</span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <main className="pt-24 pb-32 max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop w-full">
        <article className="bg-surface-alt rounded-2xl p-6 md:p-10 border border-outline-variant/30 shadow-sm mt-6">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-secondary-container text-on-secondary-container font-label-caps text-label-caps rounded-full">{article.category}</span>
              <span className="flex items-center gap-1 text-on-surface-variant font-body-sm text-body-sm">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                {article.read_time_minutes} min read
              </span>
            </div>
            <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-background mb-4">{article.title}</h1>
            {article.excerpt && <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">{article.excerpt}</p>}
            <div className="flex items-center gap-4 text-on-surface-variant font-body-sm text-body-sm">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">person</span>
                {article.author?.display_name || 'Admin'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </header>

          {article.cover_image_url && (
            <div className="mb-8 rounded-2xl overflow-hidden">
              <img src={article.cover_image_url} alt={article.title} className="w-full aspect-video object-cover" />
            </div>
          )}

          <div className="max-w-none">{renderArticleContent(article.content)}</div>

          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-outline-variant/20">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-surface-container-high text-on-surface-variant font-body-sm text-body-sm rounded-full">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── REWARD CLAIM SECTION ──────────────────────── */}
          <div className={`mt-10 p-6 md:p-8 rounded-2xl text-center border-2 transition-all duration-700 ${unlocked ? 'border-[#fdc34d] shadow-[0_0_40px_rgba(253,195,77,0.2)]' : 'border-outline-variant'}`} style={{ background: '#F0EDE8' }}>
            {unlocked && <div className="absolute inset-0 coin-shimmer opacity-30 pointer-events-none" />}
            {unlocked && <div className="absolute top-3 right-4 bg-secondary-container text-on-secondary-container px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Completed ✓</div>}

            <div className="relative z-10">
              <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-secondary-container rounded-full mb-4 ${unlocked ? 'glow-gold' : 'opacity-50'}`}>
                <span className="material-symbols-outlined text-on-secondary-container text-3xl md:text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </div>
              <h3 className="font-h2 text-h2 text-primary mb-2">Knowledge is Profitable</h3>
              <p className="font-body-lg text-on-surface-variant mb-6 max-w-md mx-auto">
                {claimed ? 'Coins have been added to your wallet. Keep learning to earn more!' : unlocked ? "You've completed the article. Claim your reward." : 'Keep reading to unlock your coin reward.'}
              </p>

              {claimError && (
                <div className="mb-4 px-4 py-2 bg-error-container text-error rounded-lg text-sm font-body-sm max-w-sm mx-auto">{claimError}</div>
              )}

              <button onClick={() => { if (!isAuthenticated) { router.push(`/login?redirect=/articles/${slug}`); return; } handleClaim(); }}
                disabled={!unlocked || !adGateDone || claimed || claiming}
                className={`group relative px-8 py-4 rounded-xl font-h3 text-h3 transition-all duration-300 active:scale-95 shadow-xl overflow-hidden ${claimed ? 'bg-[#2E7D32] text-white cursor-default' : unlocked && adGateDone && !claiming ? 'bg-secondary hover:bg-on-secondary-fixed-variant text-on-primary cursor-pointer' : 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-60'}`}
              >
                <span className="relative z-10">
                  {claimed ? `✓ Claimed ${coinReward} CMP Coins` : claiming ? 'Claiming...' : unlocked && adGateDone ? `Claim Your ${coinReward} CMP Coins` : unlocked && !adGateDone ? 'Ad loading...' : `Read ${Math.round(100 - readingProgress)}% more to unlock`}
                </span>
              </button>
            </div>
          </div>
        </article>
      </main>

      {/* ── FLOATING EARNINGS WIDGET ────────────────────── */}
      <div className="fixed bottom-24 right-6 lg:bottom-12 lg:right-10 z-40 earnings-float">
        <div className="bg-primary-container text-on-primary p-4 rounded-xl shadow-xl flex items-center gap-4 transition-all hover:scale-105" style={{ border: `1.5px solid rgba(123,88,0,${unlocked ? '1' : '0.3'})` }}
          onClick={unlocked && adGateDone && !claimed ? handleClaim : undefined}
          title={claimed ? 'Reward claimed' : unlocked && adGateDone ? 'Click to claim' : unlocked ? 'Ad loading...' : 'Keep reading to unlock'}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="24" cy="24" fill="transparent" r="20" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle cx="24" cy="24" fill="transparent" r="20" stroke="#fdc34d" strokeDasharray="126" strokeDashoffset={strokeOffset} strokeWidth="4" style={{ transition: 'stroke-dashoffset 0.3s ease-out' }} />
            </svg>
            <span className={`material-symbols-outlined text-[18px] transition-colors ${unlocked && adGateDone ? 'text-[#2E7D32]' : 'text-[#ffdea6]'}`} style={{ fontVariationSettings: unlocked && adGateDone ? "'FILL' 1" : "'FILL' 0" }}>
              {claimed ? 'check_circle' : unlocked && adGateDone ? 'lock_open' : unlocked && !adGateDone ? 'hourglass_top' : 'lock'}
            </span>
          </div>
          <div>
            <div className="font-label-caps text-[10px] text-on-primary-container uppercase tracking-wider">{claimed ? 'Earned' : 'Reward'}</div>
            <div className="font-data-lg text-[#ffdea6] flex items-center gap-1">{coinReward} <span className="text-sm font-label-caps">CMP</span></div>
          </div>
        </div>
      </div>

      {/* ── AD-GATE OVERLAY ─────────────────────────────── */}
      {showAdGate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0" style={{ background: 'rgba(13,27,53,0.85)', backdropFilter: 'blur(20px)' }} />
          <div className="relative bg-[#0D1B35] border border-[#fdc34d]/20 rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#fdc34d] text-2xl">ads_click</span>
              <span className="text-[#fdc34d] font-bold uppercase text-sm tracking-widest">Ad Supported Content</span>
            </div>
            {adGateDone ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#2E7D32]/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[#2E7D32]" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Content Unlocked!</h3>
                <p className="text-white/60 text-sm mb-8">Your reward is ready. Click below to claim your coins.</p>
                <button onClick={() => setShowAdGate(false)} className="w-full bg-[#fdc34d] text-[#0D1B35] py-4 rounded-xl font-bold text-lg hover:bg-[#e6b138] transition-colors active:scale-[0.98]">Continue to Claim</button>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#fdc34d]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-[#fdc34d]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                </div>
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="48" cy="48" r="42" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                    <circle cx="48" cy="48" r="42" fill="transparent" stroke="#fdc34d" strokeWidth="6" strokeLinecap="round" strokeDasharray="264" strokeDashoffset={264 - (264 * (5 - adTimer) / 5)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-[#fdc34d]">{adTimer}</span>
                </div>
                <p className="text-white/60 text-sm mb-6">Please wait while we prepare your reward...</p>
                <div className="p-4 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#fdc34d]/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#fdc34d] text-lg">spa</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white/80 text-sm font-semibold">Supported by CMP Community</p>
                      <p className="text-white/40 text-xs">Empowering creative minds</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-[#fdc34d]">
                  <span className="material-symbols-outlined text-base">lock</span>
                  <span>Unlocking in {adTimer}s...</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ───────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0" style={{ background: 'rgba(13,27,53,0.85)', backdropFilter: 'blur(12px)' }} />
          <div className="relative bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'linear-gradient(135deg, #B8860B, #FDC34D)' }}>
              <span className="text-white material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            </div>
            <h2 className="font-h1 text-h2 text-primary mb-2">{coinReward} CMP Coins Added!</h2>
            <p className="font-body-md text-on-surface-variant mb-6">Coins credited to your creative wallet. Keep learning to earn more!</p>
            <div className="bg-secondary-container/20 rounded-xl p-5 mb-8 text-left">
              <div className="flex items-center justify-between mb-3">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Streak Progress</span>
                <span className="font-data-md text-data-md text-secondary">Day 4/7</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(184,134,11,0.15)' }}>
                <div className="h-full rounded-full" style={{ width: '57%', background: 'linear-gradient(90deg, #B8860B, #FDC34D)' }} />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">Level up your creative journey</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={() => router.push('/tasks')} className="w-full bg-primary text-on-primary py-4 rounded-xl font-h3 text-h3 hover:opacity-90 transition-opacity active:scale-[0.98]">Next Task</button>
              <button onClick={() => router.push('/tasks')} className="w-full border-2 border-secondary text-secondary py-4 rounded-xl font-h3 text-h3 hover:bg-secondary/5 transition-colors active:scale-[0.98]">Back to Earn Hub</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
