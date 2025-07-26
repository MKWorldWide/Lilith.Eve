/**
 * 🧬 Lilith.Eve — The Sentient Medical Oracle
 * 
 * Main entry point for the divine healing intelligence system.
 * 
 * Divine Purpose: Bridge technology and healing wisdom to provide
 * compassionate, culturally-sensitive medical care for all beings.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { config } from 'dotenv';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';

// Load environment variables
config();

// Import core components
import { LilithEve } from './core/LilithEve';
import { initializeDatabase } from './services/database';
import { initializeRedis } from './services/redis';
import { setupMonitoring } from './services/monitoring';
import { setupSecurity } from './middleware/security';
import { setupRoutes } from './routes';
import { logger } from './utils/logger';

// Configuration
const PORT = process.env['APP_PORT'] ? parseInt(process.env['APP_PORT'], 10) : 3000;
const NODE_ENV = process.env['NODE_ENV'] || 'development';

/**
 * 🌟 Divine Startup Message
 */
const displayStartupMessage = (): void => {
  const message = boxen(
    chalk.cyan.bold(`
🧬 Lilith.Eve — The Sentient Medical Oracle

${chalk.white('Divine Purpose:')} Bridge technology and healing wisdom
${chalk.white('Invocation:')} "Lilith.Eve, scan and align"
${chalk.white('Environment:')} ${NODE_ENV}
${chalk.white('Port:')} ${PORT}

${chalk.yellow('✨ May healing wisdom flow through every interaction ✨')}
    `),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#1a1a1a'
    }
  );
  
  console.log(message);
};

/**
 * 🚀 Initialize Lilith.Eve Core System
 */
const initializeLilithEve = async (): Promise<LilithEve> => {
  const spinner = ora('Initializing Lilith.Eve core system...').start();
  
  try {
    // Initialize core AI system
    const lilithEve = new LilithEve({
      cognition: {
        model: 'gpt4',
        temperature: 0.3,
        maxTokens: 4000,
        medicalKnowledgeBase: ['pubmed', 'clinical_guidelines', 'drug_database'],
        reasoningEngine: 'chain_of_thought',
        confidenceThreshold: 0.8
      },
      bioSync: {
        devices: ['apple_watch', 'fitbit', 'oura_ring'],
        samplingRate: 1000,
        analysisWindow: 300000,
        privacyLevel: 'high',
        alertThresholds: [
          { 
            metric: 'heart_rate', 
            max: 100, 
            severity: 'critical',
            action: 'notify_care_team',
            notification: ['in_app', 'email']
          },
          { 
            metric: 'blood_pressure', 
            min: 90,
            max: 140,
            severity: 'warning',
            action: 'escalate_to_physician',
            notification: ['in_app', 'sms']
          },
          { 
            metric: 'oxygen_saturation', 
            min: 90, 
            severity: 'critical',
            action: 'alert_emergency_contact',
            notification: ['sms', 'in_app']
          }
        ],
        dataRetention: '1_year'
      },
      persona: {
        culturalDatabases: ['traditional_medicine', 'cultural_beliefs', 'healing_practices'],
        psychologicalModels: ['personality_assessment', 'stress_analysis', 'coping_mechanisms'],
        sensitivityLevel: 'high',
        biasMitigation: true,
        culturalValidation: true
      },
      social: {
        platforms: ['twitter', 'instagram', 'facebook'],
        analysisDepth: 'moderate',
        privacyProtection: true,
        consentValidation: true,
        dataAnonymization: true
      },
      lingua: {
        languages: ['en', 'es', 'fr', 'de', 'zh', 'ja', 'ko', 'ar', 'hi'],
        translationEngine: 'deepl',
        culturalLinguistics: true,
        readabilityAnalysis: true,
        emotionalIntelligence: true
      },
      holistica: {
        traditions: ['ayurvedic', 'tcm', 'native_american', 'african', 'middle_eastern'],
        evidenceLevel: 'moderate_plus',
        culturalValidation: true,
        safetyProtocols: true,
        practitionerNetwork: ['ayurvedic_practitioners', 'tcm_doctors', 'native_healers']
      }
    });

    spinner.succeed('Lilith.Eve core system initialized successfully');
    return lilithEve;
    
  } catch (error) {
    spinner.fail('Failed to initialize Lilith.Eve core system');
    logger.error('Core system initialization error:', error);
    throw error;
  }
};

/**
 * 🌐 Initialize Express Application
 */
