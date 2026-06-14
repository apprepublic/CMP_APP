'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { NeuProgress } from '@/components/ui/neu-progress';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Coins, Loader2, AlertCircle, Landmark } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase-types';
import { useWallet } from '@/lib/useWallet';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function WithdrawAmountPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { wallet, user, loading } = useWallet();
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [step, setStep] = useState(1);

  const coinBalance = wallet?.coin_balance ?? 0;
  const nairaAmount = amount ? (parseInt(amount) / 100).toFixed(2) : '0.00';

  // Create withdrawal mutation
  const createWithdrawal = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('Not authenticated');
      
      const coinAmount = parseInt(amount);
      if (coinAmount > coinBalance) {
        throw new Error('Insufficient balance');
      }

      const { data, error } = await supabase
        .from('withdrawal_requests')
        .insert([{
          user_id: user.id,
          amount: nairaAmount,
          coin_amount: coinAmount.toString(),
          status: 'PENDING',
          account_details: {
            bank_name: bankName,
            account_number: bankAccount,
            account_name: accountName,
          },
        }] as any)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Refresh wallet and withdrawal requests
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      queryClient.invalidateQueries({ queryKey: ['withdrawal-requests'] });
      router.push('/dashboard/wallet');
    },
  });

  const handleSubmit = () => {
    if (!amount || !bankAccount || !bankName || !accountName) return;
    createWithdrawal.mutate();
  };

  const canSubmit = step === 1 
    ? amount && parseInt(amount) > 0 && parseInt(amount) <= coinBalance
    : bankAccount && bankName && accountName;

  if (loading) {
    return (
      <PageTransition className="space-y-gutter">
        <NeuCard padding="lg" className="animate-pulse">
          <div className="h-8 bg-neu-bg rounded w-1/3 mb-4" />
          <div className="h-4 bg-neu-bg rounded w-1/2 mb-8" />
          <div className="h-32 bg-neu-bg rounded" />
        </NeuCard>
      </PageTransition>
    );
  }

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
          <p className="text-neo-text-secondary font-body-sm mt-1">Step {step} of 2: {step === 1 ? 'Amount Selection' : 'Bank Details'}</p>
        </div>
      </div>

      {/* Stepper Progress */}
      <NeuProgress value={step === 1 ? 50 : 100} showLabel label={`Step ${step} of 2`} size="md" />

      {/* Balance Indicator */}
      <NeuCard padding="md" interactive>
        <div className="flex justify-between items-center">
          <span className="font-body-md text-neo-text-secondary">Available Balance</span>
          <div className="flex items-center gap-2">
            <NeuIconBadge size="sm" active>
              <span className="material-symbols-outlined text-neo-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>
            </NeuIconBadge>
            <span className="font-data-lg text-data-lg text-neo-text-primary">{coinBalance.toLocaleString()}</span>
          </div>
        </div>
      </NeuCard>

      {/* Step 1: Amount Selection */}
      {step === 1 && (
        <NeuCard padding="lg">
          <StaggerContainer stagger={0.08}>
            <StaggerItem>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                <Input
                  label="Amount to Withdraw (Coins)"
                  type="number"
                  min={100}
                  max={coinBalance}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  icon={<span className="material-symbols-outlined text-neo-secondary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>monetization_on</span>}
                />

                {/* Real-time Conversion Display */}
                <div className="bg-neu-bg rounded-xl p-4 shadow-neu-inset">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body-sm text-neo-text-secondary">Conversion Rate</span>
                    <span className="font-data-md text-data-md text-neo-text-secondary">100 Coins = ₦1</span>
                  </div>
                  <div className="flex justify-between items-end border-t border-neo-bg-dark pt-3">
                    <span className="font-body-md text-neo-text-primary">You will receive:</span>
                    <div className="text-right">
                      <span className="font-data-lg text-data-lg text-neo-primary block">₦{nairaAmount}</span>
                      <span className="font-label-caps text-label-caps text-neo-success mt-1 block">No hidden fees</span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full gap-2" 
                    disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > coinBalance}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
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
      )}

      {/* Step 2: Bank Details */}
      {step === 2 && (
        <NeuCard padding="lg">
          <StaggerContainer stagger={0.08}>
            <StaggerItem>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                <Input
                  label="Account Number"
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="0123456789"
                  maxLength={10}
                  icon={<Landmark className="w-5 h-5" />}
                />

                <Input
                  label="Bank Name"
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g., GTBank, Zenith Bank"
                  icon={<Landmark className="w-5 h-5" />}
                />

                <Input
                  label="Account Name"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="Name on the account"
                  icon={<span className="material-symbols-outlined">person</span>}
                />

                {/* Summary */}
                <NeuCard padding="md" className="bg-neu-bg shadow-neu-inset">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body-md text-neo-text-secondary">Withdrawing</span>
                    <span className="font-data-lg text-data-lg text-neo-primary">{amount ? parseInt(amount).toLocaleString() : '0'} Coins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-neo-text-secondary">To receive</span>
                    <span className="font-data-lg text-data-lg text-neo-success">₦{nairaAmount}</span>
                  </div>
                </NeuCard>

                {/* Action Button */}
                <div className="pt-4">
                  <Button 
                    type="submit"
                    size="lg" 
                    className="w-full gap-2"
                    disabled={!canSubmit || createWithdrawal.isPending}
                  >
                    {createWithdrawal.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Withdrawal
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-neo-primary hover:underline font-body-sm transition-colors"
                  >
                    Back
                  </button>
                </div>
              </form>
            </StaggerItem>
          </StaggerContainer>
        </NeuCard>
      )}

      {/* Info Notice */}
      <NeuCard padding="md" className="bg-neo-warning/10 border border-neo-warning/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-neo-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-body-sm text-body-sm text-neo-text-primary">
              Withdrawals are processed within 24-48 hours on business days.
            </p>
            <p className="font-body-sm text-body-sm text-neo-text-secondary mt-1">
              Minimum withdrawal: 100 Coins (₦1.00). Maximum: Your total balance.
            </p>
          </div>
        </div>
      </NeuCard>
    </PageTransition>
  );
}