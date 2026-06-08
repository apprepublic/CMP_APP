import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import crypto from 'crypto';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Verify Paystack webhook signature
function verifyPaystackSignature(req: Request, secret: string): boolean {
  const signature = req.headers['x-paystack-signature'] as string;
  const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
  return signature === hash;
}

// Paystack webhook
router.post('/paystack', async (req: Request, res: Response) => {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET;

  if (secret && !verifyPaystackSignature(req, secret)) {
    throw new AppError('Invalid signature', 401);
  }

  const { event, data } = req.body;

  switch (event) {
    case 'charge.success':
      await handlePaystackChargeSuccess(data);
      break;

    case 'transfer.failed':
      await handlePaystackTransferFailed(data);
      break;

    case 'transfer.success':
      await handlePaystackTransferSuccess(data);
      break;

    case 'transfer.reversed':
      await handlePaystackTransferReversed(data);
      break;

    default:
      console.log(`[PAYSTACK] Unhandled event: ${event}`);
  }

  res.json({ received: true });
});

// Handle successful charge (top-up)
async function handlePaystackChargeSuccess(data: any) {
  const { reference, amount, customer, metadata } = data;

  console.log(`[PAYSTACK] Charge success: ${reference}, amount: ${amount}`);

  // Find user by metadata
  if (!metadata || !metadata.userId) {
    console.error('[PAYSTACK] No userId in metadata');
    return;
  }

  const userId = metadata.userId;
  const amountNaira = amount / 100; // Convert kobo to naira
  const coinsReceived = Math.floor(amountNaira * 90); // 10% platform fee

  const wallet = await prisma.wallet.findUnique({ where: { userId } });

  if (!wallet) {
    console.error('[PAYSTACK] Wallet not found:', userId);
    return;
  }

  // Credit wallet
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { increment: BigInt(coinsReceived) },
        lifetimeEarned: { increment: BigInt(coinsReceived) }
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'TOPUP',
        amount: BigInt(coinsReceived),
        balanceAfter: wallet.coinBalance + BigInt(coinsReceived),
        description: `Top up via Paystack: ₦${amountNaira}`,
        metadata: {
          paystackReference: reference,
          amountNaira
        }
      }
    })
  ]);

  console.log(`[PAYSTACK] Credited ${coinsReceived} coins to user ${userId}`);
}

// Handle failed transfer
async function handlePaystackTransferFailed(data: any) {
  const { reference, amount, recipient } = data;

  console.log(`[PAYSTACK] Transfer failed: ${reference}`);

  // Find withdrawal by reference
  const withdrawal = await prisma.withdrawalRequest.findFirst({
    where: {
      status: 'PROCESSING',
      bankAccount: recipient?.account_number
    },
    include: { wallet: true }
  });

  if (!withdrawal) {
    console.error('[PAYSTACK] Withdrawal not found for failed transfer');
    return;
  }

  // Refund coins
  await prisma.$transaction([
    prisma.withdrawalRequest.update({
      where: { id: withdrawal.id },
      data: {
        status: 'FAILED',
        rejectionReason: 'Transfer failed by payment provider'
      }
    }),
    prisma.wallet.update({
      where: { id: withdrawal.wallet.id },
      data: {
        coinBalance: { increment: withdrawal.coinsAmount }
      }
    })
  ]);

  console.log(`[PAYSTACK] Refunded ${withdrawal.coinsAmount} coins to wallet`);
}

// Handle successful transfer
async function handlePaystackTransferSuccess(data: any) {
  const { reference } = data;

  console.log(`[PAYSTACK] Transfer success: ${reference}`);

  // Find and update withdrawal
  const withdrawal = await prisma.withdrawalRequest.findFirst({
    where: {
      status: 'PROCESSING'
    },
    orderBy: { createdAt: 'asc' }
  });

  if (!withdrawal) {
    console.error('[PAYSTACK] No pending withdrawal found');
    return;
  }

  await prisma.withdrawalRequest.update({
    where: { id: withdrawal.id },
    data: {
      status: 'COMPLETED',
      processedAt: new Date()
    }
  });

  console.log(`[PAYSTACK] Withdrawal ${withdrawal.id} completed`);
}

// Handle reversed transfer
async function handlePaystackTransferReversed(data: any) {
  const { reference, amount } = data;

  console.log(`[PAYSTACK] Transfer reversed: ${reference}`);

  // Find failed withdrawal and refund
  const withdrawal = await prisma.withdrawalRequest.findFirst({
    where: {
      status: 'FAILED'
    },
    orderBy: { createdAt: 'desc' },
    include: { wallet: true }
  });

  if (withdrawal) {
    await prisma.wallet.update({
      where: { id: withdrawal.wallet.id },
      data: {
        coinBalance: { increment: withdrawal.coinsAmount }
      }
    });

    console.log(`[PAYSTACK] Refunded reversed transfer`);
  }
}

// Binance webhook (for crypto withdrawals)
router.post('/binance', async (req: Request, res: Response) => {
  const { eventType, data } = req.body;

  switch (eventType) {
    case 'PAYMENT_STATUS_CHANGED':
      await handleBinancePaymentStatus(data);
      break;
    default:
      console.log(`[BINANCE] Unhandled event: ${eventType}`);
  }

  res.json({ received: true });
});

async function handleBinancePaymentStatus(data: any) {
  const { merchantId, orderId, status } = data;

  console.log(`[BINANCE] Payment status: ${status} for order ${orderId}`);

  if (status === 'PAID') {
    // Find and update withdrawal
    const withdrawal = await prisma.withdrawalRequest.findFirst({
      where: {
        status: 'PROCESSING',
        currency: 'USDT'
      },
      orderBy: { createdAt: 'asc' }
    });

    if (withdrawal) {
      await prisma.withdrawalRequest.update({
        where: { id: withdrawal.id },
        data: {
          status: 'COMPLETED',
          processedAt: new Date()
        }
      });
    }
  }
}

// VTPass webhook (for VTU services)
router.post('/vtpass', async (req: Request, res: Response) => {
  const { responseCode, responseDescription, requestId, amount, phone } = req.body;

  console.log(`[VTPASS] Response: ${responseCode} - ${responseDescription}`);

  // Find transaction
  const transaction = await prisma.vtuTransaction.findFirst({
    where: {
      externalRef: requestId
    },
    orderBy: { createdAt: 'desc' }
  });

  if (!transaction) {
    console.error('[VTPASS] Transaction not found:', requestId);
    return;
  }

  // Update status based on response
  const newStatus = responseCode === '000' ? 'SUCCESS' : 'FAILED';

  await prisma.vtuTransaction.update({
    where: { id: transaction.id },
    data: { status: newStatus }
  });

  // If failed, refund coins
  if (newStatus === 'FAILED') {
    const wallet = await prisma.wallet.findUnique({
      where: { userId: transaction.userId }
    });

    if (wallet) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            coinBalance: { increment: BigInt(transaction.coinsUsed) }
          }
        }),
        prisma.coinTransaction.create({
          data: {
            walletId: wallet.id,
            type: transaction.serviceType === 'AIRTIME' ? 'AIRTIME_PURCHASE' :
                  transaction.serviceType === 'DATA' ? 'DATA_PURCHASE' : 'ELECTRICITY_PURCHASE',
            amount: BigInt(transaction.coinsUsed),
            balanceAfter: wallet.coinBalance + BigInt(transaction.coinsUsed),
            description: `Refund: ${transaction.serviceType} purchase failed`,
            metadata: { vtuId: transaction.id }
          }
        })
      ]);
    }
  }

  res.json({ received: true });
});

// Health check for webhooks
router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;