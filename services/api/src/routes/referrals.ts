import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get user's referral info
router.get('/', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const user = await prisma.user.findUnique({
    where: { id: authReq.user!.id },
    select: {
      referralCode: true,
      referredById: true,
      referredBy: {
        select: {
          username: true,
          displayName: true
        }
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({
    referral: {
      code: user.referralCode,
      referrer: user.referredBy
    }
  });
});

// Get L1 referrals
router.get('/l1', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { page = '1', limit = '20' } = req.query;

  const referrals = await prisma.referral.findMany({
    where: {
      referrerId: authReq.user!.id,
      level: 1,
      isActive: true
    },
    include: {
      referee: {
        select: {
          id: true,
          username: true,
          displayName: true,
          createdAt: true,
          wallet: {
            select: {
              lifetimeEarned: true
            }
          }
        }
      }
    },
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit)
  });

  const total = await prisma.referral.count({
    where: {
      referrerId: authReq.user!.id,
      level: 1,
      isActive: true
    }
  });

  res.json({
    referrals: referrals.map(r => ({
      id: r.id,
      user: {
        ...r.referee,
        lifetimeEarned: Number(r.referee.wallet?.lifetimeEarned || 0)
      },
      createdAt: r.createdAt
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Get all referrals (L1, L2, L3)
router.get('/all', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const referrals = await prisma.referral.findMany({
    where: {
      referrerId: authReq.user!.id,
      isActive: true
    },
    include: {
      referee: {
        select: {
          id: true,
          username: true,
          displayName: true,
          createdAt: true
        }
      }
    },
    orderBy: { level: 'asc' }
  });

  const byLevel = {
    l1: referrals.filter(r => r.level === 1),
    l2: referrals.filter(r => r.level === 2),
    l3: referrals.filter(r => r.level === 3)
  };

  const stats = {
    totalReferrals: referrals.length,
    l1Count: byLevel.l1.length,
    l2Count: byLevel.l2.length,
    l3Count: byLevel.l3.length,
    // Calculate potential earnings (simplified)
    totalEarnings: referrals.reduce((acc, r) => {
      const rate = r.level === 1 ? 0.20 : r.level === 2 ? 0.10 : 0.05;
      const refereeEarnings = Number(r.referee.wallet?.lifetimeEarned || 0);
      return acc + (refereeEarnings * rate);
    }, 0)
  };

  res.json({
    referrals: {
      l1: byLevel.l1.map(r => r.referee),
      l2: byLevel.l2.map(r => r.referee),
      l3: byLevel.l3.map(r => r.referee)
    },
    stats
  });
});

// Get referral leaderboard
router.get('/leaderboard', async (req: Request, res: Response) => {
  const { limit = '10' } = req.query;

  // Get users with most successful referrals
  const leaderboard = await prisma.referral.groupBy({
    by: ['referrerId'],
    where: { isActive: true },
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: Number(limit)
  });

  // Get user details for each
  const enriched = await Promise.all(
    leaderboard.map(async (entry) => {
      const user = await prisma.user.findUnique({
        where: { id: entry.referrerId },
        select: {
          id: true,
          username: true,
          displayName: true,
          referralCode: true
        }
      });

      return {
        ...user,
        referralCount: entry._count.id
      };
    })
  );

  res.json({ leaderboard: enriched });
});

export default router;