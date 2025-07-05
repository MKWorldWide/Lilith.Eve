/**
 * @fileoverview Authentication Routes - Lilith.Eve Medical AI Oracle
 * 
 * This file defines all authentication-related API endpoints including user
 * login, registration, password management, and session management.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  loginSchema, 
  registerSchema, 
  paginationSchema, 
  uuidParamSchema 
} from '../middleware/validation.middleware';
import { 
  requireRole, 
  requirePermission 
} from '../middleware/auth.middleware';
import { UserRole, Permission } from '../../types/auth.types';
import { auditTrail, performanceMonitor } from '../middleware/logging.middleware';

const router = Router();
const authController = new AuthController();

/**
 * @route   POST /api/auth/login
 * @desc    User login
 * @access  Public
 */
router.post(
  '/login',
  validateRequest(loginSchema),
  performanceMonitor(2000),
  auditTrail('login', 'user'),
  authController.login
);

/**
 * @route   POST /api/auth/register
 * @desc    User registration
 * @access  Public
 */
router.post(
  '/register',
  validateRequest(registerSchema),
  performanceMonitor(3000),
  auditTrail('register', 'user'),
  authController.register
);

/**
 * @route   POST /api/auth/logout
 * @desc    User logout
 * @access  Private
 */
router.post(
  '/logout',
  performanceMonitor(500),
  auditTrail('logout', 'user'),
  authController.logout
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Private
 */
router.post(
  '/refresh',
  performanceMonitor(1000),
  auditTrail('refresh', 'token'),
  authController.refreshToken
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  performanceMonitor(1000),
  auditTrail('request', 'password_reset'),
  authController.forgotPassword
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  performanceMonitor(1000),
  auditTrail('reset', 'password'),
  authController.resetPassword
);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change password (authenticated user)
 * @access  Private
 */
router.post(
  '/change-password',
  performanceMonitor(1000),
  auditTrail('change', 'password'),
  authController.changePassword
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify email address
 * @access  Public
 */
router.post(
  '/verify-email',
  performanceMonitor(1000),
  auditTrail('verify', 'email'),
  authController.verifyEmail
);

/**
 * @route   POST /api/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 */
router.post(
  '/resend-verification',
  performanceMonitor(1000),
  auditTrail('resend', 'email_verification'),
  authController.resendVerification
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  performanceMonitor(500),
  auditTrail('read', 'profile'),
  authController.getProfile
);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put(
  '/profile',
  performanceMonitor(1000),
  auditTrail('update', 'profile'),
  authController.updateProfile
);

/**
 * @route   GET /api/auth/sessions
 * @desc    Get user's active sessions
 * @access  Private
 */
router.get(
  '/sessions',
  performanceMonitor(500),
  auditTrail('read', 'sessions'),
  authController.getSessions
);

/**
 * @route   DELETE /api/auth/sessions/:sessionId
 * @desc    Revoke specific session
 * @access  Private
 */
router.delete(
  '/sessions/:sessionId',
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('revoke', 'session'),
  authController.revokeSession
);

/**
 * @route   POST /api/auth/sessions/revoke-all
 * @desc    Revoke all sessions except current
 * @access  Private
 */
router.post(
  '/sessions/revoke-all',
  performanceMonitor(1000),
  auditTrail('revoke', 'all_sessions'),
  authController.revokeAllSessions
);

/**
 * @route   GET /api/auth/users
 * @desc    Get all users (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/users',
  requirePermission([Permission.USER_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'users'),
  authController.getAllUsers
);

/**
 * @route   GET /api/auth/users/:id
 * @desc    Get user by ID (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/users/:id',
  requirePermission([Permission.USER_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'user'),
  authController.getUserById
);

/**
 * @route   POST /api/auth/users
 * @desc    Create new user (admin only)
 * @access  Private (Admins)
 */
router.post(
  '/users',
  requirePermission([Permission.USER_CREATE]),
  validateRequest(registerSchema),
  performanceMonitor(2000),
  auditTrail('create', 'user'),
  authController.createUser
);

/**
 * @route   PUT /api/auth/users/:id
 * @desc    Update user (admin only)
 * @access  Private (Admins)
 */
router.put(
  '/users/:id',
  requirePermission([Permission.USER_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'user'),
  authController.updateUser
);

/**
 * @route   DELETE /api/auth/users/:id
 * @desc    Delete user (admin only)
 * @access  Private (Admins)
 */
router.delete(
  '/users/:id',
  requirePermission([Permission.USER_DELETE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('delete', 'user'),
  authController.deleteUser
);

/**
 * @route   POST /api/auth/users/:id/activate
 * @desc    Activate user account (admin only)
 * @access  Private (Admins)
 */
router.post(
  '/users/:id/activate',
  requirePermission([Permission.USER_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('activate', 'user'),
  authController.activateUser
);

/**
 * @route   POST /api/auth/users/:id/deactivate
 * @desc    Deactivate user account (admin only)
 * @access  Private (Admins)
 */
router.post(
  '/users/:id/deactivate',
  requirePermission([Permission.USER_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('deactivate', 'user'),
  authController.deactivateUser
);

/**
 * @route   POST /api/auth/users/:id/roles
 * @desc    Update user roles (admin only)
 * @access  Private (Admins)
 */
router.post(
  '/users/:id/roles',
  requirePermission([Permission.USER_ROLE_MANAGE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'user_roles'),
  authController.updateUserRoles
);

/**
 * @route   GET /api/auth/users/:id/permissions
 * @desc    Get user permissions (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/users/:id/permissions',
  requirePermission([Permission.USER_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'user_permissions'),
  authController.getUserPermissions
);

/**
 * @route   POST /api/auth/users/:id/permissions
 * @desc    Update user permissions (admin only)
 * @access  Private (Admins)
 */
router.post(
  '/users/:id/permissions',
  requirePermission([Permission.USER_ROLE_MANAGE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'user_permissions'),
  authController.updateUserPermissions
);

/**
 * @route   GET /api/auth/organizations
 * @desc    Get all organizations (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/organizations',
  requirePermission([Permission.ORGANIZATION_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'organizations'),
  authController.getAllOrganizations
);

/**
 * @route   GET /api/auth/organizations/:id
 * @desc    Get organization by ID (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/organizations/:id',
  requirePermission([Permission.ORGANIZATION_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'organization'),
  authController.getOrganizationById
);

/**
 * @route   POST /api/auth/organizations
 * @desc    Create new organization (admin only)
 * @access  Private (Admins)
 */
router.post(
  '/organizations',
  requirePermission([Permission.ORGANIZATION_CREATE]),
  performanceMonitor(2000),
  auditTrail('create', 'organization'),
  authController.createOrganization
);

/**
 * @route   PUT /api/auth/organizations/:id
 * @desc    Update organization (admin only)
 * @access  Private (Admins)
 */
router.put(
  '/organizations/:id',
  requirePermission([Permission.ORGANIZATION_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'organization'),
  authController.updateOrganization
);

/**
 * @route   DELETE /api/auth/organizations/:id
 * @desc    Delete organization (admin only)
 * @access  Private (Admins)
 */
router.delete(
  '/organizations/:id',
  requirePermission([Permission.ORGANIZATION_DELETE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('delete', 'organization'),
  authController.deleteOrganization
);

/**
 * @route   GET /api/auth/stats/users
 * @desc    Get user statistics (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/stats/users',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(1000),
  auditTrail('read', 'user_stats'),
  authController.getUserStats
);

/**
 * @route   GET /api/auth/stats/sessions
 * @desc    Get session statistics (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/stats/sessions',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(1000),
  auditTrail('read', 'session_stats'),
  authController.getSessionStats
);

/**
 * @route   GET /api/auth/stats/security
 * @desc    Get security statistics (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/stats/security',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(1000),
  auditTrail('read', 'security_stats'),
  authController.getSecurityStats
);

/**
 * @route   GET /api/auth/audit-log
 * @desc    Get authentication audit log (admin only)
 * @access  Private (Admins)
 */
router.get(
  '/audit-log',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'auth_audit'),
  authController.getAuditLog
);

/**
 * @route   POST /api/auth/2fa/enable
 * @desc    Enable two-factor authentication
 * @access  Private
 */
router.post(
  '/2fa/enable',
  performanceMonitor(2000),
  auditTrail('enable', '2fa'),
  authController.enable2FA
);

/**
 * @route   POST /api/auth/2fa/verify
 * @desc    Verify two-factor authentication
 * @access  Private
 */
router.post(
  '/2fa/verify',
  performanceMonitor(1000),
  auditTrail('verify', '2fa'),
  authController.verify2FA
);

/**
 * @route   POST /api/auth/2fa/disable
 * @desc    Disable two-factor authentication
 * @access  Private
 */
router.post(
  '/2fa/disable',
  performanceMonitor(1000),
  auditTrail('disable', '2fa'),
  authController.disable2FA
);

/**
 * @route   GET /api/auth/2fa/backup-codes
 * @desc    Generate backup codes for 2FA
 * @access  Private
 */
router.get(
  '/2fa/backup-codes',
  performanceMonitor(1000),
  auditTrail('generate', 'backup_codes'),
  authController.generateBackupCodes
);

export default router; 