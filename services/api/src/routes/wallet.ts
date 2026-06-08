import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { coinsToNaira, calculateWithdrawalFee, coinsAfterWithdrawalFee, MIN_WITHDRAWAL_COINS, COIN_TO_NAIRA_RATE } from '@cmpapp/utils';

const router = Router();

// Get wallet balance
router.get('/', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id },
    include: {
      user: {
        select: {
          kycStatus: true
        }
      }
    }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  res.json({
    wallet: {
      coinBalance: Number(wallet.coinBalance),
      pendingCoins: Number(wallet.pendingCoins),
      lifetimeEarned: Number(wallet.lifetimeEarned),
      lifetimeSpent: Number(wallet.lifetimeSpent),
      nairaValue: coinsToNaira(wallet.coinBalance),
      kycStatus: wallet.user.kycStatus
    }
  });
});

// Get transaction history
router.get('/transactions', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const query = req.query as { page?: string; limit?: string; type?: string };
  const page = query?.page || '1';
  const limit = query?.limit || '20';
  const type = query?.type;

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  const where: any = { walletId: wallet.id };
  if (type) {
    where.type = type;
  }

  const [transactions, total] = await Promise.all([
    prisma.coinTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.coinTransaction.count({ where })
  ]);

  res.json({
    transactions: transactions.map(t => ({
      id: t.id,
      type: t.type,
      amount: Number(t.amount),
      balanceAfter: Number(t.balanceAfter),
      description: t.description,
      metadata: t.metadata,
      createdAt: t.createdAt
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Top up (simulated for development)
const topUpSchema = z.object({
  amount: z.number().min(100), // Minimum ₦100
  paymentMethod: z.string()
});

router.post('/topup', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = topUpSchema.parse(req.body);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  // Convert Naira to coins (₦100 = 9000 coins = 10% platform fee)
  const coinsReceived = Math.floor(data.amount * 90);

  // Update wallet
  const updatedWallet = await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      coinBalance: { increment: BigInt(coinsReceived) },
      lifetimeEarned: { increment: BigInt(coinsReceived) }
    }
  });

  // Create transaction record
  await prisma.coinTransaction.create({
    data: {
      walletId: wallet.id,
      type: 'TOPUP',
      amount: BigInt(coinsReceived),
      balanceAfter: updatedWallet.coinBalance,
      description: `Top up of ₦${data.amount}`,
      metadata: {
        amountNaira: data.amount,
        paymentMethod: data.paymentMethod
      }
    }
  });

  res.json({
    message: 'Top up successful',
    coinsReceived,
    newBalance: Number(updatedWallet.coinBalance)
  });
});

// Withdraw
const withdrawSchema = z.object({
  coinsAmount: z.number().min(MIN_WITHDRAWAL_COINS),
  method: z.enum(['BANK', 'CRYPTO']),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  cryptoAddress: z.string().optional(),
  cryptoNetwork: z.string().optional(),
  pin: z.string().length(4)
});

router.post('/withdraw', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = withdrawSchema.parse(req.body);

  // Check KYC
  const user = await prisma.user.findUnique({
    where: { id: authReq.user!.id },
    include: { kycRecord: true }
  });

  if (!user || user.kycStatus !== 'VERIFIED') {
    throw new AppError('KYC verification required before withdrawal', 403);
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  if (wallet.coinBalance < BigInt(data.coinsAmount)) {
    throw new AppError('Insufficient balance', 400);
  }

  // Verify PIN (simplified - in production use proper hashing)
  if (data.pin !== '1234') { // TODO: Implement proper PIN
    throw new AppError('Invalid PIN', 401);
  }

  // Calculate amounts
  const fee = calculateWithdrawalFee(data.coinsAmount);
  const afterFee = coinsAfterWithdrawalFee(data.coinsAmount);
  const nairaValue = coinsToNaira(afterFee);

  // Create withdrawal request
  const withdrawal = await prisma.withdrawalRequest.create({
    data: {
      walletId: wallet.id,
      coinsAmount: BigInt(data.coinsAmount),
      fiatAmount: nairaValue,
      currency: data.method === 'CRYPTO' ? 'USDT' : 'NGN',
      method: data.method,
      bankAccount: data.bankAccount,
      bankName: data.bankName,
      cryptoAddress: data.cryptoAddress,
      cryptoNetwork: data.cryptoNetwork,
      status: 'PENDING'
    }
  });

  // Deduct coins from wallet
  await prisma.wallet.update({
    where: { id: wallet.id },
    data: {
      coinBalance: { decrement: BigInt(data.coinsAmount) },
      lifetimeSpent: { increment: BigInt(data.coinsAmount) }
    }
  });

  // Create transaction record
  await prisma.coinTransaction.create({
    data: {
      walletId: wallet.id,
      type: 'WITHDRAWAL',
      amount: BigInt(-data.coinsAmount),
      balanceAfter: wallet.coinBalance - BigInt(data.coinsAmount),
      description: `Withdrawal request: ${data.coinsAmount} coins`,
      metadata: {
        withdrawalId: withdrawal.id,
        fee,
        afterFee,
        nairaValue
      }
    }
  });

  res.json({
    message: 'Withdrawal request submitted',
    withdrawal: {
      id: withdrawal.id,
      coinsAmount: data.coinsAmount,
      fiatAmount: nairaValue,
      fee,
      status: withdrawal.status,
      createdAt: withdrawal.createdAt
    }
  });
});

// Get withdrawal history
router.get('/withdrawals', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const query = req.query as { page?: string; limit?: string };
  const page = query?.page || '1';
  const limit = query?.limit || '20';

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  const [withdrawals, total] = await Promise.all([
    prisma.withdrawalRequest.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.withdrawalRequest.count({ where: { walletId: wallet.id } })
  ]);

  res.json({
    withdrawals: withdrawals.map(w => ({
      id: w.id,
      coinsAmount: Number(w.coinsAmount),
      fiatAmount: w.fiatAmount,
      currency: w.currency,
      method: w.method,
      status: w.status,
      createdAt: w.createdAt,
      processedAt: w.processedAt
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

export default router;