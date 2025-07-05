/**
 * @fileoverview Monitoring Routes - Lilith.Eve Medical AI Oracle
 * 
 * This file defines monitoring and observability API endpoints for system
 * metrics, performance monitoring, and health tracking.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import { MonitoringController } from '../controllers/monitoring.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  paginationSchema, 
  dateRangeSchema 
} from '../middleware/validation.middleware';
import { 
  requireRole, 
  requirePermission 
} from '../middleware/auth.middleware';
import { UserRole, Permission } from '../../types/auth.types';
import { auditTrail, performanceMonitor } from '../middleware/logging.middleware';

const router = Router();
const monitoringController = new MonitoringController();

/**
 * @route   GET /api/monitoring/metrics
 * @desc    Get system metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'system_metrics'),
  monitoringController.getSystemMetrics
);

/**
 * @route   GET /api/monitoring/metrics/application
 * @desc    Get application-specific metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/application',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'application_metrics'),
  monitoringController.getApplicationMetrics
);

/**
 * @route   GET /api/monitoring/metrics/business
 * @desc    Get business metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/business',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'business_metrics'),
  monitoringController.getBusinessMetrics
);

/**
 * @route   GET /api/monitoring/metrics/performance
 * @desc    Get performance metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/performance',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'performance_metrics'),
  monitoringController.getPerformanceMetrics
);

/**
 * @route   GET /api/monitoring/metrics/ai
 * @desc    Get AI module metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/ai',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'ai_metrics'),
  monitoringController.getAIMetrics
);

/**
 * @route   GET /api/monitoring/metrics/database
 * @desc    Get database metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/database',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'database_metrics'),
  monitoringController.getDatabaseMetrics
);

/**
 * @route   GET /api/monitoring/metrics/cache
 * @desc    Get cache metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/cache',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'cache_metrics'),
  monitoringController.getCacheMetrics
);

/**
 * @route   GET /api/monitoring/metrics/queue
 * @desc    Get queue metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/queue',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'queue_metrics'),
  monitoringController.getQueueMetrics
);

/**
 * @route   GET /api/monitoring/metrics/network
 * @desc    Get network metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/network',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'network_metrics'),
  monitoringController.getNetworkMetrics
);

/**
 * @route   GET /api/monitoring/metrics/security
 * @desc    Get security metrics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/metrics/security',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'security_metrics'),
  monitoringController.getSecurityMetrics
);

/**
 * @route   GET /api/monitoring/alerts
 * @desc    Get system alerts
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/alerts',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'system_alerts'),
  monitoringController.getAlerts
);

/**
 * @route   GET /api/monitoring/alerts/active
 * @desc    Get active alerts
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/alerts/active',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'active_alerts'),
  monitoringController.getActiveAlerts
);

/**
 * @route   POST /api/monitoring/alerts/:id/acknowledge
 * @desc    Acknowledge alert
 * @access  Private (Admins, Analysts)
 */
router.post(
  '/alerts/:id/acknowledge',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('acknowledge', 'alert'),
  monitoringController.acknowledgeAlert
);

/**
 * @route   POST /api/monitoring/alerts/:id/resolve
 * @desc    Resolve alert
 * @access  Private (Admins, Analysts)
 */
router.post(
  '/alerts/:id/resolve',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('resolve', 'alert'),
  monitoringController.resolveAlert
);

