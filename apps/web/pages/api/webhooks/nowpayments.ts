import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto-js';

const NOWPAYMENTS_IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify HMAC signature
  const hmacSignature = req.headers['x-nowpayments-sig'] as string;
  const requestBody = JSON.stringify(req.body);
  
  const hmac = crypto.HmacSHA512(requestBody, NOWPAYMENTS_IPN_SECRET!);
  const calculatedSignature = crypto.enc.Base64.stringify(hmac);

  if (calculatedSignature !== hmacSignature) {
    console.error('Invalid NOWPayments signature');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const {
    payment_id,
    payment_status,
    pay_address,
    price_amount,
    price_currency,
    pay_amount,
    pay_currency,
    order_id,
    purchase_id,
    created_at,
    updated_at,
  } = req.body;

  console.log('NOWPayments IPN received:', {
    payment_id,
    payment_status,
    order_id,
    price_amount,
    pay_amount,
  });

  // Initialize Supabase client with service role (admin privileges)
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Map NOWPayments status to our internal status
    const statusMap: Record<string, 'PENDING' | 'COMPLETED' | 'FAILED'> = {
      'waiting': 'PENDING',
      'confirming': 'PENDING',
      'confirmed': 'PENDING',
      'sending': 'PENDING',
      'paid': 'PENDING',
      'finished': 'COMPLETED',
      'failed': 'FAILED',
      'refunded': 'FAILED',
      'expired': 'FAILED',
    };

    const internalStatus = statusMap[payment_status] || 'PENDING';

    // Find or create withdrawal request based on order_id
    // Order ID format should be: "topup_userId_timestamp"
    const [_, userId, timestamp] = order_id.split('_');

    if (!userId) {
      console.error('Invalid order_id format:', order_id);
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    // Get user's wallet
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('id, coin_balance')
      .eq('user_id', userId)
      .single();

    if (walletError || !wallet) {
      console.error('Wallet not found for user:', userId);
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Calculate coin amount (1 NGN = 100 coins, adjust rate as needed)
    const COIN_RATE = 100;
    const coinAmount = Math.floor(price_amount * COIN_RATE);

    if (internalStatus === 'COMPLETED') {
      // Update wallet balance
      const newBalance = BigInt(wallet.coin_balance) + BigInt(coinAmount);
      
      const { error: updateError } = await supabase
        .from('wallets')
        .update({ 
          coin_balance: newBalance.toString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', wallet.id);

      if (updateError) {
        console.error('Failed to update wallet:', updateError);
        return res.status(500).json({ error: 'Failed to update wallet' });
      }

      // Create transaction record
      const { error: txError } = await supabase
        .from('coin_transactions')
        .insert({
          user_id: userId,
          type: 'topup',
          amount: coinAmount,
          balance_after: newBalance.toString(),
          description: `Crypto top-up via NOWPayments (${pay_currency.toUpperCase()})`,
          reference_id: payment_id,
        });

      if (txError) {
        console.error('Failed to create transaction:', txError);
        // Don't fail here, wallet already updated
      }

      // Send Notification
      await supabase.from('notifications').insert({
        user_id: userId,
        type: 'SYSTEM',
        title: 'Top-up Successful',
        message: `Your deposit of ${coinAmount} coins via ${pay_currency.toUpperCase()} has been credited.`,
      });
    } else if (internalStatus === 'FAILED') {
      // Log failed payment
      await supabase
        .from('coin_transactions')
        .insert({
          user_id: userId,
          type: 'refund',
          amount: 0,
          balance_after: wallet.coin_balance,
          description: `Failed crypto top-up via NOWPayments (${pay_currency.toUpperCase()})`,
          reference_id: payment_id,
        });
    }

    // Success response to NOWPayments
    res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
