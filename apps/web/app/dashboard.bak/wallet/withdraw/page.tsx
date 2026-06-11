'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WithdrawAmountPage() {
  const [amount, setAmount] = useState('');

  const nairaAmount = amount ? (parseInt(amount) / 100).toFixed(2) : '0.00';

  return (
    <div className="space-y-gutter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/wallet" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-outline-variant transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h2 className="font-h3 text-h3 text-on-surface m-0">Withdraw Funds</h2>
          <p className="text-on-surface-variant font-body-sm mt-1">Step 1 of 3: Amount Selection</p>
        </div>
      </div>

      {/* Balance Indicator */}
      <div className="bg-surface-bright border border-outline-variant/30 rounded-lg p-4 mb-8 flex justify-between items-center">
        <span className="font-body-md text-on-surface-variant">Available Balance</span>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
          <span className="font-data-lg text-data-lg text-on-surface">45,200</span>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-surface-alt rounded-xl p-6 md:p-8 shadow-sm">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block font-label-caps text-label-caps text-on-surface" htmlFor="withdrawAmount">
              Amount to Withdraw (Coins)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
              </div>
              <input
                id="withdrawAmount"
                type="number"
                min="100"
                max="45200"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-12 pr-4 py-4 bg-surface-bright border border-outline-variant rounded-lg text-on-surface font-data-lg text-data-lg focus:ring-primary focus:border-primary transition-colors focus:outline-none"
                placeholder="0"
              />
            </div>
          </div>

          {/* Real-time Conversion Display */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <div className="flex justify-between items-center mb-2">
              <span className="font-body-sm text-on-surface-variant">Conversion Rate</span>
              <span className="font-data-md text-data-md text-on-surface-variant">100 Coins = ₦1</span>
            </div>
            <div className="flex justify-between items-end border-t border-outline-variant/20 pt-3">
              <span className="font-body-md text-on-surface">You will receive:</span>
              <div className="text-right">
                <span className="font-data-lg text-data-lg text-primary block">₦{nairaAmount}</span>
                <span className="font-label-caps text-label-caps text-success-verified mt-1 block">No hidden fees</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link href="/dashboard/wallet/withdraw/bank" className="w-full bg-primary text-on-primary font-body-lg text-body-lg font-semibold py-4 rounded-lg hover:bg-primary-container transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              <span>Continue</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link href="/dashboard/wallet" className="text-primary hover:text-on-primary-fixed-variant font-body-sm underline transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}