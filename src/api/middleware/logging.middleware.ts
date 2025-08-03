/**
 * @fileoverview Logging Middleware - Lilith.Eve Medical AI Oracle
 * 
 * This middleware handles comprehensive request/response logging, performance
 * monitoring, and audit trails for all API endpoints.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';

/**
 * Request logging middleware
 * Logs incoming requests with relevant metadata
 */
export const logRequest = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const requestId = generateRequestId();
  
  // Add request ID to request object for tracking
  (req as any).requestId = requestId;
  
  // Log incoming request
  logger.info('Incoming request', {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
    userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
    organizationId: (req as AuthenticatedRequest).user?.organizationId || 'none',
    headers: sanitizeHeaders(req.headers),
    query: sanitizeData(req.query),
    body: sanitizeData(req.body),
    timestamp: new Date().toISOString()
  });

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function(data: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log response
    logger.info('Outgoing response', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
      userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
      responseSize: JSON.stringify(data).length,
      timestamp: new Date().toISOString()
    });

    // Call original json method
    return originalJson.call(this, data);
  };

  // Override res.send to log responses
  const originalSend = res.send;
  res.send = function(data: any) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log response
    logger.info('Outgoing response', {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
      userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
      responseSize: typeof data === 'string' ? data.length : JSON.stringify(data).length,
      timestamp: new Date().toISOString()
    });

    // Call original send method
    return originalSend.call(this, data);
  };

  next();
};

/**
 * Performance monitoring middleware
 * Tracks request duration and logs slow requests
 */
export const performanceMonitor = (thresholdMs: number = 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const startTime = process.hrtime.bigint();
    
    res.on('finish', () => {
      const endTime = process.hrtime.bigint();
      const durationMs = Number(endTime - startTime) / 1000000; // Convert nanoseconds to milliseconds
      
      if (durationMs > thresholdMs) {
        logger.warn('Slow request detected', {
          requestId: (req as any).requestId,
          method: req.method,
          url: req.originalUrl,
          duration: `${durationMs.toFixed(2)}ms`,
          threshold: `${thresholdMs}ms`,
          userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
          userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
          timestamp: new Date().toISOString()
        });
      }
      
      // Log performance metrics
      logger.debug('Request performance metrics', {
        requestId: (req as any).requestId,
        method: req.method,
        url: req.originalUrl,
        duration: `${durationMs.toFixed(2)}ms`,
        statusCode: res.statusCode,
        userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      });
    });
    
    next();
  };
};

/**
 * Error logging middleware
 * Logs errors with detailed context
 */
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Request error', {
    requestId: (req as any).requestId,
    method: req.method,
    url: req.originalUrl,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
    userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    headers: sanitizeHeaders(req.headers),
    query: sanitizeData(req.query),
    body: sanitizeData(req.body),
    timestamp: new Date().toISOString()
  });
  
  next(error);
};

/**
 * Audit trail middleware
 * Logs sensitive operations for compliance and security
 */
export const auditTrail = (operation: string, resourceType: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalSend = res.send;
    const originalJson = res.json;
    
    res.send = function(data: any) {
      logAuditEvent(operation, resourceType, req, res, data);
      return originalSend.call(this, data);
    };
    
    res.json = function(data: any) {
      logAuditEvent(operation, resourceType, req, res, data);
      return originalJson.call(this, data);
    };
    
    next();
  };
};

/**
 * Security event logging middleware
 * Logs potential security events
 */
export const securityLogger = (req: Request, res: Response, next: NextFunction): void => {
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /union\s+select/i,
    /drop\s+table/i,
    /delete\s+from/i
  ];
  
  const requestString = JSON.stringify({
    url: req.originalUrl,
    query: req.query,
    body: req.body,
    headers: req.headers
  });
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(requestString)) {
      logger.warn('Potential security threat detected', {
        requestId: (req as any).requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        pattern: pattern.source,
        userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
        timestamp: new Date().toISOString()
      });
      break;
    }
  }
  
  next();
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  // Use cryptographically strong UUID to avoid predictable IDs
  return `req_${randomUUID()}`;
}

/**
 * Sanitize headers to remove sensitive information
 */
function sanitizeHeaders(headers: any): any {
  const sanitized = { ...headers };
  const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
  
  sensitiveHeaders.forEach(header => {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  });
  
  return sanitized;
}

/**
 * Sanitize data to remove sensitive information
 */
function sanitizeData(data: any): any {
  if (!data) return data;

  let sanitized: any;
  try {
    // Deep clone while stripping functions and non-serializable data
    sanitized = JSON.parse(JSON.stringify(data));
  } catch (err) {
    // Fallback prevents logging from crashing on circular structures
    logger.warn('Failed to sanitize data', { error: (err as Error).message });
    return {};
  }

  const sensitiveFields = ['password', 'token', 'secret', 'key', 'ssn', 'credit_card'];

  function sanitizeObject(obj: any): any {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]';
        }
      }
    }
  }

  sanitizeObject(sanitized);
  return sanitized;
}

/**
 * Log audit event
 */
function logAuditEvent(
  operation: string,
  resourceType: string,
  req: Request,
  res: Response,
  data: any
): void {
  logger.info('Audit event', {
    requestId: (req as any).requestId,
    operation,
    resourceType,
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
    userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
    organizationId: (req as AuthenticatedRequest).user?.organizationId || 'none',
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    resourceId: req.params.id || req.body.id,
    changes: sanitizeData(data),
    timestamp: new Date().toISOString()
  });
}

/**
 * API usage analytics middleware
 * Tracks API usage patterns for analytics
 */
export const usageAnalytics = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log usage analytics
    logger.info('API usage analytics', {
      requestId: (req as any).requestId,
      endpoint: req.originalUrl,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      userId: (req as AuthenticatedRequest).user?.id || 'anonymous',
      userRole: (req as AuthenticatedRequest).user?.role || 'anonymous',
      organizationId: (req as AuthenticatedRequest).user?.organizationId || 'none',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  });
  
  next();
}; 