'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWithdrawStore } from '@/stores/withdrawStore';

export default function TransactionReceiptPage() {
  const router = useRouter();
  const { amountCoins, selectedBank, transactionId, reset } = useWithdrawStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // If no transaction in store, maybe they refreshed. We could redirect or handle gracefully.
    // For now we'll just show what's there.
  }, []);

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    reset();
    router.push('/dashboard');
  };

  if (!mounted) return null; // Avoid hydration mismatch

  const bankName = selectedBank === 'gtbank' ? 'GTBank' : (selectedBank === 'access' ? 'Access Bank' : 'Bank');
  const convertedAmount = amountCoins * 10.50;
  const processingFee = convertedAmount * 0.015;
  const finalAmount = convertedAmount - processingFee;

  return (
    <div className="flex-1 w-full bg-surface-container-low min-h-[calc(100vh-64px)] overflow-x-hidden relative flex flex-col items-center justify-center p-gutter md:p-margin-desktop">
      {/* Ambient Background Accents */}
      <div className="absolute top-0 left-0 w-full h-1/4 bg-primary-container/5 pointer-events-none -z-10"></div>
      <div className="absolute right-[-10%] top-1/4 w-[40vw] h-[40vw] rounded-full bg-secondary-container/10 blur-[100px] pointer-events-none -z-10"></div>
      
      {/* Receipt Card Container */}
      <div className="w-full max-w-2xl bg-surface-alt rounded-2xl p-8 relative overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-outline-variant/20 flex flex-col items-center gap-8 mt-8 mb-24 md:mb-8">
        {/* Top Edge Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        
        {/* Header: Icon & Amount */}
        <div className="flex flex-col items-center gap-4 text-center mt-4">
          <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center shadow-lg border-2 border-surface-alt z-10 relative">
            <span className="material-symbols-outlined text-4xl text-primary font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            <div className="absolute inset-0 rounded-full animate-ping bg-secondary-container opacity-20"></div>
          </div>
          <div className="space-y-1">
            <p className="font-body-md text-body-md text-on-surface-variant uppercase tracking-wider">Withdrawal Successful</p>
            <h2 className="font-data-lg text-[40px] leading-none text-primary font-bold tracking-tight">
              +₦{finalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-outline-variant/30 flex items-center justify-center relative my-2">
          <div className="absolute w-8 h-px bg-secondary left-1/2 -translate-x-1/2"></div>
        </div>

        {/* Details Table/Grid */}
        <div className="w-full space-y-4">
          {/* Status Row */}
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Status</span>
            <span className="font-body-sm text-body-sm font-semibold text-success-verified flex items-center gap-1 bg-success-verified/10 px-2 py-1 rounded-md">
              <span className="material-symbols-outlined text-[16px]">done_all</span> Completed
            </span>
          </div>

          {/* Reference ID Row */}
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

          {/* Date/Time Row */}
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Date &amp; Time</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">
              {new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
            </span>
          </div>

          {/* Payment Method Row */}
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Source</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-2">
              <span className="w-5 h-5 rounded-full border-[1.5px] border-secondary flex items-center justify-center bg-transparent">
                <span className="material-symbols-outlined text-[12px] text-secondary">monetization_on</span>
              </span>
              CMP Coins
            </span>
          </div>

          {/* Destination Row */}
          <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Destination</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-outline">account_balance</span>
              {bankName}
            </span>
          </div>
        </div>

        {/* Conversion Breakdown Callout */}
        <div className="w-full bg-surface-container rounded-xl p-4 border border-outline-variant/20">
          <div className="flex justify-between items-center mb-2">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Conversion Rate</span>
            <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Coins Spent</span>
            <span className="font-data-md text-data-md text-primary font-bold">-{amountCoins.toLocaleString()} CMP</span>
          </div>
          <div className="w-full h-px bg-outline-variant/20 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Fee</span>
            <span className="font-data-md text-data-md text-on-surface">
              ₦{processingFee.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
          <button className="flex-1 bg-surface-container border border-outline-variant hover:border-primary text-on-surface font-body-md text-body-md font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 group">
            <span className="material-symbols-outlined group-hover:text-primary transition-colors text-outline">download</span>
            Download PDF
          </button>
          <button className="flex-1 bg-primary text-on-primary hover:bg-on-primary-fixed-variant font-body-md text-body-md font-medium py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined">share</span>
            Share Receipt
          </button>
        </div>

        {/* Return Link */}
        <button onClick={handleReturn} className="font-body-sm text-body-sm text-outline hover:text-primary transition-colors mt-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
