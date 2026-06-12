'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuIconBadge } from '@/components/ui/neu-icon-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Wallet, ArrowUpRight, CheckCircle, AlertCircle } from 'lucide-react';

interface CryptoPaymentData {
  paymentUrl: string;
  payAddress: string;
  payAmount: number;
  payCurrency: string;
  orderId: string;
  expiresAt: string;
}

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];
const COIN_RATE = 100; // 1 USD = 100 coins

export default function WalletTopUp() {
  const [amount, setAmount] = useState<number | ''>('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [paymentData, setPaymentData] = useState<CryptoPaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const queryClient = useQueryClient();

  // Get current user's wallet
  const { data: wallet, isLoading: walletLoading } = useQuery({
    queryKey: ['wallet'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('wallets' as any)
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as any;
    },
  });

  // Create payment mutation
  const createPayment = useMutation({
    mutationFn: async (topUpAmount: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const orderId = `topup_${user.id}_${Date.now()}`;
      
      const response = await fetch('/api/payments/nowpayments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: topUpAmount,
          currency: selectedCurrency,
          orderId,
          description: `Wallet top-up: $${topUpAmount}`,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setPaymentData(data);
    },
    onError: (error) => {
      console.error('Payment creation failed:', error);
    },
  });

  const handleTopUp = () => {
    if (!amount || amount < 1) return;
    createPayment.mutate(Number(amount));
  };

  const copyAddress = () => {
    if (paymentData?.payAddress) {
      navigator.clipboard.writeText(paymentData.payAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const coinAmount = amount ? Number(amount) * COIN_RATE : 0;

  if (walletLoading) {
    return (
      <NeuCard padding="lg" className="animate-pulse">
        <div className="h-8 bg-neu-bg rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-neu-bg rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-neu-bg rounded"></div>
          ))}
        </div>
      </NeuCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <NeuCard padding="lg" className="bg-gradient-to-br from-neo-primary to-neo-primary/80 text-white shadow-neu-raised">
        <div className="flex items-center gap-3 mb-2">
          <NeuIconBadge size="md" active className="bg-white/20">
            <Wallet className="w-5 h-5 text-white" />
          </NeuIconBadge>
          <span className="font-label-caps text-label-caps text-white/80 uppercase">Current Balance</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl">🪙</span>
          <span className="font-data-lg text-h1 text-white">
            {wallet?.coin_balance ? Number(wallet.coin_balance).toLocaleString() : '0'}
          </span>
          <span className="font-body-sm text-body-sm text-white/80">Coins</span>
        </div>
        <p className="font-body-sm text-body-sm text-white/80 mt-2">
          &asymp; ₦{(Number(wallet?.coin_balance || 0) / 100).toLocaleString()}
        </p>
      </NeuCard>

      {/* Top-Up Form */}
      {!paymentData ? (
        <NeuCard padding="lg" className="shadow-neu-flat">
          <h3 className="font-h3 text-h3 text-neo-text-primary mb-6">Top Up Your Wallet</h3>
          
          {/* Preset Amounts */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`py-3 rounded-lg font-body-md text-body-md transition-all ${
                  amount === preset
                    ? 'bg-neo-primary text-white shadow-neu-raised-sm'
                    : 'bg-neu-bg text-neo-text-secondary shadow-neu-flat hover:shadow-neu-raised-sm'
                }`}
              >
                ${preset}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block font-body-sm text-body-sm text-neo-text-secondary mb-2">
              Or enter custom amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-text-primary font-semibold">$</span>
              <Input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : '')}
                className="pl-8"
                placeholder="50"
              />
            </div>
          </div>

          {/* Coin Preview */}
          {amount && amount > 0 && (
            <NeuCard padding="md" className="bg-neu-bg shadow-neu-inset mb-6">
              <div className="flex justify-between items-center">
                <span className="font-body-md text-body-md text-neo-text-secondary">You will receive</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl">🪙</span>
                  <span className="font-data-lg text-data-lg text-neo-primary">
                    {coinAmount.toLocaleString()}
                  </span>
                  <span className="font-body-sm text-body-sm text-neo-text-secondary">Coins</span>
                </div>
              </div>
              <p className="font-label-caps text-label-caps text-neo-text-muted mt-2 text-center">
                Rate: 1 USD = {COIN_RATE} coins
              </p>
            </NeuCard>
          )}

          {/* Create Payment Button */}
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleTopUp}
            disabled={!amount || amount < 1 || createPayment.isPending}
          >
            {createPayment.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Payment...
              </>
            ) : (
              <>
                <ArrowUpRight className="w-5 h-5" />
                Continue to Payment
              </>
            )}
          </Button>

          {/* Supported Cryptocurrencies */}
          <div className="mt-6 pt-6 border-t border-neu-bg-dark">
            <p className="font-label-caps text-label-caps text-neo-text-secondary mb-3 text-center">
              Supported Cryptocurrencies
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'TRX', 'LTC', 'DOGE'].map((coin) => (
                <NeuCard key={coin} padding="none" className="px-3 py-1 rounded-full bg-neu-bg shadow-neu-flat">
                  <span className="font-body-sm text-body-sm text-neo-text-secondary">{coin}</span>
                </NeuCard>
              ))}
            </div>
          </div>
        </NeuCard>
      ) : (
        /* Payment Instructions */
        <NeuCard padding="lg" className="shadow-neu-flat">
          <div className="flex items-center gap-3 mb-6">
            <NeuIconBadge size="md" active className="bg-neo-secondary/20">
              <CheckCircle className="w-5 h-5 text-neo-secondary" />
            </NeuIconBadge>
            <h3 className="font-h3 text-h3 text-neo-text-primary">Complete Your Payment</h3>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-4 bg-neu-bg rounded-lg shadow-neu-inset">
              <span className="font-body-md text-body-md text-neo-text-secondary">Amount to Pay</span>
              <span className="font-data-lg text-data-lg text-neo-text-primary">
                {paymentData.payAmount} {paymentData.payCurrency}
              </span>
            </div>

            <div className="p-4 bg-neu-bg rounded-lg shadow-neu-inset">
              <div className="flex justify-between items-center mb-2">
                <span className="font-body-md text-body-md text-neo-text-secondary">Payment Address</span>
                <button
                  onClick={copyAddress}
                  className="text-neo-secondary hover:text-neo-secondary/80 transition-colors"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-neo-success" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">content_copy</span>
                  )}
                </button>
              </div>
              <p className="font-data-md text-data-md text-neo-text-primary break-all font-mono text-sm">
                {paymentData.payAddress}
              </p>
            </div>

            <div className="flex justify-between items-center p-4 bg-neu-bg rounded-lg shadow-neu-inset">
              <span className="font-body-md text-body-md text-neo-text-secondary">You Will Receive</span>
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <span className="font-data-lg text-data-lg text-neo-primary">
                  {coinAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => window.open(paymentData.paymentUrl, '_blank')}
            >
              Open Checkout
              <ArrowUpRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setPaymentData(null);
                setAmount('');
              }}
            >
              Cancel
            </Button>
          </div>

          {/* Expiration Notice */}
          <div className="mt-6 p-4 bg-neo-error/10 border border-neo-error/30 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-neo-error flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-body-sm text-body-sm text-neo-text-primary">
                This payment address expires in 24 hours.
              </p>
              <p className="font-body-sm text-body-sm text-neo-text-secondary mt-1">
                Send exactly <strong className="text-neo-text-primary">{paymentData.payAmount} {paymentData.payCurrency}</strong> to the address above. Sending a different amount may result in loss of funds.
              </p>
            </div>
          </div>
        </NeuCard>
      )}
    </div>
  );
}