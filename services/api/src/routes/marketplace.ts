import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  const { page = '1', limit = '20', category, search, location } = req.query;

  const where: any = { isActive: true };
  if (category) where.category = category;
  if (location) where.location = location;
  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { description: { contains: String(search), mode: 'insensitive' } }
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        business: {
          select: {
            id: true,
            businessName: true,
            avatarUrl: true,
            isVerified: true,
            location: true,
            rating: true
          }
        }
      },
      orderBy: { isFeatured: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.product.count({ where })
  ]);

  res.json({
    products: products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      priceNaira: p.priceNaira,
      coinPrice: p.coinPrice,
      imageUrls: p.imageUrls,
      category: p.category,
      isFeatured: p.isFeatured,
      business: p.business
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Get featured products
router.get('/products/featured', async (req: Request, res: Response) => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true
    },
    include: {
      business: {
        select: {
          id: true,
          businessName: true,
          avatarUrl: true,
          isVerified: true
        }
      }
    },
    take: 10
  });

  res.json({ products });
});

// Get single product
router.get('/products/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      business: true
    }
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  res.json({ product });
});

// Get categories
router.get('/categories', async (req: Request, res: Response) => {
  const categories = await prisma.productCategory.findMany({
    where: { parentId: null },
    include: {
      children: true
    }
  });

  res.json({ categories });
});

// Get business profile
router.get('/businesses/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const business = await prisma.businessProfile.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          username: true
        }
      },
      products: {
        where: { isActive: true },
        take: 20
      }
    }
  });

  if (!business) {
    throw new AppError('Business not found', 404);
  }

  res.json({ business });
});

// Get current user's business profile
router.get('/me/business', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const business = await prisma.businessProfile.findUnique({
    where: { userId: authReq.user!.id },
    include: {
      products: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!business) {
    throw new AppError('Business profile not found', 404);
  }

  res.json({ business });
});

// Create business profile
const businessSchema = z.object({
  businessName: z.string().min(2).max(100),
  description: z.string().max(1000).optional(),
  category: z.string(),
  location: z.string().optional(),
  whatsappNumber: z.string().optional()
});

router.post('/businesses', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = businessSchema.parse(req.body);

  // Check if user is already a business
  const existing = await prisma.businessProfile.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (existing) {
    throw new AppError('Business profile already exists', 400);
  }

  const business = await prisma.businessProfile.create({
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
    business
  });
});

// Add product
const productSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
  priceNaira: z.number().min(0),
  coinPrice: z.number().min(0),
  imageUrls: z.array(z.string().url()).max(5),
  category: z.string()
});

router.post('/products', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const data = productSchema.parse(req.body);

  const business = await prisma.businessProfile.findUnique({
    where: { userId: authReq.user!.id }
  });

  if (!business) {
    throw new AppError('Must have business profile to list products', 403);
  }

  const product = await prisma.product.create({
    data: {
      businessId: business.id,
      name: data.name,
      description: data.description,
      priceNaira: data.priceNaira,
      coinPrice: data.coinPrice,
      imageUrls: data.imageUrls,
      category: data.category
    }
  });

  res.json({
    message: 'Product listed',
    product
  });
});

// Update product
router.patch('/products/:id', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const data = productSchema.partial().parse(req.body);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true }
  });

  if (!product || product.business.userId !== authReq.user!.id) {
    throw new AppError('Product not found or unauthorized', 404);
  }

  const updated = await prisma.product.update({
    where: { id },
    data
  });

  res.json({ product: updated });
});

// Delete product
router.delete('/products/:id', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true }
  });

  if (!product || product.business.userId !== authReq.user!.id) {
    throw new AppError('Product not found or unauthorized', 404);
  }

  await prisma.product.update({
    where: { id },
    data: { isActive: false }
  });

  res.json({ message: 'Product removed' });
});

// Boost product listing
router.post('/products/:id/boost', authenticate, async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;
  const { days = 7 } = req.body;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true }
  });

  if (!product || product.business.userId !== authReq.user!.id) {
    throw new AppError('Product not found or unauthorized', 404);
  }

  const cost = 3000 * days; // 3000 coins per day

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
    prisma.product.update({
      where: { id },
      data: {
        isFeatured: true,
        featuredUntil
      }
    }),
    prisma.coinTransaction.create({
      data: {
        walletId: wallet.id,
        type: 'PRODUCT_LISTING_BOOST',
        amount: BigInt(-cost),
        balanceAfter: wallet.coinBalance - BigInt(cost),
        description: `Boosted product: ${product.name} for ${days} days`,
        metadata: { productId: id, days }
      }
    })
  ]);

  res.json({
    message: 'Product boosted',
    featuredUntil
  });
});

export default router;