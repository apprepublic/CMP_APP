import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { AuthRequest } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// Get notifications
router.get('/', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { page = '1', limit = '20' } = req.query as { page?: string; limit?: string };

  const [notifications, total, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: authReq.user!.id },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    }),
    prisma.notification.count({ where: { userId: authReq.user!.id } }),
    prisma.notification.count({
      where: {
        userId: authReq.user!.id,
        isRead: false
      }
    })
  ]);

  res.json({
    notifications,
    unreadCount,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit))
    }
  });
});

// Mark notification as read
router.patch('/:id/read', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;
  const { id } = req.params;

  const notification = await prisma.notification.findFirst({
    where: {
      id,
      userId: authReq.user!.id
    }
  });

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  await prisma.notification.update({
    where: { id },
    data: { isRead: true }
  });

  res.json({ message: 'Marked as read' });
});

// Mark all as read
router.patch('/read-all', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  await prisma.notification.updateMany({
    where: {
      userId: authReq.user!.id,
      isRead: false
    },
    data: { isRead: true }
  });

  res.json({ message: 'All marked as read' });
});

// Get unread count
router.get('/unread-count', async (req: Request, res: Response) => {
  const authReq = req as unknown as AuthRequest;

  const count = await prisma.notification.count({
    where: {
      userId: authReq.user!.id,
      isRead: false
    }
  });

  res.json({ unreadCount: count });
});

export default router;