import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { TASK_REWARDS, REFERRAL_LEVELS, calculateReferralCommission } from '@cmpapp/utils';

const router = Router();

// Get all available tasks
router.get('/', async (req: Request, res: Response) => {
  const { type, available } = req.query;

  const where: any = { isActive: true };
  if (type) {
    where.type = type;
  }

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { coinReward: 'desc' }
  });

  res.json({ tasks });
});

// Get daily tasks for user
router.get('/daily', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Get all active tasks
  const tasks = await prisma.task.findMany({
    where: { isActive: true },
    include: {
      completions: {
        where: {
          userId: authReq.user!.id,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      }
    }
  });

  const tasksWithStatus = tasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    type: task.type,
    coinReward: task.coinReward,
    requiresAdGate: task.requiresAdGate,
    dailyLimit: task.dailyLimit,
    completedToday: task.completions.length,
    isLocked: task.completions.length >= task.dailyLimit,
    canComplete: task.completions.length < task.dailyLimit
  }));

  res.json({ tasks: tasksWithStatus });
});

// Get task by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await prisma.task.findUnique({
    where: { id }
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.json({ task });
});

// Complete a task
const completeTaskSchema = z.object({
  proofData: z.record(z.unknown()).optional(),
  adWatched: z.boolean().default(false)
});

router.post('/:id/complete', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const data = completeTaskSchema.parse(req.body);

  const task = await prisma.task.findUnique({
    where: { id }
  });

  if (!task || !task.isActive) {
    throw new AppError('Task not found or inactive', 404);
  }

  // Check daily limit
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayCompletions = await prisma.taskCompletion.count({
    where: {
      userId: authReq.user!.id,
      taskId: id,
      createdAt: { gte: today, lt: tomorrow }
    }
  });

  if (todayCompletions >= task.dailyLimit) {
    throw new AppError('Daily limit reached for this task', 400);
  }

  // If task requires ad gate, verify ad was watched
  if (task.requiresAdGate && !data.adWatched) {
    throw new AppError('Ad must be watched to complete this task', 400);
  }

  // Get user wallet
  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  // Credit coins
  const newBalance = wallet.coinBalance + BigInt(task.coinReward);

  await prisma.$transaction([
    prisma.taskCompletion.create({
      data: {
        userId: authReq.user!.id,
        taskId: id,
        coinsEarned: task.coinReward,
        proofData: data.proofData,
        adWatched: data.adWatched
      }
    }),
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { increment: BigInt(task.coinReward) },
        lifetimeEarned: { increment: BigInt(task.coinReward) }
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'TASK_EARN',
        amount: BigInt(task.coinReward),
        balanceAfter: newBalance,
        description: `Completed task: ${task.title}`,
        metadata: {
          taskId: task.id,
          taskType: task.type
        }
      }
    })
  ]);

  // Process referral earnings
  const user = await prisma.user.findUnique({
    where: { id: authReq.user!.id },
    include: {
      referredBy: true
    }
  });

  if (user?.referredById) {
    const referrer = await prisma.user.findUnique({
      where: { id: user.referredById },
      include: { wallet: true }
    });

    if (referrer?.wallet) {
      const commission = calculateReferralCommission(task.coinReward, 1);
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: referrer.wallet.id },
          data: {
            coinBalance: { increment: BigInt(commission) },
            lifetimeEarned: { increment: BigInt(commission) }
          }
        }),
        prisma.coinTransaction.create({
          data: {
            walletId: referrer.wallet.id,
            type: 'REFERRAL_EARN',
            amount: BigInt(commission),
            balanceAfter: referrer.wallet.coinBalance + BigInt(commission),
            description: `L1 Referral bonus from ${user.username}`,
            metadata: {
              refereeId: user.id,
              level: 1,
              originalAmount: task.coinReward
            }
          }
        })
      ]);
    }
  }

  // Update streak
  await updateStreak(authReq.user!.id);

  res.json({
    message: 'Task completed successfully',
    coinsEarned: task.coinReward
  });
});

// Read article task
router.post('/article/:articleId/read', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { articleId } = req.params;

  const article = await prisma.article.findUnique({
    where: { id: articleId }
  });

  if (!article || !article.isPublished) {
    throw new AppError('Article not found', 404);
  }

  // Check if already read today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingRead = await prisma.taskCompletion.findFirst({
    where: {
      userId: authReq.user!.id,
      proofData: {
        path: ['articleId'],
        equals: articleId
      }
    }
  });

  if (existingRead) {
    throw new AppError('Article already read today', 400);
  }

  // Mark as in progress - actual completion happens when user reaches 100%
  res.json({
    message: 'Article reading started',
    coinReward: article.coinReward
  });
});

// Complete article read (100% scroll)
router.post('/article/:articleId/claim', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { articleId } = req.params;

  const article = await prisma.article.findUnique({
    where: { id: articleId }
  });

  if (!article || !article.isPublished) {
    throw new AppError('Article not found', 404);
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  const newBalance = wallet.coinBalance + BigInt(article.coinReward);

  await prisma.$transaction([
    prisma.taskCompletion.create({
      data: {
        userId: authReq.user!.id,
        taskId: '', // Will be linked via metadata
        coinsEarned: article.coinReward,
        proofData: {
          articleId,
          type: 'READ_ARTICLE'
        }
      }
    }),
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { increment: BigInt(article.coinReward) },
        lifetimeEarned: { increment: BigInt(article.coinReward) }
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'READ_ARTICLE',
        amount: BigInt(article.coinReward),
        balanceAfter: newBalance,
        description: `Read article: ${article.title}`,
        metadata: {
          articleId
        }
      }
    })
  ]);

  res.json({
    message: 'Coins claimed',
    coinsEarned: article.coinReward
  });
});

// Helper function to update streak
async function updateStreak(userId: string) {
  const streak = await prisma.streakRecord.findUnique({
    where: { userId }
  });

  if (!streak) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = streak.lastActiveDate ? new Date(streak.lastActiveDate) : null;

  let newStreak = streak.currentStreak;
  let bonusCoins = 0;

  if (!lastActive) {
    // First activity
    newStreak = 1;
  } else {
    const lastActiveDay = new Date(lastActive);
    lastActiveDay.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Same day, no change
      return;
    } else if (daysDiff === 1) {
      // Consecutive day
      newStreak = streak.currentStreak + 1;
    } else {
      // Streak broken
      newStreak = 1;
    }
  }

  // Check for milestone bonus
  const milestoneBonuses: Record<number, number> = {
    7: 2000,
    14: 5000,
    21: 7500,
    30: 10000,
    60: 20000,
    90: 35000,
    180: 75000,
    365: 150000
  };

  if (milestoneBonuses[newStreak]) {
    bonusCoins = milestoneBonuses[newStreak];
  }

  const updates: any = {
    currentStreak: newStreak,
    lastActiveDate: today,
    longestStreak: Math.max(streak.longestStreak, newStreak)
  };

  await prisma.streakRecord.update({
    where: { userId },
    data: updates
  });

  // Add bonus if milestone reached
  if (bonusCoins > 0) {
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (wallet) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: wallet.id },
          data: {
            coinBalance: { increment: BigInt(bonusCoins) },
            lifetimeEarned: { increment: BigInt(bonusCoins) }
          }
        }),
        prisma.coinTransaction.create({
          data: {
            walletId: wallet.id,
            type: 'STREAK_BONUS',
            amount: BigInt(bonusCoins),
            balanceAfter: wallet.coinBalance + BigInt(bonusCoins),
            description: `Day ${newStreak} streak milestone bonus`
          }
        })
      ]);
    }
  }
}

export default router;