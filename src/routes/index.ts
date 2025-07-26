import { Router } from 'express';
import { authenticate } from '../middleware/security';
import { logEvent } from '../services/monitoring';
import { LilithEve } from '../core/LilithEve';

/**
 * Setup all routes for the application
 * @param app Express application
 * @param lilithEve LilithEve instance
 */
export const setupRoutes = (app: any, lilithEve: LilithEve): void => {
  const router = Router();
  
  // Health check route (no auth required)
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env['npm_package_version'] || '1.0.0',
      environment: process.env['NODE_ENV'] || 'development'
    });
  });
  
  // API routes (versioned)
  const apiRouter = Router();
  
  // Auth routes
  apiRouter.post('/auth/login', async (req, res) => {
    try {
      // TODO: Implement actual authentication
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
      }
      
      // Log authentication attempt
      await logEvent('auth_attempt', { username, ip: req.ip });
      
      // Mock successful login
      const token = 'mock-jwt-token';
      
      res.status(200).json({ token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Protected routes (require authentication)
  const protectedRouter = Router();
  
  // Apply authentication middleware to all protected routes
  protectedRouter.use(authenticate);
  
  // Example protected route
  protectedRouter.get('/profile', (req, res) => {
    res.status(200).json({
      userId: '123',
      username: 'testuser',
      email: 'user@example.com'
    });
  });
  
  // Mount protected routes under /api
  apiRouter.use('/me', protectedRouter);
  
  // Mount API routes under /api/v1
  router.use('/api/v1', apiRouter);
  
  // Mount the router to the app
  app.use(router);
  
  // 404 handler for API routes
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `The requested resource ${req.originalUrl} was not found`,
      timestamp: new Date().toISOString()
    });
  });
  
  // Error handling middleware
  app.use((err: any, req: any, res: any, next: any) => {
    console.error('Unhandled error:', err);
    
    // Log the error
    logEvent('server_error', {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    }, 'error');
    
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env['NODE_ENV'] === 'development' ? err.message : 'Something went wrong',
      ...(process.env['NODE_ENV'] === 'development' && { stack: err.stack })
    });
  });
};

// Export route handlers
export * from './auth.routes';
export * from './user.routes';
export * from './analysis.routes';
export * from './monitoring.routes';
