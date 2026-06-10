'use client';

import { useState, useEffect } from 'react';

interface AdGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  reward?: number;
  duration?: number;
}

export default function AdGateModal({ isOpen, onClose, reward = 50, duration = 30 }: AdGateModalProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(duration);
    setCanSkip(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, duration]);

  if (!isOpen) return null;

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-primary-container/80 backdrop-blur-md">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-lg shadow-[0px_4px_20px_rgba(13,27,53,0.15)] border border-surface-secondary overflow-hidden flex flex-col relative">
        {/* Header */}
        <div className="px-stack-md py-stack-sm border-b border-surface-secondary flex justify-between items-center bg-surface-bright">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary-container text-[18px]">verified</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">Sponsored Ad</span>
          </div>
          {/* Timer */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle className="text-surface-secondary" cx="18" cy="18" fill="transparent" r="16" stroke="currentColor" strokeWidth="3" />
              <circle
                className="text-primary transition-all duration-1000"
                cx="18"
                cy="18"
                fill="transparent"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress} 100`}
                strokeLinecap="round"
              />
            </svg>
            <span className="font-wallet-display text-[12px] font-bold text-primary z-10">{timeLeft}</span>
          </div>
        </div>

        {/* Ad Content */}
        <div className="w-full aspect-video bg-surface-container flex items-center justify-center overflow-hidden relative group">
          <img
            alt="Sponsored Content"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcWK0eq72eEUeH5_tmePJPW5qaPeM0wP0XrAl7a7qiPID9s_HdzDd0Mh-UHKpWPEvdR2jGwto9drL7QiZqYdfO9OxwH64odu4DGguAcs6-nN3RNI85LtGxtua7jQsVvbqc7b_RIVpWZl6Q5n1Lllluqdhz-jZZR_LNr8pUM4j_fGMiTpINq1M1hW7AjOHCejsJSFZGDPB1dDtZhqb5Dj-A7fZPuenwQ9McJcBc7n0nTiZ5Qmmsp-WqmasNZfqFRpvNTabczvgpW0q_"
          />
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center shadow-lg cursor-pointer">
              <span className="material-symbols-outlined text-primary text-[32px] ml-1" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-stack-md flex flex-col gap-stack-md">
          <div className="text-center">
            <h3 className="font-body-lg text-body-lg text-on-surface mb-1">Unlock your task</h3>
            <p className="font-body-sm text-body-sm text-text-muted">Watching this short ad supports the platform.</p>
          </div>
          <div className="flex items-center justify-center gap-2 mb-stack-sm">
            <div className="px-3 py-1 rounded-full border border-secondary-container bg-secondary-container/5 flex items-center gap-1.5 shadow-sm">
              <span className="font-wallet-display text-[14px] leading-none">🪙</span>
              <span className="font-wallet-display text-[14px] text-on-tertiary-fixed-variant leading-none">+{reward} Rewards</span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={!canSkip}
            className={`w-full py-3 rounded-lg font-body-md font-semibold transition-all ${
              canSkip
                ? 'bg-primary-container text-on-primary hover:opacity-90 cursor-pointer'
                : 'bg-surface-container text-text-muted border border-surface-secondary cursor-not-allowed opacity-70'
            }`}
          >
            {canSkip ? 'Skip Ad' : `Skip Ad in ${timeLeft}s`}
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 w-full bg-surface-variant">
          <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}