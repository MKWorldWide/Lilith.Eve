/**
 * 🧬 Patient Type Definitions
 * 
 * Core patient data structures and interfaces for Lilith.Eve
 */

export interface PatientProfile {
  id: string;
  demographics: Demographics;
  medicalHistory: MedicalHistory;
  culturalContext: CulturalContext;
  consentSettings: ConsentSettings;
  preferences?: PatientPreferences;
  emergencyContacts?: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
}

export interface Demographics {
  age: number;
  gender: 'male' | 'female' | 'non_binary' | 'prefer_not_to_say';
  ethnicity: string[];
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  occupation?: string;
  educationLevel: 'elementary' | 'high_school' | 'college' | 'graduate' | 'post_graduate';
  primaryLanguage: string;
  languages: string[];
}

export interface MedicalHistory {
  conditions: string[];
  medications: Medication[];
  allergies: Allergy[];
  surgeries: Surgery[];
  familyHistory: FamilyHistory;
  lifestyle: LifestyleFactors;
  mentalHealth: MentalHealthHistory;
  reproductiveHealth?: ReproductiveHealth;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  reason: string;
  sideEffects?: string[];
}

export interface Allergy {
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
  onsetDate: string;
}

export interface Surgery {
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  complications?: string[];
}

export interface FamilyHistory {
  conditions: {
    condition: string;
    relatives: string[];
    ageOfOnset?: number;
  }[];
}

export interface LifestyleFactors {
  exercise: {
    frequency: string;
    type: string[];
    duration: number;
  };
  diet: {
    type: string;
    restrictions: string[];
    supplements: string[];
  };
  sleep: {
    averageHours: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    issues: string[];
  };
  stress: {
    level: 'low' | 'moderate' | 'high';
    sources: string[];
    copingMechanisms: string[];
  };
  substanceUse: {
    alcohol: 'none' | 'occasional' | 'moderate' | 'heavy';
    tobacco: 'none' | 'former' | 'current';
    other: string[];
  };
}

export interface MentalHealthHistory {
  conditions: string[];
  treatments: string[];
  therapists: string[];
  hospitalizations: string[];
  currentSymptoms: string[];
  copingStrategies: string[];
}

export interface ReproductiveHealth {
  pregnancyHistory: Pregnancy[];
  menstrualCycle?: {
    regularity: 'regular' | 'irregular';
    cycleLength: number;
    symptoms: string[];
  };
  contraception?: string[];
}

export interface Pregnancy {
  outcome: 'live_birth' | 'miscarriage' | 'termination' | 'current';
  year: number;
  complications?: string[];
}

export interface CulturalContext {
  religion: string;
  spiritualPractices: string[];
  traditionalPractices: string[];
  culturalBeliefs: CulturalBelief[];
  communicationPreference: 'compassionate' | 'clinical' | 'cultural' | 'educational';
  familyDynamics: FamilyDynamics;
  communitySupport: CommunitySupport;
  healingTraditions: HealingTradition[];
}

export interface CulturalBelief {
  category: 'health' | 'illness' | 'healing' | 'death' | 'family' | 'community';
  belief: string;
  influence: 'strong' | 'moderate' | 'weak';
  impact: 'positive' | 'neutral' | 'negative';
}

export interface FamilyDynamics {
  structure: 'nuclear' | 'extended' | 'single_parent' | 'blended' | 'other';
  supportLevel: 'high' | 'moderate' | 'low';
  decisionMaking: 'individual' | 'family' | 'community' | 'hierarchical';
  involvement: 'active' | 'moderate' | 'minimal';
  culturalRoles: string[];
}

export interface CommunitySupport {
  type: 'religious' | 'cultural' | 'social' | 'professional' | 'online';
  availability: 'high' | 'moderate' | 'low';
  accessibility: 'easy' | 'moderate' | 'difficult';
  quality: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface HealingTradition {
  tradition: string;
  practices: string[];
  practitioners: string[];
  accessibility: 'high' | 'moderate' | 'low';
  culturalRelevance: 'high' | 'moderate' | 'low';
}

export interface ConsentSettings {
  medicalAnalysis: boolean;
  dataProcessing: boolean;
  treatmentPlanning: boolean;
  biometricAccess: boolean;
  socialMediaAccess: boolean;
  holisticTherapies: boolean;
  dataSharing: 'none' | 'minimal' | 'moderate' | 'full';
  researchParticipation: boolean;
  emergencyAccess: boolean;
  familyInvolvement: boolean;
  thirdPartySharing: boolean;
  dataRetention: '30_days' | '1_year' | '5_years' | 'indefinite';
  rightToDeletion: boolean;
  auditTrail: boolean;
}

export interface PatientPreferences {
  communicationStyle: 'compassionate' | 'clinical' | 'cultural' | 'educational';
  treatmentModality: 'conventional_first' | 'holistic_first' | 'integrated';
  intensity: 'gentle' | 'moderate' | 'intensive';
  familyInvolvement: boolean;
  culturalAlignment: boolean;
  privacyLevel: 'high' | 'moderate' | 'low';
  notificationPreferences: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  types: {
    appointmentReminders: boolean;
    medicationReminders: boolean;
    progressUpdates: boolean;
    emergencyAlerts: boolean;
    culturalEvents: boolean;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  accessLevel: 'full' | 'limited' | 'emergency_only';
} 