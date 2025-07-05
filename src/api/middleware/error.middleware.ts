/**
 * @fileoverview Error Handling Middleware - Lilith.Eve Medical AI Oracle
 * 
 * This middleware provides centralized error handling for all API endpoints,
 * ensuring consistent error responses and proper logging.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';

/**
 * Custom error classes for different types of errors
 */
export class ValidationError extends Error {
  public statusCode: number;
  public code: string;
  public details: any[];

  constructor(message: string, details: any[] = []) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.code = 'VALIDATION_ERROR';
    this.details = details;
  }
}

export class AuthenticationError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    this.statusCode = 401;
    this.code = 'AUTHENTICATION_ERROR';
  }
}

export class AuthorizationError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string = 'Access denied') {
    super(message);
    this.name = 'AuthorizationError';
    this.statusCode = 403;
    this.code = 'AUTHORIZATION_ERROR';
  }
}

export class NotFoundError extends Error {
  public statusCode: number;
  public code: string;
  public resource: string;

  constructor(resource: string, message?: string) {
    super(message || `${resource} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.code = 'NOT_FOUND';
    this.resource = resource;
  }
}

export class ConflictError extends Error {
  public statusCode: number;
  public code: string;
  public resource: string;

  constructor(resource: string, message?: string) {
    super(message || `${resource} already exists`);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.code = 'CONFLICT';
    this.resource = resource;
  }
}

export class RateLimitError extends Error {
  public statusCode: number;
  public code: string;
  public retryAfter: string;

  constructor(retryAfter: string = '15 minutes') {
    super('Rate limit exceeded');
    this.name = 'RateLimitError';
    this.statusCode = 429;
    this.code = 'RATE_LIMIT_EXCEEDED';
    this.retryAfter = retryAfter;
  }
}

export class ServiceUnavailableError extends Error {
  public statusCode: number;
  public code: string;
  public service: string;

  constructor(service: string, message?: string) {
    super(message || `${service} service is unavailable`);
    this.name = 'ServiceUnavailableError';
    this.statusCode = 503;
    this.code = 'SERVICE_UNAVAILABLE';
    this.service = service;
  }
}

export class DatabaseError extends Error {
  public statusCode: number;
  public code: string;
  public operation: string;

  constructor(operation: string, message?: string) {
    super(message || `Database operation failed: ${operation}`);
    this.name = 'DatabaseError';
    this.statusCode = 500;
    this.code = 'DATABASE_ERROR';
    this.operation = operation;
  }
}

export class AIProcessingError extends Error {
  public statusCode: number;
  public code: string;
  public module: string;

  constructor(module: string, message?: string) {
    super(message || `AI processing failed in ${module}`);
    this.name = 'AIProcessingError';
    this.statusCode = 500;
    this.code = 'AI_PROCESSING_ERROR';
    this.module = module;
  }
}

/**
 * Main error handling middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error('Error occurred', {
    requestId: (req as any).requestId,
    method: req.method,
    url: req.originalUrl,
    error: {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    },
    userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
    userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle known error types
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      details: error.details,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof AuthenticationError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof AuthorizationError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof NotFoundError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      resource: error.resource,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof ConflictError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      resource: error.resource,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof RateLimitError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      retryAfter: error.retryAfter,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof ServiceUnavailableError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      service: error.service,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof DatabaseError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      operation: error.operation,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error instanceof AIProcessingError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
      module: error.module,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    res.status(401).json({
      error: 'AuthenticationError',
      message: 'Invalid token',
      code: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  if (error.name === 'TokenExpiredError') {
    res.status(401).json({
      error: 'AuthenticationError',
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  // Handle database connection errors
  if (error.name === 'SequelizeConnectionError' || error.name === 'SequelizeConnectionRefusedError') {
    res.status(503).json({
      error: 'ServiceUnavailableError',
      message: 'Database connection failed',
      code: 'DATABASE_CONNECTION_ERROR',
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  // Handle validation errors from Sequelize
  if (error.name === 'SequelizeValidationError') {
    const details = (error as any).errors?.map((err: any) => ({
      field: err.path,
      message: err.message,
      type: err.type
    })) || [];

    res.status(400).json({
      error: 'ValidationError',
      message: 'Data validation failed',
      code: 'VALIDATION_ERROR',
      details,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  // Handle unique constraint violations
  if (error.name === 'SequelizeUniqueConstraintError') {
    const details = (error as any).errors?.map((err: any) => ({
      field: err.path,
      message: err.message,
      type: err.type
    })) || [];

    res.status(409).json({
      error: 'ConflictError',
      message: 'Resource already exists',
      code: 'UNIQUE_CONSTRAINT_VIOLATION',
      details,
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  // Handle foreign key constraint violations
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    res.status(400).json({
      error: 'ValidationError',
      message: 'Referenced resource does not exist',
      code: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
      timestamp: new Date().toISOString(),
      requestId: (req as any).requestId
    });
    return;
  }

  // Default error response for unknown errors
  const statusCode = (error as any).statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';

  res.status(statusCode).json({
    error: 'InternalServerError',
    message: isDevelopment ? error.message : 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    ...(isDevelopment && { stack: error.stack }),
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId
  });
};

/**
 * Async error wrapper
 * Wraps async route handlers to catch unhandled promise rejections
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Not found handler
 * Handles 404 errors for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'NotFoundError',
    message: `Endpoint ${req.method} ${req.originalUrl} not found`,
    code: 'ENDPOINT_NOT_FOUND',
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId
  });
};

/**
 * Health check error handler
 * Special error handler for health check endpoints
 */
export const healthCheckErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Health check error', {
    requestId: (req as any).requestId,
    method: req.method,
    url: req.originalUrl,
    error: {
      name: error.name,
      message: error.message
    },
    timestamp: new Date().toISOString()
  });

  res.status(503).json({
    status: 'error',
    message: 'Service health check failed',
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId
  });
}; 