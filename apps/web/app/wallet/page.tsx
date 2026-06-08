'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { formatNumber, formatDate } from '@/lib/utils';
import { Coins, ArrowUpRight, ArrowDownLeft, Wallet, TrendingUp, Clock } from 'lucide-react';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateWallet } = useUserStore();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  const loadTransactions = async () => {
    try {
      const data = await api.getTransactions(1, 20);
      setTransactions(data.transactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopUp = async () => {
    // In production, integrate Paystack here
    toast({
      title: 'Top Up',
      description: 'Payment integration would open here',
    });
  };

  const handleWithdraw = async () => {
    if (!user || user.kycStatus !== 'VERIFIED') {
      toast({
        variant: 'destructive',
        title: 'KYC Required',
        description: 'Please complete KYC verification to withdraw',
      });
      router.push('/profile?tab=kyc');
      return;
    }

    if (!user.wallet || user.wallet.coinBalance < 100000) {
      toast({
        variant: 'destructive',
        title: 'Insufficient balance',
        description: 'Minimum withdrawal is 100,000 coins (₦1,000)',
      });
      return;
    }

    setWithdrawing(true);

    try {
      await api.withdraw({
        coinsAmount: Number(user.wallet.coinBalance),
        method: 'BANK',
        bankAccount: '0123456789', // In production, let user enter their account
        bankName: 'First Bank',
        pin: '1234',
      });

      toast({
        title: 'Withdrawal initiated',
        description: 'Your withdrawal request has been submitted',
      });

      loadTransactions();

      // Refresh wallet
      const wallet = await api.getWallet();
      updateWallet(wallet.wallet);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Withdrawal failed',
        description: error.message,
      });
    } finally {
      setWithdrawing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-12 text-center">
        <Wallet className="mx-auto h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-2xl font-bold">Login Required</h2>
        <p className="mt-2 text-muted-foreground">Please login to view your wallet</p>
        <Button className="mt-6" onClick={() => router.push('/login')}>
          Login
        </Button>
      </div>
    );
  }

  const balance = user?.wallet?.coinBalance || 0;
  const nairaValue = balance / 100;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Wallet</h1>

      {/* Balance Card */}
      <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-80">Available Balance</p>
            <div className="mt-2 flex items-baseline gap-2">
              <Coins className="h-8 w-8" />
              <span className="text-4xl font-bold">{formatNumber(balance)}</span>
            </div>
            <p className="mt-2 text-lg opacity-80">≈ ₦{nairaValue.toLocaleString('en-NG')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">Lifetime Earned</p>
            <p className="text-xl font-bold flex items-center justify-end gap-1">
              <TrendingUp className="h-4 w-4" />
              {formatNumber(user?.wallet?.lifetimeEarned || 0)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleTopUp}
          >
            <ArrowDownLeft className="mr-2 h-4 w-4" />
            Top Up
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleWithdraw}
            disabled={withdrawing || balance < 100000}
          >
            <ArrowUpRight className="mr-2 h-4 w-4" />
            {withdrawing ? 'Processing...' : 'Withdraw'}
          </Button>
        </div>
      </div>

      {/* KYC Status */}
      {user?.kycStatus !== 'VERIFIED' && (
        <div className="mt-4 rounded-lg border border-yellow-500 bg-yellow-50 p-4 dark:bg-yellow-900/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Complete KYC to withdraw
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Verify your identity to enable withdrawals
              </p>
            </div>
            <Button size="sm" onClick={() => router.push('/profile?tab=kyc')}>
              Complete KYC
            </Button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Button variant="outline" className="h-auto flex-col py-4" onClick={handleTopUp}>
          <ArrowDownLeft className="h-6 w-6 mb-2" />
          <span className="text-sm">Top Up</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col py-4" onClick={handleWithdraw}>
          <ArrowUpRight className="h-6 w-6 mb-2" />
          <span className="text-sm">Withdraw</span>
        </Button>
        <Button variant="outline" className="h-auto flex-col py-4" onClick={() => router.push('/referrals')}>
          <TrendingUp className="h-6 w-6 mb-2" />
          <span className="text-sm">Referrals</span>
        </Button>
      </div>

      {/* Transaction History */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Transaction History</h2>

        {loading ? (
          <div className="mt-4 flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : transactions.length > 0 ? (
          <div className="mt-4 space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border bg-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    tx.amount > 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {tx.amount > 0 ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tx.createdAt)}
                    </p>
                  </div>
                </div>
                <div className={`font-bold ${
                  tx.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{formatNumber(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center py-8 text-muted-foreground">
            <Clock className="mx-auto h-8 w-8" />
            <p className="mt-2">No transactions yet</p>
          </div>
        )}
      </div>

      {/* Conversion Info */}
      <div className="mt-8 rounded-lg border bg-muted p-4">
        <h3 className="font-semibold">Coin Conversion</h3>
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>100 CMP Coins = ₦1</p>
          <p>Minimum withdrawal: 100,000 coins (₦1,000)</p>
          <p>Withdrawal fee: 1.5%</p>
          <p>Top up: ₦100 = 9,000 coins (10% platform fee)</p>
        </div>
      </div>
    </div>
  );
}