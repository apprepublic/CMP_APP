'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/ui/page-transition';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { Plus, Landmark, Send, Receipt, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import WalletTopUp from '@/components/WalletTopUp';

const transactions = [
  { id: 1, type: 'TASK_EARN', description: 'Completed daily task', amount: 150, date: 'Today, 14:32', icon: 'play_circle' },
  { id: 2, type: 'WITHDRAWAL', description: 'Bank transfer', amount: -10000, date: 'Yesterday, 09:15', icon: 'account_balance', naira: '₦100.00' },
  { id: 3, type: 'REFERRAL_BONUS', description: 'L1 Referral earned', amount: 500, date: 'Jun 6, 18:45', icon: 'groups' },
  { id: 4, type: 'TOP_UP', description: 'Bank deposit', amount: 5000, date: 'Jun 5, 10:22', icon: 'add_circle' },
  { id: 5, type: 'MUSIC_STREAM', description: 'Stream earning', amount: 75, date: 'Jun 4, 22:15', icon: 'headphones' },
];

export default function WalletPage() {
  const [balance, setBalance] = useState(45200);
  const [showTopUp, setShowTopUp] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data } = await supabase
        .from('wallets')
        .select('coin_balance')
        .eq('user_id', user.id)
        .single();
      
      if (data) setBalance(Number(data.coin_balance));
    };

    fetchBalance();

    const channel = supabase
      .channel('wallet-balance')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'wallets',
          filter: `user_id=eq.${supabase.auth.getUser().then(d => d.data.user?.id)}`,
        },
        (payload) => {
          setBalance(Number((payload.new as any).coin_balance));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (showTopUp) {
    return (
      <PageTransition className="space-y-gutter">
        <Button variant="ghost" onClick={() => setShowTopUp(false)} className="mb-4">
          ← Back to Wallet
        </Button>
        <WalletTopUp />
      </PageTransition>
    );
  }
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
            <span className="font-h1 text-h1 text-neo-secondary tracking-tight">{balance.toLocaleString()}</span>
          </div>
          <p className="font-data-md text-data-md text-neo-text-secondary mt-2 bg-neu-bg inline-block px-3 py-1 rounded-full shadow-neu-inset border border-neo-bg-dark">
            &asymp; &#8358;{(balance / 100).toFixed(2)} NGN
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
            <NeuCard padding="md" interactive className="flex flex-col items-center justify-center">
              <NeuIconBadge size="lg" className="mb-2">
                <Landmark className="w-6 h-6 text-neo-primary" />
              </NeuIconBadge>
              <span className="font-body-md text-body-md font-semibold text-neo-text-primary">Withdraw</span>
            </NeuCard>
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

      {/* Transaction History */}
      <NeuCard padding="none" className="overflow-hidden">
        <div className="p-6 border-b border-neo-bg-dark flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-neo-text-primary">Recent Transactions</h3>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="divide-y divide-neo-bg-dark">
          {transactions.map((tx) => (
            <NeuCard key={tx.id} padding="md" interactive className="flex items-center justify-between rounded-none shadow-neu-flat">
              <div className="flex items-center space-x-4">
                <NeuIconBadge size="md" active={tx.amount > 0}>
                  <span className={`material-symbols-outlined ${tx.amount > 0 ? 'text-neo-success' : 'text-neo-error'}`}>{tx.icon}</span>
                </NeuIconBadge>
                <div>
                  <h4 className="font-body-md text-body-md font-medium text-neo-text-primary">{tx.type.replace('_', ' ')}</h4>
                  <p className="font-body-sm text-body-sm text-neo-text-secondary">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-data-md text-data-md flex items-center gap-1 ${tx.amount > 0 ? 'text-neo-success' : 'text-neo-text-primary'}`}>
                  {tx.amount > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </p>
                {tx.naira && (
                  <p className="font-body-sm text-body-sm text-neo-text-secondary">{tx.naira}</p>
                )}
              </div>
            </NeuCard>
          ))}
        </div>
      </NeuCard>
    </PageTransition>
  );
}
