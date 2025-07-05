/**
 * @fileoverview Analysis Routes - Lilith.Eve Medical AI Oracle
 * 
 * This file defines all analysis-related API endpoints including AI analysis
 * requests, results management, and analysis history.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  analysisRequestSchema, 
  paginationSchema, 
  uuidParamSchema,
  dateRangeSchema 
} from '../middleware/validation.middleware';
import { 
  requireRole, 
  requirePermission 
} from '../middleware/auth.middleware';
import { UserRole, Permission } from '../../types/auth.types';
import { auditTrail, performanceMonitor } from '../middleware/logging.middleware';

const router = Router();
const analysisController = new AnalysisController();

/**
 * @route   POST /api/analysis/request
 * @desc    Request a new AI analysis for a patient
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.post(
  '/request',
  requirePermission([Permission.ANALYSIS_CREATE]),
  validateRequest(analysisRequestSchema),
  performanceMonitor(5000),
  auditTrail('create', 'analysis_request'),
  analysisController.requestAnalysis
);

/**
 * @route   GET /api/analysis/:id
 * @desc    Get analysis result by ID
 * @access  Private (Doctors, Nurses, Researchers, Analysts)
 */
router.get(
  '/:id',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'analysis'),
  analysisController.getAnalysisById
);

/**
 * @route   GET /api/analysis
 * @desc    Get all analyses with pagination and filtering
 * @access  Private (Doctors, Nurses, Researchers, Analysts)
 */
router.get(
  '/',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'analyses'),
  analysisController.getAllAnalyses
);

/**
 * @route   GET /api/analysis/patient/:patientId
 * @desc    Get all analyses for a specific patient
 * @access  Private (Doctors, Nurses, Researchers, Analysts)
 */
router.get(
  '/patient/:patientId',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'patient_analyses'),
  analysisController.getAnalysesByPatient
);

/**
 * @route   GET /api/analysis/status/:id
 * @desc    Get analysis processing status
 * @access  Private (Doctors, Nurses, Researchers, Analysts)
 */
router.get(
  '/status/:id',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(200),
  auditTrail('read', 'analysis_status'),
  analysisController.getAnalysisStatus
);

/**
 * @route   POST /api/analysis/:id/cancel
 * @desc    Cancel a running analysis
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.post(
  '/:id/cancel',
  requirePermission([Permission.ANALYSIS_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'analysis_cancellation'),
  analysisController.cancelAnalysis
);

/**
 * @route   POST /api/analysis/:id/retry
 * @desc    Retry a failed analysis
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.post(
  '/:id/retry',
  requirePermission([Permission.ANALYSIS_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(2000),
  auditTrail('create', 'analysis_retry'),
  analysisController.retryAnalysis
);

/**
 * @route   DELETE /api/analysis/:id
 * @desc    Delete analysis result
 * @access  Private (Admins, Researchers)
 */
router.delete(
  '/:id',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('delete', 'analysis'),
  analysisController.deleteAnalysis
);

/**
 * @route   GET /api/analysis/:id/cognition
 * @desc    Get Cognition.AI analysis results
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/:id/cognition',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'cognition_analysis'),
  analysisController.getCognitionResults
);

/**
 * @route   GET /api/analysis/:id/biosync
 * @desc    Get BioSync.Reader analysis results
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/:id/biosync',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'biosync_analysis'),
  analysisController.getBioSyncResults
);

/**
 * @route   GET /api/analysis/:id/persona
 * @desc    Get Persona.Scanner analysis results
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/:id/persona',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'persona_analysis'),
  analysisController.getPersonaResults
);

/**
 * @route   GET /api/analysis/:id/social
 * @desc    Get SocialSynth analysis results
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/:id/social',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'social_analysis'),
  analysisController.getSocialResults
);

/**
 * @route   GET /api/analysis/:id/lingua
 * @desc    Get LinguaCare analysis results
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/:id/lingua',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'lingua_analysis'),
  analysisController.getLinguaResults
);

/**
 * @route   GET /api/analysis/:id/holistica
 * @desc    Get Holistica analysis results
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/:id/holistica',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'holistica_analysis'),
  analysisController.getHolisticaResults
);

/**
 * @route   GET /api/analysis/:id/synthesis
 * @desc    Get complete analysis synthesis
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/:id/synthesis',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('read', 'analysis_synthesis'),
  analysisController.getAnalysisSynthesis
);

/**
 * @route   GET /api/analysis/:id/treatment-plan
 * @desc    Get generated treatment plan from analysis
 * @access  Private (Doctors, Nurses)
 */
