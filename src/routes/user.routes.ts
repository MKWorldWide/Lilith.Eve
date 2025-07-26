import { Router } from 'express';
import { authenticate } from '../middleware/security';
import { logEvent } from '../services/monitoring';

const router = Router();

// Apply authentication middleware to all user routes
router.use(authenticate);

/**
 * @route GET /users/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', async (req, res) => {
  try {
    // req.user is set by the authenticate middleware
    const user = req.user;
    
    // Log profile view
    await logEvent('profile_view', { userId: user.id });
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        // Add other non-sensitive user data here
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile'
    });
  }
});

/**
 * @route PUT /users/me
 * @desc Update current user profile
 * @access Private
 */
router.put('/me', async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    
    // Input validation
    if (!name && !email) {
      return res.status(400).json({
        success: false,
        error: 'At least one field (name, email) is required for update'
      });
    }
    
    // Log profile update
    await logEvent('profile_update', { 
      userId,
      updates: { name, email }
    });
    
    // TODO: Implement actual update logic
    const updatedUser = {
      id: userId,
      name: name || req.user.name,
      email: email || req.user.email,
      role: req.user.role
    };
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user profile'
    });
  }
});

export default router;
