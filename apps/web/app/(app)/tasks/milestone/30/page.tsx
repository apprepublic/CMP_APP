'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useStreak } from '@/lib/hooks';

export default function Milestone30Page() {
  const [mounted, setMounted] = useState(false);
  const { data: streakResp, isLoading } = useStreak();
  const streak = streakResp?.streak;

  const currentStreak = streak?.currentStreak ?? 0;
  const hasReached30 = currentStreak >= 30;
  const progressTo30 = Math.min(100, Math.round((currentStreak / 30) * 100));
  const daysLeft = Math.max(0, 30 - currentStreak);

  const progressTo60 = Math.min(100, Math.round((currentStreak / 60) * 100));
  const daysLeftTo60 = Math.max(0, 60 - currentStreak);

  useEffect(() => {
    setMounted(true);

    if (!hasReached30) return;

    const container = document.getElementById('confetti-container');
    if (!container) return;

    const colors = ['#B8860B', '#fdc34d', '#ffffff', '#b9c6e8'];
    const elements: HTMLDivElement[] = [];

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.width = '10px';
      confetti.style.height = '30px';
      confetti.style.background = '#ffd300';
      confetti.style.top = '0';
      confetti.style.opacity = '0';

      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animation = `makeItRain ${2 + Math.random() * 2}s infinite ease-in-out ${Math.random() * 3}s`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

      if (Math.random() > 0.5) {
        confetti.style.borderRadius = '50%';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
      }

      container.appendChild(confetti);
      elements.push(confetti);
    }

    const timeout1 = setTimeout(() => {
      if (container) {
        container.style.opacity = '0';
        container.style.transition = 'opacity 2s ease';
      }
    }, 5000);

    const timeout2 = setTimeout(() => {
      elements.forEach(el => el.remove());
    }, 7000);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      elements.forEach(el => el.remove());
    };
  }, [hasReached30]);

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-64px)]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden bg-background min-h-screen flex flex-col relative overflow-x-hidden">
        {/* Confetti Container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-50" id="confetti-container">
          {mounted && (
            <style>{`
              @keyframes makeItRain {
                0% { opacity: 0; top: -10%; transform: rotate(0deg); }
                10% { opacity: 1; }
                50% { opacity: 1; transform: rotate(180deg); }
                100% { opacity: 0; top: 110%; transform: rotate(360deg); }
              }
              @keyframes pulse-glow {
                0%, 100% { box-shadow: 0 0 20px rgba(184,134,11,0.3); }
                50% { box-shadow: 0 0 40px rgba(184,134,11,0.6); }
              }
              @keyframes shimmer {
                0% { background-position: -200% center; }
                100% { background-position: 200% center; }
              }
            `}</style>
          )}
        </div>

        {/* Header */}
        <header className="fixed top-0 w-full z-40 bg-primary-container h-16 flex items-center px-margin-mobile shadow shadow-black/15">
          <button className="p-2 -ml-2 active:scale-95 transition-transform" onClick={() => window.history.back()}>
            <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
          </button>
          <h1 className="ml-4 font-headline-md text-headline-md-mobile text-on-primary-fixed">30-Day Milestone</h1>
        </header>

        <main className="flex-grow pt-20 pb-8 w-full">
          {/* Hero Section */}
          <div className="bg-primary-container py-16 px-margin-mobile text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-container to-primary-fixed-dim/20 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <div className={`w-28 h-28 rounded-full border-4 ${hasReached30 ? 'border-gold-metallic' : 'border-outline/30'} bg-primary-fixed flex items-center justify-center shadow-[0_0_40px_rgba(184,134,11,0.3)]`}
                style={hasReached30 ? { animation: 'pulse-glow 2s ease-in-out infinite' } : {}}>
                <span className={`material-symbols-outlined text-5xl ${hasReached30 ? 'text-gold-metallic' : 'text-outline/50'}`} style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <h1 className="font-headline-xl-mobile text-headline-xl-mobile text-on-primary">
                {hasReached30 ? '30 Days Unlocked!' : '30-Day Challenge'}
              </h1>
              <p className="font-body-md text-body-md text-on-primary-container max-w-[320px]">
                {hasReached30
                  ? "Incredible consistency. You've actively shaped the creative economy for a full month."
                  : `You're ${daysLeft} days away from unlocking this milestone. Keep your streak going!`}
              </p>
            </div>
          </div>

          <div className="px-margin-mobile -mt-8 relative z-20 space-y-stack-lg">
            {/* Reward Card */}
            <div className={`bg-white shadow-[12px_12px_24px_rgba(13,27,53,0.08),-12px_-12px_24px_#ffffff] rounded-xl p-stack-lg border-2 ${hasReached30 ? 'border-gold-metallic' : 'border-outline-variant/30'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${hasReached30 ? 'bg-gold-metallic/10 border-gold-metallic' : 'bg-surface-container-high border-outline-variant'} rounded-full flex items-center justify-center border shrink-0`}>
                  <span className={`material-symbols-outlined text-3xl ${hasReached30 ? 'text-gold-metallic' : 'text-outline'}`}>toll</span>
                </div>
                <div className="flex-1">
                  <p className="font-label-caps text-label-caps text-on-surface-muted mb-1 uppercase tracking-wider">Milestone Bonus</p>
                  <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">10,000 CMP Coins</h2>
                </div>
              </div>
              <div className="flex gap-3 mt-stack-lg">
                {hasReached30 ? (
                  <>
                    <button className="flex-1 bg-primary-container text-on-primary font-bold py-4 rounded-xl shadow-lg shadow-primary-container/20 hover:opacity-90 transition-all active:scale-95 font-headline-md text-headline-md">
                      Claim Reward
                    </button>
                    <button className="flex-1 bg-white border-2 border-primary-container text-primary-container font-bold py-4 rounded-xl hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2 font-headline-md text-headline-md">
                      <span className="material-symbols-outlined text-[18px]">share</span>
                      Share
                    </button>
                  </>
                ) : (
                  <Link href="/tasks/streak" className="flex-1 bg-primary-container text-on-primary font-bold py-4 rounded-xl shadow-lg text-center font-headline-md text-headline-md active:scale-95 transition-transform">
                    Back to Streak
                  </Link>
                )}
              </div>
            </div>

            {/* Streak Journey */}
            <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] rounded-xl p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-stack-lg">Your Streak Journey</h3>
              <div className="relative pt-6 pb-4">
                <div className="absolute top-1/2 left-4 right-4 h-2 bg-surface-container-high rounded-full -translate-y-1/2" />
                <div className="absolute top-1/2 left-4 h-2 bg-gradient-to-r from-gold-metallic to-gold-light rounded-full -translate-y-1/2 transition-all" style={{ width: `${progressTo30}%` }} />
                <div className="flex justify-between relative z-10">
                  {[1, 10, 20, 30].map((day) => {
                    const reached = currentStreak >= day;
                    const isCurrent = day === 30;
                    return (
                      <div key={day} className="flex flex-col items-center gap-2">
                        {isCurrent && reached ? (
                          <div className="w-8 h-8 rounded-full bg-primary border-4 border-gold-metallic shadow-md flex items-center justify-center -mt-1">
                            <span className="material-symbols-outlined text-[14px] text-gold-metallic">check</span>
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-full ${reached ? 'bg-gold-metallic' : 'bg-surface-container-high'} border-4 border-white shadow-sm`} />
                        )}
                        <span className={`font-data-md text-data-md ${isCurrent && reached ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>
                          Day {day}
                          {day === currentStreak && !reached ? ' (You)' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Next Goal Teaser */}
            <div className="bg-primary-container rounded-xl p-stack-lg border border-gold-metallic/20">
              <div className="flex items-center gap-3 mb-stack-md">
                <span className="material-symbols-outlined text-gold-metallic">flag</span>
                <span className="font-label-caps text-label-caps text-gold-metallic uppercase tracking-wider">Next Objective</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-primary mb-2">60-Day Titan</h3>
              <p className="font-body-sm text-body-sm text-on-primary-container mb-stack-lg">
                Maintain your momentum for another {daysLeftTo60} days to unlock exclusive Creator Tier status and a massive 25k bonus.
              </p>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-data-md text-data-md text-on-primary-container">Progress</span>
                  <span className="font-data-md text-data-md text-gold-metallic">{currentStreak} / 60</span>
                </div>
                <div className="w-full h-3 bg-on-primary-fixed-variant/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-metallic to-gold-light rounded-full transition-all" style={{ width: `${progressTo60}%` }} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <div className="flex-1 w-full overflow-x-hidden pb-24 md:pb-0 relative min-h-[calc(100vh-64px)]">
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-[100] fixed" id="confetti-container">
            {mounted && (
              <style>{`
                @keyframes makeItRain {
                  0% { opacity: 0; top: -10%; transform: rotate(0deg); }
                  10% { opacity: 1; }
                  50% { opacity: 1; transform: rotate(180deg); }
                  100% { opacity: 0; top: 110%; transform: rotate(360deg); }
                }
              `}</style>
            )}
          </div>

          <section className="bg-primary-container relative py-20 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center text-center overflow-hidden -mx-margin-mobile lg:-mx-gutter lg:-mt-16 w-[calc(100%+32px)] lg:w-[calc(100%+48px)]">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-container to-primary-fixed-dim/20 pointer-events-none" />
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
              <div className={`w-32 h-32 rounded-full border-4 ${hasReached30 ? 'border-[#B8860B]' : 'border-outline/30'} bg-primary-fixed flex items-center justify-center shadow-[0_0_40px_rgba(184,134,11,0.3)] mb-4`}>
                <span className={`material-symbols-outlined text-6xl ${hasReached30 ? 'text-[#B8860B]' : 'text-outline/50'}`} style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              </div>
              <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-on-primary mb-2">{hasReached30 ? '30 Days Unlocked!' : '30-Day Challenge'}</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container">
                {hasReached30 ? "Incredible consistency. You've actively shaped the creative economy for a full month." : `You're ${daysLeft} days away from unlocking this milestone. Keep your streak going!`}
              </p>
            </div>
          </section>

          <div className="max-w-container-max mx-auto -mt-12 relative z-20 flex flex-col gap-gutter">
            <div className={`bg-surface-alt rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-2 ${hasReached30 ? 'border-[#B8860B]' : 'border-outline-variant/30'} shadow-[0_4px_20px_rgba(0,0,0,0.04)]`}>
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 ${hasReached30 ? 'bg-[#B8860B]/10 border-[#B8860B]' : 'bg-surface-container-high border-outline-variant'} rounded-full flex items-center justify-center border shrink-0`}>
                  <span className={`material-symbols-outlined text-4xl ${hasReached30 ? 'text-[#B8860B]' : 'text-outline'}`}>toll</span>
                </div>
                <div>
                  <p className="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase tracking-wider">Milestone Bonus</p>
                  <h2 className="font-h2 text-h2 text-primary">10,000 CMP Coins</h2>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
                {hasReached30 ? (
                  <>
                    <button className="bg-[#B8860B] text-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-[#8B6914] transition-colors shadow-md whitespace-nowrap uppercase">Claim Reward</button>
                    <button className="bg-primary text-on-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-on-primary-fixed transition-colors flex items-center justify-center gap-2 whitespace-nowrap uppercase">
                      <span className="material-symbols-outlined text-[18px]">share</span>
                      Share Achievement
                    </button>
                  </>
                ) : (
                  <Link href="/tasks/streak" className="bg-primary text-on-primary font-label-caps text-label-caps py-4 px-8 rounded-lg hover:bg-on-primary-fixed transition-colors text-center whitespace-nowrap uppercase">Back to Streak</Link>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mt-8">
              <div className="lg:col-span-2 bg-surface-alt rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/30">
                <h3 className="font-h3 text-h3 text-on-background mb-6">Your Streak Journey</h3>
                <div className="relative pt-8 pb-4">
                  <div className="absolute top-1/2 left-0 w-full h-2 bg-surface-container-high rounded-full -translate-y-1/2" />
                  <div className="absolute top-1/2 left-0 h-2 bg-[#B8860B] rounded-full -translate-y-1/2" style={{ width: `${progressTo30}%` }} />
                  <div className="flex justify-between relative z-10">
                    {[1, 10, 20, 30].map((day) => {
                      const reached = currentStreak >= day;
                      const isCurrent = day === 30;
                      return (
                        <div key={day} className="flex flex-col items-center gap-2">
                          {isCurrent && reached ? (
                            <div className="w-8 h-8 rounded-full bg-primary border-4 border-[#B8860B] shadow-md flex items-center justify-center -mt-1">
                              <span className="material-symbols-outlined text-[14px] text-[#B8860B]">check</span>
                            </div>
                          ) : (
                            <div className={`w-6 h-6 rounded-full ${reached ? 'bg-[#B8860B]' : 'bg-surface-container-high'} border-4 border-surface-alt shadow-sm`} />
                          )}
                          <span className={`font-data-md text-data-md ${isCurrent && reached ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                            Day {day}{day === currentStreak && !reached ? ' (You)' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-primary-container text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-[#B8860B]">flag</span>
                    <span className="font-label-caps text-label-caps text-[#B8860B] uppercase tracking-wider">Next Objective</span>
                  </div>
                  <h3 className="font-h3 text-h3 mb-2 text-on-primary">60-Day Titan</h3>
                  <p className="font-body-sm text-body-sm text-on-primary-container">Maintain your momentum for another {daysLeftTo60} days to unlock exclusive Creator Tier status and a massive 25k bonus.</p>
                </div>
                <div className="mt-8">
                  <div className="flex justify-between mb-2">
                    <span className="font-data-md text-data-md text-on-primary-container">Progress</span>
                    <span className="font-data-md text-data-md text-[#B8860B]">{currentStreak} / 60</span>
                  </div>
                  <div className="w-full h-3 bg-on-primary-fixed-variant rounded-full overflow-hidden">
                    <div className="h-full bg-[#B8860B] rounded-full" style={{ width: `${progressTo60}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
