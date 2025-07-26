/**
 * Communication Types
 * 
 * Type definitions for communication-related functionality
 */

import { PatientProfile } from './index';

/**
 * Communication Channel
 */
export type CommunicationChannel = 
  | 'email' 
  | 'sms' 
  | 'push' 
  | 'in_app' 
  | 'voice' 
  | 'video' 
  | 'chat' 
  | 'letter' 
  | 'in_person';

/**
 * Message Priority
 */
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Message Status
 */
export type MessageStatus = 
  | 'draft' 
  | 'sending' 
  | 'sent' 
  | 'delivered' 
  | 'read' 
  | 'failed' 
  | 'cancelled';

/**
 * Message Type
 */
export type MessageType = 
  | 'appointment_reminder'
  | 'medication_reminder'
  | 'test_result'
  | 'educational'
  | 'alert'
  | 'follow_up'
  | 'billing'
  | 'general';

/**
 * Message
 */
export interface Message {
  id: string;
  patientId: string;
  type: MessageType;
  channel: CommunicationChannel;
  priority: MessagePriority;
  status: MessageStatus;
  
  subject: string;
  content: string;
  richContent?: any; // For HTML/rich content
  
  scheduledAt?: string;
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  
  from: {
    id: string;
    name: string;
    type: 'system' | 'provider' | 'care_team' | 'patient' | 'family' | 'other';
  };
  
  to: Array<{
    id: string;
    name: string;
    type: 'patient' | 'caregiver' | 'provider' | 'care_team' | 'family' | 'other';
    channel: CommunicationChannel;
    address: string; // email, phone number, etc.
    status: MessageStatus;
    error?: string;
  }>;
  
  metadata?: {
    relatedTo?: {
      type: 'appointment' | 'medication' | 'test' | 'treatment' | 'billing' | 'other';
      id: string;
    };
    tags?: string[];
    attachments?: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
    }>;
    customData?: Record<string, any>;
  };
  
  createdAt: string;
  updatedAt: string;
}

/**
 * Communication Preference
 */
export interface CommunicationPreference {
  patientId: string;
  
  // Channel preferences
  channels: Array<{
    type: CommunicationChannel;
    enabled: boolean;
    priority: number; // Lower number = higher priority
    value: string; // email address, phone number, etc.
    verified: boolean;
    verificationSentAt?: string;
    verifiedAt?: string;
  }>;
  
  // Notification preferences
  notifications: {
    appointmentReminders: {
      enabled: boolean;
      advanceNotice: number; // in hours
      channels: CommunicationChannel[];
    };
    medicationReminders: {
      enabled: boolean;
      channels: CommunicationChannel[];
    };
    testResults: {
      enabled: boolean;
      channels: CommunicationChannel[];
    };
    billing: {
      enabled: boolean;
      channels: CommunicationChannel[];
    };
    general: {
      enabled: boolean;
      channels: CommunicationChannel[];
    };
  };
  
  // Quiet hours
  quietHours: {
    enabled: boolean;
    startTime: string; // "22:00"
    endTime: string;   // "08:00"
    days: number[];    // 0-6 (Sunday-Saturday)
    exceptions: Array<{
      start: string;   // ISO date string
      end: string;     // ISO date string
      reason: string;
    }>;
  };
  
  // Language preferences
  language: {
    preferred: string; // ISO 639-1 code
    fallback?: string;
    interpreterRequired: boolean;
    interpreterLanguage?: string;
  };
  
  // Accessibility preferences
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    screenReader: boolean;
    alternativeFormats: string[]; // 'braille', 'audio', etc.
  };
  
  // Emergency contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
    notes?: string;
  };
  
  // Consent
  consent: {
    marketing: boolean;
    research: boolean;
    thirdParty: boolean;
    updatedAt: string;
    updatedBy: string;
  };
  
  // Metadata
  metadata?: {
    lastUpdatedBy?: string;
    syncStatus?: 'pending' | 'synced' | 'error';
    syncError?: string;
    customFields?: Record<string, any>;
  };
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}
