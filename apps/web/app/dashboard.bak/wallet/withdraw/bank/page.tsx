'use client';

import Link from 'next/link';
import { useState } from 'react';

const banks = [
  { id: 1, name: 'GTBank', accountNumber: '0123456789', accountName: 'Alex O.', selected: true },
  { id: 2, name: 'Access Bank', accountNumber: '0987654321', accountName: 'Alexander O.', selected: false },
];

export default function WithdrawBankPage() {
  const [selectedBank, setSelectedBank] = useState(1);

  return (
    <div className="space-y-gutter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/wallet/withdraw" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-outline-variant transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h2 className="font-h3 text-h3 text-on-surface m-0">Withdraw Funds</h2>
          <p className="text-on-surface-variant font-body-sm mt-1">Step 2 of 3: Select Bank</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-8 px-4 relative">
        <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
        <div className="flex flex-col items-center gap-2 bg-surface-bright px-2">
          <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
            <span className="material-symbols-outlined text-sm">check</span>
          </div>
          <span className="font-label-caps text-label-caps text-success-verified">Amount</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-surface-bright px-2">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm border-[1.5px] border-secondary">
            2
          </div>
          <span className="font-label-caps text-label-caps text-on-surface">Bank</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-surface-bright px-2">
          <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">
            3
          </div>
          <span className="font-label-caps text-label-caps text-outline">Confirm</span>
        </div>
      </div>

      {/* Bank Selection Card */}
      <div className="bg-surface-alt rounded-xl p-gutter shadow-sm">
        <h2 className="font-h3 text-h3 text-on-surface mb-6">Select Bank Account</h2>

        <div className="space-y-4 mb-8">
          {banks.map((bank) => (
            <label key={bank.id} className="block cursor-pointer">
              <input
                type="radio"
                name="bank"
                checked={selectedBank === bank.id}
                onChange={() => setSelectedBank(bank.id)}
                className="peer sr-only"
              />
              <div className={`flex items-center p-4 bg-surface-bright rounded-lg transition-all ${
                selectedBank === bank.id
                  ? 'border-[2px] border-secondary'
                  : 'border border-outline-variant/50 hover:border-outline'
              }`}>
                <div className="w-10 h-10 rounded-full bg-[#E5F3FF] flex items-center justify-center text-primary-container mr-4 flex-shrink-0">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                </div>
                <div className="flex-1">
                  <div className="font-body-md text-body-md font-semibold text-on-surface">{bank.name}</div>
                  <div className="font-data-md text-data-md text-on-surface-variant mt-0.5">{bank.accountNumber} • {bank.accountName}</div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 flex-shrink-0 ${
                  selectedBank === bank.id ? 'border-secondary' : 'border-outline-variant'
                }`}>
                  {selectedBank === bank.id && (
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  )}
                </div>
              </div>
            </label>
          ))}

          {/* Add New Bank */}
          <button className="w-full flex items-center justify-center gap-2 p-4 bg-surface-bright border border-dashed border-outline-variant rounded-lg hover:bg-surface-variant/30 hover:border-outline transition-all text-on-primary-fixed-variant">
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="font-body-md text-body-md font-semibold">Add New Bank Account</span>
          </button>
        </div>

        {/* Withdrawal Summary */}
        <div className="border-t border-outline-variant/30 pt-6">
          <h3 className="font-body-sm text-body-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">Withdrawal Summary</h3>
          <div className="space-y-3 bg-surface-bright p-4 rounded-lg border border-outline-variant/20">
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Amount to withdraw</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-secondary text-sm">monetization_on</span>
                <span className="font-data-md text-data-md text-on-surface">5,000</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Exchange Rate</span>
              <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Converted Amount</span>
              <span className="font-data-md text-data-md text-on-surface">₦52,500.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Processing Fee (1.5%)</span>
              <span className="font-data-md text-data-md text-error-alert">- ₦787.50</span>
            </div>
            <div className="border-t border-dashed border-outline-variant/50 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md font-semibold text-on-surface">You will receive</span>
                <span className="font-data-lg text-data-lg text-success-verified">₦51,712.50</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/dashboard/wallet/withdraw" className="flex-1 py-3 px-4 rounded-lg border border-outline-variant text-on-surface font-body-md text-body-md font-semibold hover:bg-surface-variant/50 transition-colors text-center">
            Back
          </Link>
          <Link href="/dashboard/wallet/withdraw/confirm" className="flex-[2] py-3 px-4 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary/90 transition-colors shadow-sm text-center">
            Continue
          </Link>
        </div>
      </div>

      {/* Security Note */}
      <div className="flex items-start gap-3 text-on-surface-variant opacity-80 px-4">
        <span className="material-symbols-outlined text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        <p className="font-body-sm text-body-sm">Your transaction is secured with bank-grade encryption. Withdrawals to new bank accounts may require additional verification.</p>
      </div>
    </div>
  );
}