'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/useAuth';

const CRYPTO_CURRENCIES = [
  { value: 'btc', label: 'Bitcoin', icon: 'currency_bitcoin', symbol: 'BTC', network: 'BTC' },
  { value: 'eth', label: 'Ethereum', icon: 'currency_ethereum', symbol: 'ETH', network: 'ERC20' },
  { value: 'usdterc20', label: 'USDT (ERC20)', icon: 'currency_dollar', symbol: 'USDT', network: 'ERC20' },
  { value: 'usdttrc20', label: 'USDT (TRC20)', icon: 'currency_dollar', symbol: 'USDT', network: 'TRC20' },
];

function generateOrderId(userId: string): string {
  return `topup_${userId}_${Date.now()}`;
}

function CryptoPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fiatAmount = parseFloat(searchParams?.get('amount') || '0');
  const cmpAmount = parseInt(searchParams?.get('cmp') || '0');
  const currency = 'USD';
  const { user } = useAuth();

  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'select' | 'creating' | 'created' | 'pending' | 'completed' | 'failed'>('select');
  const [paymentDetails, setPaymentDetails] = useState<{
    paymentId: number;
    orderId: string;
    paymentUrl: string;
    payAddress: string;
    payAmount: number;
    payCurrency: string;
    expirationDate: string;
  } | null>(null);
  const [cryptoPaymentId, setCryptoPaymentId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const symbol = '$';

  const selectedCurrencyInfo = CRYPTO_CURRENCIES.find(c => c.value === selectedCrypto);

  const createPayment = useCallback(async () => {
    if (!selectedCrypto || !user?.id || !fiatAmount) return;
    setPaymentStatus('creating');
    setError('');

    const orderId = generateOrderId(user.id);

    try {
      const apiRes = await fetch('/api/payments/nowpayments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: fiatAmount,
          currency,
          pay_currency: selectedCrypto,
          orderId,
          description: `Top-up ${cmpAmount} CMP via ${selectedCrypto}`,
        }),
      });

      if (!apiRes.ok) {
        const errBody = await apiRes.json().catch(() => ({}));
        throw new Error(errBody.error || errBody.message || 'Failed to create payment');
      }

      const data = await apiRes.json();

      const { data: inserted, error: insertError } = await supabase.from('crypto_payments').insert({
        user_id: user.id,
        nowpayments_id: data.paymentId,
        order_id: data.orderId,
        price_amount: data.priceAmount,
        price_currency: data.priceCurrency,
        pay_amount: data.payAmount,
        pay_currency: data.payCurrency,
        pay_address: data.payAddress,
        coin_amount: cmpAmount,
        status: 'PENDING',
        metadata: { cmpAmount, fiatAmount, paymentUrl: data.paymentUrl },
        expires_at: data.expirationDate,
      } as any).select('id').single();

      if (insertError) throw new Error(insertError.message);

      setCryptoPaymentId(inserted.id);
      setPaymentDetails({
        paymentId: data.paymentId,
        orderId: data.orderId,
        paymentUrl: data.paymentUrl,
        payAddress: data.payAddress,
        payAmount: data.payAmount,
        payCurrency: data.payCurrency,
        expirationDate: data.expirationDate,
      });
      setPaymentStatus('created');
    } catch (err: any) {
      setError(err.message || 'Failed to create crypto payment');
      setPaymentStatus('select');
    }
  }, [selectedCrypto, user, fiatAmount, currency, cmpAmount]);

  const copyAddress = () => {
    if (!paymentDetails?.payAddress) return;
    navigator.clipboard.writeText(paymentDetails.payAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const openPaymentUrl = () => {
    if (paymentDetails?.paymentUrl) {
      window.open(paymentDetails.paymentUrl, '_blank');
    }
  };

  useEffect(() => {
    if (paymentStatus !== 'created') return;
    const interval = setInterval(async () => {
      if (!cryptoPaymentId) return;
      const { data } = await supabase.from('crypto_payments').select('status').eq('id', cryptoPaymentId).single();
      if (data?.status === 'COMPLETED') {
        setPaymentStatus('completed');
        clearInterval(interval);
        setTimeout(() => {
          router.push(`/wallet/topup/success?amount=${fiatAmount}&method=crypto&coins=${cmpAmount}&ref=${paymentDetails?.orderId || ''}`);
        }, 1500);
      } else if (data?.status === 'FAILED' || data?.status === 'EXPIRED') {
        setPaymentStatus('failed');
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [paymentStatus, cryptoPaymentId, paymentDetails, router, fiatAmount, cmpAmount]);

  useEffect(() => {
    if (!paymentDetails?.expirationDate) return;
    const updateTimer = () => {
      const diff = new Date(paymentDetails.expirationDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('Expired'); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setTimeLeft(`${h}h ${m}m`);
    };
    updateTimer();
    const timer = setInterval(updateTimer, 60000);
    return () => clearInterval(timer);
  }, [paymentDetails]);

  if (paymentStatus === 'completed') {
    return (
      <div className="block md:hidden bg-background min-h-screen flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6 border-2 border-success/20">
          <span className="material-symbols-outlined text-success text-4xl">check_circle</span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Payment Confirmed!</h2>
        <p className="text-on-surface-variant font-body-sm text-center max-w-xs">Your crypto payment has been verified. Redirecting to success page...</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile */}
      <div className="block md:hidden bg-background text-on-surface font-body-md min-h-screen">
        <header className="fixed top-0 w-full z-50 h-16 bg-primary-container flex items-center px-margin-mobile shadow shadow-black/15">
          <button className="p-2 -ml-2 active:scale-95 transition-transform" onClick={() => { if (paymentStatus === 'select') window.history.back(); else setPaymentStatus('select'); }}>
            <span className="material-symbols-outlined text-gold-metallic">arrow_back</span>
          </button>
          <h1 className="ml-2 font-headline-md text-headline-md-mobile text-on-primary-fixed">Pay with Crypto</h1>
        </header>

        <main className="pt-24 pb-32 px-margin-mobile w-full mx-auto max-w-md">
          {paymentStatus === 'select' && (
            <>
              <div className="mb-6">
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-container">Select Cryptocurrency</h2>
                <p className="text-on-surface-variant font-body-sm mt-1">Choose which crypto to pay with. You'll send {symbol}{fiatAmount.toFixed(2)} worth.</p>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                {CRYPTO_CURRENCIES.map((crypto) => (
                  <button key={crypto.value} onClick={() => setSelectedCrypto(crypto.value)}
                    className={`w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all border-2 ${
                      selectedCrypto === crypto.value
                        ? 'border-gold-metallic bg-white shadow-[inset_4px_4px_8px_rgba(13,27,53,0.1),inset_-4px_-4px_8px_rgba(255,255,255,1)]'
                        : 'border-transparent bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-4px_-4px_12px_rgba(255,255,255,0.9)]'
                    }`}>
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary-container">{crypto.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-md text-body-md text-on-surface font-semibold">{crypto.label}</p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">Network: {crypto.network}</p>
                    </div>
                    {selectedCrypto === crypto.value && (
                      <span className="material-symbols-outlined text-gold-metallic">check_circle</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3 border border-outline-variant/30 mb-6">
                <span className="material-symbols-outlined text-gold-metallic">info</span>
                <p className="text-body-sm text-on-surface-variant">Send the exact amount shown. Crypto payments require network confirmations before credit.</p>
              </div>

              {error && <div className="mb-4 p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">{error}</div>}

              <button onClick={createPayment} disabled={!selectedCrypto}
                className={`w-full py-4 rounded-xl font-headline-md text-body-lg active:scale-[0.98] transition-all ${
                  selectedCrypto ? 'bg-primary-container text-white shadow-lg' : 'bg-surface-container text-on-surface-muted cursor-not-allowed'
                }`}>
                Generate Payment Address
              </button>
            </>
          )}

          {paymentStatus === 'creating' && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="material-symbols-outlined animate-spin text-4xl text-gold-metallic mb-4">progress_activity</span>
              <p className="text-on-surface font-body-md">Creating payment request...</p>
            </div>
          )}

          {paymentStatus === 'created' && paymentDetails && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gold-metallic/10 flex items-center justify-center mx-auto mb-3 border-2 border-gold-metallic/30">
                  <span className="material-symbols-outlined text-gold-metallic text-3xl">currency_bitcoin</span>
                </div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary-container">Send Crypto</h2>
                <p className="text-on-surface-variant font-body-sm mt-1">Send the exact amount below to the address. Your wallet will be credited automatically.</p>
              </div>

              <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)] rounded-xl p-5 mb-4 border-t-2 border-gold-metallic">
                <div className="space-y-4">
                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-1">Amount to Send</p>
                    <p className="font-numeric-display text-numeric-display text-primary-container text-xl">
                      {paymentDetails.payAmount.toFixed(8)} <span className="font-body-md">{paymentDetails.payCurrency.toUpperCase()}</span>
                    </p>
                  </div>

                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-1">Network</p>
                    <p className="font-body-md text-body-md text-on-surface">{selectedCurrencyInfo?.network || paymentDetails.payCurrency.toUpperCase()}</p>
                  </div>

                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-1">You'll Receive</p>
                    <p className="font-body-md text-body-md text-gold-metallic font-semibold">{cmpAmount.toLocaleString()} CMP</p>
                  </div>

                  {timeLeft && (
                    <div className="flex items-center gap-2 text-warning">
                      <span className="material-symbols-outlined text-[18px]">timer</span>
                      <span className="font-body-sm">Expires in {timeLeft}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white shadow-[8px_8px_16px_rgba(13,27,53,0.05),-8px_-8px_16px_rgba(255,255,255,0.8)] rounded-xl p-5 mb-4 border border-outline-variant/20">
                <p className="font-label-caps text-label-caps text-on-surface-muted uppercase mb-2">Send to Address</p>
                <div className="flex items-center gap-2 bg-surface-container-low rounded-lg p-3 border border-outline-variant/30">
                  <code className="flex-1 font-body-sm text-body-sm text-on-surface break-all select-all">{paymentDetails.payAddress}</code>
                  <button onClick={copyAddress} className="flex-shrink-0 p-2 bg-gold-metallic/10 rounded-lg active:scale-95 transition-transform">
                    <span className="material-symbols-outlined text-gold-metallic text-[20px]">
                      {copiedAddress ? 'check' : 'content_copy'}
                    </span>
                  </button>
                </div>
              </div>

              <button onClick={openPaymentUrl}
                className="w-full py-3 rounded-xl border-2 border-gold-metallic text-gold-metallic font-body-md active:scale-[0.98] transition-all mb-3 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">open_in_new</span>
                Open NOWPayments Checkout
              </button>

              <div className="bg-surface-container-low rounded-xl p-4 flex items-start gap-3 border border-outline-variant/30 mb-4">
                <span className="material-symbols-outlined text-gold-metallic mt-0.5">lightbulb</span>
                <div className="text-body-sm text-on-surface-variant">
                  <p className="font-semibold mb-1">After Sending:</p>
                  <p>1. Send the exact amount shown above</p>
                  <p>2. Wait for network confirmations (5-30 min)</p>
                  <p>3. Your CMP will be credited automatically</p>
                </div>
              </div>

              <div className="bg-primary-container/10 rounded-xl p-4 flex items-center gap-3 border border-primary-container/20">
                <span className="material-symbols-outlined text-primary-container animate-spin text-[20px]">refresh</span>
                <p className="text-body-sm text-on-surface-variant">Waiting for payment... Page refreshes every 5 seconds.</p>
              </div>
            </>
          )}

          {paymentStatus === 'failed' && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Payment Expired or Failed</h3>
              <p className="text-on-surface-variant text-body-sm text-center mb-6 max-w-xs">The payment window has expired or the transaction was cancelled.</p>
              <button onClick={() => { setPaymentStatus('select'); setPaymentDetails(null); setError(''); }}
                className="bg-primary-container text-white px-8 py-3 rounded-xl font-body-md">
                Try Again
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Desktop */}
      <div className="hidden md:block">
        <main className="flex-1 min-h-screen flex items-center justify-center bg-surface py-12">
          <div className="max-w-lg w-full mx-4">
            {paymentStatus === 'select' && (
              <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden">
                <div className="bg-primary-container p-8 text-center">
                  <h1 className="font-h2 text-h2 text-white mb-2">Pay with Crypto</h1>
                  <p className="text-on-primary-container font-body-sm">Select your preferred cryptocurrency</p>
                </div>
                <div className="p-6 space-y-3">
                  {CRYPTO_CURRENCIES.map((crypto) => (
                    <button key={crypto.value} onClick={() => setSelectedCrypto(crypto.value)}
                      className={`w-full p-4 rounded-xl text-left flex items-center gap-4 transition-all border-2 ${
                        selectedCrypto === crypto.value
                          ? 'border-gold-metallic bg-gold-metallic/5'
                          : 'border-outline-variant/30 hover:border-outline-variant/60'
                      }`}>
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl text-primary-container">{crypto.icon}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-body-md text-body-md text-on-surface font-semibold">{crypto.label}</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Network: {crypto.network}</p>
                      </div>
                      {selectedCrypto === crypto.value && (
                        <span className="material-symbols-outlined text-gold-metallic" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                    </button>
                  ))}
                </div>
                {error && <div className="px-6 pb-2"><div className="p-3 bg-error/10 border border-error/30 rounded-lg text-error text-sm">{error}</div></div>}
                <div className="p-6 border-t border-outline-variant/20">
                  <div className="flex items-center gap-2 mb-4 text-body-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">info</span>
                    <span>Crypto payments require network confirmations before credit.</span>
                  </div>
                  <button onClick={createPayment} disabled={!selectedCrypto}
                    className={`w-full py-4 rounded-xl font-h3 text-body-lg font-bold shadow-lg active:scale-[0.98] transition-all ${
                      selectedCrypto ? 'bg-secondary-container text-on-secondary-fixed' : 'bg-surface-container text-on-surface-muted cursor-not-allowed'
                    }`}>
                    Generate Payment Address
                  </button>
                </div>
              </div>
            )}

            {paymentStatus === 'creating' && (
              <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-12 text-center">
                <span className="material-symbols-outlined animate-spin text-5xl text-gold-metallic mb-4">progress_activity</span>
                <p className="text-on-surface font-body-md">Creating your payment request...</p>
              </div>
            )}

            {paymentStatus === 'created' && paymentDetails && (
              <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 overflow-hidden">
                <div className="bg-primary-container p-6 text-center">
                  <h2 className="font-h2 text-h2 text-white">Send Crypto</h2>
                  <p className="text-on-primary-container font-body-sm mt-1">Send the exact amount below</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="bg-surface-alt rounded-xl p-5 space-y-4 border border-outline-variant/20">
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-body-sm">Amount to Send</span>
                      <span className="font-data-lg text-data-lg text-primary">
                        {paymentDetails.payAmount.toFixed(8)} {paymentDetails.payCurrency.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-body-sm">Network</span>
                      <span className="font-body-md text-body-md text-on-surface font-semibold">{selectedCurrencyInfo?.network}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-on-surface-variant font-body-sm">You'll Receive</span>
                      <span className="font-body-md text-body-md text-gold-metallic font-semibold">{cmpAmount.toLocaleString()} CMP</span>
                    </div>
                    {timeLeft && (
                      <div className="flex items-center justify-between">
                        <span className="text-on-surface-variant font-body-sm">Expires in</span>
                        <span className="font-body-md text-body-md text-warning">{timeLeft}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Send to Address</p>
                    <div className="flex items-center gap-2 bg-surface-alt rounded-lg p-3 border border-outline-variant/30">
                      <code className="flex-1 text-body-sm text-on-surface break-all select-all">{paymentDetails.payAddress}</code>
                      <button onClick={copyAddress} className="flex-shrink-0 p-2 bg-gold-metallic/10 rounded-lg hover:bg-gold-metallic/20 transition-colors">
                        <span className="material-symbols-outlined text-gold-metallic">{copiedAddress ? 'check' : 'content_copy'}</span>
                      </button>
                    </div>
                  </div>

                  <button onClick={openPaymentUrl}
                    className="w-full py-3 rounded-xl border-2 border-gold-metallic text-gold-metallic font-body-md hover:bg-gold-metallic/5 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">open_in_new</span>
                    Open NOWPayments Checkout
                  </button>

                  <div className="bg-surface-container-low rounded-xl p-4 space-y-1 text-body-sm text-on-surface-variant border border-outline-variant/20">
                    <p className="font-semibold text-on-surface mb-1">After Sending:</p>
                    <p>1. Send the exact amount to the address above</p>
                    <p>2. Wait for blockchain confirmations</p>
                    <p>3. Your CMP will be credited automatically</p>
                  </div>

                  <div className="bg-primary-container/10 rounded-xl p-4 flex items-center gap-3 border border-primary-container/20">
                    <span className="material-symbols-outlined text-primary-container animate-spin">refresh</span>
                    <p className="text-body-sm text-on-surface-variant">Waiting for payment... Auto-detects when confirmed.</p>
                  </div>
                </div>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/30 p-12 text-center">
                <span className="material-symbols-outlined text-5xl text-error mb-4">error</span>
                <h3 className="font-h3 text-h3 text-on-surface mb-2">Payment Failed or Expired</h3>
                <p className="text-on-surface-variant font-body-md mb-6">The payment window has closed.</p>
                <button onClick={() => { setPaymentStatus('select'); setPaymentDetails(null); setError(''); }}
                  className="bg-primary-container text-white px-8 py-3 rounded-xl font-body-md">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default function CryptoPaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
      </div>
    }>
      <CryptoPaymentContent />
    </Suspense>
  );
}
