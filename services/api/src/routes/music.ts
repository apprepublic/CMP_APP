import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Get all songs (public)
router.get('/songs', async (req: Request, res: Response) => {
  const { page = '1', limit = '20', genre, search } = req.query;

  const where: any = { isPublished: true };
  if (genre) where.genre = genre;
  if (search) {
    where.OR = [
      { title: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } }
    ];
  }

  const [songs, total] = await Promise.all([
    prisma.song.findMany({
      where,
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            avatarUrl: true,
            isVerified: true
          }
        }
      },
      orderBy: { playCount: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.song.count({ where })
  ]);

  res.json({
    songs: songs.map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      audioUrl: s.audioUrl,
      coverUrl: s.coverUrl,
      durationSeconds: s.durationSeconds,
      genre: s.genre,
      playCount: s.playCount,
      downloadCount: s.downloadCount,
      isFeatured: s.isFeatured,
      artist: s.artist
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Get featured songs
router.get('/songs/featured', async (req: Request, res: Response) => {
  const songs = await prisma.song.findMany({
    where: {
      isPublished: true,
      isFeatured: true
    },
    include: {
      artist: {
        select: {
          id: true,
          stageName: true,
          avatarUrl: true,
          isVerified: true
        }
      }
    },
    orderBy: { featuredAt: 'desc' },
    take: 10
  });

  res.json({ songs });
});

// Get single song
router.get('/songs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const song = await prisma.song.findUnique({
    where: { id },
    include: {
      artist: true
    }
  });

  if (!song) {
    throw new AppError('Song not found', 404);
  }

  res.json({ song });
});

// Stream song (record play)
router.post('/songs/:id/stream', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const { duration } = req.body;

  const song = await prisma.song.findUnique({
    where: { id }
  });

  if (!song || !song.isPublished) {
    throw new AppError('Song not found', 404);
  }

  // Only count streams > 30 seconds
  if (duration && duration > 30) {
    await prisma.$transaction([
      prisma.song.update({
        where: { id },
        data: { playCount: { increment: 1 } }
      }),
      prisma.songStream.create({
        data: {
          songId: id,
          userId: authReq.user!.id,
          streamDuration: duration
        }
      })
    ]);

    // Credit artist (1 coin per stream > 30s)
    const artist = await prisma.artistProfile.findUnique({
      where: { id: song.artistId },
      include: { user: { include: { wallet: true } } }
    });

    if (artist?.user.wallet) {
      await prisma.$transaction([
        prisma.wallet.update({
          where: { id: artist.user.wallet.id },
          data: {
            coinBalance: { increment: 1n },
            lifetimeEarned: { increment: 1n }
          }
        }),
        prisma.coinTransaction.create({
          data: {
            walletId: artist.user.wallet.id,
            type: 'MUSIC_STREAM',
            amount: 1n,
            balanceAfter: artist.user.wallet.coinBalance + 1n,
            description: `Stream: ${song.title}`
          }
        })
      ]);
    }
  }

  res.json({ message: 'Stream recorded' });
});

// Download song
router.post('/songs/:id/download', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;

  const song = await prisma.song.findUnique({
    where: { id }
  });

  if (!song || !song.isPublished) {
    throw new AppError('Song not found', 404);
  }

  // Increment download count and credit artist
  await prisma.song.update({
    where: { id },
    data: { downloadCount: { increment: 1 } }
  });

  // Credit artist (3 coins per download)
  const artist = await prisma.artistProfile.findUnique({
    where: { id: song.artistId },
    include: { user: { include: { wallet: true } } }
  });

  if (artist?.user.wallet) {
    await prisma.$transaction([
      prisma.wallet.update({
        where: { id: artist.user.wallet.id },
        data: {
          coinBalance: { increment: 3n },
          lifetimeEarned: { increment: 3n }
        }
      }),
      prisma.coinTransaction.create({
        data: {
          walletId: artist.user.wallet.id,
          type: 'MUSIC_DOWNLOAD',
          amount: 3n,
          balanceAfter: artist.user.wallet.coinBalance + 3n,
          description: `Download: ${song.title}`
        }
      })
    ]);
  }

  res.json({
    message: 'Download recorded',
    downloadUrl: song.audioUrl // In production, use signed URL
  });
});

