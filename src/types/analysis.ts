/**
 * Analysis Types
 * 
 * Type definitions for analysis-related functionality
 */

import { PatientProfile, TreatmentPlan } from './index';

/**
 * Analysis Result
 */
export interface AnalysisResult {
  id: string;
  patientId: string;
  timestamp: string;
  insights: {
    primaryConcerns: string[];
    riskFactors: string[];
    opportunities: string[];
    culturalConsiderations: string[];
    recommendations: string[];
  };
  confidenceScore: number;
  metadata: {
    modelVersion: string;
    analysisDuration: number;
    dataSources: string[];
  };
}

/**
 * Analysis Request
 */
export interface AnalysisRequest {
  patientId: string;
  data: {
    type: 'text' | 'audio' | 'video' | 'biometric' | 'other';
    content: any;
    metadata?: Record<string, any>;
  }[];
  context?: {
    previousAnalysisId?: string;
    treatmentPlanId?: string;
    culturalContext?: any;
  };
}

/**
 * Analysis Status
 */
export interface AnalysisStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  estimatedCompletionTime?: string;
  results?: AnalysisResult;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

/**
 * Analysis Context
 */
export interface AnalysisContext {
  patient: PatientProfile;
  treatmentPlan?: TreatmentPlan;
  previousAnalyses?: AnalysisResult[];
  culturalContext?: any;
  preferences?: {
    analysisDepth?: 'brief' | 'standard' | 'comprehensive';
    language?: string;
    format?: 'technical' | 'layperson' | 'mixed';
  };
}

export * from './spiritual';
