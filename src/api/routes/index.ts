/**
 * @fileoverview Main API Router - Lilith.Eve Medical AI Oracle
 * 
 * This file serves as the central routing hub for all Lilith.Eve API endpoints.
 * It organizes routes by functional domain and applies appropriate middleware
 * for authentication, validation, and monitoring.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';

// Import route modules
import patientRoutes from './patient.routes';
import analysisRoutes from './analysis.routes';
import treatmentRoutes from './treatment.routes';
import authRoutes from './auth.routes';
import healthRoutes from './health.routes';
import adminRoutes from './admin.routes';
import monitoringRoutes from './monitoring.routes';

// Import middleware
import { authenticateToken } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { logRequest } from '../middleware/logging.middleware';
import { errorHandler } from '../middleware/error.middleware';

const router = Router();

// Security middleware
router.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
router.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Compression middleware
router.use(compression());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: '15 minutes'
  },
});

// Apply rate limiting
router.use('/api/', apiLimiter);
router.use('/api/auth', authLimiter);

// Request logging middleware
router.use(logRequest);

// Health check routes (no authentication required)
router.use('/health', healthRoutes);

// Authentication routes (no authentication required)
router.use('/api/auth', authRoutes);

// Protected routes (authentication required)
router.use('/api/patients', authenticateToken, patientRoutes);
router.use('/api/analysis', authenticateToken, analysisRoutes);
router.use('/api/treatments', authenticateToken, treatmentRoutes);
router.use('/api/admin', authenticateToken, adminRoutes);
router.use('/api/monitoring', authenticateToken, monitoringRoutes);

// API documentation route
router.get('/api/docs', (req, res) => {
  res.json({
    message: 'Lilith.Eve Medical AI Oracle API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      patients: '/api/patients',
      analysis: '/api/analysis',
      treatments: '/api/treatments',
      admin: '/api/admin',
      monitoring: '/api/monitoring'
    },
    documentation: '/docs/api',
    status: 'operational'
  });
});

// 404 handler for undefined routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`,
    availableEndpoints: [
      '/health',
      '/api/auth',
      '/api/patients',
      '/api/analysis',
      '/api/treatments',
      '/api/admin',
      '/api/monitoring'
    ]
  });
});

// Error handling middleware (must be last)
router.use(errorHandler);

export default router; 
