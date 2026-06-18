import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate, authorize } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';
import { UserRole } from '@prisma/client';

const router = Router();

// Get all published articles (public)
router.get('/', async (req: Request, res: Response) => {
  const { page = '1', limit = '20', category, search } = req.query as { page?: string; limit?: string; category?: string; search?: string };

  const where: any = { isPublished: true };
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } }
    ];
  }

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImageUrl: true,
        category: true,
        tags: true,
        readTimeMinutes: true,
        coinReward: true,
        publishedAt: true,
        author: {
          select: {
            id: true,
            displayName: true
          }
        }
      },
      orderBy: { publishedAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.article.count({ where })
  ]);

  res.json({
    articles,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Get article by slug
router.get('/slug/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
          username: true
        }
      }
    }
  });

  if (!article || !article.isPublished) {
    throw new AppError('Article not found', 404);
  }

  res.json({ article });
});

// Get article by ID
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
          username: true
        }
      }
    }
  });

  if (!article || !article.isPublished) {
    throw new AppError('Article not found', 404);
  }

  res.json({ article });
});

// Get articles by category
router.get('/category/:category', async (req: Request, res: Response) => {
  const { category } = req.params;
  const { page = '1', limit = '20' } = req.query as { page?: string; limit?: string };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: {
        isPublished: true,
        category: category.toLowerCase()
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        coverImageUrl: true,
        category: true,
        readTimeMinutes: true,
        coinReward: true,
        publishedAt: true
      },
      orderBy: { publishedAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.article.count({
      where: {
        isPublished: true,
        category: category.toLowerCase()
      }
    })
  ]);

  res.json({
    articles,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Create article (admin only)
const createArticleSchema = z.object({
  title: z.string().min(5).max(200),
  slug: z.string().min(3).max(200).optional(),
  content: z.string().min(100),
  excerpt: z.string().max(300).optional(),
  coverImageUrl: z.string().url().optional(),
  category: z.string(),
  tags: z.array(z.string()).max(10).default([]),
  readTimeMinutes: z.number().min(1).default(5),
  coinReward: z.number().min(10).max(200).default(50),
  isPublished: z.boolean().default(false)
});

router.post('/', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = createArticleSchema.parse(req.body);

  const article = await prisma.article.create({
    data: {
      ...data,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      authorId: authReq.user!.id,
      publishedAt: data.isPublished ? new Date() : null
    }
  });

  res.json({
    message: 'Article created',
    article
  });
});

// Update article (admin only)
router.patch('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = createArticleSchema.partial().parse(req.body);

  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  const updateData: any = { ...data };
  if (data.isPublished && !article.publishedAt) {
    updateData.publishedAt = new Date();
  }

  const updated = await prisma.article.update({
    where: { id },
    data: updateData
  });

  res.json({ article: updated });
});

// Delete article (admin only)
router.delete('/:id', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  const { id } = req.params;

  const article = await prisma.article.findUnique({ where: { id } });

  if (!article) {
    throw new AppError('Article not found', 404);
  }

  await prisma.article.delete({ where: { id } });

  res.json({ message: 'Article deleted' });
});

// Get all articles (admin - including drafts)
router.get('/admin/all', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), async (req: Request, res: Response) => {
  const { page = '1', limit = '20', isPublished } = req.query as { page?: string; limit?: string; isPublished?: string };

  const where: any = {};
  if (isPublished !== undefined) where.isPublished = isPublished === 'true';

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            username: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.article.count({ where })
  ]);

  res.json({
    articles,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Get article categories
router.get('/meta/categories', async (req: Request, res: Response) => {
  const categories = await prisma.article.groupBy({
    by: ['category'],
    _count: {
      id: true
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    }
  });

  res.json({
    categories: categories.map(c => ({
      name: c.category,
      count: c._count.id
    }))
  });
});

export default router;