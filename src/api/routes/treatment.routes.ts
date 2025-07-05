/**
 * @fileoverview Treatment Routes - Lilith.Eve Medical AI Oracle
 * 
 * This file defines all treatment-related API endpoints including treatment
 * plan management, recommendations, and progress tracking.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import { TreatmentController } from '../controllers/treatment.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  treatmentPlanSchema, 
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
const treatmentController = new TreatmentController();

/**
 * @route   POST /api/treatments
 * @desc    Create a new treatment plan
 * @access  Private (Doctors)
 */
router.post(
  '/',
  requirePermission([Permission.TREATMENT_CREATE]),
  validateRequest(treatmentPlanSchema),
  performanceMonitor(3000),
  auditTrail('create', 'treatment_plan'),
  treatmentController.createTreatmentPlan
);

/**
 * @route   GET /api/treatments/:id
 * @desc    Get treatment plan by ID
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'treatment_plan'),
  treatmentController.getTreatmentPlanById
);

/**
 * @route   GET /api/treatments
 * @desc    Get all treatment plans with pagination and filtering
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'treatment_plans'),
  treatmentController.getAllTreatmentPlans
);

/**
 * @route   PUT /api/treatments/:id
 * @desc    Update treatment plan
 * @access  Private (Doctors)
 */
router.put(
  '/:id',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(2000),
  auditTrail('update', 'treatment_plan'),
  treatmentController.updateTreatmentPlan
);

/**
 * @route   DELETE /api/treatments/:id
 * @desc    Delete treatment plan (soft delete)
 * @access  Private (Doctors, Admins)
 */
