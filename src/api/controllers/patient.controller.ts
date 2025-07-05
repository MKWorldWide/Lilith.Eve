/**
 * @fileoverview Patient Controller - Lilith.Eve Medical AI Oracle
 * 
 * This controller handles all patient-related business logic including CRUD
 * operations, medical data management, and patient analysis requests.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response } from 'express';
import { PatientService } from '../../services/patient.service';
import { AnalysisService } from '../../services/analysis.service';
import { TreatmentService } from '../../services/treatment.service';
import { logger, logUtils } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';
import { 
  Patient, 
  PatientCreateRequest, 
  PatientUpdateRequest,
  MedicalData,
  VitalSigns,
  LabResults,
  Medication,
  Condition,
  Allergy,
  Lifestyle,
  FamilyHistory,
  SocialDeterminants,
  CulturalContext,
  ConsentRecord
} from '../../types/patient.types';

export class PatientController {
  private patientService: PatientService;
  private analysisService: AnalysisService;
  private treatmentService: TreatmentService;

  constructor() {
    this.patientService = new PatientService();
    this.analysisService = new AnalysisService();
    this.treatmentService = new TreatmentService();
  }

  /**
   * Get all patients with pagination and filtering
   */
  public getAllPatients = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, search, status, organizationId } = req.query;
      
      const result = await this.patientService.getAllPatients({
        page: Number(page),
        limit: Number(limit),
        search: search as string,
        status: status as string,
        organizationId: organizationId as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved all patients', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
      });

      res.status(200).json({
        success: true,
        data: result.patients,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve patients',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get patient by ID
   */
  public getPatientById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const patient = await this.patientService.getPatientById(id, req.user!);

      logUtils.logInfo('Retrieved patient by ID', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: patient
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve patient',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Create new patient
   */
  public createPatient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const patientData: PatientCreateRequest = req.body;
      const patient = await this.patientService.createPatient(patientData, req.user!);

      logUtils.logInfo('Created new patient', {
        userId: req.user!.id,
        patientId: patient.id
      });

      res.status(201).json({
        success: true,
        data: patient,
        message: 'Patient created successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        patientData: req.body
      });
      
      if ((error as Error).message.includes('already exists')) {
        res.status(409).json({
          success: false,
          message: 'Patient already exists'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create patient',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Update patient information
   */
  public updatePatient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData: PatientUpdateRequest = req.body;
      
      const patient = await this.patientService.updatePatient(id, updateData, req.user!);

      logUtils.logInfo('Updated patient', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: patient,
        message: 'Patient updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update patient',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Delete patient (soft delete)
   */
  public deletePatient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.patientService.deletePatient(id, req.user!);

      logUtils.logInfo('Deleted patient', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        message: 'Patient deleted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete patient',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's complete medical history
   */
  public getMedicalHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medicalHistory = await this.patientService.getMedicalHistory(id, req.user!);

      logUtils.logInfo('Retrieved medical history', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: medicalHistory
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve medical history',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add medical data to patient record
   */
  public addMedicalData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medicalData: MedicalData = req.body;
      
      const result = await this.patientService.addMedicalData(id, medicalData, req.user!);

      logUtils.logInfo('Added medical data', {
        userId: req.user!.id,
        patientId: id,
        dataType: medicalData.type
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Medical data added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add medical data',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's vital signs history
   */
  public getVitalSigns = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.patientService.getVitalSigns(id, {
        page: Number(page),
        limit: Number(limit)
      }, req.user!);

      logUtils.logInfo('Retrieved vital signs', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: result.vitalSigns,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve vital signs',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add vital signs to patient record
   */
  public addVitalSigns = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const vitalSigns: VitalSigns = req.body;
      
      const result = await this.patientService.addVitalSigns(id, vitalSigns, req.user!);

      logUtils.logInfo('Added vital signs', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Vital signs added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add vital signs',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's lab results
   */
  public getLabResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.patientService.getLabResults(id, {
        page: Number(page),
        limit: Number(limit)
      }, req.user!);

      logUtils.logInfo('Retrieved lab results', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: result.labResults,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve lab results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add lab results to patient record
   */
  public addLabResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const labResults: LabResults = req.body;
      
      const result = await this.patientService.addLabResults(id, labResults, req.user!);

      logUtils.logInfo('Added lab results', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Lab results added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add lab results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's current medications
   */
  public getMedications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medications = await this.patientService.getMedications(id, req.user!);

      logUtils.logInfo('Retrieved medications', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: medications
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve medications',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add medication to patient record
   */
  public addMedication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const medication: Medication = req.body;
      
      const result = await this.patientService.addMedication(id, medication, req.user!);

      logUtils.logInfo('Added medication', {
        userId: req.user!.id,
        patientId: id,
        medicationName: medication.name
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Medication added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add medication',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Update patient medication
   */
  public updateMedication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id, medicationId } = req.params;
      const updateData = req.body;
      
      const result = await this.patientService.updateMedication(id, medicationId, updateData, req.user!);

      logUtils.logInfo('Updated medication', {
        userId: req.user!.id,
        patientId: id,
        medicationId
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Medication updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id,
        medicationId: req.params.medicationId
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else if ((error as Error).message === 'Medication not found') {
        res.status(404).json({
          success: false,
          message: 'Medication not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update medication',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Discontinue patient medication
   */
  public discontinueMedication = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id, medicationId } = req.params;
      const { reason, date } = req.body;
      
      const result = await this.patientService.discontinueMedication(id, medicationId, {
        reason,
        date: date || new Date()
      }, req.user!);

      logUtils.logInfo('Discontinued medication', {
        userId: req.user!.id,
        patientId: id,
        medicationId,
        reason
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Medication discontinued successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id,
        medicationId: req.params.medicationId
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else if ((error as Error).message === 'Medication not found') {
        res.status(404).json({
          success: false,
          message: 'Medication not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to discontinue medication',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's medical conditions
   */
  public getConditions = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const conditions = await this.patientService.getConditions(id, req.user!);

      logUtils.logInfo('Retrieved conditions', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: conditions
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve conditions',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add medical condition to patient record
   */
  public addCondition = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const condition: Condition = req.body;
      
      const result = await this.patientService.addCondition(id, condition, req.user!);

      logUtils.logInfo('Added condition', {
        userId: req.user!.id,
        patientId: id,
        conditionName: condition.name
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Condition added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add condition',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's allergies
   */
  public getAllergies = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const allergies = await this.patientService.getAllergies(id, req.user!);

      logUtils.logInfo('Retrieved allergies', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: allergies
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve allergies',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add allergy to patient record
   */
  public addAllergy = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const allergy: Allergy = req.body;
      
      const result = await this.patientService.addAllergy(id, allergy, req.user!);

      logUtils.logInfo('Added allergy', {
        userId: req.user!.id,
        patientId: id,
        allergyName: allergy.name
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Allergy added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add allergy',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's lifestyle information
   */
  public getLifestyle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const lifestyle = await this.patientService.getLifestyle(id, req.user!);

      logUtils.logInfo('Retrieved lifestyle', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: lifestyle
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve lifestyle',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add or update patient's lifestyle information
   */
  public addLifestyle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const lifestyle: Lifestyle = req.body;
      
      const result = await this.patientService.addLifestyle(id, lifestyle, req.user!);

      logUtils.logInfo('Added/updated lifestyle', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Lifestyle information updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update lifestyle',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's family medical history
   */
  public getFamilyHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const familyHistory = await this.patientService.getFamilyHistory(id, req.user!);

      logUtils.logInfo('Retrieved family history', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: familyHistory
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve family history',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add family history to patient record
   */
  public addFamilyHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const familyHistory: FamilyHistory = req.body;
      
      const result = await this.patientService.addFamilyHistory(id, familyHistory, req.user!);

      logUtils.logInfo('Added family history', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Family history added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add family history',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's social determinants of health
   */
  public getSocialDeterminants = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const socialDeterminants = await this.patientService.getSocialDeterminants(id, req.user!);

      logUtils.logInfo('Retrieved social determinants', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: socialDeterminants
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve social determinants',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add social determinants to patient record
   */
  public addSocialDeterminants = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const socialDeterminants: SocialDeterminants = req.body;
      
      const result = await this.patientService.addSocialDeterminants(id, socialDeterminants, req.user!);

      logUtils.logInfo('Added social determinants', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Social determinants added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add social determinants',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's cultural context and preferences
   */
  public getCulturalContext = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const culturalContext = await this.patientService.getCulturalContext(id, req.user!);

      logUtils.logInfo('Retrieved cultural context', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: culturalContext
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve cultural context',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add cultural context to patient record
   */
  public addCulturalContext = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const culturalContext: CulturalContext = req.body;
      
      const result = await this.patientService.addCulturalContext(id, culturalContext, req.user!);

      logUtils.logInfo('Added cultural context', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Cultural context added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add cultural context',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's consent records
   */
  public getConsentRecords = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const consentRecords = await this.patientService.getConsentRecords(id, req.user!);

      logUtils.logInfo('Retrieved consent records', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: consentRecords
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve consent records',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add consent record for patient
   */
  public addConsentRecord = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const consentRecord: ConsentRecord = req.body;
      
      const result = await this.patientService.addConsentRecord(id, consentRecord, req.user!);

      logUtils.logInfo('Added consent record', {
        userId: req.user!.id,
        patientId: id,
        consentType: consentRecord.type
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Consent record added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add consent record',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's analysis history
   */
  public getAnalysisHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.analysisService.getAnalysesByPatient(id, {
        page: Number(page),
        limit: Number(limit)
      }, req.user!);

      logUtils.logInfo('Retrieved analysis history', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: result.analyses,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve analysis history',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get patient's treatment history
   */
  public getTreatmentHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.treatmentService.getTreatmentPlansByPatient(id, {
        page: Number(page),
        limit: Number(limit)
      }, req.user!);

      logUtils.logInfo('Retrieved treatment history', {
        userId: req.user!.id,
        patientId: id
      });

      res.status(200).json({
        success: true,
        data: result.treatments,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve treatment history',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Search patients by various criteria
   */
  public searchPatients = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        query, 
        status, 
        ageRange, 
        gender, 
        organizationId 
      } = req.query;
      
      const result = await this.patientService.searchPatients({
        page: Number(page),
        limit: Number(limit),
        query: query as string,
        status: status as string,
        ageRange: ageRange as string,
        gender: gender as string,
        organizationId: organizationId as string,
        user: req.user!
      });

      logUtils.logInfo('Searched patients', {
        userId: req.user!.id,
        query,
        totalResults: result.total
      });

      res.status(200).json({
        success: true,
        data: result.patients,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          pages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        searchQuery: req.query
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to search patients',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Export patient data (PDF/CSV)
   */
  public exportPatientData = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { format = 'pdf' } = req.query;
      
      const exportData = await this.patientService.exportPatientData(id, format as string, req.user!);

      logUtils.logInfo('Exported patient data', {
        userId: req.user!.id,
        patientId: id,
        format
      });

      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="patient-${id}.${format}"`);
      res.status(200).send(exportData);
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        patientId: req.params.id 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to export patient data',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };
} 