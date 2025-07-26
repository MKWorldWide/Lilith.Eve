import { createClient } from 'redis';
import { logger } from '../utils/logger';

let client: ReturnType<typeof createClient> | null = null;

/**
 * Initialize Redis client and connect to Redis server
 * @returns Promise that resolves with the Redis client when connected
 */
export const initializeRedis = async (): Promise<ReturnType<typeof createClient>> => {
  try {
    const redisUrl = process.env['REDIS_URL'] || 'redis://localhost:6379';
    
    client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
        reconnectStrategy: (retries) => {
          if (retries > 5) {
            logger.error('Max Redis reconnection attempts reached');
            return new Error('Max reconnection attempts reached');
          }
          // Exponential backoff: 100ms, 200ms, 400ms, 800ms, 1.6s, 3.2s
          return Math.min(retries * 100, 3200);
        }
      }
    });

    // Handle connection events
    client.on('connect', () => {
      logger.info('Redis client connected');
    });

    client.on('error', (error) => {
      logger.error('Redis client error:', error);
    });

    client.on('reconnecting', () => {
      logger.info('Redis client reconnecting...');
    });

    await client.connect();
    return client;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    throw error;
  }
};

/**
 * Get the Redis client instance
 * @returns Redis client instance
 * @throws Error if Redis client is not initialized
 */
export const getRedisClient = (): ReturnType<typeof createClient> => {
  if (!client) {
    throw new Error('Redis client not initialized. Call initializeRedis() first.');
  }
  return client;
};

/**
 * Close the Redis connection
 * @returns Promise that resolves when the connection is closed
 */
export const closeRedis = async (): Promise<void> => {
  if (client) {
    try {
      await client.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
      throw error;
    } finally {
      client = null;
    }
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeRedis();
  process.exit(0);
});
