/**
 * Monitoring Types
 * 
 * Type definitions for patient monitoring and tracking
 */

import { PatientProfile } from './index';

/**
 * Monitoring Plan
 */
export interface MonitoringPlan {
  id: string;
  patientId: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  
  vitalSigns: VitalSignMonitoring[];
  symptoms: SymptomMonitoring[];
  medications: MedicationMonitoring[];
  activities: ActivityMonitoring[];
  
  alerts: AlertConfiguration[];
  notifications: NotificationPreference[];
  
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Vital Sign Monitoring
 */
export interface VitalSignMonitoring {
  id: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'respiratory_rate' | 'oxygen_saturation' | 'blood_glucose' | 'weight' | 'height' | 'bmi' | 'pain_scale' | 'other';
  customName?: string;
  frequency: string;
  timing: string[];
  targetRange: {
    min?: number;
    max?: number;
    unit: string;
  };
  instructions: string;
  device?: string;
  isRequired: boolean;
}

/**
 * Symptom Monitoring
 */
export interface SymptomMonitoring {
  id: string;
  name: string;
  description?: string;
  scale: {
    type: 'numeric' | 'likert' | 'visual_analog' | 'wong_baker' | 'custom';
    min?: number;
    max?: number;
    labels?: string[];
  };
  frequency: string;
  timing: string[];
  instructions: string;
  isRequired: boolean;
}

/**
 * Medication Monitoring
 */
export interface MedicationMonitoring {
  id: string;
  medicationId: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  instructions: string;
  adherenceTracking: boolean;
  sideEffectsMonitoring: boolean;
  isRequired: boolean;
}

/**
 * Activity Monitoring
 */
export interface ActivityMonitoring {
  id: string;
  type: 'steps' | 'exercise' | 'sleep' | 'nutrition' | 'mood' | 'custom';
  customName?: string;
  target: {
    value?: number;
    unit?: string;
    description?: string;
  };
  frequency: string;
  instructions: string;
  isRequired: boolean;
}

/**
 * Alert Configuration
 */
export interface AlertConfiguration {
  id: string;
  name: string;
  condition: {
    type: 'above' | 'below' | 'outside_range' | 'missing' | 'other';
    value?: any;
    minValue?: any;
    maxValue?: any;
    timeWindow?: string;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  actions: {
    type: 'notification' | 'email' | 'sms' | 'in_app' | 'escalation';
    recipient: string;
    message: string;
  }[];
  enabled: boolean;
}

/**
 * Notification Preference
 */
export interface NotificationPreference {
  type: 'email' | 'sms' | 'push' | 'in_app' | 'other';
  address: string;
  enabled: boolean;
  priority: 'low' | 'medium' | 'high';
  quietHours?: {
    enabled: boolean;
    startTime: string;
    endTime: string;
    days: number[];
  };
}

/**
 * Monitoring Data Point
 */
export interface MonitoringDataPoint {
  id: string;
  patientId: string;
  planId: string;
  type: 'vital_sign' | 'symptom' | 'medication' | 'activity' | 'other';
  metricId: string;
  value: any;
  unit?: string;
  timestamp: string;
  notes?: string;
  source: 'patient' | 'caregiver' | 'device' | 'provider' | 'other';
  confidence?: number; // 0-1
  tags?: string[];
  metadata?: Record<string, any>;
}

/**
 * Monitoring Alert
 */
export interface MonitoringAlert {
  id: string;
  patientId: string;
  planId: string;
  metricId: string;
  alertConfigId: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'acknowledged' | 'resolved' | 'dismissed';
  timestamp: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  relatedDataPoints: string[];
  actions: {
    type: string;
    status: 'pending' | 'in_progress' | 'completed' | 'failed';
    timestamp: string;
    details?: any;
  }[];
  notes: string[];
}
