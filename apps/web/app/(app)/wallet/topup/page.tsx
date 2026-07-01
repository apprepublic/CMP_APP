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
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden">
        <header className="fixed top-0 w-full z-50 bg-primary-container h-16 flex items-center px-margin-mobile shadow shadow-black/15">
          <div className="flex items-center w-full">
            <button className="p-2 -ml-2 active:scale-95 transition-transform" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
            </button>
            <h1 className="ml-4 font-headline-md text-headline-md-mobile text-on-primary-fixed">Top-up Wallet</h1>
          </div>
        </header>

        <main className="flex-grow pt-24 pb-32 px-margin-mobile w-full mx-auto bg-background min-h-screen">
          <div className="mb-stack-lg">
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-container">Select Payment Method</h2>
            <p className="text-on-surface-muted font-body-sm mt-1">Choose your preferred provider to fund your account securely.</p>
          </div>

          <div className="grid grid-cols-1 gap-stack-md">
            {/* Paystack Card */}
            <button
              onClick={() => setSelectedMethod('paystack')}
              className={`w-full p-stack-md rounded-lg text-left flex flex-col relative group transition-all ${
                selectedMethod === 'paystack'
                  ? 'shadow-[inset_4px_4px_8px_rgba(13,27,53,0.1),inset_-4px_-4px_8px_rgba(255,255,255,1)] border-2 border-gold-metallic bg-white'
                  : 'shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] border-2 border-transparent bg-white'
              }`}
            >
              {selectedMethod === 'paystack' && <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-metallic rounded-t-lg"></div>}
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary-container/5 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary-container text-[32px]">credit_card</span>
                </div>
                <span className={`transition-opacity ${selectedMethod === 'paystack' ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="material-symbols-outlined text-gold-metallic">check_circle</span>
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary-container">Paystack</h3>
              <p className="text-on-surface-muted font-body-sm mb-6">Cards, Bank Transfer, NGN</p>
              <div className="flex gap-2 mt-auto">
                <span className="bg-surface-container px-2 py-1 rounded text-[10px] font-label-caps uppercase text-on-surface-variant">Visa</span>
                <span className="bg-surface-container px-2 py-1 rounded text-[10px] font-label-caps uppercase text-on-surface-variant">Mastercard</span>
                <span className="bg-surface-container px-2 py-1 rounded text-[10px] font-label-caps uppercase text-on-surface-variant">Verve</span>
              </div>
            </button>

            {/* NowPayments Card */}
            <button
              onClick={() => setSelectedMethod('crypto')}
              className={`w-full p-stack-md rounded-lg text-left flex flex-col relative group transition-all ${
                selectedMethod === 'crypto'
                  ? 'shadow-[inset_4px_4px_8px_rgba(13,27,53,0.1),inset_-4px_-4px_8px_rgba(255,255,255,1)] border-2 border-gold-metallic bg-white'
                  : 'shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)] border-2 border-transparent bg-white'
              }`}
            >
              {selectedMethod === 'crypto' && <div className="absolute top-0 left-0 w-full h-[2px] bg-gold-metallic rounded-t-lg"></div>}
              <div className="flex justify-between items-start mb-4">
                <div className="bg-primary-container/5 p-3 rounded-xl">
                  <span className="material-symbols-outlined text-primary-container text-[32px]">currency_bitcoin</span>
                </div>
                <span className={`transition-opacity ${selectedMethod === 'crypto' ? 'opacity-100' : 'opacity-0'}`}>
                  <span className="material-symbols-outlined text-gold-metallic">check_circle</span>
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary-container">NowPayments</h3>
              <p className="text-on-surface-muted font-body-sm mb-6">Crypto: BTC, ETH, USDT</p>
              <div className="flex gap-2 mt-auto">
                <span className="bg-surface-container px-2 py-1 rounded text-[10px] font-label-caps uppercase text-on-surface-variant">BTC</span>
                <span className="bg-surface-container px-2 py-1 rounded text-[10px] font-label-caps uppercase text-on-surface-variant">ERC-20</span>
                <span className="bg-surface-container px-2 py-1 rounded text-[10px] font-label-caps uppercase text-on-surface-variant">TRC-20</span>
              </div>
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-stack-lg flex items-center gap-3 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
            <span className="material-symbols-outlined text-gold-metallic" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <p className="text-body-sm text-on-surface-muted">All transactions are encrypted and secured with bank-grade protocols.</p>
          </div>
        </main>

        {/* Fixed Bottom Bar */}
        <footer className="fixed bottom-0 w-full bg-surface py-6 px-margin-mobile shadow-[0px_-4px_20px_rgba(13,27,53,0.05)]">
          <div className="w-full">
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className={`w-full py-4 rounded-lg font-headline-md text-headline-md transition-all duration-300 active:scale-95 ${
                selectedMethod
                  ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20'
                  : 'bg-surface-container text-on-surface-muted cursor-not-allowed'
              }`}
            >
              Continue
            </button>
          </div>
        </footer>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <main className="flex-1 pb-24 md:pb-12 min-h-screen">
          <section className="relative bg-primary-container h-64 flex flex-col justify-center items-center text-center overflow-hidden">
            <div className="relative z-10 px-margin-mobile">
              <h1 className="font-h1 text-h1 text-on-primary mb-2">Fund Your Account</h1>
              <p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl">Secure and instant top-ups to power your creative enterprise.</p>
            </div>
          </section>

          <section className="max-w-4xl mx-auto -mt-16 px-margin-mobile relative z-20">
            <div className="bg-surface-container-lowest rounded-xl shadow-xl p-8 border border-outline-variant/30">
              <div className="mb-10 text-center">
                <h2 className="font-h2 text-h2 text-primary-container mb-2">Select Top-up Method</h2>
                <p className="text-on-surface-variant font-body-md">Choose your preferred provider to proceed with the transaction.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">
                <button onClick={() => setSelectedMethod('paystack')}
                  className={`cursor-pointer group relative p-6 rounded-xl border-2 bg-surface-alt text-left transition-all duration-300 ease-in-out ${selectedMethod === 'paystack' ? 'border-[#B8860B] bg-[#B8860B]/5' : 'border-transparent hover:border-secondary-fixed'}`}>
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

                <button onClick={() => setSelectedMethod('crypto')}
                  className={`cursor-pointer group relative p-6 rounded-xl border-2 bg-surface-alt text-left transition-all duration-300 ease-in-out ${selectedMethod === 'crypto' ? 'border-[#B8860B] bg-[#B8860B]/5' : 'border-transparent hover:border-secondary-fixed'}`}>
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

              <div className="flex flex-col items-center gap-4">
                <button onClick={handleContinue} disabled={!selectedMethod}
                  className="w-full max-w-sm py-4 rounded-lg bg-secondary-container text-primary-container font-h3 text-h3 font-bold shadow-md hover:bg-on-secondary-container/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95">
                  Continue to Payment
                </button>
                <p className="text-body-sm font-body-sm text-on-surface-variant/70 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Secure 256-bit encrypted transaction
                </p>
              </div>
            </div>

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
      </div>
    </>
  );
}
