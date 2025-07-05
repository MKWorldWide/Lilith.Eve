/**
 * @fileoverview Health Check Routes - Lilith.Eve Medical AI Oracle
 * 
 * This file defines health check endpoints for system monitoring, status
 * information, and service availability checks.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { performanceMonitor } from '../middleware/logging.middleware';

const router = Router();
const healthController = new HealthController();

/**
 * @route   GET /health
 * @desc    Basic health check endpoint
 * @access  Public
 */
router.get(
  '/',
  performanceMonitor(100),
  healthController.basicHealth
);

/**
 * @route   GET /health/detailed
 * @desc    Detailed health check with system information
 * @access  Public
 */
router.get(
  '/detailed',
  performanceMonitor(500),
  healthController.detailedHealth
);

/**
 * @route   GET /health/ready
 * @desc    Readiness probe for Kubernetes
 * @access  Public
 */
router.get(
  '/ready',
  performanceMonitor(200),
  healthController.readinessCheck
);

/**
 * @route   GET /health/live
 * @desc    Liveness probe for Kubernetes
 * @access  Public
 */
router.get(
  '/live',
  performanceMonitor(100),
  healthController.livenessCheck
);

/**
 * @route   GET /health/database
 * @desc    Database connectivity check
 * @access  Public
 */
router.get(
  '/database',
  performanceMonitor(1000),
  healthController.databaseHealth
);

/**
 * @route   GET /health/redis
 * @desc    Redis connectivity check
 * @access  Public
 */
router.get(
  '/redis',
  performanceMonitor(500),
  healthController.redisHealth
);

/**
 * @route   GET /health/elasticsearch
 * @desc    Elasticsearch connectivity check
 * @access  Public
 */
router.get(
  '/elasticsearch',
  performanceMonitor(1000),
  healthController.elasticsearchHealth
);

/**
 * @route   GET /health/rabbitmq
 * @desc    RabbitMQ connectivity check
 * @access  Public
 */
router.get(
  '/rabbitmq',
  performanceMonitor(500),
  healthController.rabbitmqHealth
);

/**
 * @route   GET /health/ai-services
 * @desc    AI services connectivity check
 * @access  Public
 */
router.get(
  '/ai-services',
  performanceMonitor(2000),
  healthController.aiServicesHealth
);

/**
 * @route   GET /health/external-apis
 * @desc    External APIs connectivity check
 * @access  Public
 */
router.get(
  '/external-apis',
  performanceMonitor(3000),
  healthController.externalApisHealth
);

/**
 * @route   GET /health/disk
 * @desc    Disk space and storage health check
 * @access  Public
 */
router.get(
  '/disk',
  performanceMonitor(200),
  healthController.diskHealth
);

/**
 * @route   GET /health/memory
 * @desc    Memory usage health check
 * @access  Public
 */
router.get(
  '/memory',
  performanceMonitor(100),
  healthController.memoryHealth
);

/**
 * @route   GET /health/cpu
 * @desc    CPU usage health check
 * @access  Public
 */
router.get(
  '/cpu',
  performanceMonitor(100),
  healthController.cpuHealth
);

/**
 * @route   GET /health/network
 * @desc    Network connectivity health check
 * @access  Public
 */
router.get(
  '/network',
  performanceMonitor(500),
  healthController.networkHealth
);

/**
 * @route   GET /health/ssl
 * @desc    SSL certificate health check
 * @access  Public
 */
router.get(
  '/ssl',
  performanceMonitor(500),
  healthController.sslHealth
);

/**
 * @route   GET /health/version
 * @desc    Get application version information
 * @access  Public
 */
router.get(
  '/version',
  performanceMonitor(100),
  healthController.getVersion
);

/**
 * @route   GET /health/config
 * @desc    Get configuration status (non-sensitive)
 * @access  Public
 */
router.get(
  '/config',
  performanceMonitor(200),
  healthController.getConfigStatus
);

/**
 * @route   GET /health/metrics
 * @desc    Get system metrics for monitoring
 * @access  Public
 */
router.get(
  '/metrics',
  performanceMonitor(500),
  healthController.getMetrics
);

/**
 * @route   GET /health/status
 * @desc    Get overall system status
 * @access  Public
 */
router.get(
  '/status',
  performanceMonitor(300),
  healthController.getSystemStatus
);

export default router; 