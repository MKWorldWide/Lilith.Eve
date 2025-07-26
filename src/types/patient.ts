/**
 * 🧬 Patient Type Definitions
 * 
 * Core patient data structures and interfaces for Lilith.Eve
 */

// Import types from spiritual module
import {
  SpiritualProfile,
  TraumaProfile,
  SoulBlueprint,
  TraumaHistory,
  AncestralLineage,
  PastLifeMemory,
  SoulContract,
  KarmicPattern,
  HealingTraditions as SpiritualHealingTraditions
} from './spiritual';

// Re-export spiritual types for external use
export * from './spiritual';

/**
 * Healing Traditions
 * 
 * Extends the base HealingTraditions interface with additional patient-specific fields
 */
export interface PatientHealingTraditions extends Omit<SpiritualHealingTraditions, 'effectiveness'> {
  traditional: HealingTradition[];
  modern: HealingTradition[];
  spiritual: HealingTradition[];
  effectiveness: {
    tradition: string;
    effectiveness: number; // 1-10 scale
    sideEffects: string[];
    notes: string;
  }[];
}

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
  spiritualProfile?: SpiritualProfile;
  traumaProfile?: TraumaProfile;
  soulBlueprint?: SoulBlueprint;
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
  traumaHistory?: TraumaHistory;
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
  traumaResponses?: {
    type: 'fight' | 'flight' | 'freeze' | 'fawn';
    triggers: string[];
    somaticResponses: string[];
  }[];
  spiritualCrises?: {
    type: string;
    description: string;
    resolution: string;
  }[];
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
  healingTraditions: PatientHealingTraditions;
  ancestralLineage?: AncestralLineage;
  pastLifeMemories?: PastLifeMemory[];
  soulContracts?: SoulContract[];
  karmicPatterns?: KarmicPattern[];
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
  name: string;
  type: 'traditional' | 'modern' | 'spiritual' | 'alternative' | 'integrated';
  description: string;
  practices: string[];
  practitioners: string[];
  accessibility: 'high' | 'moderate' | 'low';
  culturalRelevance: 'high' | 'moderate' | 'low';
  evidenceBase: 'anecdotal' | 'emerging' | 'established' | 'well_established';
  certificationRequirements?: string[];
  potentialRisks?: string[];
  contraindications?: string[];
  resourceIntensity: 'low' | 'moderate' | 'high';
  cost: 'low' | 'moderate' | 'high';
  timeCommitment: string;
  culturalOrigins: string[];
  keyPrinciples?: string[];
  trainingRequired?: string;
  regulatoryStatus?: 'approved' | 'experimental' | 'alternative' | 'unregulated';
  insuranceCoverage?: 'none' | 'partial' | 'full';
  researchStatus?: 'limited' | 'growing' | 'extensive';
  integrationPotential: number; // 1-10 scale
  patientSatisfaction?: number; // 1-10 scale
  providerAvailability: 'rare' | 'limited' | 'available' | 'widespread';
  culturalAcceptance: 'controversial' | 'emerging' | 'accepted' | 'mainstream';
  safetyProfile: 'unknown' | 'low_risk' | 'moderate_risk' | 'high_risk';
  evidenceQuality: 'low' | 'moderate' | 'high';
  mechanismOfAction?: string;
  typicalDuration?: string;
  frequencyRecommendation?: string;
  selfAdministered: boolean;
  requiresSpecialist: boolean;
  complementaryTo: string[];
  conflictsWith?: string[];
  licensingRequirements?: string[];
  culturalAdaptations?: {
    culture: string;
    adaptation: string;
    effectiveness: number; // 1-10 scale
  }[];
  outcomeMeasures?: string[];
  successMetrics?: string[];
  trainingPrograms?: {
    name: string;
    duration: string;
    certification: string;
    accreditation?: string;
  }[];
  ethicalConsiderations?: string[];
  culturalSensitivity: 'low' | 'moderate' | 'high';
  accessibilityConsiderations?: string[];
  costEffectiveness?: 'low' | 'moderate' | 'high';
  scalability: 'low' | 'moderate' | 'high';
  sustainability: 'low' | 'moderate' | 'high';
  communityPerception: 'negative' | 'neutral' | 'positive';
  regulatoryBarriers?: string[];
  implementationChallenges?: string[];
  successStories?: {
    description: string;
    outcome: string;
    evidenceLevel: 'anecdotal' | 'case_study' | 'clinical_trial' | 'meta_analysis';
  }[];
  references?: {
    title: string;
    author: string;
    year: number;
    type: 'book' | 'journal' | 'study' | 'report' | 'website';
    url?: string;
  }[];
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