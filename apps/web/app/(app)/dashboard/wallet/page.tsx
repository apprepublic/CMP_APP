'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { Plus, Landmark, Send, Receipt, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useWallet } from '@/lib/useWallet';
import { useQuery } from '@tanstack/react-query';
import WalletTopUp from '@/components/WalletTopUp';

// TODO(prod): Wire NOWPayments integration - requires NEXT_PUBLIC_PAYMENTS_ENABLED flag
const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_PAYMENTS_ENABLED === 'true';

interface CoinTransaction {
  id: string;
  wallet_id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string;
  reference_id: string | null;
  created_at: string;
}

interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: number;
  coin_amount: number;
  status: string;
  account_details: any;
  created_at: string;
}

export default function WalletPage() {
  const { wallet, loading: walletLoading, user } = useWallet();
  const [showTopUp, setShowTopUp] = useState(false);

  // Fetch coin transactions for the user's wallet
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ['coin-transactions', wallet?.id],
    queryFn: async () => {
      if (!wallet?.id) return [];
      
      const { data, error } = await supabase
        .from('coin_transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data as CoinTransaction[];
    },
    enabled: !!wallet?.id,
  });

  // Fetch withdrawal requests
  const { data: withdrawals = [], isLoading: withdrawalsLoading } = useQuery({
    queryKey: ['withdrawal-requests', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('withdrawal_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as WithdrawalRequest[];
    },
    enabled: !!user?.id,
  });

  const coinBalance = wallet?.coin_balance ?? 0;

  if (showTopUp) {
    if (!PAYMENTS_ENABLED) {
      // TODO(prod): Remove this gate once NOWPayments keys are configured
      return (
        <PageTransition className="space-y-gutter">
          <Button variant="ghost" onClick={() => setShowTopUp(false)} className="mb-4">
            ← Back to Wallet
          </Button>
          <NeuCard padding="lg" className="text-center py-12">
            <NeuIconBadge size="lg" active className="mx-auto mb-4 bg-neo-secondary/20">
              <Loader2 className="w-8 h-8 text-neo-secondary animate-spin" />
            </NeuIconBadge>
            <h3 className="font-h3 text-h3 text-neo-text-primary mb-2">Crypto Top-Up Coming Soon</h3>
            <p className="font-body-md text-body-md text-neo-text-secondary mb-6">
              We're integrating secure cryptocurrency payments. Check back soon!
            </p>
            <p className="font-body-sm text-body-sm text-neo-text-muted">
              {/* TODO(prod): Remove this comment when payments are enabled */}
              {/* Requires NOWPAYMENTS_API_KEY in environment */}
            </p>
          </NeuCard>
        </PageTransition>
      );
    }
    return (
      <PageTransition className="space-y-gutter">
        <Button variant="ghost" onClick={() => setShowTopUp(false)} className="mb-4">
          ← Back to Wallet
        </Button>
        <WalletTopUp />
      </PageTransition>
    );
  }

  const formatType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="font-label-caps text-label-caps text-amber-600">Pending</span>;
      case 'COMPLETED':
        return <span className="font-label-caps text-label-caps text-neo-success">Completed</span>;
      case 'FAILED':
        return <span className="font-label-caps text-label-caps text-neo-error">Failed</span>;
      default:
        return <span className="font-label-caps text-label-caps text-neo-text-secondary">{status}</span>;
    }
  };

  return (
    <PageTransition className="space-y-gutter">
      {/* Balance Hero Section */}
      <NeuCard padding="lg" className="shadow-neu-raised relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neo-secondary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="font-body-md text-body-md text-neo-text-secondary mb-2 opacity-80">Total Balance</h2>
          <div className="flex items-baseline space-x-3 mb-1">
            <NeuIconBadge size="md" active className="flex-shrink-0" style={{ background: 'var(--neo-secondary)' }}>
              <span className="material-symbols-outlined text-neo-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>toll</span>
            </NeuIconBadge>
            {walletLoading ? (
              <div className="h-10 w-32 neo-skeleton rounded" />
            ) : (
              <span className="font-h1 text-h1 text-neo-secondary tracking-tight">{coinBalance.toLocaleString()}</span>
            )}
          </div>
          <p className="font-data-md text-data-md text-neo-text-secondary mt-2 bg-neu-bg inline-block px-3 py-1 rounded-full shadow-neu-inset border border-neo-bg-dark">
            ≈ ₦{(coinBalance / 100).toFixed(2)} NGN
          </p>
        </div>
      </NeuCard>

      {/* Quick Action Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerContainer stagger={0.06}>
          <StaggerItem>
            <NeuCard padding="md" interactive className="flex flex-col items-center justify-center" onClick={() => setShowTopUp(true)}>
              <NeuIconBadge size="lg" active className="mb-2" style={{ background: 'var(--neo-secondary)' }}>
                <Plus className="w-6 h-6 text-neo-primary" />
              </NeuIconBadge>
              <span className="font-body-md text-body-md font-semibold text-neo-text-primary">Top Up</span>
            </NeuCard>
          </StaggerItem>

          <StaggerItem>
            <Link href="/dashboard/wallet/withdraw" className="block">
              <NeuCard padding="md" interactive className="flex flex-col items-center justify-center">
                <NeuIconBadge size="lg" className="mb-2">
                  <Landmark className="w-6 h-6 text-neo-primary" />
                </NeuIconBadge>
                <span className="font-body-md text-body-md font-semibold text-neo-text-primary">Withdraw</span>
              </NeuCard>
            </Link>
          </StaggerItem>

          <StaggerItem>
            <NeuCard padding="md" interactive className="flex flex-col items-center justify-center">
              <NeuIconBadge size="lg" className="mb-2">
                <Send className="w-6 h-6 text-neo-primary" />
              </NeuIconBadge>
              <span className="font-body-md text-body-md font-semibold text-neo-text-primary">Send Coins</span>
            </NeuCard>
          </StaggerItem>

          <StaggerItem>
            <NeuCard padding="md" interactive className="flex flex-col items-center justify-center">
              <NeuIconBadge size="lg" className="mb-2">
                <Receipt className="w-6 h-6 text-neo-primary" />
              </NeuIconBadge>
              <span className="font-body-md text-body-md font-semibold text-neo-text-primary">VTU/Bills</span>
            </NeuCard>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* Recent Withdrawals */}
      {withdrawals.length > 0 && (
        <NeuCard padding="none" className="overflow-hidden">
          <div className="p-6 border-b border-neo-bg-dark">
            <h3 className="font-h3 text-h3 text-neo-text-primary">Recent Withdrawals</h3>
          </div>
          <div className="divide-y divide-neo-bg-dark">
            {withdrawals.map((withdrawal) => (
              <NeuCard key={withdrawal.id} padding="md" interactive className="flex items-center justify-between rounded-none shadow-neu-flat">
                <div className="flex items-center space-x-4">
                  <NeuIconBadge size="md">
                    <Landmark className="w-5 h-5 text-neo-error" />
                  </NeuIconBadge>
                  <div>
                    <h4 className="font-body-md text-body-md font-medium text-neo-text-primary">
                      Withdrawal to {withdrawal.account_details?.bank_name || 'Bank Account'}
                    </h4>
                    <p className="font-body-sm text-body-sm text-neo-text-secondary">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-data-md text-data-md text-neo-error">
                    -{withdrawal.coin_amount.toLocaleString()} Coins
                  </p>
                  <p className="font-body-sm text-body-sm text-neo-text-secondary">
                    ₦{withdrawal.amount.toLocaleString()}
                  </p>
                  <div className="mt-1">{getStatusBadge(withdrawal.status)}</div>
                </div>
              </NeuCard>
            ))}
          </div>
        </NeuCard>
      )}

      {/* Transaction History */}
      <NeuCard padding="none" className="overflow-hidden">
        <div className="p-6 border-b border-neo-bg-dark flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-neo-text-primary">Recent Transactions</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        {transactionsLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 neo-skeleton rounded" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-neo-text-secondary">
            <span className="material-symbols-outlined text-[48px] mb-2">receipt_long</span>
            <p className="font-body-md text-body-md">No transactions yet</p>
          </div>
        ) : (
          <div className="divide-y divide-neo-bg-dark">
            {transactions.map((tx) => (
              <NeuCard key={tx.id} padding="md" interactive className="flex items-center justify-between rounded-none shadow-neu-flat">
                <div className="flex items-center space-x-4">
                  <NeuIconBadge size="md" active={tx.amount > 0}>
                    <span className={`material-symbols-outlined ${tx.amount > 0 ? 'text-neo-success' : 'text-neo-error'}`}>
                      {tx.amount > 0 ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                  </NeuIconBadge>
                  <div>
                    <h4 className="font-body-md text-body-md font-medium text-neo-text-primary">{formatType(tx.type)}</h4>
                    <p className="font-body-sm text-body-sm text-neo-text-secondary">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-data-md text-data-md flex items-center gap-1 ${tx.amount > 0 ? 'text-neo-success' : 'text-neo-text-primary'}`}>
                    {tx.amount > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                  </p>
                  {tx.description && (
                    <p className="font-body-sm text-body-sm text-neo-text-secondary">{tx.description}</p>
                  )}
                </div>
              </NeuCard>
            ))}
          </div>
        )}
      </NeuCard>
    </PageTransition>
  );
}