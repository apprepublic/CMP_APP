'use client';

import Link from 'next/link';
import { useWallet } from '@/lib/useWallet';
import { useTransactions } from '@/lib/hooks';
import { useCurrency } from '@/lib/useCurrency';

const TX_LABELS: Record<string, string> = {
  earn: 'Task Earn',
  spend: 'Spend',
  TOPUP: 'Top Up',
  WITHDRAWAL: 'Withdrawal',
  REFUND: 'Refund',
  TASK_EARN: 'Task Earn',
  READ_ARTICLE: 'Read Article',
  WATCH_AD: 'Watch Ad',
  REFERRAL_REWARD: 'Referral Reward',
  REFERRAL_SIGNUP: 'Referral Signup',
  STREAK_BONUS: 'Streak Bonus',
  AIRTIME_PURCHASE: 'Airtime',
  DATA_PURCHASE: 'Data',
  ELECTRICITY_PURCHASE: 'Electricity',
  VOTE: 'Vote',
  MUSIC_STREAM: 'Music Stream',
  bonus: 'Bonus',
};

const TX_ICONS: Record<string, string> = {
  earn: 'play_circle',
  spend: 'remove_circle',
  TOPUP: 'add_circle',
  WITHDRAWAL: 'account_balance',
  REFUND: 'undo',
  TASK_EARN: 'play_circle',
  READ_ARTICLE: 'menu_book',
  WATCH_AD: 'tv',
  REFERRAL_REWARD: 'groups',
  REFERRAL_SIGNUP: 'group_add',
  STREAK_BONUS: 'local_fire_department',
  AIRTIME_PURCHASE: 'call',
  DATA_PURCHASE: 'wifi',
  ELECTRICITY_PURCHASE: 'bolt',
  VOTE: 'how_to_vote',
  MUSIC_STREAM: 'headphones',
  bonus: 'card_giftcard',
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function MobileWalletHub() {
  const { wallet, loading: walletLoading } = useWallet();
  const { data: transactions = [], isLoading: txLoading, isError: txError } = useTransactions(wallet?.id || '');
  const { formatFiat, loadingLocation } = useCurrency();

  const coinBalance = wallet?.balance ?? 0;

  return (
    <div className="lg:hidden min-h-screen bg-surface pb-[160px]">
      <main className="pt-20 px-4 pb-8 flex flex-col gap-6 max-w-3xl mx-auto w-full">
        {/* Balance Hero */}
        <section className="bg-primary-container rounded-xl p-6 relative overflow-hidden shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.12)] border-t border-primary-fixed-dim/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <img src="/coin.png" alt="" className="w-4 h-4 object-contain" />
              <span className="font-label-caps text-label-caps text-on-primary-container opacity-80">Total Balance</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-h1-mobile text-h1-mobile text-secondary-fixed tracking-tight">
                {walletLoading ? '...' : coinBalance.toLocaleString()}
              </span>
              <span className="font-data-md text-data-md text-on-primary-container">CMP</span>
            </div>
            <p className="font-data-sm text-data-sm text-on-primary-container bg-on-primary-fixed/50 inline-block px-3 py-1 rounded-full border border-outline/30">
              {loadingLocation ? '...' : `≈ ${formatFiat(coinBalance)}`}
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <Link href="/wallet/topup" className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-xl shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-[#B8860B] mb-1 text-2xl">add_circle</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">Top Up</span>
          </Link>
          <Link href="/wallet/withdraw" className="flex flex-col items-center justify-center p-4 bg-surface-container-lowest rounded-xl shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)] border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant mb-1 text-2xl">account_balance</span>
            <span className="font-body-sm text-body-sm text-on-surface font-medium">Withdraw</span>
          </Link>
        </section>

        {/* Recent Transactions */}
        <section className="bg-surface-container-lowest rounded-xl shadow-[-4px_-4px_10px_rgba(255,255,255,0.8),4px_4px_10px_rgba(13,27,53,0.08)] border border-outline-variant/20 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/20 flex justify-between items-center">
            <h3 className="font-body-md text-body-md text-on-surface font-semibold">Recent Transactions</h3>
            <button className="font-body-sm text-body-sm text-[#B8860B]">View All</button>
          </div>
          <div className="divide-y divide-outline-variant/20">
            {txLoading ? (
              <div className="p-6 flex justify-center text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Loading...
              </div>
            ) : txError ? (
              <div className="p-6 text-center text-error">Failed to load transactions.</div>
            ) : transactions.length === 0 ? (
              <div className="p-6 text-center text-on-surface-variant">No recent transactions.</div>
            ) : (
              transactions.slice(0, 10).map((tx) => {
                const isPositive = !['WITHDRAWAL','spend'].includes(tx.type);
                return (
                  <div key={tx.id} className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        <span className="material-symbols-outlined text-[20px]">{TX_ICONS[tx.type] || 'toll'}</span>
                      </div>
                      <div>
                        <p className="font-body-sm text-body-sm font-medium text-on-surface">{TX_LABELS[tx.type] || tx.type}</p>
                        <p className="font-data-xs text-data-xs text-on-surface-variant">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-body-sm text-body-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? '+' : '-'}{Number(tx.amount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function WalletPage() {
  const { wallet, loading: walletLoading } = useWallet();
  const { data: transactions = [], isLoading: txLoading, isError: txError } = useTransactions(wallet?.id || '');
  const { formatFiat, loadingLocation } = useCurrency();

  const coinBalance = wallet?.balance ?? 0;

  return (
    <>
      <MobileWalletHub />
      <main className="hidden lg:block flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full space-y-gutter">
        {/* Balance Hero Section */}
        <section className="bg-primary-container rounded-xl p-8 relative overflow-hidden shadow-lg border border-outline-variant/20">
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
              {loadingLocation ? 'Detecting currency...' : `≈ ${formatFiat(coinBalance)}`}
            </p>
          </div>
        </section>

        {/* Quick Action Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/wallet/topup" className="flex flex-col items-center justify-center p-6 bg-secondary-container rounded-lg hover:bg-secondary transition-colors group shadow-sm">
            <span className="material-symbols-outlined text-on-secondary-container group-hover:text-on-secondary mb-2 text-3xl transition-colors">add_circle</span>
            <span className="font-body-md text-body-md font-semibold text-on-secondary-container group-hover:text-on-secondary transition-colors">Top Up</span>
          </Link>
          <Link href="/wallet/withdraw" className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
            <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">account_balance</span>
            <span className="font-body-md text-body-md font-semibold text-on-surface">Withdraw</span>
          </Link>
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
            ) : txError ? (
               <div className="p-8 text-center text-error">
                 Failed to load transactions. Please try again.
               </div>
            ) : transactions.length === 0 ? (
               <div className="p-8 text-center text-on-surface-variant">
                 No recent transactions found.
               </div>
            ) : (
              transactions.map((tx) => {
                const isPositive = !['WITHDRAWAL','spend'].includes(tx.type);
                return (
                  <div key={tx.id} className="p-4 hover:bg-surface-bright transition-colors flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPositive ? 'bg-secondary-fixed/20 text-secondary-container' : 'bg-error-container/50 text-error'}`}>
                        <span className="material-symbols-outlined">
                          {TX_ICONS[tx.type] || 'toll'}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-body-md text-body-md font-medium text-on-surface">{TX_LABELS[tx.type] || tx.type}</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{formatDate(tx.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-data-md text-data-md ${isPositive ? 'text-success-verified' : 'text-error'}`}>
                        {isPositive ? '+' : '-'} {Number(tx.amount).toLocaleString()}
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
    </>
  );
}
