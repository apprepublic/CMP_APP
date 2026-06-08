import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import pino from 'pino';

const logger = pino();

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({
        path: e.path.join('.'),
        message: e.message
      }))
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    logger.error({ code: err.code }, 'Prisma error');

    if (err.code === 'P2002') {
      return res.status(409).json({
        error: 'A record with this value already exists',
        field: (err.meta as any)?.target
      });
    }

    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Record not found'
      });
    }
  }

  // Unknown errors
  logger.error(err, 'Unhandled error');
  res.status(500).json({
    error: 'Internal server error'
  });
}