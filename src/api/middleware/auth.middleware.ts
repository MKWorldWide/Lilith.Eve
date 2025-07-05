/**
 * @fileoverview Authentication Middleware - Lilith.Eve Medical AI Oracle
 * 
 * This middleware handles JWT token validation, user authentication, and
 * role-based access control for the Lilith.Eve API endpoints.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { logger } from '../../utils/logger';
import { UserRole, AuthenticatedRequest } from '../../types/auth.types';

/**
 * JWT token verification function
 */
const verifyToken = promisify(jwt.verify);

/**
 * Authentication middleware that validates JWT tokens
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Authentication failed: No token provided', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
      
      res.status(401).json({
        error: 'Authentication required',
        message: 'Access token is required for this endpoint',
        code: 'AUTH_TOKEN_MISSING'
      });
      return;
    }

    // Verify the token
    const decoded = await verifyToken(token, process.env.JWT_SECRET!) as any;
    
    // Add user information to request
    (req as AuthenticatedRequest).user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role as UserRole,
      permissions: decoded.permissions || [],
      organizationId: decoded.organizationId,
      sessionId: decoded.sessionId
    };

    // Log successful authentication
    logger.info('User authenticated successfully', {
      userId: decoded.userId,
      role: decoded.role,
      ip: req.ip,
      path: req.path
    });

    next();
  } catch (error) {
    logger.error('Authentication failed: Invalid token', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });

    res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid or expired access token',
      code: 'AUTH_TOKEN_INVALID'
    });
  }
};

/**
 * Role-based access control middleware
 * @param allowedRoles - Array of roles that are allowed to access the endpoint
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated to access this endpoint',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    if (!allowedRoles.includes(authenticatedReq.user.role)) {
      logger.warn('Access denied: Insufficient role', {
        userId: authenticatedReq.user.id,
        userRole: authenticatedReq.user.role,
        requiredRoles: allowedRoles,
        path: req.path
      });

      res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions to access this endpoint',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredRoles: allowedRoles
      });
      return;
    }

    next();
  };
};

/**
 * Permission-based access control middleware
 * @param requiredPermissions - Array of permissions required to access the endpoint
 */
export const requirePermission = (requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated to access this endpoint',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    const hasAllPermissions = requiredPermissions.every(permission =>
      authenticatedReq.user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      logger.warn('Access denied: Insufficient permissions', {
        userId: authenticatedReq.user.id,
        userPermissions: authenticatedReq.user.permissions,
        requiredPermissions,
        path: req.path
      });

      res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions to access this endpoint',
        code: 'INSUFFICIENT_PERMISSIONS',
        requiredPermissions
      });
      return;
    }

    next();
  };
};

/**
 * Organization-based access control middleware
 * Ensures users can only access data from their own organization
 */
export const requireOrganizationAccess = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authenticatedReq = req as AuthenticatedRequest;
  
  if (!authenticatedReq.user) {
    res.status(401).json({
      error: 'Authentication required',
      message: 'User must be authenticated to access this endpoint',
      code: 'AUTH_REQUIRED'
    });
    return;
  }

  // Super admins can access all organizations
  if (authenticatedReq.user.role === UserRole.SUPER_ADMIN) {
    next();
    return;
  }

  const requestedOrgId = req.params.organizationId || req.body.organizationId;
  
  if (requestedOrgId && requestedOrgId !== authenticatedReq.user.organizationId) {
    logger.warn('Access denied: Organization mismatch', {
      userId: authenticatedReq.user.id,
      userOrgId: authenticatedReq.user.organizationId,
      requestedOrgId,
      path: req.path
    });

    res.status(403).json({
      error: 'Access denied',
      message: 'Cannot access data from different organization',
      code: 'ORGANIZATION_ACCESS_DENIED'
    });
    return;
  }

  next();
};

/**
 * Session validation middleware
 * Ensures the user's session is still valid
 */
export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    
    if (!authenticatedReq.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'User must be authenticated to access this endpoint',
        code: 'AUTH_REQUIRED'
      });
      return;
    }

    // TODO: Implement session validation against Redis/database
    // For now, we'll assume the JWT token validation is sufficient
    
    next();
  } catch (error) {
    logger.error('Session validation failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      userId: (req as AuthenticatedRequest).user?.id
    });

    res.status(401).json({
      error: 'Session validation failed',
      message: 'User session is invalid or expired',
      code: 'SESSION_INVALID'
    });
  }
}; 