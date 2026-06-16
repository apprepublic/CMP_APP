'use client';

import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { useStreak } from '@/lib/hooks';

export default function Milestone60Page() {
  const { user } = useUserStore();
  const { data: streak, isLoading } = useStreak(user?.id || '');

  const currentStreak = streak?.current_streak ?? 0;
  const hasReached60 = currentStreak >= 60;
  const progressTo60 = Math.min(100, Math.round((currentStreak / 60) * 100));
  const daysLeft = Math.max(0, 60 - currentStreak);

  if (isLoading) {
    return (
      <div className="flex-1 w-full flex items-center justify-center min-h-[calc(100vh-64px)]">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full overflow-x-hidden pb-24 md:pb-0 relative min-h-[calc(100vh-64px)]">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-secondary-container/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary-container/5 blur-[100px]"></div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 relative z-10 flex flex-col gap-gutter">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-4 mt-8">
          <p className="font-label-caps text-label-caps text-[#B8860B] uppercase tracking-widest mb-2">Creative Growth</p>
          <h1 className="font-h1-mobile md:font-h1 text-h1-mobile md:text-h1 text-primary-container mb-4 tracking-tight">
            {hasReached60 ? 'Titan Unlocked!' : 'Road to Titan'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            {hasReached60 
              ? "You've achieved legendary status. 60 consecutive days of dedication to the creative economy. You are a Titan."
              : `You're ${daysLeft} days away. Reach the 60-day streak to achieve Titan status, unlocking the Creator Tier and the ultimate 25,000 CMP bonus.`}
          </p>
        </div>

        {/* Central Titan Badge Display */}
        <div className="flex justify-center my-8">
          <div className="relative group">
            {/* Glow effect behind badge */}
            <div className={`absolute inset-0 rounded-full animate-pulse blur-[30px] ${hasReached60 ? 'bg-[#B8860B]/40' : 'bg-secondary-container/40'} z-0`}></div>
            
            <div className="w-48 h-48 rounded-full border-4 border-surface-alt bg-primary-container flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-container to-primary-fixed-dim/40"></div>
              
              <div className="relative z-20 flex flex-col items-center">
                <span className="material-symbols-outlined text-[72px] text-[#B8860B]" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                <span className="font-label-caps text-[10px] text-on-primary uppercase tracking-[0.2em] mt-2 opacity-80">
                  {hasReached60 ? 'Unlocked' : 'Locked'}
                </span>
              </div>
            </div>
            
            {/* Orbiting particles (css-based) */}
            <div className="absolute inset-[-20px] rounded-full border border-secondary-container/20 border-dashed animate-[spin_10s_linear_infinite] z-0"></div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-surface-alt rounded-2xl p-8 border border-outline-variant/30 shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-3xl mx-auto w-full mt-4">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="font-h3 text-h3 text-on-surface mb-1">Titan Milestone</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {hasReached60 ? 'Milestone achieved!' : `${daysLeft} days left to unlock`}
              </p>
            </div>
            <div className="text-right">
              <span className="font-data-lg text-h2 text-primary-container">{progressTo60}%</span>
            </div>
          </div>
          
          <div className="w-full h-4 bg-surface-container-high rounded-full overflow-hidden mb-6 relative shadow-inner">
            <div className="h-full bg-gradient-to-r from-primary to-[#B8860B] rounded-full relative" style={{ width: `${progressTo60}%` }}>
              {/* Shimmer effect */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          
          <div className="flex justify-between text-on-surface-variant font-data-md text-data-md">
            <span>Day 0</span>
            <span className="text-primary font-bold">Day {currentStreak} (You)</span>
            <span>Day 60</span>
          </div>
          
          <div className="mt-8 pt-8 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/10 flex items-center justify-center border border-secondary-container/30">
                <span className="material-symbols-outlined text-[#B8860B]">card_giftcard</span>
              </div>
              <div>
                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Reward</p>
                <p className="font-data-md text-[18px] text-primary font-bold">25,000 CMP</p>
              </div>
            </div>
            
            {hasReached60 ? (
              <button className="w-full sm:w-auto bg-[#B8860B] text-primary font-body-md text-body-md font-medium py-3 px-8 rounded-lg hover:bg-[#8B6914] transition-colors text-center shadow-sm">
                Claim Reward
              </button>
            ) : (
              <Link href="/tasks/streak" className="w-full sm:w-auto bg-primary text-on-primary font-body-md text-body-md font-medium py-3 px-8 rounded-lg hover:bg-on-primary-fixed transition-colors text-center shadow-sm">
                Keep Grinding
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
