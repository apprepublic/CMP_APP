'use client';

const transactions = [
  { id: 1, type: 'TASK_EARN', description: 'Completed daily task', amount: 150, date: 'Today, 14:32', icon: 'play_circle' },
  { id: 2, type: 'WITHDRAWAL', description: 'Bank transfer', amount: -10000, date: 'Yesterday, 09:15', icon: 'account_balance', naira: '₦100.00' },
  { id: 3, type: 'REFERRAL_BONUS', description: 'L1 Referral earned', amount: 500, date: 'Jun 6, 18:45', icon: 'groups' },
  { id: 4, type: 'TOP_UP', description: 'Bank deposit', amount: 5000, date: 'Jun 5, 10:22', icon: 'add_circle' },
  { id: 5, type: 'MUSIC_STREAM', description: 'Stream earning', amount: 75, date: 'Jun 4, 22:15', icon: 'headphones' },
];

export default function WalletPage() {
  return (
    <div className="space-y-gutter">
      {/* Balance Hero Section */}
      <section className="bg-primary-container rounded-xl p-8 relative overflow-hidden shadow-lg border border-outline-variant/20">
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-12 -mt-12 pointer-events-none"></div>
        <div className="relative z-10">
          <h2 className="font-body-md text-body-md text-inverse-primary mb-2 opacity-80">Total Balance</h2>
          <div className="flex items-baseline space-x-3 mb-1">
            <span className="material-symbols-outlined text-secondary-fixed text-4xl">toll</span>
            <span className="font-h1 text-h1 text-secondary-fixed tracking-tight">45,200</span>
          </div>
          <p className="font-data-md text-data-md text-on-primary-container bg-on-primary-fixed/50 inline-block px-3 py-1 rounded-full border border-outline/30">
            ≈ ₦452.00 NGN
          </p>
        </div>
      </section>

      {/* Quick Action Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Top Up (Primary Action) */}
        <button className="flex flex-col items-center justify-center p-6 bg-secondary-container rounded-lg hover:bg-secondary transition-colors group shadow-sm">
          <span className="material-symbols-outlined text-on-secondary-container group-hover:text-on-secondary mb-2 text-3xl transition-colors">add_circle</span>
          <span className="font-body-md text-body-md font-semibold text-on-secondary-container group-hover:text-on-secondary transition-colors">Top Up</span>
        </button>

        {/* Withdraw */}
        <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
          <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">account_balance</span>
          <span className="font-body-md text-body-md font-semibold text-on-surface">Withdraw</span>
        </button>

        {/* Send Coins */}
        <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
          <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">send</span>
          <span className="font-body-md text-body-md font-semibold text-on-surface">Send Coins</span>
        </button>

        {/* VTU/Bills */}
        <button className="flex flex-col items-center justify-center p-6 bg-surface-container-lowest border border-outline-variant rounded-lg hover:border-primary-container transition-all group shadow-sm">
          <span className="material-symbols-outlined text-primary-container mb-2 text-3xl">receipt_long</span>
          <span className="font-body-md text-body-md font-semibold text-on-surface">VTU/Bills</span>
        </button>
      </section>

      {/* Transaction History */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/50 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/50 flex justify-between items-center">
          <h3 className="font-h3 text-h3 text-on-surface">Recent Transactions</h3>
          <button className="font-body-sm text-body-sm text-surface-tint hover:text-primary transition-colors">View All</button>
        </div>
        <div className="divide-y divide-outline-variant/30">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 hover:bg-surface-bright transition-colors flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  tx.amount > 0 ? 'bg-success-verified/10' : 'bg-error-container/50'
                }`}>
                  <span className={`material-symbols-outlined ${
                    tx.amount > 0 ? 'text-success-verified' : 'text-error'
                  }`}>{tx.icon}</span>
                </div>
                <div>
                  <h4 className="font-body-md text-body-md font-medium text-on-surface">{tx.type.replace('_', ' ')}</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-data-md text-data-md ${tx.amount > 0 ? 'text-success-verified' : 'text-on-surface'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </p>
                {tx.naira && (
                  <p className="font-body-sm text-body-sm text-on-surface-variant">{tx.naira}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}