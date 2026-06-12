import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto-js';

const NOWPAYMENTS_API_KEY = process.env.NEXT_PUBLIC_NOWPAYMENTS_API_KEY;
const NOWPAYMENTS_BASE_URL = 'https://api.nowpayments.io/v1';

interface NowPaymentsPaymentRequest {
  price_amount: number;
  price_currency: string;
  pay_currency: string | null;
  ipn_callback_url: string;
  order_id: string;
  order_description: string;
}

interface NowPaymentsPaymentResponse {
  id: number;
  token_id: number;
  order_id: string;
  order_description: string;
  price_amount: number;
  price_currency: string;
  pay_currency: string;
  pay_address: string;
  pay_amount: number;
  outcome_amount: number;
  outcome_currency: string;
  payment_url: string;
  expiration_estimate_date: string;
  is_fixed_rate: boolean;
  is_fee_paid_by_user: boolean;
  payment_status: string;
  purchase_id: string;
  created_at: string;
  updated_at: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, currency = 'USD', pay_currency, orderId, description } = req.body;

  if (!amount || !orderId) {
    return res.status(400).json({ error: 'Amount and orderId are required' });
  }

  try {
    // Create payment request
    const paymentData: NowPaymentsPaymentRequest = {
      price_amount: amount,
      price_currency: currency.toUpperCase(),
      pay_currency: pay_currency || null, // null means user chooses on checkout
      ipn_callback_url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/webhooks/nowpayments`,
      order_id: orderId,
      order_description: description || `Wallet top-up for order ${orderId}`,
    };

    const response = await fetch(`${NOWPAYMENTS_BASE_URL}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': NOWPAYMENTS_API_KEY!,
      },
      body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('NOWPayments API Error:', error);
      return res.status(response.status).json(error);
    }

    const payment: NowPaymentsPaymentResponse = await response.json();

    return res.status(200).json({
      paymentId: payment.id,
      tokenId: payment.token_id,
      orderId: payment.order_id,
      paymentUrl: payment.payment_url,
      payAddress: payment.pay_address,
      payAmount: payment.pay_amount,
      payCurrency: payment.pay_currency,
      expirationDate: payment.expiration_estimate_date,
      priceAmount: payment.price_amount,
      priceCurrency: payment.price_currency,
    });
  } catch (error: any) {
    console.error('NOWPayments integration error:', error);
    return res.status(500).json({ error: 'Failed to create payment', details: error.message });
  }
}