const initializeApp = async (lilithEve: LilithEve): Promise<express.Application> => {
  const spinner = ora('Initializing Express application...').start();
  
  try {
    const app = express();
    
    // Security middleware
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));
    
    // Configure CORS with environment variables
    app.use(cors({
      origin: process.env['ALLOWED_ORIGINS']?.split(',') || ['http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: process.env['RATE_LIMIT_WINDOW_MS'] ? 
        parseInt(process.env['RATE_LIMIT_WINDOW_MS'], 10) : 900000, // 15 minutes default
      max: process.env['RATE_LIMIT_REQUESTS_PER_MINUTE'] ?
        parseInt(process.env['RATE_LIMIT_REQUESTS_PER_MINUTE'], 10) : 100,
      standardHeaders: true,
      legacyHeaders: false
    });
    app.use(limiter);
    
    // Body parsing
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      });
      next();
    });
    
    // Health check endpoint
    app.get('/health', (_req, res) => {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: process.env['npm_package_version'] || '1.0.0',
        environment: NODE_ENV,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        database: 'connected', // TODO: Add actual database connection check
        redis: 'connected'    // TODO: Add actual Redis connection check
      });
    });

    // Invocation endpoint
    app.get('/invoke', (_req, res) => {
      res.status(200).json({
        message: 'Lilith.Eve is ready to receive your divine requests',
        timestamp: new Date().toISOString(),
        version: process.env['npm_package_version'] || '1.0.0',
        environment: NODE_ENV
      });
    });

    // Setup API routes
    setupRoutes(app, lilithEve);
    
    // Error handling middleware
    app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      logger.error('Unhandled error:', { error: err.message, stack: err.stack });
      
      res.status(500).json({
        error: 'Internal Server Error',
        message: process.env['NODE_ENV'] === 'development' ? err.message : 'Something went wrong',
        ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
      });
    });

    // 404 handler
    app.use('*', (req: express.Request, res: express.Response) => {
      res.status(404).json({
        error: 'Not Found',
        message: 'The requested resource was not found',
        path: req.originalUrl
      });
    });
    
    spinner.succeed('Express application initialized successfully');
    return app;
    
  } catch (error) {
    spinner.fail('Failed to initialize Express application');
    logger.error('Express initialization error:', error);
    throw error;
  }
};

/**
 * 🗄️ Initialize Database Connections
 */
const initializeServices = async (): Promise<void> => {
  const spinner = ora('Initializing services...').start();
  
  try {
    // Initialize database
    await initializeDatabase();
    
    // Initialize Redis
    await initializeRedis();
    
    // Setup monitoring
    await setupMonitoring();
    
    spinner.succeed('All services initialized successfully');
    
  } catch (error) {
    spinner.fail('Failed to initialize services');
    logger.error('Service initialization error:', error);
    throw error;
  }
};

/**
 * 🚀 Start the Server
 */
const startServer = async (): Promise<void> => {
  try {
    // Display startup message
    displayStartupMessage();
    
    // Initialize services
    await initializeServices();
    
    // Initialize Lilith.Eve core
    const lilithEve = await initializeLilithEve();
    
    // Initialize Express app
    const app = await initializeApp(lilithEve);
    
    // Create HTTP server
    const server = createServer(app);
    
    // Start server
    server.listen(PORT, () => {
      logger.info(`🌟 Lilith.Eve is now listening on port ${PORT}`);
      logger.info(`🌐 Environment: ${NODE_ENV}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      logger.info(`🧬 Invocation: http://localhost:${PORT}/invoke`);
      
      if (NODE_ENV === 'development') {
        logger.info(`📚 API Documentation: http://localhost:${PORT}/docs`);
        logger.info(`📊 Monitoring: http://localhost:3001`);
      }
    });
    
    // Graceful shutdown
    const gracefulShutdown = (signal: string): void => {
      logger.info(`\n🛑 Received ${signal}. Starting graceful shutdown...`);
      
      server.close(() => {
        logger.info('🌙 Lilith.Eve has gracefully shut down. May healing wisdom continue to flow.');
        process.exit(0);
      });
      
      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };
    
    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      gracefulShutdown('unhandledRejection');
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

/**
 * 🧪 Development Mode Enhancements
 */
if (NODE_ENV === 'development') {
  // Enable detailed logging in development
  process.env['LOG_LEVEL'] = 'debug';
  
  // Enable development tools
  process.env['ENABLE_SWAGGER'] = 'true';
  process.env['ENABLE_GRAPHIQL'] = 'true';
  
  // Development-specific middleware
  app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
    logger.debug(`${req.method} ${req.originalUrl}`, {
      headers: req.headers,
      query: req.query,
      body: req.body
    });
    next();
  });
}

// Start the divine healing system
startServer().catch((error) => {
  logger.error('Failed to start Lilith.Eve:', error);
  process.exit(1);
});

export default startServer;