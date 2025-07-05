/**
 * @fileoverview Patient Routes - Lilith.Eve Medical AI Oracle
 * 
 * This file defines all patient-related API endpoints including CRUD operations,
 * medical data management, and analysis requests.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Router } from 'express';
import { PatientController } from '../controllers/patient.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { 
  patientCreateSchema, 
  patientUpdateSchema, 
  paginationSchema, 
  uuidParamSchema,
  medicalDataSchema 
} from '../middleware/validation.middleware';
import { 
  requireRole, 
  requirePermission, 
  requireOrganizationAccess 
} from '../middleware/auth.middleware';
import { UserRole, Permission } from '../../types/auth.types';
import { auditTrail, performanceMonitor } from '../middleware/logging.middleware';

const router = Router();
const patientController = new PatientController();

/**
 * @route   GET /api/patients
 * @desc    Get all patients with pagination and filtering
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/',
  requirePermission([Permission.PATIENT_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('read', 'patients'),
  patientController.getAllPatients
);

/**
 * @route   GET /api/patients/:id
 * @desc    Get patient by ID
 * @access  Private (Doctors, Nurses, Admins, Patients - own data only)
 */
router.get(
  '/:id',
  requirePermission([Permission.PATIENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'patient'),
  patientController.getPatientById
);

/**
 * @route   POST /api/patients
 * @desc    Create new patient
 * @access  Private (Doctors, Admins)
 */
router.post(
  '/',
  requirePermission([Permission.PATIENT_CREATE]),
  validateRequest(patientCreateSchema),
  performanceMonitor(2000),
  auditTrail('create', 'patient'),
  patientController.createPatient
);

/**
 * @route   PUT /api/patients/:id
 * @desc    Update patient information
 * @access  Private (Doctors, Nurses, Admins)
 */
router.put(
  '/:id',
  requirePermission([Permission.PATIENT_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(patientUpdateSchema),
  performanceMonitor(1500),
  auditTrail('update', 'patient'),
  patientController.updatePatient
);

/**
 * @route   DELETE /api/patients/:id
 * @desc    Delete patient (soft delete)
 * @access  Private (Admins only)
 */
router.delete(
  '/:id',
  requireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('delete', 'patient'),
  patientController.deletePatient
);

/**
 * @route   GET /api/patients/:id/medical-history
 * @desc    Get patient's complete medical history
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/medical-history',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('read', 'medical_history'),
  patientController.getMedicalHistory
);

/**
 * @route   POST /api/patients/:id/medical-data
 * @desc    Add medical data to patient record
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/medical-data',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(medicalDataSchema),
  performanceMonitor(1500),
  auditTrail('create', 'medical_data'),
  patientController.addMedicalData
);

/**
 * @route   GET /api/patients/:id/vital-signs
 * @desc    Get patient's vital signs history
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/vital-signs',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'vital_signs'),
  patientController.getVitalSigns
);

/**
 * @route   POST /api/patients/:id/vital-signs
 * @desc    Add vital signs to patient record
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/vital-signs',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'vital_signs'),
  patientController.addVitalSigns
);

/**
 * @route   GET /api/patients/:id/lab-results
 * @desc    Get patient's lab results
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/lab-results',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'lab_results'),
  patientController.getLabResults
);

/**
 * @route   POST /api/patients/:id/lab-results
 * @desc    Add lab results to patient record
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/lab-results',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'lab_results'),
  patientController.addLabResults
);

/**
 * @route   GET /api/patients/:id/medications
 * @desc    Get patient's current medications
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/medications',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'medications'),
  patientController.getMedications
);

/**
 * @route   POST /api/patients/:id/medications
 * @desc    Add medication to patient record
 * @access  Private (Doctors)
 */
router.post(
  '/:id/medications',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'medication'),
  patientController.addMedication
);

/**
 * @route   PUT /api/patients/:id/medications/:medicationId
 * @desc    Update patient medication
 * @access  Private (Doctors)
 */
router.put(
  '/:id/medications/:medicationId',
  requirePermission([Permission.MEDICAL_DATA_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'medication'),
  patientController.updateMedication
);

/**
 * @route   DELETE /api/patients/:id/medications/:medicationId
 * @desc    Discontinue patient medication
 * @access  Private (Doctors)
 */
router.delete(
  '/:id/medications/:medicationId',
  requirePermission([Permission.MEDICAL_DATA_UPDATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('update', 'medication_discontinuation'),
  patientController.discontinueMedication
);

/**
 * @route   GET /api/patients/:id/conditions
 * @desc    Get patient's medical conditions
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/conditions',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'conditions'),
  patientController.getConditions
);

/**
 * @route   POST /api/patients/:id/conditions
 * @desc    Add medical condition to patient record
 * @access  Private (Doctors)
 */
router.post(
  '/:id/conditions',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'condition'),
  patientController.addCondition
);

/**
 * @route   GET /api/patients/:id/allergies
 * @desc    Get patient's allergies
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/allergies',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'allergies'),
  patientController.getAllergies
);

/**
 * @route   POST /api/patients/:id/allergies
 * @desc    Add allergy to patient record
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/allergies',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'allergy'),
  patientController.addAllergy
);

/**
 * @route   GET /api/patients/:id/lifestyle
 * @desc    Get patient's lifestyle information
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/lifestyle',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'lifestyle'),
  patientController.getLifestyle
);

/**
 * @route   POST /api/patients/:id/lifestyle
 * @desc    Add or update patient's lifestyle information
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/lifestyle',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'lifestyle'),
  patientController.addLifestyle
);

/**
 * @route   GET /api/patients/:id/family-history
 * @desc    Get patient's family medical history
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/family-history',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'family_history'),
  patientController.getFamilyHistory
);

/**
 * @route   POST /api/patients/:id/family-history
 * @desc    Add family history to patient record
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/family-history',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'family_history'),
  patientController.addFamilyHistory
);

/**
 * @route   GET /api/patients/:id/social-determinants
 * @desc    Get patient's social determinants of health
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/social-determinants',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'social_determinants'),
  patientController.getSocialDeterminants
);

/**
 * @route   POST /api/patients/:id/social-determinants
 * @desc    Add social determinants to patient record
 * @access  Private (Doctors, Nurses, Social Workers)
 */
router.post(
  '/:id/social-determinants',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'social_determinants'),
  patientController.addSocialDeterminants
);

/**
 * @route   GET /api/patients/:id/cultural-context
 * @desc    Get patient's cultural context and preferences
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/cultural-context',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'cultural_context'),
  patientController.getCulturalContext
);

/**
 * @route   POST /api/patients/:id/cultural-context
 * @desc    Add cultural context to patient record
 * @access  Private (Doctors, Nurses, Cultural Liaisons)
 */
router.post(
  '/:id/cultural-context',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'cultural_context'),
  patientController.addCulturalContext
);

/**
 * @route   GET /api/patients/:id/consent
 * @desc    Get patient's consent records
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/consent',
  requirePermission([Permission.MEDICAL_DATA_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(500),
  auditTrail('read', 'consent'),
  patientController.getConsentRecords
);

/**
 * @route   POST /api/patients/:id/consent
 * @desc    Add consent record for patient
 * @access  Private (Doctors, Nurses)
 */
router.post(
  '/:id/consent',
  requirePermission([Permission.MEDICAL_DATA_CREATE]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(1000),
  auditTrail('create', 'consent'),
  patientController.addConsentRecord
);

/**
 * @route   GET /api/patients/:id/analyses
 * @desc    Get patient's analysis history
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/analyses',
  requirePermission([Permission.ANALYSIS_READ]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'analyses'),
  patientController.getAnalysisHistory
);

/**
 * @route   GET /api/patients/:id/treatments
 * @desc    Get patient's treatment history
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/:id/treatments',
  requirePermission([Permission.TREATMENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(500),
  auditTrail('read', 'treatments'),
  patientController.getTreatmentHistory
);

/**
 * @route   GET /api/patients/search
 * @desc    Search patients by various criteria
 * @access  Private (Doctors, Nurses, Admins)
 */
router.get(
  '/search',
  requirePermission([Permission.PATIENT_READ]),
  validateRequest(paginationSchema, 'query'),
  performanceMonitor(1000),
  auditTrail('search', 'patients'),
  patientController.searchPatients
);

/**
 * @route   GET /api/patients/export/:id
 * @desc    Export patient data (PDF/CSV)
 * @access  Private (Doctors, Admins)
 */
router.get(
  '/export/:id',
  requirePermission([Permission.PATIENT_READ]),
  validateRequest(uuidParamSchema, 'params'),
  performanceMonitor(3000),
  auditTrail('export', 'patient_data'),
  patientController.exportPatientData
);

export default router; 