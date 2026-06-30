'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fiatAmount = parseFloat(searchParams?.get('amount') || '0');
  const method = searchParams?.get('method') || 'paystack';
  const cmpAmount = parseInt(searchParams?.get('cmp') || '0');
  const { wallet } = useWallet();
  const { user } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const providerName = method === 'crypto' ? 'NowPayments' : 'Paystack';
  const providerIcon = method === 'crypto' ? 'currency_bitcoin' : 'account_balance';
  const providerColor = method === 'crypto' ? 'text-secondary' : 'text-primary-container';

  const handleProceed = async () => {
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
                  <span className="text-white font-data-lg text-data-lg">${fiatAmount.toFixed(2)}</span>
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
                <h3 className="text-primary-container font-h3 text-h3 mb-3">Redirecting to {providerName}</h3>
                <p className="text-on-surface-variant font-body-md text-body-md max-w-md mx-auto">
                  You will be securely connected to <span className="font-bold text-primary">{providerName}</span> to complete payment of <strong>${fiatAmount.toFixed(2)}</strong> for <strong>{cmpAmount.toLocaleString()} CMP</strong>.
                </p>
              </div>

              <button
                onClick={handleProceed}
                disabled={isProcessing}
                className={`w-full md:w-auto px-12 py-5 bg-secondary-container hover:bg-secondary transition-all duration-300 rounded-lg text-on-secondary-fixed font-bold text-body-lg shadow-lg flex items-center justify-center gap-3 group ${isProcessing ? 'opacity-80 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {isProcessing ? (
                  <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
                ) : (
                  <><span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">lock_open</span> Proceed to Secure Payment</>
                )}
              </button>

              <p className="mt-6 text-on-surface-variant/60 font-body-sm text-body-sm italic">
                Click above if you are not redirected automatically within 5 seconds.
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
