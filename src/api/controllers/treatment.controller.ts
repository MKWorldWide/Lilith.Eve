/**
 * @fileoverview Treatment Controller - Lilith.Eve Medical AI Oracle
 * 
 * This controller handles all treatment plan-related business logic including
 * treatment plan management, recommendations, and progress tracking.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response } from 'express';
import { TreatmentService } from '../../services/treatment.service';
import { logger, logUtils } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';

export class TreatmentController {
  private treatmentService: TreatmentService;

  constructor() {
    this.treatmentService = new TreatmentService();
  }

  /**
   * Create a new treatment plan
   */
  public createTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const treatmentPlanData = req.body;
      const treatmentPlan = await this.treatmentService.createTreatmentPlan(treatmentPlanData, req.user!);

      logUtils.logInfo('Created new treatment plan', {
        userId: req.user!.id,
        patientId: treatmentPlanData.patientId,
        treatmentPlanId: treatmentPlan.id
      });

      res.status(201).json({
        success: true,
        data: treatmentPlan,
        message: 'Treatment plan created successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        treatmentPlanData: req.body
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to create treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment plan by ID
   */
  public getTreatmentPlanById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const treatmentPlan = await this.treatmentService.getTreatmentPlanById(id, req.user!);

      logUtils.logInfo('Retrieved treatment plan by ID', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: treatmentPlan
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get all treatment plans with pagination and filtering
   */
  public getAllTreatmentPlans = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, status, patientId, doctorId } = req.query;
      
      const result = await this.treatmentService.getAllTreatmentPlans({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        patientId: patientId as string,
        doctorId: doctorId as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved all treatment plans', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
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
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve treatment plans',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Update treatment plan
   */
  public updateTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const treatmentPlan = await this.treatmentService.updateTreatmentPlan(id, updateData, req.user!);

      logUtils.logInfo('Updated treatment plan', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: treatmentPlan,
        message: 'Treatment plan updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Delete treatment plan (soft delete)
   */
  public deleteTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.treatmentService.deleteTreatmentPlan(id, req.user!);

      logUtils.logInfo('Deleted treatment plan', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        message: 'Treatment plan deleted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get all treatment plans for a specific patient
   */
  public getTreatmentPlansByPatient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { patientId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.treatmentService.getTreatmentPlansByPatient(patientId, {
        page: Number(page),
        limit: Number(limit)
      }, req.user!);

      logUtils.logInfo('Retrieved treatment plans by patient', {
        userId: req.user!.id,
        patientId,
        totalCount: result.total
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
        patientId: req.params.patientId 
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve patient treatment plans',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Approve treatment plan
   */
  public approveTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const approvalData = req.body;
      
      const result = await this.treatmentService.approveTreatmentPlan(id, approvalData, req.user!);

      logUtils.logInfo('Approved treatment plan', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment plan approved successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to approve treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Reject treatment plan
   */
  public rejectTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const rejectionData = req.body;
      
      const result = await this.treatmentService.rejectTreatmentPlan(id, rejectionData, req.user!);

      logUtils.logInfo('Rejected treatment plan', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment plan rejected'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to reject treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Start treatment plan execution
   */
  public startTreatment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const startData = req.body;
      
      const result = await this.treatmentService.startTreatment(id, startData, req.user!);

      logUtils.logInfo('Started treatment', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment started successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to start treatment',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Pause treatment plan execution
   */
  public pauseTreatment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const pauseData = req.body;
      
      const result = await this.treatmentService.pauseTreatment(id, pauseData, req.user!);

      logUtils.logInfo('Paused treatment', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment paused successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to pause treatment',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Resume treatment plan execution
   */
  public resumeTreatment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const resumeData = req.body;
      
      const result = await this.treatmentService.resumeTreatment(id, resumeData, req.user!);

      logUtils.logInfo('Resumed treatment', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment resumed successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to resume treatment',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Complete treatment plan
   */
  public completeTreatment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const completionData = req.body;
      
      const result = await this.treatmentService.completeTreatment(id, completionData, req.user!);

      logUtils.logInfo('Completed treatment', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment completed successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to complete treatment',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment progress and milestones
   */
  public getTreatmentProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const progress = await this.treatmentService.getTreatmentProgress(id, req.user!);

      logUtils.logInfo('Retrieved treatment progress', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve treatment progress',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Update treatment progress
   */
  public updateTreatmentProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const progressData = req.body;
      
      const result = await this.treatmentService.updateTreatmentProgress(id, progressData, req.user!);

      logUtils.logInfo('Updated treatment progress', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment progress updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update treatment progress',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment recommendations
   */
  public getTreatmentRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const recommendations = await this.treatmentService.getTreatmentRecommendations(id, req.user!);

      logUtils.logInfo('Retrieved treatment recommendations', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: recommendations
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve treatment recommendations',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add treatment recommendation
   */
  public addTreatmentRecommendation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const recommendation = req.body;
      
      const result = await this.treatmentService.addTreatmentRecommendation(id, recommendation, req.user!);

      logUtils.logInfo('Added treatment recommendation', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Treatment recommendation added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add treatment recommendation',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Update treatment recommendation
   */
  public updateTreatmentRecommendation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id, recommendationId } = req.params;
      const updateData = req.body;
      
      const result = await this.treatmentService.updateTreatmentRecommendation(id, recommendationId, updateData, req.user!);

      logUtils.logInfo('Updated treatment recommendation', {
        userId: req.user!.id,
        treatmentPlanId: id,
        recommendationId
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment recommendation updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id,
        recommendationId: req.params.recommendationId
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else if ((error as Error).message === 'Recommendation not found') {
        res.status(404).json({
          success: false,
          message: 'Recommendation not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update treatment recommendation',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Remove treatment recommendation
   */
  public removeTreatmentRecommendation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id, recommendationId } = req.params;
      await this.treatmentService.removeTreatmentRecommendation(id, recommendationId, req.user!);

      logUtils.logInfo('Removed treatment recommendation', {
        userId: req.user!.id,
        treatmentPlanId: id,
        recommendationId
      });

      res.status(200).json({
        success: true,
        message: 'Treatment recommendation removed successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id,
        recommendationId: req.params.recommendationId
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else if ((error as Error).message === 'Recommendation not found') {
        res.status(404).json({
          success: false,
          message: 'Recommendation not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to remove treatment recommendation',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get holistic treatment approach
   */
  public getHolisticApproach = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const holisticApproach = await this.treatmentService.getHolisticApproach(id, req.user!);

      logUtils.logInfo('Retrieved holistic approach', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: holisticApproach
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve holistic approach',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add holistic treatment approach
   */
  public addHolisticApproach = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const holisticData = req.body;
      
      const result = await this.treatmentService.addHolisticApproach(id, holisticData, req.user!);

      logUtils.logInfo('Added holistic approach', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Holistic approach added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add holistic approach',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment risk assessment
   */
  public getRiskAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const riskAssessment = await this.treatmentService.getRiskAssessment(id, req.user!);

      logUtils.logInfo('Retrieved risk assessment', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: riskAssessment
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve risk assessment',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Update treatment risk assessment
   */
  public updateRiskAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const riskData = req.body;
      
      const result = await this.treatmentService.updateRiskAssessment(id, riskData, req.user!);

      logUtils.logInfo('Updated risk assessment', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Risk assessment updated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update risk assessment',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get cultural considerations for treatment
   */
  public getCulturalConsiderations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const culturalConsiderations = await this.treatmentService.getCulturalConsiderations(id, req.user!);

      logUtils.logInfo('Retrieved cultural considerations', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: culturalConsiderations
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve cultural considerations',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Add cultural considerations to treatment
   */
  public addCulturalConsiderations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const culturalData = req.body;
      
      const result = await this.treatmentService.addCulturalConsiderations(id, culturalData, req.user!);

      logUtils.logInfo('Added cultural considerations', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Cultural considerations added successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to add cultural considerations',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment follow-up schedule
   */
  public getFollowUpSchedule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const followUpSchedule = await this.treatmentService.getFollowUpSchedule(id, req.user!);

      logUtils.logInfo('Retrieved follow-up schedule', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: followUpSchedule
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve follow-up schedule',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Schedule treatment follow-up
   */
  public scheduleFollowUp = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const followUpData = req.body;
      
      const result = await this.treatmentService.scheduleFollowUp(id, followUpData, req.user!);

      logUtils.logInfo('Scheduled follow-up', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Follow-up scheduled successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to schedule follow-up',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment outcomes and results
   */
  public getTreatmentOutcomes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const outcomes = await this.treatmentService.getTreatmentOutcomes(id, req.user!);

      logUtils.logInfo('Retrieved treatment outcomes', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: outcomes
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve treatment outcomes',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Record treatment outcomes
   */
  public recordTreatmentOutcomes = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const outcomesData = req.body;
      
      const result = await this.treatmentService.recordTreatmentOutcomes(id, outcomesData, req.user!);

      logUtils.logInfo('Recorded treatment outcomes', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Treatment outcomes recorded successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to record treatment outcomes',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment effectiveness statistics
   */
  public getEffectivenessStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await this.treatmentService.getEffectivenessStats({
        startDate: startDate as string,
        endDate: endDate as string
      });

      logUtils.logInfo('Retrieved effectiveness stats', {
        userId: req.user!.id,
        startDate,
        endDate
      });

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve effectiveness statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get treatment compliance statistics
   */
  public getComplianceStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await this.treatmentService.getComplianceStats({
        startDate: startDate as string,
        endDate: endDate as string
      });

      logUtils.logInfo('Retrieved compliance stats', {
        userId: req.user!.id,
        startDate,
        endDate
      });

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve compliance statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get treatment outcomes statistics
   */
  public getOutcomesStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await this.treatmentService.getOutcomesStats({
        startDate: startDate as string,
        endDate: endDate as string
      });

      logUtils.logInfo('Retrieved outcomes stats', {
        userId: req.user!.id,
        startDate,
        endDate
      });

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve outcomes statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Search treatment plans by various criteria
   */
  public searchTreatmentPlans = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        query, 
        status, 
        patientId, 
        doctorId,
        dateRange 
      } = req.query;
      
      const result = await this.treatmentService.searchTreatmentPlans({
        page: Number(page),
        limit: Number(limit),
        query: query as string,
        status: status as string,
        patientId: patientId as string,
        doctorId: doctorId as string,
        dateRange: dateRange as string,
        user: req.user!
      });

      logUtils.logInfo('Searched treatment plans', {
        userId: req.user!.id,
        query,
        totalResults: result.total
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
        searchQuery: req.query
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to search treatment plans',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Export treatment plan (PDF/CSV)
   */
  public exportTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { format = 'pdf' } = req.query;
      
      const exportData = await this.treatmentService.exportTreatmentPlan(id, format as string, req.user!);

      logUtils.logInfo('Exported treatment plan', {
        userId: req.user!.id,
        treatmentPlanId: id,
        format
      });

      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="treatment-plan-${id}.${format}"`);
      res.status(200).send(exportData);
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to export treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Validate treatment plan against guidelines
   */
  public validateTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validationResult = await this.treatmentService.validateTreatmentPlan(id, req.user!);

      logUtils.logInfo('Validated treatment plan', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: validationResult,
        message: 'Treatment plan validation completed'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to validate treatment plan',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get treatment plan audit trail
   */
  public getAuditTrail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const auditTrail = await this.treatmentService.getAuditTrail(id, req.user!);

      logUtils.logInfo('Retrieved treatment plan audit trail', {
        userId: req.user!.id,
        treatmentPlanId: id
      });

      res.status(200).json({
        success: true,
        data: auditTrail
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        treatmentPlanId: req.params.id 
      });
      
      if ((error as Error).message === 'Treatment plan not found') {
        res.status(404).json({
          success: false,
          message: 'Treatment plan not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve audit trail',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };
} 