/**
 * @route   GET /api/monitoring/dashboards
 * @desc    Get available dashboards
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/dashboards',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'dashboards'),
  monitoringController.getDashboards
);

/**
 * @route   GET /api/monitoring/dashboards/:id
 * @desc    Get dashboard data
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/dashboards/:id',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(1000),
  auditTrail('read', 'dashboard'),
  monitoringController.getDashboard
);

/**
 * @route   GET /api/monitoring/traces
 * @desc    Get distributed traces
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/traces',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'distributed_traces'),
  monitoringController.getTraces
);

/**
 * @route   GET /api/monitoring/traces/:id
 * @desc    Get specific trace
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/traces/:id',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'trace'),
  monitoringController.getTrace
);

/**
 * @route   GET /api/monitoring/profiles
 * @desc    Get performance profiles
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/profiles',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'performance_profiles'),
  monitoringController.getProfiles
);

/**
 * @route   GET /api/monitoring/profiles/:id
 * @desc    Get specific performance profile
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/profiles/:id',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'performance_profile'),
  monitoringController.getProfile
);

/**
 * @route   GET /api/monitoring/events
 * @desc    Get system events
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/events',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'system_events'),
  monitoringController.getEvents
);

/**
 * @route   GET /api/monitoring/events/realtime
 * @desc    Get real-time system events
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/events/realtime',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'realtime_events'),
  monitoringController.getRealtimeEvents
);

/**
 * @route   GET /api/monitoring/health/overview
 * @desc    Get system health overview
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/health/overview',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'health_overview'),
  monitoringController.getHealthOverview
);

/**
 * @route   GET /api/monitoring/health/services
 * @desc    Get individual service health
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/health/services',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(1000),
  auditTrail('read', 'service_health'),
  monitoringController.getServiceHealth
);

/**
 * @route   GET /api/monitoring/health/dependencies
 * @desc    Get dependency health
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/health/dependencies',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(1000),
  auditTrail('read', 'dependency_health'),
  monitoringController.getDependencyHealth
);

/**
 * @route   GET /api/monitoring/usage/analytics
 * @desc    Get usage analytics
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/usage/analytics',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'usage_analytics'),
  monitoringController.getUsageAnalytics
);

/**
 * @route   GET /api/monitoring/usage/patterns
 * @desc    Get usage patterns
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/usage/patterns',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'usage_patterns'),
  monitoringController.getUsagePatterns
);

/**
 * @route   GET /api/monitoring/usage/trends
 * @desc    Get usage trends
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/usage/trends',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'usage_trends'),
  monitoringController.getUsageTrends
);

/**
 * @route   GET /api/monitoring/performance/slow-queries
 * @desc    Get slow database queries
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/performance/slow-queries',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'slow_queries'),
  monitoringController.getSlowQueries
);

/**
 * @route   GET /api/monitoring/performance/endpoints
 * @desc    Get API endpoint performance
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/performance/endpoints',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'endpoint_performance'),
  monitoringController.getEndpointPerformance
);

/**
 * @route   GET /api/monitoring/performance/errors
 * @desc    Get error rates and types
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/performance/errors',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'error_rates'),
  monitoringController.getErrorRates
);

/**
 * @route   GET /api/monitoring/capacity/current
 * @desc    Get current system capacity
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/capacity/current',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(500),
  auditTrail('read', 'current_capacity'),
  monitoringController.getCurrentCapacity
);

/**
 * @route   GET /api/monitoring/capacity/forecast
 * @desc    Get capacity forecast
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/capacity/forecast',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(2000),
  auditTrail('read', 'capacity_forecast'),
  monitoringController.getCapacityForecast
);

/**
 * @route   GET /api/monitoring/capacity/recommendations
 * @desc    Get capacity recommendations
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/capacity/recommendations',
  requirePermission([Permission.SYSTEM_MONITORING]),
  performanceMonitor(1000),
  auditTrail('read', 'capacity_recommendations'),
  monitoringController.getCapacityRecommendations
);

/**
 * @route   GET /api/monitoring/reports/performance
 * @desc    Get performance report
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/reports/performance',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(2000),
  auditTrail('read', 'performance_report'),
  monitoringController.getPerformanceReport
);

/**
 * @route   GET /api/monitoring/reports/availability
 * @desc    Get availability report
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/reports/availability',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(2000),
  auditTrail('read', 'availability_report'),
  monitoringController.getAvailabilityReport
);

/**
 * @route   GET /api/monitoring/reports/incidents
 * @desc    Get incident report
 * @access  Private (Admins, Analysts)
 */
router.get(
  '/reports/incidents',
  requirePermission([Permission.SYSTEM_MONITORING]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(2000),
  auditTrail('read', 'incident_report'),
  monitoringController.getIncidentReport
);

export default router; 