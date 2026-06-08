import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get active contests
router.get('/', async (req: Request, res: Response) => {
  const now = new Date();

  const contests = await prisma.contest.findMany({
    where: {
      isActive: true,
      startsAt: { lte: now },
      endsAt: { gte: now }
    },
    orderBy: { endsAt: 'asc' }
  });

  res.json({ contests });
});

// Get contest with entries
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const contest = await prisma.contest.findUnique({
    where: { id },
    include: {
      entries: {
        orderBy: { voteCount: 'desc' },
        include: {
          artistProfile: {
            select: {
              id: true,
              stageName: true,
              avatarUrl: true,
              genre: true
            }
          },
          businessProfile: {
            select: {
              id: true,
              businessName: true,
              avatarUrl: true
            }
          }
        }
      }
    }
  });

  if (!contest) {
    throw new AppError('Contest not found', 404);
  }

  res.json({ contest });
});

// Vote for entry
router.post('/:contestId/vote/:entryId', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { contestId, entryId } = req.params;

  // Check contest is active
  const contest = await prisma.contest.findUnique({
    where: { id: contestId }
  });

  if (!contest || !contest.isActive) {
    throw new AppError('Contest not found or inactive', 404);
  }

  const now = new Date();
  if (now < contest.startsAt || now > contest.endsAt) {
    throw new AppError('Voting not open for this contest', 400);
  }

  // Check if user already voted in this contest
  const existingVote = await prisma.voteCast.findUnique({
    where: {
      userId_contestId: {
        userId: authReq.user!.id,
        contestId
      }
    }
  });

  if (existingVote) {
    throw new AppError('Already voted in this contest', 400);
  }

  // Verify entry exists
  const entry = await prisma.contestEntry.findUnique({
    where: { id: entryId }
  });

  if (!entry || entry.contestId !== contestId) {
    throw new AppError('Entry not found', 404);
  }

  // Create vote and credit voter
  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet) {
    throw new AppError('Wallet not found', 404);
  }

  const voteReward = 20;

  await prisma.$transaction([
    prisma.voteCast.create({
      data: {
        userId: authReq.user!.id,
        entryId,
        contestId,
        coinsEarned: voteReward
      }
    }),
    prisma.contestEntry.update({
      where: { id: entryId },
      data: { voteCount: { increment: 1 } }
    }),
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { increment: BigInt(voteReward) },
        lifetimeEarned: { increment: BigInt(voteReward) }
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'VOTE',
        amount: BigInt(voteReward),
        balanceAfter: wallet.coinBalance + BigInt(voteReward),
        description: `Vote in contest: ${contest.title}`,
        metadata: { contestId, entryId }
      }
    })
  ]);

  res.json({
    message: 'Vote recorded',
    coinsEarned: voteReward
  });
});

// Get user's votes in a contest
router.get('/user/votes', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { contestId } = req.query;

  const where: any = { userId: authReq.user!.id };
  if (contestId) where.contestId = String(contestId);

  const votes = await prisma.voteCast.findMany({
    where,
    include: {
      entry: {
        select: {
          id: true,
          artistProfile: {
            select: { stageName: true }
          },
          businessProfile: {
            select: { businessName: true }
          }
        }
      },
      contest: {
        select: { title: true }
      }
    }
  });

  res.json({ votes });
});

// Create contest entry (artist/business only)
router.post('/:id/entries', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const { description, imageUrl } = req.body;

  const contest = await prisma.contest.findUnique({
    where: { id }
  });

  if (!contest || !contest.isActive) {
    throw new AppError('Contest not found or inactive', 404);
  }

  // Get user's profile based on contest type
  let profile;
  if (contest.type === 'ARTIST') {
    profile = await prisma.artistProfile.findUnique({
      where: { userId: authReq.user!.id }
    });
  } else {
    profile = await prisma.businessProfile.findUnique({
      where: { userId: authReq.user!.id }
    });
  }

  if (!profile) {
    throw new AppError(`Must have ${contest.type.toLowerCase()} profile to enter contest`, 403);
  }

  // Check if already entered
  const existingEntry = await prisma.contestEntry.findFirst({
    where: {
      contestId: id,
      OR: [
        { artistProfileId: profile.id },
        { businessProfileId: profile.id }
      ]
    }
  });

  if (existingEntry) {
    throw new AppError('Already entered in this contest', 400);
  }

  const entry = await prisma.contestEntry.create({
    data: {
      contestId: id,
      userId: authReq.user!.id,
      artistProfileId: contest.type === 'ARTIST' ? profile.id : null,
      businessProfileId: contest.type === 'BUSINESS' ? profile.id : null,
      description,
      imageUrl
    }
  });

  res.json({
    message: 'Entry submitted',
    entry
  });
});

export default router;