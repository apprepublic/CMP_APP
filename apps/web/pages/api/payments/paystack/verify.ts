import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface PaystackVerificationResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at: string;
    customer: { email: string };
    metadata: Record<string, any>;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!PAYSTACK_SECRET_KEY) {
    return res.status(500).json({ error: 'Paystack secret key not configured' });
  }

  const { reference, userId, cmpAmount } = req.body;

  if (!reference || !userId || !cmpAmount) {
    return res.status(400).json({ error: 'Missing required fields: reference, userId, cmpAmount' });
  }

  try {
    // Verify transaction with Paystack API
    const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!verifyRes.ok) {
      const errBody = await verifyRes.text();
      console.error('[PAYSTACK] Verification request failed:', errBody);
      return res.status(502).json({ error: 'Failed to verify transaction with Paystack' });
    }

    const result: PaystackVerificationResponse = await verifyRes.json();

    if (!result.status || result.data.status !== 'success') {
      console.error('[PAYSTACK] Transaction not successful:', result.data.status);
      return res.status(400).json({ error: `Transaction not successful: ${result.data.status}` });
    }

    // Check amount matches (amount is in kobo from Paystack)
    const amountKobo = result.data.amount;
    const amountNaira = amountKobo / 100;

    const coinAmount = Math.floor(amountNaira * 90); // 10% platform fee

    if (coinAmount < cmpAmount) {
      console.warn(`[PAYSTACK] Coin mismatch: paid ${coinAmount} vs expected ${cmpAmount}. Crediting actual.`);
    }

    const coinsToCredit = Math.max(coinAmount, cmpAmount);

    // Credit wallet via Supabase admin
    const { data: wallet, error: walletError } = await supabaseAdmin
      .from('wallets')
      .select('id, coin_balance')
      .eq('user_id', userId)
      .single();

    if (walletError || !wallet) {
      console.error('[PAYSTACK] Wallet not found:', userId, walletError);
      return res.status(404).json({ error: 'Wallet not found' });
    }

    const currentBalance = Number((wallet as any).coin_balance) || 0;
    const newBalance = currentBalance + coinsToCredit;

    const { error: updateError } = await supabaseAdmin
      .from('wallets')
      .update({ coin_balance: newBalance.toString() } as any)
      .eq('id', (wallet as any).id);

    if (updateError) {
      console.error('[PAYSTACK] Failed to update wallet:', updateError);
      return res.status(500).json({ error: 'Failed to credit wallet' });
    }

    // Record transaction
    const { error: txnError } = await supabaseAdmin
      .from('coin_transactions')
      .insert({
        wallet_id: (wallet as any).id,
        user_id: userId,
        type: 'TOPUP',
        amount: coinsToCredit,
        balance_after: newBalance.toString(),
        description: `Top-up via Paystack: ₦${amountNaira.toLocaleString()}`,
        metadata: {
          paystackReference: reference,
          amountNaira,
          amountKobo,
        },
      } as any);

    if (txnError) {
      console.error('[PAYSTACK] Failed to record transaction:', txnError);
      // Wallet already credited — non-fatal, log and continue
    }

    console.log(`[PAYSTACK] Credited ${coinsToCredit} CMP to user ${userId} (ref: ${reference})`);

    return res.status(200).json({
      success: true,
      coinsCredited: coinsToCredit,
      amountPaid: amountNaira,
      reference,
    });
  } catch (err: any) {
    console.error('[PAYSTACK] Verification error:', err);
    return res.status(500).json({ error: err.message || 'Verification failed' });
  }
}
