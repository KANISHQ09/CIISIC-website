import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors/AppError';
import { logger } from '../../config/logger';
import { env } from '../../config/env';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const reqId = res.getHeader('x-request-id') || undefined;

  if (err instanceof AppError) {
    logger.warn({
      message: err.message,
      statusCode: err.statusCode,
      requestId: reqId,
      stack: env.NODE_ENV === 'development' ? err.stack : undefined,
    });

    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err instanceof ValidationError ? err.errors : undefined,
      requestId: reqId,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Fallback for unhandled native exceptions
  logger.error({
    message: err.message,
    requestId: reqId,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    requestId: reqId,
    timestamp: new Date().toISOString(),
  });
};
