import { Router } from 'express';
import { authenticate } from '../middleware/security';
import { logEvent } from '../services/monitoring';
import { LilithEve } from '../core/LilithEve';

const router = Router();

// Apply authentication middleware to all analysis routes
router.use(authenticate);

/**
 * @route POST /analysis/process
 * @desc Process patient data and generate analysis
 * @access Private
 */
router.post('/process', async (req, res) => {
  try {
    const { patientData } = req.body;
    const lilithEve: LilithEve = req.app.get('lilithEve');
    
    // Input validation
    if (!patientData) {
      return res.status(400).json({
        success: false,
        error: 'Patient data is required'
      });
    }
    
    // Log analysis request
    await logEvent('analysis_requested', { 
      userId: req.user.id,
      patientId: patientData.id || 'unknown'
    });
    
    // Process the analysis using LilithEve
    const analysis = await lilithEve.analyzePatientData(patientData);
    
    res.status(200).json({
      success: true,
      data: analysis
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process analysis'
    });
  }
});

/**
 * @route GET /analysis/history
 * @desc Get analysis history for a patient
 * @access Private
 */
router.get('/history', async (req, res) => {
  try {
    const { patientId } = req.query;
    
    // Input validation
    if (!patientId) {
      return res.status(400).json({
        success: false,
        error: 'Patient ID is required'
      });
    }
    
    // TODO: Implement actual history retrieval
    // This is a placeholder for demonstration
    const history = [
      {
        id: 'analysis-123',
        patientId,
        type: 'full_analysis',
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    res.status(200).json({
      success: true,
      data: history
    });
    
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analysis history'
    });
  }
});

export default router;
