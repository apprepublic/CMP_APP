'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/useWallet';
import { useWithdrawStore } from '@/stores/withdrawStore';

export default function WithdrawAmountPage() {
  const router = useRouter();
  const { wallet, loading: isLoading } = useWallet();
  const availableBalance = wallet ? parseFloat(wallet.coin_balance || '0') : 0;
  
  const { amountCoins, setAmountCoins } = useWithdrawStore();
  const [coins, setCoins] = useState<string>(amountCoins > 0 ? amountCoins.toString() : '');

  const parsedCoins = parseInt(coins) || 0;
  const isOverBalance = parsedCoins > availableBalance;
  const isUnderMin = parsedCoins < 100 && parsedCoins > 0;
  const isValid = parsedCoins >= 100 && parsedCoins <= availableBalance;
  
  const nairaAmount = useMemo(() => {
    // 1 Coin = ₦10.50
    return (parsedCoins * 10.50).toFixed(2);
  }, [parsedCoins]);

  const formattedNaira = parseFloat(nairaAmount).toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setAmountCoins(parsedCoins);
      router.push('/wallet/withdraw/bank');
    }
  };

  return (
    <main className="flex-1 lg:ml-64 p-margin-mobile md:p-margin-desktop flex items-center justify-center min-h-[calc(100vh-80px)] md:min-h-screen pb-24 md:pb-margin-desktop bg-surface relative z-10">
      {/* Withdrawal Card */}
      <div className="bg-surface-container-lowest rounded-xl w-full max-w-lg p-6 md:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] mt-4">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/wallet" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-outline-variant transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h2 className="font-h3 text-h3 text-on-surface m-0">Withdraw Funds</h2>
            <p className="text-on-surface-variant font-body-sm mt-1">Step 1 of 3: Amount Selection</p>
          </div>
        </div>

        {/* Stepper */}
        <div className="w-full flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm border-[1.5px] border-[#B8860B]">
              1
            </div>
            <span className="font-label-caps text-label-caps text-on-surface">Amount</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">
              2
            </div>
            <span className="font-label-caps text-label-caps text-outline">Bank</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">
              3
            </div>
            <span className="font-label-caps text-label-caps text-outline">Confirm</span>
          </div>
        </div>

        {/* Balance Indicator */}
        <div className="bg-surface border border-outline-variant/30 rounded-lg p-4 mb-8 flex justify-between items-center">
          <span className="font-body-md text-on-surface-variant">Available Balance</span>
          <div className="flex items-center gap-2">
            <img src="/coin.png" alt="Coin" className="w-5 h-5 object-contain" />
            <span className="font-data-lg text-data-lg text-on-surface">
              {isLoading ? '...' : availableBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleContinue} className="space-y-6">
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface" htmlFor="withdrawAmount">Amount to Withdraw (Coins)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <img src="/coin.png" alt="Coin" className="w-5 h-5 object-contain" />
              </div>
              <input 
                id="withdrawAmount" 
                type="number"
                min="100"
                max={availableBalance}
                value={coins}
                onChange={(e) => setCoins(e.target.value)}
                placeholder="0"
                className={`block w-full pl-12 pr-4 py-4 bg-surface border rounded-lg text-on-surface font-data-lg text-data-lg focus:ring-primary focus:border-primary transition-colors focus:outline-none ${isOverBalance ? 'border-error-alert focus:border-error-alert' : 'border-outline-variant focus:border-primary'}`}
              />
            </div>
            {isOverBalance && (
              <p className="text-error-alert font-body-sm mt-1">Amount exceeds available balance.</p>
            )}
            {isUnderMin && (
              <p className="text-error-alert font-body-sm mt-1">Minimum withdrawal amount is 100 coins.</p>
            )}
          </div>

          {/* Real-time Conversion Display */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body-sm text-on-surface-variant">Conversion Rate</span>
              <span className="font-data-md text-data-md text-on-surface-variant">1 CMP = ₦10.50</span>
            </div>
            <div className="flex justify-between items-end border-t border-outline-variant/20 pt-3">
              <span className="font-body-md text-on-surface">You will receive:</span>
              <div className="text-right">
                <span className="font-data-lg text-data-lg text-primary block">₦{formattedNaira}</span>
                <span className="font-label-caps text-label-caps text-success-verified mt-1 block">No hidden fees</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button 
              type="submit"
              disabled={!isValid}
              className="w-full bg-primary text-on-primary font-body-lg text-body-lg font-semibold py-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Continue</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          
          <div className="text-center mt-4">
            <Link href="/wallet" className="text-primary hover:text-on-primary-fixed-variant font-body-sm underline transition-colors">
              Cancel
            </Link>
          </div>
        </form>

      </div>
    </main>
  );
}