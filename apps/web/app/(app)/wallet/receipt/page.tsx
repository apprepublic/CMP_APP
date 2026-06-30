'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWithdrawStore } from '@/stores/withdrawStore';

export default function TransactionReceiptPage() {
  const router = useRouter();
  const { amountCoins, selectedAccount, transactionId, reset } = useWithdrawStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    reset();
    router.push('/dashboard');
  };

  if (!mounted) return null;

  const fiatAmount = amountCoins * 10.50;
  const processingFee = fiatAmount * 0.015;
  const finalAmount = fiatAmount - processingFee;

  return (
    <div className="flex-1 bg-surface-container-low min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-gutter md:p-margin-desktop">
      <div className="absolute top-0 left-0 w-full h-1/4 bg-primary-container/5 pointer-events-none -z-10"></div>
      <div className="absolute right-[-10%] top-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary-container/10 blur-[100px] pointer-events-none -z-10"></div>

      <div className="w-full max-w-2xl bg-surface-alt rounded-2xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant/20 flex flex-col items-center gap-8 mt-8 mb-24 md:mb-8">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>

        <div className="flex flex-col items-center gap-4 text-center mt-4">
          <div className="w-20 h-20 rounded-full bg-warning/20 flex items-center justify-center shadow-lg border-2 border-surface-alt z-10 relative">
            <span className="material-symbols-outlined text-4xl text-warning font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>pending</span>
            <div className="absolute inset-0 rounded-full animate-ping bg-warning/20 opacity-20"></div>
          </div>
          <div className="space-y-1">
            <p className="font-body-md text-body-md text-on-surface-variant uppercase tracking-wider">Withdrawal Submitted</p>
            <h2 className="font-data-lg text-[40px] leading-none text-primary font-bold tracking-tight">
              ₦{finalAmount.toFixed(2)}
            </h2>
          </div>
        </div>

        <div className="w-full h-px bg-outline-variant/30 flex items-center justify-center relative my-2">
          <div className="absolute w-8 h-px bg-secondary left-1/2 -translate-x-1/2"></div>
        </div>

        <div className="w-full space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Status</span>
            <span className="font-body-sm text-body-sm font-semibold text-warning flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Pending
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Reference ID</span>
            <div className="flex items-center gap-2">
              <span className="font-data-md text-data-md text-on-surface">
                {transactionId ? transactionId.substring(0, 13).toUpperCase() : 'TXN-PENDING'}
              </span>
              <button className="text-outline hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Date &amp; Time</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              {new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Source</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-2">
              <img src="/coin.png" alt="" className="w-4 h-4 object-contain" />
              CMP Coins
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Destination</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">account_balance</span>
              {selectedAccount?.account_name || 'Settlement Account'}
            </span>
          </div>

          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Amount Withheld</span>
            <span className="font-data-md text-data-md text-error-alert font-semibold">-{amountCoins.toLocaleString()} CMP</span>
          </div>
        </div>

        <div className="w-full bg-surface-container rounded-xl p-4 border border-outline-variant/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Conversion Rate</span>
            <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Coins Withheld</span>
            <span className="font-data-md text-data-md text-error-alert font-bold">-{amountCoins.toLocaleString()} CMP</span>
          </div>
          <div className="w-full h-px bg-outline-variant/20 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Fee</span>
            <span className="font-data-md text-data-md text-on-surface">₦{processingFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 w-full flex items-start gap-3">
          <span className="material-symbols-outlined text-warning text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
          <div>
            <p className="font-body-sm text-body-sm text-on-surface font-semibold">Pending Confirmation</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Your withdrawal is being processed. The coins will be released once confirmed. If rejected, the full amount will be returned to your wallet.</p>
          </div>
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/wallet" className="flex-1 bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-body-md text-body-md font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 text-center">
            <span className="material-symbols-outlined">account_balance_wallet</span>
            Back to Wallet
          </Link>
          <button className="flex-1 bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-body-md text-body-md font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2">
            <span className="material-symbols-outlined">download</span>
            Download Receipt
          </button>
        </div>

        <button onClick={handleReturn} className="font-body-sm text-body-sm text-outline hover:text-primary transition-colors mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
