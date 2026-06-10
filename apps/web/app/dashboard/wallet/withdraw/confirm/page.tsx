'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WithdrawConfirmPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        handleSubmit();
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="space-y-gutter">
        {/* Success Card */}
        <div className="bg-surface-alt rounded-xl p-8 md:p-12 max-w-md w-full mx-auto flex flex-col items-center text-center shadow-sm relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-secondary-fixed opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary-fixed-dim opacity-20 rounded-full blur-2xl"></div>

          {/* Animated Icon */}
          <div className="w-24 h-24 bg-surface-alt rounded-full flex items-center justify-center mb-8 border-2 border-secondary-container">
            <span className="material-symbols-outlined text-[48px] text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
          </div>

          {/* Headers */}
          <h2 className="font-h2 text-h2 text-primary-container mb-2">Withdrawal Request Submitted</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">Your funds are on the way. We'll notify you once the transfer is complete.</p>

          {/* Summary Details */}
          <div className="w-full bg-surface-bright rounded-lg p-6 mb-8 border border-outline-variant/30">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Amount</span>
                <span className="font-data-lg text-data-lg text-primary-container">NGN 150,000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/50">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Reference ID</span>
                <span className="font-data-md text-data-md text-on-surface tracking-wider">CMP-W-982X4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Estimated Processing</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-secondary">schedule</span>
                  <span className="font-label-caps text-label-caps text-secondary-container">&lt;24 Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col gap-4">
            <Link href="/dashboard/wallet" className="w-full bg-primary-container text-on-primary font-body-md text-body-md font-bold py-4 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-sm">
              Back to Wallet
            </Link>
            <button className="w-full bg-transparent text-primary-container font-body-sm text-body-sm py-2 rounded-lg hover:bg-surface-variant transition-colors border border-transparent">
              View Receipt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-gutter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/wallet/withdraw/bank" className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:bg-outline-variant transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h2 className="font-h3 text-h3 text-on-surface m-0">Withdraw Funds</h2>
          <p className="text-on-surface-variant font-body-sm mt-1">Step 3 of 3: Verify PIN</p>
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
          <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
            <span className="material-symbols-outlined text-sm">check</span>
          </div>
          <span className="font-label-caps text-label-caps text-success-verified">Bank</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-surface-bright px-2">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm border-[1.5px] border-secondary">
            3
          </div>
          <span className="font-label-caps text-label-caps text-on-surface">Confirm</span>
        </div>
      </div>

      {/* PIN Verification Card */}
      <div className="bg-surface-alt rounded-xl p-6 md:p-8 w-full max-w-md mx-auto shadow-sm border border-outline-variant/30 flex flex-col items-center text-center">
        {/* Header / Progress */}
        <div className="w-full flex justify-between items-center mb-8 text-on-surface-variant">
          <div className="w-6"></div>
          <div className="font-label-caps text-label-caps text-on-primary-container tracking-wider">STEP 3 OF 3</div>
          <div className="w-6"></div>
        </div>

        <div className="bg-primary-container text-secondary-fixed rounded-full p-4 mb-6 shadow-inner">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
        </div>

        <h1 className="font-h3 text-h3 text-on-surface mb-2">Enter Security PIN</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-8 px-4">
          Please enter your 4-digit security PIN to authorize this withdrawal of <strong className="text-on-surface">₦50,000</strong> to GTBank.
        </p>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 border-primary-container bg-surface-bright transition-colors ${
                index < pin.length ? 'filled' : ''
              }`}
              style={{
                backgroundColor: index < pin.length ? '#0d1b35' : 'transparent'
              }}
            ></div>
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num.toString())}
              className="h-14 rounded-lg bg-surface-bright border border-outline-variant/50 font-data-lg text-data-lg text-on-surface hover:bg-surface-variant active:bg-surface-dim transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="h-14"></div>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-14 rounded-lg bg-surface-bright border border-outline-variant/50 font-data-lg text-data-lg text-on-surface hover:bg-surface-variant active:bg-surface-dim transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-lg bg-transparent text-on-surface-variant hover:text-error-alert transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">backspace</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={pin.length !== 4 || isSubmitting}
          className={`w-full bg-primary-container text-on-primary font-body-md text-body-md font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2 ${
            pin.length !== 4 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Processing...
            </>
          ) : (
            <>
              Submit Request
              <span className="material-symbols-outlined">arrow_forward</span>
            </>
          )}
        </button>

        <button className="mt-4 font-body-sm text-body-sm text-primary-container hover:underline decoration-secondary-fixed underline-offset-4">
          Forgot PIN?
        </button>
      </div>
    </div>
  );
}