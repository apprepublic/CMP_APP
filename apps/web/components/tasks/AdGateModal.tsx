'use client';

import { useState, useEffect, useCallback } from 'react';

interface AdGateModalProps {
  duration?: number; // seconds
  coinReward: number;
  onComplete: () => void;
}

export default function AdGateModal({ duration = 15, coinReward, onComplete }: AdGateModalProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canSkip, setCanSkip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    if (timeLeft <= 0) {
      setCanSkip(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, dismissed]);

  const handleComplete = useCallback(() => {
    setDismissed(true);
    onComplete();
  }, [onComplete]);

  // SVG circle: circumference = 2*pi*16 ≈ 100.53 (approximated to 100 in design)
  const circumference = 100;
  const progress = ((duration - timeLeft) / duration) * circumference;
  const strokeDashoffset = circumference - progress;

  if (dismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13, 27, 53, 0.9)', backdropFilter: 'blur(12px)' }}
    >
      {/* Blurred content hint behind modal handled by parent */}
      <div className="bg-surface-container-lowest w-full max-w-[600px] rounded-[24px] overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Header */}
        <div className="px-8 pt-8 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="font-h3 text-primary tracking-tighter">CMPapp</span>
            <span className="bg-secondary text-on-secondary px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">Premium</span>
          </div>

          {/* SVG Countdown Timer */}
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
              <circle className="stroke-surface-container-high" cx="18" cy="18" fill="none" r="16" strokeWidth="3" />
              <circle
                cx="18" cy="18" fill="none" r="16"
                stroke="#7b5800"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                strokeWidth="3"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <span className="font-data-md text-data-md text-primary text-sm font-bold relative z-10">
              {timeLeft > 0 ? timeLeft : '✓'}
            </span>
          </div>
        </div>

        {/* Ad Placeholder */}
        <div className="mx-6 mb-6 rounded-xl overflow-hidden bg-surface-container-high flex flex-col items-center justify-center min-h-[200px] border border-outline-variant/40 relative">
          <div className="absolute top-2 right-3 font-label-caps text-[9px] text-on-surface-variant/50 uppercase tracking-widest">Advertisement</div>
          <span className="material-symbols-outlined text-5xl text-secondary-container mb-3">campaign</span>
          <p className="font-label-caps text-label-caps text-on-surface-variant text-center px-4">
            Support CMP App by watching this short ad
          </p>
          <p className="text-xs text-on-surface-variant/60 mt-1">Your reward will unlock immediately after</p>
        </div>

        {/* Reward Preview */}
        <div className="px-8 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center glow-gold">
              <span
                className="material-symbols-outlined text-on-secondary-container"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >monetization_on</span>
            </div>
            <div>
              <p className="font-label-caps text-[10px] text-on-surface-variant uppercase tracking-wider">Your Reward</p>
              <p className="font-data-lg text-data-lg text-secondary">{coinReward} <span className="text-sm font-label-caps">CMP</span></p>
            </div>
          </div>

          <button
            onClick={canSkip ? handleComplete : undefined}
            disabled={!canSkip}
            className={`px-6 py-3 rounded-xl font-h3 text-[16px] font-bold transition-all duration-300 flex items-center gap-2 ${
              canSkip
                ? 'bg-secondary text-on-primary hover:bg-on-secondary-fixed-variant active:scale-95 shadow-lg cursor-pointer'
                : 'bg-surface-container text-on-surface-variant cursor-not-allowed animate-pulse-gold'
            }`}
          >
            {canSkip ? (
              <>
                <span className="material-symbols-outlined text-[18px]">lock_open</span>
                Unlock Task
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                Wait {timeLeft}s
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
