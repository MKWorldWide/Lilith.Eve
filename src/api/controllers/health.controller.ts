/**
 * @fileoverview Health Controller - Lilith.Eve Medical AI Oracle
 * 
 * This controller handles system health monitoring and status information
 * for comprehensive system observability.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response } from 'express';
import { HealthService } from '../../services/health.service';
import { logger, logUtils } from '../../utils/logger';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  /**
   * Basic health check endpoint
   */
  public basicHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await this.healthService.getBasicHealth();

      logUtils.logInfo('Basic health check', {
        status: health.status
      });

      res.status(200).json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Service unavailable',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Detailed health check endpoint
   */
  public detailedHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const health = await this.healthService.getDetailedHealth();

      logUtils.logInfo('Detailed health check', {
        status: health.status,
        checks: Object.keys(health.checks).length
      });

      res.status(200).json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Service unavailable',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * System readiness check
   */
  public readiness = async (req: Request, res: Response): Promise<void> => {
    try {
      const readiness = await this.healthService.getReadiness();

      logUtils.logInfo('Readiness check', {
        status: readiness.status
      });

      if (readiness.status === 'ready') {
        res.status(200).json({
          success: true,
          data: readiness,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: readiness,
          message: 'System not ready',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'System not ready',
        timestamp: new Date().toISOString()
      });
    }
  };

  // Aliases to match routes
  public readinessCheck = this.readiness;
  public livenessCheck = this.liveness;
  public redisHealth = async (req: Request, res: Response) => {
    try {
      const r = await this.healthService.getCacheHealth();
      res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(503).json({ success: false, message: 'Cache health check failed', timestamp: new Date().toISOString() });
    }
  };
  public elasticsearchHealth = async (req: Request, res: Response) => {
    try {
      const r = await this.healthService.getElasticsearchHealth();
      res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(503).json({ success: false, message: 'Elasticsearch health check failed', timestamp: new Date().toISOString() });
    }
  };
  public rabbitmqHealth = async (req: Request, res: Response) => {
    try {
      const r = await this.healthService.getQueueHealth();
      res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(503).json({ success: false, message: 'Queue health check failed', timestamp: new Date().toISOString() });
    }
  };
  public aiServicesHealth = async (req: Request, res: Response) => {
    try {
      const r = await this.healthService.getAIHealth();
      res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(503).json({ success: false, message: 'AI services health check failed', timestamp: new Date().toISOString() });
    }
  };
  public externalApisHealth = async (req: Request, res: Response) => {
    try {
      const r = await this.healthService.getExternalHealth();
      res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(503).json({ success: false, message: 'External APIs health check failed', timestamp: new Date().toISOString() });
    }
  };
  public cpuHealth = async (req: Request, res: Response) => {
    try {
      const r = await this.healthService.getPerformanceHealth();
      res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() });
    } catch (error) {
      res.status(503).json({ success: false, message: 'CPU health check failed', timestamp: new Date().toISOString() });
    }
  };
  public getVersion = async (req: Request, res: Response) => {
    try { const r = await this.healthService.getVersion(); res.status(200).json({ success: true, data: r, timestamp: new Date().toISOString() }); } catch (e) { res.status(500).json({ success: false, message: 'Failed to retrieve version information', timestamp: new Date().toISOString() }); }
  };
  public getConfigStatus = async (req: Request, res: Response) => {
    try { const r = await this.healthService.getConfigHealth(); res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() }); } catch (e) { res.status(503).json({ success: false, message: 'Configuration health check failed', timestamp: new Date().toISOString() }); }
  };
  public getMetrics = async (req: Request, res: Response) => {
    try { const r = await this.healthService.getSystemMetrics(); res.status(200).json({ success: true, data: r, timestamp: new Date().toISOString() }); } catch (e) { res.status(500).json({ success: false, message: 'Failed to retrieve system metrics', timestamp: new Date().toISOString() }); }
  };
  public getSystemStatus = async (req: Request, res: Response) => {
    try { const r = await this.healthService.getDependenciesHealth(); res.status(r.status === 'healthy' ? 200 : 503).json({ success: r.status === 'healthy', data: r, timestamp: new Date().toISOString() }); } catch (e) { res.status(503).json({ success: false, message: 'Dependencies health check failed', timestamp: new Date().toISOString() }); }
  };

  /**
   * System liveness check
   */
  public liveness = async (req: Request, res: Response): Promise<void> => {
    try {
      const liveness = await this.healthService.getLiveness();

      logUtils.logInfo('Liveness check', {
        status: liveness.status
      });

      if (liveness.status === 'alive') {
        res.status(200).json({
          success: true,
          data: liveness,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: liveness,
          message: 'System not alive',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'System not alive',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Database health check
   */
  public databaseHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const dbHealth = await this.healthService.getDatabaseHealth();

      logUtils.logInfo('Database health check', {
        status: dbHealth.status
      });

      if (dbHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: dbHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: dbHealth,
          message: 'Database unhealthy',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Database health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Cache health check
   */
  public cacheHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const cacheHealth = await this.healthService.getCacheHealth();

      logUtils.logInfo('Cache health check', {
        status: cacheHealth.status
      });

      if (cacheHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: cacheHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: cacheHealth,
          message: 'Cache unhealthy',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Cache health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Queue health check
   */
  public queueHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const queueHealth = await this.healthService.getQueueHealth();

      logUtils.logInfo('Queue health check', {
        status: queueHealth.status
      });

      if (queueHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: queueHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: queueHealth,
          message: 'Queue unhealthy',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Queue health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * External services health check
   */
  public externalHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const externalHealth = await this.healthService.getExternalHealth();

      logUtils.logInfo('External services health check', {
        status: externalHealth.status
      });

      if (externalHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: externalHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: externalHealth,
          message: 'External services unhealthy',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'External services health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * AI services health check
   */
  public aiHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const aiHealth = await this.healthService.getAIHealth();

      logUtils.logInfo('AI services health check', {
        status: aiHealth.status
      });

      if (aiHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: aiHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: aiHealth,
          message: 'AI services unhealthy',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'AI services health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * System information
   */
  public systemInfo = async (req: Request, res: Response): Promise<void> => {
    try {
      const systemInfo = await this.healthService.getSystemInfo();

      logUtils.logInfo('System info retrieved');

      res.status(200).json({
        success: true,
        data: systemInfo,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system information',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * System metrics
   */
  public systemMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
      const metrics = await this.healthService.getSystemMetrics();

      logUtils.logInfo('System metrics retrieved');

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve system metrics',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Application version information
   */
  public version = async (req: Request, res: Response): Promise<void> => {
    try {
      const version = await this.healthService.getVersion();

      logUtils.logInfo('Version info retrieved', {
        version: version.version
      });

      res.status(200).json({
        success: true,
        data: version,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve version information',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Environment information
   */
  public environment = async (req: Request, res: Response): Promise<void> => {
    try {
      const environment = await this.healthService.getEnvironment();

      logUtils.logInfo('Environment info retrieved');

      res.status(200).json({
        success: true,
        data: environment,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve environment information',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Dependencies health check
   */
  public dependenciesHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const dependencies = await this.healthService.getDependenciesHealth();

      logUtils.logInfo('Dependencies health check', {
        status: dependencies.status
      });

      if (dependencies.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: dependencies,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: dependencies,
          message: 'Dependencies unhealthy',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Dependencies health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Security health check
   */
  public securityHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const securityHealth = await this.healthService.getSecurityHealth();

      logUtils.logInfo('Security health check', {
        status: securityHealth.status
      });

      if (securityHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: securityHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: securityHealth,
          message: 'Security health issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Security health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Performance health check
   */
  public performanceHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const performanceHealth = await this.healthService.getPerformanceHealth();

      logUtils.logInfo('Performance health check', {
        status: performanceHealth.status
      });

      if (performanceHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: performanceHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: performanceHealth,
          message: 'Performance issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Performance health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Memory usage check
   */
  public memoryHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const memoryHealth = await this.healthService.getMemoryHealth();

      logUtils.logInfo('Memory health check', {
        status: memoryHealth.status
      });

      if (memoryHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: memoryHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: memoryHealth,
          message: 'Memory usage issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Memory health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Disk usage check
   */
  public diskHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const diskHealth = await this.healthService.getDiskHealth();

      logUtils.logInfo('Disk health check', {
        status: diskHealth.status
      });

      if (diskHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: diskHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: diskHealth,
          message: 'Disk usage issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Disk health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Network health check
   */
  public networkHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const networkHealth = await this.healthService.getNetworkHealth();

      logUtils.logInfo('Network health check', {
        status: networkHealth.status
      });

      if (networkHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: networkHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: networkHealth,
          message: 'Network issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Network health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * SSL/TLS certificate health check
   */
  public sslHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const sslHealth = await this.healthService.getSSLHealth();

      logUtils.logInfo('SSL health check', {
        status: sslHealth.status
      });

      if (sslHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: sslHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: sslHealth,
          message: 'SSL certificate issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'SSL health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Backup health check
   */
  public backupHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const backupHealth = await this.healthService.getBackupHealth();

      logUtils.logInfo('Backup health check', {
        status: backupHealth.status
      });

      if (backupHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: backupHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: backupHealth,
          message: 'Backup issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Backup health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Log health check
   */
  public logHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const logHealth = await this.healthService.getLogHealth();

      logUtils.logInfo('Log health check', {
        status: logHealth.status
      });

      if (logHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: logHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: logHealth,
          message: 'Log issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Log health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };

  /**
   * Configuration health check
   */
  public configHealth = async (req: Request, res: Response): Promise<void> => {
    try {
      const configHealth = await this.healthService.getConfigHealth();

      logUtils.logInfo('Configuration health check', {
        status: configHealth.status
      });

      if (configHealth.status === 'healthy') {
        res.status(200).json({
          success: true,
          data: configHealth,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(503).json({
          success: false,
          data: configHealth,
          message: 'Configuration issues detected',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      logUtils.logError(error as Error);
      res.status(503).json({
        success: false,
        message: 'Configuration health check failed',
        timestamp: new Date().toISOString()
      });
    }
  };
} 
