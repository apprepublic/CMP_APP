'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Landmark, Plus, Lock } from 'lucide-react';

const banks = [
  { id: 1, name: 'GTBank', accountNumber: '0123456789', accountName: 'Alex O.', selected: true },
  { id: 2, name: 'Access Bank', accountNumber: '0987654321', accountName: 'Alexander O.', selected: false },
];

export default function WithdrawBankPage() {
  const [selectedBank, setSelectedBank] = useState(1);

  return (
    <PageTransition className="space-y-gutter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/wallet/withdraw">
          <NeuIconBadge size="md" className="cursor-pointer">
            <ArrowLeft className="w-5 h-5 text-neo-text-primary" />
          </NeuIconBadge>
        </Link>
        <div>
          <h2 className="font-h3 text-h3 text-neo-text-primary m-0">Withdraw Funds</h2>
          <p className="text-neo-text-secondary font-body-sm mt-1">Step 2 of 3: Select Bank</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <NeuProgress value={66} showLabel label="Step 2 of 3" size="md" />

      {/* Bank Selection */}
      <NeuCard padding="lg">
        <h2 className="font-h3 text-h3 text-neo-text-primary mb-6">Select Bank Account</h2>

        <StaggerContainer stagger={0.08}>
          <div className="space-y-4 mb-8">
            {banks.map((bank) => (
              <StaggerItem key={bank.id}>
                <label className="block cursor-pointer">
                  <input
                    type="radio"
                    name="bank"
                    checked={selectedBank === bank.id}
                    onChange={() => setSelectedBank(bank.id)}
                    className="peer sr-only"
                  />
                  <NeuCard
                    padding="md"
                    interactive
                    className={selectedBank === bank.id ? 'ring-2 ring-neo-secondary' : ''}
                  >
                    <div className="flex items-center">
                      <NeuIconBadge size="md" active={selectedBank === bank.id} className="mr-4 flex-shrink-0" style={{ background: selectedBank === bank.id ? 'var(--neo-secondary)' : undefined }}>
                        <Landmark className="w-5 h-5" />
                      </NeuIconBadge>
                      <div className="flex-1">
                        <div className="font-body-md text-body-md font-semibold text-neo-text-primary">{bank.name}</div>
                        <div className="font-data-md text-data-md text-neo-text-secondary mt-0.5">{bank.accountNumber} &bull; {bank.accountName}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 flex-shrink-0 ${
                        selectedBank === bank.id ? 'border-neo-secondary' : 'border-neo-bg-dark'
                      }`}>
                        {selectedBank === bank.id && (
                          <div className="w-3 h-3 rounded-full bg-neo-secondary"></div>
                        )}
                      </div>
                    </div>
                  </NeuCard>
                </label>
              </StaggerItem>
            ))}

            {/* Add New Bank */}
            <StaggerItem>
              <NeuCard padding="md" interactive className="border-2 border-dashed border-neo-bg-dark flex items-center justify-center gap-2 cursor-pointer">
                <Plus className="w-5 h-5 text-neo-primary" />
                <span className="font-body-md text-body-md font-semibold text-neo-primary">Add New Bank Account</span>
              </NeuCard>
            </StaggerItem>
          </div>
        </StaggerContainer>

        {/* Withdrawal Summary - neu-inset readout */}
        <div className="border-t border-neo-bg-dark pt-6">
          <h3 className="font-body-sm text-body-sm font-semibold text-neo-text-secondary mb-4 uppercase tracking-wider">Withdrawal Summary</h3>
          <div className="space-y-3 bg-neu-bg p-4 rounded-xl shadow-neu-inset">
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-neo-text-secondary">Amount to withdraw</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-neo-secondary text-sm">monetization_on</span>
                <span className="font-data-md text-data-md text-neo-text-primary">5,000</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-neo-text-secondary">Exchange Rate</span>
              <span className="font-data-md text-data-md text-neo-text-primary">1 CMP = &#8358;10.50</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-neo-text-secondary">Converted Amount</span>
              <span className="font-data-md text-data-md text-neo-text-primary">&#8358;52,500.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-neo-text-secondary">Processing Fee (1.5%)</span>
              <span className="font-data-md text-data-md text-neo-error">- &#8358;787.50</span>
            </div>
            <div className="border-t border-dashed border-neo-bg-dark pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md font-semibold text-neo-text-primary">You will receive</span>
                <span className="font-data-lg text-data-lg text-neo-success">&#8358;51,712.50</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button variant="outline" size="lg" className="flex-1" asChild>
            <Link href="/dashboard/wallet/withdraw">Back</Link>
          </Button>
          <Button size="lg" className="flex-[2] gap-2" asChild>
            <Link href="/dashboard/wallet/withdraw/confirm">
              Continue
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </NeuCard>

      {/* Security Note */}
      <div className="flex items-start gap-3 text-neo-text-secondary px-4">
        <NeuIconBadge size="sm" active>
          <Lock className="w-4 h-4 text-neo-primary" />
        </NeuIconBadge>
        <p className="font-body-sm text-body-sm">Your transaction is secured with bank-grade encryption. Withdrawals to new bank accounts may require additional verification.</p>
      </div>
    </PageTransition>
  );
}
