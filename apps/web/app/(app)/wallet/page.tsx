'use client';

import Link from 'next/link';
import { useWallet } from '@/lib/useWallet';
import { useTransactions } from '@/lib/hooks';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function WalletPage() {
  const { wallet, loading: walletLoading } = useWallet();
  const { data: transactions = [], isLoading: txLoading } = useTransactions(wallet?.id || '');

  const coinBalance = wallet?.coin_balance ?? 0;
  // Assume 100 coins = 1 NGN for display purposes
  const fiatEquivalent = (coinBalance / 100).toFixed(2);

  return (
    <main className="flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
      {/* Balance Hero Section */}
      <section className="bg-primary-container rounded-xl p-8 relative overflow-hidden shadow-lg border border-outline-variant/20">
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="font-body-md text-body-md text-inverse-primary mb-2 opacity-80">Total Balance</h2>
          <div className="flex items-baseline space-x-3 mb-1">
            <img src="/coin.png" alt="Coin" className="w-10 h-10 object-contain" />
            <span className="font-h1 text-h1 text-secondary-fixed tracking-tight">
              {walletLoading ? '...' : coinBalance.toLocaleString()}
            </span>
          </div>
          <p className="font-data-md text-data-md text-on-primary-container bg-on-primary-fixed/50 inline-block px-3 py-1 rounded-full border border-outline/30">
            ≈ ₦{fiatEquivalent} NGN
          </p>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Top Up (Primary Action) */}
        <Link href="/wallet/topup" className="flex flex-col items-center justify-center p-6 bg-secondary-container rounded-lg hover:bg-secondary transition-colors group shadow-sm">
          <span className="material-symbols-outlined text-on-secondary-container group-hover:text-on-secondary mb-2 text-3xl transition-colors">add_circle</span>
          <span className="font-body-md text-body-md font-semibold text-on-secondary-container group-hover:text-on-secondary transition-colors">Top Up</span>
        </Link>
        {/* Withdraw */}
        <Link href="/wallet/withdraw" className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
          <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">account_balance</span>
          <span className="font-body-md text-body-md font-semibold text-on-surface">Withdraw</span>
        </Link>
        {/* Send Coins */}
        <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
          <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">send</span>
          <span className="font-body-md text-body-md font-semibold text-on-surface">Send Coins</span>
        </button>
      </section>

      {/* Transaction History */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-on-surface">Recent Transactions</h3>
          <button className="font-body-sm text-body-sm text-surface-tint hover:text-primary transition-colors">View All</button>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {txLoading ? (
             <div className="p-8 flex justify-center text-on-surface-variant">
               <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
             </div>
          ) : transactions.length === 0 ? (
             <div className="p-8 text-center text-on-surface-variant">
               No recent transactions found.
             </div>
          ) : (
            transactions.map((tx) => {
              const isPositive = Number(tx.amount) > 0;
              return (
                <div key={tx.id} className="p-4 hover:bg-surface-bright transition-colors flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPositive ? 'bg-secondary-fixed/20 text-secondary-container' : 'bg-error-container/50 text-error'}`}>
                      <span className="material-symbols-outlined">
                        {tx.type === 'TASK_EARN' ? 'play_circle' : tx.type === 'WITHDRAWAL' ? 'account_balance' : tx.type === 'REFERRAL_REWARD' ? 'groups' : 'toll'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-body-md text-body-md font-medium text-on-surface">{tx.type}</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{formatDate(tx.created_at)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-data-md text-data-md ${isPositive ? 'text-success-verified' : 'text-on-surface'}`}>
                      {isPositive ? '+' : ''} {Number(tx.amount).toLocaleString()}
                    </p>
                    {tx.description && (
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{tx.description}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}
