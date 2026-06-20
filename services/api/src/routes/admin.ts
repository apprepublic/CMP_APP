import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole } from '@prisma/client';

const router = Router();

// All admin routes require ADMIN or SUPER_ADMIN role
router.use(authenticate);
router.use(authorize('ADMIN', 'SUPER_ADMIN'));

// Dashboard stats
router.get('/stats', async (req: Request, res: Response) => {
  const [
    totalUsers,
    totalWallets,
    totalTasksCompleted,
    activeContests,
    pendingWithdrawals
  ] = await Promise.all([
    prisma.user.count(),
    prisma.wallet.count(),
    prisma.taskCompletion.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    }),
    prisma.contest.count({
      where: {
        isActive: true,
        endsAt: { gte: new Date() }
      }
    }),
    prisma.withdrawalRequest.count({
      where: { status: 'PENDING' }
    })
  ]);

  // Get total coins in system
  const wallets = await prisma.wallet.aggregate({
    _sum: {
      coinBalance: true
    }
  });

  res.json({
    stats: {
      totalUsers,
      totalWallets,
      totalTasksCompleted24h: totalTasksCompleted,
      activeContests,
      pendingWithdrawals,
      totalCoinsInSystem: Number(wallets._sum.coinBalance || 0)
    }
  });
});

// Get all users (paginated)
router.get('/users', async (req: Request, res: Response) => {
  const { page = '1', limit = '20', role, search } = req.query;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { username: { contains: String(search), mode: 'insensitive' } },
      { email: { contains: String(search), mode: 'insensitive' } },
      { phone: { contains: String(search), mode: 'insensitive' } }
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        phone: true,
        displayName: true,
        username: true,
        role: true,
        kycStatus: true,
        createdAt: true,
        wallet: {
          select: {
            coinBalance: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.user.count({ where })
  ]);

  res.json({
    users: users.map(u => ({
      ...u,
      coinBalance: Number(u.wallet?.coinBalance || 0)
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Get user by ID
router.get('/users/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      wallet: true,
      artistProfile: true,
      businessProfile: true,
      streakRecord: true,
      kycRecord: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ user });
});

// Update user role
router.patch('/users/:id/role', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['USER', 'ARTIST', 'BUSINESS', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const user = await prisma.user.update({
    where: { id },
    data: { role: role as UserRole }
  });

  // Log admin action
  await prisma.adminAction.create({
    data: {
      adminId: id, // Would come from auth
      actionType: 'UPDATE_ROLE',
      targetType: 'User',
      targetId: id,
      details: { newRole: role }
    }
  });

  res.json({ user });
});

// Get pending KYC records
router.get('/kyc/pending', async (req: Request, res: Response) => {
  const records = await prisma.kycRecord.findMany({
    where: { status: 'PENDING' },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          email: true,
          phone: true
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  res.json({ records });
});

// Approve/reject KYC
router.patch('/kyc/:userId', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { userId } = req.params;
  const { status, reason } = req.body;

  if (!['VERIFIED', 'REJECTED'].includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const kyc = await prisma.kycRecord.update({
    where: { userId },
    data: {
      status: status as 'VERIFIED' | 'REJECTED',
      reviewedById: authReq.user!.id,
      reviewedAt: new Date()
    }
  });

  await prisma.user.update({
    where: { id: userId },
    data: { kycStatus: status as 'VERIFIED' | 'REJECTED' }
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      title: 'KYC Update',
      message: status === 'VERIFIED'
        ? 'Your KYC has been verified. You can now withdraw funds.'
        : `KYC rejected: ${reason || 'Please resubmit with valid documents'}`,
      type: status === 'VERIFIED' ? 'SUCCESS' : 'WARNING'
    }
  });

  res.json({ kyc });
});

// Get pending withdrawals
router.get('/withdrawals/pending', async (req: Request, res: Response) => {
  const withdrawals = await prisma.withdrawalRequest.findMany({
    where: { status: 'PENDING' },
    include: {
      wallet: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: 'asc' }
  });

  res.json({ withdrawals });
});

// Process withdrawal
router.post('/withdrawals/:id/process', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;

  const withdrawal = await prisma.withdrawalRequest.findUnique({
    where: { id },
    include: {
      wallet: {
        include: { user: true }
      }
    }
  });

  if (!withdrawal || withdrawal.status !== 'PENDING') {
    throw new AppError('Withdrawal not found or already processed', 404);
  }

  // In production, integrate with Paystack/Binance here
  // For now, simulate success

  await prisma.withdrawalRequest.update({
    where: { id },
    data: {
      status: 'COMPLETED',
      processedById: authReq.user!.id,
      processedAt: new Date()
    }
  });

  // Notify user
  await prisma.notification.create({
    data: {
      userId: withdrawal.wallet.user.id,
      title: 'Withdrawal Processed',
      message: `Your withdrawal of ${withdrawal.coinsAmount} coins (₦${withdrawal.fiatAmount}) has been processed.`,
      type: 'SUCCESS'
    }
  });

  res.json({ message: 'Withdrawal processed' });
});

// Reject withdrawal
router.post('/withdrawals/:id/reject', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const { reason } = req.body;

  const withdrawal = await prisma.withdrawalRequest.findUnique({
    where: { id },
    include: { wallet: true }
  });

  if (!withdrawal || withdrawal.status !== 'PENDING') {
    throw new AppError('Withdrawal not found or already processed', 404);
  }

  await prisma.$transaction([
    prisma.withdrawalRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        rejectionReason: reason,
        processedById: authReq.user!.id,
        processedAt: new Date()
      }
    }),
    prisma.wallet.update({
      where: { id: withdrawal.wallet.id },
      data: {
        coinBalance: { increment: withdrawal.coinsAmount }
      }
    })
  ]);

  // Notify user
  await prisma.notification.create({
    data: {
      userId: withdrawal.wallet.userId,
      title: 'Withdrawal Rejected',
      message: `Your withdrawal request has been rejected. ${reason ? `Reason: ${reason}` : ''} Coins have been refunded.`,
      type: 'ERROR'
    }
  });

  res.json({ message: 'Withdrawal rejected' });
});

// Create task
const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  type: z.enum(['WATCH_VIDEO', 'SHARE_SOCIAL', 'COMPLETE_SURVEY', 'APP_DOWNLOAD', 'VOTE']),
  coinReward: z.number().min(1),
  dailyLimit: z.number().min(1).default(1),
  requiresAdGate: z.boolean().default(true)
});

router.post('/tasks', async (req: Request, res: Response) => {
  const data = taskSchema.parse(req.body);

  const task = await prisma.task.create({
    data
  });

  res.json({ task });
});

// Update task
router.patch('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = taskSchema.partial().parse(req.body);

  const task = await prisma.task.update({
    where: { id },
    data
  });

  res.json({ task });
});

// Create contest
const contestSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['ARTIST', 'BUSINESS']),
  startsAt: z.string().transform(s => new Date(s)),
  endsAt: z.string().transform(s => new Date(s)),
  prizeDescription: z.string().optional()
});

router.post('/contests', async (req: Request, res: Response) => {
  const data = contestSchema.parse(req.body);

  const contest = await prisma.contest.create({
    data
  });

  res.json({ contest });
});

// End contest early
router.post('/contests/:id/end', async (req: Request, res: Response) => {
  const { id } = req.params;

  const contest = await prisma.contest.update({
    where: { id },
    data: {
      isActive: false,
      endsAt: new Date()
    }
  });

  res.json({ contest });
});

export default router;