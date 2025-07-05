/**
 * @fileoverview Monitoring Controller - Lilith.Eve Medical AI Oracle
 * 
 * This controller handles system monitoring, metrics collection, and observability
 * for comprehensive system monitoring and alerting.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response } from 'express';
import { MonitoringService } from '../../services/monitoring.service';
import { logger, logUtils } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';

export class MonitoringController {
  private monitoringService: MonitoringService;

  constructor() {
    this.monitoringService = new MonitoringService();
  }

  /**
   * Get real-time system metrics
   */
  public getRealTimeMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const metrics = await this.monitoringService.getRealTimeMetrics();

      logUtils.logInfo('Retrieved real-time metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve real-time metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get historical metrics
   */
  public getHistoricalMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, metricType } = req.query;
      
      const metrics = await this.monitoringService.getHistoricalMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        metricType: metricType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved historical metrics', {
        userId: req.user!.id,
        metricType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve historical metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get application performance metrics
   */
  public getAppPerformanceMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval } = req.query;
      
      const metrics = await this.monitoringService.getAppPerformanceMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved app performance metrics', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve app performance metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get API performance metrics
   */
  public getAPIPerformanceMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, endpoint } = req.query;
      
      const metrics = await this.monitoringService.getAPIPerformanceMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        endpoint: endpoint as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved API performance metrics', {
        userId: req.user!.id,
        endpoint
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve API performance metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get error rate metrics
   */
  public getErrorRateMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, errorType } = req.query;
      
      const metrics = await this.monitoringService.getErrorRateMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        errorType: errorType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved error rate metrics', {
        userId: req.user!.id,
        errorType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve error rate metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get resource utilization metrics
   */
  public getResourceUtilizationMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, resourceType } = req.query;
      
      const metrics = await this.monitoringService.getResourceUtilizationMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        resourceType: resourceType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved resource utilization metrics', {
        userId: req.user!.id,
        resourceType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve resource utilization metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get user activity metrics
   */
  public getUserActivityMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, activityType } = req.query;
      
      const metrics = await this.monitoringService.getUserActivityMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        activityType: activityType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved user activity metrics', {
        userId: req.user!.id,
        activityType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve user activity metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get AI model performance metrics
   */
  public getAIModelMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, modelName } = req.query;
      
      const metrics = await this.monitoringService.getAIModelMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        modelName: modelName as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved AI model metrics', {
        userId: req.user!.id,
        modelName
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve AI model metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get database performance metrics
   */
  public getDatabaseMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, queryType } = req.query;
      
      const metrics = await this.monitoringService.getDatabaseMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        queryType: queryType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved database metrics', {
        userId: req.user!.id,
        queryType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
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
      const { startDate, endDate, interval, cacheType } = req.query;
      
      const metrics = await this.monitoringService.getCacheMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        cacheType: cacheType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved cache metrics', {
        userId: req.user!.id,
        cacheType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
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
      const { startDate, endDate, interval, queueName } = req.query;
      
      const metrics = await this.monitoringService.getQueueMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        queueName: queueName as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved queue metrics', {
        userId: req.user!.id,
        queueName
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
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
   * Get security metrics
   */
  public getSecurityMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, securityType } = req.query;
      
      const metrics = await this.monitoringService.getSecurityMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        securityType: securityType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved security metrics', {
        userId: req.user!.id,
        securityType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
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
   * Get business metrics
   */
  public getBusinessMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, interval, metricType } = req.query;
      
      const metrics = await this.monitoringService.getBusinessMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        interval: interval as string,
        metricType: metricType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved business metrics', {
        userId: req.user!.id,
        metricType
      });

      res.status(200).json({
        success: true,
        data: metrics,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve business metrics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get alert rules
   */
  public getAlertRules = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, status, severity } = req.query;
      
      const result = await this.monitoringService.getAlertRules({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        severity: severity as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved alert rules', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
      });

      res.status(200).json({
        success: true,
        data: result.rules,
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
        message: 'Failed to retrieve alert rules',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Create alert rule
   */
  public createAlertRule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const ruleData = req.body;
      const rule = await this.monitoringService.createAlertRule(ruleData, req.user!);

      logUtils.logInfo('Created alert rule', {
        userId: req.user!.id,
        ruleId: rule.id
      });

      res.status(201).json({
        success: true,
        data: rule,
        message: 'Alert rule created successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        ruleData: req.body
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to create alert rule',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Update alert rule
   */
  public updateAlertRule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const rule = await this.monitoringService.updateAlertRule(id, updateData, req.user!);

      logUtils.logInfo('Updated alert rule', {
        userId: req.user!.id,
        ruleId: id
      });

      res.status(200).json({
        success: true,
        data: rule,
        message: 'Alert rule updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        ruleId: req.params.id 
      });
      
      if ((error as Error).message === 'Alert rule not found') {
        res.status(404).json({
          success: false,
          message: 'Alert rule not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update alert rule',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Delete alert rule
   */
  public deleteAlertRule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.monitoringService.deleteAlertRule(id, req.user!);

      logUtils.logInfo('Deleted alert rule', {
        userId: req.user!.id,
        ruleId: id
      });

      res.status(200).json({
        success: true,
        message: 'Alert rule deleted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        ruleId: req.params.id 
      });
      
      if ((error as Error).message === 'Alert rule not found') {
        res.status(404).json({
          success: false,
          message: 'Alert rule not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete alert rule',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Enable/disable alert rule
   */
  public toggleAlertRule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { enabled } = req.body;
      
      const rule = await this.monitoringService.toggleAlertRule(id, enabled, req.user!);

      logUtils.logInfo('Toggled alert rule', {
        userId: req.user!.id,
        ruleId: id,
        enabled
      });

      res.status(200).json({
        success: true,
        data: rule,
        message: `Alert rule ${enabled ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        ruleId: req.params.id 
      });
      
      if ((error as Error).message === 'Alert rule not found') {
        res.status(404).json({
          success: false,
          message: 'Alert rule not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to toggle alert rule',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get active alerts
   */
  public getActiveAlerts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, severity, status } = req.query;
      
      const result = await this.monitoringService.getActiveAlerts({
        page: Number(page),
        limit: Number(limit),
        severity: severity as string,
        status: status as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved active alerts', {
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
        message: 'Failed to retrieve active alerts',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Acknowledge alert
   */
  public acknowledgeAlert = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { acknowledgment } = req.body;
      
      const alert = await this.monitoringService.acknowledgeAlert(id, acknowledgment, req.user!);

      logUtils.logInfo('Acknowledged alert', {
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
   * Resolve alert
   */
  public resolveAlert = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { resolution } = req.body;
      
      const alert = await this.monitoringService.resolveAlert(id, resolution, req.user!);

      logUtils.logInfo('Resolved alert', {
        userId: req.user!.id,
        alertId: id
      });

      res.status(200).json({
        success: true,
        data: alert,
        message: 'Alert resolved successfully'
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
          message: 'Failed to resolve alert',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get alert history
   */
  public getAlertHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, severity, status, startDate, endDate } = req.query;
      
      const result = await this.monitoringService.getAlertHistory({
        page: Number(page),
        limit: Number(limit),
        severity: severity as string,
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved alert history', {
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
        message: 'Failed to retrieve alert history',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get monitoring dashboard
   */
  public getMonitoringDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { dashboardType } = req.query;
      
      const dashboard = await this.monitoringService.getMonitoringDashboard({
        dashboardType: dashboardType as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved monitoring dashboard', {
        userId: req.user!.id,
        dashboardType
      });

      res.status(200).json({
        success: true,
        data: dashboard,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve monitoring dashboard',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Export metrics data
   */
  public exportMetrics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, metricType, format = 'csv' } = req.query;
      
      const exportData = await this.monitoringService.exportMetrics({
        startDate: startDate as string,
        endDate: endDate as string,
        metricType: metricType as string,
        format: format as string,
        user: req.user!
      });

      logUtils.logInfo('Exported metrics data', {
        userId: req.user!.id,
        metricType,
        format
      });

      res.setHeader('Content-Type', format === 'csv' ? 'text/csv' : 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="metrics-${metricType}-${startDate}-${endDate}.${format}"`);
      res.status(200).send(exportData);
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to export metrics data',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get monitoring configuration
   */
  public getMonitoringConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const config = await this.monitoringService.getMonitoringConfig(req.user!);

      logUtils.logInfo('Retrieved monitoring config', {
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
        message: 'Failed to retrieve monitoring configuration',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Update monitoring configuration
   */
  public updateMonitoringConfig = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const configData = req.body;
      const config = await this.monitoringService.updateMonitoringConfig(configData, req.user!);

      logUtils.logInfo('Updated monitoring config', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: config,
        message: 'Monitoring configuration updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        configData: req.body
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to update monitoring configuration',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };
} 