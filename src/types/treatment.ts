/**
 * Treatment Types
 * 
 * Type definitions for treatment planning and management
 */

import { PatientProfile } from './index';

/**
 * Treatment Plan
 */
export interface TreatmentPlan {
  id: string;
  patientId: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  goals: TreatmentGoal[];
  interventions: TreatmentIntervention[];
  schedule: TreatmentSchedule;
  monitoring: TreatmentMonitoring;
  culturalConsiderations: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Treatment Goal
 */
export interface TreatmentGoal {
  id: string;
  description: string;
  category: 'physical' | 'mental' | 'emotional' | 'spiritual' | 'social' | 'other';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetDate?: string;
  metrics: {
    type: string;
    current: number | string;
    target: number | string;
    unit: string;
  }[];
  status: 'not_started' | 'in_progress' | 'achieved' | 'partially_achieved' | 'abandoned';
  notes: string[];
}

/**
 * Treatment Intervention
 */
export interface TreatmentIntervention {
  id: string;
  name: string;
  type: 'medication' | 'therapy' | 'lifestyle' | 'procedure' | 'other';
  description: string;
  instructions: string;
  frequency: string;
  duration: string;
  provider?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  effectiveness?: number; // 1-10
  sideEffects?: TreatmentSideEffect[];
  notes: string[];
}

/**
 * Treatment Side Effect
 */
export interface TreatmentSideEffect {
  type: string;
  severity: 'mild' | 'moderate' | 'severe';
  onset: string;
  duration: string;
  actionTaken: string;
  resolved: boolean;
  resolutionDate?: string;
}

/**
 * Treatment Schedule
 */
export interface TreatmentSchedule {
  interventions: {
    interventionId: string;
    timing: string;
    frequency: string;
    daysOfWeek: number[];
    specificDates?: string[];
    excludedDates?: string[];
    notes?: string;
  }[];
  followUps: {
    type: string;
    frequency: string;
    nextAppointment?: string;
    provider?: string;
    purpose: string;
  }[];
}

/**
 * Treatment Monitoring
 */
export interface TreatmentMonitoring {
  vitalSigns: {
    type: string;
    frequency: string;
    targetRange: string;
    instructions: string;
  }[];
  symptoms: {
    symptom: string;
    trackingFrequency: string;
    severityScale: string;
  }[];
  labTests: {
    test: string;
    frequency: string;
    purpose: string;
  }[];
  patientReportedOutcomes: {
    measure: string;
    frequency: string;
    method: string;
  }[];
  emergencyContacts: {
    name: string;
    relationship: string;
    phone: string;
    notes?: string;
  }[];
}

/**
 * Treatment Response
 */
export interface TreatmentResponse {
  success: boolean;
  treatmentPlan: TreatmentPlan;
  message?: string;
  warnings?: string[];
  nextSteps?: string[];
}
