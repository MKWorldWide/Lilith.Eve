/**
 * @fileoverview Admin Routes - Lilith.Eve Medical AI Oracle
 * 
 * This file defines all administrative API endpoints including system
 * configuration, user management, and administrative functions.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  paginationSchema, 
  uuidParamSchema,
  dateRangeSchema 
} from '../middleware/validation.middleware';
import { 
  requireRole, 
  requirePermission 
} from '../middleware/auth.middleware';
import { UserRole, Permission } from '../../types/auth.types';
import { auditTrail, performanceMonitor } from '../middleware/logging.middleware';

const router = Router();
const adminController = new AdminController();

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard data
 * @access  Private (Admins)
 */
router.get(
  '/dashboard',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(1000),
  auditTrail('read', 'admin_dashboard'),
  adminController.getDashboard
);

/**
 * @route   GET /api/admin/system-info
 * @desc    Get system information
 * @access  Private (Admins)
 */
router.get(
  '/system-info',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(500),
  auditTrail('read', 'system_info'),
  adminController.getSystemInfo
);

/**
 * @route   GET /api/admin/config
 * @desc    Get system configuration
 * @access  Private (Admins)
 */
router.get(
  '/config',
  requirePermission([Permission.SYSTEM_CONFIG_READ]),
  performanceMonitor(500),
  auditTrail('read', 'system_config'),
  adminController.getSystemConfig
);

/**
 * @route   PUT /api/admin/config
 * @desc    Update system configuration
 * @access  Private (Admins)
 */
router.put(
  '/config',
  requirePermission([Permission.SYSTEM_CONFIG_UPDATE]),
  performanceMonitor(2000),
  auditTrail('update', 'system_config'),
  adminController.updateSystemConfig
);

/**
 * @route   GET /api/admin/logs
 * @desc    Get system logs
 * @access  Private (Admins)
 */
router.get(
  '/logs',
  requirePermission([Permission.SYSTEM_LOGS_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'system_logs'),
  adminController.getSystemLogs
);

/**
 * @route   GET /api/admin/logs/error
 * @desc    Get error logs
 * @access  Private (Admins)
 */
router.get(
  '/logs/error',
  requirePermission([Permission.SYSTEM_LOGS_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'error_logs'),
  adminController.getErrorLogs
);

/**
 * @route   GET /api/admin/logs/security
 * @desc    Get security logs
 * @access  Private (Admins)
 */
router.get(
  '/logs/security',
  requirePermission([Permission.SYSTEM_LOGS_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'security_logs'),
  adminController.getSecurityLogs
);

/**
 * @route   GET /api/admin/logs/audit
 * @desc    Get audit logs
 * @access  Private (Admins)
 */
router.get(
  '/logs/audit',
  requirePermission([Permission.SYSTEM_LOGS_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'audit_logs'),
  adminController.getAuditLogs
);

/**
 * @route   GET /api/admin/metrics
 * @desc    Get system metrics
 * @access  Private (Admins)
 */
router.get(
  '/metrics',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'system_metrics'),
  adminController.getSystemMetrics
);

/**
 * @route   GET /api/admin/metrics/performance
 * @desc    Get performance metrics
 * @access  Private (Admins)
 */
router.get(
  '/metrics/performance',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'performance_metrics'),
  adminController.getPerformanceMetrics
);

/**
 * @route   GET /api/admin/metrics/usage
 * @desc    Get usage metrics
 * @access  Private (Admins)
 */
router.get(
  '/metrics/usage',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'usage_metrics'),
  adminController.getUsageMetrics
);

/**
 * @route   GET /api/admin/metrics/ai
 * @desc    Get AI module metrics
 * @access  Private (Admins)
 */
router.get(
  '/metrics/ai',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'ai_metrics'),
  adminController.getAIMetrics
);

/**
 * @route   GET /api/admin/backups
 * @desc    Get backup status and history
 * @access  Private (Admins)
 */
router.get(
  '/backups',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'backups'),
  adminController.getBackups
);

/**
 * @route   POST /api/admin/backups/create
 * @desc    Create system backup
 * @access  Private (Admins)
 */
router.post(
  '/backups/create',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(5000),
  auditTrail('create', 'backup'),
  adminController.createBackup
);

/**
 * @route   POST /api/admin/backups/:id/restore
 * @desc    Restore from backup
 * @access  Private (Super Admins)
 */
