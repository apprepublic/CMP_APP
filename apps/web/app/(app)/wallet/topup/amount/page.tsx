'use client';

import { useState, useCallback, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useWallet } from '@/lib/useWallet';
import { useCurrency } from '@/lib/useCurrency';

function TopUpAmountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams?.get('method') || 'paystack';
  const { wallet } = useWallet();
  const { currency, activeRate, formatFiat, getCoinsFromFiat, loadingLocation } = useCurrency();
  const displayCurrency = method === 'crypto' ? 'USD' : currency;
  const displayRate = method === 'crypto' ? { symbol: '$', ratePerCmp: 0.00006667, code: 'USD' } : activeRate;

  const [mode, setMode] = useState<'cmp' | 'fiat'>('fiat');
  const [cmpAmount, setCmpAmount] = useState<string>('');
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const numFiat = parseFloat(fiatAmount) || 0;
  const numCmp = parseInt(cmpAmount) || 0;

  const processingFee = mode === 'fiat' ? (displayCurrency === 'USD' ? 0.45 : 50) : 2;
  const serviceFee = numFiat * 0.015;
  const totalPayable = numFiat + processingFee + serviceFee;

  const handleCmpChange = (val: string) => {
    setCmpAmount(val);
    const n = parseInt(val) || 0;
    setFiatAmount(n > 0 ? (n * displayRate.ratePerCmp).toFixed(2) : '');
    setMode('cmp');
  };

  const handleFiatChange = (val: string) => {
    setFiatAmount(val);
    const n = parseFloat(val) || 0;
    setCmpAmount(n > 0 ? Math.round(n / displayRate.ratePerCmp).toString() : '');
    setMode('fiat');
  };

  const handleQuickSelect = (val: number) => {
    setFiatAmount(val.toString());
    setCmpAmount(Math.round(val / displayRate.ratePerCmp).toString());
    setMode('fiat');
  };

  const handleConfirm = async () => {
    if (numFiat <= 0 || numCmp <= 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      router.push(`/wallet/topup/checkout?amount=${numFiat}&method=${method}&cmp=${numCmp}&currency=${displayCurrency}`);
    }, 500);
  };

  const quickOptions = useMemo(() => {
    if (displayCurrency === 'NGN') return [1000, 5000, 10000, 50000];
    return [10, 25, 50, 100];
  }, [displayCurrency]);

  const formatNum = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden bg-background text-on-background min-h-screen font-body-md">
        <header className="fixed top-0 w-full z-50 bg-primary-container h-16 flex justify-between items-center px-margin-mobile shadow shadow-black/15">
          <div className="flex items-center gap-stack-md">
            <button className="active:scale-95 transition-transform" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md-mobile text-gold-metallic">Top-up Wallet</h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-label-caps text-label-caps text-on-primary-container opacity-60">STEP 2 OF 4</span>
            <div className="flex gap-1 mt-1">
              <div className="w-2 h-2 rounded-full bg-gold-metallic"></div>
              <div className="w-6 h-2 rounded-full bg-gold-metallic"></div>
              <div className="w-2 h-2 rounded-full bg-on-primary-container/30"></div>
              <div className="w-2 h-2 rounded-full bg-on-primary-container/30"></div>
            </div>
          </div>
        </header>

        <main className="w-full max-w-md mt-16 px-margin-mobile py-stack-lg flex flex-col gap-stack-lg pb-48 mx-auto">
          {/* Input Section */}
          <section className="flex flex-col gap-stack-md">
            {/* CMP Input */}
            <div className="flex flex-col gap-stack-xs">
              <label className="font-label-caps text-label-caps text-on-surface-muted ml-1">AMOUNT IN CMP COINS</label>
              <div className="shadow-[inset_4px_4px_8px_rgba(13,27,53,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] bg-surface-container-low rounded-xl p-stack-md flex items-center gap-stack-md border border-outline-variant/30">
                <span className="material-symbols-outlined text-gold-metallic" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
                <input
                  type="text" inputMode="numeric" pattern="[0-9]*"
                  value={cmpAmount}
                  onChange={(e) => handleCmpChange(e.target.value.replace(/\D/g, ''))}
                  placeholder="0"
                  className="bg-transparent border-none focus:ring-0 w-full font-numeric-display text-numeric-display text-on-surface p-0 outline-none"
                />
                <span className="font-label-caps text-label-caps text-gold-metallic font-bold">CMP</span>
              </div>
            </div>

            {/* Conversion Indicator */}
            <div className="flex justify-center items-center gap-stack-md py-stack-sm">
              <div className="h-[1px] flex-grow bg-outline-variant opacity-30"></div>
              <span className="font-label-caps text-label-caps text-on-surface-muted italic">equivalent to</span>
              <div className="h-[1px] flex-grow bg-outline-variant opacity-30"></div>
            </div>

            {/* Fiat Input */}
            <div className="flex flex-col gap-stack-xs">
              <label className="font-label-caps text-label-caps text-on-surface-muted ml-1">AMOUNT IN FIAT ({displayCurrency})</label>
              <div className="shadow-[inset_4px_4px_8px_rgba(13,27,53,0.06),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] bg-surface-container-low rounded-xl p-stack-md flex items-center gap-stack-md border border-outline-variant/30">
                <span className="font-numeric-display text-numeric-display text-on-surface-muted">{displayRate.symbol}</span>
                <input
                  type="text" inputMode="decimal"
                  value={fiatAmount}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9.]/g, '');
                    if ((v.match(/\./g) || []).length <= 1) handleFiatChange(v);
                  }}
                  placeholder="0.00"
                  className="bg-transparent border-none focus:ring-0 w-full font-numeric-display text-numeric-display text-on-surface p-0 outline-none"
                />
                <button className="bg-surface-container-highest rounded px-2 py-1 flex items-center gap-1 active:scale-95 transition-transform cursor-default">
                  <span className="font-label-caps text-label-caps">{displayCurrency}</span>
                  <span className="material-symbols-outlined text-xs">expand_more</span>
                </button>
              </div>
              <div className="flex justify-between items-center mt-2 px-1">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm text-on-surface-muted">info</span>
                  <span className="text-body-sm font-body-sm text-on-surface-muted">
                    Exchange Rate: <span className="font-numeric-display text-on-surface">1 CMP = {displayRate.symbol}{displayRate.ratePerCmp}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Select Chips */}
          <section className="flex flex-wrap gap-stack-sm">
            {quickOptions.map((val) => (
              <button
                key={val}
                onClick={() => handleQuickSelect(val)}
                className={`shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)] bg-white px-4 py-2 rounded-full border transition-colors active:scale-95 ${
                  parseFloat(fiatAmount) === val ? 'border-gold-metallic/50 bg-gold-metallic/10' : 'border-outline-variant/20 hover:border-gold-metallic/50'
                }`}
              >
                <span className="font-numeric-display text-body-sm text-on-surface">+{displayRate.symbol}{val.toLocaleString()}</span>
              </button>
            ))}
          </section>

          {/* Cost Breakdown Card */}
          <div className="shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)] bg-white rounded-xl p-stack-md border-t-2 border-gold-metallic overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'wght' 700" }}>receipt_long</span>
            </div>
            <h3 className="font-label-caps text-label-caps text-on-surface-muted mb-stack-md">ORDER SUMMARY</h3>
            <div className="flex flex-col gap-stack-sm">
              <div className="flex justify-between items-center">
                <span className="text-body-md font-body-md text-on-surface-muted">You will receive</span>
                <div className="bg-[rgba(184,134,11,0.05)] border border-[rgba(184,134,11,0.3)] px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="font-numeric-display text-body-md text-gold-deep">{numCmp.toLocaleString()}</span>
                  <span className="font-label-caps text-[10px] text-gold-deep font-bold">CMP</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-body-md font-body-md text-on-surface-muted">Processing Fee (1.5%)</span>
                <span className="font-numeric-display text-body-md text-on-surface">{displayRate.symbol}{serviceFee.toFixed(2)}</span>
              </div>
              <div className="my-stack-sm border-t border-dashed border-outline-variant"></div>
              <div className="flex justify-between items-center">
                <span className="font-body-lg text-body-lg text-on-surface font-bold">Total Charge</span>
                <span className="font-numeric-display text-headline-md text-primary">{displayRate.symbol}{totalPayable.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex justify-center items-center gap-2 opacity-50">
            <span className="material-symbols-outlined text-sm">verified_user</span>
            <span className="font-label-caps text-[10px]">SECURED BY CMP END-TO-END ENCRYPTION</span>
          </div>
        </main>

        {/* Fixed Bottom Button */}
        <footer className="fixed bottom-20 w-full bg-background/80 backdrop-blur-md p-margin-mobile z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleConfirm}
              disabled={numFiat <= 0 || numCmp <= 0 || isProcessing}
              className={`w-full py-4 rounded-xl text-on-primary font-headline-md text-body-lg active:scale-[0.98] transition-all flex justify-center items-center gap-stack-sm group ${
                numFiat > 0 && numCmp > 0
                  ? 'bg-primary-container shadow-lg shadow-primary-container/20'
                  : 'bg-surface-container text-on-surface-muted cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
              ) : (
                <>Continue to Checkout <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span></>
              )}
            </button>
          </div>
        </footer>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <main className="flex-1 flex-grow flex items-center justify-center pt-8 pb-24 px-margin-mobile md:px-margin-desktop relative min-h-[calc(100vh-80px)]">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl"></div>
          </div>

          <section className="relative z-10 w-full max-w-xl">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-primary-container p-8 text-center relative">
                <Link href="/wallet/topup" className="absolute left-4 top-4 text-on-primary-container hover:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">arrow_back</span>
                </Link>
                <h1 className="font-h2 text-h3 md:text-h2 text-white mb-2">Top-up Wallet</h1>
                <p className="text-on-primary-container font-body-sm">Enter the amount you wish to add. All top-ups are credited as CMP coins.</p>
                <div className="mt-3 inline-flex items-center gap-2 bg-surface-tint/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline/20">
                  <span className="material-symbols-outlined text-secondary-fixed text-sm">{method === 'paystack' ? 'credit_card' : 'currency_bitcoin'}</span>
                  <span className="font-label-caps text-label-caps text-secondary-fixed uppercase">{method === 'paystack' ? 'Paystack' : 'NowPayments'}</span>
                </div>
              </div>

              <div className="p-8 md:p-10 space-y-8">
                <div className="space-y-3">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block">Amount in CMP Coins</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                      <img src="/coin.png" alt="" className="w-6 h-6 object-contain" />
                    </div>
                    <input type="number" value={cmpAmount} onChange={(e) => handleCmpChange(e.target.value)} placeholder="0"
                      className="w-full bg-surface-alt border-none py-6 pl-14 pr-6 rounded-lg font-data-lg text-h2 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container/20" />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-outline-variant/30"></div>
                  <span className="text-on-surface-variant font-body-sm bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant/20">equivalent to</span>
                  <div className="h-px flex-1 bg-outline-variant/30"></div>
                </div>

                <div className="space-y-3">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block">Amount in {loadingLocation ? '...' : displayCurrency}</label>
                  <div className="relative">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2">
                      <span className="font-h2 text-h3 text-on-surface-variant">{displayRate.symbol}</span>
                    </div>
                    <input type="number" value={fiatAmount} onChange={(e) => handleFiatChange(e.target.value)} placeholder="0.00"
                      className="w-full bg-surface-alt border-none py-6 pl-12 pr-6 rounded-lg font-data-lg text-h2 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container/20" />
                  </div>
                  <p className="text-body-sm text-on-surface-variant text-right">1 CMP = {displayRate.symbol}{displayRate.ratePerCmp} {displayRate.code}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickOptions.map((val) => (
                    <button key={val} onClick={() => handleQuickSelect(val)}
className={`py-3 rounded-lg border text-on-surface font-semibold hover:border-secondary transition-colors focus:bg-secondary-fixed focus:border-secondary-container ${parseFloat(fiatAmount) === val ? 'border-secondary bg-secondary-fixed/20' : 'border-outline-variant'}`}>
                       +{displayRate.symbol}{val.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="bg-surface-alt rounded-lg p-6 space-y-3">
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">You will receive</span>
                    <span className="font-data-lg text-data-lg text-primary font-bold">{numCmp.toLocaleString()} CMP</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Network Processing Fee</span>
                    <span className="font-data-md text-data-md">{mode === 'fiat' ? `${displayRate.symbol}${processingFee.toFixed(2)}` : `${processingFee} CMP`}</span>
                  </div>
                  <div className="flex justify-between items-center text-body-sm font-body-sm">
                    <span className="text-on-surface-variant">Platform Service Fee (0.5%)</span>
                    <span className="font-data-md text-data-md">{displayRate.symbol}{serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-outline-variant flex justify-between items-center">
                    <span className="font-bold text-on-surface">Total Charge</span>
                    <span className="font-data-lg text-data-lg text-primary">{displayRate.symbol}{totalPayable.toFixed(2)}</span>
                  </div>
                </div>

                <div className="pt-4">
                  <button onClick={handleConfirm} disabled={numFiat <= 0 || numCmp <= 0 || isProcessing}
                    className="w-full bg-secondary-container text-on-secondary-fixed py-5 rounded-lg font-h3 text-body-lg font-bold shadow-lg shadow-secondary-container/20 hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessing ? (
                      <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
                    ) : (
                      <>Continue to Payment <span className="material-symbols-outlined">arrow_forward</span></>
                    )}
                  </button>
                  <p className="text-center text-body-sm font-body-sm text-on-surface-variant/60 mt-4 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[16px]">shield</span>
                    Secure 256-bit encrypted transaction
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default function TopUpAmountPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    }>
      <TopUpAmountContent />
    </Suspense>
  );
}
