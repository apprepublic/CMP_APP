import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { VTU_RATES } from '@cmpapp/utils';

const router = Router();

// Get VTU rates
router.get('/rates', async (req: Request, res: Response) => {
  res.json({ rates: VTU_RATES });
});

// Purchase airtime
const airtimeSchema = z.object({
  phoneNumber: z.string().min(10),
  amount: z.number().min(100).max(5000),
  network: z.enum(['MTN', 'AIRTEL', 'GLO', '9MOBILE'])
});

router.post('/airtime', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = airtimeSchema.parse(req.body);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  // Calculate coin cost (simplified)
  const coinCost = Math.ceil(data.amount / 100) * VTU_RATES.AIRTIME_100;

  if (wallet.coinBalance < BigInt(coinCost)) {
    throw new AppError('Insufficient balance', 400);
  }

  // Create transaction (simulated)
  const vtu = await prisma.vtuTransaction.create({
    data: {
      userId: authReq.user!.id,
      serviceType: 'AIRTIME',
      provider: data.network,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      coinsUsed: coinCost,
      networkCode: getNetworkCode(data.network),
      status: 'PENDING'
    }
  });

  // Deduct coins
  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { decrement: BigInt(coinCost) },
        lifetimeSpent: { increment: BigInt(coinCost) }
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'AIRTIME_PURCHASE',
        amount: BigInt(-coinCost),
        balanceAfter: wallet.coinBalance - BigInt(coinCost),
        description: `Airtime purchase: ₦${data.amount} for ${data.phoneNumber}`,
        metadata: {
          vtuId: vtu.id,
          network: data.network,
          phoneNumber: data.phoneNumber
        }
      }
    })
  ]);

  // Simulate success (in production, integrate with VTPass)
  await prisma.vtuTransaction.update({
    where: { id: vtu.id },
    data: { status: 'SUCCESS', externalRef: `SIM_${Date.now()}` }
  });

  res.json({
    message: 'Airtime purchased successfully',
    transaction: {
      id: vtu.id,
      phoneNumber: data.phoneNumber,
      amount: data.amount,
      coinsUsed: coinCost,
      status: 'SUCCESS'
    }
  });
});

// Purchase data
const dataSchema = z.object({
  phoneNumber: z.string().min(10),
  bundle: z.string(), // e.g., "500MB", "1GB", "2GB"
  network: z.enum(['MTN', 'AIRTEL', 'GLO', '9MOBILE'])
});

router.post('/data', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = dataSchema.parse(req.body);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  // Map bundle to coin cost
  const bundleCosts: Record<string, number> = {
    '500MB': VTU_RATES.DATA_500MB,
    '1GB': 5000,
    '2GB': 9000,
    '5GB': 20000,
    '10GB': 35000
  };

  const coinCost = bundleCosts[data.bundle] || VTU_RATES.DATA_500MB;

  if (wallet.coinBalance < BigInt(coinCost)) {
    throw new AppError('Insufficient balance', 400);
  }

  const vtu = await prisma.vtuTransaction.create({
    data: {
      userId: authReq.user!.id,
      serviceType: 'DATA',
      provider: data.network,
      phoneNumber: data.phoneNumber,
      amount: coinCost, // Store coin cost as "amount" for data
      coinsUsed: coinCost,
      networkCode: getNetworkCode(data.network),
      bundleCode: data.bundle,
      status: 'PENDING'
    }
  });

  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { decrement: BigInt(coinCost) },
        lifetimeSpent: { increment: BigInt(coinCost) }
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'DATA_PURCHASE',
        amount: BigInt(-coinCost),
        balanceAfter: wallet.coinBalance - BigInt(coinCost),
        description: `Data purchase: ${data.bundle} for ${data.phoneNumber}`,
        metadata: {
          vtuId: vtu.id,
          network: data.network,
          phoneNumber: data.phoneNumber,
          bundle: data.bundle
        }
      }
    })
  ]);

  // Simulate success
  await prisma.vtuTransaction.update({
    where: { id: vtu.id },
    data: { status: 'SUCCESS', externalRef: `SIM_${Date.now()}` }
  });

  res.json({
    message: 'Data purchased successfully',
    transaction: {
      id: vtu.id,
      phoneNumber: data.phoneNumber,
      bundle: data.bundle,
      coinsUsed: coinCost,
      status: 'SUCCESS'
    }
  });
});

// Purchase electricity
const electricitySchema = z.object({
  meterNumber: z.string().min(10),
  amount: z.number().min(100).max(50000),
  provider: z.enum(['IKEDC', 'EEDC', 'PHED', 'JED', 'KAEDCO', 'KEDCO', 'LAEDC', 'NED'])
});

router.post('/electricity', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = electricitySchema.parse(req.body);

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  const coinCost = Math.ceil(data.amount / 500) * VTU_RATES.ELECTRICITY_500;

  if (wallet.coinBalance < BigInt(coinCost)) {
    throw new AppError('Insufficient balance', 400);
  }

  const vtu = await prisma.vtuTransaction.create({
    data: {
      userId: authReq.user!.id,
      serviceType: 'ELECTRICITY',
      provider: data.provider,
      phoneNumber: data.meterNumber,
      amount: data.amount,
      coinsUsed: coinCost,
      meterNumber: data.meterNumber,
      status: 'PENDING'
    }
  });

  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { decrement: BigInt(coinCost) },
        lifetimeSpent: { increment: BigInt(coinCost) }
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'ELECTRICITY_PURCHASE',
        amount: BigInt(-coinCost),
        balanceAfter: wallet.coinBalance - BigInt(coinCost),
        description: `Electricity: ₦${data.amount} for meter ${data.meterNumber}`,
        metadata: {
          vtuId: vtu.id,
          provider: data.provider,
          meterNumber: data.meterNumber
        }
      }
    })
  ]);

  await prisma.vtuTransaction.update({
    where: { id: vtu.id },
    data: { status: 'SUCCESS', externalRef: `SIM_${Date.now()}` }
  });

  res.json({
    message: 'Electricity purchased successfully',
    transaction: {
      id: vtu.id,
      meterNumber: data.meterNumber,
      amount: data.amount,
      coinsUsed: coinCost,
      status: 'SUCCESS'
    }
  });
});

// Get VTU history
router.get('/history', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { page = '1', limit = '20', serviceType } = req.query;

  const where: any = { userId: authReq.user!.id };
  if (serviceType) where.serviceType = serviceType;

  const [transactions, total] = await Promise.all([
    prisma.vtuTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.vtuTransaction.count({ where })
  ]);

  res.json({
    transactions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Helper functions
function getNetworkCode(network: string): string {
  const codes: Record<string, string> = {
    'MTN': 'mtn',
    'AIRTEL': 'airtel',
    'GLO': 'glo',
    '9MOBILE': '9mobile'
  };
  return codes[network] || 'mtn';
}

export default router;