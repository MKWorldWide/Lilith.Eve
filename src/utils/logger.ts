/**
 * @fileoverview Logger Utility - Lilith.Eve Medical AI Oracle
 * 
 * This utility provides structured logging with different levels, formats,
 * and outputs for comprehensive system monitoring and debugging.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { format } from 'winston';

/**
 * Log levels configuration
 */
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
  trace: 5
};

/**
 * Log colors for console output
 */
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
  trace: 'gray'
};

// Add colors to winston
winston.addColors(logColors);

/**
 * Custom format for structured logging
 */
const structuredFormat = format.combine(
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  format.errors({ stack: true }),
  format.json(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level.toUpperCase()}]: ${message} ${metaString}`;
  })
);

/**
 * Console format for development
 */
const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss.SSS'
  }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`;
  })
);

/**
 * Create daily rotate file transport for logs
 */
const createFileTransport = (level: string, filename: string) => {
  return new DailyRotateFile({
    filename: `logs/${filename}-%DATE%.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level,
    format: structuredFormat
  });
};

/**
 * Create logger instance
 */
const createLogger = () => {
  const transports: winston.transport[] = [];

  // Console transport for development
  if (process.env.NODE_ENV === 'development') {
    transports.push(
      new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'debug',
        format: consoleFormat
      })
    );
  }

  // File transports for production
  if (process.env.NODE_ENV === 'production') {
    // Error logs
    transports.push(createFileTransport('error', 'error'));
    
    // Combined logs
    transports.push(createFileTransport('info', 'combined'));
    
    // HTTP logs
    transports.push(createFileTransport('http', 'http'));
    
    // Debug logs (if enabled)
    if (process.env.LOG_LEVEL === 'debug') {
      transports.push(createFileTransport('debug', 'debug'));
    }
  }

  // Always include file transports for important logs
  transports.push(createFileTransport('error', 'error'));
  transports.push(createFileTransport('info', 'combined'));

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels: logLevels,
    format: structuredFormat,
    transports,
    exitOnError: false
  });
};

/**
 * Logger instance
 */
export const logger = createLogger();

/**
 * HTTP request logger middleware
 */
export const httpLogger = winston.createLogger({
  level: 'http',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/http-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ]
});

/**
 * Security event logger
 */
export const securityLogger = winston.createLogger({
  level: 'warn',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/security-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

/**
 * Audit trail logger
 */
export const auditLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/audit-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '90d'
    })
  ]
});

/**
 * Performance metrics logger
 */
export const performanceLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/performance-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

/**
 * AI processing logger
 */
export const aiLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/ai-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

/**
 * Database logger
 */
export const dbLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/database-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '30d'
    })
  ]
});

/**
 * Log utility functions
 */
export const logUtils = {
  /**
   * Log API request
   */
  logApiRequest: (req: any, res: any, duration: number) => {
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id || 'anonymous',
      userRole: req.user?.role || 'anonymous',
      requestId: req.requestId
    };

    if (res.statusCode >= 400) {
      logger.warn('API Request', logData);
    } else {
      logger.info('API Request', logData);
    }
  },

  /**
   * Log security event
   */
  logSecurityEvent: (event: string, details: any) => {
    securityLogger.warn('Security Event', {
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log audit event
   */
  logAuditEvent: (operation: string, resource: string, details: any) => {
    auditLogger.info('Audit Event', {
      operation,
      resource,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log performance metric
   */
  logPerformanceMetric: (metric: string, value: number, unit: string, context?: any) => {
    performanceLogger.info('Performance Metric', {
      metric,
      value,
      unit,
      context,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log AI processing event
   */
  logAIEvent: (module: string, event: string, details: any) => {
    aiLogger.info('AI Event', {
      module,
      event,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log database operation
   */
  logDatabaseOperation: (operation: string, table: string, details: any) => {
    dbLogger.info('Database Operation', {
      operation,
      table,
      ...details,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log error with context
   */
  logError: (error: Error, context?: any) => {
    logger.error('Error occurred', {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log warning with context
   */
  logWarning: (message: string, context?: any) => {
    logger.warn(message, {
      context,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log info with context
   */
  logInfo: (message: string, context?: any) => {
    logger.info(message, {
      context,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Log debug with context
   */
  logDebug: (message: string, context?: any) => {
    logger.debug(message, {
      context,
      timestamp: new Date().toISOString()
    });
  }
};

/**
 * Graceful shutdown handler for logger
 */
export const gracefulShutdown = () => {
  logger.info('Logger shutting down gracefully');
  
  // Close all transports
  logger.end();
  httpLogger.end();
  securityLogger.end();
  auditLogger.end();
  performanceLogger.end();
  aiLogger.end();
  dbLogger.end();
};

// Handle process termination
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

export default logger; 