import mongoose from 'mongoose';
import { logger } from '../utils/logger';

/**
 * Initialize MongoDB database connection
 * @returns Promise that resolves when the database is connected
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env['MONGODB_URI'] || 'mongodb://localhost:27017/lilith-eve';
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    logger.info('Database connection established');
  } catch (error) {
    logger.error('Database connection error:', error);
    throw error;
  }
};

/**
 * Close database connection
 * @returns Promise that resolves when the connection is closed
 */
export const closeDatabase = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('error', (error) => {
  logger.error('MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');});

// Handle process termination
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

// Export mongoose for models to use
export { mongoose };