router.delete(
  '/:id',
  requireRole([UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('delete', 'treatment_plan'),
  treatmentController.deleteTreatmentPlan
);

/**
 * @route   GET /api/treatments/patient/:patientId
 * @desc    Get all treatment plans for a specific patient
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/patient/:patientId',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'patient_treatments'),
  treatmentController.getTreatmentPlansByPatient
);

/**
 * @route   POST /api/treatments/:id/approve
 * @desc    Approve treatment plan
 * @access  Private (Doctors, Admins)
 */
router.post(
  '/:id/approve',
  requirePermission([Permission.TREATMENT_APPROVE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_approval'),
  treatmentController.approveTreatmentPlan
);

/**
 * @route   POST /api/treatments/:id/reject
 * @desc    Reject treatment plan
 * @access  Private (Doctors, Admins)
 */
router.post(
  '/:id/reject',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_rejection'),
  treatmentController.rejectTreatmentPlan
);

/**
 * @route   POST /api/treatments/:id/start
 * @desc    Start treatment plan execution
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/start',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_start'),
  treatmentController.startTreatment
);

/**
 * @route   POST /api/treatments/:id/pause
 * @desc    Pause treatment plan execution
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/pause',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_pause'),
  treatmentController.pauseTreatment
);

/**
 * @route   POST /api/treatments/:id/resume
 * @desc    Resume treatment plan execution
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/resume',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_resume'),
  treatmentController.resumeTreatment
);

/**
 * @route   POST /api/treatments/:id/complete
 * @desc    Complete treatment plan
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/complete',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_completion'),
  treatmentController.completeTreatment
);

/**
 * @route   GET /api/treatments/:id/progress
 * @desc    Get treatment progress and milestones
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/progress',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'treatment_progress'),
  treatmentController.getTreatmentProgress
);

/**
 * @route   POST /api/treatments/:id/progress
 * @desc    Update treatment progress
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/progress',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_progress'),
  treatmentController.updateTreatmentProgress
);

/**
 * @route   GET /api/treatments/:id/recommendations
 * @desc    Get treatment recommendations
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/recommendations',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'treatment_recommendations'),
  treatmentController.getTreatmentRecommendations
);

/**
 * @route   POST /api/treatments/:id/recommendations
 * @desc    Add treatment recommendation
 * @access  Private (Doctors)
 */
router.post(
  '/:id/recommendations',
  requirePermission([Permission.TREATMENT_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'treatment_recommendation'),
  treatmentController.addTreatmentRecommendation
);

/**
 * @route   PUT /api/treatments/:id/recommendations/:recommendationId
 * @desc    Update treatment recommendation
 * @access  Private (Doctors)
 */
router.put(
  '/:id/recommendations/:recommendationId',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_recommendation'),
  treatmentController.updateTreatmentRecommendation
);

/**
 * @route   DELETE /api/treatments/:id/recommendations/:recommendationId
 * @desc    Remove treatment recommendation
 * @access  Private (Doctors)
 */
router.delete(
  '/:id/recommendations/:recommendationId',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('delete', 'treatment_recommendation'),
  treatmentController.removeTreatmentRecommendation
);

/**
 * @route   GET /api/treatments/:id/holistic-approach
 * @desc    Get holistic treatment approach
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/holistic-approach',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'holistic_approach'),
  treatmentController.getHolisticApproach
);

/**
 * @route   POST /api/treatments/:id/holistic-approach
 * @desc    Add holistic treatment approach
 * @access  Private (Doctors)
 */
router.post(
  '/:id/holistic-approach',
  requirePermission([Permission.TREATMENT_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'holistic_approach'),
  treatmentController.addHolisticApproach
);

/**
 * @route   GET /api/treatments/:id/risk-assessment
 * @desc    Get treatment risk assessment
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/risk-assessment',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'risk_assessment'),
  treatmentController.getRiskAssessment
);

/**
 * @route   POST /api/treatments/:id/risk-assessment
 * @desc    Update treatment risk assessment
 * @access  Private (Doctors)
 */
router.post(
  '/:id/risk-assessment',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'risk_assessment'),
  treatmentController.updateRiskAssessment
);

/**
 * @route   GET /api/treatments/:id/cultural-considerations
 * @desc    Get cultural considerations for treatment
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/cultural-considerations',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'cultural_considerations'),
  treatmentController.getCulturalConsiderations
);

/**
 * @route   POST /api/treatments/:id/cultural-considerations
 * @desc    Add cultural considerations to treatment
 * @access  Private (Doctors, Cultural Liaisons)
 */
router.post(
  '/:id/cultural-considerations',
  requirePermission([Permission.TREATMENT_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'cultural_considerations'),
  treatmentController.addCulturalConsiderations
);

/**
 * @route   GET /api/treatments/:id/follow-up
 * @desc    Get treatment follow-up schedule
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/follow-up',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'follow_up_schedule'),
  treatmentController.getFollowUpSchedule
);

/**
 * @route   POST /api/treatments/:id/follow-up
 * @desc    Schedule treatment follow-up
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/follow-up',
  requirePermission([Permission.TREATMENT_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'follow_up_schedule'),
  treatmentController.scheduleFollowUp
);

/**
 * @route   GET /api/treatments/:id/outcomes
 * @desc    Get treatment outcomes and results
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/outcomes',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'treatment_outcomes'),
  treatmentController.getTreatmentOutcomes
);

/**
 * @route   POST /api/treatments/:id/outcomes
 * @desc    Record treatment outcomes
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/outcomes',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'treatment_outcomes'),
  treatmentController.recordTreatmentOutcomes
);

/**
 * @route   GET /api/treatments/stats/effectiveness
 * @desc    Get treatment effectiveness statistics
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/stats/effectiveness',
  requireRole([UserRole.DOCTOR, UserRole.RESEARCHER, UserRole.ANALYST, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'effectiveness_stats'),
  treatmentController.getEffectivenessStats
);

/**
 * @route   GET /api/treatments/stats/compliance
 * @desc    Get treatment compliance statistics
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/stats/compliance',
  requireRole([UserRole.DOCTOR, UserRole.NURSE, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'compliance_stats'),
  treatmentController.getComplianceStats
);

/**
 * @route   GET /api/treatments/stats/outcomes
 * @desc    Get treatment outcomes statistics
 * @access  Private (Doctors, Researchers, Analysts)
 */
router.get(
  '/stats/outcomes',
  requireRole([UserRole.DOCTOR, UserRole.RESEARCHER, UserRole.ANALYST, UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(dateRangeSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'outcomes_stats'),
  treatmentController.getOutcomesStats
);

/**
 * @route   GET /api/treatments/search
 * @desc    Search treatment plans by various criteria
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/search',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('search', 'treatment_plans'),
  treatmentController.searchTreatmentPlans
);

/**
 * @route   GET /api/treatments/export/:id
 * @desc    Export treatment plan (PDF/CSV)
 * @access  Private (Doctors, Admins)
 */
router.get(
  '/export/:id',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(3000),
  auditTrail('export', 'treatment_plan'),
  treatmentController.exportTreatmentPlan
);

/**
 * @route   POST /api/treatments/:id/validate
 * @desc    Validate treatment plan against guidelines
 * @access  Private (Doctors, Researchers)
 */
router.post(
  '/:id/validate',
  requirePermission([Permission.TREATMENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(2000),
  auditTrail('update', 'treatment_validation'),
  treatmentController.validateTreatmentPlan
);

/**
 * @route   GET /api/treatments/:id/audit-trail
 * @desc    Get treatment plan audit trail
 * @access  Private (Admins, Researchers)
 */
router.get(
  '/:id/audit-trail',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.RESEARCHER]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'treatment_audit'),
  treatmentController.getAuditTrail
);

export default router; 