import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '../utils/types.js';

interface AppError extends Error {
  status?: number;
  message: string;
}

/**
 * Error handling middleware
 */
export function errorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = error.status || 500;
  const message = error.message || 'Internal Server Error';

  const response: ApiResponse<null> = {
    success: false,
    status,
    message,
    error: message,
    timestamp: new Date().toISOString(),
  };

  console.error(`[${status}] ${message}`, error);
  res.status(status).json(response);
}

/**
 * 404 Not Found middleware
 */
export function notFound(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  (error as AppError).status = 404;
  next(error);
}

/**
 * Validation error middleware
 */
export function validationErrorHandler(
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (error.message.includes('validation')) {
    const response: ApiResponse<null> = {
      success: false,
      status: 400,
      message: 'Validation failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    };

    res.status(400).json(response);
  } else {
    next(error);
  }
}
