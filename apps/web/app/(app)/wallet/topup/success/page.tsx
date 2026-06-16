'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const coins = searchParams.get('coins') || '0';
  const method = searchParams.get('method') || 'paystack';
  const { user } = useUserStore();
  
  const [showConfetti, setShowConfetti] = useState(false);
  const transactionId = `TXN-${Math.floor(1000 + Math.random() * 9000)}-XAL-001`;
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    // Set timestamp
    const now = new Date();
    setTimestamp(now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
    
    // Trigger confetti
    setTimeout(() => {
      setShowConfetti(true);
    }, 300);
    
    // Hide confetti particles after animation finishes
    const cleanup = setTimeout(() => {
      setShowConfetti(false);
    }, 4000);
    
    return () => clearTimeout(cleanup);
  }, []);

  const triggerConfetti = () => {
    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 50);
  };

  const getCardMask = () => {
    if (method === 'crypto') return 'NowPayments Wallet';
    return 'Creative Card •••• 4421';
  };

  return (
    <main className="flex-grow flex items-center justify-center px-margin-mobile pt-16 pb-12 relative z-10 lg:ml-64 bg-surface min-h-screen">
      {/* Transaction Canvas Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ['#f7bd48', '#ffdea6', '#fdc34d', '#0d1b35'];
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const duration = Math.random() * 2 + 1;
            const delay = Math.random() * 0.5;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div
                key={i}
                className="absolute top-[-10px] rounded-full pointer-events-none"
                style={{
                  left: `${left}vw`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  animation: `fall ${duration}s linear ${delay}s forwards`,
                }}
              />
            );
          })}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes fall {
              to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
              }
            }
          `}} />
        </div>
      )}

      <div className="max-w-md w-full my-8">
        {/* Success Card */}
        <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[24px] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Header Visual Section */}
          <div className="relative bg-primary-container h-48 flex items-center justify-center overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <button 
                onClick={triggerConfetti}
                className="w-20 h-20 bg-success-verified rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105 active:scale-95"
                style={{
                  animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                }}
              >
                <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </button>
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes pulse-ring {
                  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.7); }
                  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(46, 125, 50, 0); }
                  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); }
                }
              `}} />
              <h1 className="font-h3 text-h3 text-white text-center">Top-up Successful</h1>
            </div>
          </div>
          
          {/* Details Content */}
          <div className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-on-surface-variant font-label-caps uppercase mb-2">Amount Added</p>
              <div className="inline-flex items-center gap-2 bg-surface-alt px-4 py-2 rounded-full border-[1.5px] border-secondary">
                <img src="/coin.png" alt="Coin" className="w-6 h-6 object-contain" />
                <span className="font-data-lg text-data-lg text-primary">{parseFloat(coins).toLocaleString()} CMP</span>
              </div>
            </div>
            
            {/* Transaction Info */}
            <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Transaction ID</span>
                <span className="font-data-md text-data-md text-primary select-all">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Payment Method</span>
                <span className="text-on-surface font-semibold">{getCardMask()}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm">
                <span className="text-on-surface-variant">Timestamp</span>
                <span className="text-on-surface">{timestamp}</span>
              </div>
            </div>
            
            {/* Success Message */}
            <p className="text-body-sm font-body-sm text-on-surface-variant text-center leading-relaxed">
              Your CMP Coins are now available in your wallet. You can use them to fund projects, pay creators, or upgrade your membership.
            </p>
            
            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Link href="/wallet" className="w-full bg-primary-container text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                Back to Wallet
              </Link>
              <button className="w-full bg-transparent border border-outline text-on-surface-variant py-3 rounded-lg font-medium hover:bg-surface-alt transition-colors active:scale-[0.98]">
                Download Receipt
              </button>
            </div>
          </div>
          
          {/* Ad-Gate Style Reward Promo */}
          <div className="border-t border-outline-variant/20 p-6 bg-secondary-fixed/10">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-fixed">workspace_premium</span>
              </div>
              <div className="flex-grow">
                <h4 className="font-bold text-on-surface text-sm">Earn 5% CMP Bonus</h4>
                <p className="text-xs text-on-surface-variant">Upgrade to Pro to earn bonus coins on every top-up.</p>
              </div>
              <button className="bg-secondary-container text-on-secondary-fixed px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap hover:bg-secondary transition-colors">
                Upgrade
              </button>
            </div>
          </div>
        </div>
        
        {/* Support Link */}
        <p className="text-center mt-8 text-body-sm font-body-sm text-on-surface-variant">
          Need help? <Link href="#" className="text-primary font-semibold underline underline-offset-4">Contact Support</Link>
        </p>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
