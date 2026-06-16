'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function WithdrawConfirmPage() {
  const [pin, setPin] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const maxPinLength = 4;

  const handleNumClick = (num: string) => {
    if (pin.length < maxPinLength && !isLoading && !isSuccess) {
      setPin(prev => prev + num);
    }
  };

  const handleDelClick = () => {
    if (pin.length > 0 && !isLoading && !isSuccess) {
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    if (pin.length === maxPinLength) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  return (
    <main className="flex-1 lg:ml-64 p-margin-mobile md:p-margin-desktop flex justify-center items-center pb-24 md:pb-margin-desktop min-h-[calc(100vh-80px)]">
      {/* Withdrawal Card */}
      <div className="bg-surface-alt rounded-xl p-6 md:p-8 w-full max-w-md shadow-sm border border-outline-variant/30 flex flex-col items-center text-center mt-4">
        
        {/* Header / Progress */}
        <div className="w-full flex justify-between items-center mb-8 text-on-surface-variant">
          <Link href="/wallet/withdraw/bank" className="material-symbols-outlined hover:text-primary-container transition-colors">
            arrow_back
          </Link>
          <div className="font-label-caps text-label-caps text-on-primary-container tracking-wider">STEP 3 OF 3</div>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        <div className="bg-primary-container text-secondary-fixed rounded-full p-4 mb-6 shadow-inner flex items-center justify-center">
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
              className={`w-4 h-4 rounded-full border-2 transition-colors ${
                index < pin.length 
                  ? 'bg-on-primary-fixed border-on-primary-fixed' 
                  : 'bg-surface-container-lowest border-primary-container'
              }`}
            ></div>
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button 
              key={num}
              onClick={() => handleNumClick(num.toString())}
              className="h-14 rounded-lg bg-surface-container-lowest border border-outline-variant/50 font-data-lg text-data-lg text-on-surface hover:bg-surface-variant active:bg-surface-dim transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div className="h-14"></div> {/* Empty cell */}
          <button 
            onClick={() => handleNumClick('0')}
            className="h-14 rounded-lg bg-surface-container-lowest border border-outline-variant/50 font-data-lg text-data-lg text-on-surface hover:bg-surface-variant active:bg-surface-dim transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button 
            onClick={handleDelClick}
            className="h-14 rounded-lg bg-transparent text-on-surface-variant hover:text-error-alert transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined">backspace</span>
          </button>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleSubmit}
          disabled={pin.length !== maxPinLength || isLoading || isSuccess}
          className={`w-full font-body-md text-body-md font-bold py-4 rounded-lg transition-colors flex justify-center items-center gap-2 ${
            isSuccess 
              ? 'bg-success-verified text-on-primary' 
              : pin.length === maxPinLength 
                ? 'bg-primary-container text-on-primary hover:bg-on-primary-fixed-variant' 
                : 'bg-primary-container text-on-primary opacity-50 cursor-not-allowed'
          } ${isLoading ? 'opacity-80' : ''}`}
        >
          {isSuccess ? (
            <>Success <span className="material-symbols-outlined">check_circle</span></>
          ) : (
            <>
              Submit Request
              {isLoading && <span className="material-symbols-outlined animate-spin">sync</span>}
            </>
          )}
        </button>
        
        {!isSuccess && (
          <button className="mt-4 font-body-sm text-body-sm text-primary-container hover:underline decoration-secondary-fixed underline-offset-4">
            Forgot PIN?
          </button>
        )}
      </div>
    </main>
  );
}
