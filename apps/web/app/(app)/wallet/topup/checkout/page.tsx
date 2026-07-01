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
  const providerColor = method === 'crypto' ? 'text-secondary' : 'text-primary-container';

  // Load Paystack inline script
  useEffect(() => {
    if (method !== 'paystack') return;
    if (document.getElementById('paystack-script')) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'paystack-script';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError('Failed to load payment gateway. Please refresh and try again.');
    document.body.appendChild(script);
    return () => {
      const el = document.getElementById('paystack-script');
      if (el) el.remove();
    };
  }, [method]);

  const handlePaystackPayment = useCallback(async () => {
    if (!user?.email || !scriptLoaded) return;

    const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
    if (!publicKey) {
      setError('Payment not configured. Please contact support.');
      return;
    }

    const amountInKobo = currency === 'NGN'
      ? Math.round(fiatAmount * 100)
      : Math.round(fiatAmount * 100);

    const reference = generateReference();

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: user.email,
      amount: amountInKobo,
      currency,
      ref: reference,
      metadata: {
        userId: user.id,
        cmpAmount,
        walletId: wallet?.id,
      },
      callback: async (response) => {
        setIsProcessing(true);
        try {
          const verifyRes = await fetch('/api/payments/paystack/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              reference: response.reference,
              userId: user.id,
              cmpAmount,
            }),
          });

          const result = await verifyRes.json();

          if (!verifyRes.ok || !result.success) {
            throw new Error(result.error || 'Verification failed');
          }

          router.push(
            `/wallet/topup/success?amount=${fiatAmount}&method=paystack&coins=${result.coinsCredited}&ref=${response.reference}`
          );
        } catch (err: any) {
          setError(err.message || 'Payment verification failed. Your wallet may not be credited.');
          setIsProcessing(false);
        }
      },
      onClose: () => {
        setIsProcessing(false);
      },
    });

    handler.openIframe();
  }, [user, scriptLoaded, fiatAmount, currency, cmpAmount, wallet, router]);

  const handleCryptoPayment = useCallback(async () => {
    setIsProcessing(true);
    try {
      if (wallet && user) {
        const newBalance = (wallet.balance || 0) + cmpAmount;
        const { error: walletError } = await supabase
          .from('wallets')
          .update({ coin_balance: newBalance.toString() } as any)
          .eq('id', wallet.id);

        if (!walletError) {
          await supabase.from('coin_transactions').insert({
            wallet_id: wallet.id,
            user_id: user.id,
            type: 'TOPUP',
            amount: cmpAmount,
            balance_after: newBalance.toString(),
            description: `Top-up ${cmpAmount} CMP via ${providerName}`,
          } as any);
        }
      }
    } catch (error) {
      console.error('Top-up error:', error);
    }
    setTimeout(() => {
      router.push(`/wallet/topup/success?amount=${fiatAmount}&method=${method}&coins=${cmpAmount}`);
    }, 2000);
  }, [wallet, user, cmpAmount, providerName, fiatAmount, router]);

  const handleProceed = async () => {
    setError('');
    if (method === 'crypto') {
      await handleCryptoPayment();
    } else {
      await handlePaystackPayment();
    }
  };

  return (
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
                <div className="flex items-center gap-2">
                  <span className="text-white font-data-lg text-data-lg">
                    {currency === 'NGN' ? '₦' : '$'}{fiatAmount.toFixed(2)}
                  </span>
                </div>
                <span className="text-secondary-fixed-dim font-body-sm">{cmpAmount.toLocaleString()} CMP</span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-white text-center">
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-surface-alt flex items-center justify-center border-2 border-outline-variant/30">
                  <span className={`material-symbols-outlined text-4xl ${providerColor}`}>{providerIcon}</span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-success-verified text-white w-10 h-10 rounded-full flex items-center justify-center border-4 border-white">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-primary-container font-h3 text-h3 mb-3">
                  {method === 'crypto' ? `Redirecting to ${providerName}` : `Pay with ${providerName}`}
                </h3>
                <p className="text-on-surface-variant font-body-md text-body-md max-w-md mx-auto">
                  {method === 'crypto' ? (
                    <>You will be securely connected to <span className="font-bold text-primary">{providerName}</span> to complete payment of <strong>{currency === 'NGN' ? '₦' : '$'}{fiatAmount.toFixed(2)}</strong> for <strong>{cmpAmount.toLocaleString()} CMP</strong>.</>
                  ) : (
                    <>A secure <span className="font-bold text-primary">Paystack</span> popup will open to complete your payment of <strong>{currency === 'NGN' ? '₦' : '$'}{fiatAmount.toFixed(2)}</strong> for <strong>{cmpAmount.toLocaleString()} CMP</strong>.</>
                  )}
                </p>
              </div>

              {error && (
                <div className="w-full mb-6 p-4 rounded-lg bg-error/10 border border-error/30 text-error text-sm font-body-sm text-left">
                  {error}
                </div>
              )}

              <button
                onClick={handleProceed}
                disabled={isProcessing || (method === 'paystack' && (!scriptLoaded || !user?.email))}
                className={`w-full md:w-auto px-12 py-5 bg-secondary-container hover:bg-secondary transition-all duration-300 rounded-lg text-on-secondary-fixed font-bold text-body-lg shadow-lg flex items-center justify-center gap-3 group ${isProcessing ? 'opacity-80 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {isProcessing ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
                ) : method === 'paystack' && !scriptLoaded ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Loading payment gateway...</>
                ) : (
                  <><span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock_open</span> Proceed to Secure Payment</>
                )}
              </button>

              <p className="mt-6 text-on-surface-variant/60 font-body-sm text-body-sm italic">
                {method === 'paystack'
                  ? 'A popup will open to complete your payment. Please disable popup blockers.'
                  : 'Click above if you are not redirected automatically within 5 seconds.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
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