// Get artist profile (public)
router.get('/artists/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const artist = await prisma.artistProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true,
          createdAt: true
        }
      },
      songs: {
        where: { isPublished: true },
        orderBy: { playCount: 'desc' },
        take: 10
      }
    }
  });

  if (!artist) {
    throw new AppError('Artist not found', 404);
  }

  res.json({ artist });
});

// Get current user's artist profile
router.get('/me/profile', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const profile = await prisma.artistProfile.findUnique({
    where: { userId: authReq.user!.id },
    include: {
      songs: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!profile) {
    throw new AppError('Artist profile not found', 404);
  }

  res.json({ profile });
});

// Upload song (artist only)
const uploadSongSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  audioUrl: z.string().url(),
  coverUrl: z.string().url().optional(),
  durationSeconds: z.number().min(1),
  genre: z.string().optional(),
  isPublished: z.boolean().default(false)
});

router.post('/songs', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = uploadSongSchema.parse(req.body);

  // Check if user is artist
  const artist = await prisma.artistProfile.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!artist) {
    throw new AppError('Must have artist profile to upload songs', 403);
  }

  const song = await prisma.song.create({
    data: {
      artistId: artist.id,
      title: data.title,
      description: data.description,
      audioUrl: data.audioUrl,
      coverUrl: data.coverUrl,
      durationSeconds: data.durationSeconds,
      genre: data.genre,
      isPublished: data.isPublished
    }
  });

  res.json({
    message: 'Song uploaded successfully',
    song
  });
});

// Update song
router.patch('/songs/:id', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const data = uploadSongSchema.partial().parse(req.body);

  const song = await prisma.song.findUnique({
    where: { id },
    include: { artist: true }
  });

  if (!song || song.artist.userId !== authReq.user!.id) {
    throw new AppError('Song not found or unauthorized', 404);
  }

  const updated = await prisma.song.update({
    where: { id },
    data
  });

  res.json({ song: updated });
});

// Delete song
router.delete('/songs/:id', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;

  const song = await prisma.song.findUnique({
    where: { id },
    include: { artist: true }
  });

  if (!song || song.artist.userId !== authReq.user!.id) {
    throw new AppError('Song not found or unauthorized', 404);
  }

  await prisma.song.delete({ where: { id } });

  res.json({ message: 'Song deleted' });
});

// Promote song (spend coins)
router.post('/songs/:id/promote', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const { days = 7 } = req.body;

  const song = await prisma.song.findUnique({
    where: { id },
    include: { artist: true }
  });

  if (!song || song.artist.userId !== authReq.user!.id) {
    throw new AppError('Song not found or unauthorized', 404);
  }

  const cost = 5000 * days; // 5000 coins per day

  const wallet = await prisma.wallet.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!wallet || wallet.coinBalance < BigInt(cost)) {
    throw new AppError('Insufficient balance', 400);
  }

  const featuredUntil = new Date();
  featuredUntil.setDate(featuredUntil.getDate() + days);

  await prisma.$transaction([
    prisma.wallet.update({
      where: { id: wallet.id },
      data: {
        coinBalance: { decrement: BigInt(cost) },
        lifetimeSpent: { increment: BigInt(cost) }
      }
    }),
    prisma.song.update({
      where: { id },
      data: {
        isFeatured: true,
        featuredAt: new Date()
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'SONG_PROMOTION',
        amount: BigInt(-cost),
        balanceAfter: wallet.coinBalance - BigInt(cost),
        description: `Promoted song: ${song.title} for ${days} days`,
        metadata: { songId: id, days }
      }
    })
  ]);

  res.json({
    message: 'Song promoted',
    featuredUntil
  });
});

export default router;