'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Lock, CheckCircle, Delete } from 'lucide-react';

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
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <PageTransition className="space-y-gutter">
        <NeuCard padding="lg" className="max-w-md w-full mx-auto flex flex-col items-center text-center shadow-neu-raised relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-neo-secondary opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-neo-primary opacity-20 rounded-full blur-2xl"></div>

          <NeuIconBadge size="lg" active className="mb-8" style={{ background: 'var(--neo-secondary)' }}>
            <CheckCircle className="w-8 h-8 text-neo-primary" />
          </NeuIconBadge>

          <h2 className="font-h2 text-h2 text-neo-primary mb-2">Withdrawal Request Submitted</h2>
          <p className="font-body-md text-body-md text-neo-text-secondary mb-8">Your funds are on the way. We'll notify you once the transfer is complete.</p>

          {/* Summary - neu-inset readout */}
          <div className="w-full bg-neu-bg rounded-xl p-6 mb-8 shadow-neu-inset">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center pb-4 border-b border-neo-bg-dark">
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Amount</span>
                <span className="font-data-lg text-data-lg text-neo-primary">NGN 150,000</span>
              </div>
              <div className="flex justify-between items-center pb-4 border-b border-neo-bg-dark">
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Reference ID</span>
                <span className="font-data-md text-data-md text-neo-text-primary tracking-wider">CMP-W-982X4</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body-sm text-body-sm text-neo-text-secondary">Estimated Processing</span>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-neo-secondary">schedule</span>
                  <span className="font-label-caps text-label-caps text-neo-secondary">{'<'}24 Hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-4">
            <Button size="lg" className="w-full" asChild>
              <Link href="/dashboard/wallet">Back to Wallet</Link>
            </Button>
            <Button variant="ghost" size="lg" className="w-full">
              View Receipt
            </Button>
          </div>
        </NeuCard>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="space-y-gutter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/wallet/withdraw/bank">
          <NeuIconBadge size="md" className="cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-neo-text-primary" />
          </NeuIconBadge>
        </Link>
        <div>
          <h2 className="font-h3 text-h3 text-neo-text-primary m-0">Withdraw Funds</h2>
          <p className="text-neo-text-secondary font-body-sm mt-1">Step 3 of 3: Verify PIN</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <NeuProgress value={100} showLabel label="Step 3 of 3" size="md" />

      {/* PIN Verification Card */}
      <NeuCard padding="lg" className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        <div className="w-full flex justify-between items-center mb-8 text-neo-text-secondary">
          <div className="w-6"></div>
          <div className="font-label-caps text-label-caps text-neo-primary tracking-wider">STEP 3 OF 3</div>
          <div className="w-6"></div>
        </div>

        <NeuIconBadge size="lg" active className="mb-6" style={{ background: 'var(--neo-primary)' }}>
          <Lock className="w-6 h-6 text-white" />
        </NeuIconBadge>

        <h1 className="font-h3 text-h3 text-neo-text-primary mb-2">Enter Security PIN</h1>
        <p className="font-body-sm text-body-sm text-neo-text-secondary mb-8 px-4">
          Please enter your 4-digit security PIN to authorize this withdrawal of <strong className="text-neo-text-primary">&#8358;50,000</strong> to GTBank.
        </p>

        {/* PIN Dots */}
        <div className="flex gap-4 mb-10">
          {[0, 1, 2, 3].map((index) => (
            <NeuIconBadge
              key={index}
              size="sm"
              active={index < pin.length}
              className="transition-all duration-200"
            >
              <span className="w-2 h-2 rounded-full bg-neo-text-muted" />
            </NeuIconBadge>
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[280px] mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <NeuCard
              key={num}
              padding="none"
              interactive
              className="h-14 flex items-center justify-center cursor-pointer"
              onClick={() => handleNumberClick(num.toString())}
            >
              <span className="font-data-lg text-data-lg text-neo-text-primary">{num}</span>
            </NeuCard>
          ))}
          <div className="h-14"></div>
          <NeuCard
            padding="none"
            interactive
            className="h-14 flex items-center justify-center cursor-pointer"
            onClick={() => handleNumberClick('0')}
          >
            <span className="font-data-lg text-data-lg text-neo-text-primary">0</span>
          </NeuCard>
          <button
            onClick={handleDelete}
            className="h-14 flex items-center justify-center text-neo-text-muted hover:text-neo-error transition-colors"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button */}
        <Button
          size="lg"
          className="w-full gap-2"
          disabled={pin.length !== 4 || isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Processing...
            </>
          ) : (
            <>
              Submit Request
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </Button>

        <button className="mt-4 font-body-sm text-body-sm text-neo-primary hover:underline underline-offset-4">
          Forgot PIN?
        </button>
      </NeuCard>
    </PageTransition>
  );
}
