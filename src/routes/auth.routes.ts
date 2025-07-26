import { Router } from 'express';
import { authenticate } from '../middleware/security';
import { logEvent } from '../services/monitoring';

const router = Router();

/**
 * @route POST /auth/login
 * @desc Authenticate user and get JWT token
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Log authentication attempt
    await logEvent('auth_attempt', { email, ip: req.ip });

    // TODO: Implement actual authentication logic
    // This is a placeholder for demonstration
    const user = {
      id: '123',
      email,
      role: 'user',
      name: 'Test User'
    };

    // Generate JWT token
    const token = 'mock-jwt-token';

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route GET /auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticate, (req, res) => {
  // req.user is set by the authenticate middleware
  res.status(200).json({
    success: true,
    user: req.user
  });
});

export default router;
