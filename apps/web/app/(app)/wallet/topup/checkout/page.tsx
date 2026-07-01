'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string;
        email: string;
        amount: number;
        currency?: string;
        ref?: string;
        metadata?: Record<string, any>;
        callback: (response: { reference: string; trxref?: string }) => void;
        onClose: () => void;
      }) => { openIframe: () => void };
    };
  }
}

function generateReference(): string {
  return `CMP-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fiatAmount = parseFloat(searchParams?.get('amount') || '0');
  const method = searchParams?.get('method') || 'paystack';
  const cmpAmount = parseInt(searchParams?.get('cmp') || '0');
  const currency = searchParams?.get('currency') || 'USD';
  const { wallet } = useWallet();
  const { user } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const providerName = method === 'crypto' ? 'NowPayments' : 'Paystack';
  const providerIcon = method === 'crypto' ? 'currency_bitcoin' : 'account_balance';
  const symbol = currency === 'NGN' ? '₦' : '$';

  // Load Paystack inline script
  useEffect(() => {
    if (method !== 'paystack') return;
    const existing = document.getElementById('paystack-script');
    if (existing) {
      if (typeof window.PaystackPop !== 'undefined') setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load payment gateway. Please refresh and try again.');
    document.body.appendChild(script);
  }, [method]);

  const handlePaystackPayment = useCallback(() => {
    if (!user?.email || !scriptLoaded) return;
    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) { setError('Payment not configured. Please contact support.'); return; }
    if (typeof window.PaystackPop === 'undefined') { setError('Payment gateway not loaded. Please refresh and try again.'); return; }
    setIsProcessing(true);
    const amountInKobo = Math.round(fiatAmount * 100);
    const reference = generateReference();
    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: user.email,
        amount: amountInKobo,
        currency,
        ref: reference,
        metadata: { userId: user.id, cmpAmount, walletId: wallet?.id },
        callback: function (response) {
          supabase.functions.invoke('payments-paystack-verify', { body: { reference: response.reference, cmpAmount } })
            .then(function (result) {
              if (result.error) throw new Error(result.error);
              if (!result.data?.success) throw new Error(result.data?.error || 'Verification failed');
              router.push('/wallet/topup/success?amount=' + fiatAmount + '&method=paystack&coins=' + result.data.coinsCredited + '&ref=' + response.reference);
            })
            .catch(function (err) {
              setError(err.message || 'Payment verification failed. Your wallet may not be credited.');
              setIsProcessing(false);
            });
        },
        onClose: function () { setIsProcessing(false); },
      });
      handler.openIframe();
    } catch (err: any) {
      setError(err.message || 'Failed to open payment popup.');
      setIsProcessing(false);
    }
  }, [user, scriptLoaded, fiatAmount, currency, cmpAmount, wallet, router]);

  const handleCryptoPayment = useCallback(async () => {
    setIsProcessing(true);
    try {
      if (wallet && user) {
        const newBalance = (wallet.balance || 0) + cmpAmount;
        const { error: walletError } = await supabase.from('wallets').update({ coin_balance: newBalance.toString() } as any).eq('id', wallet.id);
        if (!walletError) {
          await supabase.from('coin_transactions').insert({
            wallet_id: wallet.id, user_id: user.id, type: 'TOPUP', amount: cmpAmount,
            balance_after: newBalance.toString(), description: 'Top-up ' + cmpAmount + ' CMP via ' + providerName,
          } as any);
        }
      }
    } catch (error) { console.error('Top-up error:', error); }
    setTimeout(() => { router.push('/wallet/topup/success?amount=' + fiatAmount + '&method=' + method + '&coins=' + cmpAmount); }, 2000);
  }, [wallet, user, cmpAmount, providerName, fiatAmount, router]);

  const handleProceed = async () => {
    setError('');
    if (method === 'crypto') { await handleCryptoPayment(); }
    else { await handlePaystackPayment(); }
  };

  return (
    <>
      {/* ==================== MOBILE LAYOUT ==================== */}
      <div className="block md:hidden bg-background text-on-surface font-body-md min-h-screen flex flex-col secure-mesh">
        <style>{`
          .secure-mesh {
            background-image: radial-gradient(circle at 2px 2px, rgba(13,27,53,0.03) 1px, transparent 0);
            background-size: 24px 24px;
          }
        `}</style>
        <header className="fixed top-0 w-full z-50 h-16 bg-primary-container flex justify-between items-center px-margin-mobile shadow shadow-black/15">
          <div className="flex items-center gap-stack-sm">
            <button className="p-2 active:scale-95 transition-transform" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
            </button>
            <h1 className="font-headline-md text-headline-md-mobile text-on-primary font-bold">Secure Checkout</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-gold-metallic" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          </div>
        </header>

        <main className="flex-grow pt-24 pb-stack-lg px-margin-mobile w-full mx-auto">
          {/* Security Hero */}
          <div className="text-center mb-stack-lg animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center p-stack-md rounded-full bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,1)] mb-stack-md">
              <span className="material-symbols-outlined text-gold-metallic scale-150" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-container">Final Verification</h2>
            <p className="text-on-surface-variant font-body-sm px-4 mt-2">Confirm your transaction details before we redirect you to our secure payment partner.</p>
          </div>

          {/* Summary Card */}
          <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,1)] rounded-xl p-stack-md mb-stack-md border-t-2 border-gold-metallic">
            <div className="flex justify-between items-start mb-stack-lg">
              <div>
                <p className="text-label-caps font-label-caps text-on-surface-muted uppercase">Provider</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-container">{providerIcon}</span>
                  </div>
                  <span className="font-body-lg text-body-lg text-primary-container font-bold">{providerName} Secure</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-label-caps font-label-caps text-on-surface-muted uppercase">Total Amount</p>
                <p className="font-numeric-display text-numeric-display text-primary-container mt-1">{symbol}{fiatAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="shadow-[inset_4px_4px_8px_rgba(13,27,53,0.08),inset_-4px_-4px_8px_rgba(255,255,255,1)] bg-surface-container-low rounded-lg p-stack-md space-y-stack-sm">
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-body-sm">CMP to credit</span>
                <span className="font-numeric-display text-body-md text-primary-container">{cmpAmount.toLocaleString()} CMP</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-body-sm">Processing Time</span>
                <span className="text-success font-body-sm font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">bolt</span> Instant
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-on-surface-variant font-body-sm">Status</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary-container/5 rounded-full border border-primary-container/10">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                  <span className="text-primary-container font-label-caps text-[10px] uppercase font-bold">Ready</span>
                </div>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="flex justify-center mb-stack-lg">
            <div className="inline-flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px] text-on-primary-fixed-variant">encrypted</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">256-bit Encrypted & Secure Connection</span>
            </div>
          </div>

          {error && (
            <div className="w-full mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm text-left">{error}</div>
          )}

          {/* Action Section */}
          <div className="space-y-stack-md">
            <button
              onClick={handleProceed}
              disabled={isProcessing || (method === 'paystack' && (!scriptLoaded || !user?.email))}
              className={`w-full font-headline-md text-body-lg py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg active:scale-[0.98] transition-all duration-200 border transition-all ${
                isProcessing || (method === 'paystack' && (!scriptLoaded || !user?.email))
                  ? 'bg-surface-container text-on-surface-muted cursor-not-allowed'
                  : 'bg-secondary-container text-on-secondary-container border-gold-metallic/20'
              }`}
            >
              {isProcessing ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
              ) : method === 'paystack' && !scriptLoaded ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Loading payment gateway...</>
              ) : (
                <>Proceed to Secure Payment <span className="material-symbols-outlined">arrow_forward</span></>
              )}
            </button>
            <button className="w-full text-center py-2 active:opacity-60 transition-opacity" onClick={() => window.history.back()}>
              <span className="text-on-surface-variant font-body-sm border-b border-outline-variant">Cancel and return to wallet</span>
            </button>
          </div>

          {/* Merchant Info */}
          <div className="mt-stack-lg flex flex-col items-center gap-stack-sm opacity-60">
            <p className="text-[10px] font-label-caps text-on-surface-muted">SECURED BY CMP-SHIELD v2.4</p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-on-surface-muted text-[20px]">security</span>
              <span className="material-symbols-outlined text-on-surface-muted text-[20px]">verified</span>
              <span className="material-symbols-outlined text-on-surface-muted text-[20px]">workspace_premium</span>
            </div>
          </div>
        </main>

        <div className="fixed bottom-0 left-0 w-full h-1 bg-gold-metallic"></div>
      </div>

      {/* ==================== DESKTOP/TABLET LAYOUT ==================== */}
      <div className="hidden md:block">
        <main className="flex-1 min-h-screen flex items-center justify-center relative overflow-hidden bg-surface">
          <div className="max-w-2xl w-full mx-margin-mobile z-10 my-12">
            <div className="bg-primary-container rounded-xl shadow-xl overflow-hidden border border-white/10">
              <div className="bg-white/5 p-8 border-b border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                      <span className="text-secondary-fixed-dim font-label-caps text-label-caps tracking-widest uppercase">SECURE CHECKOUT</span>
                    </div>
                    <h2 className="text-white font-h2 text-h2 mb-1">Finalizing Transaction</h2>
                    <p className="text-on-primary-container font-body-sm text-body-sm max-w-sm">
                      You are about to add <strong>{cmpAmount.toLocaleString()} CMP</strong> to your wallet.
                    </p>
                  </div>
                  <div className="bg-white/10 p-4 rounded-lg border border-white/10 flex flex-col items-end">
                    <span className="text-on-primary-container font-label-caps text-label-caps mb-1 uppercase">AMOUNT</span>
                    <span className="text-white font-data-lg text-data-lg">{symbol}{fiatAmount.toFixed(2)}</span>
                    <span className="text-secondary-fixed-dim font-body-sm">{cmpAmount.toLocaleString()} CMP</span>
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-12 bg-white text-center">
                <div className="flex flex-col items-center">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 rounded-full bg-surface-alt flex items-center justify-center border-2 border-outline-variant/30">
                      <span className="material-symbols-outlined text-4xl text-primary-container">{providerIcon}</span>
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-success-verified text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                    </div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-primary-container font-h3 text-h3 mb-3">Pay with {providerName}</h3>
                    <p className="text-on-surface-variant font-body-md text-body-md max-w-md mx-auto">
                      A secure <span className="font-bold text-primary">{providerName}</span> popup will open to complete your payment of <strong>{symbol}{fiatAmount.toFixed(2)}</strong> for <strong>{cmpAmount.toLocaleString()} CMP</strong>.
                    </p>
                  </div>

                  {error && (
                    <div className="w-full mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm text-left">{error}</div>
                  )}

                  <button onClick={handleProceed} disabled={isProcessing || (method === 'paystack' && (!scriptLoaded || !user?.email))}
                    className={`w-full md:w-auto px-12 py-5 bg-secondary-container hover:bg-secondary transition-all duration-300 rounded-lg text-on-secondary-fixed font-bold text-body-lg shadow-lg flex items-center justify-center gap-3 group ${isProcessing ? 'opacity-80 cursor-not-allowed' : 'active:scale-95'}`}>
                    {isProcessing ? (
                      <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
                    ) : method === 'paystack' && !scriptLoaded ? (
                      <><span className="material-symbols-outlined animate-spin">progress_activity</span> Loading payment gateway...</>
                    ) : (
                      <><span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock_open</span> Proceed to Secure Payment</>
                    )}
                  </button>
                  <p className="mt-6 text-on-surface-variant/60 font-body-sm text-body-sm italic">
                    A popup will open to complete your payment. Please disable popup blockers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