router.get(
  '/:id/treatment-plan',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('read', 'treatment_plan'),
  analysisController.getTreatmentPlan
);

/**
 * @route   POST /api/analysis/:id/feedback
 * @desc    Provide feedback on analysis results
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.post(
  '/:id/feedback',
  requirePermission([Permission.ANALYSIS_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'analysis_feedback'),
  analysisController.provideFeedback
);

/**
 * @route   GET /api/analysis/queue/status
 * @desc    Get analysis queue status
 * @access  Private (Admins, Researchers, Analysts)
 */
router.get(
  '/queue/status',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER, UserRole.ANALYST]),
  performanceMonitor(200),
  auditTrail('read', 'analysis_queue'),
  analysisController.getQueueStatus
);

/**
 * @route   GET /api/analysis/queue/pending
 * @desc    Get pending analyses in queue
 * @access  Private (Admins, Researchers, Analysts)
 */
router.get(
  '/queue/pending',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER, UserRole.ANALYST]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'pending_analyses'),
  analysisController.getPendingAnalyses
);

/**
 * @route   GET /api/analysis/queue/failed
 * @desc    Get failed analyses
 * @access  Private (Admins, Researchers, Analysts)
 */
router.get(
  '/queue/failed',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER, UserRole.ANALYST]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'failed_analyses'),
  analysisController.getFailedAnalyses
);

/**
 * @route   GET /api/analysis/stats/daily
 * @desc    Get daily analysis statistics
 * @access  Private (Admins, Researchers, Analysts)
 */
router.get(
  '/stats/daily',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER, UserRole.ANALYST]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'daily_stats'),
  analysisController.getDailyStats
);

/**
 * @route   GET /api/analysis/stats/modules
 * @desc    Get analysis statistics by module
 * @access  Private (Admins, Researchers, Analysts)
 */
router.get(
  '/stats/modules',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER, UserRole.ANALYST]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'module_stats'),
  analysisController.getModuleStats
);

/**
 * @route   GET /api/analysis/stats/performance
 * @desc    Get analysis performance metrics
 * @access  Private (Admins, Researchers, Analysts)
 */
router.get(
  '/stats/performance',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER, UserRole.ANALYST]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'performance_stats'),
  analysisController.getPerformanceStats
);

/**
 * @route   GET /api/analysis/export/:id
 * @desc    Export analysis results (PDF/CSV)
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/export/:id',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(3000),
  auditTrail('export', 'analysis_results'),
  analysisController.exportAnalysis
);

/**
 * @route   GET /api/analysis/search
 * @desc    Search analyses by various criteria
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/search',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('search', 'analyses'),
  analysisController.searchAnalyses
);

/**
 * @route   POST /api/analysis/batch
 * @desc    Request batch analysis for multiple patients
 * @access  Private (Researchers, Analysts)
 */
router.post(
  '/batch',
  requireRole([UserRole.RESEARCHER, UserRole.ANALYST, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(10000),
  auditTrail('create', 'batch_analysis'),
  analysisController.requestBatchAnalysis
);

/**
 * @route   GET /api/analysis/batch/:batchId
 * @desc    Get batch analysis status and results
 * @access  Private (Researchers, Analysts)
 */
router.get(
  '/batch/:batchId',
  requireRole([UserRole.RESEARCHER, UserRole.ANALYST, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  performanceMonitor(1000),
  auditTrail('read', 'batch_analysis'),
  analysisController.getBatchAnalysis
);

/**
 * @route   POST /api/analysis/:id/validate
 * @desc    Validate analysis results against medical guidelines
 * @access  Private (Doctors, Researchers)
 */
router.post(
  '/:id/validate',
  requirePermission([Permission.ANALYSIS_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(2000),
  auditTrail('update', 'analysis_validation'),
  analysisController.validateAnalysis
);

/**
 * @route   GET /api/analysis/:id/audit-trail
 * @desc    Get analysis audit trail
 * @access  Private (Admins, Researchers)
 */
router.get(
  '/:id/audit-trail',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'analysis_audit'),
  analysisController.getAuditTrail
);

export default router; 