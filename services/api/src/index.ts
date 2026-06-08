import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { config } from 'dotenv';
import pino from 'pino';

import { prisma } from './lib/prisma.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import walletRoutes from './routes/wallet.js';
import taskRoutes from './routes/tasks.js';
import musicRoutes from './routes/music.js';
import marketplaceRoutes from './routes/marketplace.js';
import referralRoutes from './routes/referrals.js';
import contestRoutes from './routes/contests.js';
import vtuRoutes from './routes/vtu.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authenticate } from './middleware/auth.js';
import { apiRateLimit, authRateLimit } from './middleware/rateLimit.js';

config();

const app = express();
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: { colorize: true }
  } : undefined
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting
app.use(apiRateLimit);

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`
    });
  });
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/users', authenticate, userRoutes);
app.use('/api/wallet', authenticate, walletRoutes);
app.use('/api/tasks', taskRoutes); // Some routes need auth, some don't
app.use('/api/music', musicRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/referrals', authenticate, referralRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/vtu', authenticate, vtuRoutes);
app.use('/api/admin', authenticate, adminRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

const PORT = process.env.PORT || 3001;

async function main() {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error, 'Failed to start server');
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

export { app, logger };