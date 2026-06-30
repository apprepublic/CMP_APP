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

  const [mode, setMode] = useState<'cmp' | 'fiat'>('fiat');
  const [cmpAmount, setCmpAmount] = useState<string>('');
  const [fiatAmount, setFiatAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const numFiat = parseFloat(fiatAmount) || 0;
  const numCmp = parseInt(cmpAmount) || 0;

  const processingFee = mode === 'fiat' ? (currency === 'USD' ? 0.45 : 50) : 2;
  const serviceFee = numFiat * 0.005;
  const totalPayable = numFiat + processingFee + serviceFee;

  const handleCmpChange = (val: string) => {
    setCmpAmount(val);
    const n = parseInt(val) || 0;
    setFiatAmount(n > 0 ? (n * activeRate.ratePerCmp).toFixed(2) : '');
    setMode('cmp');
  };

  const handleFiatChange = (val: string) => {
    setFiatAmount(val);
    const n = parseFloat(val) || 0;
    setCmpAmount(n > 0 ? Math.round(n / activeRate.ratePerCmp).toString() : '');
    setMode('fiat');
  };

  const handleQuickSelect = (val: number) => {
    setFiatAmount(val.toString());
    setCmpAmount(Math.round(val / activeRate.ratePerCmp).toString());
    setMode('fiat');
  };

  const handleConfirm = async () => {
    if (numFiat <= 0 || numCmp <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      router.push(`/wallet/topup/checkout?amount=${numFiat}&method=${method}&cmp=${numCmp}`);
    }, 500);
  };

  const quickOptions = useMemo(() => {
    if (currency === 'NGN') return [1000, 5000, 10000, 50000];
    return [10, 25, 50, 100];
  }, [currency]);

  return (
    <main className="flex-1 lg:ml-64 flex-grow flex items-center justify-center pt-8 pb-24 md:pb-12 px-margin-mobile md:px-margin-desktop relative min-h-[calc(100vh-80px)]">
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
            <p className="text-on-primary-container font-body-sm">
              Enter the amount you wish to add. All top-ups are credited as CMP coins.
            </p>
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
                <input
                  type="number"
                  value={cmpAmount}
                  onChange={(e) => handleCmpChange(e.target.value)}
                  placeholder="0"
                  className="w-full bg-surface-alt border-none py-6 pl-14 pr-6 rounded-lg font-data-lg text-h2 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-outline-variant/30"></div>
              <span className="text-on-surface-variant font-body-sm bg-surface-container-lowest px-3 py-1 rounded-full border border-outline-variant/20">equivalent to</span>
              <div className="h-px flex-1 bg-outline-variant/30"></div>
            </div>

            <div className="space-y-3">
              <label className="font-label-caps text-label-caps text-on-surface-variant block">
                Amount in {loadingLocation ? '...' : currency}
              </label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2">
                  <span className="font-h2 text-h3 text-on-surface-variant">{activeRate.symbol}</span>
                </div>
                <input
                  type="number"
                  value={fiatAmount}
                  onChange={(e) => handleFiatChange(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-surface-alt border-none py-6 pl-12 pr-6 rounded-lg font-data-lg text-h2 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                />
              </div>
              <p className="text-body-sm text-on-surface-variant text-right">
                1 CMP = {activeRate.symbol}{activeRate.ratePerCmp} {activeRate.code}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {quickOptions.map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuickSelect(val)}
                  className={`py-3 rounded-lg border text-on-surface font-semibold hover:border-secondary transition-colors focus:bg-secondary-fixed focus:border-secondary-container ${
                    parseFloat(fiatAmount) === val ? 'border-secondary bg-secondary-fixed/20' : 'border-outline-variant'
                  }`}
                >
                  +{activeRate.symbol}{val.toLocaleString()}
                </button>
              ))}
            </div>

            <div className="bg-surface-alt rounded-lg p-6 space-y-3">
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>You will receive</span>
                <span className="font-data-lg text-data-lg text-primary font-bold">{numCmp.toLocaleString()} CMP</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>Network Processing Fee</span>
                <span className="font-data-md text-data-md">{mode === 'fiat' ? `${activeRate.symbol}${processingFee.toFixed(2)}` : `${processingFee} CMP`}</span>
              </div>
              <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                <span>Platform Service Fee (0.5%)</span>
                <span className="font-data-md text-data-md">{activeRate.symbol}{serviceFee.toFixed(2)}</span>
              </div>
              <div className="pt-3 border-t border-outline-variant flex justify-between items-center text-on-surface">
                <span className="font-bold">Total Charge</span>
                <span className="font-data-lg text-data-lg text-primary">{activeRate.symbol}{totalPayable.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleConfirm}
                disabled={numFiat <= 0 || numCmp <= 0 || isProcessing}
                className="w-full bg-secondary-container text-on-secondary-fixed py-5 rounded-lg font-h3 text-body-lg font-bold shadow-lg shadow-secondary-container/20 hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
