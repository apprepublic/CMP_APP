import { Request, Response, NextFunction } from 'express';

// Simple in-memory rate limiter
// For production, use Redis-based rate limiting

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 60000);

interface RateLimitOptions {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  keyPrefix?: string;
  message?: string;
  statusCode?: number;
}

export function rateLimit(options: RateLimitOptions) {
  const {
    windowMs,
    max,
    keyPrefix = 'rl',
    message = 'Too many requests, please try again later',
    statusCode = 429
  } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const key = `${keyPrefix}:${ip}`;

    const now = Date.now();
    const windowStart = now - windowMs;

    // Initialize or reset if window expired
    if (!store[key] || store[key].resetTime < now) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs
      };

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', max - 1);
      res.setHeader('X-RateLimit-Reset', Math.ceil((now + windowMs) / 1000));

      return next();
    }

    // Increment count
    store[key].count++;

    // Set headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - store[key].count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(store[key].resetTime / 1000));

    // Check if exceeded
    if (store[key].count > max) {
      return res.status(statusCode).json({
        error: message,
        retryAfter: Math.ceil((store[key].resetTime - now) / 1000)
      });
    }

    next();
  };
}

// Pre-configured rate limiters
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  keyPrefix: 'auth',
  message: 'Too many login attempts, please try again later'
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  keyPrefix: 'api'
});

export const sensitiveRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 requests per hour
  keyPrefix: 'sensitive',
  message: 'Too many requests to this endpoint'
});