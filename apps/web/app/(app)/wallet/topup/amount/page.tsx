'use client';

import { useState, useCallback, Suspense } from 'react';
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

  const [activeInput, setActiveInput] = useState<'fiat' | 'cmp'>('fiat');
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  
  // Example fee logic: 0.45 USD or 500 NGN or 2 CMP
  const processingFee = activeInput === 'fiat' ? (currency === 'USD' ? 0.45 : 50) : 2;
  const serviceFee = numAmount * 0.005;
  const totalPayable = numAmount + processingFee + serviceFee;

  const formatCurrency = useCallback((val: number) => {
    if (activeInput === 'fiat') {
      return `${activeRate.symbol}${val.toFixed(2)}`;
    }
    return `${val.toFixed(1)} CMP`;
  }, [activeInput, activeRate]);

  const handleSetAmount = (val: number) => {
    setAmount(val.toString());
  };

  const handleConfirm = async () => {
    if (numAmount <= 0) return;
    setIsProcessing(true);
    setShowOverlay(true);

    // In a real app, this would redirect to Paystack/NowPayments
    // For now, simulate a redirect delay
    setTimeout(() => {
      // TODO: Integrate with actual payment gateway
      console.log(`Processing ${method} payment: ${formatCurrency(totalPayable)}`);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <>
      <main className="flex-1 lg:ml-64 flex-grow flex items-center justify-center pt-8 pb-24 md:pb-12 px-margin-mobile md:px-margin-desktop relative min-h-[calc(100vh-80px)]">
        {/* Background Decor */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-24 w-64 h-64 bg-primary-container/5 rounded-full blur-3xl"></div>
        </div>

        {/* Centered Focused Card */}
        <section className="relative z-10 w-full max-w-xl">
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-xl overflow-hidden">
            {/* Header Section */}
            <div className="bg-primary-container p-8 text-center relative">
              <Link href="/wallet/topup" className="absolute left-4 top-4 text-on-primary-container hover:text-on-primary transition-colors">
                <span className="material-symbols-outlined">arrow_back</span>
              </Link>
              <h1 className="font-h2 text-h3 md:text-h2 text-white mb-2">Top-up Wallet</h1>
              <p className="text-on-primary-container font-body-sm">
                Select your currency and enter the amount you wish to add to your creative fund.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 bg-surface-tint/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-outline/20">
                <span className="material-symbols-outlined text-secondary-fixed text-sm">{method === 'paystack' ? 'credit_card' : 'currency_bitcoin'}</span>
                <span className="font-label-caps text-label-caps text-secondary-fixed uppercase">{method === 'paystack' ? 'Paystack' : 'NowPayments'}</span>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8 md:p-10 space-y-8">
              {/* Currency Toggle */}
              <div className="space-y-3">
                <label className="font-label-caps text-label-caps text-on-surface-variant block">Select Asset</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveInput('fiat')}
                    className={`flex items-center justify-center gap-3 py-4 rounded-lg border-2 transition-all duration-200 ${
                      activeInput === 'fiat'
                        ? 'border-primary-container bg-primary-container text-white'
                        : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-alt'
                    }`}
                  >
                    <span className="material-symbols-outlined">payments</span>
                    <span className="font-bold">{loadingLocation ? '...' : currency}</span>
                  </button>
                  <button
                    onClick={() => setActiveInput('cmp')}
                    className={`flex items-center justify-center gap-3 py-4 rounded-lg border-2 transition-all duration-200 ${
                      activeInput === 'cmp'
                        ? 'border-primary-container bg-primary-container text-white'
                        : 'border-outline-variant/50 text-on-surface-variant hover:bg-surface-alt'
                    }`}
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>generating_tokens</span>
                    <span className="font-bold">CMP Coins</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="font-label-caps text-label-caps text-on-surface-variant block">Amount to Add</label>
                  <span className="font-data-md text-data-md text-secondary-container bg-primary-container px-3 py-1 rounded-full uppercase">
                    {activeInput === 'fiat' ? (loadingLocation ? 'Detecting...' : currency === 'USD' ? 'United States Dollars' : 'Nigerian Naira') : 'CMP Tokens'}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2">
                    <span className="font-h2 text-h3 text-on-surface-variant">
                      {activeInput === 'fiat' ? activeRate.symbol : '🪙'}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={activeInput === 'fiat' ? '0.00' : '0'}
                    className="w-full bg-surface-alt border-none py-6 pl-12 pr-6 rounded-lg font-data-lg text-h2 text-on-surface placeholder:text-outline-variant/60 focus:outline-none focus:ring-2 focus:ring-primary-container/20"
                  />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {(activeInput === 'fiat' ? (currency === 'USD' ? [10, 50, 100] : [1000, 5000, 10000]) : [500, 2000, 5000]).map((val) => (
                  <button
                    key={val}
                    onClick={() => handleSetAmount(val)}
                    className="py-3 rounded-lg border border-outline-variant text-on-surface font-semibold hover:border-secondary transition-colors focus:bg-secondary-fixed focus:border-secondary-container"
                  >
                    +{activeInput === 'fiat' ? `${activeRate.symbol}${val}` : `${val.toLocaleString()}`}
                  </button>
                ))}
              </div>

              {/* Fee Breakdown */}
              <div className="bg-surface-alt rounded-lg p-6 space-y-3">
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span>Network Processing Fee</span>
                  <span className="font-data-md text-data-md">{formatCurrency(processingFee)}</span>
                </div>
                <div className="flex justify-between items-center text-body-sm font-body-sm text-on-surface-variant">
                  <span>Platform Service Fee (0.5%)</span>
                  <span className="font-data-md text-data-md">{formatCurrency(serviceFee)}</span>
                </div>
                <div className="pt-3 border-t border-outline-variant flex justify-between items-center text-on-surface">
                  <span className="font-bold">Total Payable</span>
                  <span className="font-data-lg text-data-lg text-primary">{formatCurrency(totalPayable)}</span>
                </div>
              </div>

              {/* Action CTA */}
              <div className="pt-4">
                <button
                  onClick={handleConfirm}
                  disabled={numAmount <= 0 || isProcessing}
                  className="w-full bg-secondary-container text-on-secondary-fixed py-5 rounded-lg font-h3 text-body-lg font-bold shadow-lg shadow-secondary-container/20 hover:bg-secondary transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Transaction
                  <span className="material-symbols-outlined">arrow_forward</span>
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

      {/* Redirecting Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-primary-container/85 backdrop-blur-md"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-margin-mobile">
            <div className="bg-white rounded-xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-secondary-container"></div>
              <div className="w-20 h-20 bg-secondary-container/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-secondary" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
              </div>
              <h2 className="font-h2 text-h2 text-primary-container mb-2">Redirecting...</h2>
              <p className="text-on-surface-variant font-body-md mb-8">We are connecting you to our secure payment gateway to finalize your transaction.</p>
              <div className="space-y-4">
                <div className="w-full bg-surface-alt h-1 rounded-full overflow-hidden">
                  <div className="bg-secondary-container h-full w-1/2 animate-pulse"></div>
                </div>
                <button
                  onClick={() => { setShowOverlay(false); setIsProcessing(false); }}
                  className="text-label-caps font-label-caps text-on-primary-container hover:text-primary transition-colors"
                >
                  CANCEL TRANSACTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
