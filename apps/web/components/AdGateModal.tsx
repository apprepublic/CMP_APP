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
  onAdComplete?: () => void; // Callback when ad is verified complete
  reward?: number;
  duration?: number;
}

// TODO: Integrate real ad network SDK (e.g., Google AdMob, Unity Ads, IronSource)
// This component currently gates behind NEXT_PUBLIC_ADS_ENABLED flag for development.
// In production, replace the mock flow with actual SDK calls and server-validated callbacks.

export default function AdGateModal({ isOpen, onClose, onAdComplete, reward = 50, duration = 30 }: AdGateModalProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canSkip, setCanSkip] = useState(false);
  const [adVerified, setAdVerified] = useState(false);

  // Check if ads are enabled via environment variable
  const adsEnabled = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(duration);
    setCanSkip(false);
    setAdVerified(false);

    // TODO: In production, initialize real ad network SDK here
    // Example pseudo-code for real integration:
    // if (adsEnabled) {
    //   adNetwork.showRewardedAd({
    //     onAdOpened: () => { /* ad displayed */ },
    //     onAdClosed: () => { /* handle close */ },
    //     onAdFailedToShow: (error) => { /* handle error */ },
    //     onUserEarnedReward: (reward) => {
    //       // Server-validated callback - only called when ad network confirms completion
    //       setAdVerified(true);
    //       setCanSkip(true);
    //       setTimeLeft(0);
    //       onAdComplete?.();
    //     }
    //   });
    // }

    // Development mode: if ads disabled, resolve immediately
    if (!adsEnabled) {
      // Dev mode - resolve immediately for testing
      setAdVerified(true);
      setCanSkip(true);
      setTimeLeft(0);
      return;
    }

    // Mock timer for development when ads are "enabled" but no SDK integrated
    // TODO: Remove this in production and rely solely on SDK callbacks
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanSkip(true);
          setAdVerified(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, duration, onAdComplete, adsEnabled]);

  if (!isOpen) return null;

  const progress = ((duration - timeLeft) / duration) * 100;

  // Handle skip/close - only allow if ad is verified or timer completed
  const handleSkip = () => {
    if (canSkip) {
      // TODO: In production, verify with server that ad was actually watched
      // before allowing close and granting reward
      if (adsEnabled && !adVerified) {
        // Ad not verified by network - don't allow skip
        return;
      }
      onAdComplete?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-margin-mobile bg-neo-primary/90 backdrop-blur-md">
      <NeuCard padding="none" className="w-full max-w-md shadow-neu-raised relative overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-neu-bg-dark bg-neu-bg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <NeuIconBadge size="sm" active className="bg-neo-secondary/20">
              <Verified className="w-4 h-4 text-neo-secondary" />
            </NeuIconBadge>
            <span className="font-label-caps text-label-caps text-neo-text-secondary uppercase tracking-wider">
              {adsEnabled ? 'Sponsored Ad' : 'Dev Mode - Ads Disabled'}
            </span>
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
          {adsEnabled ? (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-neo-primary/20 to-neo-secondary/20 flex items-center justify-center">
                <NeuIconBadge size="lg" active className="bg-white/80 backdrop-blur-md shadow-neu-raised cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-neo-primary ml-0.5" />
                </NeuIconBadge>
              </div>
              <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {/* TODO: Replace with actual ad attribution */}
                Advertisement
              </div>
            </>
          ) : (
            <div className="absolute inset-0 bg-neu-bg flex items-center justify-center p-6 text-center">
              <div>
                <NeuIconBadge size="lg" active className="mx-auto mb-4 bg-neo-secondary/20">
                  <Play className="w-8 h-8 text-neo-secondary" />
                </NeuIconBadge>
                <p className="font-body-sm text-body-sm text-neo-text-secondary mb-2">
                  Ads are disabled in development
                </p>
                <p className="font-body-xs text-body-xs text-neo-text-muted">
                  Set NEXT_PUBLIC_ADS_ENABLED=true to enable
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 flex flex-col gap-4">
          <div className="text-center">
            <h3 className="font-body-lg text-body-lg text-neo-text-primary mb-1">
              {adsEnabled ? 'Unlock your task' : 'Dev Mode - Ad Skipped'}
            </h3>
            <p className="font-body-sm text-body-sm text-neo-text-secondary">
              {adsEnabled 
                ? 'Watching this short ad supports the platform.' 
                : 'Reward granted without ad (dev mode)'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <NeuCard padding="none" className="px-3 py-1 rounded-full bg-neu-bg shadow-neu-inset flex items-center gap-1.5">
              <span className="font-wallet-display text-[14px] leading-none">🪙</span>
              <span className="font-wallet-display text-[14px] text-neo-secondary leading-none">+{reward} Rewards</span>
            </NeuCard>
            {adVerified && (
              <NeuIconBadge size="sm" active className="bg-neo-success/20">
                <Check className="w-4 h-4 text-neo-success" />
              </NeuIconBadge>
            )}
          </div>
          <Button
            size="lg"
            className="w-full"
            variant={canSkip ? 'default' : 'outline'}
            onClick={handleSkip}
            disabled={!canSkip}
          >
            {canSkip 
              ? (adVerified ? 'Continue' : 'Skip Ad') 
              : `Skip Ad in ${timeLeft}s`}
          </Button>
        </div>

        {/* Progress bar */}
        <NeuProgress value={progress} size="sm" className="rounded-none" />
      </NeuCard>
    </div>
  );
}