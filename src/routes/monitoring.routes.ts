import { Router } from 'express';
import { authenticate } from '../middleware/security';
import { logEvent } from '../services/monitoring';

const router = Router();

// Apply authentication middleware to all monitoring routes
router.use(authenticate);

/**
 * @route GET /monitoring/health
 * @desc Get system health status
 * @access Private (Admin only)
 */
router.get('/health', async (req, res) => {
  try {
    // Check if user has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Admin access required'
      });
    }
    
    // Get system health status
    // This is a simplified example - in a real app, you'd check various services
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        api: 'operational',
        storage: 'available',
        cache: 'operational'
      },
      metrics: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        load: process.cpuUsage()
      }
    };
    
    // Log health check
    await logEvent('health_check', { 
      userId: req.user.id,
      status: healthStatus.status 
    });
    
    res.status(200).json({
      success: true,
      data: healthStatus
    });
    
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check system health'
    });
  }
});

/**
 * @route GET /monitoring/logs
 * @desc Get system logs
 * @access Private (Admin only)
 */
router.get('/logs', async (req, res) => {
  try {
    // Check if user has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized: Admin access required'
      });
    }
    
    const { level, limit = 100 } = req.query;
    
    // TODO: Implement actual log retrieval
    // This is a placeholder for demonstration
    const logs = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'System started successfully',
        service: 'api',
        userId: req.user.id
      }
    ];
    
    // Apply filters if provided
    const filteredLogs = level 
      ? logs.filter(log => log.level === level)
      : logs;
    
    // Apply limit
    const limitedLogs = filteredLogs.slice(0, parseInt(limit as string));
    
    res.status(200).json({
      success: true,
      data: limitedLogs,
      meta: {
        total: limitedLogs.length,
        filtered: filteredLogs.length,
        limit: parseInt(limit as string)
      }
    });
    
  } catch (error) {
    console.error('Get logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve system logs'
    });
  }
});

export default router;
