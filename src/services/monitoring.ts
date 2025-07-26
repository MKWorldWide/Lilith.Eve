import { logger } from '../utils/logger';
import { getRedisClient } from './redis';
import os from 'os';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    loadAvg: number[];
  };
  memory: {
    total: number;
    free: number;
    used: number;
    usage: number;
  };
  uptime: number;
  timestamp: Date;
}

/**
 * Collect system metrics
 * @returns System metrics
 */
const collectSystemMetrics = (): SystemMetrics => {
  const freeMemory = os.freemem();
  const totalMemory = os.totalmem();
  const usedMemory = totalMemory - freeMemory;
  
  return {
    cpu: {
      usage: 0, // Will be calculated on second call
      cores: os.cpus().length,
      loadAvg: os.loadavg()
    },
    memory: {
      total: totalMemory,
      free: freeMemory,
      used: usedMemory,
      usage: (usedMemory / totalMemory) * 100
    },
    uptime: os.uptime(),
    timestamp: new Date()
  };
};

// Track previous CPU metrics for usage calculation
let previousCpuMetrics = process.cpuUsage();
let previousMetrics = collectSystemMetrics();

/**
 * Initialize system monitoring
 * @param intervalMs Monitoring interval in milliseconds (default: 60 seconds)
 * @returns Function to stop monitoring
 */
export const setupMonitoring = (intervalMs: number = 60000): (() => void) => {
  logger.info(`Starting system monitoring with ${intervalMs}ms interval`);
  
  // Initial metrics collection
  previousMetrics = collectSystemMetrics();
  
  // Set up interval for periodic monitoring
  const interval = setInterval(async () => {
    try {
      const currentCpuUsage = process.cpuUsage(previousCpuMetrics);
      previousCpuMetrics = process.cpuUsage();
      
      const currentMetrics = collectSystemMetrics();
      
      // Calculate CPU usage percentage
      const elapsedCpuTime = (currentCpuUsage.user + currentCpuUsage.system) / 1000; // Convert to ms
      const elapsedWallTime = currentMetrics.timestamp.getTime() - previousMetrics.timestamp.getTime();
      const cpuUsagePercent = (elapsedCpuTime / (elapsedWallTime * os.cpus().length)) * 100;
      
      currentMetrics.cpu.usage = Math.min(100, Math.max(0, cpuUsagePercent));
      
      // Store metrics in Redis
      const redisClient = getRedisClient();
      await redisClient.set(
        'system:metrics:latest', 
        JSON.stringify(currentMetrics),
        { EX: 300 } // Expire after 5 minutes
      );
      
      // Publish metrics for real-time monitoring
      await redisClient.publish('system:metrics', JSON.stringify(currentMetrics));
      
      previousMetrics = currentMetrics;
      
      logger.debug('System metrics collected', { 
        cpuUsage: currentMetrics.cpu.usage.toFixed(2) + '%',
        memoryUsage: currentMetrics.memory.usage.toFixed(2) + '%'
      });
    } catch (error) {
      logger.error('Error collecting system metrics:', error);
    }
  }, intervalMs);
  
  // Return cleanup function
  return () => {
    clearInterval(interval);
    logger.info('System monitoring stopped');
  };
};

/**
 * Get current system metrics
 * @returns Promise that resolves with current system metrics
 */
export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  try {
    const redisClient = getRedisClient();
    const metrics = await redisClient.get('system:metrics:latest');
    
    if (metrics) {
      return JSON.parse(metrics);
    }
    
    // Fallback to current metrics if not in Redis
    return collectSystemMetrics();
  } catch (error) {
    logger.error('Error getting system metrics:', error);
    // Return current metrics as fallback
    return collectSystemMetrics();
  }
};

/**
 * Log application event
 * @param event Event name
 * @param data Event data
 * @param level Log level (default: 'info')
 */
export const logEvent = async (
  event: string, 
  data: Record<string, any> = {}, 
  level: 'info' | 'warn' | 'error' = 'info'
): Promise<void> => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    data,
    level,
    pid: process.pid,
    hostname: os.hostname()
  };
  
  try {
    const redisClient = getRedisClient();
    
    // Store in Redis logs (keep last 1000 entries)
    await redisClient.lPush('app:logs', JSON.stringify(logEntry));
    await redisClient.lTrim('app:logs', 0, 999);
    
    // Also log to console via Winston
    logger[level](`[${event}]`, data);
    
    // Publish event for real-time monitoring
    await redisClient.publish('app:events', JSON.stringify(logEntry));
  } catch (error) {
    // Fallback to console if Redis is not available
    console.error('Error logging event:', error);
    console[level === 'info' ? 'log' : level](`[${event}]`, data);
  }
};