router.post(
  '/backups/:id/restore',
  requireRole([UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(10000),
  auditTrail('restore', 'backup'),
  adminController.restoreBackup
);

/**
 * @route   DELETE /api/admin/backups/:id
 * @desc    Delete backup
 * @access  Private (Admins)
 */
router.delete(
  '/backups/:id',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('delete', 'backup'),
  adminController.deleteBackup
);

/**
 * @route   GET /api/admin/maintenance
 * @desc    Get maintenance mode status
 * @access  Private (Admins)
 */
router.get(
  '/maintenance',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(200),
  auditTrail('read', 'maintenance_mode'),
  adminController.getMaintenanceMode
);

/**
 * @route   POST /api/admin/maintenance/enable
 * @desc    Enable maintenance mode
 * @access  Private (Super Admins)
 */
router.post(
  '/maintenance/enable',
  requireRole([UserRole.SUPER_ADMIN]),
  performanceMonitor(1000),
  auditTrail('enable', 'maintenance_mode'),
  adminController.enableMaintenanceMode
);

/**
 * @route   POST /api/admin/maintenance/disable
 * @desc    Disable maintenance mode
 * @access  Private (Super Admins)
 */
router.post(
  '/maintenance/disable',
  requireRole([UserRole.SUPER_ADMIN]),
  performanceMonitor(1000),
  auditTrail('disable', 'maintenance_mode'),
  adminController.disableMaintenanceMode
);

/**
 * @route   GET /api/admin/ai-models
 * @desc    Get AI models status
 * @access  Private (Admins)
 */
router.get(
  '/ai-models',
  requirePermission([Permission.AI_MODEL_READ]),
  performanceMonitor(1000),
  auditTrail('read', 'ai_models'),
  adminController.getAIModels
);

/**
 * @route   POST /api/admin/ai-models/:id/update
 * @desc    Update AI model
 * @access  Private (Admins)
 */
router.post(
  '/ai-models/:id/update',
  requirePermission([Permission.AI_MODEL_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(5000),
  auditTrail('update', 'ai_model'),
  adminController.updateAIModel
);

/**
 * @route   POST /api/admin/ai-models/:id/train
 * @desc    Train AI model
 * @access  Private (Admins)
 */
router.post(
  '/ai-models/:id/train',
  requirePermission([Permission.AI_MODEL_TRAIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(30000),
  auditTrail('train', 'ai_model'),
  adminController.trainAIModel
);

/**
 * @route   GET /api/admin/ai-models/:id/status
 * @desc    Get AI model training status
 * @access  Private (Admins)
 */
router.get(
  '/ai-models/:id/status',
  requirePermission([Permission.AI_MODEL_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'ai_model_status'),
  adminController.getAIModelStatus
);

/**
 * @route   GET /api/admin/queue/status
 * @desc    Get queue status
 * @access  Private (Admins)
 */
router.get(
  '/queue/status',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'queue_status'),
  adminController.getQueueStatus
);

/**
 * @route   POST /api/admin/queue/clear
 * @desc    Clear all queues
 * @access  Private (Super Admins)
 */
router.post(
  '/queue/clear',
  requireRole([UserRole.SUPER_ADMIN]),
  performanceMonitor(2000),
  auditTrail('clear', 'queues'),
  adminController.clearQueues
);

/**
 * @route   POST /api/admin/queue/retry-failed
 * @desc    Retry failed jobs
 * @access  Private (Admins)
 */
router.post(
  '/queue/retry-failed',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(2000),
  auditTrail('retry', 'failed_jobs'),
  adminController.retryFailedJobs
);

/**
 * @route   GET /api/admin/cache/status
 * @desc    Get cache status
 * @access  Private (Admins)
 */
router.get(
  '/cache/status',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'cache_status'),
  adminController.getCacheStatus
);

/**
 * @route   POST /api/admin/cache/clear
 * @desc    Clear all caches
 * @access  Private (Admins)
 */
router.post(
  '/cache/clear',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(2000),
  auditTrail('clear', 'caches'),
  adminController.clearCaches
);

/**
 * @route   POST /api/admin/cache/warm
 * @desc    Warm up caches
 * @access  Private (Admins)
 */
router.post(
  '/cache/warm',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(5000),
  auditTrail('warm', 'caches'),
  adminController.warmCaches
);

/**
 * @route   GET /api/admin/security/incidents
 * @desc    Get security incidents
 * @access  Private (Admins)
 */
router.get(
  '/security/incidents',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'security_incidents'),
  adminController.getSecurityIncidents
);

/**
 * @route   POST /api/admin/security/incidents/:id/resolve
 * @desc    Resolve security incident
 * @access  Private (Admins)
 */
router.post(
  '/security/incidents/:id/resolve',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('resolve', 'security_incident'),
  adminController.resolveSecurityIncident
);

/**
 * @route   GET /api/admin/security/threats
 * @desc    Get security threats
 * @access  Private (Admins)
 */
router.get(
  '/security/threats',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'security_threats'),
  adminController.getSecurityThreats
);

/**
 * @route   POST /api/admin/security/threats/:id/block
 * @desc    Block security threat
 * @access  Private (Admins)
 */
router.post(
  '/security/threats/:id/block',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('block', 'security_threat'),
  adminController.blockSecurityThreat
);

/**
 * @route   GET /api/admin/reports
 * @desc    Get available reports
 * @access  Private (Admins)
 */
router.get(
  '/reports',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(500),
  auditTrail('read', 'reports'),
  adminController.getReports
);

/**
 * @route   POST /api/admin/reports/generate
 * @desc    Generate report
 * @access  Private (Admins)
 */
router.post(
  '/reports/generate',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(5000),
  auditTrail('generate', 'report'),
  adminController.generateReport
);

/**
 * @route   GET /api/admin/reports/:id
 * @desc    Get report by ID
 * @access  Private (Admins)
 */
router.get(
  '/reports/:id',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('read', 'report'),
  adminController.getReport
);

/**
 * @route   GET /api/admin/reports/:id/download
 * @desc    Download report
 * @access  Private (Admins)
 */
router.get(
  '/reports/:id/download',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(2000),
  auditTrail('download', 'report'),
  adminController.downloadReport
);

/**
 * @route   POST /api/admin/system/restart
 * @desc    Restart system services
 * @access  Private (Super Admins)
 */
router.post(
  '/system/restart',
  requireRole([UserRole.SUPER_ADMIN]),
  performanceMonitor(10000),
  auditTrail('restart', 'system'),
  adminController.restartSystem
);

/**
 * @route   POST /api/admin/system/shutdown
 * @desc    Shutdown system
 * @access  Private (Super Admins)
 */
router.post(
  '/system/shutdown',
  requireRole([UserRole.SUPER_ADMIN]),
  performanceMonitor(5000),
  auditTrail('shutdown', 'system'),
  adminController.shutdownSystem
);

export default router; 