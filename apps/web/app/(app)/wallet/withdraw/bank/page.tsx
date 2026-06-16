'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WithdrawBankPage() {
  const [selectedBank, setSelectedBank] = useState<string>('gtbank');

  return (
    <main className="flex-1 lg:ml-64 p-margin-mobile md:p-margin-desktop flex justify-center items-center pb-24 md:pb-margin-desktop min-h-[calc(100vh-80px)]">
      {/* Withdrawal Card */}
      <div className="bg-surface-alt rounded-xl p-6 md:p-8 w-full max-w-md shadow-sm border border-outline-variant/30 flex flex-col items-center text-center mt-4">
        
        {/* Header / Progress */}
        <div className="w-full flex justify-between items-center mb-8 text-on-surface-variant">
          <Link href="/wallet/withdraw" className="material-symbols-outlined hover:text-primary-container transition-colors">
            arrow_back
          </Link>
          <div className="font-label-caps text-label-caps text-on-primary-container tracking-wider">STEP 2 OF 3</div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        {/* Stepper */}
        <div className="w-full flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
          
          <div className="flex flex-col items-center gap-2 bg-surface-alt px-2">
            <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-label-caps text-label-caps text-success-verified">Amount</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-surface-alt px-2">
            <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm border-[1.5px] border-[#B8860B]">
              2
            </div>
            <span className="font-label-caps text-label-caps text-on-surface">Bank</span>
          </div>
          
          <div className="flex flex-col items-center gap-2 bg-surface-alt px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">
              3
            </div>
            <span className="font-label-caps text-label-caps text-outline">Confirm</span>
          </div>
        </div>

        <h2 className="font-h3 text-h3 text-on-surface mb-6 w-full text-left">Select Bank Account</h2>

        {/* Bank Selection */}
        <div className="space-y-4 mb-8 w-full">
          {/* Saved Bank Option 1 */}
          <label className="block cursor-pointer">
            <input 
              checked={selectedBank === 'gtbank'} 
              onChange={() => setSelectedBank('gtbank')}
              className="peer sr-only" 
              name="bank" 
              type="radio"
            />
            <div className={`flex items-center p-4 bg-surface-container-lowest rounded-lg transition-all ${selectedBank === 'gtbank' ? 'border-[2px] border-[#B8860B]' : 'border border-outline-variant/50 hover:border-outline'}`}>
              <div className="w-10 h-10 rounded-full bg-[#E5F3FF] flex items-center justify-center text-primary-container mr-4 flex-shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-body-md text-body-md font-semibold text-on-surface">GTBank</div>
                <div className="font-data-md text-data-md text-on-surface-variant mt-0.5">0123456789 • Alex O.</div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ml-4 flex-shrink-0 ${selectedBank === 'gtbank' ? 'border-2 border-[#B8860B]' : 'border border-outline-variant'}`}>
                <div className={`w-3 h-3 rounded-full ${selectedBank === 'gtbank' ? 'bg-[#B8860B]' : 'bg-transparent'}`}></div>
              </div>
            </div>
          </label>

          {/* Saved Bank Option 2 */}
          <label className="block cursor-pointer">
            <input 
              checked={selectedBank === 'access'} 
              onChange={() => setSelectedBank('access')}
              className="peer sr-only" 
              name="bank" 
              type="radio"
            />
            <div className={`flex items-center p-4 bg-surface-container-lowest rounded-lg transition-all ${selectedBank === 'access' ? 'border-[2px] border-[#B8860B]' : 'border border-outline-variant/50 hover:border-outline'}`}>
              <div className="w-10 h-10 rounded-full bg-[#F3E5FF] flex items-center justify-center text-[#4A148C] mr-4 flex-shrink-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <div className="flex-1 text-left">
                <div className="font-body-md text-body-md font-semibold text-on-surface">Access Bank</div>
                <div className="font-data-md text-data-md text-on-surface-variant mt-0.5">0987654321 • Alexander O.</div>
              </div>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ml-4 flex-shrink-0 ${selectedBank === 'access' ? 'border-2 border-[#B8860B]' : 'border border-outline-variant'}`}>
                <div className={`w-3 h-3 rounded-full ${selectedBank === 'access' ? 'bg-[#B8860B]' : 'bg-transparent'}`}></div>
              </div>
            </div>
          </label>

          {/* Add New Bank */}
          <button className="w-full flex items-center justify-center gap-2 p-4 bg-surface-container-lowest border border-dashed border-outline-variant rounded-lg hover:bg-surface-variant/30 hover:border-outline transition-all text-on-primary-fixed-variant">
            <span className="material-symbols-outlined text-lg">add</span>
            <span className="font-body-md text-body-md font-semibold">Add New Bank Account</span>
          </button>
        </div>

        {/* Withdrawal Summary */}
        <div className="border-t border-outline-variant/30 pt-6 w-full text-left">
          <h3 className="font-body-sm text-body-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">Withdrawal Summary</h3>
          <div className="space-y-3 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/20">
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Amount to withdraw</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[#B8860B] text-sm">monetization_on</span>
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

        {/* Actions */}
        <div className="mt-8 flex gap-4 w-full">
          <Link href="/wallet/withdraw" className="flex-1 py-3 px-4 rounded-lg border border-outline-variant text-on-surface font-body-md text-body-md font-semibold hover:bg-surface-variant/50 transition-colors">
            Back
          </Link>
          <Link href="/wallet/withdraw/confirm" className="flex-[2] py-3 px-4 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center">
            Continue
          </Link>
        </div>

        {/* Security Note */}
        <div className="flex items-start gap-3 text-on-surface-variant opacity-80 px-4 mt-8 w-full text-left">
          <span className="material-symbols-outlined text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
          <p className="font-body-sm text-body-sm">Your transaction is secured with bank-grade encryption. Withdrawals to new bank accounts may require additional verification.</p>
        </div>

      </div>
    </main>
  );
}
