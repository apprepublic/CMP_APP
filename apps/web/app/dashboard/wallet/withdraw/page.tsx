'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Coins } from 'lucide-react';

export default function WithdrawAmountPage() {
  const [amount, setAmount] = useState('');

  const nairaAmount = amount ? (parseInt(amount) / 100).toFixed(2) : '0.00';

  return (
    <PageTransition className="space-y-gutter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/wallet">
            <NeuIconBadge size="md" className="cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-neo-text-primary" />
          </NeuIconBadge>
        </Link>
        <div>
          <h2 className="font-h3 text-h3 text-neo-text-primary m-0">Withdraw Funds</h2>
          <p className="text-neo-text-secondary font-body-sm mt-1">Step 1 of 3: Amount Selection</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <NeuProgress value={33} showLabel label="Step 1 of 3" size="md" />

      {/* Balance Indicator */}
      <NeuCard padding="md" interactive>
        <div className="flex justify-between items-center">
          <span className="font-body-md text-neo-text-secondary">Available Balance</span>
          <div className="flex items-center gap-2">
            <NeuIconBadge size="sm" active>
              <span className="material-symbols-outlined text-neo-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            </NeuIconBadge>
            <span className="font-data-lg text-data-lg text-neo-text-primary">45,200</span>
          </div>
        </div>
      </NeuCard>

      {/* Input Form */}
      <NeuCard padding="lg">
        <StaggerContainer stagger={0.08}>
          <StaggerItem>
            <form className="space-y-6">
              <Input
                label="Amount to Withdraw (Coins)"
                type="number"
                min={100}
                max={45200}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                icon={<span className="material-symbols-outlined text-neo-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>}
              />

              {/* Real-time Conversion Display - neu-inset "calculator readout" */}
              <div className="bg-neu-bg rounded-xl p-4 shadow-neu-inset">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-body-sm text-neo-text-secondary">Conversion Rate</span>
                  <span className="font-data-md text-data-md text-neo-text-secondary">100 Coins = &#8358;1</span>
                </div>
                <div className="flex justify-between items-end border-t border-neo-bg-dark pt-3">
                  <span className="font-body-md text-neo-text-primary">You will receive:</span>
                  <div className="text-right">
                    <span className="font-data-lg text-data-lg text-neo-primary block">&#8358;{nairaAmount}</span>
                    <span className="font-label-caps text-label-caps text-neo-success mt-1 block">No hidden fees</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <Button size="lg" className="w-full gap-2" asChild>
                  <Link href="/dashboard/wallet/withdraw/bank">
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
              <div className="text-center mt-4">
                <Link href="/dashboard/wallet" className="text-neo-primary hover:underline font-body-sm transition-colors">
                  Cancel
                </Link>
              </div>
            </form>
          </StaggerItem>
        </StaggerContainer>
      </NeuCard>
    </PageTransition>
  );
}
