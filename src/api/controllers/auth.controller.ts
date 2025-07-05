/**
 * @fileoverview Authentication Controller - Lilith.Eve Medical AI Oracle
 * 
 * This controller handles all authentication-related business logic including
 * user login, registration, password management, and session management.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response } from 'express';
import { AuthService } from '../../services/auth.service';
import { logger, logUtils } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * User login
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, rememberMe } = req.body;
      
      const result = await this.authService.login({
        email,
        password,
        rememberMe: rememberMe || false
      });

      logUtils.logInfo('User logged in', {
        email,
        userId: result.user.id
      });

      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn
        },
        message: 'Login successful'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        email: req.body.email 
      });
      
      if ((error as Error).message === 'Invalid credentials') {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      } else if ((error as Error).message === 'Account locked') {
        res.status(423).json({
          success: false,
          message: 'Account is locked. Please contact support.'
        });
      } else if ((error as Error).message === 'Account disabled') {
        res.status(423).json({
          success: false,
          message: 'Account is disabled. Please contact support.'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Login failed',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * User registration
   */
  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const result = await this.authService.register(userData);

      logUtils.logInfo('User registered', {
        email: userData.email,
        userId: result.user.id
      });

      res.status(201).json({
        success: true,
        data: {
          user: result.user,
          token: result.token,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn
        },
        message: 'Registration successful'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        email: req.body.email 
      });
      
      if ((error as Error).message.includes('already exists')) {
        res.status(409).json({
          success: false,
          message: 'User already exists'
        });
      } else if ((error as Error).message.includes('validation')) {
        res.status(400).json({
          success: false,
          message: 'Invalid registration data',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Registration failed',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Refresh access token
   */
  public refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      
      const result = await this.authService.refreshToken(refreshToken);

      logUtils.logInfo('Token refreshed', {
        userId: result.user.id
      });

      res.status(200).json({
        success: true,
        data: {
          token: result.token,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn
        },
        message: 'Token refreshed successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error);
      
      if ((error as Error).message === 'Invalid refresh token') {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
      } else if ((error as Error).message === 'Token expired') {
        res.status(401).json({
          success: false,
          message: 'Refresh token expired'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Token refresh failed',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * User logout
   */
  public logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      
      await this.authService.logout(req.user!.id, refreshToken);

      logUtils.logInfo('User logged out', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get current user profile
   */
  public getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const profile = await this.authService.getProfile(req.user!.id);

      logUtils.logInfo('Retrieved user profile', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve profile',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Update user profile
   */
  public updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const updateData = req.body;
      const profile = await this.authService.updateProfile(req.user!.id, updateData);

      logUtils.logInfo('Updated user profile', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: profile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else if ((error as Error).message.includes('validation')) {
        res.status(400).json({
          success: false,
          message: 'Invalid profile data',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update profile',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Change password
   */
  public changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      await this.authService.changePassword(req.user!.id, {
        currentPassword,
        newPassword
      });

      logUtils.logInfo('Password changed', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      if ((error as Error).message === 'Invalid current password') {
        res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      } else if ((error as Error).message.includes('validation')) {
        res.status(400).json({
          success: false,
          message: 'Invalid password data',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to change password',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Request password reset
   */
  public requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      
      await this.authService.requestPasswordReset(email);

      logUtils.logInfo('Password reset requested', {
        email
      });

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        email: req.body.email 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to request password reset',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Reset password with token
   */
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      
      await this.authService.resetPassword(token, newPassword);

      logUtils.logInfo('Password reset completed', {
        token: token.substring(0, 10) + '...'
      });

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error);
      
      if ((error as Error).message === 'Invalid token') {
        res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      } else if ((error as Error).message === 'Token expired') {
        res.status(400).json({
          success: false,
          message: 'Reset token has expired'
        });
      } else if ((error as Error).message.includes('validation')) {
        res.status(400).json({
          success: false,
          message: 'Invalid password data',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to reset password',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Verify email address
   */
  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;
      
      await this.authService.verifyEmail(token);

      logUtils.logInfo('Email verified', {
        token: token.substring(0, 10) + '...'
      });

      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error);
      
      if ((error as Error).message === 'Invalid token') {
        res.status(400).json({
          success: false,
          message: 'Invalid verification token'
        });
      } else if ((error as Error).message === 'Token expired') {
        res.status(400).json({
          success: false,
          message: 'Verification token has expired'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to verify email',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Resend email verification
   */
  public resendEmailVerification = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.authService.resendEmailVerification(req.user!.id);

      logUtils.logInfo('Email verification resent', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        message: 'Verification email sent'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      if ((error as Error).message === 'Email already verified') {
        res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to resend verification email',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get user sessions
   */
  public getSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const sessions = await this.authService.getSessions(req.user!.id);

      logUtils.logInfo('Retrieved user sessions', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: sessions
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve sessions',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Revoke session
   */
  public revokeSession = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { sessionId } = req.params;
      
      await this.authService.revokeSession(req.user!.id, sessionId);

      logUtils.logInfo('Session revoked', {
        userId: req.user!.id,
        sessionId
      });

      res.status(200).json({
        success: true,
        message: 'Session revoked successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        sessionId: req.params.sessionId
      });
      
      if ((error as Error).message === 'Session not found') {
        res.status(404).json({
          success: false,
          message: 'Session not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to revoke session',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Revoke all sessions except current
   */
  public revokeAllSessions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      await this.authService.revokeAllSessions(req.user!.id);

      logUtils.logInfo('All sessions revoked', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        message: 'All sessions revoked successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to revoke sessions',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Enable two-factor authentication
   */
  public enable2FA = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await this.authService.enable2FA(req.user!.id);

      logUtils.logInfo('2FA enabled', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Two-factor authentication enabled'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      if ((error as Error).message === '2FA already enabled') {
        res.status(400).json({
          success: false,
          message: 'Two-factor authentication is already enabled'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to enable two-factor authentication',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Verify and complete 2FA setup
   */
  public verify2FA = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { code } = req.body;
      
      await this.authService.verify2FA(req.user!.id, code);

      logUtils.logInfo('2FA verified', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        message: 'Two-factor authentication verified successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      if ((error as Error).message === 'Invalid code') {
        res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to verify two-factor authentication',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Disable two-factor authentication
   */
  public disable2FA = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { password } = req.body;
      
      await this.authService.disable2FA(req.user!.id, password);

      logUtils.logInfo('2FA disabled', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        message: 'Two-factor authentication disabled successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      if ((error as Error).message === 'Invalid password') {
        res.status(400).json({
          success: false,
          message: 'Invalid password'
        });
      } else if ((error as Error).message === '2FA not enabled') {
        res.status(400).json({
          success: false,
          message: 'Two-factor authentication is not enabled'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to disable two-factor authentication',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get user permissions
   */
  public getPermissions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const permissions = await this.authService.getPermissions(req.user!.id);

      logUtils.logInfo('Retrieved user permissions', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: permissions
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve permissions',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Check if user has specific permission
   */
  public checkPermission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { permission } = req.params;
      
      const hasPermission = await this.authService.checkPermission(req.user!.id, permission);

      logUtils.logInfo('Checked user permission', {
        userId: req.user!.id,
        permission
      });

      res.status(200).json({
        success: true,
        data: {
          hasPermission
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        permission: req.params.permission
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to check permission',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get user roles
   */
  public getRoles = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const roles = await this.authService.getRoles(req.user!.id);

      logUtils.logInfo('Retrieved user roles', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: roles
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve roles',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Check if user has specific role
   */
  public checkRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { role } = req.params;
      
      const hasRole = await this.authService.checkRole(req.user!.id, role);

      logUtils.logInfo('Checked user role', {
        userId: req.user!.id,
        role
      });

      res.status(200).json({
        success: true,
        data: {
          hasRole
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        role: req.params.role
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to check role',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get login history
   */
  public getLoginHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.authService.getLoginHistory(req.user!.id, {
        page: Number(page),
        limit: Number(limit)
      });

      logUtils.logInfo('Retrieved login history', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: result.logins,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve login history',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get security events
   */
  public getSecurityEvents = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.authService.getSecurityEvents(req.user!.id, {
        page: Number(page),
        limit: Number(limit)
      });

      logUtils.logInfo('Retrieved security events', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: result.events,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve security events',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Validate session token
   */
  public validateToken = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const isValid = await this.authService.validateToken(req.user!.id);

      logUtils.logInfo('Validated token', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: {
          isValid
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id 
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to validate token',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };
} 