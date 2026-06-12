'use client';

import { useState, useEffect } from 'react';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Button } from '@/components/ui/button';
import { Verified, Play, Copy, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-neo-primary/90 backdrop-blur-md">
      <NeuCard padding="none" className="w-full max-w-md shadow-neu-raised relative overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neu-bg-dark bg-neu-bg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
              <Verified className="w-4 h-4 text-neo-secondary" />
            </NeuIconBadge>
            <span className="font-label-caps text-label-caps text-neo-text-secondary uppercase tracking-wider">Sponsored Ad</span>
          </div>
          {/* Timer */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle className="text-neu-bg-dark" cx="18" cy="18" fill="transparent" r="16" stroke="currentColor" strokeWidth="3" />
              <circle
                className="text-neo-primary transition-all duration-1000"
                cx="18"
                cy="18"
                fill="transparent"
                r="16"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${progress} 100`}
                strokeDashoffset="25"
                strokeLinecap="round"
              />
            </svg>
            <span className="font-data-md text-data-md font-bold text-neo-primary z-10">{timeLeft}</span>
          </div>
        </div>

        {/* Ad Content */}
        <div className="w-full aspect-video bg-neu-bg flex items-center justify-center overflow-hidden relative group">
          <img
            alt="Sponsored Content"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcWK0eq72eEUeH5_tmePJPW5qaPeM0wP0XrAl7a7qiPID9s_HdzDd0Mh-UHKpWPEvdR2jGwto9drL7QiZqYdfO9OxwH64odu4DGguAcs6-nN3RNI85LtGxtua7jQsVvbqc7b_RIVpWZl6Q5n1Lllluqdhz-jZZR_LNr8pUM4j_fGMiTpINq1M1hW7AjOHCejsJSFZGDPB1dDtZhqb5Dj-A7fZPuenwQ9McJcBc7n0nTiZ5Qmmsp-WqmasNZfqFRpvNTabczvgpW0q_"
          />
          <div className="absolute inset-0 bg-neo-primary/20 flex items-center justify-center">
            <NeuIconBadge size="lg" active className="bg-white/80 backdrop-blur-md shadow-neu-raised cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-neo-primary ml-0.5" />
            </NeuIconBadge>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 flex flex-col gap-4">
          <div className="text-center">
            <h3 className="font-body-lg text-body-lg text-neo-text-primary mb-1">Unlock your task</h3>
            <p className="font-body-sm text-body-sm text-neo-text-secondary">Watching this short ad supports the platform.</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <NeuCard padding="none" className="px-3 py-1 rounded-full bg-neu-bg shadow-neu-inset flex items-center gap-1.5">
              <span className="font-wallet-display text-[14px] leading-none">🪙</span>
              <span className="font-wallet-display text-[14px] text-neo-secondary leading-none">+{reward} Rewards</span>
            </NeuCard>
          </div>
          <Button
            size="lg"
            className="w-full"
            variant={canSkip ? 'default' : 'outline'}
            onClick={onClose}
            disabled={!canSkip}
          >
            {canSkip ? 'Skip Ad' : `Skip Ad in ${timeLeft}s`}
          </Button>
        </div>

        {/* Progress bar */}
        <NeuProgress value={progress} size="sm" className="rounded-none" />
      </NeuCard>
    </div>
  );
}