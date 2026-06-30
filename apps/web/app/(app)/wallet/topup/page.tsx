'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function TopUpSelectMethodPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedMethod) {
      router.push(`/wallet/topup/amount?method=${selectedMethod}`);
    }
  };

  return (
    <main className="flex-1 pb-24 md:pb-12 min-h-screen">
      {/* Hero Branding Section */}
      <section className="relative bg-primary-container h-64 flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="relative z-10 px-margin-mobile">
          <h1 className="font-h1 text-h1 text-on-primary mb-2">Fund Your Account</h1>
          <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl">Secure and instant top-ups to power your creative enterprise.</p>
        </div>
      </section>

      {/* Selection Container */}
      <section className="max-w-4xl mx-auto -mt-16 px-margin-mobile relative z-20">
        <div className="bg-surface-container-lowest rounded-xl shadow-xl p-8 border border-outline-variant/30">
          <div className="mb-10 text-center">
            <h2 className="font-h2 text-h2 text-primary-container mb-2">Select Top-up Method</h2>
            <p className="text-on-surface-variant font-body-md">Choose your preferred provider to proceed with the transaction.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Paystack Card */}
            <button
              onClick={() => setSelectedMethod('paystack')}
              className={`cursor-pointer group relative p-6 rounded-xl border-2 bg-surface-alt text-left transition-all duration-300 ease-in-out ${
                selectedMethod === 'paystack'
                  ? 'border-[#B8860B] bg-[#B8860B]/5'
                  : 'border-transparent hover:border-secondary-fixed'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden p-2">
                  <span className="material-symbols-outlined text-primary-container text-3xl">credit_card</span>
                </div>
                <span className={`material-symbols-outlined text-secondary-fixed transition-opacity ${selectedMethod === 'paystack' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-h3 text-h3 text-primary-container mb-2">Paystack</h3>
              <p className="text-on-surface-variant text-body-sm mb-4">Cards, Bank Transfer, Mobile Money</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-label-caps font-label-caps px-2 py-1 bg-primary-container/5 text-primary-container rounded border border-primary-container/10">VISA</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-primary-container/5 text-primary-container rounded border border-primary-container/10">MASTERCARD</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-primary-container/5 text-primary-container rounded border border-primary-container/10">NGN</span>
              </div>
            </button>

            {/* NowPayments Card */}
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`cursor-pointer group relative p-6 rounded-xl border-2 bg-surface-alt text-left transition-all duration-300 ease-in-out ${
                selectedMethod === 'crypto'
                  ? 'border-[#B8860B] bg-[#B8860B]/5'
                  : 'border-transparent hover:border-secondary-fixed'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden p-2">
                  <span className="material-symbols-outlined text-secondary text-3xl">currency_bitcoin</span>
                </div>
                <span className={`material-symbols-outlined text-secondary-fixed transition-opacity ${selectedMethod === 'crypto' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              </div>
              <h3 className="font-h3 text-h3 text-primary-container mb-2">NowPayments</h3>
              <p className="text-on-surface-variant text-body-sm mb-4">Crypto: BTC, ETH, USDT (ERC20/TRC20)</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-label-caps font-label-caps px-2 py-1 bg-secondary-container/10 text-secondary border border-secondary/20 font-bold">BITCOIN</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-secondary-container/10 text-secondary border border-secondary/20 font-bold">ETHEREUM</span>
                <span className="text-label-caps font-label-caps px-2 py-1 bg-secondary-container/10 text-secondary border border-secondary/20 font-bold">USDT</span>
              </div>
            </button>
          </div>

          {/* CTA Area */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className="w-full max-w-sm py-4 rounded-lg bg-secondary-container text-primary-container font-h3 text-h3 font-bold shadow-md hover:bg-on-secondary-container/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
            >
              Continue to Payment
            </button>
            <p className="text-body-sm font-body-sm text-on-surface-variant/70 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              Secure 256-bit encrypted transaction
            </p>
          </div>
        </div>

        {/* Contextual Info Cards */}
        <div className="mt-8 grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface-alt p-4 rounded-lg border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary">speed</span>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim">PROCESSING</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Instant for Paystack. Crypto requires network confirmations.</p>
          </div>
          <div className="bg-surface-alt p-4 rounded-lg border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary">payments</span>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim">LIMITS</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Min: $10 (₦15,000) / Max: $10,000 per transaction.</p>
          </div>
          <div className="bg-surface-alt p-4 rounded-lg border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-secondary">support_agent</span>
              <span className="font-label-caps text-label-caps text-secondary-fixed-dim">SUPPORT</span>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant">Dedicated 24/7 priority support for premium creative members.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
