'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

function SuccessContent() {
  const searchParams = useSearchParams();
  const coins = searchParams?.get('coins') || '0';
  const method = searchParams?.get('method') || 'paystack';
  const ref = searchParams?.get('ref') || '';
  const { user } = useUserStore();

  const [showConfetti, setShowConfetti] = useState(false);
  const transactionId = ref || `TXN-${Math.floor(1000 + Math.random() * 9000)}-XAL`;
  const [timestamp, setTimestamp] = useState('');

  useEffect(() => {
    const now = new Date();
    setTimestamp(now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short' }));
    setShowConfetti(true);
    const cleanup = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(cleanup);
  }, []);

  const triggerConfetti = () => {
    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 50);
  };

  return (
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden bg-background min-h-screen flex flex-col font-body-md text-on-surface overflow-x-hidden">
        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 30 }).map((_, i) => {
              const colors = ['#B8860B', '#8B6914', '#0d1b35', '#efbf65'];
              return (
                <div
                  key={i}
                  className="fixed rounded-sm pointer-events-none"
                  style={{
                    left: Math.random() * 100 + 'vw',
                    top: '-10px',
                    width: Math.random() * 8 + 4 + 'px',
                    height: Math.random() * 8 + 4 + 'px',
                    backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    animation: `confetti-fall ${Math.random() * 2 + 3}s linear ${Math.random() * 2}s forwards`,
                  }}
                />
              );
            })}
            <style>{`
              @keyframes confetti-fall {
                0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
              }
              @keyframes dash { to { stroke-dashoffset: 0; } }
            `}</style>
          </div>
        )}

        <header className="fixed top-0 w-full z-40 bg-primary-container shadow shadow-black/15 flex justify-between items-center px-margin-mobile h-16">
          <div className="font-headline-md text-headline-md-mobile font-bold text-gold-metallic">CMPapp</div>
          <div className="flex items-center gap-stack-sm text-on-primary">
            <Link href="/wallet" className="material-symbols-outlined hover:opacity-80 transition-opacity active:scale-95">
              close
            </Link>
          </div>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile pt-24 pb-12 relative">
          {/* Success Animation */}
          <div className="relative z-10 mb-stack-lg flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-success/10 flex items-center justify-center shadow-[0_0_40px_rgba(46,125,50,0.25)] mb-stack-md border-2 border-success/20">
              <svg className="w-12 h-12 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path className="success-checkmark-animation" d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"
                  style={{ strokeDasharray: 100, strokeDashoffset: 100, animation: 'dash 0.8s cubic-bezier(0.65,0,0.45,1) forwards 0.2s' }} />
              </svg>
            </div>
            <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-stack-xs">Top-up Successful!</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[280px]">Your CMP Coins are now available in your wallet.</p>
          </div>

          {/* Summary Card */}
          <div className="bg-white shadow-[12px_12px_24px_rgba(13,27,53,0.08),-12px_-12px_24px_#ffffff] w-full max-w-md rounded-xl p-stack-lg mb-stack-lg border-t-2 border-gold-metallic relative z-10">
            <div className="space-y-stack-md">
              <div className="flex justify-between items-center pb-stack-sm border-b border-outline-variant">
                <span className="font-label-caps text-label-caps text-on-surface-muted">Amount Added</span>
                <div className="flex items-center gap-1">
                  <span className="font-numeric-display text-numeric-display text-primary">{parseFloat(coins).toLocaleString()}</span>
                  <span className="font-label-caps text-label-caps text-gold-deep">CMP</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-label-caps text-on-surface-muted uppercase">Transaction ID</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold select-all">{transactionId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-label-caps text-label-caps text-on-surface-muted uppercase">Method</span>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">payments</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface font-semibold">{method === 'paystack' ? 'Paystack' : 'NowPayments'}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-stack-sm border-t border-dashed border-outline-variant">
                <span className="font-label-caps text-label-caps text-on-surface-muted uppercase">Status</span>
                <div className="flex items-center gap-1 text-success">
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <span className="font-label-caps text-label-caps font-bold">COMPLETED</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-stack-md relative z-10">
            <Link href="/wallet"
              className="w-full h-14 bg-primary-container text-on-primary font-bold rounded-xl shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="font-body-md text-body-md">Back to Wallet</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
            <button className="w-full h-14 bg-transparent border-2 border-primary-container text-primary-container font-bold rounded-xl hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">download</span>
              <span className="font-body-md text-body-md">Download Receipt</span>
            </button>
          </div>
        </main>

        {/* Floating Coin Badge */}
        <div className="fixed bottom-24 right-4 z-20 animate-bounce">
          <div className="bg-surface-container-lowest border border-gold-metallic rounded-full px-stack-md py-stack-xs flex items-center gap-2 shadow-xl">
            <span className="material-symbols-outlined text-gold-metallic">currency_exchange</span>
            <span className="font-numeric-display text-numeric-display text-gold-deep text-sm">+{parseFloat(coins).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <main className="flex-grow flex items-center justify-center px-margin-mobile pt-16 pb-12 relative z-10 bg-surface min-h-screen">
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => {
                const colors = ['#f7bd48', '#ffdea6', '#fdc34d', '#0d1b35'];
                const size = Math.random() * 8 + 4;
                return (
                  <div key={i} className="absolute top-[-10px] rounded-full pointer-events-none"
                    style={{
                      left: Math.random() * 100 + 'vw',
                      width: size + 'px', height: size + 'px',
                      backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                      animation: 'fall ' + (Math.random() * 2 + 1) + 's linear ' + (Math.random() * 0.5) + 's forwards',
                    }}
                  />
                );
              })}
              <style>{`@keyframes fall { to { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
            </div>
          )}

          <div className="max-w-md w-full my-8">
            <div className="bg-white/70 backdrop-blur-md border border-white/40 rounded-[24px] overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative bg-primary-container h-48 flex items-center justify-center overflow-hidden">
                <div className="relative z-10 flex flex-col items-center">
                  <button onClick={triggerConfetti}
                    className="w-20 h-20 bg-success-verified rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-105 active:scale-95"
                    style={{ animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                    <span className="material-symbols-outlined text-white text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </button>
                  <style>{`@keyframes pulse-ring { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(46, 125, 50, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 125, 50, 0); } }`}</style>
                  <h1 className="font-h3 text-h3 text-white text-center">Top-up Successful</h1>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="text-center">
                  <p className="text-on-surface-variant font-label-caps uppercase mb-2">Amount Added</p>
                  <div className="inline-flex items-center gap-2 bg-surface-alt px-4 py-2 rounded-full border-[1.5px] border-secondary">
                    <img src="/coin.png" alt="Coin" className="w-6 h-6 object-contain" />
                    <span className="font-data-lg text-data-lg text-primary">{parseFloat(coins).toLocaleString()} CMP</span>
                  </div>
                </div>

                <div className="space-y-3 bg-surface-container-low p-4 rounded-xl border border-outline-variant/30">
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Transaction ID</span>
                    <span className="font-data-md text-data-md text-primary select-all">{transactionId}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Payment Method</span>
                    <span className="text-on-surface font-semibold">{method === 'crypto' ? 'NowPayments Wallet' : 'Creative Card •••• 4421'}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Timestamp</span>
                    <span className="text-on-surface">{timestamp}</span>
                  </div>
                </div>

                <p className="text-body-sm font-body-sm text-on-surface-variant text-center leading-relaxed">
                  Your CMP Coins are now available in your wallet. You can use them to fund projects, pay creators, or upgrade your membership.
                </p>

                <div className="space-y-3 pt-4">
                  <Link href="/wallet"
                    className="w-full bg-primary-container text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98]">
                    <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
                    Back to Wallet
                  </Link>
                  <button className="w-full bg-transparent border border-outline text-on-surface-variant py-3 rounded-lg font-medium hover:bg-surface-alt transition-colors active:scale-[0.98]">
                    Download Receipt
                  </button>
                </div>
              </div>

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

            <p className="text-center mt-8 text-body-sm font-body-sm text-on-surface-variant">
              Need help? <Link href="#" className="text-primary font-semibold underline underline-offset-4">Contact Support</Link>
            </p>
          </div>
        </main>
      </div>
    </>
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
