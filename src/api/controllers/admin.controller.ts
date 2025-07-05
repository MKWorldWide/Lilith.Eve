/**
 * @fileoverview Admin Controller - Lilith.Eve Medical AI Oracle
 * 
 * This controller handles all administrative business logic including system
 * configuration, user management, and administrative functions.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response } from 'express';
import { AdminService } from '../../services/admin.service';
import { logger, logUtils } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  /**
   * Get system dashboard statistics
   */
  public getDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const stats = await this.adminService.getDashboardStats();

      logUtils.logInfo('Retrieved dashboard stats', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get all users with pagination and filtering
   */
  public getAllUsers = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, search, role, status, organizationId } = req.query;
      
      const result = await this.adminService.getAllUsers({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        role: role as string,
        status: status as string,
        organizationId: organizationId as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved all users', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
      });

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get user by ID
   */
  public getUserById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.adminService.getUserById(id, req.user!);

      logUtils.logInfo('Retrieved user by ID', {
        userId: req.user!.id,
        targetUserId: id
      });

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        targetUserId: req.params.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve user',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Create new user
   */
  public createUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const user = await this.adminService.createUser(userData, req.user!);

      logUtils.logInfo('Created new user', {
        userId: req.user!.id,
        newUserId: user.id
      });

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        userData: req.body
      });
      
      if ((error as Error).message.includes('already exists')) {
        res.status(409).json({
          success: false,
          message: 'User already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create user',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Update user
   */
  public updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const user = await this.adminService.updateUser(id, updateData, req.user!);

      logUtils.logInfo('Updated user', {
        userId: req.user!.id,
        targetUserId: id
      });

      res.status(200).json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        targetUserId: req.params.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update user',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Delete user (soft delete)
   */
  public deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.adminService.deleteUser(id, req.user!);

      logUtils.logInfo('Deleted user', {
        userId: req.user!.id,
        targetUserId: id
      });

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        targetUserId: req.params.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete user',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Enable/disable user
   */
  public toggleUserStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { enabled, reason } = req.body;
      
      const user = await this.adminService.toggleUserStatus(id, enabled, reason, req.user!);

      logUtils.logInfo('Toggled user status', {
        userId: req.user!.id,
        targetUserId: id,
        enabled
      });

      res.status(200).json({
        success: true,
        data: user,
        message: `User ${enabled ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        targetUserId: req.params.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to toggle user status',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Assign role to user
   */
  public assignRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { role, organizationId } = req.body;
      
      const user = await this.adminService.assignRole(id, role, organizationId, req.user!);

      logUtils.logInfo('Assigned role to user', {
        userId: req.user!.id,
        targetUserId: id,
        role
      });

      res.status(200).json({
        success: true,
        data: user,
        message: 'Role assigned successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        targetUserId: req.params.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else if ((error as Error).message === 'Invalid role') {
        res.status(400).json({
          success: false,
          message: 'Invalid role'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to assign role',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Remove role from user
   */
  public removeRole = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id, role } = req.params;
      
      const user = await this.adminService.removeRole(id, role, req.user!);

      logUtils.logInfo('Removed role from user', {
        userId: req.user!.id,
        targetUserId: id,
        role
      });

      res.status(200).json({
        success: true,
        data: user,
        message: 'Role removed successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        targetUserId: req.params.id 
      });
      
      if ((error as Error).message === 'User not found') {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to remove role',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get system configuration
   */
  public getSystemConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const config = await this.adminService.getSystemConfig(req.user!);

      logUtils.logInfo('Retrieved system config', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: config
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system configuration',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Update system configuration
   */
  public updateSystemConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const configData = req.body;
      const config = await this.adminService.updateSystemConfig(configData, req.user!);

      logUtils.logInfo('Updated system config', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: config,
        message: 'System configuration updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        configData: req.body
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to update system configuration',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get system logs
   */
  public getSystemLogs = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 50, level, startDate, endDate, search } = req.query;
      
      const result = await this.adminService.getSystemLogs({
        page: Number(page),
        limit: Number(limit),
        level: level as string,
        startDate: startDate as string,
        endDate: endDate as string,
        search: search as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved system logs', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
      });

      res.status(200).json({
        success: true,
        data: result.logs,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system logs',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get audit trail
   */
  public getAuditTrail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 50, action, userId, startDate, endDate } = req.query;
      
      const result = await this.adminService.getAuditTrail({
        page: Number(page),
        limit: Number(limit),
        action: action as string,
        userId: userId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved audit trail', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
      });

      res.status(200).json({
        success: true,
        data: result.audits,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve audit trail',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get system metrics
   */
  public getSystemMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval } = req.query;
      
      const metrics = await this.adminService.getSystemMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved system metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval } = req.query;
      
      const metrics = await this.adminService.getPerformanceMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved performance metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve performance metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get security metrics
   */
  public getSecurityMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval } = req.query;
      
      const metrics = await this.adminService.getSecurityMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved security metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve security metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get AI model performance metrics
   */
  public getAIMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, module } = req.query;
      
      const metrics = await this.adminService.getAIMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        module: module as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved AI metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve AI metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get database performance metrics
   */
  public getDatabaseMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval } = req.query;
      
      const metrics = await this.adminService.getDatabaseMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved database metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve database metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get cache performance metrics
   */
  public getCacheMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval } = req.query;
      
      const metrics = await this.adminService.getCacheMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved cache metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve cache metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get queue performance metrics
   */
  public getQueueMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval } = req.query;
      
      const metrics = await this.adminService.getQueueMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved queue metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve queue metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Clear system cache
   */
  public clearCache = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { cacheType } = req.params;
      
      await this.adminService.clearCache(cacheType, req.user!);

      logUtils.logInfo('Cleared cache', {
        userId: req.user!.id,
        cacheType
      });

      res.status(200).json({
        success: true,
        message: 'Cache cleared successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        cacheType: req.params.cacheType
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to clear cache',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Restart system services
   */
  public restartServices = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { serviceType } = req.params;
      
      await this.adminService.restartServices(serviceType, req.user!);

      logUtils.logInfo('Restarted services', {
        userId: req.user!.id,
        serviceType
      });

      res.status(200).json({
        success: true,
        message: 'Services restarted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        serviceType: req.params.serviceType
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to restart services',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Backup system data
   */
  public backupSystem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { backupType } = req.params;
      const backupData = req.body;
      
      const result = await this.adminService.backupSystem(backupType, backupData, req.user!);

      logUtils.logInfo('Created system backup', {
        userId: req.user!.id,
        backupType,
        backupId: result.id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'System backup created successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        backupType: req.params.backupType
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to create system backup',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Restore system data
   */
  public restoreSystem = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { backupId } = req.params;
      const restoreData = req.body;
      
      const result = await this.adminService.restoreSystem(backupId, restoreData, req.user!);

      logUtils.logInfo('Restored system from backup', {
        userId: req.user!.id,
        backupId
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'System restored successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        backupId: req.params.backupId
      });
      
      if ((error as Error).message === 'Backup not found') {
        res.status(404).json({
          success: false,
          message: 'Backup not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to restore system',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get backup history
   */
  public getBackupHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, backupType, startDate, endDate } = req.query;
      
      const result = await this.adminService.getBackupHistory({
        page: Number(page),
        limit: Number(limit),
        backupType: backupType as string,
        startDate: startDate as string,
        endDate: endDate as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved backup history', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
      });

      res.status(200).json({
        success: true,
        data: result.backups,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve backup history',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get system alerts
   */
  public getSystemAlerts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, severity, status, startDate, endDate } = req.query;
      
      const result = await this.adminService.getSystemAlerts({
        page: Number(page),
        limit: Number(limit),
        severity: severity as string,
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved system alerts', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
      });

      res.status(200).json({
        success: true,
        data: result.alerts,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system alerts',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Acknowledge system alert
   */
  public acknowledgeAlert = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { acknowledgment } = req.body;
      
      const alert = await this.adminService.acknowledgeAlert(id, acknowledgment, req.user!);

      logUtils.logInfo('Acknowledged system alert', {
        userId: req.user!.id,
        alertId: id
      });

      res.status(200).json({
        success: true,
        data: alert,
        message: 'Alert acknowledged successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        alertId: req.params.id 
      });
      
      if ((error as Error).message === 'Alert not found') {
        res.status(404).json({
          success: false,
          message: 'Alert not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to acknowledge alert',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get system maintenance schedule
   */
  public getMaintenanceSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const schedule = await this.adminService.getMaintenanceSchedule({
        startDate: startDate as string,
        endDate: endDate as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved maintenance schedule', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: schedule
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve maintenance schedule',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Schedule system maintenance
   */
  public scheduleMaintenance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const maintenanceData = req.body;
      const maintenance = await this.adminService.scheduleMaintenance(maintenanceData, req.user!);

      logUtils.logInfo('Scheduled maintenance', {
        userId: req.user!.id,
        maintenanceId: maintenance.id
      });

      res.status(201).json({
        success: true,
        data: maintenance,
        message: 'Maintenance scheduled successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        maintenanceData: req.body
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to schedule maintenance',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Cancel scheduled maintenance
   */
  public cancelMaintenance = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      
      await this.adminService.cancelMaintenance(id, reason, req.user!);

      logUtils.logInfo('Cancelled maintenance', {
        userId: req.user!.id,
        maintenanceId: id
      });

      res.status(200).json({
        success: true,
        message: 'Maintenance cancelled successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        maintenanceId: req.params.id 
      });
      
      if ((error as Error).message === 'Maintenance not found') {
        res.status(404).json({
          success: false,
          message: 'Maintenance not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to cancel maintenance',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };
} 