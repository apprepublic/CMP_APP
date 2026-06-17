'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@/lib/useWallet';
import { useUserStore } from '@/stores/userStore';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amountStr = searchParams?.get('amount') || '0';
  const method = searchParams?.get('method') || 'paystack';
  const { wallet } = useWallet();
  const { user } = useUserStore();

  const [amount, setAmount] = useState(parseFloat(amountStr));
  const [isProcessing, setIsProcessing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Show toast after 2 seconds
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProceed = async () => {
    setIsProcessing(true);

    try {
      if (wallet && user) {
        // Calculate the coins equivalent (for example, 1 USD = 1500 CMP, or just use the amount directly depending on logic)
        // From previous flow, if it's usd, we can just say 1 USD = 1000 CMP for demo.
        const conversionRate = 1000;
        const coinsToAdd = amount * conversionRate;
        const newBalance = (wallet.coin_balance || 0) + coinsToAdd;

        // In a real app, this would happen in a secure backend webhook
        // For the demo, we update it from the client directly.
        // @ts-ignore
        const { error: walletError } = await supabase
          .from('wallets')
          .update({ coin_balance: newBalance } as any)
          .eq('id', wallet.id);

        if (!walletError) {
          // Record transaction
          await supabase.from('coin_transactions').insert({
            wallet_id: wallet.id,
            type: 'TOPUP',
            amount: coinsToAdd,
            balance_after: newBalance.toString(),
            description: `Top up via ${method}`,
          } as any);
        }
      }
    } catch (error) {
      console.error("Top-up simulation error:", error);
    }

    // Simulate redirect delay to success page
    setTimeout(() => {
      router.push(`/wallet/topup/success?amount=${amount}&method=${method}&coins=${amount * 1000}`);
    }, 2000);
  };

  const providerName = method === 'crypto' ? 'NowPayments' : 'Paystack';
  const providerIcon = method === 'crypto' ? 'currency_bitcoin' : 'account_balance';
  const providerColor = method === 'crypto' ? 'text-secondary' : 'text-primary-container';

  return (
    <main className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden bg-surface lg:ml-64">
      {/* Main Transactional Shell */}
      <div className="max-w-2xl w-full mx-margin-mobile z-10 my-12">
        <div className="bg-primary-container rounded-xl shadow-xl overflow-hidden border border-white/10">
          {/* Header Status Area */}
          <div className="bg-white/5 p-8 border-b border-white/5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                  <span className="text-secondary-fixed-dim font-label-caps text-label-caps tracking-widest uppercase">SECURE CHECKOUT</span>
                </div>
                <h2 className="text-white font-h2 text-h2 mb-1">Finalizing Transaction</h2>
                <p className="text-on-primary-container font-body-sm text-body-sm max-w-sm">
                  You're one step away from fueling the creative economy. Your assets are secured with bank-grade encryption.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg border border-white/10 flex flex-col items-end">
                <span className="text-on-primary-container font-label-caps text-label-caps mb-1 uppercase">TOTAL AMOUNT</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[14px] text-on-secondary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                  </div>
                  <span className="text-white font-data-lg text-data-lg">${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Interstitial Content */}
          <div className="p-8 md:p-12 bg-white text-center">
            <div className="flex flex-col items-center">
              {/* Provider Logo Placeholder / Context */}
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
                  We are securely connecting you to <span className="font-bold text-primary">{providerName}</span> to complete your payment. This process is encrypted and your sensitive details are never stored on our servers.
                </p>
              </div>
              
              {/* Action Area */}
              <button
                onClick={handleProceed}
                disabled={isProcessing}
                className={`w-full md:w-auto px-12 py-5 bg-secondary-container hover:bg-secondary transition-all duration-300 rounded-lg text-on-secondary-fixed font-bold text-body-lg shadow-lg flex items-center justify-center gap-3 group ${isProcessing ? 'opacity-80 cursor-not-allowed' : 'active:scale-95'}`}
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                    Redirecting...
                  </>
                ) : (
                  <>
                    Proceed to Secure Payment
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </>
                )}
              </button>
              
              {/* Secondary Explanation */}
              <p className="mt-6 text-on-surface-variant/60 font-body-sm text-body-sm italic">
                Click above if you are not redirected automatically within 5 seconds.
              </p>
              
              {/* Trust Badges */}
              <div className="mt-12 pt-8 border-t border-outline-variant/30 w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center opacity-70">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container">security</span>
                    <span className="font-label-caps text-[10px] text-outline uppercase">PCI DSS COMPLIANT</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container">enhanced_encryption</span>
                    <span className="font-label-caps text-[10px] text-outline uppercase">256-BIT SSL</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container">shield_with_heart</span>
                    <span className="font-label-caps text-[10px] text-outline uppercase">FRAUD PROTECTION</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-primary-container">lock_reset</span>
                    <span className="font-label-caps text-[10px] text-outline uppercase">PRIVATE DATA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contextual Information Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface-alt p-6 rounded-xl border border-outline-variant/20 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
            </div>
            <div>
              <h4 className="font-bold text-on-surface font-body-md text-body-md">Need Help?</h4>
              <p className="text-on-surface-variant font-body-sm text-body-sm">Contact our 24/7 creative support desk for payment issues.</p>
            </div>
          </div>
          <div className="bg-surface-alt p-6 rounded-xl border border-outline-variant/20 flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
            </div>
            <div>
              <h4 className="font-bold text-on-surface font-body-md text-body-md">Pending Transaction</h4>
              <p className="text-on-surface-variant font-body-sm text-body-sm">Ref ID: CE-99283-XP. Save this for your records.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ad-Gate Style Notification for "Limited Time Offer" */}
      <div className={`fixed bottom-8 right-8 z-[100] transform transition-transform duration-500 ease-out ${showToast ? 'translate-y-0' : 'translate-y-40'}`}>
        <div className="bg-white rounded-xl shadow-2xl p-4 border-l-4 border-secondary flex items-center gap-4 max-w-sm">
          <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-secondary-fixed">token</span>
          </div>
          <div>
            <p className="text-primary-container font-bold font-body-sm text-body-sm">+500 Credits Reward</p>
            <p className="text-on-surface-variant text-[12px]">Complete this payment in 5 mins to earn bonus creative credits.</p>
          </div>
          <button className="text-outline hover:text-primary transition-colors ml-auto" onClick={() => setShowToast(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
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
