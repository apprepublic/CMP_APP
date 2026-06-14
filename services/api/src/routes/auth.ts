import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { prisma } from '../lib/prisma.js';
import { generateTokens } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateReferralCode, generateOTP, isValidNigerianPhone, normalizePhoneNumber, isValidEmail } from '@cmpapp/utils';
import { sendVerificationEmail, sendWelcomeEmail } from '../lib/resend.js';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(50),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  referralCode: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string()
});

const verifyOTPSchema = z.object({
  phone: z.string(),
  otp: z.string().length(6)
});

// Register
router.post('/register', async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  // Check if username or email/phone exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { username: data.username },
        ...(data.email ? [{ email: data.email }] : []),
        ...(data.phone ? [{ phone: data.phone }] : [])
      ]
    }
  });

  if (existingUser) {
    throw new AppError('Username, email, or phone already in use', 409);
  }

  // Handle referral
  let referredById: string | null = null;
  if (data.referralCode) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode: data.referralCode }
    });
    if (referrer) {
      referredById = referrer.id;
    }
  }

  // Hash password
  const passwordHash = await bcrypt.hash(data.password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone || '',
      passwordHash,
      displayName: data.displayName,
      username: data.username,
      referralCode: generateReferralCode(),
      referredById
    }
  });

  // Create wallet with signup bonus
  await prisma.wallet.create({
    data: {
      userId: user.id,
      coinBalance: 500 // Signup bonus
    }
  });

  // Create streak record
  await prisma.streakRecord.create({
    data: {
      userId: user.id
    }
  });

  // Create signup bonus transaction
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  await prisma.coinTransaction.create({
    data: {
      walletId: wallet!.id,
      type: 'REFERRAL_SIGNUP',
      amount: 500n,
      balanceAfter: wallet!.coinBalance,
      description: 'Signup bonus'
    }
  });

  // Generate tokens
  const tokens = generateTokens(user.id, user.role);

  // Generate 6-digit OTP for email verification
  const emailOtp = generateOTP();
  const emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store OTP in database
  await prisma.userVerification.create({
    data: {
      userId: user.id,
      emailOtp,
      emailOtpExpires,
    },
  });

  // Send verification email
  if (user.email) {
    await sendVerificationEmail(user.email, emailOtp, user.displayName || user.username);
  }

  res.status(201).json({
    message: 'Registration successful. Please check your email to verify your account.',
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      displayName: user.displayName,
      username: user.username,
      role: user.role,
      isEmailVerified: false,
    },
    ...tokens,
  });
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { phone: data.phone }
      ].filter(Boolean) as any
    }
  });

  if (!user || !user.passwordHash) {
    throw new AppError('Invalid credentials', 401);
  }

  const validPassword = await bcrypt.compare(data.password, user.passwordHash);
  if (!validPassword) {
    throw new AppError('Invalid credentials', 401);
  }

  const tokens = generateTokens(user.id, user.role);

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      displayName: user.displayName,
      username: user.username,
      role: user.role,
      kycStatus: user.kycStatus,
      emailVerified: user.emailVerified,
      phoneVerified: user.phoneVerified,
    },
    ...tokens
  });
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new AppError('Refresh token required', 400);
  }

  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const tokens = generateTokens(user.id, user.role);

    res.json(tokens);
  } catch (error) {
    throw new AppError('Invalid refresh token', 401);
  }
});

// Send OTP
router.post('/otp/send', async (req: Request, res: Response) => {
  const { phone } = req.body;

  if (!phone || !isValidNigerianPhone(phone)) {
    throw new AppError('Valid Nigerian phone number required', 400);
  }

  const normalizedPhone = normalizePhoneNumber(phone);
  const otp = generateOTP();

  // TODO: Store OTP in Redis with TTL and send via Termii
  // For now, just return success (development mode)
  // await sendOTP(normalizedPhone, otp);

  res.json({
    message: 'OTP sent successfully',
    // Remove this in production
    otp
  });
});

// Verify OTP
router.post('/otp/verify', async (req: Request, res: Response) => {
  const data = verifyOTPSchema.parse(req.body);

  // TODO: Verify OTP from Redis
  // For now, accept any 6-digit code (development mode)

  const user = await prisma.user.findUnique({
    where: { phone: data.phone }
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { phoneVerified: true }
  });

  res.json({ message: 'Phone verified successfully' });
});

// Verify Email with OTP
router.post('/verify-email', async (req: Request, res: Response) => {
  const { otp, email } = z.object({
    otp: z.string().length(6),
    email: z.string().email(),
  }).parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      verification: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.verification || !user.verification.emailOtp) {
    throw new AppError('No verification OTP found. Please request a new one.', 400);
  }

  // Check if OTP is expired
  if (new Date() > user.verification.emailOtpExpires) {
    throw new AppError('Verification code has expired. Please request a new one.', 400);
  }

  // Verify OTP
  if (user.verification.emailOtp !== otp) {
    throw new AppError('Invalid verification code', 401);
  }

  // Mark email as verified
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true },
  });

  // Clean up verification record
  await prisma.userVerification.delete({
    where: { userId: user.id },
  });

  // Send welcome email
  await sendWelcomeEmail(user.email, user.displayName || user.username);

  res.json({ 
    message: 'Email verified successfully',
    isEmailVerified: true,
  });
});

// Resend verification email
router.post('/resend-verification', async (req: Request, res: Response) => {
  const { email } = z.object({
    email: z.string().email(),
  }).parse(req.body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.emailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Generate new OTP
  const emailOtp = generateOTP();
  const emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);

  // Upsert verification record
  await prisma.userVerification.upsert({
    where: { userId: user.id },
    update: {
      emailOtp,
      emailOtpExpires,
    },
    create: {
      userId: user.id,
      emailOtp,
      emailOtpExpires,
    },
  });

  // Send verification email
  await sendVerificationEmail(user.email, emailOtp, user.displayName || user.username);

  res.json({ 
    message: 'Verification email sent successfully',
  });
});

// Google OAuth
router.post('/google', async (req: Request, res: Response) => {
  const { googleId, email, displayName, photoUrl } = req.body;

  let user = await prisma.user.findUnique({
    where: { googleId }
  });

  if (!user) {
    // Create new user
    user = await prisma.user.create({
      data: {
        googleId,
        email,
        phone: `google_${googleId}`,
        displayName,
        username: `${email.split('@')[0]}${Math.floor(Math.random() * 1000)}`,
        referralCode: generateReferralCode(),
        emailVerified: true
      }
    });

    // Create wallet
    await prisma.wallet.create({
      data: {
        userId: user.id,
        coinBalance: 500n
      }
    });

    await prisma.streakRecord.create({
      data: {
        userId: user.id
      }
    });
  }

  const tokens = generateTokens(user.id, user.role);

  res.json({
    message: 'Google auth successful',
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      username: user.username,
      role: user.role
    },
    ...tokens
  });
});

export default router;