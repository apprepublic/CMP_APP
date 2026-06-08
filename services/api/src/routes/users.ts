import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole, KycStatus } from '@prisma/client';

const router = Router();

// Get current user profile
router.get('/me', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const user = await prisma.user.findUnique({
    where: { id: authReq.user!.id },
    select: {
      id: true,
      email: true,
      phone: true,
      displayName: true,
      username: true,
      role: true,
      kycStatus: true,
      referralCode: true,
      createdAt: true,
      emailVerified: true,
      phoneVerified: true,
      wallet: {
        select: {
          coinBalance: true,
          lifetimeEarned: true,
          lifetimeSpent: true
        }
      },
      streakRecord: {
        select: {
          currentStreak: true,
          longestStreak: true,
          freezesOwned: true,
          lastActiveDate: true
        }
      },
      artistProfile: true,
      businessProfile: true
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ user });
});

// Update profile
const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(50).optional(),
  bio: z.string().max(500).optional()
});

router.patch('/me', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = updateProfileSchema.parse(req.body);

  const user = await prisma.user.update({
    where: { id: authReq.user!.id },
    data: {
      displayName: data.displayName
    },
    select: {
      id: true,
      displayName: true,
      username: true,
      email: true,
      phone: true
    }
  });

  res.json({ user });
});

// Get user by username (public profile)
router.get('/username/:username', async (req: Request, res: Response) => {
  const { username } = req.params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      displayName: true,
      username: true,
      role: true,
      artistProfile: true,
      businessProfile: true,
      streakRecord: {
        select: {
          longestStreak: true
        }
      }
    }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json({ user });
});

// KYC Submission
const kycSchema = z.object({
  bvn: z.string().length(11).optional(),
  idNumber: z.string().min(6).optional(),
  idType: z.string().optional(),
  selfieUrl: z.string().url().optional(),
  idImageUrl: z.string().url().optional()
});

router.post('/kyc', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = kycSchema.parse(req.body);

  // Check if user already has KYC
  const existingKyc = await prisma.kycRecord.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (existingKyc && existingKyc.status === 'PENDING') {
    throw new AppError('KYC already pending', 400);
  }

  const kyc = await prisma.kycRecord.upsert({
    where: { userId: authReq.user!.id },
    create: {
      userId: authReq.user!.id,
      bvn: data.bvn,
      idNumber: data.idNumber,
      idType: data.idType,
      selfieUrl: data.selfieUrl,
      idImageUrl: data.idImageUrl,
      status: 'PENDING'
    },
    update: {
      bvn: data.bvn,
      idNumber: data.idNumber,
      idType: data.idType,
      selfieUrl: data.selfieUrl,
      idImageUrl: data.idImageUrl,
      status: 'PENDING'
    }
  });

  await prisma.user.update({
    where: { id: authReq.user!.id },
    data: { kycStatus: 'PENDING' }
  });

  res.json({
    message: 'KYC submitted successfully',
    kyc: {
      status: kyc.status
    }
  });
});

// Get KYC status
router.get('/kyc/status', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const kyc = await prisma.kycRecord.findUnique({
    where: { userId: authReq.user!.id }
  });

  res.json({
    kyc: kyc ? {
      status: kyc.status,
      reviewedAt: kyc.reviewedAt
    } : null
  });
});

// Upgrade to Artist role
const artistSchema = z.object({
  stageName: z.string().min(2).max(50),
  bio: z.string().max(500).optional(),
  genre: z.string().max(50).optional()
});

router.post('/upgrade/artist', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = artistSchema.parse(req.body);

  // Check if already an artist
  const existingProfile = await prisma.artistProfile.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (existingProfile) {
    throw new AppError('Already an artist', 400);
  }

  const profile = await prisma.artistProfile.create({
    data: {
      userId: authReq.user!.id,
      stageName: data.stageName,
      bio: data.bio,
      genre: data.genre
    }
  });

  await prisma.user.update({
    where: { id: authReq.user!.id },
    data: { role: 'ARTIST' }
  });

  res.json({
    message: 'Artist profile created',
    profile
  });
});

// Upgrade to Business role
const businessSchema = z.object({
  businessName: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  category: z.string(),
  location: z.string().optional(),
  whatsappNumber: z.string().optional()
});

router.post('/upgrade/business', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = businessSchema.parse(req.body);

  const existingProfile = await prisma.businessProfile.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (existingProfile) {
    throw new AppError('Already a business', 400);
  }

  const profile = await prisma.businessProfile.create({
    data: {
      userId: authReq.user!.id,
      businessName: data.businessName,
      description: data.description,
      category: data.category,
      location: data.location,
      whatsappNumber: data.whatsappNumber
    }
  });

  await prisma.user.update({
    where: { id: authReq.user!.id },
    data: { role: 'BUSINESS' }
  });

  res.json({
    message: 'Business profile created',
    profile
  });
});

export default router;