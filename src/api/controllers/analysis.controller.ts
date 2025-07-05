/**
 * @fileoverview Analysis Controller - Lilith.Eve Medical AI Oracle
 * 
 * This controller handles all AI analysis-related business logic including
 * analysis requests, results management, and analysis history.
 * 
 * @author Lilith.Eve Development Team
 * @version 1.0.0
 * @since 2024-01-01
 */

import { Request, Response } from 'express';
import { AnalysisService } from '../../services/analysis.service';
import { logger, logUtils } from '../../utils/logger';
import { AuthenticatedRequest } from '../../types/auth.types';

export class AnalysisController {
  private analysisService: AnalysisService;

  constructor() {
    this.analysisService = new AnalysisService();
  }

  /**
   * Request a new AI analysis for a patient
   */
  public requestAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const analysisRequest = req.body;
      const result = await this.analysisService.requestAnalysis(analysisRequest, req.user!);

      logUtils.logInfo('Requested new analysis', {
        userId: req.user!.id,
        patientId: analysisRequest.patientId,
        analysisId: result.id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Analysis request submitted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        analysisRequest: req.body
      });
      
      if ((error as Error).message === 'Patient not found') {
        res.status(404).json({
          success: false,
          message: 'Patient not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to request analysis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get analysis result by ID
   */
  public getAnalysisById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const analysis = await this.analysisService.getAnalysisById(id, req.user!);

      logUtils.logInfo('Retrieved analysis by ID', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: analysis
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve analysis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get all analyses with pagination and filtering
   */
  public getAllAnalyses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20, status, patientId, module } = req.query;
      
      const result = await this.analysisService.getAllAnalyses({
        page: Number(page),
        limit: Number(limit),
        status: status as string,
        patientId: patientId as string,
        module: module as string,
        user: req.user!
      });

      logUtils.logInfo('Retrieved all analyses', {
        userId: req.user!.id,
        page,
        limit,
        totalCount: result.total
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
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analyses',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get all analyses for a specific patient
   */
  public getAnalysesByPatient = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { patientId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.analysisService.getAnalysesByPatient(patientId, {
        page: Number(page),
        limit: Number(limit)
      }, req.user!);

      logUtils.logInfo('Retrieved analyses by patient', {
        userId: req.user!.id,
        patientId,
        totalCount: result.total
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
          message: 'Failed to retrieve patient analyses',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get analysis processing status
   */
  public getAnalysisStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const status = await this.analysisService.getAnalysisStatus(id, req.user!);

      logUtils.logInfo('Retrieved analysis status', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve analysis status',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Cancel a running analysis
   */
  public cancelAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.analysisService.cancelAnalysis(id, req.user!);

      logUtils.logInfo('Cancelled analysis', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        message: 'Analysis cancelled successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else if ((error as Error).message === 'Analysis cannot be cancelled') {
        res.status(400).json({
          success: false,
          message: 'Analysis cannot be cancelled'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to cancel analysis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Retry a failed analysis
   */
  public retryAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.analysisService.retryAnalysis(id, req.user!);

      logUtils.logInfo('Retried analysis', {
        userId: req.user!.id,
        analysisId: id,
        newAnalysisId: result.id
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Analysis retry initiated successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else if ((error as Error).message === 'Analysis cannot be retried') {
        res.status(400).json({
          success: false,
          message: 'Analysis cannot be retried'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retry analysis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Delete analysis result
   */
  public deleteAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.analysisService.deleteAnalysis(id, req.user!);

      logUtils.logInfo('Deleted analysis', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        message: 'Analysis deleted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete analysis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get Cognition.AI analysis results
   */
  public getCognitionResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.analysisService.getCognitionResults(id, req.user!);

      logUtils.logInfo('Retrieved Cognition.AI results', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve Cognition.AI results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get BioSync.Reader analysis results
   */
  public getBioSyncResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.analysisService.getBioSyncResults(id, req.user!);

      logUtils.logInfo('Retrieved BioSync.Reader results', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve BioSync.Reader results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get Persona.Scanner analysis results
   */
  public getPersonaResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.analysisService.getPersonaResults(id, req.user!);

      logUtils.logInfo('Retrieved Persona.Scanner results', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve Persona.Scanner results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get SocialSynth analysis results
   */
  public getSocialResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.analysisService.getSocialResults(id, req.user!);

      logUtils.logInfo('Retrieved SocialSynth results', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve SocialSynth results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get LinguaCare analysis results
   */
  public getLinguaResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.analysisService.getLinguaResults(id, req.user!);

      logUtils.logInfo('Retrieved LinguaCare results', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve LinguaCare results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get Holistica analysis results
   */
  public getHolisticaResults = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const results = await this.analysisService.getHolisticaResults(id, req.user!);

      logUtils.logInfo('Retrieved Holistica results', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: results
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve Holistica results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get complete analysis synthesis
   */
  public getAnalysisSynthesis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const synthesis = await this.analysisService.getAnalysisSynthesis(id, req.user!);

      logUtils.logInfo('Retrieved analysis synthesis', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: synthesis
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve analysis synthesis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get generated treatment plan from analysis
   */
  public getTreatmentPlan = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const treatmentPlan = await this.analysisService.getTreatmentPlan(id, req.user!);

      logUtils.logInfo('Retrieved treatment plan from analysis', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: treatmentPlan
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else if ((error as Error).message === 'Treatment plan not found') {
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
   * Provide feedback on analysis results
   */
  public provideFeedback = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const feedback = req.body;
      
      const result = await this.analysisService.provideFeedback(id, feedback, req.user!);

      logUtils.logInfo('Provided analysis feedback', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: result,
        message: 'Feedback submitted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to submit feedback',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get analysis queue status
   */
  public getQueueStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const status = await this.analysisService.getQueueStatus();

      logUtils.logInfo('Retrieved analysis queue status', {
        userId: req.user!.id
      });

      res.status(200).json({
        success: true,
        data: status
      });
    } catch (error) {
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve queue status',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get pending analyses in queue
   */
  public getPendingAnalyses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.analysisService.getPendingAnalyses({
        page: Number(page),
        limit: Number(limit)
      });

      logUtils.logInfo('Retrieved pending analyses', {
        userId: req.user!.id,
        totalCount: result.total
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
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve pending analyses',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get failed analyses
   */
  public getFailedAnalyses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { page = 1, limit = 20 } = req.query;
      
      const result = await this.analysisService.getFailedAnalyses({
        page: Number(page),
        limit: Number(limit)
      });

      logUtils.logInfo('Retrieved failed analyses', {
        userId: req.user!.id,
        totalCount: result.total
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
      logUtils.logError(error as Error, { userId: req.user?.id });
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve failed analyses',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get daily analysis statistics
   */
  public getDailyStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await this.analysisService.getDailyStats({
        startDate: startDate as string,
        endDate: endDate as string
      });

      logUtils.logInfo('Retrieved daily analysis stats', {
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
        message: 'Failed to retrieve daily statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get analysis statistics by module
   */
  public getModuleStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await this.analysisService.getModuleStats({
        startDate: startDate as string,
        endDate: endDate as string
      });

      logUtils.logInfo('Retrieved module analysis stats', {
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
        message: 'Failed to retrieve module statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get analysis performance metrics
   */
  public getPerformanceStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      
      const stats = await this.analysisService.getPerformanceStats({
        startDate: startDate as string,
        endDate: endDate as string
      });

      logUtils.logInfo('Retrieved analysis performance stats', {
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
        message: 'Failed to retrieve performance statistics',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Export analysis results (PDF/CSV)
   */
  public exportAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { format = 'pdf' } = req.query;
      
      const exportData = await this.analysisService.exportAnalysis(id, format as string, req.user!);

      logUtils.logInfo('Exported analysis results', {
        userId: req.user!.id,
        analysisId: id,
        format
      });

      res.setHeader('Content-Type', format === 'pdf' ? 'application/pdf' : 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="analysis-${id}.${format}"`);
      res.status(200).send(exportData);
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to export analysis results',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Search analyses by various criteria
   */
  public searchAnalyses = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        query, 
        status, 
        patientId, 
        module,
        dateRange 
      } = req.query;
      
      const result = await this.analysisService.searchAnalyses({
        page: Number(page),
        limit: Number(limit),
        query: query as string,
        status: status as string,
        patientId: patientId as string,
        module: module as string,
        dateRange: dateRange as string,
        user: req.user!
      });

      logUtils.logInfo('Searched analyses', {
        userId: req.user!.id,
        query,
        totalResults: result.total
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
        searchQuery: req.query
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to search analyses',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Request batch analysis for multiple patients
   */
  public requestBatchAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const batchRequest = req.body;
      const result = await this.analysisService.requestBatchAnalysis(batchRequest, req.user!);

      logUtils.logInfo('Requested batch analysis', {
        userId: req.user!.id,
        batchId: result.batchId,
        patientCount: batchRequest.patientIds.length
      });

      res.status(201).json({
        success: true,
        data: result,
        message: 'Batch analysis request submitted successfully'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id,
        batchRequest: req.body
      });
      
      res.status(500).json({
        success: false,
        message: 'Failed to request batch analysis',
        error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
      });
    }
  };

  /**
   * Get batch analysis status and results
   */
  public getBatchAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { batchId } = req.params;
      const result = await this.analysisService.getBatchAnalysis(batchId, req.user!);

      logUtils.logInfo('Retrieved batch analysis', {
        userId: req.user!.id,
        batchId
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        batchId: req.params.batchId 
      });
      
      if ((error as Error).message === 'Batch analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Batch analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to retrieve batch analysis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Validate analysis results against medical guidelines
   */
  public validateAnalysis = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validationResult = await this.analysisService.validateAnalysis(id, req.user!);

      logUtils.logInfo('Validated analysis', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: validationResult,
        message: 'Analysis validation completed'
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to validate analysis',
          error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
      }
    }
  };

  /**
   * Get analysis audit trail
   */
  public getAuditTrail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const auditTrail = await this.analysisService.getAuditTrail(id, req.user!);

      logUtils.logInfo('Retrieved analysis audit trail', {
        userId: req.user!.id,
        analysisId: id
      });

      res.status(200).json({
        success: true,
        data: auditTrail
      });
    } catch (error) {
      logUtils.logError(error as Error, { 
        userId: req.user?.id, 
        analysisId: req.params.id 
      });
      
      if ((error as Error).message === 'Analysis not found') {
        res.status(404).json({
          success: false,
          message: 'Analysis not found'
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