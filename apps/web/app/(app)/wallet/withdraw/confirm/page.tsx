'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWithdrawStore } from '@/stores/withdrawStore';
import { useWallet } from '@/lib/useWallet';
import { useCurrency } from '@/lib/useCurrency';

export default function WithdrawConfirmPage() {
  const router = useRouter();
  const { amountCoins, selectedAccount, setTransactionId, reset } = useWithdrawStore();
  const { wallet } = useWallet();
  const { activeRate, formatFiat, loadingLocation } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (amountCoins <= 0 || !selectedAccount) {
      router.replace('/wallet/withdraw');
    }
  }, [amountCoins, selectedAccount, router]);

  const fiatAmount = amountCoins * 10.50;
  const processingFee = fiatAmount * 0.015;
  const finalAmount = fiatAmount - processingFee;

  const handleConfirm = async () => {
    if (!wallet || !selectedAccount) return;
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const accountDetails = {
        account_id: selectedAccount.id,
        type: selectedAccount.type,
        account_name: selectedAccount.account_name,
        account_number: selectedAccount.account_number,
        bank_name: selectedAccount.bank_name,
        network: selectedAccount.network,
      };

      const { data: requestId, error } = await supabase.rpc('request_withdrawal', {
        p_user_id: user.id,
        p_wallet_id: wallet.id,
        p_coin_amount: amountCoins,
        p_fiat_amount: finalAmount.toFixed(2),
        p_account_details: accountDetails,
      });

      if (error) throw new Error(error.message);

      setTransactionId(requestId as string);
      setIsSuccess(true);

      setTimeout(() => {
        reset();
        router.push('/wallet/receipt');
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Withdrawal failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden fixed inset-0 z-50 bg-background overflow-y-auto">
        {/* Top App Bar */}
        <header className="sticky top-0 z-50 bg-primary-container text-on-primary shadow-md w-full h-16 flex items-center justify-between px-margin-mobile">
          <div className="flex items-center gap-4">
            <Link href="/wallet/withdraw/bank" className="material-symbols-outlined text-on-primary hover:opacity-80 scale-95 transition-transform">
              arrow_back
            </Link>
            <div className="flex flex-col">
              <h1 className="font-headline-md text-headline-md leading-tight">Confirm Withdrawal</h1>
              <span className="font-label-caps text-label-caps text-on-primary-container">STEP 3 OF 3</span>
            </div>
          </div>
          <div className="font-headline-md text-headline-md font-bold text-gold-metallic">CMPapp</div>
        </header>

        <main className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin-desktop mt-stack-md flex flex-col gap-stack-md pb-24">
          {/* Progress Steps */}
          <div className="flex justify-between items-center px-4 mb-stack-sm">
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
            </div>
            <div className="flex-1 h-[2px] bg-success mx-2"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </div>
            </div>
            <div className="flex-1 h-[2px] bg-gold-metallic mx-2"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full bg-primary-container text-gold-metallic flex items-center justify-center font-bold shadow-[0_0_0_4px_rgba(184,134,11,0.15)]">3</div>
            </div>
          </div>

          {/* Main Icon */}
          <div className="flex justify-center my-stack-sm">
            <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-gold-metallic text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
            </div>
          </div>

          {errorMsg && (
            <p className="font-body-sm text-error-alert text-center mb-4 bg-error/10 py-2 px-4 rounded-lg">{errorMsg}</p>
          )}

          {/* Summary Box */}
          <div className="bg-white rounded-xl p-stack-md flex flex-col gap-stack-sm shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)] border-t border-gold-metallic">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-muted font-label-caps">AMOUNT TO WITHDRAW</span>
              <span className="font-numeric-display text-gold-metallic">{amountCoins.toLocaleString()} CMP</span>
            </div>
            <div className="h-[1px] bg-surface-variant w-full my-2"></div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-muted">Exchange Rate</span>
                <span className="font-numeric-display text-on-surface">1 CMP = ₦10.50</span>
              </div>
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-muted">Withdrawal Fee (1.5%)</span>
                <span className="font-numeric-display text-error">- ₦{processingFee.toFixed(2)}</span>
              </div>
            </div>
            <div className="h-[1px] bg-surface-variant w-full my-2"></div>
            <div className="flex justify-between items-center py-2">
              <span className="font-bold text-on-surface">Total to Receive</span>
              <span className="font-numeric-display text-primary-container text-[24px] font-bold">₦{finalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Destination Card */}
          <div className="bg-white rounded-xl p-stack-md flex items-center gap-4 shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)]">
            <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                {selectedAccount?.type === 'NGN_BANK' ? 'account_balance' : 'currency_bitcoin'}
              </span>
            </div>
            <div className="flex flex-col flex-1">
              <span className="font-label-caps text-on-surface-muted">DESTINATION ACCOUNT</span>
              <h3 className="font-bold text-on-surface">{selectedAccount?.bank_name || selectedAccount?.network || 'Account'} &bull; {selectedAccount?.account_name}</h3>
              <p className="text-body-sm text-on-surface-muted font-numeric-display">
                {selectedAccount?.type === 'NGN_BANK' ? `**** ${selectedAccount?.account_number?.slice(-4)}` : `${selectedAccount?.account_number?.slice(0, 6)}...${selectedAccount?.account_number?.slice(-4)}`}
              </p>
            </div>
            <Link href="/wallet/withdraw/bank" className="text-gold-deep font-label-caps hover:underline">CHANGE</Link>
          </div>

          {/* Info Alert */}
          <div className="bg-surface-container-low border-l-4 border-gold-metallic p-stack-md rounded-r-lg flex gap-3">
            <span className="material-symbols-outlined text-gold-metallic">info</span>
            <p className="text-body-sm text-on-surface-variant">
              {amountCoins.toLocaleString()} CMP will be withheld from your wallet immediately. Funds will be returned if the request is rejected.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-stack-md flex flex-col gap-stack-sm items-center">
            <button
              onClick={handleConfirm}
              disabled={isLoading || isSuccess}
              className={`w-full h-14 rounded-lg font-bold text-body-lg shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${
                isSuccess
                  ? 'bg-success text-white'
                  : 'bg-primary-container text-on-primary hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isSuccess ? (
                <>Request Submitted <span className="material-symbols-outlined">check_circle</span></>
              ) : isLoading ? (
                <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
              ) : (
                <>Submit Withdrawal Request</>
              )}
            </button>
            {!isSuccess && (
              <Link href="/wallet/withdraw/bank" className="text-gold-deep font-label-caps hover:text-gold-metallic transition-colors py-2">
                Change withdrawal account
              </Link>
            )}
          </div>
        </main>
      </div>

      {/* Desktop/Tablet View */}
      <main className="hidden lg:flex flex-1 items-center justify-center pb-24 md:pb-12 px-margin-mobile min-h-[calc(100vh-80px)]">
        <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 w-full max-w-lg shadow-sm border border-outline-variant/30 mt-4">
          <div className="w-full flex justify-between items-center mb-8 text-on-surface-variant">
            <Link href="/wallet/withdraw/bank" className="material-symbols-outlined hover:text-primary-container transition-colors">arrow_back</Link>
            <div className="font-label-caps text-label-caps text-on-primary-container tracking-wider">STEP 3 OF 3</div>
            <div className="w-6"></div>
          </div>

          <div className="w-full flex items-center justify-between mb-8 px-2 relative">
            <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
            <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
              <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="font-label-caps text-label-caps text-success-verified">Amount</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
              <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="font-label-caps text-label-caps text-success-verified">Account</span>
            </div>
            <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm border-[1.5px] border-[#B8860B]">3</div>
              <span className="font-label-caps text-label-caps text-on-surface">Confirm</span>
            </div>
          </div>

          <div className="bg-primary-container/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>receipt_long</span>
          </div>

          <h1 className="font-h3 text-h3 text-on-surface text-center mb-2">Confirm Withdrawal</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-8">
            Review the details before submitting your request.
          </p>

          {errorMsg && (
            <p className="font-body-sm text-error-alert text-center mb-4 bg-error/10 py-2 px-4 rounded-lg">{errorMsg}</p>
          )}

          <div className="space-y-4 mb-8">
            <div className="bg-surface-alt rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Amount</span>
                <div className="flex items-center gap-2">
                  <img src="/coin.png" alt="" className="w-4 h-4 object-contain" />
                  <span className="font-data-md text-data-md text-on-surface font-semibold">{amountCoins.toLocaleString()} CMP</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Exchange Rate</span>
                <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Fee (1.5%)</span>
                <span className="font-data-md text-data-md text-error-alert">- ₦{processingFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-outline-variant/50 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-body-md text-body-md font-semibold text-on-surface">You will receive</span>
                  <span className="font-data-lg text-data-lg text-success-verified font-bold">₦{finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface-alt rounded-lg p-4">
              <div className="font-body-sm text-body-sm text-on-surface-variant mb-2">Destination Account</div>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selectedAccount?.type === 'NGN_BANK' ? 'bg-[#E5F3FF] text-primary' : 'bg-[#FFF3E0] text-secondary'}`}>
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {selectedAccount?.type === 'NGN_BANK' ? 'account_balance' : 'currency_bitcoin'}
                  </span>
                </div>
                <div>
                  <div className="font-body-md text-body-md font-semibold text-on-surface">{selectedAccount?.account_name}</div>
                  <div className="font-data-md text-data-md text-on-surface-variant">
                    {selectedAccount?.type === 'NGN_BANK'
                      ? `${selectedAccount.bank_name} • ${selectedAccount.account_number}`
                      : `${selectedAccount?.network} • ${selectedAccount?.account_number?.slice(0, 8)}...`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-8 flex items-start gap-3">
            <span className="material-symbols-outlined text-warning text-lg">info</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {amountCoins.toLocaleString()} CMP will be withheld from your wallet immediately. If rejected, the full amount will be returned.
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={isLoading || isSuccess}
            className={`w-full font-body-md text-body-md font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2 ${
              isSuccess
                ? 'bg-success-verified text-white'
                : 'bg-primary text-on-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {isSuccess ? (
              <>Request Submitted <span className="material-symbols-outlined">check_circle</span></>
            ) : isLoading ? (
              <><span className="material-symbols-outlined animate-spin">progress_activity</span> Processing...</>
            ) : (
              <>Submit Withdrawal Request</>
            )}
          </button>

          {!isSuccess && (
            <Link href="/wallet/withdraw/bank" className="block text-center mt-4 font-body-sm text-body-sm text-primary hover:underline underline-offset-4">
              Change account
            </Link>
          )}
        </div>
      </main>
    </>
  );
}
