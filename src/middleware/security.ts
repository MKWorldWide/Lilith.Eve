import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger';

// Security middleware configuration
interface SecurityConfig {
  trustProxy: boolean | string | string[] | number;
  csp: {
    directives: Record<string, any>;
  };
  rateLimit: {
    windowMs: number;
    max: number;
    message: string;
  };
  hsts: {
    maxAge: number;
    includeSubDomains: boolean;
    preload: boolean;
  };
}

/**
 * Default security configuration
 */
const defaultSecurityConfig: SecurityConfig = {
  trustProxy: process.env['TRUST_PROXY'] || 'loopback',
  csp: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://api.example.com'],
      frameAncestors: ["'self'"],
      formAction: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: null as any,
    },
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
};

/**
 * Setup security middleware
 * @param config Optional custom security configuration
 * @returns Array of Express middleware functions
 */
export const setupSecurity = (config: Partial<SecurityConfig> = {}) => {
  const securityConfig: SecurityConfig = { ...defaultSecurityConfig, ...config };
  const middlewares = [];

  // Trust proxy (if behind a proxy like Nginx)
  middlewares.push((req: Request, res: Response, next: NextFunction) => {
    req.setTimeout(30000); // 30 second timeout
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });

  // Helmet middleware with CSP
  middlewares.push(helmet({
    contentSecurityPolicy: securityConfig.csp,
    hsts: securityConfig.hsts,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: { policy: 'same-site' },
    dnsPrefetchControl: { allow: false },
    frameguard: { action: 'deny' },
    hidePoweredBy: true,
    hsts: securityConfig.hsts,
    ieNoOpen: true,
    noSniff: true,
    referrerPolicy: { policy: 'same-origin' },
    xssFilter: true,
  }));

  // Rate limiting
  middlewares.push(rateLimit({
    windowMs: securityConfig.rateLimit.windowMs,
    max: securityConfig.rateLimit.max,
    message: securityConfig.rateLimit.message,
    standardHeaders: true,
    legacyHeaders: false,
  }));

  // Request validation
  middlewares.push((req: Request, res: Response, next: NextFunction) => {
    // Reject requests with null bytes (potential attack)
    if (JSON.stringify(req.body).includes('\u0000')) {
      logger.warn('Request contained null bytes', { 
        ip: req.ip, 
        method: req.method, 
        url: req.originalUrl 
      });
      return res.status(400).json({ error: 'Bad Request' });
    }
    next();
  });

  // Log security events
  middlewares.push((req: Request, res: Response, next: NextFunction) => {
    // Log potential security events
    if (req.headers['user-agent']?.includes('nmap') || 
        req.headers['user-agent']?.includes('nikto') ||
        req.headers['user-agent']?.includes('sqlmap')) {
      logger.warn('Potential security scan detected', { 
        ip: req.ip, 
        userAgent: req.headers['user-agent'] 
      });
    }
    next();
  });

  return middlewares;
};

/**
 * Authentication middleware
 * Verifies JWT token in Authorization header
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    // Verify JWT token (implementation depends on your auth system)
    // const decoded = verifyToken(token);
    // req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid authentication token', { error });
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};

/**
 * Role-based access control middleware
 * @param roles Array of allowed roles
 */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore - Assuming req.user is set by the authenticate middleware
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden - Insufficient permissions' });
    }
    next();
  };
};

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Export security utilities
export * from './rate-limit';
export * from './cors';
export * from './input-validation';
